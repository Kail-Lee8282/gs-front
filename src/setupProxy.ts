import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app: any) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "127.0.0.1:3000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
