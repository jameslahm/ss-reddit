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
  Skeleton,
} from "@chakra-ui/core";
import Editor, { RichText } from "./Editor";
// import editorData from "../assets/editor.json";
import {
  createPost,
  AuthContext,
  generateToast,
  getPost,
  changePost,
} from "../utils";
import { useMutation, useQuery, queryCache } from "react-query";
import { useParams, navigate } from "@reach/router";
import ReactDOM from "react-dom";

function EditPost() {
  const params = useParams();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);

  const {
    data: post = { title: "Hello", content: RichText.INITIAL_DATA },
    isLoading,
    isError,
  } = useQuery(
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
        if (error.status === 401) setAuthStateAndSave(null);
      },
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          try {
            const res = JSON.parse(data.content);
            if (res.blocks && res.version && res.time) {
              setContent(res);
            } else {
              setContent(data.content);
            }
          } catch {
            setContent(data.content);
          }
          setTitle(data.title);
        });
      },
      onSettled: (data) => {},
    }
  );
  const [content, setContent] = useState(post.content);
  const [title, setTitle] = useState(post.title);
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
      const data = await mutate({
        data: { title, content: contentData },
        token: authState.jwt,
        id: params.id,
      });
      toast(generateToast(null, `/post`));
      queryCache.invalidateQueries(["post", params.id, authState.jwt]);
      if (params.id) navigate(`/post/${params.id}`);
      else {
        navigate(`/post/${data.postId}`);
      }
    } catch (err) {
      toast(generateToast(err, `/post`));
    }
  }

  if (isError) {
    return (
      <Box>
        <Skeleton mt={2} height="xs"></Skeleton>
      </Box>
    );
  }

  return (
    <Box mt={4} maxWidth="3xl" width="100%" mx="auto">
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
          <Editor.Input
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
          ></Editor.Input>
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
