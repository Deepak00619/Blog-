var express=require("express");
 app=express();

 expressSanitizer=require("express-sanitizer")

 bodyParser=require("body-parser");

 mongoose=require("mongoose");
 methodOverride=require("method-override");

//APP CONFIG
//mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb+srv://blogapp:blog@restfulrouting-0kfka.mongodb.net/test?retryWrites=true&w=majority");

// mongodb+srv://blogapp:blog@restfulrouting-0kfka.mongodb.net/test?retryWrites=true&w=majority

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//ALWAYS USE IT AFTER BODY-Parser

app.use(expressSanitizer());

app.use(methodOverride("_method"));

//MONGOOSE/MODEL/CONFIG
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
})

//title,image,body,Created
var Blog=mongoose.model("Blog",blogSchema);

//RESTFUL ROUTES

app.get("/",function(req,res){
    res.redirect("/blogs");
})

//INDEX ROUTES
app.get("/blogs",function(req,res){

    //GET ALL THE BLOGS FROM DATABASE
    Blog.find({},function(err,blogs){
        if(err) console.log(err);
        else{
            res.render("index",{blogs: blogs});
        }
    })
    
    
})
// Blog.create({
//     title: "Test Dog",
//     image: "https://unsplash.com/photos/MoDcnVRN5JU",
//     body: "studying Dog"
// });

app.get("/blogs/new",function(req,res){
    res.render("new");
})

//CREATE BLOG
app.post("/blogs",function(req,res){
//create blog
req.body.blog.body=req.sanitize(req.body.blog.body);
Blog.create(req.body.blog,function(err,newBlog){
    if(err) {
       res.render("new");
    }
    else{

        //REDIRECT TO ALL BLOG AFTER ADDING THROUGH SUBMIT BUTTON
        res.redirect("/blogs");
    }
})
});

//SHOW DETAILs or ROUTE 
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        {
            res.redirect("/blogs")
        }else{
            res.render("show",{blog: foundBlog});
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err) res.redirect("/blogs");
        else{
            res.render("edit",{blog: foundBlog});
        }
    })
    
})

// UPDATE ROUTE

app.put("/blogs/:id",function(req,res){
                          //id ,newData, callBack
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updateBlog){
        if(err) {
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
    // destroy blog
    // redirect somewhere
     Blog.findByIdAndRemove(req.params.id,function(err){
         if(err) res.redirect("/blogs");
         else{
            res.redirect("/blogs");
         }
     })
})

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});