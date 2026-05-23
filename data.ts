import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import type { Characters, User } from "./interfaces";


dotenv.config();

const saltRounds : number = 10;
export const uri = process.env.URI || "mongodb+srv://nabilhabrani321_db_user:xNaiWpluSCnhvh2T@cluster0.l44fadi.mongodb.net/";
const client = new MongoClient(uri);

export const userCollection = client.db("cluster0").collection<User>("users");
const collectionCharacters: Collection<Characters> = client.db("cluster0").collection<Characters>("Characters");

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function connect() {
    try {
        await client.connect();
        await CharacterApi();
        await createDefaultUsers();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}



// karakters

export async function getCharacters() {
    return await collectionCharacters.find({}).toArray();
}



async function CharacterApi() {
    const Characters: Characters[] = await getCharacters();

    if (Characters.length == 0) {
        console.log("database is leeg")
        const response = await fetch("https://raw.githubusercontent.com/NabilHabrani/Naruto/refs/heads/main/naruto_characters.json");
        const Characters: Characters[] = await response.json();
        
    
        await collectionCharacters.insertMany(Characters);

    }
}


export async function searchAndSortCharacters(sortField: string, sortDirection: number, searchQuery: string) {
    let query: any = {};

    if (searchQuery) {
        query.name = { $regex: searchQuery, $options: 'i' };
    }

    try {
        let sortParams: any = {};
        sortParams[sortField] = sortDirection;

        let result = await collectionCharacters.find(query).sort(sortParams).toArray();

        return result;
    } catch (error) {
        console.error('Error searching and sorting characters:', error);
        throw error;
    }
}

export async function getCharacterById(id: number) {
    return await collectionCharacters.findOne({ id: id });
}

export async function updateCharacter(id: number, updatedData: Characters) {
    try {
        await collectionCharacters.updateOne({ id: id }, { $set: updatedData });
    } catch (error) {
        throw error;
    }
}

export const sortFields = [
    { value: 'name', text: 'NAME' },
    { value: 'birthdate', text: 'BIRTDATE' },
    { text: "ABILITIES" },
    { value: 'role', text: 'ROLE' },
    { value: 'available', text: 'AVAILABLE' },
    { text: 'VIEW' }
];

export const sortDirections = [
    { value: 'asc', text: 'Ascending' },
    { value: 'desc', text: 'Descending' }
];


async function createDefaultUsers() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    
    // Admin user
    let adminUsername: string = process.env.ADMIN_USERNAME ?? "admin";
    let adminPassword: string = process.env.ADMIN_PASSWORD ?? "admin123";
    
    await userCollection.insertOne({
        username: adminUsername,
        password: await bcrypt.hash(adminPassword, saltRounds),
        role: "ADMIN"
    });
    
    
    console.log("Default users created");
}
export async function registerUser(username: string | undefined, password: string | undefined, role: "ADMIN" | "USER") {
    if (username === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }


    
}
    

export async function loginUser(username: string, password: string) {
    if (username === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user: User | null = await userCollection.findOne<User>({ username: username });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}






