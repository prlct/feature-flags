import { useMutation } from 'react-query';
import { apiService } from 'services';

const resource = '/invitations';

export function useAcceptInvitation() {
  const acceptInvitation = ({ firstName, lastName, token }) => apiService.post(`${resource}/${token}`, { firstName, lastName });

  return useMutation(acceptInvitation);
}
