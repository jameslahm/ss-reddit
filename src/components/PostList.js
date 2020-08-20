import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import { getPosts, AuthContext, PAGE_SIZE, generateToast } from "../utils";
import { Skeleton, Flex, Box, useToast } from "@chakra-ui/core";
import PostPreview from "./PostPreview";
import Paginate from "./Paginate.js";

function PostList() {
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const toast = useToast();
  const { data, isLoading } = useQuery(
    ["posts", PAGE_SIZE, page, authState.jwt],
    (key, size, page, token) => {
      return getPosts({ page, size }, token);
    },
    {
      retry: false,
      onError: (error) => {
        toast(generateToast(error, "/"));
        setAuthStateAndSave(null);
      },
    }
  );

  return isLoading ? (
    <>
      <Skeleton mt={5} height="3xs"></Skeleton>
      <Skeleton mt={5} height="3xs"></Skeleton>
      <Skeleton mt={5} height="3xs"></Skeleton>
    </>
  ) : (
    <Box mt={5}>
      {data.posts.map((post) => (
        <PostPreview key={post.id} post={post}></PostPreview>
      ))}
      <Flex mt={1} justifyContent="flex-end">
        <Paginate
          pageCount={Math.ceil(data.total / PAGE_SIZE)}
          page={page}
          setPage={setPage}
        ></Paginate>
      </Flex>
    </Box>
  );
}

export default PostList;
