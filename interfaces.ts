export interface Team {
    id: number;
    name: string;
    leader: string;
    village: string;
}


export interface User {
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