import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@bomdi/codebox";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "../../utils";
import CustomEmojiBlock from "./emoji";

const EDITOR_JS_TOOLS = {
  embed: {
    inlineToolbar: true,
    class: Embed,
  },
  table: Table,
  marker: Marker,
  list: List,
  warning: Warning,
  codeBox: Code,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: "https://ss-reddit.vercel.app/api/fetchUrl",
    },
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile(file) {
          return uploadImage(file);
        },
        uploadByUrl(url) {
          return Promise.resolve({
            success: 1,
            file: {
              url: url,
            },
          });
        },
      },
    },
  },
  // raw: Raw,
  header: Header,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  // simpleImage: SimpleImage,
  emoji: {
    class: CustomEmojiBlock,
  },
};

const RENDER_STYLE = {
  list: {
    marginLeft: "2rem",
  },
  checklist: {
    label: {
      marginLeft: "0.5rem",
    },
    item: {
      marginLeft: "0.5rem",
    },
  },
  table: {
    table: {
      marginLeft: "0.5rem",
      textAlign: "center",
      borderCollapse: "collapse",
    },
    tr: {},
    th: { border: "1px solid #E2E8F0", padding: "0.5rem" },
    td: { border: "1px solid #E2E8F0", padding: "0.5rem" },
  },
  paragraph: {
    marginLeft: "0.5rem",
  },
  image: {
    img: {},
    figcaption: {},
    figure: {},
  },
};

const RENDER_CONFIG = {
  embed: {
    disableDefaultStyle: true,
  },
  table: {
    disableDefaultStyle: true,
  },
  marker: {
    disableDefaultStyle: true,
  },
  list: {
    disableDefaultStyle: true,
  },
  warning: {
    disableDefaultStyle: true,
  },
  codeBox: {
    disableDefaultStyle: true,
  },
  linkTool: {
    disableDefaultStyle: true,
  },
  image: {
    disableDefaultStyle: true,
  },
  raw: {
    disableDefaultStyle: true,
  },
  header: {
    disableDefaultStyle: true,
  },
  quote: {
    disableDefaultStyle: true,
  },
  checklist: {
    disableDefaultStyle: true,
  },
  inlineCode: {
    disableDefaultStyle: true,
  },
  simpleImage: {
    disableDefaultStyle: true,
  },
  paragraph: {
    disableDefaultStyle: true,
  },
};

export { EDITOR_JS_TOOLS, RENDER_CONFIG, RENDER_STYLE };
