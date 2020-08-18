import React, { useState, useContext } from "react";
import { usePaginatedQuery } from "react-query";
import { getPosts, AuthContext } from "../utils";

function PostList() {
  const pageSize = 10;
  const { authState } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isError,
    error,
    resolvedData,
    latestData,
    isFetching,
  } = usePaginatedQuery(
    ["posts", pageSize, page, authState.jwt],
    (key, size, page, token) => {
      console.log(size, page, token);
      return getPosts({ page, size }, token);
    }
  );
  return isLoading ? <div></div> : <div>{console.log(data)}</div>;
}

export default PostList;
