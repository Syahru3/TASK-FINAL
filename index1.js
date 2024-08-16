//CONST PACKAGE
const express = require("express");
const app = express();
const port = 3000;

const db = require("./src/lib/db");
const { QueryTypes } = require("sequelize");

const session = require("express-session");
const flash = require("express-flash");
const multer = require("multer");
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploadImage/");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        },
    }),
});

//APP SET
app.set("view engine", "hbs");
app.set("views", "views");
app.set("trust proxy", 1);

//Setup untuk mengaktifkan file static
app.use("/assets", express.static("assets"));
app.use("/uploads", express.static("uploads"));
app.use(
  session({
     secret: "dumswey",
     cookie: { maxAge: 3600000, secure: false, httpOnly: true },
     saveUninitialized: true,
     resave: false,
     store: new session.MemoryStore(),
  })
);
app.use(flash());

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

//CONST BLOG
const blogs = [{}];

//ROUTING
app.get("/", (req, res) => {
  res.render("index", {
    data: "Hello Chipi Chipi Chapa Chapa",
  });
});

//APP GET NAVBAR
app.get("/blog", renderBlog);
app.get("/testimonial", renderTestimonial);
app.get("/contact", renderContact);
// app.post("/blog", addBlog);

//APP GET BLOG
app.get("/blog-detail/:blog_id", renderBlogDetail);
app.get("/edit-blog/:blog_id", renderEditBlog);
app.get("/delete-blog/:blog_id", deleteBlog);
app.post("/edit-blog/:blog_id", editBlog);
app.post("/blog", upload.single("image"), addBlog);

//APP GET LOGIN & REGISTER
app.get("/login", renderLogin);
// app.get("/register", renderRegister);
// app.post("/login", login);
// app.post("/register", register);
// app.get("/logout", logout);

//FUNCTION
async function renderBlog(req, res) {
    const isLogin = req.session.isLogin;

    // const query = `SELECT * FROM blog;`;
    // const result = await db.query(query, { type: QueryTypes.SELECT });
 
    res.render("blog", {
       data: result,
       isLogin: isLogin,
       user: req.session.user,
    });
}

async function addBlog (req, res) {
  try {
    const user = req.session.user;
    console.log(req.body);
    console.log(req.file);

    // const newBlog = {
    // id: blogs.length + 1,
    // title: req.body.title,
    // content: req.body.content,
    // createdAt: new Date(),
    // author: "Syahru",
    // };

    // blogs.push(newBlog);

    // const query = `INSERT INTO blog (title, content, created_at, author, image)
    // VALUES ('${req.body.title}', '${req.body.content}', NOW(), 'Syahru')`;

  const query = `INSERT INTO public.blogs(
    id, title, content, image)
    VALUES (${req.body.id}, '${req.body.title}', '${req.body.content}', ${req.body.image})`;

  await db.query(query);

  res.redirect("/blog");
  } catch (error) {
  console.log(error);
  }
}

function renderTestimonial(req, res) {
  res.render("testimonial");
}

function renderContact(req, res) {
  res.render("contact");
}

//FUNCTION BLOG CARD
async function renderBlogDetail(req, res) {
  const id = req.params.blog_id;

  const blog = await db.query(`SELECT * FROM blog WHERE id = ${id}`, {
    type: QueryTypes.SELECT,
  });
 
  res.render("blog-detail", {
    data: blog[0],
  });
}

async function renderEditBlog(req, res) {
  const id = req.params.blog_id;

  const blog = await db.query(`SELECT * FROM blog WHERE id = ${id}`, {
    type: QueryTypes.SELECT,
  });

  res.render("edit-blog", {
    data: blog[0],
  });
}

async function editBlog(req, res) {
    try{
        const id = req.params.blog_id;
        const newBlog = {
            id: id,
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date(),
            author: "Cundus",
        };

        // const index = blogs.findIndex((blog) => blog.id == id);

        // blogs[index] = newBlog;

        const query = `
        UPDATE blog
        SET 
        title = '${newBlog.title}',
        content = '${newBlog.content}' 
        WHERE id = ${id}`;

            await db.query(query);

            res.redirect("/blog");
        } catch (error) {
            console.log(error);
        }
  }

async function deleteBlog(req, res) {
  const id = req.params.blog_id;

//   const index = blogs.findIndex((blog) => blog.id == id);

//   blogs.splice(index, 1);

    const query = `DELETE FROM blog WHERE id = ${id}`;
    await db.query(query);

    res.redirect("/blog");
}

//FUNCTION LOGIN & REGISTER
function renderLogin(req,res) {
    const isLogin = req.session.isLogin;
    if (isLogin) {
       req.flash("error", "anda harus login terlebih dahulu");
       res.redirect("/blog");
       return;
    }
       res.render("login");
}

// async function login(req,res) {
//     try {
//         const query = `
//         SELECT * FROM users
//         WHERE
//         email = '${req.body.email}'
//         AND
//         password = '${req.body.password}'
//         `;
//         const existUser = await db.query(query, {
//            type: QueryTypes.SELECT,
//         });
  
//         if (existUser.length == 0) {
//            req.flash("error", "login gagal");
//            res.redirect("/login");
//            return;
//         }
  
//         req.session.user = existUser[0];
//         req.session.isLogin = true;
  
//         req.flash("succes", "login sukses");
//         res.redirect("/blog");
//      } catch (error) {
//         console.log(error);
  
//         res.redirect("/login");
//      }
// }

// function renderRegister(req,res) {
//     console.log(req.session);
//     const isLogin = req.session.isLogin;
//     if (isLogin) {
//        req.flash("error", "anda harus login terlebih dahulu");
//        res.redirect("/blog");
//        return;
//     }
 
//     res.render("register");
// }

// async function register(req,res) {
//     try {
//         const query = `
//         INSERT INTO public.users
//         (fullname, email, password)
//         VALUES
//         ('${req.body.fullname}', '${req.body.email}', '${req.body.password}')
//         `;
  
//         await db.query(query, { type: QueryTypes.INSERT });
//         console.log("SUKSES REGIST");
//         req.flash("succes", "register berjalan");
//         res.redirect("/register");
//      } catch (error) {
//         console.log("error", error);
  
//         res.redirect("/register");
//      }
//   }
  
// function logout(req, res) {
//      req.session.destroy();
//      res.redirect("/login");
// }

//AKHIR ROUTES
app.listen(port, () => {
  console.log(`server berjalan di port ${port}`);
});



