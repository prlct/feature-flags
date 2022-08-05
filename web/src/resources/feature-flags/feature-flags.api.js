import { useMutation, useQuery, useQueryClient } from 'react-query';
import { find as _find} from 'lodash';

import queryClient from 'query-client';
import { apiService } from 'services';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('/users/current');

  return useQuery(['currentUser'], getCurrent);
}

export function useUpdateFeatureEnvState(id, field) {
  const updateCurrent = (data) => apiService.post('/users/currentttt', data);

  return useMutation(updateCurrent);
}

const response = {
  items: [
      {
        _id: '62eacd2aae77c8534d742939',
        name: 'Feature one',
        development: true,
        staging: true,
        production: false,
        createdOn: '03/08/2022',
        // createdOn: '2022-08-03 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742940',
        name: 'Feature two',
        development: false,
        staging: false,
        production: false,
        createdOn: '23/07/2022',
        // createdOn: '2022-08-03 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742941',
        name: 'Cool feature',
        development: true,
        staging: false,
        production: false,
        createdOn: '20/07/2022',
        // createdOn: '2022-08-03 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742942',
        name: 'Email notifications',
        development: false,
        staging: true,
        production: false,
        createdOn: '03/07/2022',
        // createdOn: '2022-08-03 19:31:54.572Z',
      },
      {
        _id: '62eacd2aae77c8534d742943',
        name: 'Dark mode',
        development: true,
        staging: true,
        production: true,
        createdOn: '03/06/2022',
        // createdOn: '2022-08-03 19:31:54.572Z',
      },
  ],
  totalPages: 1,
  count: 8,
};

export const useList = (params) => {
  // const list = () => apiService.get('/users', params);
  const list = () => response;

  return useQuery(['featureFlags', params], list);
};
