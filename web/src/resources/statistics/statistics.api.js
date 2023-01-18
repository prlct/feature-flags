import { useQuery } from 'react-query';
import { apiService } from 'services';

export function useGetStatistics() {
  const getCurrent = () => apiService.get('/statistics/');

  return useQuery(['statistics'], getCurrent);
}

export function useGetEmailStatistics({ companyId }) {
  const getCurrent = () => apiService.get('/emails-sending-analytics/', { companyId });

  return useQuery(['emails-sending-analytics'], getCurrent);
}
