import { useMutation, useQuery } from 'react-query';
import cloneDeep from 'lodash/cloneDeep';
import queryClient from 'query-client';
import { apiService } from 'services';

const resource = '/email-sequences';

export const useGetPipelines = (env) => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const getFeaturesList = () => apiService.get('/pipelines', { env, applicationId });

  return useQuery(['pipelines'], getFeaturesList);
};

export function useAddPipeline(env) {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const createEmptyPipeline = (index) => apiService.post(
    `/applications/${applicationId}/pipelines`,
    { name: `Pipeline ${index}`, env, applicationId },
  );

  return useMutation(createEmptyPipeline, {
    onMutate: async (item) => {
      await queryClient.cancelQueries([resource]);

      const emailSequences = queryClient.getQueryData([resource]);
      const previousEmailSequences = cloneDeep(emailSequences);

      emailSequences.pipelines.push(item);

      queryClient.setQueryData([resource], emailSequences);

      return { previousEmailSequences };
    },
  });
}
