const mockCountDocuments = jest.fn();

import { calculateFlagsForUser, UserData } from './get-features-for-user';
import type { FlatFeature } from '../../feature.types';
import { Application, Env } from 'resources/application';

jest.mock('../../../user-event/user-event.service', () => ({
  countDocuments: mockCountDocuments,
}));

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
  visibilityChangedOn: new Date('2022-09-14T10:41:02.746Z'),
  env: Env.DEVELOPMENT,
};

const makeUser = (email?: string) => {
  if (!email) return null;

  return {
    _id: 'test',
    email,
  } as UserData;
};

const makeUserWithoutId = (email?: string) => {
  if (!email) return null;

  return {
    email,
  } as UserData;
};


const makeApplication = (totalUsersCount: number, trackEnabled = true) => {
  return {
    _id: '1',
    envs: {
      [Env.DEVELOPMENT]: {
        totalUsersCount,
      },
    },
    trackEnabled,
  } as Application;
};

const application = makeApplication(100);
describe('calculateFlagsForUser', () => {
  describe('for empty features array', () => {
    const values: Array<{ features: FlatFeature[], email?: string }> = [
      { features: [] },
      { features: [], email: USER_TEST_EMAIL },
    ];

    test.each(values)('should return empty object', async ({ features, email }) => {
      await expect(calculateFlagsForUser(features, application, makeUser(email))).resolves.toEqual({});
    });
  });

  describe('when email is not passed', () => {
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
      await expect(calculateFlagsForUser(initialFeatures, application, null)).resolves.toEqual(expectedResult);
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
      await expect(calculateFlagsForUser(initialFeatures, application, makeUser(USER_TEST_EMAIL)))
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
      await expect(calculateFlagsForUser(initialFeatures, application, makeUser(USER_TEST_EMAIL)))
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
      await expect(calculateFlagsForUser(initialFeatures, application, makeUser(USER_TEST_EMAIL)))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for features enabled for email when email does not match', async () => {
      const expectedResult = {
        [featureEnabledForEmail.name]: false,
      };
      await expect(calculateFlagsForUser(initialFeatures, application, makeUser(USER_TEST_EMAIL_1)))
        .resolves.toEqual(expectedResult);
    });
  });

  describe('for features enabled for selected percent of users', () => {
    const initialFeatures: Array<FlatFeature> = [
      { 
        ...featureEnabledForPercentOfUsers,
        usersPercentage: 20,
        usersViewedCount: 20,
      },
    ];

    const application1 = makeApplication(100);

    test('should return true for the user who hasn\'t seen the feature when viewed percent is < selected', async () => {
      const application2 = makeApplication(1000);

      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: true,
      };

      await expect(calculateFlagsForUser(initialFeatures, application2, makeUser(USER_TEST_EMAIL_1)))
        .resolves.toEqual(expectedResult);
    });
  
    test('should return true for the user who has already seen the feature', async () => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: true,
      };

      mockCountDocuments.mockResolvedValue(1);

      await expect(calculateFlagsForUser(initialFeatures, application1, makeUser(USER_TEST_EMAIL_1)))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for the user who hasn\'t seen the feature', async () => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: false,
      };

      mockCountDocuments.mockResolvedValue(0);

      await expect(calculateFlagsForUser(initialFeatures, application1, makeUser(USER_TEST_EMAIL_1)))
        .resolves.toEqual(expectedResult);
    });

    test('should return false for the user who is not saved to users collection', async () => {
      const expectedResult = {
        [featureEnabledForPercentOfUsers.name]: false,
      };

      mockCountDocuments.mockResolvedValue(0);

      await expect(calculateFlagsForUser(initialFeatures, application1, makeUserWithoutId(USER_TEST_EMAIL_1)))
        .resolves.toEqual(expectedResult);
    });

    describe('when trackEnabled is false in the application', () => {
      const application2 = makeApplication(100, false);
      test('should return false', async () => {
        const expectedResult = {
          [featureEnabledForPercentOfUsers.name]: false,
        };
  
        await expect(calculateFlagsForUser(initialFeatures, application2, makeUser(USER_TEST_EMAIL_1)))
          .resolves.toEqual(expectedResult);
      });
    });
  });
});