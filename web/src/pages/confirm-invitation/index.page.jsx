import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Group, Loader, Stack, Title } from '@mantine/core';

import { Link } from 'components';
import * as routes from 'routes';
import { invitationApi } from 'resources/invitation';

const ConfirmInvitation = () => {
  const router = useRouter();
  const { token } = router.query;
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const confirmInvitationMutation = invitationApi.useConfirmInvitation();

  const confirmInvitation = (token) => confirmInvitationMutation.mutate(token, {
    onSuccess: ({ email }) => {
      setEmail(email)
    },
    onError: (error) => {
      const message = error.data?.errors?.global[0];
      setErrorMessage(message)
    },
  });

  useEffect(() => {
    if (token) {
      confirmInvitation(token);
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Confirm invitation</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        { confirmInvitationMutation.isLoading ? <Group position="center"><Loader /></Group> : (
          !errorMessage ? (
            <>
              <Title order={2} >Invitation has been successfully accepted</Title>
              <Link
              type="router"
              href={`${routes.route.signIn}?email=${email}`}
              inherit
              underline={false}
            >
              Sign In to your account
            </Link>
            </>
          ) : (
            <Title order={2} >{errorMessage}</Title>
          )
        )}
      </Stack>
    </>
  );
};

export default ConfirmInvitation;
