import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.EXPO_PUBLIC_NEON_DATABASE_URL;

if (!connectionString) {
    console.error("EXPO_PUBLIC_NEON_DATABASE_URL is not defined");
    process.exit(1);
}

const sql = neon(connectionString);

async function main() {
    console.log("Adding is_onboarded column to User table...");
    try {
        await sql`
            ALTER TABLE "User" 
            ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT FALSE;
        `;
        console.log("Successfully added is_onboarded column");
    } catch (error) {
        console.error("Error altering database:", error);
    }
}

main();
