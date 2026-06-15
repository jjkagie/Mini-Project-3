import express from "express";
import bodyParser from "body-parser"
const app = express();
const port = 3000;
let blogPosts = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {  
    res.render("index.ejs", {
        posts: blogPosts
    });
});

app.post("/", (req, res) => {
    let index = parseInt(req.body.btnEdit, 10);
    blogPosts[index] = {
        name: req.body["name"],
        title: req.body["title"],
        content: req.body["content"],
        tag: req.body["tag"],
        time: blogPosts[index]["time"]
    }

    res.redirect("/");
})

app.post("/delete", (req, res) => {
    let index = parseInt(req.body.btnDel, 10);
    blogPosts.splice(index, 1);
    res.redirect("/");
})

app.post("/edit", (req, res) => {
    let index = parseInt(req.body.btnEdit, 10)
    let post = blogPosts[ index ];
    res.render("edit.ejs", {
        name: post["name"],
        title: post["title"],
        content: post["content"],
        index: index
    })
})

app.post("/create", (req, res) => {
    let date = new Date().toString();
    date = date.substring(0,date.indexOf("GMT")-1);
    blogPosts.push({
        name: req.body["name"],
        title: req.body["title"],
        content: req.body["content"],
        tag: req.body["tag"],
        time: date
    });
    res.redirect("/");
});

app.post("/search", (req, res) => {
    let filteredPosts = [];
    let filteredTag = req.body["tagFilter"];

    blogPosts.forEach((post) => {
        if( post["tag"] == filteredTag ){
            filteredPosts.push(post);
        }
    });
    if( filteredTag == "default" ){
        res.redirect("/");
    }
    else {
        res.render("index.ejs", {
            posts: filteredPosts
        })
    }   
})

function editPost(index){
    app.get("/edit", (req, res) => {
        res.render("edit.ejs", {
            post: blogPosts[index],
            index: index                    
        });
    });
}



app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})