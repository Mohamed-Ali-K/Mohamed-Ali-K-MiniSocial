const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.UserData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      console.log(createdPost);
      res.status(201).json({
        message: "Post added sucessfully!",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed!!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.UserData.userId })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post Deleted!" });
      } else {
        res.status(401).json({ message: "Not authorize !" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't delete the post!",
      });
    });
};

exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.UserData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.UserData.userId }, post)
    .then((result) => {
      console.log(result);
      if (result.nModified > 0) {
        res.status(200).json({ message: "Post Updated!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post Not Found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't Featche the post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let featchedPost;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      featchedPost = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts featched succesfully!",
        posts: featchedPost,
        maxPost: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't Featche all posts!",
      });
    });
};