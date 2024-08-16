//CONST PACKAGE
const express = require("express");
const app = express();
const port = 3000;

//APP SET
app.set("view engine", "hbs");
app.set("views", "views");

//Setup untuk mengaktifkan file static
app.use("/assets", express.static("assets"));

//CONST card
const cards = [{}];

//ROUTING
app.get("/", (req, res) => {
  res.render("index", {
    data: "Hello Chipi Chipi Chapa Chapa",
  });
});

//APP GET NAVBAR
app.get("/login", renderLogin);
app.get("/register", renderRegister);


app.get("/edit-card", renderEditCard)
app.post("/edit-card/:card_id", editCard);
// app.post("/edit-card", addCard);

//FUNCTION
function renderLogin (req,res) { 
  res.render("login");
}

function renderRegister (req,res) { 
  res.render("register");
}

function renderEditCard (req,res) { 
  res.render("edit-card");
}

function editCard (req,res) { 
  const id = req.params.card_id;
  const newCard = {
     id: id,
     title: req.body.title,
     content: req.body.content,
     createdAt: new Date(),
  };

const index = blogs.findIndex((blog) => blog.id == id);

blogs[index] = newBlog;

res.redirect("/blog");
// res.render("edit-card");
}

// async function addCard (req, res) {
//     console.log(req.body);

//   const newCard = {
//     id: blogs.length + 1,
//     title: req.body.title,
//     content: req.body.content,
//     createdAt: new Date(),
//     author: "Syahru",
//  };

//  blogs.push(newBlog);

//  res.redirect("/blog");
// }

//AKHIR ROUTES
app.listen(port, () => {
  console.log(`server berjalan di port ${port}`);
});



