import express from "express";
import Article from "../models/article.js";
const router = express.Router();

router.get("/new", (req, res) => {
    res.render("../views/articles/new.ejs", {article:new Article()});
});

router.get("/edit/:id", async(req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("../views/articles/edit.ejs", {article: article});
});

router.get("/:slug", async(req,res)=>
{
    const article = await Article.findOne({slug:req.params.slug});
    if(article == null)
        res.redirect('/');
    res.render("../views/articles/show.ejs", {article:article});
});

router.delete("/:id",async(req,res)=>
{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

function saveArticle(path)
{
    return async(req,res)=>{
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try
        {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        }
        catch(e)
        {
            res.render(`../views/articles/${path}.ejs`, {article:article});
        }
    }
}

router.post("/",async(req,res,next)=>
{
    req.article = new Article();
    next();   
},saveArticle('new'));

router.put("/:id",async(req,res,next)=>
{
    req.article = await Article.findById(req.params.id);
    next();
},saveArticle('edit'));

export default router;
