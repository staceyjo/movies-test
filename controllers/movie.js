////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Movie = require("../models/movie")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

// ==================================== HOME: ====================================
// router.get("/", (req, res) => {
//     res.send("your server is running... better catch it.");
// });

// ==================================== SEED: ====================================
router.get("/seed", (req, res) => {
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
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.render("movies/Index", { movies });
    } catch (err) {
        res.json({ err });
    }
});

// ==================================== NEW: ====================================
router.get("/new", (req, res) => {
    res.render("movies/New")
})

// ==================================== DELETE: ====================================
router.delete("/:id", (req, res) => {
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

// ==================================== UPDATE: ====================================
router.put("/:id", async (req, res) => {
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

// ==================================== CREATE/POST: ====================================
router.post("/", async (req, res) => {
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

// ==================================== EDIT: ====================================

router.get("/:id/edit", (req, res) => {
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

// ==================================== SHOW: ====================================
router.get("/:id", async (req, res) => {
    const id = req.params.id

    try {
        const movie = await Movie.findById(id)
        res.render("movies/Show", { movie })
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router;