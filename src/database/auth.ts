import { auth } from './firebase'
import { signInAnonymously } from 'firebase/auth';

export const signInUserAnonymously = async (): Promise<boolean> => {
  try {
    await signInAnonymously(auth);
    return true;
  } catch (error: unknown) {
    console.log('An error has occured :',error)
    return false;
  }
};
