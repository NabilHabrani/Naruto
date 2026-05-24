import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import MongoStore from "connect-mongo";
import { uri } from "../data";
import { FlashMessage } from "../interfaces";

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
        message?: FlashMessage;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,           
    resave: false,               
    saveUninitialized: false,    
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        
    }
});