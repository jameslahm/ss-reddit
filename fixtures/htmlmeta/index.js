var scrape = require("html-metadata");
const url = require("url");

scrape("https://baidu.com")
  .then(function (metadata) {
    return {
      success: 1,
      meta: {
        title: metadata.general.title,
        description: metadata.general.description,
        image: {
          url: url.resolve("https://baidu.com", metadata.general.icons[0].href),
        },
      },
    };
  })
  .catch((res) => {
    return {
      success: 0,
    };
  })
  .then((data) => console.log(data));
