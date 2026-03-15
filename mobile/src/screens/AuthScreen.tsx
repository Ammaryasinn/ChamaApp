import React, { useState } from "react";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { apiClient } from "../api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

function normalizeKenyanPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10)
    return `+254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("7")) return `+254${digits}`;
  return value.trim();
}

function isValidKenyanPhoneNumber(value: string) {
  return /^\+2547\d{8}$/.test(value);
}

export default function AuthScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const normalizedPhone = normalizeKenyanPhoneNumber(phoneNumber);
  const isPhoneValid = isValidKenyanPhoneNumber(normalizedPhone);

  const handleMockLogin = async () => {
    // No fullName set — so onboarding flow is triggered
    const mockUser = {
      id: "mock-user-1",
      phoneNumber: "+254712345678",
      fullName: "",
      isVerified: true,
    };
    await AsyncStorage.setItem("hazina.accessToken", "mock-token");
    await AsyncStorage.setItem("hazina.refreshToken", "mock-refresh");
    await AsyncStorage.setItem("hazina.user", JSON.stringify(mockUser));
    navigation.replace("Onboarding");
  };

  const handleRequestOtp = async () => {
    if (!isPhoneValid) return;
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/request-otp", {
        phoneNumber: normalizedPhone,
      });
      setSubmittedPhone(normalizedPhone);
      setDevOtpHint(response.data.code || "");
      setSuccessMessage("Code sent!");
      setStep("otp");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "Could not send code. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!submittedPhone || otpCode.trim().length !== 6) return;
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await apiClient.post("/auth/verify-otp", {
        phoneNumber: submittedPhone,
        code: otpCode.trim(),
      });
      const { accessToken, refreshToken, user } = response.data;
      await AsyncStorage.setItem("hazina.accessToken", accessToken);
      await AsyncStorage.setItem("hazina.refreshToken", refreshToken);
      await AsyncStorage.setItem("hazina.user", JSON.stringify(user));
      if (!user.fullName || user.fullName === "User") {
        navigation.replace("Onboarding");
      } else {
        navigation.replace("MainTabs");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "Invalid code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero Section ── */}
          <View style={styles.hero}>
            {/* Decorative blobs */}
            <View style={styles.blobTopRight} />
            <View style={styles.blobBottomLeft} />

            {/* Logo mark */}
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>H</Text>
            </View>

            <Text style={styles.brandName}>HAZINA</Text>
            <Text style={styles.heroTitle}>
              Your chama,{"\n"}under control.
            </Text>
            <Text style={styles.heroSubtitle}>
              Contributions · MGR cycles · Group loans{"\n"}Built for Kenyan
              savings groups.
            </Text>

            {/* Feature pills */}
            <View style={styles.pillsRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>📱 M-Pesa</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>🏦 Group loans</Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>📊 Credit score</Text>
              </View>
            </View>
          </View>

          {/* ── Card Section ── */}
          <View style={styles.card}>
            {step === "phone" ? (
              <>
                <Text style={styles.cardTitle}>Get started</Text>
                <Text style={styles.cardSubtitle}>
                  Enter your Kenyan phone number to sign in or create an
                  account.
                </Text>

                {/* Phone input */}
                <View style={styles.phoneInputWrapper}>
                  <View style={styles.countryFlag}>
                    <Text style={styles.countryFlagText}>🇰🇪</Text>
                    <Text style={styles.countryCode}>+254</Text>
                  </View>
                  <TextInput
                    value={phoneNumber}
                    onChangeText={(t) => {
                      setPhoneNumber(t);
                      setErrorMessage("");
                    }}
                    placeholder="7XX XXX XXX"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                    maxLength={15}
                  />
                </View>

                {errorMessage ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorBoxText}>⚠ {errorMessage}</Text>
                  </View>
                ) : null}

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    (!isPhoneValid || loading) && styles.primaryBtnDisabled,
                    pressed && isPhoneValid && { opacity: 0.88 },
                  ]}
                  onPress={handleRequestOtp}
                  disabled={!isPhoneValid || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      Send verification code →
                    </Text>
                  )}
                </Pressable>

                <Text style={styles.termsText}>
                  By continuing you agree to our Terms of Service and Privacy
                  Policy.
                </Text>
              </>
            ) : (
              <>
                {/* OTP Step */}
                <Pressable
                  onPress={() => {
                    setStep("phone");
                    setOtpCode("");
                    setErrorMessage("");
                  }}
                  style={styles.backLink}
                >
                  <Text style={styles.backLinkText}>← Change number</Text>
                </Pressable>

                <Text style={styles.cardTitle}>Check your phone</Text>
                <Text style={styles.cardSubtitle}>
                  We sent a 6-digit code to{" "}
                  <Text style={styles.cardSubtitleBold}>{submittedPhone}</Text>
                </Text>

                {devOtpHint ? (
                  <View style={styles.devHintBox}>
                    <Text style={styles.devHintText}>
                      🔧 Dev code: {devOtpHint}
                    </Text>
                  </View>
                ) : null}

                {/* OTP boxes */}
                <View style={styles.otpWrapper}>
                  <TextInput
                    value={otpCode}
                    onChangeText={(t) => {
                      setOtpCode(t.replace(/\D/g, ""));
                      setErrorMessage("");
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.otpInput}
                    placeholder="──────"
                    placeholderTextColor="#D1D5DB"
                    textAlign="center"
                  />
                </View>

                {errorMessage ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorBoxText}>⚠ {errorMessage}</Text>
                  </View>
                ) : null}

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    (otpCode.trim().length !== 6 || loading) &&
                      styles.primaryBtnDisabled,
                    pressed && otpCode.trim().length === 6 && { opacity: 0.88 },
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={otpCode.trim().length !== 6 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Verify & enter →</Text>
                  )}
                </Pressable>

                <Pressable onPress={handleRequestOtp} style={styles.resendLink}>
                  <Text style={styles.resendLinkText}>
                    Didn't get a code? Resend
                  </Text>
                </Pressable>
              </>
            )}
          </View>

          {/* ── Demo bypass ── */}
          <View style={styles.demoSection}>
            <View style={styles.demoDividerRow}>
              <View style={styles.demoDivider} />
              <Text style={styles.demoDividerText}>or try the demo</Text>
              <View style={styles.demoDivider} />
            </View>
            <Pressable style={styles.demoBtn} onPress={handleMockLogin}>
              <Text style={styles.demoBtnText}>🚀 Enter demo as Wanjiru</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfaceDark,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: Spacing[10],
  },

  // ── Hero ──
  hero: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing[7],
    paddingTop: Spacing[12],
    paddingBottom: Spacing[11],
    position: "relative",
    overflow: "hidden",
  },
  blobTopRight: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: Radius.full,
    backgroundColor: "#0E7C66",
    opacity: 0.25,
  },
  blobBottomLeft: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    opacity: 0.12,
  },

  logoMark: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
    ...Shadow.fab,
  },
  logoMarkText: {
    color: Colors.textInverse,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  brandName: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 3,
    marginBottom: Spacing[3],
  },
  heroTitle: {
    color: Colors.primaryLight,
    fontSize: FontSize["7xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 46,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.base,
    lineHeight: 22,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing[7],
    opacity: 0.85,
  },

  pillsRow: {
    flexDirection: "row",
    gap: Spacing[2],
    flexWrap: "wrap",
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(110,231,183,0.2)",
    paddingHorizontal: Spacing[3],
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  pillText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // ── Card ──
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    marginTop: -16,
    paddingHorizontal: Spacing[7],
    paddingTop: Spacing[9],
    paddingBottom: Spacing[8],
    ...Shadow.heroCard,
    minHeight: 380,
  },

  backLink: {
    marginBottom: Spacing[4],
  },
  backLinkText: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[2],
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 22,
    marginBottom: Spacing[7],
  },
  cardSubtitleBold: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Phone input
  phoneInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    marginBottom: Spacing[4],
    overflow: "hidden",
  },
  countryFlag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[3.5],
    paddingVertical: Spacing[4],
    borderRightWidth: 1.5,
    borderRightColor: Colors.border,
    gap: Spacing[1.5],
    backgroundColor: Colors.divider,
  },
  countryFlagText: { fontSize: FontSize["3xl"] },
  countryCode: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },

  // OTP input
  otpWrapper: {
    marginBottom: Spacing[4],
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    paddingVertical: Spacing[5],
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    letterSpacing: 14,
  },

  // Error box
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.errorLight,
    paddingHorizontal: Spacing[3.5],
    paddingVertical: Spacing[2.5],
    marginBottom: Spacing[4],
  },
  errorBoxText: {
    color: Colors.errorDark,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // Dev hint
  devHintBox: {
    backgroundColor: Colors.accentTint,
    borderRadius: Radius.badge,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    marginBottom: Spacing[4],
  },
  devHintText: {
    color: Colors.warningDark,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Primary button
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4.5],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
    ...Shadow.fab,
    minHeight: 56,
  },
  primaryBtnDisabled: {
    backgroundColor: Colors.borderStrong,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.2,
  },

  termsText: {
    color: Colors.textMuted,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    textAlign: "center",
    lineHeight: 18,
  },

  resendLink: {
    alignItems: "center",
    paddingVertical: Spacing[1],
  },
  resendLinkText: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // ── Demo section ──
  demoSection: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing[7],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[2],
  },
  demoDividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  demoDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  demoDividerText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    opacity: 0.7,
  },
  demoBtn: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: "rgba(110,231,183,0.3)",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: Spacing[4],
    alignItems: "center",
  },
  demoBtnText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
});
