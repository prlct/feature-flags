export const scope = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  NONE: null,
};

export const layout = {
  MAIN: 'main',
  UNAUTHORIZED: 'unauthorized',
  NONE: null,
};

export const route = {
  home: '/',
  404: '/404',
  signIn: '/sign-in',
  signInPassword: '/sign-in-password',
  signUp: '/sign-up',
  magicLinkRedirect: '/magic-link-redirect',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  expireToken: '/expire-token',
  confirmInvitation: '/confirm-invitation',
  profile: '/profile',
  admins: '/admins',
  featureFlag: '/feature-flags/[id]',
  apiKey: '/api-key',
  members: '/members',
};

export const path = {
  featureFlag: '/feature-flags',
};

export const configuration = {
  home: {
    route: route.home,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  404: {
    route: route['404'],
    scope: scope.NONE,
    layout: layout.UNAUTHORIZED,
  },
  signIn: {
    route: route.signIn,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  signInPassword: {
    route: route.signInPassword,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  signUp: {
    route: route.signUp,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  magicLinkRedirect: {
    route: route.magicLinkRedirect,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  forgotPassword: {
    route: route.forgotPassword,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  resetPassword: {
    route: route.resetPassword,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  expireToken: {
    route: route.expireToken,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  confirmInvitation: {
    route: route.confirmInvitation,
    scope: scope.PUBLIC,
    layout: layout.UNAUTHORIZED,
  },
  profile: {
    route: route.profile,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  admins: {
    route: route.admins,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  featureFlag: {
    route: route.featureFlag,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  apiKey: {
    route: route.apiKey,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  members: {
    route: route.members,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
};
