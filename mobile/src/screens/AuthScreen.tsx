import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
//  Hazina logo
// ─────────────────────────────────────────────────────────────────────────────

function HazinaLogo({ size = 32 }: { size?: number }) {
  return (
    <Text style={[S.logo, { fontSize: size }]}>
      <Text style={{ color: "#FFFFFF" }}>Hazi</Text>
      <Text style={{ color: "#F59E0B" }}>na</Text>
    </Text>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hero circle overlays
// ─────────────────────────────────────────────────────────────────────────────

function HeroCircles() {
  return (
    <>
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Phone input
// ─────────────────────────────────────────────────────────────────────────────

function PhoneInput({
  value, onChangeText, focused, onFocus, onBlur,
}: {
  value: string; onChangeText: (v: string) => void;
  focused: boolean; onFocus: () => void; onBlur: () => void;
}) {
  return (
    <View style={[S.phoneRow, focused ? S.phoneRowFocused : S.phoneRowBlur]}>
      <Text style={S.prefix}>+254</Text>
      <View style={S.phoneDivider} />
      <TextInput
        style={S.phoneInput}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="7XX XXX XXX"
        placeholderTextColor={Colors.textMuted}
        keyboardType="phone-pad"
        maxLength={9}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Sign-in view
// ─────────────────────────────────────────────────────────────────────────────

function SignInView({
  onSendOtp,
  onCreateAccount,
}: {
  onSendOtp: (phone: string) => void;
  onCreateAccount: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <>
      {/* Taller hero — more breathing room for the logo */}
      <View style={S.hero}>
        <HeroCircles />
        <View style={S.heroContent}>
          <HazinaLogo size={34} />
          <Text style={S.heroTagline}>Your group's financial home</Text>
          <Text style={S.heroSub}>
            Manage contributions, track savings, and unlock bank loans — together.
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={S.content}>
        <Text style={S.contentTitle}>Welcome back</Text>
        <Text style={S.contentSub}>Sign in with your phone number</Text>

        <Text style={S.fieldLabel}>PHONE NUMBER</Text>
        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        <TouchableOpacity
          style={[S.btnPrimary, !phone && S.btnDisabled]}
          onPress={() => phone && onSendOtp(phone)}
          activeOpacity={0.85}
        >
          <Text style={S.btnPrimaryText}>Send OTP code</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={S.dividerRow}>
          <View style={S.dividerLine} />
          <Text style={S.dividerText}>New to Hazina?</Text>
          <View style={S.dividerLine} />
        </View>

        <TouchableOpacity style={S.btnSecondary} onPress={onCreateAccount} activeOpacity={0.85}>
          <Text style={S.btnSecondaryText}>Create an account</Text>
        </TouchableOpacity>

        <Text style={S.terms}>
          By continuing you agree to our{" "}
          <Text style={S.termsLink}>Terms</Text> and{" "}
          <Text style={S.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  OTP view
// ─────────────────────────────────────────────────────────────────────────────

function OtpView({
  phone,
  onVerify,
  onBack,
}: {
  phone: string;
  onVerify: () => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [resendSecs, setResendSecs] = useState(42);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const refs = Array.from({ length: 6 }, () => useRef<TextInput>(null));
  const complete = digits.every((d) => d !== "");

  useEffect(() => {
    if (resendSecs <= 0) return;
    const t = setTimeout(() => setResendSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSecs]);

  const handleChange = (text: string, idx: number) => {
    const next = [...digits];
    next[idx] = text;
    setDigits(next);
    if (text && idx < 5) { refs[idx + 1].current?.focus(); setFocusedIndex(idx + 1); }
    if (!text && idx > 0) { refs[idx - 1].current?.focus(); setFocusedIndex(idx - 1); }
  };

  const formatted = "+254 " + phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  return (
    <>
      {/* Shorter hero for OTP */}
      <View style={[S.hero, S.heroShort]}>
        <HeroCircles />
        <Pressable onPress={onBack} style={S.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={18} color="#fff" />
        </Pressable>
        <View style={{ marginTop: 10 }}>
          <HazinaLogo size={24} />
        </View>
        <Text style={S.heroTaglineCompact}>Verify your number</Text>
        <Text style={S.heroSub}>Code sent to {formatted}</Text>
      </View>

      {/* Content */}
      <View style={S.content}>
        <Text style={S.contentTitle}>Enter OTP</Text>
        <Text style={S.contentSub}>Check your SMS for a 6-digit code</Text>

        {/* 6 square boxes — ample padding, equal width */}
        <View style={S.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={refs[i] as React.RefObject<TextInput>}
              style={[
                S.otpBox,
                d        ? S.otpBoxFilled  : null,
                focusedIndex === i ? S.otpBoxActive  : null,
              ]}
              value={d}
              onChangeText={(t) => handleChange(t, i)}
              maxLength={1}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              selectTextOnFocus
              onFocus={() => setFocusedIndex(i)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[S.btnPrimary, !complete && S.btnDisabled]}
          onPress={complete ? onVerify : undefined}
          activeOpacity={0.85}
        >
          <Feather name="arrow-right" size={18} color="#fff" />
          <Text style={S.btnPrimaryText}>Verify code</Text>
        </TouchableOpacity>

        <Text style={S.resendRow}>
          Didn't receive a code?{" "}
          {resendSecs > 0 ? (
            <Text style={S.resendMuted}>
              Resend in 0:{String(resendSecs).padStart(2, "0")}
            </Text>
          ) : (
            <Text style={S.resendLink} onPress={() => setResendSecs(42)}>
              Resend now
            </Text>
          )}
        </Text>
      </View>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthScreen({ navigation }: any) {
  const [step, setStep] = useState<"signin" | "otp">("signin");
  const [phone, setPhone] = useState("");

  const handleVerify = () => {
    // Simulate: numbers starting with 71x are "existing" users
    // In production this would hit the API
    const isExistingUser = phone.startsWith("71");
    if (isExistingUser) {
      navigation.replace("MainTabs");
    } else {
      navigation.replace("Onboarding");
    }
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === "signin" ? (
            <SignInView
              onSendOtp={(p) => { setPhone(p); setStep("otp"); }}
              onCreateAccount={() => navigation.navigate("Onboarding")}
            />
          ) : (
            <OtpView
              phone={phone}
              onVerify={handleVerify}
              onBack={() => setStep("signin")}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },

  // ── Hero — TALL for sign-in, shorter for OTP ─────────────────────────────
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[6],
    paddingTop: 60,           // extra top room
    paddingBottom: 44,        // extra bottom room before the white card
    overflow: "hidden",
    minHeight: 260,           // taller than before
  },
  heroShort: {
    paddingTop: 44,
    paddingBottom: 28,
    minHeight: 180,
  },

  heroContent: {
    gap: 8,
    marginTop: 16,
  },

  circleTopRight: {
    position: "absolute", width: 240, height: 240, borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.05)", top: -70, right: -70,
  },
  circleBottomLeft: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(245,158,11,0.10)", bottom: -60, left: -50,
  },

  logo: {
    fontFamily: FontFamily.extraBold,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 4,
  },
  heroTaglineCompact: {
    fontFamily: FontFamily.heading,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 8,
  },
  heroSub: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 19,
  },

  backBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },

  // ── White content area ───────────────────────────────────────────────────
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[10],
  },

  contentTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: "800",
    marginBottom: 4,
  },
  contentSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 24,
  },

  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  // ── Phone input ─────────────────────────────────────────────────────────
  phoneRow: {
    flexDirection: "row", alignItems: "center",
    borderRadius: Radius.badge, borderWidth: 1,
    paddingHorizontal: Spacing[4], height: 52,
    marginBottom: Spacing[5],
  },
  phoneRowBlur:    { backgroundColor: "#F6F9F7", borderColor: "#EBF1EF" },
  phoneRowFocused: { backgroundColor: "#E8F7F4", borderColor: Colors.primary },
  prefix:      { fontFamily: FontFamily.medium, fontSize: FontSize.base, color: Colors.textPrimary, marginRight: Spacing[3] },
  phoneDivider:{ width: 1, height: 20, backgroundColor: "#EBF1EF", marginRight: Spacing[3] },
  phoneInput:  { flex: 1, fontFamily: FontFamily.regular, fontSize: FontSize.base, color: Colors.textPrimary },

  // ── OTP boxes — fixed size so 6 fit on any screen ──────────────────────────
  otpRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: Spacing[6],
    marginTop: 8,
    justifyContent: "space-between",
  },
  otpBox: {
    flex: 1,
    height: 56,             // fixed height — no aspectRatio
    minWidth: 0,            // allow shrinking below content width
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EBF1EF",
    backgroundColor: "#F6F9F7",
    textAlign: "center",
    fontFamily: FontFamily.heading,
    fontSize: 22,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: "#E8F7F4",
    color: Colors.primary,
  },
  otpBoxActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },

  // ── Buttons ─────────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: Radius.button,
    height: 52, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8, marginBottom: Spacing[5],
  },
  btnPrimaryText: { fontFamily: FontFamily.heading, fontSize: 16, color: "#FFFFFF", fontWeight: "700" },
  btnDisabled: { opacity: 0.42 },

  dividerRow:  { flexDirection: "row", alignItems: "center", gap: Spacing[3], marginBottom: Spacing[4] },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EBF1EF" },
  dividerText: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted },

  btnSecondary: {
    borderRadius: Radius.button, height: 52, borderWidth: 1.5,
    borderColor: "#EBF1EF", alignItems: "center", justifyContent: "center", marginBottom: Spacing[6],
  },
  btnSecondaryText: { fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700" },

  terms:     { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, textAlign: "center", lineHeight: 16 },
  termsLink: { color: Colors.primary, fontFamily: FontFamily.semiBold },

  resendRow:   { textAlign: "center", fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, marginTop: 16 },
  resendMuted: { color: Colors.textMuted, fontFamily: FontFamily.medium },
  resendLink:  { color: Colors.primary, fontFamily: FontFamily.semiBold },
});
