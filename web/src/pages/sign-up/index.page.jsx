import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';

import { magic } from 'libs/magic';
import config from 'config';
import * as routes from 'routes';
import { handleError } from 'helpers';
import { Link } from 'components';
import {
  Button,
  Stack,
  TextInput,
  Group,
  Title,
  Text, UnstyledButton,
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons';

import { accountApi } from 'resources/account';
import { useAmplitude } from 'contexts/amplitude-context';
import { ButtonGoogleLight } from 'public/icons';
import { useStyles } from '../sign-in/styles';

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
  const { classes } = useStyles();
  const { mutate: signIn } = accountApi.useSignIn();

  const amplitude = useAmplitude();

  const handleSignInRequest = (data) => signIn(data, {
    onError: (e) => handleError(e, setError),
    onSuccess: () => amplitude.track('Admin sign up', { method: 'magic-link' }),
  });

  const { mutate: signUp, isLoading: isSignUpLoading } = accountApi.useSignUp();

  const onSubmit = (data) => signUp(data, {
    onSuccess: () => {
      (async function doAsync() {
        const DIDToken = await magic.auth.loginWithMagicLink({
          email: data.email,
          // redirectURI: new URL(routes.route.magicLinkRedirect, window.location.origin).href,
        });

        return handleSignInRequest({ DIDToken });
      }());
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
        <Text sx={{ fontSize: '12px' }}>
          By clicking the button you accept
          {' '}
          <Text
            variant="link"
            component="a"
            href="https://www.paralect.com/privacy-policy"
            target="_blank"
            inherit
          >
            the Privacy Policy
          </Text>
        </Text>
        <Title align="center" sx={{ fontSize: '14px', fontWeight: 500 }}>OR</Title>
        <UnstyledButton
          component="a"
          href={`${config.apiUrl}/account/sign-in/google/auth`}
        >
          <Group px="8dp" className={classes.googleButton}>
            <ButtonGoogleLight />
            <Text>
              Sign up with Google
            </Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          component="a"
          href={`${config.apiUrl}/account/sign-in/github/auth`}
        >
          <Group px="8dp" className={classes.githubButton}>
            <IconBrandGithub />
            <Text>Continue with GitHub</Text>
          </Group>
        </UnstyledButton>
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
