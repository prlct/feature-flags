import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { magic } from 'libs/magic';

import * as routes from 'routes';
import { handleError } from 'helpers';
import { Link } from 'components';
import {
  Button,
  Stack,
  TextInput,
  Group,
  Title,
} from '@mantine/core';
import { accountApi } from 'resources/account';

const schema = yup.object().shape({
  firstName: yup.string().max(100).required('Field is required.'),
  lastName: yup.string().max(100).required('Field is required.'),
  email: yup.string().max(64).email('Email format is incorrect.').required('Field is required.'),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: signIn } = accountApi.useSignIn();

  const handleSignInRequest = (data) => signIn(data, {
    onError: (e) => handleError(e, setError),
  });

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp();

  const onSubmit = (data) => signUp(data, {
    onSuccess: () => {
      (async function doAsync() {
        let DIDToken = await magic.auth.loginWithMagicLink({
          email: data.email,
          // redirectURI: new URL(routes.route.magicLinkRedirect, window.location.origin).href,
        });

        return handleSignInRequest({ DIDToken });
      })()
    },
    onError: (e) => handleError(e, setError),
  });

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Sign Up</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <TextInput
              {...register('email')}
              label="Email Address"
              placeholder="Your email"
              error={errors?.email?.message}
            />
            <Button
              type="submit"
              loading={isSignUpLoading}
              fullWidth
            >
              Sign Up
            </Button>
          </Stack>
        </form>
        <Group sx={{ fontSize: '14px' }}>
          Have an account?
          <Link
            type="router"
            href={routes.route.signIn}
            inherit
            underline={false}
          >
            Sign In
          </Link>
        </Group>
      </Stack>
    </>
  );
};

export default SignUp;
