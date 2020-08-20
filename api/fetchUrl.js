var scrape = require("html-metadata");
const url = require("url");
const { allowCors } = require("./utils");

module.exports = allowCors(async (req, res) => {
  const data = await scrape(req.query.url)
    .then(function (metadata) {
      return {
        success: 1,
        meta: {
          title: metadata.general.title,
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
