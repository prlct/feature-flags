import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Loader } from '@mantine/core';

import { handleError } from 'helpers';
import { accountApi } from 'resources/account';
import { magic } from 'libs/magic';


const MagicLinkRedirect = () => {
  const router = useRouter();

  const { mutate: signIn, isLoading: isSignInLoading } = accountApi.useSignIn({
    // TODO: Check that error handling working
    onError: (e) => handleError(e)
  });

  useEffect(() => {
    finishEmailRedirectLogin();
  }, [router.query]);

  const finishEmailRedirectLogin = () => {
    if (router.query.magic_credential) {
      magic.auth.loginWithCredential().then((DIDToken) => authenticateWithServer(DIDToken));
    }
  };

  const authenticateWithServer = async (DIDToken) => {
    signIn({ DIDToken });
  };

  return (
    <>
      <Head>
        <title>Magic Link Redirect</title>
      </Head>
      <Loader />
    </>
  );
};

export default MagicLinkRedirect;
