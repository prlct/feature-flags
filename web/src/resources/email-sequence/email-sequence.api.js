import { useMutation, useQuery } from 'react-query';
import cloneDeep from 'lodash/cloneDeep';
import queryClient from 'query-client';
import { apiService } from 'services';

const resource = '/email-sequences';

export function useAddPipeline() {
  const createEmptyPipeline = ({ index, env }) => {
    const currentAdmin = queryClient.getQueryData(['currentAdmin']);
    const applicationId = currentAdmin.applicationIds[0];

    const name = `Pipeline ${index}`;

    return apiService.post(`/applications/${applicationId}/pipelines`, { env, name });
  };

  return useMutation(createEmptyPipeline, {
    onMutate: async (item) => {
      await queryClient.cancelQueries([resource]);

      const emailSequences = queryClient.getQueryData([resource]);
      const previousEmailSequences = cloneDeep(emailSequences);
      console.log(emailSequences);
      console.log(item);
      // emailSequences.pipelines.push(item);

      queryClient.setQueryData([resource], emailSequences);

      return { previousEmailSequences };
    },
  });
}

export function useAddSequence() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const createSequence = ({ pipelineId, name, trigger }) => apiService.post(`/applications/${applicationId}/sequences`, { pipelineId, name, trigger });

  return useMutation(createSequence);
}

export function useGetPipelines({ env }) {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const getPipelines = () => apiService.get('/pipelines', { applicationId, env });

  return useQuery(['pipelines', { applicationId, env }], getPipelines);
}

export function useRemovePipeline() {
  const removePipeline = (_id) => apiService.delete(`/pipelines/${_id}`);

  return useMutation(removePipeline);
}

export function useUpdatePipeline() {
  const updatePipeline = ({ _id, name }) => apiService.put(`/pipelines/${_id}`, { name });

  return useMutation(updatePipeline);
}

export function useUpdateSequence() {
  const updateSequences = ({ _id, name }) => apiService.put(`/sequences/${_id}`, { name });

  return useMutation(updateSequences);
}

export function useGetSequences() {
  const currentPipeline = queryClient.getQueryData(['currentPipeline']);
  console.log(currentPipeline);
  const getSequences = () => apiService.get('/sequences', { pipelineId: currentPipeline._id });

  return useQuery(['pipelines', { pipelineId: currentPipeline?._id }], getSequences);
}
