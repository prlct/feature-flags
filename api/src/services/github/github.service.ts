import config from 'config';
import axios from 'axios';
import { Octokit } from 'octokit';

const urlParams = {
  gitHub:'https://github.com/login/oauth',
  client_id: config.github.clientId,
  redirect_uri: `${config.apiUrl}/account/sign-in/github`,
};

const oAuthURL = `${urlParams.gitHub}/authorize?client_id=${urlParams.client_id}&redirect_uri=${urlParams.redirect_uri}&scope=user`;

const exchangeCodeForToken = async (code: string) => {
  try {
    const { data } = await axios.request({
      url: `${urlParams.gitHub}/access_token?client_id=${config.github.clientId}&client_secret=${config.github.clientSecret}&code=${code}&redirect_uri=${config.apiUrl}/account/sign-in/github&scope=user`,
      method: 'post',
      params: {
        client_id: config.github.clientId,
        redirect_uri: `${config.apiUrl}/account/sign-in/github`,
        scope: 'user',
        code,
      },
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
    });

    const octokit = new Octokit({
      auth: data.access_token,
    });

    const { data : gitHubUser }  = await octokit.request('GET /user', {});

    if (gitHubUser) {
      const { name, email } = gitHubUser;
      let primaryEmail = email;

      if (!email) {
        const emails = await octokit.request('GET /user/emails', {});

        primaryEmail = emails.data.find((em)=> em.primary)?.email || '';
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
    }
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
