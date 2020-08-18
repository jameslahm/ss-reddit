const BASE_URL = `http://simplebbs.iterator-traits.com/api/v1`;

const CONTENT_TYPE_JSON = "application/json";

export const login = (data) => {
  return fetch(`${BASE_URL}/login`, {
    method: "PATCH",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  });
};

export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
    method: "PATCH",
  });
};

export const getProfile = (token) => {
  return fetch(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
};

export const getPosts = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(`${BASE_URL}/post?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
};

export const createPost = ({ data, token }) => {
  return fetch(`${BASE_URL}/post`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
  });
};

export const changePost = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/post/${id}`, {
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const getPost = (id) => {
  return fetch(`${BASE_URL}/post/${id}`, {
    method: "GET",
  });
};

export const replyPost = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/post/${id}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
};

export const changeReply = ({ data, token, id, replyId }) => {
  return fetch(`${BASE_URL}/post/${id}/reply/${replyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
};
