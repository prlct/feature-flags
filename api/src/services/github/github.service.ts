import axios from 'axios';
import { Octokit } from 'octokit';

import config from 'config';

const oAuthURLParams = {
  client_id: config.github.clientId,
  redirect_uri: `${config.apiUrl}/account/sign-in/github`,
  scope: 'user:email,read:user',
};

const oAuthURLPostParams = {
  ...oAuthURLParams,
  client_secret: config.github.clientSecret,
};

const gitAuthURL = new URL('https://github.com/login/oauth');
const searchParams = new URLSearchParams(oAuthURLParams).toString();
const oAuthURL = `${gitAuthURL}/authorize?${searchParams}`;

const exchangeCodeForToken = async (code: string) => {
  const postSearchParams = new URLSearchParams({ ...oAuthURLPostParams, code }).toString();
  const url = `${gitAuthURL}/access_token?${postSearchParams}`;

  try {
    const { data } = await axios.request({
      url,
      method: 'post',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    });

    const octokit = new Octokit({
      auth: data.access_token,
    });

    const { data: { name, email } } = await octokit.request('GET /user', {});
    let primaryEmail = email;

    if (!email) {
      const { data: emails } = await octokit.request('GET /user/emails', {});

      primaryEmail = emails.find((em) => em.primary)?.email || emails[0].email;
    }

    const [givenName, familyName] = name?.split(' ') || ['User', 'User'];

    const userInfo = {
      given_name: givenName,
      family_name: familyName,
      email: primaryEmail,
    };

    return {
      isValid: true,
      payload: userInfo,
    };
  } catch ({ message, ...rest }) {
    return {
      isValid: false,
      payload: { message },
    };
  }
};


export default {
  oAuthURL,
  exchangeCodeForToken,
};
