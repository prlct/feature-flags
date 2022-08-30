import { useMutation } from 'react-query';
import { apiService } from 'services';

const resource = '/invitations';

export function useConfirmInvitation() {
  const confirmInvitation = (token) => apiService.post(`${resource}/${token}`);

  return useMutation(confirmInvitation);
}

