import express from "express";
import ejs from "ejs";
import { getCharacters, searchAndSortCharacters, getCharacterById, connect, updateCharacter, loginUser, registerUser } from "../data";
import session from "../middleware/session";
import { User } from "../interfaces";
import { flashMiddleware } from "../middleware/flashMiddleware";
import { secureMiddleware } from "../middleware/secureMiddleware";


export function homeRouter() {
    const router = express.Router();

    const toStringParam = (value: string | string[] | undefined) =>
        Array.isArray(value) ? value[0] || "" : value || "";

router.get("/", secureMiddleware, async (req, res) => {
    
    try {
        const sortField = typeof req.query.sort === "string" ? req.query.sort : "name";
        const sortDirection = typeof req.query.dir === "string" ? req.query.dir : 'asc';
        const searchQuery = typeof req.query.s === "string" ? req.query.s : "";

        const numericSortDirection = sortDirection === 'asc' ? 1 : -1;

        const characters = await searchAndSortCharacters(sortField, numericSortDirection, searchQuery);

        res.render("index", {
            user: req.session.user,
            characters: characters,
            sortField: sortField,      
            sortDirection: sortDirection, 
            searchQuery: searchQuery   
        });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});
    router.get("/characters", secureMiddleware, async (req, res) => {
        let characters = await getCharacters();
        res.render("characters", {
            characters: characters,
            user: req.session.user
        });
    });

    router.get("/characters/:id", secureMiddleware, async (req, res) => {
        let id = parseInt(toStringParam(req.params.id));
        let character = await getCharacterById(id);

        if (character) {
            res.render("detail", { character: character });
        } else {
            res.status(404).send("Character not found");
        }
    });

    router.get("/characters/:id/edit", secureMiddleware, async (req, res) => {
        let id = parseInt(toStringParam(req.params.id));
        let character = await getCharacterById(id);

        if (character) {
            res.render("edit", { character: character });
        } else {
            res.status(404).send("Character not found");
        }
    });

    router.post("/characters/:id/edit", secureMiddleware, async (req, res) => {
        let id = parseInt(toStringParam(req.params.id));

        let updatedCharacter = {
            id: id,
            name: req.body.name,
            description: req.body.description,
            age: parseInt(toStringParam(req.body.age)),
            active: req.body.active === "true",
            birthdate: req.body.birthdate,
            image_url: req.body.image_url,
            position: req.body.position,
            hobbies: req.body.hobbies ? req.body.hobbies.split(',') : [],
            team: {
                id: parseInt(toStringParam(req.body.teamId)),
                name: req.body.teamName,
                leader: req.body.teamLeader,
                village: req.body.teamVillage
            }
        };

        await updateCharacter(id, updatedCharacter);
        res.redirect("/characters/" + id);
    });

    return router;
}