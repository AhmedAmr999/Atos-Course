//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

// app.get("/articles", (req, res) => {
//   Article.find()
//     .then((foundArticles) => {
//       console.log(foundArticles);
//       res.send(foundArticles);
//     })
//     .catch((err) => {
//       res.send(err);
//       console.log(err);
//     });
// });

// app.post("/articles", (req, res) => {
//   console.log(req.body.title);
//   console.log(req.body.content);

//   const postedArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   postedArticle
//     .save()
//     .then(() => {
//       res.send("successfully added a new article");
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

// app.delete("/articles", (req, res) => {
//   Article.deleteMany()
//     .then(() => {
//       res.send("successfully deleted all articles");
//     })
//     .catch((err) => {
//       res.send(err);
//     });
// });

app
  .route("/articles")
  .get((req, res) => {
    Article.find()
      .then((foundArticles) => {
        console.log(foundArticles);
        res.send(foundArticles);
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const postedArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    postedArticle
      .save()
      .then(() => {
        res.send("successfully added a new article");
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete((req, res) => {
    Article.deleteMany()
      .then(() => {
        res.send("successfully deleted all articles");
      })
      .catch((err) => {
        res.send(err);
      });
  });

///////////////////////////////////Requests targetting specific article////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        res.send("successfully found article " + foundArticle);
      })
      .catch((err) => {
        res.send("cannot find article please enter a valid title " + err);
      });
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content }
    )
      .then((article) => {
        res.send("successfully updated article " + article);
      })
      .catch((err) => {
        res.send("cannot update article please enter a valid title " + err);
      });
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body }
    )
      .then((article) => {
        res.send("successfully updated article " + article);
      })
      .catch((err) => {
        res.send("cannot update article please enter a valid title " + err);
      });
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle })
      .then((article) => {
        res.send("successfully deleted article " + article);
      })
      .catch((err) => {
        res.send("cannot delete article please enter a valid title " + err);
      });
  });
app.listen(3000, () => {
  console.log("Server Started on port 3000");
});
