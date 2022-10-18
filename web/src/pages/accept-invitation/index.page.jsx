import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Stack, Title, TextInput, Button } from '@mantine/core';
import { handleError } from 'helpers';

import { Link } from 'components';
import * as routes from 'routes';
import { invitationApi } from 'resources/invitation';

const schema = yup.object().shape({
  firstName: yup.string().max(100).required('Field is required.'),
  lastName: yup.string().max(100).required('Field is required.'),
});

const AcceptInvitation = () => {
  const router = useRouter();
  const { token } = router.query;
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const acceptInvitationMutation = invitationApi.useAcceptInvitation();

  const acceptInvitation = ({ firstName, lastName }) => {
    acceptInvitationMutation.mutate({ firstName, lastName, token }, {
      onSuccess: ({ email }) => {
        setEmail(email);
      },
      onError: (e) => handleError(e, setError),
    });
  };

  return (
    <>
      <Head>
        <title>Accept invitation</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        {!email ? (
          <>
            <Title order={2}>Accept invitation</Title>
            <form onSubmit={handleSubmit(acceptInvitation)}>
              <Stack>
                <TextInput
                  {...register('firstName')}
                  label="First Name"
                  maxLength={100}
                  placeholder="Your first name"
                  error={errors?.firstName?.message}
                />
                <TextInput
                  {...register('lastName')}
                  label="Last Name"
                  maxLength={100}
                  placeholder="Your last name"
                  error={errors?.lastName?.message}
                />
                <Button
                  type="submit"
                  loading={acceptInvitationMutation.isLoading}
                  fullWidth
                >
                  Accept invitation
                </Button>
              </Stack>
            </form>
          </>
        ) : (
          <>
            <Title order={2}>Invitation has been successfully accepted</Title>
            <Link
              type="router"
              href={`${routes.route.signIn}?email=${email}`}
              inherit
              underline={false}
            >
              Sign In to your account
            </Link>
          </>
        )}
      </Stack>
    </>
  );
};

export default AcceptInvitation;
