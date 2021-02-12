const createServer = require("./api/createServer.js");

const server = createServer();
const port = process.env.PORT || "8080";

module.exports = server.listen(port, () => {
  console.log("Server listening on port %s, Ctrl+C to quit", port);
});
