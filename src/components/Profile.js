import React, { useContext, useState } from "react";
import { useParams } from "@reach/router";
import { AuthContext, PAGE_SIZE, generateToast } from "../utils";
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
  const historyPosts = JSON.parse(localStorage.getItem("history")) || [];
  return (
    <Box mt={5}>
      {historyPosts
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
  const posts = authState.bookmarks;
  return (
    <Box mt={5}>
      {posts
        .reverse()
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map((post) => (
          <PostPreview key={post.id} post={post}></PostPreview>
        ))}
      <Flex mt={1} justifyContent="flex-end">
        <Paginate
          pageCount={Math.ceil(posts.length / PAGE_SIZE)}
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

  const { data, isLoading, isError } = useQuery(
    ["post", PAGE_SIZE, page, params.id, authState.jwt],
    (key, size, page, id, token) => getPosts({ size, page, userId: id }, token),
    {
      retry: false,
      onError: (error) => {
        toast(generateToast(error, "/"));
        if (error.status === 401) setAuthStateAndSave(null);
      },
    }
  );

  if (isLoading || isError) {
    return <Skeleton mt={8} height="md"></Skeleton>;
  }

  const user = {
    nickname: data.posts[0] ? data.posts[0].nickname : "",
    userId: params.id,
  };

  return (
    <Stack spacing={8}>
      <Flex mt={8} alignItems="center">
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
          <Tab isDisabled={authState.userId !== user.userId}>History</Tab>
          <Tab isDisabled={authState.userId !== user.userId}>BookMarks</Tab>
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
