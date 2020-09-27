const Vue = require("vue");
const express = require("express");
const renderer = require("vue-server-renderer").createRenderer();
const server = express();

server.get("/", (req, res) => {
  const app = new Vue({
    template: `
    <div id="app">
      <h1>{{message}}</h1>
    </div>
    `,
    data: {
      message: "你好",
    },
  });
  renderer.renderToString(app, (err, html) => {
    if (err) {
      console.log(err);
      return res.status(500).end("Internal Server Erroe");
    }

    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  });
});
server.listen(3000, () => {
  console.log("server run at 3000!!!!!");
});
