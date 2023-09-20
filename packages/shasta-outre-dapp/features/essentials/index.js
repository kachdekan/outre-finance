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

//SCREENS
export { default as LoginScreen } from './login.screen';
export { default as HomeScreen } from './home.screen';
export { default as WelcomeScreen } from './welcome.screen';
export { default as DummyScreen } from './dummy.screen';

export { default as UserDetailsScreen } from './onboarding/user-details.screen';
export { default as VerificationScreen } from './onboarding/verification.screen';
export { default as SetPasscodeScreen } from './onboarding/set-passcode.screen';