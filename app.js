const mongoose = require("mongoose");
const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB");

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// Requests targeting all articles
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function (req, res) {
    const requestedTitle = req.body.title;
    const requestedContent = req.body.content;
    const article = new Article({
      title: requestedTitle,
      content: requestedContent,
    });

    article.save(function (err) {
      if (!err) {
        res.send("Successfully added an article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

// Requests targeting a specific article
app
  .route("/articles/:topic")
  .get(function (req, res) {
    Article.findOne({ title: req.params.topic }, function (err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.topic },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.topic },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.topic }, function (err) {
      if (!err) {
        res.send("Successfully deleted article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server successfully connected");
});
