import { useQuery } from 'react-query';
import { apiService } from 'services';

export function useGetStatistics() {
  const getCurrent = () => apiService.get('/statistics/');

  return useQuery(['statistics'], getCurrent);
};
