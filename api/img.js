const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({
  target: "https://i.ibb.co/",
  changeOrigin: true,
});
const { allowCors } = require("./utils");

proxy.on("proxyReq", function (proxyReq, req, res, options) {
  proxyReq.setHeader("Accept", "*/*");
  // proxyReq.setHeader("Host", "https://ibb.co");
  proxyReq.setHeader("Referer", "https://ibb.co");
});

module.exports = allowCors(async (req, res) => {
  req.url = new URL(req.query.url).pathname;
  console.log(req.url);
  console.log("Proxy...");
  await proxy.web(req, res);
});
