const fs = require('fs');
const path = './mobile/src/screens/AuthScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /<Text style=\{styles\.heroTitle\}>\s*Welcome to Hazina\s*<\/Text>/g,
  `<View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 8, justifyContent: "center" }}>
            <Text style={[styles.heroTitle, { marginBottom: 0 }]}>Welcome to </Text>
            <Text style={[styles.heroTitle, { color: "#E8D6B5", marginBottom: 0, letterSpacing: 1 }]}>H</Text>
            <Text style={[styles.heroTitle, { color: "#E8D6B5", marginBottom: 0, letterSpacing: 1 }]}>A</Text>
            <Text style={[styles.heroTitle, { color: "#D97A2B", marginBottom: 0, letterSpacing: 1 }]}>Z</Text>
            <Text style={[styles.heroTitle, { color: "#D4A24C", marginBottom: 0, letterSpacing: 1 }]}>I</Text>
            <Text style={[styles.heroTitle, { color: "#8B4A1F", marginBottom: 0, letterSpacing: 1 }]}>N</Text>
            <Text style={[styles.heroTitle, { color: "#1D755D", marginBottom: 0, letterSpacing: 1 }]}>A</Text>
          </View>`
);

fs.writeFileSync(path, code);
console.log('Fixed AuthScreen Hazina title');
