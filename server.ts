import express from "express";
import ejs from "ejs";
import { getCharacters, searchAndSortCharacters, getCharacterById, connect, updateCharacter, loginUser, registerUser } from "./data";
import session from "./middleware/session";
import { User } from "./interfaces";
import { secureMiddleware } from "../Naruto/middleware/secureMiddleware";
import {loginRouter} from "./router/loginRouter";
import {homeRouter} from "./router/homeRouter";

const app = express();
app.use(session);
app.use(secureMiddleware);
app.use(loginRouter());
app.use(homeRouter());

app.set("view engine", "ejs"); 
app.set("port", 3000);


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

connect();


app.get("/", async(req, res) => {
    res.render("index");
});

app.get("/", async(req, res) => {
    if (req.session.user) {
        res.render("index", {user: req.session.user});
    } else {
        res.redirect("/login");
    }
});

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

app.get("/characters/:id/edit", async (req, res) => {
    let id = parseInt(req.params.id);
    let character = await getCharacterById(id);

    if (character) {
        res.render("edit", { character: character });
    } else {
        res.status(404).send("Character not found");
    }
});


app.post("/characters/:id/edit", async (req, res) => {
    let id = parseInt(req.params.id);
    
    let updatedCharacter = {
        id: id,
        name: req.body.name,
        description: req.body.description,
        age: parseInt(req.body.age),
        active: req.body.active === "true",
        birthdate: req.body.birthdate,
        image_url: req.body.image_url,
        position: req.body.position,
        hobbies: req.body.hobbies ? req.body.hobbies.split(',') : [],
        team: {
            id: parseInt(req.body.teamId),
            name: req.body.teamName,
            leader: req.body.teamLeader,
            village: req.body.teamVillage
        }
    };
    
    await updateCharacter(id, updatedCharacter);
    res.redirect("/characters/" + id);
});


app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    try {
        let user = await loginUser(username, password);
        delete user.password;  // Password mag niet in sessie
        req.session.user = user;
        res.redirect("/");
    } catch (e: any) {
        res.render("login", { message: e.message });
    }
});

app.post("/logout", async(req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.get("/", secureMiddleware, async(req, res) => {
    res.render("index", { user: req.session.user });
});

app.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("register", { message: null });
    }
});


app.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await registerUser(username, password, "USER");
        res.redirect("/login");
    } catch (error: any) {
        res.render("register", { message: error.message });
    }
});







app.listen(app.get("port"), async() => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (e) {
        console.log(e);
        process.exit(1); 
    }
});