const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Regex to find the previously injected View with the colored letters
  const viewRegex = /<View style=\{\{\s*flexDirection:\s*"row",\s*alignItems:\s*"baseline"[^>]*\}\}>([\s\S]*?)<\/View>/g;

  const newTextMarkup = `<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Text style={[styles.heroTitle, { color: "#EEDCB9", marginBottom: 0, letterSpacing: 2 }]}>H</Text>
          <Text style={[styles.heroTitle, { color: "#D4A777", marginBottom: 0, letterSpacing: 2 }]}>Λ</Text>
          <Text style={[styles.heroTitle, { color: "#DF7A29", marginBottom: 0, letterSpacing: 2 }]}>Z</Text>
          <Text style={[styles.heroTitle, { color: "#DDA031", marginBottom: 0, letterSpacing: 2 }]}>I</Text>
          <Text style={[styles.heroTitle, { color: "#809833", marginBottom: 0, letterSpacing: 2 }]}>N</Text>
          <Text style={[styles.heroTitle, { color: "#3B7A33", marginBottom: 0, letterSpacing: 2 }]}>A</Text>
        </View>`;

  // Adjust for styles.heroTitle vs S.heroTitle depending on the file
  if (filePath.includes('WelcomeScreen')) {
    code = code.replace(viewRegex, newTextMarkup.replace(/styles\.heroTitle/g, 'S.heroTitle'));
  } else {
    code = code.replace(viewRegex, newTextMarkup);
  }

  fs.writeFileSync(filePath, code);
}

replaceInFile('./mobile/src/screens/WelcomeScreen.tsx');
replaceInFile('./mobile/src/screens/AuthScreen.tsx');
console.log('Updated HAZINA text styling to perfectly match the logo');
