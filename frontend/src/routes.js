const apiPath = 'api/v1';
export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  statePath: () => [apiPath, 'data'].join('/'),
  signUpPath: () => [apiPath, 'signup'].join('/'),
};
