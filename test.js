const remark = require("remark");
const highlight = require("rehype-highlight");
const html = require("rehype-stringify");
const remark2rehype = require("remark-rehype");
const emoji = require("remark-emoji");
// const sanitize = require("rehype-sanitize");

const mdRender = (content) => {
  return remark()
    .use(emoji)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(highlight, { ignoreMissing: true })
    // .use(sanitize)
    .use(html, { allowDangerousHtml: true })
    .processSync(content).contents;
};
console.log(mdRender("<h2>123</h2>"));
