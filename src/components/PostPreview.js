import React, { useContext } from "react";
import Editor from "./Editor";
import { useTheme, Avatar, IconButton, PseudoBox } from "@chakra-ui/core";
import { Box, Flex, Text, Divider } from "@chakra-ui/core";
import formatDistance from "date-fns/formatDistance";
import { FaBookmark, FaRegBookmark, FaReply } from "react-icons/fa";
import { AuthContext } from "../utils";
import { navigate } from "@reach/router";

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
            <IconButton
              variant="ghost"
              icon="edit"
              size="lg"
              onClick={
                onEdit
                  ? onEdit
                  : () => {
                      navigate(`/edit/${post.id}`);
                    }
              }
            ></IconButton>
          ) : null}
          {type === "post" ? (
            <IconButton
              variant="ghost"
              icon="arrow-forward"
              size="lg"
              onClick={() => {
                const historyPosts =
                  JSON.parse(localStorage.getItem("history")) || [];
                if (!historyPosts.find((p) => p.id === post.id)) {
                  historyPosts.push(post);
                }
                localStorage.setItem("history", JSON.stringify(historyPosts));
                navigate(`/post/${post.id}`);
              }}
            ></IconButton>
          ) : null}

          {type === "post" ? (
            authState.bookmarks.find((p) => p.id === post.id) ? (
              <IconButton
                icon={FaBookmark}
                variant="ghost"
                size="lg"
                onClick={(e) => {
                  setAuthStateAndSave({
                    ...authState,
                    bookmarks: authState.bookmarks.filter(
                      (p) => p.id !== post.id
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
                  setAuthStateAndSave({
                    ...authState,
                    bookmarks: authState.bookmarks.concat(post),
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
