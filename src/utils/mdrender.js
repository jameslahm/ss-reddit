import remark from "remark";
// import emojiA11y from "@fec/remark-a11y-emoji";
import highlight from "rehype-highlight";
import html from "rehype-stringify";
import remark2rehype from "remark-rehype";
import emoji from "remark-emoji";
import sanitize from "rehype-sanitize";

const mdRender = (content) => {
  return (
    remark()
      .use(emoji)
      // .use(emojiA11y)
      .use(remark2rehype, { allowDangerousHtml: true })
      .use(highlight, { ignoreMissing: true })
      .use(sanitize)
      .use(html, { allowDangerousHtml: true })
      .processSync(content).contents
  );
};

export default mdRender;
