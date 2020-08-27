import React, { useContext, useState, useRef } from "react";
import { useParams, navigate } from "@reach/router";
import { AuthContext, PAGE_SIZE, generateToast, getUser } from "../utils";
import {
  Box,
  Stack,
  Skeleton,
  Avatar,
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  useToast,
} from "@chakra-ui/core";
import { useQuery } from "react-query";
import { getPosts } from "../utils";
import PostPreview from "./PostPreview";
import Paginate from "./Paginate";

const HistoryPost = () => {
  const [page, setPage] = useState(1);
  const { current: historyPosts } = useRef(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const { current: cachedPosts } = useRef(
    JSON.parse(localStorage.getItem("cachedPosts")) || {}
  );
  return (
    <Box mt={5}>
      {historyPosts
        .map((id) => cachedPosts[id])
        .reverse()
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map((post) => (
          <PostPreview key={post.id} post={post}></PostPreview>
        ))}
      <Flex mt={1} justifyContent="flex-end">
        <Paginate
          pageCount={Math.ceil(historyPosts.length / PAGE_SIZE)}
          page={page}
          setPage={setPage}
        ></Paginate>
      </Flex>
    </Box>
  );
};

const BookMarkPost = () => {
  const { authState } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const { current: cachedPosts } = useRef(
    JSON.parse(localStorage.getItem("cachedPosts")) || {}
  );
  const postsId = authState.bookmarks;
  return (
    <Box mt={5}>
      {postsId
        .map((id) => cachedPosts[id])
        .reverse()
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map((post) => (
          <PostPreview key={post.id} post={post}></PostPreview>
        ))}
      <Flex mt={1} justifyContent="flex-end">
        <Paginate
          pageCount={Math.ceil(postsId.length / PAGE_SIZE)}
          page={page}
          setPage={setPage}
        ></Paginate>
      </Flex>
    </Box>
  );
};

function Profile() {
  const params = useParams();
  const [page, setPage] = useState(1);
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const toast = useToast();

  const { data, isLoading: isPostsLoading, isError: isPostsError } = useQuery(
    ["post", PAGE_SIZE, page, params.id, authState.jwt],
    (key, size, page, id, token) => getPosts({ size, page, userId: id }, token),
    {
      retry: false,
      onError: (error) => {
        toast(generateToast(error, "/user"));
        if (error.status === 401) setAuthStateAndSave(null);
      },
    }
  );

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery(
    ["user", params.id, authState.jwt],
    (key, id, token) => getUser(id, token),
    {
      retry: false,
      onError: (error) => {
        if (error.status === 404) {
          toast(generateToast(error, "/user"));
          navigate(`/`);
        }
      },
    }
  );

  const isLoading = isPostsLoading || isUserLoading;
  const isError = isPostsError || isUserError;

  if (isLoading || isError) {
    return <Skeleton mt={3} height="md"></Skeleton>;
  }

  return (
    <Stack spacing={8}>
      <Flex mt={4} alignItems="center">
        <Avatar size="lg" name={user.nickname}></Avatar>
        <Box ml={4}>
          <Text>{user.nickname}</Text>
          <Flex>
            <Text color="gray.500">Total Posts: </Text>
            <Text ml={1}>{data.total}</Text>
          </Flex>
        </Box>
      </Flex>
      <Tabs variant="enclosed" variantColor="teal">
        <TabList>
          <Tab>Posts</Tab>
          <Tab isDisabled={authState.userId !== user.id}>History</Tab>
          <Tab isDisabled={authState.userId !== user.id}>BookMarks</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
          </TabPanel>
          <TabPanel>
            <HistoryPost></HistoryPost>
          </TabPanel>
          <TabPanel>
            <BookMarkPost></BookMarkPost>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

export default Profile;
