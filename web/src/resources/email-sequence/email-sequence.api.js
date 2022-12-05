import { useMutation, useQuery } from 'react-query';
import cloneDeep from 'lodash/cloneDeep';
import queryClient from 'query-client';
import { apiService } from 'services';

const pipelinesResource = '/pipelines';
const emailSequencesResource = '/email-sequences';

export const useGetPipelines = (env) => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const getFeaturesList = async () => apiService.get('/pipelines', { env, applicationId });

  return useQuery([pipelinesResource], getFeaturesList);
};

export function useAddPipeline(env) {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];

  const data = queryClient.getQueryData([pipelinesResource]);
  const currentPipelines = data?.results || [];

  const createEmptyPipeline = async () => apiService.post(
    `/applications/${applicationId}/pipelines`,
    { name: `Pipeline ${currentPipelines.length + 1}`, env, applicationId },
  );

  return useMutation(createEmptyPipeline, {
    onSuccess: () => {
      queryClient.invalidateQueries([pipelinesResource]);
    },
  });
}
