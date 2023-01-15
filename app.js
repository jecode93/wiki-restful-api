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


//////////////////////////// REQUEST TARGETTING ALL ARTICLES ////////////////////////////
/* 
You can create chainable route handlers for a route path by using app.route().
 Because the path is specified at a single location, creating modular routes is helpful, as is 
 reducing redundancy and typos. For more information about routes, see: Router() documentation.

Here is an example of chained route handlers that are defined by using app.route().
*/
app.route('/articles')
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                // console.log(foundArticles);
                // mongoose.connection.close();
                res.send(foundArticles)
            } else {
                console.log(err);
            }
        });
    })
    .post(function (req, res) {

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
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });




//////////////////////////// REQUEST TARGETTING A SPECIFIC ARTICLES ////////////////////////////

app.route('/articles/:articleTitle')

    //Get a specific article
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticles) {
            if (foundArticles) {
                // console.log(foundArticles);
                // mongoose.connection.close();
                res.send(foundArticles);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })


    //PUT a specific article and this method will overwrite our article if we enter a single information,
    //To avoid that we use PATCH
    .put(function (req, res) {

        Article.updateOne(

            { title: req.params.articleTitle }, //Condition to update
            { $set: { title: req.body.title, content: req.body.content } }, //Fields to update
            { overwrite: true }, //Overwrite the content

            //Callback to hold success or error
            function (err) {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            });
    })

    // PATCH a specific article
    .patch(function (req, res) {

        Article.updateOne(

            { title: req.params.articleTitle }, //Condition to update
            { $set: req.body }, //To update the fields that was not change

            //Callback to hold success or error
            function (err) {
                if (!err) {
                    res.send("Successfully updated article.");
                } else {
                    res.send(err);
                }
            });
    })



    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });







//Get all the articles
/*app.get("/articles", function (req, res) {
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
*/

//Post a new article
/*
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
*/


//DELETE All articles

/*app.delete("/articles", function (req, res) {
    Article.deleteMany({}, function (err) {
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

*/

app.listen(3000, function () {
    console.log("Server started on port 3000");
})