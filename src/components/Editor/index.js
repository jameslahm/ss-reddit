import React, { useState, useMemo } from "react";
import EditorInput from "react-editor-js";
import { EDITOR_JS_TOOLS, RENDER_CONFIG, RENDER_STYLE } from "./util";
import {
  ListOutput,
  ImageOutput,
  HeaderOutput,
  EmbedOutput,
  QuoteOutput,
  WarningOutput,
  TableOutput,
  CodeBoxOutput,
  ParagraphOutput,
  ChecklistOutput,
} from "editorjs-react-renderer";
import { css } from "@emotion/core";
import { mdRender } from "../../utils";
import {
  Text,
  Textarea,
  Box,
  Flex,
  FormLabel,
  Switch,
  useTheme,
  Image,
  Link,
  Divider,
} from "@chakra-ui/core";
import styled from "@emotion/styled";
import ResizeTextarea from "react-textarea-autosize";

export const AutoResizeTextarea = React.forwardRef((props, ref) => {
  return (
    <Textarea
      transition={"height none"}
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref}
      as={ResizeTextarea}
      {...props}
    />
  );
});

const WrapperBox = styled(Box)(({ theme }) => {
  return css`
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
  `;
});

const RichTextInput = ({ theme, ...props }) => {
  return (
    <WrapperBox theme={theme}>
      <EditorInput
        // FIXME: multiple times bug
        // enableReInitialize={true}
        minHeight={100}
        logLevel={process.env.NODE_ENV === "development" ? "VERBOSE" : "ERROR"}
        {...props}
      ></EditorInput>
    </WrapperBox>
  );
};

const RichTextOutput = ({ style = {}, config = {}, data = {} }) => {
  if (!Array.isArray(data.blocks)) {
    return <></>;
  }
  return (
    <>
      {data.blocks.map((block, index) => {
        const type = block.type;
        const data = block.data;
        switch (type) {
          case "delimiter": {
            return <Divider key={index}></Divider>;
          }
          case "quote": {
            return (
              <Box mb={1} key={index}>
                <QuoteOutput
                  data={data}
                  style={style.checkBox || {}}
                  config={config.checkBox || {}}
                ></QuoteOutput>
              </Box>
            );
          }
          case "checklist": {
            return (
              <Box mb={1} key={index}>
                <ChecklistOutput
                  data={data}
                  style={style.checklist || {}}
                  config={config.checklist || {}}
                ></ChecklistOutput>
              </Box>
            );
          }
          case "header": {
            return (
              <Box key={index} mb={1}>
                <HeaderOutput
                  data={data}
                  style={style.header || {}}
                  config={config.header || {}}
                ></HeaderOutput>
              </Box>
            );
          }
          case "image": {
            return (
              <Box key={index} mb={1}>
                <ImageOutput
                  data={data}
                  style={style.image || {}}
                  config={config.image || {}}
                ></ImageOutput>
              </Box>
            );
          }
          case "embed": {
            return (
              <Box key={index} mb={1}>
                <EmbedOutput
                  data={data}
                  style={style.embed || {}}
                  config={config.embed || {}}
                ></EmbedOutput>
              </Box>
            );
          }
          case "table": {
            return (
              <Box key={index} mb={1}>
                <TableOutput
                  data={data}
                  style={style.table || {}}
                  config={config.table || {}}
                ></TableOutput>
              </Box>
            );
          }
          case "list": {
            return (
              <Box key={index} mb={1}>
                <ListOutput
                  data={data}
                  style={style.list || {}}
                  config={config.list || {}}
                ></ListOutput>
              </Box>
            );
          }
          case "warning": {
            return (
              <Box key={index} mb={1}>
                <WarningOutput
                  data={data}
                  style={style.warning || {}}
                  config={config.warning || {}}
                ></WarningOutput>
              </Box>
            );
          }
          case "codeBox": {
            return (
              <Box key={index} mb={1}>
                <CodeBoxOutput
                  data={data}
                  style={style.codeBox || {}}
                  config={config.codeBox || {}}
                ></CodeBoxOutput>
              </Box>
            );
          }
          case "linkTool": {
            return (
              <Box key={index} mb={1}>
                <Link
                  _hover={{ boxShadow: "0 0 3px rgba(0,0,0, .16)" }}
                  boxShadow={"0 1px 3px rgba(0,0,0, .1)"}
                  display="flex"
                  border={"1px solid rgba(201, 201, 204, 0.48)"}
                  borderRadius={"6px"}
                  href={data.link}
                  isExternal
                  p={4}
                >
                  <Flex flexDirection="column" flexGrow={1}>
                    <Text fontWeight={"600"}>{data.meta.title}</Text>
                    <Text>{data.meta.description}</Text>
                    <Text color="gray.500" fontSize={"xs"}>
                      {data.link}
                    </Text>
                  </Flex>
                  <Image
                    size="65px"
                    objectFit="cover"
                    src={data.meta.image.url}
                    alt={data.title}
                  ></Image>
                </Link>
              </Box>
            );
          }
          case "paragraph": {
            return (
              <Box key={index} mb={1}>
                <ParagraphOutput
                  data={data}
                  style={style.paragraph || {}}
                  config={config.paragraph || {}}
                ></ParagraphOutput>
              </Box>
            );
          }
          default:
            return <></>;
        }
      })}
    </>
  );
};

const RichText = {
  Input: RichTextInput,
  Output: RichTextOutput,
};

const MarkdownStyleWrapper = styled.div`
  & a {
    text-decoration: underline;
  }
  & ul {
    margin-left: 1rem;
  }
  & ol {
    margin-left: 1rem;
  }
`;

const MarkdownInput = ({ content, theme, isPreview, onChange }) => {
  return isPreview ? (
    <WrapperBox theme={theme}>
      <MarkdownStyleWrapper>
        <Box
          minHeight="10rem"
          p={3}
          pt={2}
          border="1px"
          borderRadius="md"
          borderColor="blue.500"
          dangerouslySetInnerHTML={{ __html: mdRender(content) }}
        ></Box>
      </MarkdownStyleWrapper>
    </WrapperBox>
  ) : (
    <AutoResizeTextarea
      minHeight="10rem"
      value={content || ""}
      onChange={onChange}
    ></AutoResizeTextarea>
  );
};

const MarkdownOutput = ({ content }) => {
  return (
    <MarkdownStyleWrapper>
      <Box dangerouslySetInnerHTML={{ __html: mdRender(content) }}></Box>
    </MarkdownStyleWrapper>
  );
};

const Markdown = {
  Input: MarkdownInput,
  Output: MarkdownOutput,
};

const Editor = {
  Input: React.forwardRef(
    ({ labelComponent, content, setContent, isLoading = false }, ref) => {
      const [mode, setMode] = useState(checkMode(content));
      const realMode = useMemo(() => checkMode(content), [content]);
      if (realMode !== mode) {
        setMode(realMode);
      }
      const [isPreview, setIsPreview] = useState(false);
      const theme = useTheme();
      if (isPreview) console.timeEnd("Preview");
      return (
        <>
          <Flex mb={2} justifyContent="space-between" alignItems="center">
            {labelComponent}
            <Flex alignItems="center">
              <FormLabel htmlFor="edit-mode">Enable Markdown Mode?</FormLabel>
              <Switch
                id="edit-mode"
                value={mode === "markdown"}
                isChecked={mode === "markdown"}
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
                      console.time("Preview");
                      setIsPreview(!isPreview);
                    }}
                  ></Switch>
                </Box>
              ) : null}
            </Flex>
          </Flex>

          {realMode === "rich-text" ? (
            <Box
              pt={1}
              // TODO: check height
              // Better UX
              minHeight={144}
              border="1px"
              borderRadius="md"
              borderColor="blue.500"
              maxHeight={"5xl"}
              overflow="auto"
              px={8}
            >
              {isLoading ? null : (
                <RichText.Input
                  theme={theme}
                  instanceRef={(instance) => (ref.current = instance)}
                  tools={EDITOR_JS_TOOLS}
                  data={JSON.parse(content)}
                />
              )}
            </Box>
          ) : (
            <Markdown.Input
              content={content}
              isPreview={isPreview}
              theme={theme}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></Markdown.Input>
          )}
        </>
      );
    }
  ),
  Output: ({ content, theme }) => {
    try {
      const data = JSON.parse(content);
      if (data.time && data.blocks && data.version) {
        return (
          <WrapperBox theme={theme}>
            <RichText.Output
              style={RENDER_STYLE}
              config={RENDER_CONFIG}
              data={data}
            ></RichText.Output>
          </WrapperBox>
        );
      }
    } catch (err) {
      return (
        <WrapperBox theme={theme}>
          <Markdown.Output content={content}></Markdown.Output>
        </WrapperBox>
      );
    }
    return <></>;
  },
};

function checkMode(content) {
  console.log(content);
  if (!content) {
    return "markdown";
  }
  try {
    const data = JSON.parse(content);
    console.log(data);
    if (data.blocks) {
      return "rich-text";
    }
  } catch (err) {
    return "markdown";
  }
  return "markdown";
}

export default Editor;
