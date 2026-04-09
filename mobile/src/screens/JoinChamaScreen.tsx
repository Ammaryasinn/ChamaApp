import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

function HeroCircles() {
  return (
    <>
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

export default function JoinChamaScreen({ navigation }: any) {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);

  const cleanCode = code.trim().toUpperCase();
  const isValid = cleanCode.length >= 6; // Assume 6+ char codes

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={S.hero}>
        <HeroCircles />
        <Pressable
          onPress={() => navigation.goBack()}
          style={S.backBtn}
          hitSlop={12}
        >
          <Feather name="chevron-left" size={18} color="#fff" />
        </Pressable>
        <Text style={S.heroTitle}>Join a chama</Text>
      </View>

      <KeyboardAvoidingView 
        style={S.content} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={S.form}>
          <Text style={S.label}>INVITE CODE</Text>
          <TextInput
            style={[S.input, focused && S.inputFocused]}
            value={code}
            onChangeText={setCode}
            placeholder="e.g. HAZI-249X"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <Text style={S.hint}>Ask your chairperson for the group invite code.</Text>
        </View>

        <TouchableOpacity 
          style={[S.btn, !isValid && S.btnDisabled]} 
          activeOpacity={0.8}
          onPress={() => {
            if (isValid) {
              // Simulate checking code and joining, then nav to dashboard
              navigation.replace("MainTabs");
            }
          }}
        >
          <Text style={S.btnText}>Verify and Join</Text>
          <Feather name="arrow-right" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },

  // Hero
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20, paddingTop: 40, paddingBottom: 24,
    overflow: "hidden", gap: 12,
  },
  circleTopRight: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50,
  },
  circleBottomLeft: {
    position: "absolute", width: 140, height: 140, borderRadius: 70,
    backgroundColor: "rgba(245,158,11,0.10)", bottom: -30, left: -30,
  },
  backBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 26, color: "#E8D6B5", fontWeight: "800", letterSpacing: -0.5 },

  // Content
  content: {
    flex: 1, backgroundColor: Colors.surface,
    padding: 20, justifyContent: "space-between",
  },
  form: { marginTop: 10 },
  label: { fontFamily: FontFamily.semiBold, fontSize: 10, color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8 },
  input: {
    height: 54, borderRadius: 12, borderWidth: 1.5, borderColor: "#EBF1EF",
    backgroundColor: Colors.background, paddingHorizontal: 16,
    fontFamily: FontFamily.extraBold, fontSize: 20, color: "#E8D6B5", letterSpacing: 1,
  },
  inputFocused: { borderColor: Colors.primary, backgroundColor: "#E8F7F4" },
  hint: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 10 },

  // Button
  btn: {
    height: 52, borderRadius: Radius.button, backgroundColor: Colors.primary,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginBottom: 40,
  },
  btnText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#E8D6B5", fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },
});
