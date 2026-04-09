const fs = require('fs');
const path = './mobile/src/screens/SplashScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /import \{ View, Text, StyleSheet, Animated \} from "react-native";/,
  `import { View, Text, StyleSheet, Animated, Image } from "react-native";`
);

code = code.replace(
  /<Text style=\{S\.logo\}>\s*<Text style=\{\{ color: "#E8D6B5" \}\}>Hazi<\/Text>\s*<Text style=\{\{ color: "#F59E0B" \}\}>na<\/Text>\s*<\/Text>\s*<Text style=\{S\.tagline\}>Save together. Grow together.<\/Text>/,
  `<Image source={require("../../assets/images/logo.png")} style={{ width: 260, height: 260, resizeMode: "contain" }} />`
);

code = code.replace(
  /backgroundColor: Colors\.primary,/,
  `backgroundColor: Colors.background,`
);

fs.writeFileSync(path, code);
console.log('Updated SplashScreen with logo image');
