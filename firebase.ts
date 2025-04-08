// firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDTtEyhCo5FzAVn_xu17mRCh-zA3509-WE',
  authDomain: 'quizmaster-972b4.firebaseapp.com',
  projectId: 'quizmaster-972b4',
  storageBucket: 'quizmaster-972b4.firebasestorage.app',
  messagingSenderId: '873677963028',
  appId: '1:873677963028:web:391e313be45478689e8c01',
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
}

export const auth = getAuth();
