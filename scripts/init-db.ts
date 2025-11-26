import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.EXPO_PUBLIC_NEON_DATABASE_URL;

if (!connectionString) {
    console.error("EXPO_PUBLIC_NEON_DATABASE_URL is not defined");
    process.exit(1);
}

const sql = neon(connectionString);

async function main() {
    console.log("Initializing database...");

    try {
        // 1. users
        await sql`
      CREATE TABLE IF NOT EXISTS "User" (
          id TEXT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(100) NOT NULL,
          role VARCHAR(50) DEFAULT 'Student',
          is_onboarded BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
        console.log("Created User table");

        // 2. onboarding
        await sql`
      CREATE TABLE IF NOT EXISTS onboarding (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          school_level VARCHAR(20) NOT NULL,
          grade_range VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(user_id)
      );
    `;
        console.log("Created onboarding table");

        // 3. subjects
        await sql`
      CREATE TABLE IF NOT EXISTS subjects (
          subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          subject_name VARCHAR(100) NOT NULL,
          school_level VARCHAR(20) NOT NULL,
          grade_range VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        console.log("Created subjects table");

        // 4. subject_videos
        await sql`
      CREATE TABLE IF NOT EXISTS subject_videos (
          id SERIAL PRIMARY KEY,
          subject_id UUID REFERENCES subjects(subject_id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          video_url VARCHAR(500) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        console.log("Created subject_videos table");

        console.log("Database initialization complete!");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

main();
