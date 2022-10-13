import { useQuery } from 'react-query';
import { apiService } from 'services';

export function useGetStatistics(enabled = false) {
  const getCurrent = () => apiService.get('/statistics/');

  return useQuery(['statistics'], getCurrent, {
    enabled,
  });
}
