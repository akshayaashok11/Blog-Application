import express from "express";
import mongoose from "mongoose";
import articleRouter from "./routes/articles.js";
import Article from "./models/article.js";
import methodOverride from "method-override";

const app = express();

mongoose.connect('mongodb://localhost:27017/BlogDB');

app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.set('view engine','ejs');
app.get('/', async(req, res) => {
    const articles = await Article.find().sort({createdAt:'desc'});
    res.render("../views/articles/index.ejs",{articles : articles}); 
});

app.use('/articles', articleRouter);

app.listen(3000,()=>
{
    console.log("Server listening on port 3000");
}
);
