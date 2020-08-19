import React, { useState, useRef } from "react";
import EditorInput from "react-editor-js";
import { EDITOR_JS_TOOLS, RENDER_CONFIG, RENDER_STYLE } from "./tools";
import EditorOutput from "editorjs-react-renderer";
import { Global, css } from "@emotion/core";
import { mdRender } from "../../utils";
import {
  Textarea,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  useTheme,
} from "@chakra-ui/core";
import ResizeTextarea from "react-textarea-autosize";

export const AutoResizeTextarea = React.forwardRef((props, ref) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref}
      minRows={10}
      as={ResizeTextarea}
      {...props}
    />
  );
});

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

const Editor = {
  Input: {
    RichText: ({ theme, ...props }) => {
      return (
        <>
          <GlobalStyle theme={theme}></GlobalStyle>
          <EditorInput minHeight={100} {...props}></EditorInput>
        </>
      );
    },
    Markdown: ({ content, theme, isPreview, onChange }) => {
      return isPreview ? (
        <>
          <GlobalStyle theme={theme}></GlobalStyle>
          <Box
            minHeight="10rem"
            p={3}
            border="1px"
            borderRadius="md"
            borderColor="blue.500"
            dangerouslySetInnerHTML={{ __html: mdRender(content) }}
          ></Box>
        </>
      ) : (
        <Textarea
          minHeight="10rem"
          resize="vertical"
          value={content || ""}
          onChange={onChange}
        ></Textarea>
      );
    },
    Component: React.forwardRef(
      ({ labelComponent, content, setContent }, ref) => {
        const [mode, setMode] = useState(checkMode(content));
        const [isPreview, setIsPreview] = useState(false);
        const theme = useTheme();

        return (
          <>
            <Flex mb={2} justifyContent="space-between" alignItems="center">
              {labelComponent}
              <Flex alignItems="center">
                <FormLabel htmlFor="edit-mode">Enable Markdown Mode?</FormLabel>
                <Switch
                  id="edit-mode"
                  value={mode === "markdown"}
                  isChecked={mode==='markdown'}
                  onChange={() => {
                    setContent(null);
                    if (mode === "markdown") setMode("rich-text");
                    else {
                      setMode("markdown");
                    }
                  }}
                />

                {mode === "markdown" ? (
                  <Box ml={3}>
                    <FormLabel htmlFor="is-preview">Preview?</FormLabel>
                    <Switch
                      id="is-preview"
                      value={isPreview}
                      onChange={() => {
                        setIsPreview(!isPreview);
                      }}
                    ></Switch>
                  </Box>
                ) : null}
              </Flex>
            </Flex>

            {mode === "rich-text" ? (
              <Box
                pt={1}
                border="1px"
                borderRadius="md"
                borderColor="blue.500"
                maxHeight={"5xl"}
                overflow="auto"
                px={3}
              >
                <Editor.Input.RichText
                  theme={theme}
                  instanceRef={(instance) => (ref.current = instance)}
                  tools={EDITOR_JS_TOOLS}
                  data={JSON.parse(content)}
                />
              </Box>
            ) : (
              <Editor.Input.Markdown
                content={content}
                isPreview={isPreview}
                theme={theme}
                onChange={(e) => setContent(e.target.value)}
              ></Editor.Input.Markdown>
            )}
          </>
        );
      }
    ),
  },
  Render: ({ theme, ...props }) => {
    return (
      <>
        <GlobalStyle theme={theme}></GlobalStyle>
        <EditorOutput
          style={RENDER_STYLE}
          config={RENDER_CONFIG}
          {...props}
        ></EditorOutput>
      </>
    );
  },
  Output: ({ content, theme }) => {
    try {
      const data = JSON.parse(content);
      if (data.time && data.blocks && data.version) {
        return <Editor.Render theme={theme} data={data}></Editor.Render>;
      }
    } catch (err) {
      return (
        <Box dangerouslySetInnerHTML={{ __html: mdRender(content) }}></Box>
      );
    }
    return <></>;
  },
};

function checkMode(content) {
  if(!content){
    return 'markdown'
  }
  try {
    JSON.parse(content);
    // if (data.time && data.blocks && data.version) {
    return "rich-text";
    // }
  } catch (err) {
    return "markdown";
  }
}

export default Editor;
export { EDITOR_JS_TOOLS };
