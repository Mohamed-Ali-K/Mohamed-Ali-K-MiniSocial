const express = require("express");
const app = express();
const port = 3000;

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "fdfdgh5454l",
      title: "Frist server-side post",
      content: "this is coming from the server",
    },
    {
      id: "zerrerf556423ed",
      title: "Second server-side post",
      content: "this is also coming from the server",
    },
  ];
  return res.status(200).json({
      message: 'Posts featched succesfully!',
      posts: posts
  });
});
module.exports = app;