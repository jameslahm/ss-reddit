import React, { useContext, useState, useRef } from "react";
import PostPreview from "./PostPreview";
import { useParams, navigate } from "@reach/router";
import {
  AuthContext,
  getPost,
  replyPost,
  generateToast,
  PAGE_SIZE,
} from "../utils";
import { useQuery } from "react-query";
import {
  Skeleton,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  useToast,
  Flex,
  Switch,
  FormLabel,
  Text,
  useColorMode,
} from "@chakra-ui/core";
import Editor from "./Editor";
import { useMutation, queryCache } from "react-query";
import Comment from "./Comment";
import Paginate from "./Paginate";

function Post() {
  const params = useParams();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const borderColor = {
    light: "gray.100",
    dark: "gray.500",
  };
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const editorInstanceRef = useRef(null);
  const [errors, setErrors] = useState({ content: "" });
  const { data: post, isLoading, isError } = useQuery(
    ["post", params.id, authState.jwt],
    (key, id, token) => getPost(id, token),
    {
      enabled: params.id,
      retry: false,
      onError: (error) => {
        toast(generateToast(error, "/post"));
        if (error.status === 401) setAuthStateAndSave(null);
        if (error.status === 400) {
          navigate(`/`);
        }
      },
      onSuccess: (data) => {
        const cachedPosts =
          JSON.parse(localStorage.getItem("cachedPosts")) || {};
        const historyPosts = JSON.parse(localStorage.getItem("history")) || [];
        if (!historyPosts.includes(data.id)) {
          historyPosts.push(data.id);
          cachedPosts[data.id] = data;
        } else {
          cachedPosts[data.id] = data;
        }
        localStorage.setItem("history", JSON.stringify(historyPosts));
        localStorage.setItem("cachedPosts", JSON.stringify(cachedPosts));
      },
    }
  );

  const [status, setStatus] = useState("IDLE");
  const [isOnlyAuthor, setIsOnlyAuthor] = useState(false);

  const [page, setPage] = useState(1);
  const [mutate] = useMutation(replyPost, {
    onSuccess: () => {
      queryCache.invalidateQueries(["post", params.id, authState.jwt]);
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let contentData;
      if (editorInstanceRef.current && editorInstanceRef.current.save) {
        contentData = JSON.stringify(await editorInstanceRef.current.save());
      } else {
        contentData = content;
      }
      errors.content = contentData ? "" : "Content can't be empty";
      if (errors.content) {
        setErrors({ ...errors });
        return;
      }
      await mutate({
        data: { content: contentData },
        token: authState.jwt,
        id: params.id,
      });
      toast(generateToast(null, `/post`));
    } catch (err) {
      toast(generateToast(err, `/post`));
    }
    setStatus("IDLE");
  }
  return isLoading || isError ? (
    <Skeleton mt={3} height="xs"></Skeleton>
  ) : (
    <Box mt={3}>
      <FormControl mb={1}>
        <FormLabel htmlFor="only-author">Only See Author</FormLabel>
        <Switch
          value={isOnlyAuthor}
          onChange={() => {
            setIsOnlyAuthor(!isOnlyAuthor);
            setPage(1);
          }}
        ></Switch>
      </FormControl>
      <PostPreview
        post={post}
        onReply={() => {
          setContent("");
          setStatus("REPLY");
        }}
      ></PostPreview>
      {status === "REPLY" ? (
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={errors.content}>
            <Editor.Input
              labelComponent={<Text>REPLY</Text>}
              content={content}
              setContent={setContent}
              ref={editorInstanceRef}
            ></Editor.Input>
            <FormErrorMessage>{errors.content}</FormErrorMessage>
          </FormControl>
          <Flex justifyContent="flex-end" mt={2} mb={2}>
            <Button
              variantColor="teal"
              onClick={() => {
                setStatus("IDLE");
              }}
            >
              Cancel
            </Button>
            <Button variantColor="teal" type="submit" ml={3}>
              Submit
            </Button>
          </Flex>
        </form>
      ) : null}
      <Box
        overflow="auto"
        border="1px"
        borderRadius="md"
        borderColor={borderColor[colorMode]}
      >
        {(isOnlyAuthor
          ? post.reply.filter((reply) => reply.userId === post.userId)
          : post.reply
        )
          .filter((reply) => reply.replyId === 0)
          .reverse()
          .slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page)
          .map((reply) => (
            <Comment
              id={reply.id}
              key={reply.id}
              postId={params.id}
              comments={post.reply}
            ></Comment>
          ))}
      </Box>
      <Flex mt={5} justifyContent="flex-end">
        <Paginate
          page={page}
          setPage={setPage}
          pageCount={Math.ceil(
            (isOnlyAuthor
              ? post.reply.filter((reply) => reply.userId === post.userId)
              : post.reply
            ).filter((reply) => reply.replyId === 0).length / PAGE_SIZE
          )}
        ></Paginate>
      </Flex>
    </Box>
  );
}

export default Post;
