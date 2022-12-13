import { useMutation, useQuery } from 'react-query';
import queryClient from 'query-client';
import { apiService } from 'services';
import { showNotification } from '@mantine/notifications';

const pipelinesResource = '/pipelines';
const sequencesResource = '/sequences';
const sequenceEmailResource = '/sequence-emails';
const pipelineUsersResource = '/pipeline-users';

export const useGetPipelines = (env) => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const getPipelines = async () => apiService.get(pipelinesResource, { env, applicationId });

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
      showNotification({
        title: 'Pipeline added',
        message: 'New pipeline added',
        color: 'green',
      });
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
      showNotification({
        title: 'Pipeline removed',
        message: 'Pipeline removed',
        color: 'green',
      });
      queryClient.invalidateQueries([pipelinesResource]);
    },
  });
}

export function useUpdatePipeline() {
  const updatePipeline = ({ _id, name }) => apiService.put(`/pipelines/${_id}`, { name });

  return useMutation(updatePipeline, {
    onSuccess: () => {
      showNotification({
        title: 'Pipeline updated',
        message: 'Pipeline updated',
        color: 'green',
      });
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

  const addSequence = async ({ name, trigger = null }) => apiService.post(
    `/applications/${applicationId}/sequences`,
    { name, pipelineId, trigger },
  );

  return useMutation(addSequence, {
    onSuccess: () => {
      showNotification({
        title: 'Sequence created',
        message: 'New sequence created',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useUpdateSequence() {
  const updateSequences = ({ _id, name }) => apiService.put(`${sequencesResource}/${_id}`, { name });

  return useMutation(updateSequences, {
    onSuccess: () => {
      showNotification({
        title: 'Sequence updated',
        message: 'Sequence successfully updated',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useRemoveSequence() {
  const removeSequence = async (id) => apiService.delete(
    `${sequencesResource}/${id}`,
  );

  return useMutation(removeSequence, {
    onSuccess: () => {
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useUpdateSequenceTrigger(id) {
  const updateTrigger = (data) => apiService.put(`${sequencesResource}/${id}/trigger`, data);

  return useMutation(updateTrigger, {
    onSuccess: () => {
      showNotification({
        title: 'Sequence trigger updated',
        message: 'Sequence trigger successfully updated',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useGetSequenceEmails(sequenceId) {
  const getEmails = async () => apiService.get(sequenceEmailResource, { sequenceId });

  return useQuery([`${sequenceEmailResource}-${sequenceId}`], getEmails);
}

export function useEmailUpdate(emailId) {
  const updateEmail = async (data) => apiService.put(`${sequenceEmailResource}/${emailId}`, data);

  return useMutation(updateEmail, {
    onSuccess: (item) => {
      showNotification({
        title: 'Sequence email updated',
        message: 'Sequence email updated',
        color: 'green',
      });
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useEmailCreate() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];
  const updateEmail = async (data) => apiService.post(`/applications/${applicationId}${sequenceEmailResource}`, data);

  return useMutation(updateEmail, {
    onSuccess: (item) => {
      showNotification({
        title: 'Sequence email created',
        message: 'Sequence email created',
        color: 'green',
      });
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useEmailToggle(emailId) {
  const updateEmail = async () => apiService.put(`${sequenceEmailResource}/${emailId}/toggle`);

  return useMutation(updateEmail, {
    onSuccess: (item) => {
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useEmailRemove(emailId) {
  const removeEmail = async () => apiService.delete(`${sequenceEmailResource}/${emailId}`);

  return useMutation(removeEmail, {
    onSuccess: (item) => {
      showNotification({
        title: 'Sequence email removed',
        message: 'Sequence email removed',
        color: 'green',
      });
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useGetUsers() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];

  const getUsers = () => apiService.get(`${pipelineUsersResource}`, { applicationId });

  return useQuery([pipelineUsersResource], getUsers);
}

export function useAddUsers() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];

  const addUsers = ({ email, sequenceId }) => apiService.post(
    `/applications/${applicationId}/pipeline-users`,
    { email, sequenceId },
  );

  return useMutation(addUsers, {
    onSuccess: () => {
      showNotification({
        title: 'Added users to sequence',
        message: 'Added users to sequence',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useRemoveUser() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];

  const removeUser = (userId) => apiService.delete(
    `${pipelineUsersResource}/${userId}`,
    { applicationId },
  );

  return useMutation(removeUser, {
    onSuccess: () => {
      showNotification({
        title: 'Removed user from sequence',
        message: 'Removed user from sequence',
        color: 'green',
      });
      queryClient.invalidateQueries([pipelineUsersResource]);
    },
  });
}

export function useGetApplicationEvents() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];

  const getEvents = () => apiService.get(`/applications/${applicationId}/events`);

  return useQuery(['pipeline-events'], getEvents);
}

export function useAddApplicationEvent() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.applicationIds[0];

  const addEvent = (event) => apiService.post(`/applications/${applicationId}/events`, event);

  return useMutation(addEvent, {
    onSuccess: () => {
      showNotification({
        title: 'Created new event',
        message: 'Created new event',
        color: 'green',
      });
      queryClient.invalidateQueries(['pipeline-events']);
    },
  });
}

export function useSendTestEmail(id) {
  const sendEmail = (email) => apiService.post(`${sequenceEmailResource}/${id}/send-test-email`, { email });

  return useMutation(sendEmail, {
    onSuccess: () => {
      showNotification({
        title: 'Test email was sent.',
        message: 'Test email was sent.',
        color: 'green',
      });
    },
  });
}
