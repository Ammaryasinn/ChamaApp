import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useChamaContext } from "../context/ChamaContext";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";
import { chamaApi } from "../lib/api";

export default function ChamaAdminScreen({ navigation }: any) {
  const { activeChamaId, chamas } = useChamaContext();
  const chama = chamas.find((c: any) => c.id === activeChamaId) || chamas[0];
  const themeColor = chama?.heroColor || Colors.primary;

  const [announcement, setAnnouncement] = useState("");
  const [autoReminders, setAutoReminders] = useState(true);
  const [penaltyAmount, setPenaltyAmount] = useState("500");
  const [contributionAmount, setContributionAmount] = useState(
    (chama as any)?.contributionAmount?.toString() || "5000",
  );
  const [loadingBroadcast, setLoadingBroadcast] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleSendAnnouncement = async () => {
    if (!announcement.trim()) {
      Alert.alert("Error", "Please enter a message to send.");
      return;
    }
    try {
      setLoadingBroadcast(true);
      await chamaApi.broadcastMessage(activeChamaId!, announcement.trim());
      Alert.alert(
        "Announcement Sent",
        "All members have been notified successfully.",
        [{ text: "OK", onPress: () => setAnnouncement("") }],
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.error || "Failed to send announcement.",
      );
    } finally {
      setLoadingBroadcast(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoadingSave(true);
      await chamaApi.updateSettings(activeChamaId!, {
        contributionAmount: Number(contributionAmount),
        penaltyAmount: Number(penaltyAmount),
      });
      Alert.alert("Settings Saved", "Chama configuration has been updated.");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.error || "Failed to update settings.",
      );
    } finally {
      setLoadingSave(false);
    }
  };

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
          <Text style={S.headerTitle}>Admin Controls</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={S.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[S.infoCard, { borderColor: themeColor }]}>
            <Feather name="shield" size={20} color={themeColor} />
            <Text style={S.infoText}>
              Chairperson settings for{" "}
              <Text style={{ fontWeight: "bold" }}>
                {chama?.name || "the Chama"}
              </Text>
              . Changes made here apply to all members.
            </Text>
          </View>

          {/* Announcements & Reminders */}
          <View style={S.section}>
            <Text style={S.sectionLabel}>ANNOUNCEMENTS & REMINDERS</Text>
            <View style={S.card}>
              <Text style={S.fieldLabel}>Send Custom Message</Text>
              <Text style={S.fieldSub}>
                Broadcast an announcement or contribution reminder to all
                members.
              </Text>
              <TextInput
                style={[S.input, S.textArea]}
                placeholder="Type your message here..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={announcement}
                onChangeText={setAnnouncement}
              />
              <TouchableOpacity
                style={[
                  S.actionBtn,
                  { backgroundColor: themeColor },
                  (!announcement.trim() || loadingBroadcast) &&
                    S.actionBtnDisabled,
                ]}
                onPress={handleSendAnnouncement}
                disabled={!announcement.trim() || loadingBroadcast}
              >
                {!loadingBroadcast && (
                  <Feather name="send" size={16} color={Colors.textPrimary} />
                )}
                <Text style={S.actionBtnText}>
                  {loadingBroadcast ? "Sending..." : "Broadcast Message"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Chama Configuration */}
          <View style={S.section}>
            <Text style={S.sectionLabel}>CONTRIBUTION SETTINGS</Text>
            <View style={S.card}>
              <View style={S.fieldRow}>
                <View style={{ flex: 1 }}>
                  <Text style={S.toggleLabel}>Automatic Reminders</Text>
                  <Text style={S.toggleSub}>
                    Send system reminders 3 days before due date
                  </Text>
                </View>
                <Switch
                  value={autoReminders}
                  onValueChange={setAutoReminders}
                  trackColor={{ false: "#E5E7EB", true: themeColor }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={S.divider} />

              <View style={S.inputRow}>
                <View style={{ flex: 1 }}>
                  <Text style={S.inputLabel}>Contribution Amount (Ksh)</Text>
                  <TextInput
                    style={S.inlineInput}
                    keyboardType="numeric"
                    value={contributionAmount}
                    onChangeText={setContributionAmount}
                  />
                </View>
              </View>
              <View style={S.divider} />

              <View style={S.inputRow}>
                <View style={{ flex: 1 }}>
                  <Text style={S.inputLabel}>Late Penalty Amount (Ksh)</Text>
                  <TextInput
                    style={S.inlineInput}
                    keyboardType="numeric"
                    value={penaltyAmount}
                    onChangeText={setPenaltyAmount}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                S.saveBtn,
                { backgroundColor: themeColor },
                loadingSave && S.actionBtnDisabled,
              ]}
              onPress={handleSaveChanges}
              disabled={loadingSave}
            >
              <Text style={S.saveBtnText}>
                {loadingSave ? "Saving..." : "Save Configuration"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
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
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: Spacing[4],
    borderRadius: Radius.lg,
    borderWidth: 1,
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
  section: {
    marginBottom: Spacing[6],
  },
  sectionLabel: {
    fontFamily: FontFamily.heading,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: Spacing[3],
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: Spacing[4],
    overflow: "hidden",
  },
  fieldLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  fieldSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing[3],
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing[4],
  },
  textArea: {
    minHeight: 80,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[3],
    borderRadius: Radius.button,
    gap: Spacing[2],
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing[1],
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing[2],
  },
  toggleLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  toggleSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing[3],
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing[1],
  },
  inputLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  inlineInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.textPrimary,
  },
  saveBtn: {
    marginTop: Spacing[4],
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[4],
    borderRadius: Radius.button,
  },
  saveBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
});
