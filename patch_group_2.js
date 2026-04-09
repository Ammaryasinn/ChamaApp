const fs = require('fs');
let code = fs.readFileSync('mobile/src/screens/GroupPurchaseSetupScreen.tsx', 'utf8');

code = code.replace(
  'const [freq, setFreq] = useState("monthly");\n  const [amount, setAmount] = useState("5,000");',
  'const [freq, setFreq] = useState("monthly");\n  const [amount, setAmount] = useState("5,000");\n  const [members, setMembers] = useState("20");\n  const [loading, setLoading] = useState(false);'
);
// wait, the amount was "5,000" not "5000"!
code = code.replace(
  'const [freq, setFreq] = useState("monthly");\n  const [amount, setAmount] = useState("5,000");',
  'const [freq, setFreq] = useState("monthly");\n  const [amount, setAmount] = useState("5,000");\n  const [members, setMembers] = useState("20");\n  const [loading, setLoading] = useState(false);'
);

code = code.replace(
  'S3.amountBox', 'S3.amtBox'
);
code = code.replace(
  'S3.amountInput', 'S3.amtInput'
);
code = code.replace(
  'S3.amountCurrency', 'S3.amtCurrency'
);

fs.writeFileSync('mobile/src/screens/GroupPurchaseSetupScreen.tsx', code);

// Fix InviteMembersScreen.tsx too
let inviteCode = fs.readFileSync('mobile/src/screens/InviteMembersScreen.tsx', 'utf8');
inviteCode = inviteCode.replace(
  'setActiveChama(route.params.chamaId);',
  'setActiveChama(route.params.chamaId, route.params.chamaType.toLowerCase());'
);
fs.writeFileSync('mobile/src/screens/InviteMembersScreen.tsx', inviteCode);
