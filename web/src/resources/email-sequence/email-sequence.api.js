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
    onMutate: async () => {
      await queryClient.cancelQueries([resource]);

      const emailSequences = queryClient.getQueryData([resource]);
      const previousEmailSequences = cloneDeep(emailSequences);

      queryClient.setQueryData([resource], emailSequences);

      return { previousEmailSequences };
    },
  });
}

export function useAddSequence() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const createSequence = ({ pipelineId, name, trigger }) => apiService.post(`/applications/${applicationId}/sequences`, { pipelineId, name, trigger });

  return useMutation(createSequence, {
    onSuccess: () => {
      queryClient.invalidateQueries('sequences');
      queryClient.removeQueries('currentSequence');
    },
  });
}

export function useGetPipelines({ env }) {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const getPipelines = () => apiService.get('/pipelines', { applicationId, env });

  return useQuery(['pipelines', { applicationId, env }], getPipelines, { onSuccess: () => {
    queryClient.invalidateQueries('sequences');
  } });
}

export function useRemovePipeline() {
  const removePipeline = (_id) => apiService.delete(`/pipelines/${_id}`);

  return useMutation(removePipeline, { onSuccess: () => {
    queryClient.invalidateQueries('pipelines');
    queryClient.invalidateQueries('sequences');
  },
  });
}

export function useRemoveSequence() {
  const removeSequence = (_id) => apiService.delete(`/sequences/${_id}`);

  return useMutation(removeSequence, { onSuccess: () => {
    queryClient.removeQueries('currentSequence');
    queryClient.invalidateQueries('sequences');
  },
  });
}

export function useUpdatePipeline() {
  const updatePipeline = ({ _id, name }) => apiService.put(`/pipelines/${_id}`, { name });

  return useMutation(updatePipeline);
}

export function useUpdateSequence() {
  const updateSequences = ({ _id, name, trigger }) => apiService.put(`/sequences/${_id}`, { name, trigger });

  return useMutation(updateSequences, { onSuccess: () => {
    queryClient.invalidateQueries('pipeline');
    queryClient.invalidateQueries('sequences');
  },
  });
}

export function useGetSequences() {
  const currentPipeline = queryClient.getQueryData(['currentPipeline']);
  const getSequences = () => apiService.get('/sequences', { pipelineId: currentPipeline._id });

  return useQuery(['sequences', { pipelineId: currentPipeline?._id }], getSequences);
}
