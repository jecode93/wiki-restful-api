const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");



app = express(); // Create new app instance using express
app.set("view engine", "ejs"); // To use the ejs view engine
app.use(bodyParser.urlencoded({ extended: true })); // To request data from the body page
app.use(express.static("public")); // To load static files

//Database concection
const dbname = "wikiDB";
const url = "mongodb://0.0.0.0:27017/";
mongoose.set("strictQuery", true);
mongoose.connect(url + dbname, { useNewUrlParser: true });

//Article Schema
const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

//Article model
const Article = mongoose.model("Article", articleSchema);

//Get all the articles
app.get("/articles", function (req, res) {
    Article.find({}, function (err, foundArticles) {
        if (!err) {
            // console.log(foundArticles);
            // mongoose.connection.close();
            res.send(foundArticles)
        } else {
            console.log(err);
        }
    });
});


//Post a new article
app.post("/articles", function (req, res) {

    const newArticle = Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function (err) {
        if (!err) {
            res.send("Successfully added new article.");
        } else {
            res.send(err);
        }
    });
})


//DELETE All articles
app.delete("/articles", function (req, res) {
    Article.deleteMany({}, function (err) {
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});



app.listen(3000, function () {
    console.log("App listen on port 3000");
})