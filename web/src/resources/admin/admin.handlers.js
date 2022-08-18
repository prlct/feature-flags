import queryClient from 'query-client';
import { apiService, socketService } from 'services';

apiService.on('error', (error) => {
  if (error.status === 401) {
    queryClient.setQueryData(['currentAdmin'], null);
  }
});

socketService.on('connect', () => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);

  socketService.emit('subscribe', `admin-${currentAdmin._id}`);
});

socketService.on('admin:updated', (data) => {
  queryClient.setQueryData(['currentAdmin'], data);
});
