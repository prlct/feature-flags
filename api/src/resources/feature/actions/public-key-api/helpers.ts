import _ from 'lodash';
import BigNumber from 'bignumber.js';
import sha1 from 'crypto-js/sha1';
import type { UserData } from './types';
import { ABVariant, FlatFeature, TargetingRuleOperator } from 'resources/feature';

export const calculateRemainderByUserData = (id: string) => {
  const hash = sha1(id).toString();
  const decimal = new BigNumber(hash, 16);
  return decimal.modulo(100).toNumber();
};

const calculateFlagForUser = async (
  feature: FlatFeature,
  user: UserData | null,
): Promise<boolean> => {
  const {
    enabled,
    enabledForEveryone,
    usersPercentage,
    targetingRules,
    tests,
  } = feature;

  if (!enabled) {
    return false;
  }

  if (enabledForEveryone) {
    return true;
  }

  if (user) {
    if (targetingRules) {
      for (const rule of targetingRules) {
        const { attribute, operator, value } = rule;

        if (!_.isEmpty(attribute) && !_.isEmpty(value)) {
          if (operator === TargetingRuleOperator.EQUALS && user?.data?.[attribute] === value) {
            return true;
          }

          if (operator === TargetingRuleOperator.INCLUDES
            && Array.isArray(value)
            && value.includes(user?.data?.[attribute])) {
            return true;
          }
        }
      }
    }

    const externalId = user.externalId || user.email;

    if (usersPercentage > 0 && externalId) {
      const remainder = calculateRemainderByUserData(externalId);
      if (remainder < usersPercentage) {
        return true;
      }
    }
  }

  return false;
};

export const calculateFlagsForUser = async (
  features: FlatFeature[],
  user: UserData | null,
) => {
  const flags: { [key: string]: boolean } = {};
  for (const feature of features) {
    const { name } = feature;

    flags[name] = await calculateFlagForUser(feature, user);
  }

  return flags;
};

export const featuresToConfigsForUser = (features: FlatFeature[], variants: { [name: string]: ABVariant } = {}) => {
  const configs: { [key: string]: string } = {};
  for (const feature of features) {
    const { name } = feature;
    if (variants[name]) {
      configs[name] = variants[name].remoteConfig;
    } else {
      configs[name] = feature.remoteConfig;
    }
  }

  return configs;
};

export const mongoIdToNumber = (id: string) => {
  const incPart = id.substring(18);

  const number = parseInt(incPart, 16);

  return number;
};

export const numberToBucketIndex = (totalBuckets: number, targetNumber: number) => {
  const percentageNumber = targetNumber % 100;

  const buckets = _.chunk(
    new Array(100).fill(null).map((n, i) => i),
    Math.floor(100 / totalBuckets),
  );

  return _.findIndex(buckets, (bucket) => bucket.includes(percentageNumber));
};

export const calculateABTestForUser = (tests: ABVariant[], userId: string) => {
  const number = mongoIdToNumber(userId);
  const bucketNumber = numberToBucketIndex(tests.length, number);

  return tests[bucketNumber];
};

export const calculateABTestsForUser = (userId: string, features: FlatFeature[]) => {
  if (!userId) {
    return {};
  }

  const variants: { [key: string]: { name: string, remoteConfig: string } } = {};
  for (const feature of features) {
    const { name, tests } = feature;
    variants[name] = calculateABTestForUser(tests, userId);
  }

  return variants;
};
