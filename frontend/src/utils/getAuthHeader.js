export const getAuthToken = () => JSON.parse(localStorage.getItem('user'));

const getAuthHeader = () => {
  const userToken = getAuthToken();

  if (userToken && userToken.token) {
    return { Authorization: `Bearer ${userToken.token}` };
  }
  return null;
};

export default getAuthHeader;
