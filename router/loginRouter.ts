import express from "express";
import {loginUser} from "../data"
import session from "../middleware/session"
import { secureMiddleware} from "../middleware/secureMiddleware"


export function loginRouter() {
    const router = express.Router();

 router.get("/login", async (req, res) => {
        res.render("login");
    });


    router.post("/login", async (req, res) => {
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



    router.post("/logout", secureMiddleware, async (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });
    });

    return router;

}