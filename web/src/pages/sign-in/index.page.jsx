import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { TextInput, Button, Stack, Title, Group } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons';

import { magic } from 'libs/magic';
import config from 'config';
import { Link } from 'components';
import * as routes from 'routes';
import { handleError } from 'helpers';
import { accountApi } from 'resources/account';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
});

const SignIn = () => {
  const router = useRouter();
  const { email } = router.query;
  const {
    register, handleSubmit, formState: { errors }, setError,
  } = useForm({ resolver: yupResolver(schema) });

  const { mutate: signIn, isLoading: isSignInLoading } = accountApi.useSignIn();

  const handleSignInRequest = (data) => signIn(data, {
    onError: (e) => handleError(e, setError),
  });

  // TODO: Do check if email exists before login with magic.link
  async function handleLoginWithEmail({ email }) {
    try {
      const DIDToken = await magic.auth.loginWithMagicLink({
        email,
        // redirectURI: new URL(routes.route.magicLinkRedirect, window.location.origin).href,
      });

      return handleSignInRequest({ DIDToken });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Sign In</Title>
        <form onSubmit={handleSubmit(handleLoginWithEmail)}>
          <Stack>
            <TextInput
              defaultValue={email}
              {...register('email')}
              label="Email Address"
              placeholder="Email"
              error={errors?.email?.message}
            />
            <Button
              loading={isSignInLoading}
              type="submit"
              fullWidth
            >
              Sign in
            </Button>
            <Group sx={{ fontSize: '14px' }}>
              Don’t have an account?
              <Link
                type="router"
                href={routes.route.signUp}
                underline={false}
                inherit
              >
                Sign up
              </Link>
            </Group>
            <Button component="a" leftIcon={<IconBrandGoogle />} href={`${config.apiUrl}/account/sign-in/google/auth`}>
              Continue with Google
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default SignIn;
