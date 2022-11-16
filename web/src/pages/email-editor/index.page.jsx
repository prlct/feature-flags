import Head from 'next/head';
import {
  Stack,
} from '@mantine/core';
import EmailEditor from 'components/emailEditor';

const EmailEditorPage = () => (
  <>
    <Head>
      <title>Email editor</title>
    </Head>
    <Stack spacing="lg">
      <Stack sx={{ width: 700 }}>
        <EmailEditor />
      </Stack>
    </Stack>
  </>
);

export default EmailEditorPage;
