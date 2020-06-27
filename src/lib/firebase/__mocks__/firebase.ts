const mockSnapshot = {
  exists: jest.fn(() => true),
  val: jest.fn(() => "fake-val"),
};

const mockRef = jest.fn(() => ({
  on: jest.fn(),
  once: jest.fn(() => Promise.resolve(mockSnapshot)),
}));

export const database = jest.fn(() => ({
  ref: mockRef,
}));

export const auth = jest.fn(() => ({
  currentUser: {
    uid: "fake-uid",
  },
}));

const mock = jest.fn().mockImplementation(() => {
  return { database, auth };
});

export default mock;
