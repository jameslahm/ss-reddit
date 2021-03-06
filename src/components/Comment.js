import React, { useContext, useState, useRef } from "react";
import PostPreview from "./PostPreview";
import { AuthContext, replyPost, generateToast, changeReply } from "../utils";
import { queryCache } from "react-query";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  useToast,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/core";
import Editor from "./Editor";
import { useMutation } from "react-query";

function Comment({ comments, id, postId }) {
  const comment = comments.find((comment) => comment.id === id);
  const toast = useToast();
  const { authState } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const editorInstanceRef = useRef(null);
  const [errors, setErrors] = useState({ content: "" });
  const [status, setStatus] = useState("IDLE");
  const [isOpen, setIsOpen] = useState(false);

  const [mutateReplyPost] = useMutation(replyPost, {
    onSuccess: () => {
      queryCache.invalidateQueries(["post", postId, authState.jwt]);
    },
  });
  const [mutateEditReply] = useMutation(changeReply, {
    onSuccess: () => {
      queryCache.invalidateQueries(["post", postId, authState.jwt]);
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
      switch (status) {
        case "REPLY": {
          await mutateReplyPost({
            data: { content: contentData, replyId: id },
            token: authState.jwt,
            id: postId,
          });
          break;
        }
        case "EDIT": {
          await mutateEditReply({
            data: { content: contentData },
            token: authState.jwt,
            id: postId,
            replyId: id,
          });
          break;
        }
        default:
          return;
      }
      toast(generateToast(null, `/post`));
    } catch (err) {
      toast(generateToast(err, `/post`));
    }
    setStatus("IDLE");
  }

  const form = (
    <form onSubmit={handleSubmit}>
      <FormControl isInvalid={errors.content}>
        <Editor.Input
          labelComponent={<Text>{status}</Text>}
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
  );

  return (
    <Box mt={3} minWidth="29rem">
      <Flex alignItems="center">
        <IconButton
          variant="ghost"
          icon={isOpen ? "chevron-up" : "chevron-down"}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          mr={2}
          ml={2}
        ></IconButton>
        {status === "EDIT" ? (
          <Box flexGrow={1} px={"px"}>
            {form}
          </Box>
        ) : (
          <Box flexGrow={1}>
            <PostPreview
              type="comment"
              post={comment}
              onReply={() => {
                setContent("");
                setStatus("REPLY");
              }}
              onEdit={() => {
                try {
                  const res = JSON.parse(comment.content);
                  if (
                    Array.isArray(res.blocks) &&
                    typeof res.version === "string" &&
                    typeof res.time === "number"
                  ) {
                    setContent(res);
                  } else {
                    setContent(comment.content);
                  }
                } catch {
                  setContent(comment.content);
                }
                // setContent(comment.content);
                setStatus("EDIT");
              }}
            ></PostPreview>
          </Box>
        )}
      </Flex>
      {status === "REPLY" ? <Box px={"px"}>{form}</Box> : null}
      {/* <Divider></Divider> */}
      {isOpen ? (
        <Box ml={12}>
          {comments
            .filter((comment) => comment.replyId === id)
            .map((comment) => (
              <Comment
                key={comment.id}
                comments={comments}
                id={comment.id}
                postId={postId}
              ></Comment>
            ))}
        </Box>
      ) : null}
    </Box>
  );
}

export default Comment;
