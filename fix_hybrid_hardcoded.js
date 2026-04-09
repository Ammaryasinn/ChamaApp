const fs = require('fs');
const path = './mobile/src/screens/HybridConfigScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/"#3B82F6"/g, 'Colors.primary');
code = code.replace(/"#7C3AED"/g, 'Colors.accent');
code = code.replace(/"#FEF3C7"/g, 'Colors.surfaceElevated');
code = code.replace(/"#DBEAFE"/g, 'Colors.surfaceElevated');
code = code.replace(/"#F3E8FF"/g, 'Colors.surfaceElevated');
code = code.replace(/"#2563EB"/g, 'Colors.textPrimary');

fs.writeFileSync(path, code);
console.log('Fixed HybridConfigScreen colors');
