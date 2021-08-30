const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");
const { result } = require("lodash");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
const dbUrl =
  "mongodb+srv://sama:680223655@learnnodejs.ussrk.mongodb.net/blogwithAngelaYu?retryWrites=true&w=majority";

app.set("view engine", "ejs");

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(process.env.PORT || 3000, function () {
      console.log("Server started on port 3000");
    })
  )
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// let blogs = [];
// let topic = "blogs[0].id";
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
});

const Blog = new mongoose.model("blog", blogSchema);

// app.get("/test", (req, res) => {
//   const blog = new Blog({
//     title: "what do men want",
//     post: "Love, attention, peace of mine with u, trust and loyalty",
//   });

//   blog
//     .save()
//     .then((result) => res.send(result))
//     .catch((err) => console.log(err));
// });

app.get("/", (req, res) => {
  Blog.find()
    .then((result) => {
      res.render("home", { homeStartingContent, blogs: result });
    })
    .catch((err) => console.log(err));
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/post/:blogname", (req, res) => {
  Blog.find()
    .then((result) => {
      const topic = _.lowerCase(req.params.blogname);
      result.forEach((blog) => {
        let storedtitle = _.lowerCase(blog.title);
        let storetitle = blog.title;
        let storebody = blog.post;
        let id = blog._id;

        if (storedtitle === topic) {
          res.render("post", { storetitle, storebody, id });
        }
      });
    })
    .catch((err) => console.log(err));
});

app.delete("/post/:id", (req, res) => {
  const id = req.params.id;
  // Blog.findOneAndUpdate(
  //   { id: id },
  //   { $pull: { blogs: { _id: id } } },
  //   (err, found) => {
  //     if (!err) {
  //       res.redirect("/");
  //     }
  //   }
  // );
  // console.log(id);

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((err) => console.log(err));
});

app.post("/compose", (req, res) => {
  const blog = new Blog({
    title: req.body.postTitle,
    post: req.body.postBody,
  });

  blog
    .save()
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
});
