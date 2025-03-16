
jest.mock('FirebaseConfig', () => ({
  FIREBASE_APP: {
    name: '[DEFAULT]',
    options: {},
  },
  FIREBASE_AUTH: {
    currentUser: null,
    signOut: jest.fn(() => Promise.resolve()),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  },
}));

