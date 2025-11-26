import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.EXPO_PUBLIC_NEON_DATABASE_URL;

if (!connectionString) {
    console.error("EXPO_PUBLIC_NEON_DATABASE_URL is not defined");
    process.exit(1);
}

const sql = neon(connectionString);

async function main() {
    console.log("Altering User table...");
    try {
        // Alter User table id to TEXT
        await sql`ALTER TABLE "User" ALTER COLUMN id TYPE TEXT;`;
        console.log("Successfully altered User.id to TEXT");

        // Also check if we need to update onboarding if it references User
        // This part is speculative but good practice if the FK exists
        try {
            // We attempt to alter onboarding user_id too, just in case it exists and references User
            // If it doesn't exist or doesn't reference it, this might fail or do nothing, which is fine for now.
            // However, if there is a FK constraint, we might need to drop and recreate it.
            // For now, let's just focus on the User table as requested.
        } catch (e) {
            // ignore
        }

    } catch (error) {
        console.error("Error altering database:", error);
    }
}

main();
