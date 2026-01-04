import { config } from "./config";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
  UserCredential,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export class Services {
  app: FirebaseApp;
  auth: Auth;
  googleProvider: GoogleAuthProvider;
  database: Firestore;

  constructor() {
    this.app = !getApps().length ? initializeApp(config) : getApp();
    this.auth = getAuth(this.app);
    this.database = getFirestore(this.app);
    this.googleProvider = new GoogleAuthProvider();
  }

  async loginWithGooglePopUp() {
    try {
      const result: UserCredential = await signInWithPopup(
        this.auth,
        this.googleProvider
      );

      return {
        user: result.user,
        // @ts-expect-error: _tokenResponse is an internal property missing from Firebase types
        isNewUser: result._tokenResponse?.isNewUser,
        credential: GoogleAuthProvider.credentialFromResult(result),
      };
    } catch (error: unknown) {
      // Type-safe error handling
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Firebase Error :: Google Sign-In Failed:", errorMessage);
      return null;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      return true;
    } catch (error) {
      console.error("Logout Failed", error);
      return false;
    }
  }
}

const services = new Services();
export default services;