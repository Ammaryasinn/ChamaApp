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
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Step = "name" | "choice" | "join";

export default function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>("name");
  const [fullName, setFullName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: Save name ─────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const val = await AsyncStorage.getItem("hazina.user");
      if (val) {
        const user = JSON.parse(val);
        user.fullName = fullName.trim();
        await AsyncStorage.setItem("hazina.user", JSON.stringify(user));
      }
      setStep("choice");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Join with invite code ─────────────────────────────────────────
  const handleJoinWithCode = async () => {
    if (inviteCode.trim().length < 4) {
      setError("Please enter a valid invite code.");
      return;
    }
    setError("");
    setLoading(true);
    // In production this would call POST /api/chamas/join { inviteCode }
    // For now simulate a short delay then go to dashboard
    setTimeout(async () => {
      setLoading(false);
      navigation.replace("MainTabs");
    }, 1200);
  };

  const firstName = fullName.trim().split(" ")[0] || "there";

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── STEP 1: Name ── */}
          {step === "name" && (
            <>
              {/* Top illustration area */}
              <View style={styles.topArea}>
                <View style={styles.avatarRing}>
                  <View style={styles.avatarInner}>
                    <Text style={styles.avatarEmoji}>👋</Text>
                  </View>
                </View>
                <Text style={styles.topLabel}>STEP 1 OF 2</Text>
                <Text style={styles.heroTitle}>What's your name?</Text>
                <Text style={styles.heroSubtitle}>
                  This is how your chama members will see you.
                </Text>
              </View>

              {/* Card */}
              <View style={styles.card}>
                <Text style={styles.inputLabel}>Full name</Text>
                <TextInput
                  style={[styles.input, error ? styles.inputError : null]}
                  value={fullName}
                  onChangeText={(t) => {
                    setFullName(t);
                    setError("");
                  }}
                  placeholder="e.g. Wanjiru Kamau"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                />

                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠ {error}</Text>
                  </View>
                ) : null}

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    fullName.trim().length < 2 && styles.primaryBtnDisabled,
                    pressed && fullName.trim().length >= 2 && { opacity: 0.88 },
                  ]}
                  onPress={handleSaveName}
                  disabled={fullName.trim().length < 2 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Continue →</Text>
                  )}
                </Pressable>
              </View>
            </>
          )}

          {/* ── STEP 2: Choice ── */}
          {step === "choice" && (
            <>
              <View style={styles.topArea}>
                <View style={[styles.avatarRing, { borderColor: "#D1FAE5" }]}>
                  <View
                    style={[styles.avatarInner, { backgroundColor: "#006D5B" }]}
                  >
                    <Text style={styles.avatarInitial}>
                      {fullName.trim()[0]?.toUpperCase() || "W"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.topLabel}>STEP 2 OF 2</Text>
                <Text style={styles.heroTitle}>Hey {firstName}! 👋</Text>
                <Text style={styles.heroSubtitle}>
                  Would you like to start a new chama or join one a friend has
                  already created?
                </Text>
              </View>

              <View style={styles.choiceContainer}>
                {/* Create */}
                <Pressable
                  style={({ pressed }) => [
                    styles.choiceCard,
                    pressed && styles.choiceCardPressed,
                  ]}
                  onPress={() => navigation.replace("ChamaType")}
                >
                  <View
                    style={[
                      styles.choiceIconBox,
                      { backgroundColor: "#ECFDF5" },
                    ]}
                  >
                    <Text style={styles.choiceIcon}>🏛️</Text>
                  </View>
                  <View style={styles.choiceTextBlock}>
                    <Text style={styles.choiceTitle}>Create a Chama</Text>
                    <Text style={styles.choiceDesc}>
                      Start fresh. You'll become the Chairperson and invite
                      members to join.
                    </Text>
                  </View>
                  <View style={styles.choiceArrowBox}>
                    <Text style={styles.choiceArrow}>›</Text>
                  </View>
                </Pressable>

                {/* Divider */}
                <View style={styles.orRow}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.orLine} />
                </View>

                {/* Join */}
                <Pressable
                  style={({ pressed }) => [
                    styles.choiceCard,
                    styles.choiceCardJoin,
                    pressed && styles.choiceCardPressed,
                  ]}
                  onPress={() => {
                    setError("");
                    setStep("join");
                  }}
                >
                  <View
                    style={[
                      styles.choiceIconBox,
                      { backgroundColor: "#EFF6FF" },
                    ]}
                  >
                    <Text style={styles.choiceIcon}>🤝</Text>
                  </View>
                  <View style={styles.choiceTextBlock}>
                    <Text style={styles.choiceTitle}>Join a Chama</Text>
                    <Text style={styles.choiceDesc}>
                      Enter an invite code your friend or chairperson shared
                      with you.
                    </Text>
                  </View>
                  <View style={styles.choiceArrowBox}>
                    <Text style={styles.choiceArrow}>›</Text>
                  </View>
                </Pressable>

                {/* Skip */}
                <Pressable
                  style={styles.skipBtn}
                  onPress={() => navigation.replace("MainTabs")}
                >
                  <Text style={styles.skipBtnText}>I'll do this later →</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ── STEP 3: Join with code ── */}
          {step === "join" && (
            <>
              <View style={styles.topArea}>
                <View style={[styles.avatarRing, { borderColor: "#DBEAFE" }]}>
                  <View
                    style={[styles.avatarInner, { backgroundColor: "#1D4ED8" }]}
                  >
                    <Text style={styles.avatarEmoji}>🔑</Text>
                  </View>
                </View>
                <Text style={styles.topLabel}>JOIN A CHAMA</Text>
                <Text style={styles.heroTitle}>Enter invite code</Text>
                <Text style={styles.heroSubtitle}>
                  Ask your chairperson or friend for the 6-character code for
                  their chama.
                </Text>
              </View>

              <View style={styles.card}>
                {/* Code input */}
                <Text style={styles.inputLabel}>Invite code</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.codeInput,
                    error ? styles.inputError : null,
                  ]}
                  value={inviteCode}
                  onChangeText={(t) => {
                    setInviteCode(t.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                    setError("");
                  }}
                  placeholder="e.g. T2X9P4"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={8}
                  returnKeyType="done"
                  onSubmitEditing={handleJoinWithCode}
                  autoFocus
                />

                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠ {error}</Text>
                  </View>
                ) : null}

                {/* Info hint */}
                <View style={styles.hintBox}>
                  <Text style={styles.hintText}>
                    💡 The chairperson can find the invite code in their chama
                    settings or by tapping "Invite Members".
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    inviteCode.trim().length < 4 && styles.primaryBtnDisabled,
                    pressed &&
                      inviteCode.trim().length >= 4 && { opacity: 0.88 },
                  ]}
                  onPress={handleJoinWithCode}
                  disabled={inviteCode.trim().length < 4 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Join Chama →</Text>
                  )}
                </Pressable>

                <Pressable
                  style={styles.backBtn}
                  onPress={() => {
                    setStep("choice");
                    setInviteCode("");
                    setError("");
                  }}
                >
                  <Text style={styles.backBtnText}>← Back</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingBottom: Spacing[12] },

  // ── Top area ──
  topArea: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: Spacing[7],
    paddingTop: Spacing[12],
    paddingBottom: Spacing[13],
    alignItems: "center",
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
  },
  avatarInner: {
    width: 66,
    height: 66,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: FontSize["5xl"] },
  avatarInitial: {
    color: Colors.textInverse,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  topLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 2,
    marginBottom: Spacing[3],
  },
  heroTitle: {
    color: Colors.primaryLight,
    fontSize: FontSize["6xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    textAlign: "center",
    marginBottom: Spacing[3],
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 23,
    textAlign: "center",
    opacity: 0.85,
    maxWidth: 300,
  },

  // ── Card ──
  card: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    marginTop: -20,
    paddingHorizontal: Spacing[7],
    paddingTop: Spacing[9],
    paddingBottom: Spacing[8],
    ...Shadow.heroCard,
    flex: 1,
  },

  inputLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing[2.5],
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing[4.5],
    paddingVertical: Spacing[4],
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing[4],
  },
  inputError: {
    borderColor: Colors.errorLight,
    backgroundColor: Colors.errorBg,
  },
  codeInput: {
    textAlign: "center",
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 8,
    color: Colors.primary,
  },

  errorBox: {
    backgroundColor: Colors.errorBg,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.errorLight,
    paddingHorizontal: Spacing[3.5],
    paddingVertical: Spacing[2.5],
    marginBottom: Spacing[4],
  },
  errorText: {
    color: Colors.errorDark,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  hintBox: {
    backgroundColor: Colors.accentTint,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    paddingHorizontal: Spacing[3.5],
    paddingVertical: Spacing[3],
    marginBottom: Spacing[5],
  },
  hintText: {
    color: Colors.warningDark,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    lineHeight: 19,
  },

  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4.5],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3],
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

  backBtn: {
    alignItems: "center",
    paddingVertical: Spacing[3],
  },
  backBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // ── Choice cards ──
  choiceContainer: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    marginTop: -20,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[9],
    paddingBottom: Spacing[8],
    flex: 1,
    ...Shadow.heroCard,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing[4.5],
    marginBottom: Spacing[1],
  },
  choiceCardJoin: {
    borderColor: Colors.infoLight,
    backgroundColor: Colors.infoBg,
  },
  choiceCardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  choiceIconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[4],
  },
  choiceIcon: { fontSize: FontSize["4xl"] },
  choiceTextBlock: { flex: 1 },
  choiceTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  choiceDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 19,
  },
  choiceArrowBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing[2],
  },
  choiceArrow: {
    color: Colors.primary,
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginTop: -2,
  },

  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing[4],
    gap: Spacing[3],
  },
  orLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  skipBtn: {
    alignItems: "center",
    paddingVertical: Spacing[4],
    marginTop: Spacing[2],
  },
  skipBtnText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
});
