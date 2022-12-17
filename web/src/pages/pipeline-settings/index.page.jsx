import { useGetSenderEmails } from 'resources/email-sequence/email-sequence.api';
import { Box, Button, LoadingOverlay, Table, Text } from '@mantine/core';
import config from 'config';
import queryClient from 'query-client';

const PipelineSettings = () => {
  const { data: emails = [], isLoading } = useGetSenderEmails();

  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin?.applicationIds[0];

  const rows = emails.map((email) => (
    <tr key={email}>
      <td>{email.value}</td>
    </tr>
  ));

  return (
    <Box>
      <LoadingOverlay visible={isLoading} />
      <Text my={8}>Application emails</Text>
      <Button
        component="a"
        href={`${config.apiUrl}/applications/${applicationId}/add-gmail`}
      >
        Add email
      </Button>

      <Table verticalSpacing="xs" horizontalSpacing="xs" striped>
        <thead>
          <tr>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>

    </Box>
  );
};

export default PipelineSettings;
