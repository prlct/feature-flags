import { useMutation, useQuery } from 'react-query';
import { apiService } from 'services';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('/subscriptions/current');

  return useQuery(['currentSubscription'], getCurrent);
};

export const useSubscribe = () => {
  const subscribe = ({ priceId, period }) => apiService.post('subscriptions/subscribe', { priceId, period });

  return useMutation(subscribe, {
    onSuccess: (data) => {
      window.location.href = data.checkoutLink;
    }
  });
};
