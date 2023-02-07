const apiPath = 'api/v1';
export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  signUpPath: () => [apiPath, 'data'].join('/'),
};
