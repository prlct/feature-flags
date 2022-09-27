import { includes, isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import sha1 from 'crypto-js/sha1';
import type { UserData } from './types';
import { FlatFeature, TargetingRuleOperator } from 'resources/feature';

export const calculateRemainderByUserData = (email: string) => {
  const hash = sha1(email).toString();
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
    users, 
    usersPercentage,
    targetingRules,
  } = feature;

  if (!enabled) {
    return false;
  }

  if (enabledForEveryone) {
    return true;
  }

  if (user?.email) {
    const isFeatureEnabledForEmail = includes(users, user.email);

    if (isFeatureEnabledForEmail) {
      return true;
    }

    if (targetingRules) {
      for (const rule of targetingRules) {
        const { attribute, operator, value } = rule;
        
        if (!isEmpty(attribute) && !isEmpty(value)) {
          if (operator === TargetingRuleOperator.EQUALS && user?.data?.[attribute] === value) {
            return true;
          }
          
          if (operator === TargetingRuleOperator.INCLUDES 
            && Array.isArray(value) 
            && value.includes(user?.data?.[attribute])){
            return true;
          }
        }
      }
    }

    if (usersPercentage > 0) {
      const remainder = calculateRemainderByUserData(user.email);
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