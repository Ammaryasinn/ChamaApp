import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";

export default function ChamaDetailsScreen({ navigation, route }: any) {
  const { chamaType } = route.params || {};

  const [name, setName] = useState("");
  const [aim, setAim] = useState("");

  const handleNext = () => {
    if (name.trim().length < 3) return;

    switch (chamaType) {
      case "MERRY_GO_ROUND":
      case "merry_go_round":
        navigation.navigate("MGRSetup", { name, aim });
        break;
      case "INVESTMENT":
      case "investment":
        navigation.navigate("InvestmentSetup", { name, aim });
        break;
      case "WELFARE":
      case "welfare":
        navigation.navigate("WelfareSetup", { name, aim });
        break;
      case "HYBRID":
      case "hybrid":
        navigation.navigate("HybridConfig", { name, aim });
        break;
      case "GROUP_PURCHASE":
      case "group_purchase":
        navigation.navigate("GroupPurchaseSetup", { name, aim });
        break;
      default:
        navigation.navigate("MGRSetup", { name, aim });
    }
  };


  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Describe your Chama</Text>
        <Text style={styles.subtitle}>
          Give your group a name and tell your members what the primary goal is.
        </Text>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chama Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Mama Mboga Investment Group"
              placeholderTextColor="#8E9A96"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Primary Aim or Goal</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={aim}
              onChangeText={setAim}
              placeholder="e.g. We are saving to buy land in Juja by 2026."
              placeholderTextColor="#8E9A96"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            name.trim().length < 3 && styles.primaryBtnDisabled,
            pressed && styles.primaryBtnPressed,
          ]}
          onPress={handleNext}
          disabled={name.trim().length < 3}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing[5] },
  backBtn: { paddingVertical: Spacing[2], alignSelf: "flex-start" },
  backText: {
    color: Colors.primary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  content: { paddingHorizontal: Spacing[5], paddingBottom: Spacing[10] },
  title: {
    color: "#E8D6B5",
    fontSize: FontSize["6xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[2],
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 24,
    marginBottom: Spacing[8],
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.cardLg,
    padding: Spacing[5],
    gap: Spacing[5],
    ...Shadow.sm,
  },
  inputGroup: { gap: Spacing[2] },
  label: {
    color: "#E8D6B5",
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  input: {
    backgroundColor: Colors.surfaceSunken,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    color: "#E8D6B5",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  footer: { padding: Spacing[5], backgroundColor: Colors.background },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4.5],
    alignItems: "center",
    ...Shadow.button,
  },
  primaryBtnDisabled: { backgroundColor: Colors.textMuted },
  primaryBtnPressed: { opacity: 0.9 },
  primaryBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
});
