import { ObjectId } from "mongodb";


export interface Team {
    id: number;
    name: string;
    leader: string;
    village: string;
}


export interface Characters {
    id: number;
    name: string;
    description: string;
    age: number;
    active: boolean;
    birthdate: string;
    image_url: string;
    position: string;
    hobbies: string[];
    team: Team;
}

export interface User {
    _id?: ObjectId;
    username: string;
    password: string;
    role: "ADMIN" | "USER";
}
