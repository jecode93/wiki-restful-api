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





app.listen(3000, function () {
    console.log("App listen on port 3000");
})