const fs = require('fs');

const mappings = {
  '"#DBEAFE"': 'Colors.surfaceElevated',
  '"#FEF3C7"': 'Colors.surfaceElevated',
  '"#F3E8FF"': 'Colors.surfaceElevated',
  '"#EFF6FF"': 'Colors.surfaceElevated',
  '"#FEF3EC"': 'Colors.surfaceElevated',
  '"#3B82F6"': 'Colors.primary',
  '"#7C3AED"': 'Colors.accent',
  '"#7C2D12"': 'Colors.accent',
  '"#1A3C5E"': 'Colors.primaryLight',
  '"#3C1278"': 'Colors.primaryLight',
  '"#0D9488"': 'Colors.primary',
  '"#006D5B"': 'Colors.primary',
  '"#8B5CF6"': 'Colors.accentDark'
};

function walk(dir) {
  const path = require('path');
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      Object.keys(mappings).forEach(key => {
        if (code.includes(key)) {
          code = code.split(key).join(mappings[key]);
          changed = true;
        }
      });
      if (changed) {
        fs.writeFileSync(fullPath, code);
      }
    }
  });
}

walk('./mobile/src/screens');
console.log('Unified all screens.');
