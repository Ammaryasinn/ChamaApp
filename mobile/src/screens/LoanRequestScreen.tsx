import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useChamaContext } from "../context/ChamaContext";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";
import { loanApi } from "../lib/api";

export default function LoanRequestScreen({ navigation }: any) {
  const { activeChamaId, chamas } = useChamaContext();
  const chama = chamas.find((c: any) => c.id === activeChamaId) || chamas[0];
  const themeColor = chama?.heroColor || Colors.primary;

  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("1");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const PERIOD_OPTIONS = ["1", "3", "6", "12"];

  const handleComplete = async () => {
    if (!amount || !reason) return;

    try {
      setLoading(true);
      await loanApi.requestLoan(
        activeChamaId!,
        Number(amount),
        Number(period),
        reason,
      );
      Alert.alert(
        "Request Submitted",
        "Your loan request has been broadcasted to the group for voting.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.error || "Failed to submit request.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = amount.trim().length > 0 && reason.trim().length > 0;

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={S.header}>
          <TouchableOpacity
            style={S.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={12}
          >
            <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Request a Loan</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={S.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={S.infoCard}>
            <Feather name="info" size={20} color={themeColor} />
            <Text style={S.infoText}>
              Your loan request will be broadcast to all members. Approval
              requires a majority vote.
            </Text>
          </View>

          {/* Amount Input */}
          <View style={S.inputGroup}>
            <Text style={S.label}>HOW MUCH DO YOU NEED? (KSH)</Text>
            <TextInput
              style={S.input}
              placeholder="e.g. 10,000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Period Selection */}
          <View style={S.inputGroup}>
            <Text style={S.label}>REPAYMENT PERIOD (MONTHS)</Text>
            <View style={S.periodRow}>
              {PERIOD_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    S.periodChip,
                    period === opt && {
                      backgroundColor: themeColor,
                      borderColor: themeColor,
                    },
                  ]}
                  onPress={() => setPeriod(opt)}
                >
                  <Text
                    style={[
                      S.periodChipText,
                      period === opt && S.periodChipTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reason Input */}
          <View style={S.inputGroup}>
            <Text style={S.label}>REASON FOR LOAN</Text>
            <TextInput
              style={[S.input, S.textArea]}
              placeholder="Provide a clear reason to help members decide..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={reason}
              onChangeText={setReason}
            />
          </View>
        </ScrollView>

        {/* Footer CTA */}
        <View style={S.footer}>
          <TouchableOpacity
            style={[
              S.submitBtn,
              { backgroundColor: themeColor },
              (!isFormValid || loading) && S.submitBtnDisabled,
            ]}
            disabled={!isFormValid || loading}
            onPress={handleComplete}
          >
            <Text style={S.submitBtnText}>
              {loading ? "Submitting..." : "Broadcast Request"}
            </Text>
            {!loading && <Feather name="send" size={18} color={Colors.textPrimary} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing[5],
    paddingBottom: Spacing[10],
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: Spacing[3],
    marginBottom: Spacing[6],
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: Spacing[6],
  },
  label: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: Spacing[2],
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
  },
  periodRow: {
    flexDirection: "row",
    gap: Spacing[3],
  },
  periodChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing[3],
    borderRadius: Radius.md,
  },
  periodChipText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  periodChipTextActive: {
    color: Colors.textPrimary,
  },
  footer: {
    padding: Spacing[5],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[4],
    borderRadius: Radius.button,
    gap: Spacing[2],
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
});
