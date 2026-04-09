const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Change "color: Colors.textPrimary" back to white (Colors.surfaceDeepDark) when used on a primary button
  if (code.includes('backgroundColor: Colors.primary') && code.includes('color: Colors.textPrimary')) {
    // Actually, Primary is Green, TextInverse is Dark Green.
    // Let's use #E8D6B5 (Cream) for text on Primary buttons.
    code = code.replace(/color: Colors.textPrimary/g, 'color: "#E8D6B5"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, code);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  });
}

walk('./mobile/src/screens');
console.log('Fixed button text colors');
