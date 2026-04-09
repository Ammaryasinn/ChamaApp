const fs = require('fs');
let code = fs.readFileSync('mobile/src/screens/GroupPurchaseSetupScreen.tsx', 'utf8');

code = code.replace(
  'import { useChamaContext } from "../context/ChamaContext";',
  'import { useChamaContext } from "../context/ChamaContext";\nimport { chamaApi } from "../lib/api";\nimport { Alert, ActivityIndicator } from "react-native";'
);

code = code.replace(
  'const [freq, setFreq] = useState("monthly");\n  const [amount, setAmount] = useState("5,000");',
  'const [freq, setFreq] = useState("monthly");\n  const [amount, setAmount] = useState("5,000");\n  const [members, setMembers] = useState("20");\n  const [loading, setLoading] = useState(false);'
);

const handleContinueRegex = /  const handleContinue = \(\) => \{[\s\S]*?else navigation\.navigate\("InviteMembers", \{ chamaType: "group_purchase" \}\);\n  \};/;
const newHandleContinue = `  const handleContinue = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    try {
      const newChama = await chamaApi.createChama({
        name: \`Group Purchase: \${selectedProduct.name}\`,
        chamaType: "group_purchase",
        contributionAmount: parseInt(amount.replace(/,/g, ""), 10) || 0,
        contributionFrequency: freq,
        penaltyAmount: 0,
        penaltyGraceDays: 3,
        meetingDay: 6,
        maxLoanMultiplier: 0,
        loanInterestRate: 0,
        minVotesToApproveLoan: 0,
        mgrPercentage: 0,
        investmentPercentage: 0,
        welfarePercentage: 0,
      });

      navigation.navigate("InviteMembers", {
        chamaId: newChama.id,
        chamaType: "group_purchase",
        name: \`Group Purchase: \${selectedProduct.name}\`,
      });
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error || "Failed to create Chama.");
    } finally {
      setLoading(false);
    }
  };`;

code = code.replace(handleContinueRegex, newHandleContinue);

code = code.replace(
  '<Step3Schedule freq={freq} setFreq={setFreq} amount={amount} setAmount={setAmount} product={selectedProduct} />',
  '<Step3Schedule freq={freq} setFreq={setFreq} amount={amount} setAmount={setAmount} product={selectedProduct} members={members} setMembers={setMembers} />'
);

code = code.replace(
  '}: { freq: string; setFreq: (f: string) => void; amount: string; setAmount: (a: string) => void; product: any }) {',
  ' members, setMembers }: { freq: string; setFreq: (f: string) => void; amount: string; setAmount: (a: string) => void; product: any; members: string; setMembers: (m: string) => void }) {'
);

code = code.replace(
  'each · 20 members',
  'each · {members || 0} members'
);

const memberInput = `
      {/* Members */}
      <Text style={[S3.label, { marginTop: 20 }]}>NUMBER OF MEMBERS</Text>
      <View style={S3.amtBox}>
        <TextInput
          style={S3.amtInput}
          value={members}
          onChangeText={(v) => setMembers(v.replace(/\D/g, ""))}
          keyboardType="number-pad"
          placeholder="e.g. 20"
          placeholderTextColor="#9CA3AF"
        />
        <Text style={S3.amtCurrency}>MEMBERS</Text>
      </View>
`;

code = code.replace(
  '{/* Frequency */}',
  memberInput + '\n      {/* Frequency */}'
);

fs.writeFileSync('mobile/src/screens/GroupPurchaseSetupScreen.tsx', code);
