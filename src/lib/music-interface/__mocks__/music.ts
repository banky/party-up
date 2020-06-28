export const authorize = jest.fn(() => Promise.resolve("fake-auth-token"));

const mock = jest.fn().mockImplementation(() => {
  return { authorize };
});

export default mock;
