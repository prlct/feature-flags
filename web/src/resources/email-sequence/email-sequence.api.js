import { useMutation, useQuery } from 'react-query';
import queryClient from 'query-client';
import { apiService } from 'services';

const pipelinesResource = '/pipelines';
const sequencesResource = '/sequences';

export const useGetPipelines = (env) => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const getPipelines = async () => apiService.get('/pipelines', { env, applicationId });

  return useQuery([pipelinesResource], getPipelines);
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

export function useRemovePipeline() {
  const removePipeline = async (id) => apiService.delete(
    `${pipelinesResource}/${id}`,
  );

  return useMutation(removePipeline, {
    onSuccess: () => {
      queryClient.invalidateQueries([pipelinesResource]);
    },
  });
}

export function useUpdatePipeline() {
  const updatePipeline = ({ _id, name }) => apiService.put(`/pipelines/${_id}`, { name });

  return useMutation(updatePipeline, {
    onSuccess: () => {
      queryClient.invalidateQueries([pipelinesResource]);
    },
  });
}

export function useGetSequences(pipelineId) {
  const getSequences = async () => apiService.get(sequencesResource, { pipelineId });

  return useQuery([sequencesResource], getSequences);
}

export function useAddSequence(pipelineId) {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];

  const addSequence = async (name) => apiService.post(
    `/applications/${applicationId}/sequences`,
    { name, pipelineId },
  );

  return useMutation(addSequence, {
    onSuccess: () => {
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useGetSequenceEmails(sequenceId) {
  const getEmails = async () => apiService.get('/sequence-emails', { sequenceId });

  return useQuery([`sequence-emails-${sequenceId}`], getEmails);
}
