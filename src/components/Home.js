import React, { useContext } from "react";
import { useQuery } from "react-query";
import { getPosts, AuthContext, PAGE_SIZE, generateToast } from "../utils";
import { Skeleton, Flex, Box, useToast } from "@chakra-ui/core";
import PostPreview from "./PostPreview";
import Paginate from "./Paginate.js";
import qs from "query-string";
import { useLocation, navigate } from "@reach/router";

function Home() {
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const location = useLocation();
  let page = parseInt(qs.parse(location.search).page || 1);
  const toast = useToast();
  const { data, isLoading, isError } = useQuery(
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
      onSuccess: (data) => {
        const cachedPosts =
          JSON.parse(localStorage.getItem("cachedPosts")) || {};
        data.posts.forEach((v) => {
          if (cachedPosts[v.id]) {
            cachedPosts[v.id] = v;
          }
        });
        localStorage.setItem("cachedPosts", JSON.stringify(cachedPosts));
      },
    }
  );
  if (isLoading || isError) {
    return (
      <Box>
        <Skeleton mt={5} height="3xs"></Skeleton>
        <Skeleton mt={5} height="3xs"></Skeleton>
        <Skeleton mt={5} height="3xs"></Skeleton>
      </Box>
    );
  } else {
    const pageCount = Math.ceil(data.total / PAGE_SIZE);
    return (
      <Box mt={5}>
        {data.posts.map((post) => (
          <PostPreview key={post.id} post={post}></PostPreview>
        ))}
        <Flex mt={1} justifyContent="flex-end">
          <Paginate
            pageCount={pageCount}
            page={page}
            setPage={(p) => {
              navigate(`/?page=${p}`);
            }}
          ></Paginate>
        </Flex>
      </Box>
    );
  }
}

export default Home;
