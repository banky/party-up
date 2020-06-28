const mockSnapshot = {
  exists: jest.fn(() => true),
  val: jest.fn(() => "fake-val"),
};

const mockRef: any = {
  on: jest.fn(),
  once: jest.fn(() => Promise.resolve(mockSnapshot)),
  child: jest.fn(() => mockRef),
  set: jest.fn(() => Promise.resolve()),
  push: jest.fn(() => ({
    key: "fake-key",
  })),
};

const mockDatabase = {
  ref: jest.fn(() => mockRef),
};

const database = jest.fn(() => mockDatabase);

const mockAuth = {
  currentUser: {
    uid: "fake-uid",
  },
  signInAnonymously: jest.fn(() => Promise.resolve()),
};

const auth = jest.fn(() => mockAuth);

const mock = jest.fn().mockImplementation(() => {
  return { database, auth };
});

export default mock;
