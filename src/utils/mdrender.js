import remark from "remark";
// import emojiA11y from "@fec/remark-a11y-emoji";
import highlight from "rehype-highlight";
import html from "rehype-stringify";
import remark2rehype from "remark-rehype";
import emoji from "remark-emoji";
import math from "remark-math";
import katex from "rehype-katex";
// import sanitize from "rehype-sanitize";

const mdRender = (content) => {
  return (
    remark()
      .use(emoji)
      .use(math)
      // .use(emojiA11y)
      .use(remark2rehype, { allowDangerousHtml: false })
      // .use(sanitize)
      .use(katex)
      .use(highlight, { ignoreMissing: true })
      .use(html, { allowDangerousHtml: false })
      .processSync(content).contents
  );
};

export default mdRender;
