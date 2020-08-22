import React, { useContext } from "react";
import Editor from "./Editor";
import { useTheme, Avatar, IconButton, PseudoBox } from "@chakra-ui/core";
import { Box, Flex, Text, Divider, Link } from "@chakra-ui/core";
import formatDistance from "date-fns/formatDistance";
import { FaBookmark, FaRegBookmark, FaReply } from "react-icons/fa";
import { AuthContext } from "../utils";
import { navigate, Link as ReachLink } from "@reach/router";

function PostPreview({ post, onReply, onEdit, type = "post" }) {
  const theme = useTheme();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  return (
    <Box
      mb={3}
      border="1px"
      padding={4}
      borderRadius="md"
      borderColor="blue.500"
    >
      <Flex justifyContent="space-between" alignItems="center">
        <PseudoBox
          _focus={{ outline: "none" }}
          as="button"
          onClick={() => navigate(`/user/${post.userId}`)}
          width="max-content"
          display="flex"
          alignItems="center"
        >
          <Avatar mr={2} size="sm" name={post.nickname}></Avatar>
          <Text fontSize={"md"} mr={2}>
            {post.nickname}
          </Text>
          <Text color="gray.400" fontSize={"sm"}>
            {formatDistance(new Date(post.updated), new Date())}
          </Text>
        </PseudoBox>
        <Box>
          {authState.userId === post.userId ? (
            type === "comment" ? (
              <IconButton
                variant="ghost"
                icon="edit"
                size="lg"
                onClick={onEdit}
              ></IconButton>
            ) : (
              <Link as={ReachLink} to={`/edit/${post.id}`}>
                <IconButton variant="ghost" icon="edit" size="lg"></IconButton>
              </Link>
            )
          ) : null}
          {type === "post" ? (
            <Link as={ReachLink} to={`/post/${post.id}`}>
              <IconButton
                variant="ghost"
                icon="arrow-forward"
                size="lg"
              ></IconButton>
            </Link>
          ) : null}

          {type === "post" ? (
            authState.bookmarks.includes(post.id) ? (
              <IconButton
                icon={FaBookmark}
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  setAuthStateAndSave({
                    ...authState,
                    bookmarks: authState.bookmarks.filter(
                      (id) => id !== post.id
                    ),
                  });
                }}
              ></IconButton>
            ) : (
              <IconButton
                icon={FaRegBookmark}
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  const cachedPosts =
                    JSON.parse(localStorage.getItem("cachedPosts")) || {};
                  cachedPosts[post.id] = post;
                  localStorage.setItem(
                    "cachedPosts",
                    JSON.stringify(cachedPosts)
                  );
                  setAuthStateAndSave({
                    ...authState,
                    bookmarks: authState.bookmarks.concat(post.id),
                  });
                }}
              ></IconButton>
            )
          ) : null}
          {onReply ? (
            <IconButton
              variant="ghost"
              icon={FaReply}
              size="lg"
              onClick={onReply}
            ></IconButton>
          ) : null}
        </Box>
      </Flex>
      <Text>{post.title}</Text>
      <Divider borderColor="gray.300"></Divider>
      <Editor.Output content={post.content} theme={theme}></Editor.Output>
    </Box>
  );
}

export default PostPreview;
