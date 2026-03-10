import data from "./naruto_characters.json";
import type { User } from "./interfaces";
import readline from 'readline-sync';

const users: User[] = data as User[];

const menuItems: string[] = [
    "View all data",
    "Filter by ID",
    "Exit",
];

let running: boolean = true;

do {
    console.log("Welcome to the Naruto JSON data viewer!");

    let option: number = readline.keyInSelect(menuItems, "Please enter your choice:", { cancel: false });

    if (option === 0) {
        console.log("");
        console.log("ALLE KARAKTERS");
        console.log("");

        users.forEach(user => {
            console.log(`- ${user.name} (ID: ${user.id})`);
        });

    } else if (option === 1) {
        // ID filteren
        const searchId: number = readline.questionInt("Please enter the ID you want to filter by: ");

        const foundUser = users.find(user => user.id === searchId);

        if (foundUser) {

            console.log("");
            console.log(`ID: ${foundUser.id}`);
            console.log(`   Naam: ${foundUser.name}`);
            console.log(`   Beschrijving: ${foundUser.description}`);
            console.log(`   Leeftijd: ${foundUser.age}`);
            console.log(`   Actief: ${foundUser.active ? "Ja" : "Nee"}`);
            console.log(`   Geboortedatum: ${foundUser.birthdate}`);
            console.log(`   Afbeelding: ${foundUser.image_url}`);
            console.log(`   Positie: ${foundUser.position}`);
            console.log(`   Hobbies: ${foundUser.hobbies.join(", ")}`);
            console.log("");

            console.log(`TEAM INFORMATIE:`);
            console.log(`   ID: ${foundUser.team.id}`);
            console.log(`   Naam: ${foundUser.team.name}`);
            console.log(`   Leider: ${foundUser.team.leader}`);
            console.log(`   Dorp: ${foundUser.team.village}`);
            console.log("");

        } else {
            // verkeerde ID ingegeven
            console.log(`Geen karakter gevonden met ID: ${searchId}`);
        }

    } else if (option === 2) {
        // Exit
        console.log("Arigato gozaimasu! Tot ziens!");
        running = false;
    }

    if (running && option !== 2) {
        readline.question("Druk op Enter om terug te keren naar het menu...");
    }

} while (running);

export { };