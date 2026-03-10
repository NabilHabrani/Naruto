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
    console.log(" Welcome to the Naruto JSON data viewer!");

    let option: number = readline.keyInSelect(menuItems, "Please enter your choice:", { cancel: false });

    if (option === 0) {
        // View all data - alleen namen en IDs
        console.log("\n" + "ALLE KARAKTERS".padStart(35, "="));
        console.log("=".repeat(50));

        users.forEach(user => {
            const activeStatus = user.active ? "✅" : "❌";
            console.log(`- ${user.name} (ID: ${user.id}) ${activeStatus}`);
        });
        console.log("=".repeat(50) + "\n");

    } else if (option === 1) {
        // Filter by ID
        const searchId: number = readline.questionInt("Please enter the ID you want to filter by: ");

        // Zoek naar de user met het opgegeven ID
        const foundUser = users.find(user => user.id === searchId);

        if (foundUser) {
            //User gevonden - toon ALLE details
            /*
             console.log("\n" + "⭐".repeat(25));
             console.log(`KARAKTER DETAILS: ${foundUser.name}`);
             console.log("⭐".repeat(25));
             */

            console.log(` ID: ${foundUser.id}`);
            console.log(` Naam: ${foundUser.name}`);
            console.log(` Beschrijving: ${foundUser.description}`);
            console.log(` Leeftijd: ${foundUser.age}`);
            console.log(` Actief: ${foundUser.active ? "Ja" : "Nee"}`);
            console.log(` Geboortedatum: ${foundUser.birthdate}`);
            console.log(`  Afbeelding: ${foundUser.image_url}`);
            console.log(`  Positie: ${foundUser.position}`);
            console.log(` Hobbies: ${foundUser.hobbies.join(", ")}`);

            console.log(` TEAM INFORMATIE:`);
            console.log(`   ID: ${foundUser.team.id}`);
            console.log(`   Naam: ${foundUser.team.name}`);
            console.log(`   Leider: ${foundUser.team.leader}`);
            console.log(`   Dorp: ${foundUser.team.village}`);

        } else {
            // User niet gevonden
            console.log(` Geen karakter gevonden met ID: ${searchId}`);
            console.log(`Beschikbare IDs: ${users.map(u => u.id).sort((a, b) => a - b).join(', ')}`);
        }

    } else if (option === 2) {
        // Exit
        console.log(" Arigato gozaimasu! Tot ziens!\n");
        running = false;
    }

    // Pauze voor betere leesbaarheid (behalve bij exit)
    if (running && option !== 2) {
        readline.question(" Druk op Enter om terug te keren naar het menu...");
    }

} while (running);