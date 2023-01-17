import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

const resource = '/applications';

export function useCreateFeatureFlag() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;
  const createFeatureFlag = (data) => apiService.post(`${resource}/${applicationId}/features`, data);

  return useMutation(createFeatureFlag, {
    onSuccess: () => {
      queryClient.invalidateQueries(['featureFlags']);
    },
  });
}

export const useGetApplication = () => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;
  const getApplication = () => apiService.get(`${resource}/${applicationId}`);

  return useQuery(['account'], getApplication);
};

export const useGetFeaturesList = (env) => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;
  const getFeaturesList = () => apiService.get(`${resource}/${applicationId}/features/${env}`);

  return useQuery(['featureFlags'], getFeaturesList);
};
