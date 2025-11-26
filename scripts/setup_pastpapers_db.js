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
        console.log("Creating past_papers table...");
        await sql`
      CREATE TABLE IF NOT EXISTS past_papers (
        id SERIAL PRIMARY KEY,
        grade INTEGER NOT NULL,
        subject_name VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL,
        paper_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        console.log("past_papers table created successfully.");
    } catch (error) {
        console.error("Error creating table:", error);
    }
}

createTable();
