const cors = require("cors");
const express = require("express");

const serveHealthcheck = require("./actions/serveHealthcheck.js");
const serveNews = require("./actions/serveNews.js");

function createApp(callback) {
  const app = express();
  callback(app);
  return app;
}

module.exports = function createServer() {
  return createApp((app) => {
    app.disable("x-powered-by");
    app.enable("trust proxy");
    app.enable("strict routing");

    app.use(cors());
    app.use(express.static("public", { maxAge: "1y" }));

    app.get("/.well-known/healthcheck", serveHealthcheck);
    app.get("*", serveNews);
  });
};
