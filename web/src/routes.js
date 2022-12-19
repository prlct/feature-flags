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
  acceptInvitation: '/accept-invitation',
  profile: '/profile',
  admins: '/admins',
  featureFlag: '/feature-flags/[id]',
  emailSequences: '/email-sequences',
  pipelineUsers: '/pipeline-users',
  pipelineSettings: '/pipeline-settings',
  apiKey: '/api-key',
  members: '/members',
  subscriptionPlans: '/subscription-plans',
  emailEditor: '/email-editor',
  sequencesDemo: '/sequences-demo',
};

export const path = {
  featureFlag: '/feature-flags',
};

export const navbarTabs = {
  FEATURE_FLAGS: 'Feature flags',
  ACTIVATION_PIPELINES: 'Activation pipelines',
  API_KEYS: 'Api Keys',
  TEAM_MEMBERS: 'Team members',
  PRICING: 'Pricing',
};

export const configuration = {
  home: {
    route: route.home,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
    navbarTab: navbarTabs.FEATURE_FLAGS,
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
  acceptInvitation: {
    route: route.acceptInvitation,
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
  emailSequences: {
    route: route.emailSequences,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
    navbarTab: navbarTabs.ACTIVATION_PIPELINES,
  },
  pipelineUsers: {
    route: route.pipelineUsers,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  pipelineSettings: {
    route: route.pipelineSettings,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  apiKey: {
    route: route.apiKey,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
    navbarTab: navbarTabs.API_KEYS,
  },
  members: {
    route: route.members,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
    navbarTab: navbarTabs.TEAM_MEMBERS,
  },
  subscriptionPlans: {
    route: route.subscriptionPlans,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
    navbarTab: navbarTabs.PRICING,
  },
  emailEditor: {
    route: route.emailEditor,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
  sequencesDemo: {
    route: route.sequencesDemo,
    scope: scope.PRIVATE,
    layout: layout.MAIN,
  },
};
