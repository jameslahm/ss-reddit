import React, { useState, useEffect, useRef } from "react";
import CustomEmoji from "../CustomEmoji";
import ReactHtmlParser from "react-html-parser";
import EditorInput from "react-editor-js";
import { EDITOR_JS_TOOLS, RENDER_CONFIG, RENDER_STYLE } from "./util";
import {
  ListOutput,
  HeaderOutput,
  EmbedOutput,
  QuoteOutput,
  WarningOutput,
  TableOutput,
  CodeBoxOutput,
  ParagraphOutput,
  ChecklistOutput,
} from "editorjs-react-renderer";
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
  Button,
  useColorMode,
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
      maxRows={10}
    />
  );
});

const WrapperBox = styled(Box)(({ theme, colorMode = "light" }) => {
  const tableBorder = {
    light: "1px solid #CBD5E0",
    dark: "1px solid #718096",
  };
  const selectedBgColor = {
    light: "#e1f2ff",
    dark: "#2a3238",
  };
  return `h1 {
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
    table {
      text-align: center;
      border-collapse: collapse;
      & th {
        border: ${tableBorder[colorMode]};
        padding: 0.5rem;
      }
      & td {
        border: ${tableBorder[colorMode]};
        padding: 0.5rem;
      }
    }
    .image-tool--withBackground .image-tool__image {
      background:inherit !important;
    }
    .ce-block--selected .ce-block__content {
      background-color: ${selectedBgColor[colorMode]};
    }
  `;
});

const RichTextInput = ({ theme, instanceRef, ...props }) => {
  // Here we check data again
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const { colorMode } = useColorMode();
  const editorInstanceRef = useRef(null);
  if (checkMode(props.data) !== "rich-text") {
    return <></>;
  }

  return (
    <WrapperBox theme={theme} colorMode={colorMode}>
      <Box>
        <EditorInput
          // FIXME: multiple times bug
          // enableReInitialize={true}
          minHeight={100}
          logLevel={
            process.env.NODE_ENV === "development" ? "VERBOSE" : "ERROR"
          }
          instanceRef={(instance) => {
            instanceRef.current = instance;
            editorInstanceRef.current = instance;
          }}
          {...props}
        ></EditorInput>
        <Box zIndex={9} position="absolute" right={4} top={2}>
          {isShowEmoji ? (
            <CustomEmoji
              onChange={(emoji) => {
                editorInstanceRef.current.blocks.insert("emoji", {
                  imageUrl: emoji.imageUrl,
                });
                setIsShowEmoji(false);
              }}
              onClose={(e) => setIsShowEmoji(false)}
            ></CustomEmoji>
          ) : (
            <Button
              variant="ghost"
              onClick={(e) => setIsShowEmoji(!isShowEmoji)}
            >
              <span role="img" aria-label="emoji">
                😀
              </span>
            </Button>
          )}
        </Box>
      </Box>
    </WrapperBox>
  );
};

const ImageOutput = ({ data }) => {
  const [status, setStatus] = useState("PREVIEW");
  return (
    <Box
      cursor={status === "PREVIEW" ? "zoom-in" : "zoom-out"}
      maxWidth={status === "PREVIEW" ? "3xs" : "100%"}
      onClick={() => {
        if (status === "PREVIEW") setStatus("ORIGINAL");
        else {
          setStatus("PREVIEW");
        }
      }}
    >
      <figure>
        <Image
          src={data.file.url}
          alt={data.caption || ""}
          maxHeight={status === "PREVIEW" ? "3xs" : "100%"}
          // mx="auto"
          mb={1}
          mx={
            status === "PREVIEW"
              ? "unset"
              : data.withBackground
              ? "auto"
              : "unset"
          }
          width={data.stretched ? "100%" : "unset"}
        />
        {data.caption && (
          <figcaption>{ReactHtmlParser(data.caption)}</figcaption>
        )}
      </figure>
    </Box>
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
              <Box key={index} mb={1} pl={2}>
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
          case "emoji": {
            return (
              <Box key={index} mb={1}>
                <Image src={data.imageUrl}></Image>
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
  INITIAL_DATA: { blocks: [], time: 0, version: "0" },
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
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const { colorMode } = useColorMode();

  return isPreview ? (
    <WrapperBox theme={theme} colorMode={colorMode}>
      <MarkdownStyleWrapper>
        <Box
          minHeight="9rem"
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
    <Box>
      <AutoResizeTextarea
        minHeight="9rem"
        maxHeight={"5xl"}
        overflow="auto"
        value={content || ""}
        onChange={onChange}
      ></AutoResizeTextarea>
      <Box zIndex={9} position="absolute" right={4} top={2}>
        {isShowEmoji ? (
          <CustomEmoji
            onChange={(emoji) => {
              onChange({
                target: {
                  value: (content || "") + `![](${emoji.imageUrl})`,
                },
              });
              setIsShowEmoji(false);
            }}
            onClose={(e) => setIsShowEmoji(false)}
          ></CustomEmoji>
        ) : (
          <Button variant="ghost" onClick={(e) => setIsShowEmoji(!isShowEmoji)}>
            <span role="img" aria-label="emoji">
              😀
            </span>
          </Button>
        )}
      </Box>
    </Box>
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
  INITIAL_DATA: "",
};

const Editor = {
  Input: React.forwardRef(
    ({ labelComponent, content, setContent, isLoading = false }, ref) => {
      // check mode for the first time ,default value
      const [mode, setMode] = useState(checkMode(content));
      useEffect(() => {
        const realMode = checkMode(content);
        if (realMode !== mode) {
          setMode(realMode);
        }
        // Here we only update post content when the request resolved
        // So only need to check once when isLoading turns to be false
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isLoading]);
      const [isPreview, setIsPreview] = useState(false);
      const theme = useTheme();
      return (
        <>
          <Flex mb={2} justifyContent="space-between" alignItems="baseline">
            {labelComponent}
            <Flex alignItems="center">
              <FormLabel htmlFor="edit-mode">Enable Markdown Mode?</FormLabel>
              <Switch
                id="edit-mode"
                value={mode === "markdown"}
                isChecked={mode === "markdown"}
                onChange={() => {
                  if (mode === "markdown") {
                    setMode("rich-text");
                    setContent(RichText.INITIAL_DATA);
                  } else {
                    setMode("markdown");
                    setContent(Markdown.INITIAL_DATA);
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
          <Box position="relative">
            {mode === "rich-text" ? (
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
                    instanceRef={ref}
                    tools={EDITOR_JS_TOOLS}
                    data={content}
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
          </Box>
        </>
      );
    }
  ),
  Output: ({ content, theme }) => {
    const { colorMode } = useColorMode();
    try {
      const data = JSON.parse(content);
      if (data.time && data.blocks && data.version) {
        return (
          <WrapperBox theme={theme} colorMode={colorMode}>
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
        <WrapperBox theme={theme} colorMode={colorMode}>
          <Markdown.Output content={content}></Markdown.Output>
        </WrapperBox>
      );
    }
    return <></>;
  },
};

function checkMode(content) {
  if (typeof content === "object") {
    if (
      Array.isArray(content.blocks) &&
      typeof content.version === "string" &&
      typeof content.time === "number"
    ) {
      return "rich-text";
    }
  } else {
    return "markdown";
  }
}

export default Editor;
export { RichText, Markdown };
