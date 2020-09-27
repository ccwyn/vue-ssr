const Vue = require("vue");
const express = require("express");
const renderer = require("vue-server-renderer").createRenderer();
const server = express();
const fs = require("fs");

server.get("/", (req, res) => {
  const app = new Vue({
    template: fs.readFileSync("./index.templates.html", "utf-8"),
  });
  renderer.renderToString(
    app,
    {
      title: "拉钩教育",
    },
    (err, html) => {
      if (err) {
        console.log(err);
        return res.status(500).end("Internal Server Erroe");
      }

      res.setHeader("Content-Type", "text/html; charset=utf8");
      res.end(html);
    }
  );
});
server.listen(3000, () => {
  console.log("server run at 3000!!!!!");
});
