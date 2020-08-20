// const remark = require("remark");
// const highlight = require("rehype-highlight");
// const html = require("rehype-stringify");
// const remark2rehype = require("remark-rehype");
// const emoji = require("remark-emoji");
// // const sanitize = require("rehype-sanitize");

// const mdRender = (content) => {
//   return remark()
//     .use(emoji)
//     .use(remark2rehype, { allowDangerousHtml: true })
//     .use(highlight, { ignoreMissing: true })
//     // .use(sanitize)
//     .use(html, { allowDangerousHtml: true })
//     .processSync(content).contents;
// };
// console.log(mdRender("<h2>123</h2>"));

var scrape = require("html-metadata");
const url = require("url");

var u = "https://ss-reddit.vercel.app/login";

scrape(u)
  .then(function (metadata) {
    return {
      success: 1,
      meta: {
        title: metadata.title,
        description: metadata.general.description,
        image: {
          url: url.resolve(u, metadata.general.icons[0].href),
        },
      },
    };
  })
  .catch((res) => {
    return {
      success: 0,
    };
  });
