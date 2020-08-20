import React, { useState, useRef, useContext } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Button,
  Flex,
  useToast,
  Spinner,
} from "@chakra-ui/core";
import Editor from "./Editor";
// import editorData from "../assets/editor.json";
import {
  createPost,
  AuthContext,
  generateToast,
  getPost,
  changePost,
} from "../utils";
import { useMutation, useQuery } from "react-query";
import { useParams } from "@reach/router";

function EditPost() {
  const params = useParams();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);

  const { data: post = {}, isLoading } = useQuery(
    ["post", params.id, authState.jwt],
    (key, id, token) => getPost(id, token),
    {
      enabled: params.id,
      // initialData: { title: "Hell", content: JSON.stringify(editorData) },
      // initialStale: true,
      staleTime: Infinity,
      retry: false,
      onError: (error) => {
        toast(generateToast(error, "/"));
        setAuthStateAndSave(null);
      },
      onSuccess: (data) => {
        setContent(data.content);
        setTitle(data.title);
        console.log("success");
      },
      onSettled: (data) => {
        console.log("Settled");
      },
    }
  );
  const [content, setContent] = useState(post.content || "{}");
  const [title, setTitle] = useState(post.title || "Hello");
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [mutate] = useMutation(params.id ? changePost : createPost);
  const toast = useToast();
  const editorInstanceRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    errors.title = title ? "" : "Title can't be empty";
    if (errors.title) {
      setErrors({ ...errors });
      return;
    }

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
        data: { title, content: contentData },
        token: authState.jwt,
        id: params.id,
      });
      toast(generateToast(null, `/post/${params.id}`));
    } catch (err) {
      toast(generateToast(err, `/post/${params.id}`));
    }
  }

  return (
    <Box mt={12} maxWidth="3xl" width="100%" mx="auto">
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={errors.title}>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Input>
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>
        <FormControl mt={4} isInvalid={errors.content}>
          <Editor.Input.Component
            isLoading={isLoading}
            content={content}
            labelComponent={
              <FormLabel display="flex" alignItems="center" htmlFor="content">
                Content
                {isLoading ? (
                  <Spinner ml={5} color="blue.500" size="md" />
                ) : null}
              </FormLabel>
            }
            setContent={setContent}
            ref={editorInstanceRef}
          ></Editor.Input.Component>
          <FormErrorMessage>{errors.content}</FormErrorMessage>
        </FormControl>
        <Flex mt={4} justifyContent="flex-end">
          <Button type="submit" variantColor="teal">
            submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default EditPost;
