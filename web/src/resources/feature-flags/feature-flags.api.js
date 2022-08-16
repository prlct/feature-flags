import { useMutation, useQuery } from 'react-query';
import {
  find as _find,
  remove as _remove,
  cloneDeep as _cloneDeep,
} from 'lodash';
import queryClient from 'query-client';

import { getLetterByAlphabetNumber } from 'helpers';
import { featureTemplate, listResponse } from './feature-flags.constants';

const resource = '/feature-flags';

export function useToggleFeatureStatus() {
  const toggleFeatureStatus = (data) => new Promise((res) => { setTimeout(() => res(data), 300); });

  return useMutation(toggleFeatureStatus, {
    onSuccess: (data) => {
      queryClient.setQueryData(['featureFlags'], (oldData) => {
        const featureFlag = _find(oldData.items, { _id: data._id });
        featureFlag.enabled = !featureFlag.enabled;

        return oldData;
      });
    },
  });
}

export function useCreateFeatureFlag() {
  const createFeatureFlag = (data) => new Promise((res) => { setTimeout(() => res(data), 1000); });

  return useMutation(createFeatureFlag, {
    onSuccess: ({ name, description }) => {
      queryClient.setQueryData(['featureFlags'], (oldData) => {
        const newFeatureFlag = _cloneDeep(featureTemplate);
        newFeatureFlag._id = Math.floor(Math.random() * 10000000000).toString();
        newFeatureFlag.name = name;
        newFeatureFlag.description = description;

        oldData.items.unshift(newFeatureFlag);
        return oldData;
      });
    },
  });
}

export function useCreateConfiguration() {
  const createConfiguration = (data) => new Promise((res) => { setTimeout(() => res(data), 1000); });

  return useMutation(createConfiguration, {
    onSuccess: ({ configurationId, configuration }) => {
      queryClient.setQueryData(['featureFlag'], (oldData) => {
        if (configurationId) {
          const test = _find(oldData.tests, { _id: configurationId });
          test.configuration = configuration;
        } else {
          const _id = Math.floor(Math.random() * 10000000000).toString();
          const name = `Variant ${getLetterByAlphabetNumber(oldData.tests.length + 1).toUpperCase()}`;
          oldData.tests.push({ _id, name, configuration });
        }
        return oldData;
      });
    },
  });
}

export function useDeleteConfiguration() {
  const deleteConfiguration = (data) => new Promise((res) => { setTimeout(() => res(data), 1000); });

  return useMutation(deleteConfiguration, {
    onSuccess: ({ configurationId }) => {
      queryClient.setQueryData(['featureFlag'], (oldData) => {
        _remove(oldData.tests, { _id: configurationId });
        return oldData;
      });
    },
  });
}

export function useChangeFeatureVisibility() {
  const changeFeatureVisibility = (data) => new Promise((res) => { setTimeout(() => res(data), 100); });

  return useMutation(changeFeatureVisibility, {
    onSuccess: (data) => {
      queryClient.setQueryData(['featureFlag'], (oldData) => {
        oldData.enabledForEveryone = data === 'everyone' ? true : false;
        return oldData;
      });
    },
  });
}

export function useChangeUsersPercentage() {
  const changeUsersPercentage = (data) => new Promise((res) => { setTimeout(() => res(data), 100); });

  return useMutation(changeUsersPercentage, {
    onSuccess: ({ usersPercentage }) => {
      queryClient.setQueryData(['featureFlag'], (oldData) => {
        oldData.usersPercentage = usersPercentage || 0;
        return oldData;
      });
    },
  });
}

export function useEnableFeatureForUsers() {
  const enableFeatureForUsers = (data) => new Promise((res) => { setTimeout(() => res(data), 100); });

  return useMutation(enableFeatureForUsers, {
    onSuccess: ({ email }) => {
      queryClient.setQueryData(['featureFlag'], (oldData) => {
        // oldData.users = oldData.users.concat(data);
        oldData.users.push(email);
        return oldData;
      });
    },
  });
}

export function useDisableFeatureForUser() {
  const disableFeatureForUser = (data) => new Promise((res) => { setTimeout(() => res(data), 100); });

  return useMutation(disableFeatureForUser, {
    onSuccess: (email) => {
      queryClient.setQueryData(['featureFlag'], (oldData) => {
        _remove(oldData.users,(user) => user === email );
        return oldData;
      });
    },
  });
}

// TODO: Dix delay for Settings page content update
export const useGetById = (_id) => {  
  const state = queryClient.getQueryState(['featureFlags']);
  const featureFlag = _find(state?.data?.items, { _id });

  const getById = () => new Promise((res) => { setTimeout(() => res(featureFlag), 100); });
  
  return useQuery(['featureFlag'], getById);
};


export const useGetList = (env) => {
  const getList = () => new Promise((res) => { setTimeout(() => res(listResponse[env]), 1000); });

  return useQuery(['featureFlags'], getList);
};
