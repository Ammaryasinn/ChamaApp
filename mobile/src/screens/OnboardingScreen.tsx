import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
//  Shared components
// ─────────────────────────────────────────────────────────────────────────────

function HazinaLogo({ size = 22 }: { size?: number }) {
  return (
    <Text style={[S.logo, { fontSize: size }]}>
      <Text style={{ color: "#E8D6B5" }}>Hazi</Text>
      <Text style={{ color: "#F59E0B" }}>na</Text>
    </Text>
  );
}

function HeroCircles() {
  return (
    <>
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

// Amber progress bar
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <View style={S.progressTrack}>
      <View style={[S.progressFill, { width: `${pct}%` as any }]} />
    </View>
  );
}

// Step dots
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <View style={S.dotsRow}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[S.dot, i + 1 === step ? S.dotActive : S.dotInactive]}
        />
      ))}
    </View>
  );
}

// Field with label
function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  children,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: any;
  children?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={S.fieldGroup}>
      <Text style={S.fieldLabel}>{label}</Text>
      {children ? (
        children
      ) : (
        <TextInput
          style={[
            S.fieldInput,
            focused && S.fieldInputFocused,
            { outlineStyle: "none" } as any,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}
    </View>
  );
}

// Phone composite field
function PhoneField({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[S.phoneRow, focused && S.phoneRowFocused]}>
      <Text style={S.prefix}>+254</Text>
      <View style={S.phoneDivider} />
      <TextInput
        style={[S.phoneInput, { outlineStyle: "none" } as any]}
        value={value}
        onChangeText={onChangeText}
        placeholder="7XX XXX XXX"
        placeholderTextColor={Colors.textMuted}
        keyboardType="phone-pad"
        maxLength={9}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  OnboardingScreen  (Step 1 of 3 — Your details)
// ─────────────────────────────────────────────────────────────────────────────

export default function OnboardingScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");

  // Step 2
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");

  // Step 3
  const [city, setCity] = useState("");
  const [estate, setEstate] = useState("");
  const [kraPin, setKraPin] = useState("");

  const canContinue = () => {
    if (currentStep === 1)
      return (
        name.trim().length > 0 &&
        phone.trim().length > 0 &&
        nationalId.trim().length > 0
      );
    if (currentStep === 2)
      return (
        dob.trim().length > 0 &&
        gender.trim().length > 0 &&
        occupation.trim().length > 0
      );
    if (currentStep === 3)
      return (
        city.trim().length > 0 &&
        estate.trim().length > 0 &&
        kraPin.trim().length > 0
      );
    return false;
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate("Welcome"); // Navigate to the Join/Create fork
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={S.hero}>
        <HeroCircles />
        <Pressable onPress={handleBack} style={S.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={18} color="#fff" />
        </Pressable>
        <Text style={S.heroTitle}>Create account</Text>
        <ProgressBar step={currentStep} total={3} />
        <StepDots step={currentStep} total={3} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={S.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={S.sectionTitle}>
            {currentStep === 1 && "Your details"}
            {currentStep === 2 && "Demographics"}
            {currentStep === 3 && "Location & Identity"}
          </Text>
          <Text style={S.sectionSub}>
            Step {currentStep} of 3 ·{" "}
            {currentStep === 1
              ? "Personal information"
              : currentStep === 2
                ? "Background information"
                : "Additional details"}
          </Text>

          {currentStep === 1 && (
            <>
              {/* Avatar */}
              <View style={S.avatarWrap}>
                <View style={S.avatarCircle}>
                  <Feather name="user" size={28} color="#2E9E87" />
                </View>
              </View>

              {/* Fields */}
              <Field
                label="FULL NAME"
                placeholder="Wanjiru Kamau"
                value={name}
                onChangeText={setName}
              />

              <Field
                label="PHONE NUMBER"
                placeholder=""
                value={phone}
                onChangeText={setPhone}
              >
                <PhoneField value={phone} onChangeText={setPhone} />
              </Field>

              <Field
                label="NATIONAL ID"
                placeholder="Enter your ID number"
                value={nationalId}
                onChangeText={setNationalId}
                keyboardType="number-pad"
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <Field
                label="DATE OF BIRTH"
                placeholder="DD/MM/YYYY"
                value={dob}
                onChangeText={setDob}
              />

              <Field
                label="GENDER"
                placeholder="Male, Female, etc."
                value={gender}
                onChangeText={setGender}
              />

              <Field
                label="OCCUPATION"
                placeholder="E.g. Teacher, Engineer"
                value={occupation}
                onChangeText={setOccupation}
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <Field
                label="CITY / TOWN"
                placeholder="Nairobi, Mombasa, etc."
                value={city}
                onChangeText={setCity}
              />

              <Field
                label="ESTATE / NEIGHBORHOOD"
                placeholder="Kilimani, Karen, etc."
                value={estate}
                onChangeText={setEstate}
              />

              <Field
                label="KRA PIN (OPTIONAL)"
                placeholder="A000000000Z"
                value={kraPin}
                onChangeText={setKraPin}
              />
            </>
          )}

          <TouchableOpacity
            style={[S.btnPrimary, !canContinue() && S.btnDisabled]}
            onPress={canContinue() ? handleContinue : undefined}
            activeOpacity={0.85}
          >
            <Text style={S.btnPrimaryText}>
              {currentStep === 3 ? "Complete" : "Continue"}
            </Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
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

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[6],
    paddingTop: 44,
    paddingBottom: 20,
    overflow: "hidden",
    gap: 8,
  },
  circleTopRight: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -50,
    right: -50,
  },
  circleBottomLeft: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(245,158,11,0.10)",
    bottom: -40,
    left: -30,
  },
  backBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  logo: {
    fontFamily: FontFamily.extraBold,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize["3xl"],
    color: "#E8D6B5",
    fontWeight: "800",
  },

  // Progress bar
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#F59E0B",
    borderRadius: 2,
  },

  // Step dots
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: "#F59E0B",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  // ── Content ───────────────────────────────────────────────────────────────
  scrollContent: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[10],
    flexGrow: 1,
  },
  sectionTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 18,
    color: "#E8D6B5",
    fontWeight: "800",
    marginBottom: 4,
  },
  sectionSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing[6],
  },

  // Avatar
  avatarWrap: {
    alignItems: "center",
    marginBottom: Spacing[6],
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E8F7F4",
    borderWidth: 1.5,
    borderColor: "#A8D8CF",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  // Field
  fieldGroup: {
    marginBottom: Spacing[5],
  },
  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  fieldInput: {
    height: 50,
    borderRadius: Radius.badge,
    borderWidth: 1,
    borderColor: "#EBF1EF",
    backgroundColor: "#F6F9F7",
    paddingHorizontal: Spacing[4],
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: "#E8D6B5",
  },
  fieldInputFocused: {
    borderColor: Colors.primary,
    backgroundColor: "#E8F7F4",
  },

  // Phone field
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: Radius.badge,
    borderWidth: 1,
    borderColor: "#EBF1EF",
    backgroundColor: "#F6F9F7",
    paddingHorizontal: Spacing[4],
  },
  phoneRowFocused: {
    borderColor: Colors.primary,
    backgroundColor: "#E8F7F4",
  },
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

  // Button
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
    marginTop: Spacing[2],
  },
  btnPrimaryText: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.lg,
    color: "#E8D6B5",
    fontWeight: "700",
  },
  btnDisabled: { opacity: 0.45 },
});
