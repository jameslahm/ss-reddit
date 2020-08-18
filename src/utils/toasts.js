export const SUCCESS_TOAST = {
  position: "top",
  duration: 2000,
  isClosable: true,
  status: "success",
};

export const FAILURE_TOAST = {
  position: "top",
  duration: 2000,
  isClosable: true,
  status: "error",
};

export const LOGIN_FAILURE = {
  ...FAILURE_TOAST,
  description: "Username or Password not correct",
};

export const LOGIN_SUCCESS = {
  ...SUCCESS_TOAST,
  description:"Login success"
};
