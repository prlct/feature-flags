import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

const resource = '/companies';

export function useInviteMember() {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.companyIds[0];
  const inviteMember = (data) => apiService.post(`${resource}/${companyId}/invitations`, data);

  return useMutation(inviteMember, {
    onSuccess() {
      queryClient.invalidateQueries(['companyMembers']);
    },
  });
}

export function useGetMembers() {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.companyIds[0];
  const getMembers = () => apiService.get(`${resource}/${companyId}/members`);

  return useQuery(['companyMembers'], getMembers);
}
