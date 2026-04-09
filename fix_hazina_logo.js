const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  replacements.forEach(({ from, to }) => {
    if (from.test(code)) {
      code = code.replace(from, to);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, code);
  }
}

// 1. Welcome Screen
replaceInFile('./mobile/src/screens/WelcomeScreen.tsx', [
  {
    from: /<Text style=\{S\.heroTitle\}>Welcome to Hazina<\/Text>/g,
    to: `<View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 8 }}>
          <Text style={[S.heroTitle, { marginBottom: 0 }]}>Welcome to </Text>
          <Text style={[S.heroTitle, { color: "#E8D6B5", marginBottom: 0, letterSpacing: 2 }]}>H</Text>
          <Text style={[S.heroTitle, { color: "#E8D6B5", marginBottom: 0, letterSpacing: 2 }]}>A</Text>
          <Text style={[S.heroTitle, { color: "#D97A2B", marginBottom: 0, letterSpacing: 2 }]}>Z</Text>
          <Text style={[S.heroTitle, { color: "#D4A24C", marginBottom: 0, letterSpacing: 2 }]}>I</Text>
          <Text style={[S.heroTitle, { color: "#8B4A1F", marginBottom: 0, letterSpacing: 2 }]}>N</Text>
          <Text style={[S.heroTitle, { color: "#1D755D", marginBottom: 0, letterSpacing: 2 }]}>A</Text>
        </View>`
  }
]);

// 2. Auth Screen
replaceInFile('./mobile/src/screens/AuthScreen.tsx', [
  {
    from: /<Text style=\{styles\.heroTitle\}>\n\s*Welcome to \{isSignUp \? \"Hazina\" : \"Hazina\"\}\n\s*<\/Text>/g,
    to: `<View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 8 }}>
            <Text style={[styles.heroTitle, { marginBottom: 0 }]}>Welcome to </Text>
            <Text style={[styles.heroTitle, { color: "#E8D6B5", marginBottom: 0, letterSpacing: 2 }]}>H</Text>
            <Text style={[styles.heroTitle, { color: "#E8D6B5", marginBottom: 0, letterSpacing: 2 }]}>A</Text>
            <Text style={[styles.heroTitle, { color: "#D97A2B", marginBottom: 0, letterSpacing: 2 }]}>Z</Text>
            <Text style={[styles.heroTitle, { color: "#D4A24C", marginBottom: 0, letterSpacing: 2 }]}>I</Text>
            <Text style={[styles.heroTitle, { color: "#8B4A1F", marginBottom: 0, letterSpacing: 2 }]}>N</Text>
            <Text style={[styles.heroTitle, { color: "#1D755D", marginBottom: 0, letterSpacing: 2 }]}>A</Text>
          </View>`
  }
]);

console.log('Fixed Hazina logo styling in Welcome and Auth screens');
