import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('/admins/current');

  return useQuery(['currentAdmin'], getCurrent);
}

export function useUpdateCurrent() {
  const updateCurrent = (data) => apiService.post('/admins/current', data);

  return useMutation(updateCurrent);
}

export function useUploadProfilePhoto() {
  const uploadProfilePhoto = (data) => apiService.post('/admins/upload-photo', data);

  return useMutation(uploadProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentAdmin'], data);
    },
  });
}

export function useRemoveProfilePhoto() {
  const removeProfilePhoto = () => apiService.delete('/admins/remove-photo');

  return useMutation(removeProfilePhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(['currentAdmin'], data);
    },
  });
}

export function useChangeCurrentCompany() {
  const changeCompany = (companyId) => apiService.put(`/admins/company/${companyId}`);

  return useMutation(changeCompany, {
    onSuccess: () => {
      window.location.reload();
    },
  });
}
