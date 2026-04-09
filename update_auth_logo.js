const fs = require('fs');
const path = './mobile/src/screens/AuthScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /function HazinaLogo\(\{\s*size\s*=\s*32\s*\}\s*:\s*\{\s*size\?: number\s*\}\)\s*\{\s*return\s*\(\s*<Text style=\{\[S\.logo, \{ fontSize: size \}\]\}>\s*<Text style=\{\{ color: "#E8D6B5" \}\}>Hazi<\/Text>\s*<Text style=\{\{ color: "#F59E0B" \}\}>na<\/Text>\s*<\/Text>\s*\);\s*\}/,
  `function HazinaLogo({ size = 32 }: { size?: number }) {
  return (
    <Image 
      source={require("../../assets/images/logo.png")} 
      style={{ width: size * 4, height: size * 4, resizeMode: "contain" }} 
    />
  );
}`
);

// We should also replace the Image import if it's missing
if (!code.includes('Image,')) {
    code = code.replace(/import \{ View, Text,/, 'import { View, Text, Image,');
}

fs.writeFileSync(path, code);
console.log('Updated AuthScreen HazinaLogo to use the actual image.');
