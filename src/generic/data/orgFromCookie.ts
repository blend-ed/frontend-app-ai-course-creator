import Cookies from 'universal-cookie';

const getOrgFromCookie = (): string => {
  const cookies = new Cookies();
  return cookies.get('orgName') || '';
};

export default getOrgFromCookie;
