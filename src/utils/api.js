const BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://simplebbs.iterator-traits.com/api/v1`
    : `https://ss-reddit.vercel.app/api/proxy`;

class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const CONTENT_TYPE_JSON = "application/json";
const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new HTTPError(data.message, res.status);
  } else {
    return data;
  }
};

export const login = (data) => {
  return fetch(`${BASE_URL}/login`, {
    method: "PATCH",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
    method: "PATCH",
  }).then(handleRes);
};

export const getProfile = (token) => {
  return fetch(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getUser = (id, token) => {
  return fetch(`${BASE_URL}/user/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getPosts = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(`${BASE_URL}/post?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token,
      Accept: "*/*",
    },
  }).then(handleRes);
};

export const createPost = ({ data, token }) => {
  return fetch(`${BASE_URL}/post`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
  }).then(handleRes);
};

export const changePost = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/post/${id}`, {
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    method: "PUT",
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const getPost = (id, token) => {
  return fetch(`${BASE_URL}/post/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const replyPost = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/post/${id}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const changeReply = ({ data, token, id, replyId }) => {
  return fetch(`${BASE_URL}/post/${id}/reply/${replyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

const IMGBB_TOKEN = "ea9ddc83d672b53c3aa2f9ae19c5ecd6";

export const uploadImage = (file) => {
  const body = new FormData();
  body.append("key", IMGBB_TOKEN);
  body.append("image", file);
  return fetch(`https://api.imgbb.com/1/upload`, {
    method: "POST",
    body,
  }).then((res) => {
    if (res.ok) {
      return res
        .json()
        .then((v) => ({ success: 1, file: { url: v.data.display_url } }));
    } else {
      return { success: 0 };
    }
  });
};
