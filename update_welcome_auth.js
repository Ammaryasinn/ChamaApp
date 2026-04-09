const fs = require('fs');

function fixScreen(file, isAuth) {
  let code = fs.readFileSync(file, 'utf8');

  // Ensure Image is imported
  if (!code.includes('Image } from "react-native"')) {
    code = code.replace(/import\s*\{\s*View,\s*Text,/, 'import { View, Text, Image,');
  }

  // Regex to find the <View> with the colored letters
  const viewRegex = /<View style=\{\{\s*flexDirection:\s*"row",\s*alignItems:\s*"center",\s*justifyContent:\s*"center",\s*marginBottom:\s*12\s*\}\}>([\s\S]*?)<\/View>/g;

  // The replacement block
  const replacement = `<Image source={require("../../assets/images/logo.png")} style={{ width: 220, height: 220, resizeMode: "contain", alignSelf: "center", marginBottom: 12 }} />`;

  code = code.replace(viewRegex, replacement);

  fs.writeFileSync(file, code);
}

fixScreen('./mobile/src/screens/WelcomeScreen.tsx', false);
fixScreen('./mobile/src/screens/AuthScreen.tsx', true);

console.log('Updated Welcome and Auth screens with logo image');
