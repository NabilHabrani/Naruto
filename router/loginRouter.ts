import express from "express";
import { loginUser, registerUser } from "../data"
import session from "../middleware/session"
import { secureMiddleware } from "../middleware/secureMiddleware"
import { User } from "../interfaces";


export function loginRouter() {
    const router = express.Router();

router.get("/login", async (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("login", { 
            user: null,
            message: req.session.message || null 
        });
    }
});
router.post("/login", async (req, res) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    
    try {
        let user = await loginUser(username, password);
        
        let sessionUser = {
            _id: user._id?.toString(),
            username: user.username,
            role: user.role
        };
        
        req.session.user = sessionUser;
        
        req.session.message = { type: "success", message: "Login successful" };
        
        req.session.save((err) => {
            if (err) console.log("4. Session save error:", err);
            res.redirect("/");
        });
    } catch (e: any) {
            res.render("login", { 
                user: null,
                message: { type: "error", message: e.message }
            });
    } 

});
    router.post("/logout", async (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });


    });

    router.get("/register", (req, res) => {
        if (req.session.user) {
            res.redirect("/");
        } else {
            res.render("register", { message: null, user: null });
        }
    });


    router.post("/register", async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password !== confirmPassword) {
            res.render("register", { message: "Verkeerde wachtwoord", user: null });
            return;
        }
        try {
            await registerUser(username, password, "USER");
            res.redirect("/login");
        } catch (error: any) {
            res.render("register", { message: error.message, user: null });
        }
    });







    return router;

}