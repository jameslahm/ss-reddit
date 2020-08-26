const remark = require("remark");
const highlight = require("rehype-highlight");
const html = require("rehype-stringify");
const remark2rehype = require("remark-rehype");
const emoji = require("remark-emoji");
const math = require("remark-math");
const katex = require("rehype-katex");
// const sanitize = require("rehype-sanitize");

const mdRender = (content) => {
  return (
    remark()
      .use(emoji)
      .use(math)
      .use(remark2rehype, { allowDangerousHtml: false })
      // .use(sanitize)
      .use(katex)
      .use(highlight, { ignoreMissing: true })
      .use(html, { allowDangerousHtml: false })
      .processSync(content).contents
  );
};

const fs = require("fs");
const a = fs.readFileSync("example.md");
console.log(mdRender(a));
