import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";
import { mpesaApi } from "../lib/api";

// ─────────────────────────────────────────────────────────────────────────────
//  Step type
// ─────────────────────────────────────────────────────────────────────────────
type Step = "input" | "confirm" | "pending" | "success" | "failed";

// ─────────────────────────────────────────────────────────────────────────────
//  Animated loading dots  (three bouncing dots)
// ─────────────────────────────────────────────────────────────────────────────
function LoadingDots() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(dot, { toValue: -10, duration: 300, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
          Animated.timing(dot, { toValue: 0,   duration: 300, useNativeDriver: true, easing: Easing.in(Easing.quad)  }),
          Animated.delay(300),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View style={S.dotsRow}>
      {dots.map((dot, i) => (
        <Animated.View key={i} style={[S.dot, { transform: [{ translateY: dot }] }]} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Animated checkmark circle
// ─────────────────────────────────────────────────────────────────────────────
function SuccessCheck() {
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[S.successCircle, { transform: [{ scale }] }]}>
      <Feather name="check" size={40} color={Colors.textPrimary} />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main screen
// ─────────────────────────────────────────────────────────────────────────────
export default function ContributionModal({ route, navigation }: any) {
  const { chamaName = "Chama", chamaId, memberId } = route?.params ?? {};

  const [step,        setStep]        = useState<Step>("input");
  const [amount,      setAmount]      = useState("");
  const [mpesaPhone,  setMpesaPhone]  = useState("");
  const [phoneFocused,setPhoneFocused]= useState(false);
  const [amtFocused,  setAmtFocused]  = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCount = useRef(0);

  // Cleanup on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const parsed  = parseInt(amount.replace(/,/g, ""), 10);
  const validAmt = !isNaN(parsed) && parsed >= 50;
  const validPh  = mpesaPhone.replace(/\D/g, "").length === 9;
  const canProceed = validAmt && validPh;

  const formatAmount = (v: string) => {
    const digits = v.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // ── STK push + polling ─────────────────────────────────────────────────────
  const handleConfirm = async () => {
    setStep("pending");
    try {
      const phone = mpesaPhone.startsWith("+") ? mpesaPhone : `+254${mpesaPhone}`;
      const res = await mpesaApi.triggerStkPush({
        phone,
        amount: parsed,
        chamaId,
        memberId,
      });

      const checkoutRequestId: string = res.checkoutRequestId;
      pollCount.current = 0;

      pollRef.current = setInterval(async () => {
        pollCount.current += 1;
        if (pollCount.current > 10) {
          clearInterval(pollRef.current!);
          setStep("failed");
          return;
        }
        try {
          const status = await mpesaApi.checkStatus(checkoutRequestId);
          if (status.status === "SUCCESS") {
            clearInterval(pollRef.current!);
            setStep("success");
          } else if (status.status === "FAILED" || status.status === "CANCELLED") {
            clearInterval(pollRef.current!);
            setStep("failed");
          }
        } catch { /* keep polling */ }
      }, 3000);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Could not initiate M-PESA payment. Try again.");
      setStep("confirm");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (step === "pending") {
    return (
      <SafeAreaView style={S.screen}>
        <StatusBar style="dark" />
        <View style={S.statusView}>
          <View style={S.mpesaLogo}>
            <Text style={S.mpesaLogoText}>M-PESA</Text>
          </View>
          <Text style={S.statusTitle}>Waiting for payment…</Text>
          <Text style={S.statusSub}>
            Check your phone{"\n"}and enter your M-PESA PIN to complete the payment.
          </Text>
          <LoadingDots />
          <Text style={S.statusHint}>Ksh {amount} to {chamaName}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (step === "success") {
    return (
      <SafeAreaView style={S.screen}>
        <StatusBar style="dark" />
        <View style={S.statusView}>
          <SuccessCheck />
          <Text style={[S.statusTitle, { color: Colors.success }]}>Imetumwa! 🎉</Text>
          <Text style={S.statusSub}>
            Your contribution of{"\n"}
            <Text style={{ fontFamily: FontFamily.extraBold, color: "#E8D6B5" }}>Ksh {amount}</Text>
            {"\n"}has been received by {chamaName}.
          </Text>
          <TouchableOpacity
            style={[S.btn, { marginTop: 32 }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={S.btnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === "failed") {
    return (
      <SafeAreaView style={S.screen}>
        <StatusBar style="dark" />
        <View style={S.statusView}>
          <View style={S.failCircle}>
            <Feather name="x" size={40} color={Colors.textPrimary} />
          </View>
          <Text style={[S.statusTitle, { color: Colors.error }]}>Imeshindwa</Text>
          <Text style={S.statusSub}>
            The payment was not completed.{"\n"}Please check your M-PESA balance and try again.
          </Text>
          <TouchableOpacity
            style={[S.btn, { marginTop: 24, backgroundColor: Colors.error }]}
            onPress={() => setStep("confirm")}
            activeOpacity={0.85}
          >
            <Text style={S.btnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={S.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={S.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === "confirm") {
    return (
      <SafeAreaView style={S.screen}>
        <StatusBar style="dark" />
        <View style={S.header}>
          <TouchableOpacity style={S.backBtn} onPress={() => setStep("input")}>
            <Feather name="chevron-left" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Confirm Payment</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={S.body}>
          <View style={S.confirmCard}>
            <Text style={S.confirmLabel}>YOU ARE SENDING</Text>
            <Text style={S.confirmAmount}>Ksh {amount}</Text>
            <Text style={S.confirmTo}>to <Text style={{ color: Colors.primary }}>{chamaName}</Text></Text>

            <View style={S.sep} />

            <View style={S.confirmRow}>
              <Text style={S.confirmRowLabel}>M-PESA number</Text>
              <Text style={S.confirmRowVal}>+254 {mpesaPhone}</Text>
            </View>
            <View style={S.confirmRow}>
              <Text style={S.confirmRowLabel}>Transaction fee</Text>
              <Text style={S.confirmRowVal}>Ksh 0</Text>
            </View>
            <View style={S.confirmRow}>
              <Text style={S.confirmRowLabel}>You will receive an STK push on your phone</Text>
              <Feather name="smartphone" size={16} color={Colors.primary} />
            </View>
          </View>

          <TouchableOpacity style={S.btn} onPress={handleConfirm} activeOpacity={0.85}>
            <Feather name="send" size={18} color={Colors.textPrimary} />
            <Text style={S.btnText}>Confirm & Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={S.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={S.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Input step (default) ───────────────────────────────────────────────────
  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="x" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Changa — Contribute</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={S.body}>
          {/* Chama chip */}
          <View style={S.chamaChip}>
            <Feather name="users" size={14} color={Colors.primary} />
            <Text style={S.chamaChipText}>{chamaName}</Text>
          </View>

          {/* Amount input */}
          <Text style={S.fieldLabel}>AMOUNT (KSH)</Text>
          <View style={[S.amtRow, amtFocused && S.focused]}>
            <Text style={S.currencyPrefix}>Ksh</Text>
            <View style={S.amtDivider} />
            <TextInput
              style={[S.amtInput, { outlineStyle: "none" } as any]}
              value={amount}
              onChangeText={(v) => setAmount(formatAmount(v))}
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              onFocus={() => setAmtFocused(true)}
              onBlur={() => setAmtFocused(false)}
            />
          </View>

          {/* Quick amount chips */}
          <View style={S.quickRow}>
            {[500, 1000, 2000, 5000].map((v) => (
              <TouchableOpacity
                key={v}
                style={[S.quickChip, amount === formatAmount(String(v)) && S.quickChipActive]}
                onPress={() => setAmount(formatAmount(String(v)))}
              >
                <Text style={[S.quickChipText, amount === formatAmount(String(v)) && { color: Colors.primary }]}>
                  {v >= 1000 ? `${v / 1000}K` : v}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* M-PESA number */}
          <Text style={[S.fieldLabel, { marginTop: 20 }]}>M-PESA NUMBER</Text>
          <View style={[S.amtRow, phoneFocused && S.focused]}>
            <Text style={S.currencyPrefix}>+254</Text>
            <View style={S.amtDivider} />
            <TextInput
              style={[S.amtInput, { outlineStyle: "none" } as any]}
              value={mpesaPhone}
              onChangeText={(v) => setMpesaPhone(v.replace(/\D/g, "").slice(0, 9))}
              placeholder="7XX XXX XXX"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
            />
          </View>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[S.btn, !canProceed && S.btnDisabled]}
            onPress={canProceed ? () => setStep("confirm") : undefined}
            activeOpacity={0.85}
          >
            <Text style={S.btnText}>Preview payment</Text>
            <Feather name="arrow-right" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  headerTitle: { flex: 1, textAlign: "center", fontFamily: FontFamily.extraBold, fontSize: 17, color: "#E8D6B5", fontWeight: "800" },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: "center", justifyContent: "center",
  },

  body: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },

  chamaChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#E8F7F4", borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginBottom: 24,
  },
  chamaChipText: { fontFamily: FontFamily.semiBold, fontSize: 13, color: Colors.primary },

  fieldLabel: {
    fontFamily: FontFamily.semiBold, fontSize: 10,
    color: Colors.textSecondary, letterSpacing: 1,
    textTransform: "uppercase", marginBottom: 8,
  },

  amtRow: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.background, height: 60, paddingHorizontal: 16,
    marginBottom: 12,
  },
  focused: { borderColor: Colors.primary, backgroundColor: "#E8F7F4" },
  currencyPrefix: { fontFamily: FontFamily.heading, fontSize: 16, color: "#E8D6B5", fontWeight: "700" },
  amtDivider: { width: 1, height: 24, backgroundColor: Colors.border, marginHorizontal: 12 },
  amtInput: {
    flex: 1, fontFamily: FontFamily.extraBold, fontSize: 28,
    color: "#E8D6B5", fontWeight: "800",
  },

  quickRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  quickChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border,
  },
  quickChipActive: { backgroundColor: "#E8F7F4", borderColor: Colors.primary },
  quickChipText:   { fontFamily: FontFamily.semiBold, fontSize: 13, color: Colors.textSecondary },

  btn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: Colors.primary, borderRadius: Radius.button,
    height: 54,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnText:     { fontFamily: FontFamily.heading, fontSize: 16, color: "#E8D6B5", fontWeight: "700" },
  btnDisabled: { opacity: 0.4 },

  cancelBtn:  { alignItems: "center", paddingVertical: 16 },
  cancelText: { fontFamily: FontFamily.semiBold, fontSize: 14, color: Colors.textMuted },

  // ── Confirm card ──────────────────────────────────────────────────────────
  confirmCard: {
    backgroundColor: Colors.background, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, padding: 20, marginBottom: 24,
  },
  confirmLabel:  { fontFamily: FontFamily.semiBold, fontSize: 10, color: Colors.textMuted, letterSpacing: 1, textTransform: "uppercase" },
  confirmAmount: { fontFamily: FontFamily.extraBold, fontSize: 40, color: "#E8D6B5", fontWeight: "800", marginVertical: 4 },
  confirmTo:     { fontFamily: FontFamily.regular,   fontSize: 14, color: Colors.textSecondary },
  sep:           { height: 1, backgroundColor: Colors.divider, marginVertical: 16 },
  confirmRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  confirmRowLabel: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, flex: 1, lineHeight: 18 },
  confirmRowVal:   { fontFamily: FontFamily.semiBold, fontSize: 13, color: "#E8D6B5" },

  // ── Status screens ────────────────────────────────────────────────────────
  statusView: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 40, gap: 12,
  },
  mpesaLogo: {
    backgroundColor: "#4CAF50", borderRadius: 16,
    paddingHorizontal: 24, paddingVertical: 12, marginBottom: 8,
  },
  mpesaLogoText: { fontFamily: FontFamily.extraBold, fontSize: 22, color: "#E8D6B5", fontWeight: "800", letterSpacing: 2 },
  statusTitle:   { fontFamily: FontFamily.extraBold, fontSize: 24, color: "#E8D6B5", fontWeight: "800", textAlign: "center" },
  statusSub:     { fontFamily: FontFamily.regular,   fontSize: 14, color: Colors.textSecondary, textAlign: "center", lineHeight: 22 },
  statusHint:    { fontFamily: FontFamily.semiBold,  fontSize: 13, color: Colors.textMuted },

  dotsRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  dot:     { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },

  successCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.success,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
    shadowColor: Colors.success, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  failCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.error,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
    shadowColor: Colors.error, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
});
