const httpProxy = require("http-proxy");
const proxy = httpProxy.createProxyServer({
  target: "http://simplebbs.iterator-traits.com",
});
const { allowCors } = require("./utils");

proxy.on("proxyReq", function (proxyReq, req, res, options) {
  proxyReq.setHeader("Accept", "*/*");
  proxyReq.setHeader("Host", "simplebbs.iterator-traits.com");
});

module.exports = allowCors(async (req, res) => {
  req.url = req.url.replace("/proxy", "/v1");
  console.log(req.url);
  console.log("Proxy...");
  await proxy.web(req, res);
});
