import { useMutation, useQuery } from 'react-query';
import _find from 'lodash/find';
import _remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';
import queryClient from 'query-client';
import { apiService } from 'services';

import { getLetterByAlphabetNumber } from 'helpers';

const resource = '/features';

export function useToggleFeatureStatus() {
  const toggleFeatureStatus = (data) => apiService.post(`${resource}/${data._id}/toggler`, { env: data.env });

  return useMutation(toggleFeatureStatus, {
    // Optimistically change state of the toggle without waiting server reply
    onMutate: async (item) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['featureFlags']);

      // Snapshot the previous value
      const featureFlags = queryClient.getQueryData(['featureFlags']);
      const previousFeatureFlags = cloneDeep(featureFlags);

      const featureFlag = _find(featureFlags, { _id: item._id });
      featureFlag.enabled = !featureFlag.enabled;

      // Optimistically update to the new value
      queryClient.setQueryData(['featureFlags'], featureFlags);

      // Return a context object with the snapshotted value
      return { previousFeatureFlags };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlags'], context.previousFeatureFlags);
    },
  });
}

export function useToggleFeatureStatusOnSettingsPage() {
  const toggleFeatureStatus = (data) => apiService.post(`${resource}/${data._id}/toggler`, { env: data.env });

  return useMutation(toggleFeatureStatus, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.enabled = !featureFlag.enabled;
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
    },
  });
}

export function useChangeFeatureVisibility() {
  const changeFeatureVisibility = ({ _id, enabledForEveryone, env }) => apiService.put(`${resource}/${_id}/visibility`, { enabledForEveryone, env });

  return useMutation(changeFeatureVisibility, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.enabledForEveryone = item.enabledForEveryone;
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
    },
  });
}

export function useChangeUsersPercentage() {
  const changeUsersPercentage = ({ _id, percentage, env }) => apiService.put(`${resource}/${_id}/users-percentage`, { percentage: percentage || 0, env });

  return useMutation(changeUsersPercentage, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.usersPercentage = item.percentage;
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
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

// TODO: Dix delay for Settings page content update
export const useGetById = ({ _id, env }) => {
  const getById = () => apiService.get(`${resource}/${_id}`, { env });

  return useQuery(['featureFlag'], getById, { enabled: !!_id });
};

export function useUpdateDescription() {
  const updateDescription = (data) => apiService.put(`${resource}/${data._id}/description`, data);

  return useMutation(updateDescription, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.description = item.description;
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
    },
  });
}

export function useDeleteFeature() {
  const deleteFeature = ({ _id }) => apiService.delete(`${resource}/${_id}`);

  return useMutation(deleteFeature, {
    onSuccess: () => {
      queryClient.invalidateQueries(['featureFlags']);
    },
  });
}

export function useUpdateTargetingRules() {
  const updateTargetingRules = (data) => apiService.put(`${resource}/${data._id}/targeting-rules`, data);

  return useMutation(updateTargetingRules, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.targetingRules = item.targetingRules;
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
    },
  });
}
