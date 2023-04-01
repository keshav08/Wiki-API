const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = "mongodb+srv://keshav:keshav@fruitsdb.h9iaxc9.mongodb.net/wikiDB";
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Mongoose databade is connected successfully");
})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);


// Request targeting all Articles

app.route("/articles")
.get((req, res)=>{
    Article.find({})
    .then((FoundArticles) => { res.send(FoundArticles); })
    .catch((err)=>{console.log(err)});
})
.post((req, res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save()
    .then(()=>{res.send("Successfully added new article")})
    .catch((err)=>{res.send(err)});
})
.delete((req, res)=>{
    Article.deleteMany()
    .then(()=>{res.send ("Successfully deleted all articles")});
}); 


// Request targeting Specific Article

app.route("/articles/:articleTitle")
.get((req, res)=>{
    Article.findOne({title: req.params.articleTitle})
    .then((foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }
        else {
            res.send("No articles matching with given title is found");
        }
    })
})
.put((req, res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content}
    )
    .then(()=>{res.send("Successfully updated the article")})
    .catch((err)=>{res.send(err)});
})
.patch((req, res)=>{
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body}
    )
    .then(()=>{res.send("Successfully updated the article")})
    .catch((err)=>{res.send(err)});
})
.delete((req, res)=>{
    Article.deleteOne({title: req.params.articleTitle})
    .then(()=>{res.send("Successfully deleted the corresponding article.")})
    .catch((err)=>{res.send(err)});
})

let port = 3000;
app.listen(port, ()=>{
    console.log("Ready to rock");
});