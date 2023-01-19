import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Loader } from '@mantine/core';

import { handleError } from 'helpers';
import { accountApi } from 'resources/account';
import { magic } from 'libs/magic';

const MagicLinkRedirect = () => {
  const router = useRouter();

  const { mutate: signIn } = accountApi.useSignIn({}, {
    // TODO: Check that error handling working
    onError: (e) => handleError(e),
  });

  const authenticateWithServer = useCallback(() => async (DIDToken) => {
    signIn({ DIDToken });
  }, [signIn]);

  const finishEmailRedirectLogin = useCallback(() => {
    if (router.query.magic_credential) {
      magic.auth.loginWithCredential().then((DIDToken) => authenticateWithServer(DIDToken));
    }
  }, [authenticateWithServer, router.query.magic_credential]);

  useEffect(() => {
    finishEmailRedirectLogin();
  }, [finishEmailRedirectLogin, router.query]);

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
