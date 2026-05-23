import dotenv from "dotenv";
dotenv.config();
import session, { MemoryStore } from "express-session";
import {User} from "../interfaces"
import MongoStore from "connect-mongo";
import { uri } from "../data";


const mongoStore = MongoStore.create({
    mongoUrl: uri,
    dbName: "cluster0",
    collectionName: "sessions"
});




declare module 'express-session' {
    export interface SessionData {
        user?: {
            _id?: string;
            username: string;
            role: "ADMIN" | "USER";
        };
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: new MemoryStore(),
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});