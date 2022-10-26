import { useMutation, useQuery } from 'react-query';
import _find from 'lodash/find';
import filter from 'lodash/filter';
import cloneDeep from 'lodash/cloneDeep';
import queryClient from 'query-client';
import { apiService } from 'services';

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
    onMutate: async () => {
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

// TODO: Dix delay for Settings page content update
export const useGetById = ({ _id, env }) => {
  const getById = () => apiService.get(`${resource}/${_id}`, { env });

  return useQuery(['featureFlag'], getById, { enabled: !!_id });
};

export function useUpdateRemoteConfig() {
  const updateRemoteConfig = (data) => apiService.put(`${resource}/${data.featureId}/remote-config`, data);

  return useMutation(updateRemoteConfig, {
    onMutate: async (feature) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.remoteConfig = feature.remoteConfig;
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
  });
}

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

export function useCreateABVariant(featureId) {
  const createABVariant = (data) => apiService.post(`${resource}/${featureId}/tests`, data);

  return useMutation(createABVariant, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);
      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.tests = [...featureFlag.tests, item];
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
    },
  });
}

export function useUpdateABVariant(featureId) {
  const updateABVariant = (data) => apiService.put(`${resource}/${featureId}/tests/${data.variantIndex}`, data);

  return useMutation(updateABVariant, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.tests[item.variantIndex] = { name: item.name, remoteConfig: item.remoteConfig };
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
    },
  });
}

export function useRemoveABVariant(featureId) {
  const removeABVariant = (data) => apiService.delete(`${resource}/${featureId}/tests/${data.variantIndex}`, data);

  return useMutation(removeABVariant, {
    onMutate: async (item) => {
      await queryClient.cancelQueries(['featureFlag']);

      const featureFlag = queryClient.getQueryData(['featureFlag']);
      const previousFeatureFlag = cloneDeep(featureFlag);

      featureFlag.tests = filter(
        featureFlag.tests,
        (test, index) => index !== +item.variantIndex,
      );
      queryClient.setQueryData(['featureFlag'], featureFlag);

      return { previousFeatureFlag };
    },
    onError: (err, item, context) => {
      queryClient.setQueryData(['featureFlag'], context.previousFeatureFlag);
    },
  });
}

export function useGetFeatureHistory(featureId, env) {
  const getById = () => apiService.get(`${resource}/${featureId}/history`, { env });

  return useQuery(['featureFlagHistory', env], getById, { enabled: !!featureId });
}
