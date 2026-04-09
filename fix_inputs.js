const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  if (code.includes('placeholderTextColor="#94A3B8"')) {
    code = code.replace(/placeholderTextColor="#94A3B8"/g, 'placeholderTextColor={Colors.textMuted}');
    fs.writeFileSync(filePath, code);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  });
}

walk('./mobile/src/screens');
