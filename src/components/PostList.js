import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import { getPosts, AuthContext } from "../utils";
import { Skeleton, Box } from "@chakra-ui/core";
import PostPreview from "./PostPreview";

function PostList() {
  const pageSize = 10;
  const { authState } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery(
    ["posts", pageSize, page, authState.jwt],
    (key, size, page, token) => {
      return getPosts({ page, size }, token);
    }
  );
  return isLoading ? (
    <Skeleton mt={5} height="md"></Skeleton>
  ) : (
    <Box mt={5}>
      {data.posts.map((post) => (
        <PostPreview key={post.id} post={post}></PostPreview>
      ))}
    </Box>
  );
}

export default PostList;
