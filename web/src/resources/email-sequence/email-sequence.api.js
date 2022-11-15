import { useMutation } from 'react-query';
import cloneDeep from 'lodash/cloneDeep';
import queryClient from 'query-client';

const resource = '/email-sequences';

export function useAddPipeline() {
  const createEmptyPipeline = (index) => {
    const name = `Pipeline ${index}`;
    return { name, sequences: [] };
  };

  return useMutation(createEmptyPipeline, {
    onMutate: async (item) => {
      await queryClient.cancelQueries([resource]);

      const emailSequences = queryClient.getQueryData([resource]);
      const previousEmailSequences = cloneDeep(emailSequences);

      emailSequences.pipelines.push(item);

      queryClient.setQueryData([resource], emailSequences);

      return { previousEmailSequences };
    },
  });
}
