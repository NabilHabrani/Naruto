import express from "express";
import ejs from "ejs";
import { getCharacters, searchAndSortCharacters, getCharacterById, connect } from "./data";


const app = express();


app.set("view engine", "ejs"); 
app.set("port", 3000);


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

connect();


app.get("/", async (req, res) => {
    let sortField: string = typeof req.query.sort === "string" ? req.query.sort : "name";
    let sortDirection: string = typeof req.query.dir === "string" ? req.query.dir : "asc";
    let searchQuery: string = typeof req.query.s === "string" ? req.query.s : "";

    let sortValue = sortDirection === "asc" ? 1 : -1;

    let characters = await searchAndSortCharacters(sortField, sortValue, searchQuery);

    console.log("Aantal karakters na filter:", characters.length);

    res.render("index", {
        characters: characters,
        sortField: sortField,
        sortDirection: sortDirection,
        searchQuery: searchQuery
    });
});


app.get("/characters", async (req, res) => {
    let characters = await getCharacters();
    
    res.render("characters", {
        characters: characters
    });
});



app.get("/characters/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let character = await getCharacterById(id);

    if (character) {
        res.render("detail", { character: character });
    } else {
        res.status(404).send("Character not found");
    }
});

app.get("/detail",(req,res)=>{
    res.render("detail");
})


app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
