const fs = require('fs');
const path = './mobile/src/screens/HybridConfigScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `        {/* Type Toggles */}`,
  `        {/* Contribution Amount */}
        <Text style={S.sectionLabel}>MONTHLY CONTRIBUTION (Ksh)</Text>
        <View style={S.nameCard}>
          <Text style={{ fontFamily: "Inter-SemiBold", color: "#64748B", marginRight: 4 }}>Ksh</Text>
          <TextInput
            style={S.nameInput}
            placeholder="5000"
            placeholderTextColor="#94A3B8"
            keyboardType="numeric"
            value={contribStr}
            onChangeText={setContribStr}
            maxLength={10}
          />
        </View>

        {/* Type Toggles */}`
);

fs.writeFileSync(path, code);
console.log('Patched HybridConfigScreen');
