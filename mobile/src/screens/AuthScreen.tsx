import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image,
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
import { authApi } from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────────────────────────────────────
//  Hazina logo
// ─────────────────────────────────────────────────────────────────────────────

function HazinaLogo({ size = 32 }: { size?: number }) {
  return (
    <Image 
      source={require("../../assets/images/logo.png")} 
      style={{ width: size * 4, height: size * 4, resizeMode: "contain" }} 
    />
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
  value,
  onChangeText,
  focused,
  onFocus,
  onBlur,
}: {
  value: string;
  onChangeText: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <View style={[S.phoneRow, focused ? S.phoneRowFocused : S.phoneRowBlur]}>
      <Text style={S.prefix}>+254</Text>
      <View style={S.phoneDivider} />
      <TextInput
        style={[S.phoneInput, { outlineStyle: "none" } as any]}
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

function AuthEntryView({
  mode,
  onToggleMode,
  onSendOtp,
}: {
  mode: "signin" | "signup";
  onToggleMode: () => void;
  onSendOtp: (
    phone: string,
    extraData?: { fullName: string; nationalId: string },
  ) => void;
}) {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [focused, setFocused] = useState(false);

  const isSignUp = mode === "signup";

  return (
    <>
      {/* Taller hero — more breathing room for the logo */}
      <View style={S.hero}>
        <HeroCircles />
        <View style={S.heroContent}>
          <HazinaLogo size={34} />
          <Text style={S.heroTagline}>Your group's financial home</Text>
          <Text style={S.heroSub}>
            Manage contributions, track savings, and unlock bank loans —
            together.
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={S.content}>
        <Text style={S.contentTitle}>
          {isSignUp ? "Create an account" : "Welcome back"}
        </Text>
        <Text style={S.contentSub}>
          {isSignUp
            ? "Enter your phone number to sign up"
            : "Sign in with your phone number"}
        </Text>

        {isSignUp && (
          <>
            <Text style={S.fieldLabel}>FULL NAME</Text>
            <View style={[S.phoneRow, S.phoneRowBlur]}>
              <TextInput
                style={[S.phoneInput, { outlineStyle: "none" } as any]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="E.g. John Doe"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <Text style={S.fieldLabel}>NATIONAL ID</Text>
            <View style={[S.phoneRow, S.phoneRowBlur]}>
              <TextInput
                style={[S.phoneInput, { outlineStyle: "none" } as any]}
                value={nationalId}
                onChangeText={setNationalId}
                placeholder="E.g. 12345678"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
          </>
        )}

        <Text style={S.fieldLabel}>PHONE NUMBER</Text>
        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        <TouchableOpacity
          style={[
            S.btnPrimary,
            (!phone || (isSignUp && (!fullName || !nationalId))) &&
              S.btnDisabled,
          ]}
          onPress={async () => {
            if (!phone) return;
            if (isSignUp && (!fullName || !nationalId)) return;
            try {
              const fullPhone = phone.startsWith("+") ? phone : `+254${phone}`;
              await authApi.requestOtp(fullPhone);
              onSendOtp(phone, isSignUp ? { fullName, nationalId } : undefined);
            } catch (e: any) {
              alert(e?.response?.data?.error || "Failed to send OTP");
            }
          }}
          activeOpacity={0.85}
        >
          <Text style={S.btnPrimaryText}>
            {isSignUp ? "Sign up" : "Log in"}
          </Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>

        <View style={S.dividerRow}>
          <View style={S.dividerLine} />
          <Text style={S.dividerText}>
            {isSignUp ? "Already have an account?" : "New to Hazina?"}
          </Text>
          <View style={S.dividerLine} />
        </View>

        <TouchableOpacity
          style={S.btnSecondary}
          onPress={onToggleMode}
          activeOpacity={0.85}
        >
          <Text style={S.btnSecondaryText}>
            {isSignUp ? "Log in instead" : "Create an account"}
          </Text>
        </TouchableOpacity>

        <Text style={S.terms}>
          By continuing you agree to our <Text style={S.termsLink}>Terms</Text>{" "}
          and <Text style={S.termsLink}>Privacy Policy</Text>
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
  onVerify: (user: any) => void;
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
    if (text && idx < 5) {
      refs[idx + 1].current?.focus();
      setFocusedIndex(idx + 1);
    }
    if (!text && idx > 0) {
      refs[idx - 1].current?.focus();
      setFocusedIndex(idx - 1);
    }
  };

  const formatted =
    "+254 " + phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

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
                d ? S.otpBoxFilled : null,
                focusedIndex === i ? S.otpBoxActive : null,
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
          onPress={async () => {
            if (!complete) return;
            try {
              const fullPhone = phone.startsWith("+") ? phone : `+254${phone}`;
              const res = await authApi.verifyOtp(fullPhone, digits.join(""));
              await AsyncStorage.setItem(
                "hazina.accessToken",
                res.data.accessToken,
              );
              onVerify(res.data.user);
            } catch (e: any) {
              alert(e?.response?.data?.error || "Invalid verification code");
            }
          }}
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
  const [step, setStep] = useState<"signup" | "signin" | "otp">("signup");
  const [phone, setPhone] = useState("");
  const [signupData, setSignupData] = useState<{
    fullName: string;
    nationalId: string;
  }>();

  const handleVerify = async (user: any) => {
    try {
      if (signupData) {
        await authApi.updateProfile(signupData);
        user.fullName = signupData.fullName;
      }
    } catch (e) {
      console.error("Failed to update profile", e);
    }

    if (user.isVerified || user.fullName !== "User") {
      navigation.replace("MainTabs");
    } else {
      navigation.replace("Onboarding");
    }
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === "signin" || step === "signup" ? (
            <AuthEntryView
              mode={step}
              onToggleMode={() =>
                setStep(step === "signup" ? "signin" : "signup")
              }
              onSendOtp={(p, extra) => {
                setPhone(p);
                if (extra) setSignupData(extra);
                setStep("otp");
              }}
            />
          ) : (
            <OtpView
              phone={phone}
              onVerify={handleVerify}
              onBack={() => setStep("signup")}
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
    paddingTop: 60, // extra top room
    paddingBottom: 44, // extra bottom room before the white card
    overflow: "hidden",
    minHeight: 260, // taller than before
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
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -70,
    right: -70,
  },
  circleBottomLeft: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(245,158,11,0.10)",
    bottom: -60,
    left: -50,
  },

  logo: {
    fontFamily: FontFamily.extraBold,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    color: "#E8D6B5",
    fontWeight: "700",
    marginTop: 4,
  },
  heroTaglineCompact: {
    fontFamily: FontFamily.heading,
    fontSize: 18,
    color: "#E8D6B5",
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── White content area ───────────────────────────────────────────────────
  content: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[10],
  },

  contentTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 20,
    color: "#E8D6B5",
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
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.badge,
    borderWidth: 1,
    paddingHorizontal: Spacing[4],
    height: 52,
    marginBottom: Spacing[5],
  },
  phoneRowBlur: { backgroundColor: "#F6F9F7", borderColor: "#EBF1EF" },
  phoneRowFocused: { backgroundColor: "#E8F7F4", borderColor: Colors.primary },
  prefix: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: "#E8D6B5",
    marginRight: Spacing[3],
  },
  phoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#EBF1EF",
    marginRight: Spacing[3],
  },
  phoneInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: "#E8D6B5",
  },

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
    height: 56, // fixed height — no aspectRatio
    minWidth: 0, // allow shrinking below content width
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#EBF1EF",
    backgroundColor: "#F6F9F7",
    textAlign: "center",
    fontFamily: FontFamily.heading,
    fontSize: 22,
    color: "#E8D6B5",
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
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: Spacing[5],
  },
  btnPrimaryText: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    color: "#E8D6B5",
    fontWeight: "700",
  },
  btnDisabled: { opacity: 0.42 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EBF1EF" },
  dividerText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },

  btnSecondary: {
    borderRadius: Radius.button,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#EBF1EF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[6],
  },
  btnSecondaryText: {
    fontFamily: FontFamily.heading,
    fontSize: 15,
    color: "#E8D6B5",
    fontWeight: "700",
  },

  terms: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
  termsLink: { color: Colors.primary, fontFamily: FontFamily.semiBold },

  resendRow: {
    textAlign: "center",
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 16,
  },
  resendMuted: { color: Colors.textMuted, fontFamily: FontFamily.medium },
  resendLink: { color: Colors.primary, fontFamily: FontFamily.semiBold },
});
