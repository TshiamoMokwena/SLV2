require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.EXPO_PUBLIC_NEON_DATABASE_URL;

if (!connectionString) {
    console.error("EXPO_PUBLIC_NEON_DATABASE_URL is not defined");
    process.exit(1);
}

const sql = neon(connectionString);

async function addGradeColumn() {
    try {
        console.log("Adding grade column to Onboarding table...");
        await sql`
      ALTER TABLE "Onboarding" 
      ADD COLUMN IF NOT EXISTS grade INTEGER;
    `;
        console.log("grade column added successfully.");
    } catch (error) {
        console.error("Error adding column:", error);
    }
}

addGradeColumn();
