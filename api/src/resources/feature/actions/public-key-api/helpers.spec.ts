import * as helpers from './helpers';
import type { UserData } from './types';
import type { FlatFeature } from '../../feature.types';
import { TargetingRuleOperator } from '../../feature.types';
import { Env } from 'resources/application';

const USER_TEST_EMAIL = 'test@email.com';
const USER_TEST_EMAIL_1 = 'test1@email.com';

const featureDisabledForEveryone: FlatFeature =  {
  _id: '1',
  name: 'test1',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-09-13T09:58:19.863Z'),
  updatedOn: new Date('2022-09-14T10:39:01.469Z'),
  enabled: false,
  enabledForEveryone: false,
  users: [],
  usersPercentage: 0,
  usersViewedCount: 0,
  tests: [],
  visibilityChangedOn: new Date('2022-09-14T10:39:01.455Z'),
  env: Env.DEVELOPMENT,
};
const featureEnabledForEveryone: FlatFeature =  {
  _id: '2',
  name: 'test2',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-08-31T13:37:50.890Z'),
  updatedOn: new Date('2022-09-14T10:41:19.706Z'),
  enabled: true,
  enabledForEveryone: true,
  users: [],
  usersPercentage: 0,
  tests: [],
  usersViewedCount: 1,
  visibilityChangedOn: new Date('2022-09-14T10:41:02.746Z'),
  env: Env.DEVELOPMENT,
};
const featureEnabledForEmail: FlatFeature = {
  _id: '3',
  name: 'test3',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-08-31T13:37:50.890Z'),
  updatedOn: new Date('2022-09-14T10:41:19.706Z'),
  enabled: true,
  enabledForEveryone: false,
  users: [USER_TEST_EMAIL],
  usersPercentage: 0,
  tests: [],
  usersViewedCount: 1,
  visibilityChangedOn: new Date('2022-09-14T10:41:02.746Z'),
  env: Env.DEVELOPMENT,
};
const featureEnabledForPercentOfUsers: FlatFeature = {
  _id: '4',
  name: 'test4',
  description: 'test',
  applicationId: '1',
  createdOn: new Date('2022-08-31T13:37:50.890Z'),
  updatedOn: new Date('2022-09-14T10:41:19.706Z'),
  enabled: true,
  enabledForEveryone: false,
  users: [],
  usersPercentage: 20,
  tests: [],
  usersViewedCount: 10,
  targetingRules: [
    { 
      attribute: 'test1',
      operator: TargetingRuleOperator.EQUALS,
      value: 'test', 
    },
    { 
      attribute: 'test2',
      operator: TargetingRuleOperator.INCLUDES,
      value: ['1', '2'], 
    },
  ],
  visibilityChangedOn: new Date('2022-09-14T10:41:02.746Z'),
  env: Env.DEVELOPMENT,
};

const makeUserByEmail = (email?: string) => {
  if (!email) return null;

  return {
    _id: 'test',
    email,
  } as UserData;
};

const makeUser = () => {
  return {
    _id: 'test',
    externalId: '1',
  } as UserData;
};

describe('calculateFlagsForUser', () => {
  describe('for empty features array', () => {
    const values: Array<{ features: FlatFeature[], email?: string }> = [
      { features: [] },
      { features: [], email: USER_TEST_EMAIL },
    ];

    test.each(values)('should return empty object', async ({ features, email }) => {
      await expect(helpers.calculateFlagsForUser(features, makeUserByEmail(email))).resolves.toEqual({});
    });
  });

  describe('when user is not passed', () => {
    test('should return true only for features enabled for everyone', async () => {
      const initialFeatures : FlatFeature[] = [
        featureDisabledForEveryone,
        featureEnabledForEveryone,
        featureEnabledForPercentOfUsers,
        featureEnabledForEmail,
      ];
      const expectedResult = {
        [featureDisabledForEveryone.name]: false,
        [featureEnabledForEveryone.name]: true,
        [featureEnabledForPercentOfUsers.name]: false,
        [featureEnabledForEmail.name]: false,
      };
      await expect(helpers.calculateFlagsForUser(initialFeatures, null)).resolves.toEqual(expectedResult);
    });
  });

  describe('for features enabled for everyone', () => {
    const initialFeatures : FlatFeature[] = [
      featureEnabledForEveryone,
    ];

    const expectedResult = {
      [featureEnabledForEveryone.name]: true,
    };

    test('should return true for features enabled for everyone', async () => {
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
    });
  });

  describe('for features disabled for everyone', () => {
    const initialFeatures : FlatFeature[] = [
      featureDisabledForEveryone,
    ];

    const expectedResult = {
      [featureDisabledForEveryone.name]: false,
    };

    test('should return false for features disabled for everyone', async () => {
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
    });
  });

  describe('for features enabled for the users by email', () => {
    const initialFeatures : FlatFeature[] = [
      featureEnabledForEmail,
    ];

    test('should return true for features enabled for email when email matches', async () => {
      const expectedResult = {
        [featureEnabledForEmail.name]: true,
      };
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
    });

    test('should return true for features enabled for email when email stored in data and matches', async () => {
      const expectedResult = {
        [featureEnabledForEmail.name]: true,
      };
      const user = {
        ...makeUser(),
        data: {
          email: USER_TEST_EMAIL,
        },
      };
      await expect(helpers.calculateFlagsForUser(initialFeatures, user))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for features enabled for email when email does not match', async () => {
      const expectedResult = {
        [featureEnabledForEmail.name]: false,
      };
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL_1)))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for features enabled for email when email stored in data and does not match', async () => {
      const expectedResult = {
        [featureEnabledForEmail.name]: false,
      };
      const user = {
        ...makeUser(),
        data: {
          email: USER_TEST_EMAIL_1,
        },
      };
      await expect(helpers.calculateFlagsForUser(initialFeatures, user))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for features enabled for email when email is not passed', async () => {
      const expectedResult = {
        [featureEnabledForEmail.name]: false,
      };
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUser()))
        .resolves.toEqual(expectedResult);
    });
  });

  describe('for features enabled for the users by targeting rules', () => {
    const initialFeatures : FlatFeature[] = [
      featureEnabledForPercentOfUsers,
    ];

    test('should return true for features enabled by targeting rules', async () => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: true,
      };
      const user1 = {
        ...makeUserByEmail(USER_TEST_EMAIL),
        data: {
          test1: 'test',
        }, 
      } as UserData;
      await expect(helpers.calculateFlagsForUser(initialFeatures, user1))
        .resolves.toEqual(expectedResult);

      const user2 = {
        ...makeUserByEmail(USER_TEST_EMAIL),
        data: {
          test2: '1',
        }, 
      } as UserData;  
      await expect(helpers.calculateFlagsForUser(initialFeatures, user2))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for features enabled by targeting rules', async () => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: false,
      };
      const user1 = {
        ...makeUserByEmail(USER_TEST_EMAIL),
        data: {
          test1: 'testtest',
        }, 
      } as UserData;
      await expect(helpers.calculateFlagsForUser(initialFeatures, user1))
        .resolves.toEqual(expectedResult);
    });
  });


  describe('for features enabled for selected percent of users', () => {
    beforeAll(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      helpers.calculateRemainderByUserData = jest.fn();
    });
    const PERCENT = 20;
    const initialFeatures: Array<FlatFeature> = [
      { 
        ...featureEnabledForPercentOfUsers,
        usersPercentage: PERCENT,
      },
    ];

    test.each([0, PERCENT - 1])(`should return true if remainder (%i) < selected percent ${PERCENT}`, async (value) => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: true,
      };
  
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      helpers.calculateRemainderByUserData.mockReturnValue(value);

      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
      
      await expect(helpers.calculateFlagsForUser(initialFeatures, makeUser()))
        .resolves.toEqual(expectedResult);
    });

    test.each([PERCENT, PERCENT + 1])(
      `should return false if remainder (%i) >= selected percent ${PERCENT}`, 
      async (value) => {
        const expectedResult = {
          [featureEnabledForPercentOfUsers.name]: false,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        helpers.calculateRemainderByUserData.mockReturnValue(value);

        await expect(helpers.calculateFlagsForUser(initialFeatures, makeUserByEmail(USER_TEST_EMAIL)))
          .resolves.toEqual(expectedResult);

        await expect(helpers.calculateFlagsForUser(initialFeatures, makeUser()))
          .resolves.toEqual(expectedResult);
      },
    );
  });
});