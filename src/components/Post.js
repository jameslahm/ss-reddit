import React, { useContext, useState, useRef } from "react";
import PostPreview from "./PostPreview";
import { useParams } from "@reach/router";
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
  Divider,
} from "@chakra-ui/core";
import Editor from "./Editor";
import { useMutation, queryCache } from "react-query";
import Comment from "./Comment";
import Paginate from "./Paginate";

function Post() {
  const params = useParams();
  const toast = useToast();
  const { authState } = useContext(AuthContext);
  const [content, setContent] = useState(null);
  const editorInstanceRef = useRef(null);
  const [errors, setErrors] = useState({ content: "" });
  const { data: post, isLoading } = useQuery(
    ["post", params.id, authState.jwt],
    (key, id, token) => getPost(id, token),
    {
      enabled: params.id,
    }
  );
  const [status, setStatus] = useState("IDLE");

  const [page, setPage] = useState(1);
  const [mutate] = useMutation(replyPost, {
    onSuccess: () => {
      console.log(["post", params.id, authState.jwt]);
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
      toast(generateToast(null, `/post/${params.id}`));
    } catch (err) {
      toast(generateToast(err, `/post/${params.id}`));
    }
    setStatus("IDLE");
  }
  return isLoading ? (
    <Skeleton mt={3} height="xs"></Skeleton>
  ) : (
    <Box mt={3}>
      <PostPreview
        post={post}
        onReply={() => {
          setContent(null);
          setStatus("REPLY");
        }}
      ></PostPreview>
      {status === "REPLY" ? (
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={errors.content}>
            <Editor.Input.Component
              labelComponent={"Reply"}
              content={content}
              setContent={setContent}
              ref={editorInstanceRef}
            ></Editor.Input.Component>
            <FormErrorMessage>{errors.content}</FormErrorMessage>
          </FormControl>
          <Flex justifyContent="flex-end" mt={2}>
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
      <Divider></Divider>
      {post.reply
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
      <Flex mt={1} justifyContent="flex-end">
        <Paginate
          page={page}
          setPage={setPage}
          pageCount={Math.ceil(
            post.reply.filter((reply) => reply.replyId === 0).length / PAGE_SIZE
          )}
        ></Paginate>
      </Flex>
    </Box>
  );
}

export default Post;
