require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const connectionString = process.env.EXPO_PUBLIC_NEON_DATABASE_URL;

if (!connectionString) {
    console.error("EXPO_PUBLIC_NEON_DATABASE_URL is not defined");
    process.exit(1);
}

const sql = neon(connectionString);

async function createTable() {
    try {
        console.log("Creating QuizScores table...");
        await sql`
      CREATE TABLE IF NOT EXISTS "QuizScores" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
        subject_id UUID NOT NULL REFERENCES "Subject"(subject_id) ON DELETE CASCADE,
        topic VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        console.log("QuizScores table created successfully.");
    } catch (error) {
        console.error("Error creating table:", error);
    }
}

createTable();
