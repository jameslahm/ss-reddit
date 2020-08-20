export const SUCCESS_TOAST = {
  position: "top",
  duration: 3000,
  isClosable: true,
  status: "success",
};

export const FAILURE_TOAST = {
  position: "top",
  duration: 3000,
  isClosable: true,
  status: "error",
};

export const LOGIN_FAILURE = {
  ...FAILURE_TOAST,
  description: "Username or Password not correct",
};

export const LOGIN_SUCCESS = {
  ...SUCCESS_TOAST,
  description: "Login success",
};

export const UNAUTHORIZED_FAILURE = {
  ...FAILURE_TOAST,
  description: "Sorry,You credential has been expired,you need to re-login",
};

export const generateToast = (err, path) => {
  if (err) {
    switch (err.status) {
      case 401: {
        return UNAUTHORIZED_FAILURE;
      }
      case 400: {
        if (path === "/login") {
          return LOGIN_FAILURE;
        }
        break;
      }
      default: {
        return {
          ...FAILURE_TOAST,
          description: err.message,
        };
      }
    }
  }
  switch (path) {
    case "/login": {
      return LOGIN_SUCCESS;
    }
    default: {
      return {
        ...SUCCESS_TOAST,
        description: "Success",
      };
    }
  }
};
