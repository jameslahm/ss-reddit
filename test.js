const remark = require("remark");
const highlight = require("rehype-highlight");
const html = require("rehype-stringify");
const remark2rehype = require("remark-rehype");
const emoji = require("remark-emoji");
const sanitize = require("rehype-sanitize");

const mdRender = (content) => {
  return (
    remark()
      .use(emoji)
      .use(remark2rehype, { allowDangerousHtml: true })
      .use(sanitize)
      .use(highlight, { ignoreMissing: true })
      .use(html, { allowDangerousHtml: true })
      .processSync(content).contents
  );
};

const mdRender2 = (content) => {
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
const fs=require('fs')
const a = fs.readFileSync('test.md');
console.log(mdRender(a));
// var scrape = require("html-metadata");
// const url = require("url");

// scrape("https://baidu.com")
// .then(function (metadata) {
//   return {
//     success: 1,
//     meta: {
//       title: metadata.general.title,
//       description: metadata.general.description,
//       image: {
//         url: url.resolve("https://baidu.com", metadata.general.icons[0].href),
//       },
//     },
//   };
// })
// .catch((res) => {
//   return {
//     success: 0,
//   };
// }).then(data=>console.log(data));
