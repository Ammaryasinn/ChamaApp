const fs = require('fs');
const path = './mobile/src/context/ChamaContext.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `        const colorMap: Record<string, string> = {
          merry_go_round: "#0D9488",
          investment: Colors.primaryLight,
          welfare: Colors.primaryLight,
          hybrid: "#006D5B",
          group_purchase: Colors.accent,
        };`,
  `        const colorMap: Record<string, string> = {
          merry_go_round: "#1AA67E", // Primary highlights
          investment: "#F59E0B",     // Gold
          welfare: "#22D4A2",        // Text highlights
          hybrid: "#13755A",         // Primary buttons
          group_purchase: "#D97706", // Darker gold
        };`
);

fs.writeFileSync(path, code);
console.log('Fixed ChamaContext colorMap');
