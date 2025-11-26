import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL!);

async function fixOnboardingTable() {
    try {
        console.log('Altering Onboarding table...');

        // 1. Change user_id to TEXT to match Firebase UID
        // We use USING user_id::text just to be explicit, though implicit cast usually works for UUID -> TEXT
        await sql`ALTER TABLE "Onboarding" ALTER COLUMN user_id TYPE TEXT;`;
        console.log('Changed user_id to TEXT.');

        // 2. Add UNIQUE constraint for ON CONFLICT to work
        // We first check if it exists to avoid error, or just try and catch.
        // But simpler to just try adding it.
        await sql`ALTER TABLE "Onboarding" ADD CONSTRAINT onboarding_user_id_key UNIQUE (user_id);`;
        console.log('Added UNIQUE constraint to user_id.');

        console.log('Onboarding table fixed successfully.');
    } catch (error) {
        console.error('Error fixing Onboarding table:', error);
    }
}

fixOnboardingTable();
