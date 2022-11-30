// create a W9D3 folder, create a movies folder
// create a server.js touch server.js
// create a new npm project npm init -y
// install dependencies npm i express mongoose method-override express-react-views react react-dom dotenv morgan
// morgan is a New dependency that helps us with debugging
// install nodemon as a dev dependency npm i --save-dev nodemon OR use npm i -D nodemon
// this will let people know the nodemon is only needed in development not production helpful for when we deploy
// setup the following scripts in package.json:
// "scripts": {
//     "start": "node server.js",
//     "dev": "nodemon server.js"
//   },

// Summary of Dependencies:
// - express => web framework for create server and writing routes

// - mongoose => ODM for connecting to and sending queries to a mongo database

// - method-override => allows us to swap the method of a request based on a URL query

// - express-react-views => the templating engine

// - dotenv => will allow us to use a `.env` file to define environmental variables we can access via the `process.env` object

// - morgan => logs details about requests to our server, mainly to help us debug

// Seeding Our Database
// Before we build all our crud routes we should get some sample data in our database. There are two ways we can facilitate this:

// 1. Seed Route: A route on our server when requested will delete everything in our database and re-seed it with some starter data
// 2. Seed File: A script we can run (usually called seed.js) that'll empty and re-seed our database.
// We'll create a seed route for now, later I'll also Show you how to setup a seed file when we refactor the application later on.

// Setting Up Our Views
// create a views and public folder mkdir views public
// in the public folder let's make a css and javascript file touch public/styles.css public/app.js
// make a fruits folder in views mkdir views/movies
// make a Default.jsx in your views folder touch views/Default.jsx
// in the Default.jsx file add the following

// Our Default Layout is now going to use more Sematic HTML
// Semantic HTML:
// Semantic Grouping Tags
// <header></header>Intruductory content of the body, section, or article.
// <main></main>Main Content of the body
// <article></article>Self-Contained Content that can be distributed on its own and would make sense
// <section></section>Thematically grouped content that is not distributable
// <footer></footer>Closing, Conclusion or Ending Content of the body, section, or article.. Usually Copyright and Footer navigation information outside the main content of site
// <nav></nav>Navigation links often a child of header or footer
// <aside></aside>Indirectly related non vital content, usually used for sidebars.

// Most used HTML tags
// <h1></h1>Heading from h1 through h6
// <p></p>Paragraph
// <img src="imgsource" alt="alternative text"/>Image tags
// <ul></ul>Unordered list and <ol></ol>ordered list
// <li></li>A list item inside a list
// <pre></pre>Preformatted text
// <br/>Line break
// <hr/>Horizontal Rule Tag
// <a href="website to go to"> Text to display for link</a>Anchor tag to make hyperlinks
// <em></em>Emphasis tag
// <strong></strong>Strong text tag
// <span></span>Inline text
// <div></div>Non semantic division tag to designate a block of text, shouldn't be abused
// then put the following in the views/movies/Index

/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path"); // built in node module we use to resolve paths more on this when we use it

/////////////////////////////////////////////
// Establish Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG);

// Connecton Status Events for when connection opens/disconnects/errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log(error));

////////////////////////////////////////////////
// Create Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose using object destructuring
const { Schema, model } = mongoose;

// make movies schema
const moviesSchema = new Schema({
    title: { type: String, required: true },
    releaseDate: String,
    length: Number,
    genre: String,
    poster: { type: String, required: true },
    director: { type: String, required: true },
    rating: String,
    watchAgain: Boolean,
    cast: [{ type: String }]
});

// make movie model
const Movie = model("Movie", moviesSchema);

/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
const app = express()
app.engine('jsx', require('express-react-views').createEngine());
app.set('view engine', 'jsx')

/////////////////////////////////////////////////////
// Register our Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// Root Route:
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.");
});

// Seed Route:
app.get("/movies/seed", (req, res) => {
    // array of starter movies
    const startMovies = [
        {
            title: "The Addams Family", releaseDate: "1991", length: 99, genre: "Comedy/Fantasy", poster: "https://m.media-amazon.com/images/I/51vN421z-GL._AC_UF894,1000_QL80_.jpg", director: "Barry Sonnenfeld", rating: "⭐⭐⭐⭐ 6.9/10", watchAgain: true, cast: ["Anjelica Huston as Morticia Addams", "Raul Julia as Gomez Addams",
                "Christopher Lloyd as Uncle Fester Addams / Gordon Craven",
                "Christina Ricci as Wednesday Addams",
                "Jimmy Workman as Pugsley Addams",
                "Judith Malina as Grandmama",
                "Carel Struycken as Lurch",
                "Christopher Hart as Thing",
                "John Franklin as Cousin Itt",
                "Elizabeth Wilson as Abigail Craven",
                "Dan Hedaya as Tully Alford",
                "Dana Ivey as Margaret Alford",
                "Paul Benedict as Judge George Womack",
                "Mercedes McNab as Girl Scout",
                "Sally Jessy Raphael as Herself"]
        },
        {
            title: "Beetlejuice", releaseDate: "1988", length: 92, genre: "Fantasy/Horror/Comedy", poster: "https://i.ebayimg.com/images/g/eawAAOSwNx1gnRdr/s-l500.jpg", director: "Tim Burton", rating: "⭐⭐⭐⭐ 7.5/10", watchAgain: true, cast: ["Alec Baldwin as Adam Maitland",
                "Geena Davis as Barbara Maitland, the wife of Adam",
                "Annie McEnroe as Jane Butterfield",
                "Michael Keaton as Betelgeuse",
                "Jeffrey Jones as Charles Deetz",
                "Catherine O'Hara as Delia Deetz",
                "Winona Ryder as Lydia Deetz"]
        },
        {
            title: "Edward Scissorhands", releaseDate: "1990", length: 105, genre: "Drama/Fantasy/Romance", poster: "https://m.media-amazon.com/images/I/41P8d1HmS-L._AC_.jpg", director: "Tim Burton", rating: "⭐⭐⭐⭐ 7.9/10", watchAgain: true, cast: ["Johnny Depp as Edward Scissorhands",
                "Winona Ryder as Kim Boggs",
                "Anthony Michael Hall as Jim",
                "Dianne Wiest as Peg Boggs",
                "Kathy Baker as Joyce Monroe",
                "Alan Arkin as Bill Boggs",
                "Vincent Price as The Inventor",
                "Robert Oliveri as Kevin Boggs",
                "Conchata Ferrell as Helen",
                "Caroline Aaron as Marge",
                "Dick Anthony Williams as Officer Allen",
                "O-Lan Jones as Esmeralda"]
        },

    ];

    // Delete all moviies
    Movie.deleteMany({}).then((data) => {
        // Movie Starter Movies
        Movie.create(startMovies).then((data) => {
            // send created fruits as response to confirm creation
            res.json(data);
        });
    });
});

// ==================================== INDEX: ====================================
// Index Route (Get => /movies)
// Mongoose allows you to write your queries in three ways

// 1 - using a callback (what you've done so far)
// 2 - using .then
// 3 - using async await
// So here is how the route would look like all three ways:

// 1: The callback method: 
// app.get("/movies", (req, res) => {
//     Movie.find({}, (err, movies) => {
//         res.render("movies/Index", { movies });
//     });
// });

// 2: The .then Method:
// app.get("/movies", (req, res) => {
//     // find all the movies
//     Movies.find({})
//       // render a template after they are found
//       .then((movies) => {
//         res.render("movies/Index", { movies });
//       })
//       // send error as json if they aren't
//       .catch((error) => {
//         res.json({ error });
//       });
//   });

// 3 - using async await
// Index route
// app.get("/movies", async (req, res) => {
//     const movies = await Movie.find({});
//     res.render("movies/Index", { movies });
// });

app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.render("movies/Index", { movies });
    } catch (err) {
        res.json({ err });
    }
});

// NEW
app.get("/movies/new", (req, res) => {
    res.render("movies/New")
})

// DELETE
app.delete("/movies/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // delete the fruit
    Movie.findByIdAndRemove(id)
        .then((movie) => {
            // redirect to main page after deleting
            res.redirect("/movies");
        })
        // send error as json
        .catch((error) => {
            console.log(error);
            res.json({ error });
        });
});

// UPDATE
app.put("/movies/:id", async (req, res) => {
    try {
        const id = req.params.id;
        req.body.watchAgain = req.body.watchAgain === "on" ? true : false;
        req.body.cast = req.body.cast.split(",")
        await Movie.findByIdAndUpdate(id, req.body)
        res.redirect(`/movies/${id}`)
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
})
// CREATE/ POST
app.post("/movies", async (req, res) => {
    try {
        req.body.watchAgain = req.body.watchAgain === "on" ? true : false;
        req.body.cast = req.body.cast.split(",")
        console.log(req.body)
        const createdMovie = await Movie.create(req.body)
        res.redirect("/movies")
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
})


//Edit 
app.get("/movies/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // get the fruit from the database
    Movie.findById(id)
        .then((movie) => {
            // render Edit page and send fruit data
            res.render("movies/Edit.jsx", { movie });
        })
        // send error as json
        .catch((error) => {
            console.log(error);
            res.json({ error });
        });
});

// SHOW
app.get("/movies/:id", async (req, res) => {
    const id = req.params.id

    try {
        const movie = await Movie.findById(id)
        res.render("movies/Show", { movie })
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
})

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));

// run server npm run dev