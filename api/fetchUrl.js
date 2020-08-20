var scrape = require("html-metadata");
const url = require("url");

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another option
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

module.exports = allowCors(async (req, res) => {
  const data = await scrape(req.query.url)
    .then(function (metadata) {
      return {
        success: 1,
        meta: {
          title: metadata.title,
          description: metadata.general.description,
          image: {
            url: url.resolve(req.query.url, metadata.general.icons[0].href),
          },
        },
      };
    })
    .catch((res) => {
      return {
        success: 0,
      };
    });
  res.status(200).send(data);
});
