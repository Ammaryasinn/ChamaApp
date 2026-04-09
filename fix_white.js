const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const replaceMap = [
    { from: /backgroundColor: "#FFFFFF"/g, to: "backgroundColor: Colors.surface" },
    { from: /color: "#FFF"/g, to: "color: Colors.textPrimary" },
    { from: /color="#FFF"/g, to: "color={Colors.textPrimary}" },
    { from: /color: "#FFFFFF"/g, to: "color: Colors.textPrimary" },
    { from: /color="#FFFFFF"/g, to: "color={Colors.textPrimary}" },
    { from: /backgroundColor: "#FAFAF9"/g, to: "backgroundColor: Colors.background" },
    { from: /backgroundColor: "#F9FAFB"/g, to: "backgroundColor: Colors.background" },
    { from: /backgroundColor: "#F3F4F6"/g, to: "backgroundColor: Colors.background" }
  ];

  replaceMap.forEach(({ from, to }) => {
    if (from.test(code)) {
      code = code.replace(from, to);
      changed = true;
    }
  });

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

walk('./mobile/src');
console.log('Fixed hardcoded white colors for dark mode.');
