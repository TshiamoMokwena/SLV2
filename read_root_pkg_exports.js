const fs = require('fs');
const path = require('path');
const pkgPath = path.join(process.cwd(), 'node_modules', 'firebase', 'package.json');
try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log('Exports:', JSON.stringify(pkg.exports, null, 2));
} catch (e) {
    console.error('Error reading root pkg:', e.message);
}
