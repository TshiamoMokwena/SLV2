const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = process.argv[2]; // Pass the root directory as an argument
const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/hlf20oixz/pdfBucket"; // Base ImageKit URL

if (!ROOT_DIR) {
    console.error("Please provide the root directory path as an argument.");
    console.error("Usage: node scripts/generate_pastpapers_sql.js <path_to_pdf_bucket>");
    process.exit(1);
}

function escapeSql(str) {
    return str.replace(/'/g, "''");
}

function generateSql() {
    const sqlStatements = [];

    // Expected structure: Grade X/Subject/Year/Paper.pdf
    const grades = fs.readdirSync(ROOT_DIR).filter(item => fs.statSync(path.join(ROOT_DIR, item)).isDirectory());

    for (const gradeDir of grades) {
        // Extract grade number (e.g., "Grade 10" -> 10)
        const gradeMatch = gradeDir.match(/Grade\s*(\d+)/i);
        if (!gradeMatch) continue;
        const grade = parseInt(gradeMatch[1], 10);

        const gradePath = path.join(ROOT_DIR, gradeDir);
        const subjects = fs.readdirSync(gradePath).filter(item => fs.statSync(path.join(gradePath, item)).isDirectory());

        for (const subject of subjects) {
            const subjectPath = path.join(gradePath, subject);
            const years = fs.readdirSync(subjectPath).filter(item => fs.statSync(path.join(subjectPath, item)).isDirectory());

            for (const yearDir of years) {
                const year = parseInt(yearDir, 10);
                if (isNaN(year)) continue;

                const yearPath = path.join(subjectPath, yearDir);
                const files = fs.readdirSync(yearPath).filter(item => item.toLowerCase().endsWith('.pdf'));

                for (const file of files) {
                    // Construct ImageKit URL
                    // URL encoding is crucial for spaces and special characters
                    const urlPath = `${gradeDir}/${subject}/${yearDir}/${file}`;
                    const encodedPath = urlPath.split('/').map(encodeURIComponent).join('/');
                    const fileUrl = `${IMAGEKIT_ENDPOINT}/${encodedPath}`;

                    const sql = `INSERT INTO past_papers (grade, subject_name, year, paper_name, file_url) VALUES (${grade}, '${escapeSql(subject)}', ${year}, '${escapeSql(file.replace('.pdf', ''))}', '${fileUrl}');`;
                    sqlStatements.push(sql);
                }
            }
        }
    }

    return sqlStatements.join('\n');
}

try {
    const sqlOutput = generateSql();
    console.log(sqlOutput);

    // Optionally write to a file
    fs.writeFileSync('past_papers_inserts.sql', sqlOutput);
    console.error("\nSQL statements generated and saved to 'past_papers_inserts.sql'");
} catch (error) {
    console.error("Error generating SQL:", error);
}
