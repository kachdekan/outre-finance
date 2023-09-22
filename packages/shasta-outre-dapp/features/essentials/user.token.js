import { saltyPasscode } from '@dapp/utils';

export let userToken = null;
export function setUserToken(code) {
  if (userToken) {
    console.warn('Overwriting existing user token'); //replace with degugging logger
  }
  userToken = saltyPasscode(code);
  console.log(userToken);
  console.log('Token Set');
}

export function setUserTokenFrom(token) {
  userToken = token;
}
