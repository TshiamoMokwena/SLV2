import { neon } from '@neondatabase/serverless';

// Ensure the environment variable is defined or handle it gracefully
const connectionString = process.env.EXPO_PUBLIC_NEON_DATABASE_URL;

if (!connectionString) {
  console.warn("EXPO_PUBLIC_NEON_DATABASE_URL is not defined");
}

const sql = neon(connectionString || '');

export const db = {
  // Users
  async getUserById(userId: string) {
    return await sql`SELECT * FROM "User" WHERE id = ${userId}`;
  },

  async updateUser(userId: string, data: { username?: string }) {
    return await sql`
      UPDATE "User" 
      SET username = ${data.username}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `;
  },

  // Onboarding
  async saveOnboarding(userId: string, schoolLevel: string, gradeRange: string) {
    // First update the User table to set is_onboarded = true
    await sql`
        UPDATE "User"
        SET is_onboarded = TRUE
        WHERE id = ${userId}
    `;

    return await sql`
      INSERT INTO "Onboarding" (user_id, school_level, grade_range)
      VALUES (${userId}, ${schoolLevel}, ${gradeRange})
      ON CONFLICT (user_id) 
      DO UPDATE SET school_level = ${schoolLevel}, grade_range = ${gradeRange}
      RETURNING *
    `;
  },

  async getOnboarding(userId: string) {
    return await sql`
      SELECT * FROM "Onboarding" WHERE user_id = ${userId}
    `;
  },

  async updateGrade(userId: string, grade: number) {
    return await sql`
      UPDATE "Onboarding"
      SET grade = ${grade}
      WHERE user_id = ${userId}
      RETURNING *
    `;
  },

  // Subjects
  async getSubjects(schoolLevel: string, gradeRange: string) {
    return await sql`
      SELECT * FROM "Subject" 
      WHERE school_level = ${schoolLevel} 
      AND grade_range = ${gradeRange}
      ORDER BY subject_name ASC
    `;
  },

  // Videos
  async getSubjectVideos(subjectId: string) {
    return await sql`
      SELECT * FROM "SubjectVideos" 
      WHERE subject_id = ${subjectId}
      ORDER BY created_at DESC
    `;
  },

  // Quiz Scores
  async saveQuizScore(userId: string, subjectId: string, topic: string, score: number) {
    return await sql`
      INSERT INTO "QuizScores" (user_id, subject_id, topic, score)
      VALUES (${userId}, ${subjectId}, ${topic}, ${score})
      RETURNING *
    `;
  },

  async getQuizScores(userId: string, subjectId: string) {
    return await sql`
      SELECT * FROM "QuizScores"
      WHERE user_id = ${userId} AND subject_id = ${subjectId}
      ORDER BY created_at DESC
    `;
  },

  // Get unique topics from SubjectVideos to use as quiz topics
  async getQuizTopics(subjectId: string) {
    return await sql`
      SELECT DISTINCT title, video_id FROM "SubjectVideos"
      WHERE subject_id = ${subjectId}
      ORDER BY title ASC
    `;
  },

  // Past Papers
  async getAvailableYears(grade: number, subjectName: string) {
    return await sql`
      SELECT DISTINCT year FROM past_papers
      WHERE grade = ${grade} AND subject_name = ${subjectName}
      ORDER BY year DESC
    `;
  },

  async getPastPapers(grade: number, subjectName: string, year: number) {
    return await sql`
      SELECT * FROM past_papers
      WHERE grade = ${grade} AND subject_name = ${subjectName} AND year = ${year}
      ORDER BY paper_name ASC
    `;
  },
};

export { sql };

