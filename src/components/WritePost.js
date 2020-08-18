import React, { useState, useRef, useContext } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  PseudoBox,
  useTheme,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/core";
import Editor, { EDITOR_JS_TOOLS } from "./Editor";
import { Global, css } from "@emotion/core";
import editorData from "../assets/editor.json";
import {
  createPost,
  AuthContext,
  FAILURE_TOAST,
  SUCCESS_TOAST,
} from "../utils";
import { useMutation } from "react-query";

function WritePost() {
  const [title, setTitle] = useState("");
  const [content] = useState(editorData);
  const [errors, setErrors] = useState({ title });
  const editorInstanceRef = useRef(null);
  const theme = useTheme();
  const [mutate] = useMutation(createPost);
  const { authState } = useContext(AuthContext);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    errors.title = title ? "" : "Title can't be empty";
    if (errors.title) {
      setErrors({ ...errors });
      return;
    }
    const contentData = await editorInstanceRef.current.save();
    try {
      const res = await mutate({
        data: { title, content: JSON.stringify(contentData) },
        token: authState.jwt,
      });
      const data = await res.json();
      if (!res.ok) {
        throw Error(data.message);
      }
      toast({
        ...SUCCESS_TOAST,
        description: "Save Success",
      });
    } catch (err) {
      toast({
        ...FAILURE_TOAST,
        description: err.message,
      });
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
          <FormLabel htmlFor="content">Content</FormLabel>
          <GlobalStyle theme={theme}></GlobalStyle>
          <PseudoBox
            pt={1}
            border="1px"
            borderRadius="md"
            borderColor="blue.500"
            maxHeight={"5xl"}
            overflow="auto"
          >
            <Editor.Input
              instanceRef={(instance) => (editorInstanceRef.current = instance)}
              tools={EDITOR_JS_TOOLS}
              data={content}
            />
          </PseudoBox>
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

const GlobalStyle = ({ theme }) => {
  return (
    <Global
      styles={css`
        h1 {
          font-size: ${theme.fontSizes["5xl"]};
        }
        h2 {
          font-size: ${theme.fontSizes["4xl"]};
        }
        h3 {
          font-size: ${theme.fontSizes["3xl"]};
        }
        h4 {
          font-size: ${theme.fontSizes["2xl"]};
        }
        h5 {
          font-size: ${theme.fontSizes["xl"]};
        }
        h6 {
          font-size: ${theme.fontSizes.lg};
        }
      `}
    ></Global>
  );
};

export default WritePost;
