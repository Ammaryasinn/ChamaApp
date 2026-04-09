const fs = require('fs');
const path = './mobile/src/screens/DashboardScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `colors={["#071510", "#0A1F18", "#0D2E22"]}`,
  `colors={["#02120D", "#052118", "#083326"]}`
);

fs.writeFileSync(path, code);
console.log('Fixed DashboardScreen gradient');
