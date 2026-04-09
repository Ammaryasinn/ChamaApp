const fs = require('fs');
const path = './mobile/src/screens/GroupPurchaseSetupScreen.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `const handleContinue = () => {
    if (step < 4) setStep(step + 1);
    else navigation.navigate("InviteMembers", { chamaType: "group_purchase" });
  };`,
  `const handleContinue = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    try {
      const newChama = await chamaApi.createChama({
        name: "Group Purchase: " + selectedProduct.name,
        chamaType: "group_purchase",
        contributionAmount: parseInt(amount.replace(/,/g, ""), 10) || 5000,
        contributionFrequency: freq === "1" ? "monthly" : freq === "2" ? "biweekly" : "weekly",
        penaltyAmount: 0,
        penaltyGraceDays: 3,
        meetingDay: 1,
        maxLoanMultiplier: 0,
        loanInterestRate: 0,
        minVotesToApproveLoan: 3,
        mgrPercentage: 0,
        investmentPercentage: 0,
        welfarePercentage: 0,
      });

      navigation.navigate("InviteMembers", {
        chamaId: newChama.id,
        chamaType: "group_purchase",
        name: newChama.name,
      });
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error || "Failed to create Chama.");
    } finally {
      setLoading(false);
    }
  };`
);

fs.writeFileSync(path, code);
console.log('Patched GroupPurchaseSetupScreen');
