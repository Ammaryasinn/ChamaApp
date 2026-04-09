const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const replaceMap = [
    // Purples -> Jungle Greens / Golds
    { from: /"#3C1278"/g, to: "Colors.primaryLight" },
    { from: /"#7C3AED"/g, to: "Colors.accent" },
    { from: /"#F3E8FF"/g, to: "Colors.surfaceElevated" },
    { from: /"#F5F3FF"/g, to: "Colors.surfaceElevated" },
    { from: /"#8B5CF6"/g, to: "Colors.accentDark" },
    
    // Blues -> Jungle Greens / Accents
    { from: /"#1A3C5E"/g, to: "Colors.primaryLight" },
    { from: /"#3B82F6"/g, to: "Colors.primary" },
    { from: /"#DBEAFE"/g, to: "Colors.surfaceElevated" },
    { from: /"#EFF6FF"/g, to: "Colors.surfaceElevated" },

    // Yellows/Browns -> Accents
    { from: /"#FEF3C7"/g, to: "Colors.surfaceElevated" },
    { from: /"#FEF3EC"/g, to: "Colors.surfaceElevated" },
    { from: /"#7C2D12"/g, to: "Colors.accent" },
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
console.log('Cleaned up colorful purples, blues, browns, and light greens.');
