import { useMutation } from 'react-query';
import { apiService } from 'services';

export const useSubscribe = () => {
  const subscribe = (priceId) => apiService.post('subscriptions/subscribe', { priceId });

  return useMutation(subscribe, {
    onSuccess: (data) => {
      window.location.href = data.checkoutLink;
    }
  });
};
