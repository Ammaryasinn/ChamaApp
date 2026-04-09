const fs = require('fs');
const path = './mobile/src/screens/GroupPurchaseSetupScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/const TERRACOTTA = "#1AA67E";/g, 'const TERRACOTTA = Colors.accent;');
code = code.replace(/const TERRACOTTA_LIGHT = "#083326";/g, 'const TERRACOTTA_LIGHT = Colors.surfaceElevated;');
code = code.replace(/const TERRACOTTA_MID = "#083326";/g, 'const TERRACOTTA_MID = Colors.surfaceElevated;');

fs.writeFileSync(path, code);
console.log('Fixed Group Purchase screen constants');
