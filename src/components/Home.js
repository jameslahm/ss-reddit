import React, { useState, useContext } from "react";
import { useQuery } from "react-query";
import { getPosts, AuthContext, PAGE_SIZE, generateToast } from "../utils";
import { Skeleton, Flex, Box, useToast } from "@chakra-ui/core";
import PostPreview from "./PostPreview";
import Paginate from "./Paginate.js";
import { useLocation } from "@reach/router";

function Home() {
  const location = useLocation();
  console.log(location);

  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const [page, setPage] = useState(location.state.page || 1);
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
        if (error.status === 401) setAuthStateAndSave(null);
      },
    }
  );

  return isLoading ? (
    <Box>
      <Skeleton mt={5} height="3xs"></Skeleton>
      <Skeleton mt={5} height="3xs"></Skeleton>
      <Skeleton mt={5} height="3xs"></Skeleton>
    </Box>
  ) : (
    <Box mt={5}>
      {data.posts.map((post) => (
        <PostPreview key={post.id} post={post}></PostPreview>
      ))}
      <Flex mt={1} justifyContent="flex-end">
        <Paginate
          pageCount={Math.ceil(data.total / PAGE_SIZE)}
          page={page}
          setPage={(p) => {
            location.state.page = p;
            setPage(p);
          }}
        ></Paginate>
      </Flex>
    </Box>
  );
}

export default Home;
