import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useChamaContext } from "../context/ChamaContext";
import { MY_CHAMAS } from "./DashboardScreen";

export default function InviteMembersScreen({ navigation, route }: any) {
  const shareLink = "https://hazina.app/join/T2x9P";
  const { setActiveChama, activeChamaId } = useChamaContext();
  const { chamaType } = route?.params || {};

  // Determine the theme color based on the chamaType param coming in (for newly created chamas)
  // falling back to the currently active chama
  const type = chamaType?.toUpperCase?.() || "";
  let previewId = activeChamaId;
  if (type === "INVESTMENT") previewId = "2";
  else if (type === "WELFARE") previewId = "3";
  else if (type === "HYBRID") previewId = "4";
  else if (type === "GROUP_PURCHASE") previewId = "5";
  else if (type === "MERRY_GO_ROUND" || type === "MGR") previewId = "1";

  const chama = MY_CHAMAS.find((c: any) => c.id === previewId) || MY_CHAMAS[0];
  const themeColor = chama.heroColor;

  const goToDashboard = () => {
    const type = chamaType?.toUpperCase?.() || "";
    let newId = "1"; // Default MGR
    if (type === "INVESTMENT") newId = "2";
    if (type === "WELFARE") newId = "3";
    if (type === "HYBRID") newId = "4";
    if (type === "GROUP_PURCHASE") newId = "5";
    setActiveChama(newId, type.toLowerCase() || "merry_go_round");
    navigation.navigate("MainTabs");
  };

  const handleCopyLink = () => {
    if (Platform.OS === "android") {
      ToastAndroid.show("Link copied!", ToastAndroid.SHORT);
    } else {
      Alert.alert("✓ Copied", "Invite link copied to clipboard!");
    }
    // In production: Clipboard.setString(shareLink)
  };

  const handleShareWhatsApp = () => {
    Alert.alert("WhatsApp Share", "Opening WhatsApp to share your invite link...\n\nIn the full version, this will open WhatsApp directly.", [
      { text: "Continue to Dashboard", onPress: goToDashboard },
      { text: "Stay here", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColor }]}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: themeColor }]}>
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn} hitSlop={12}>
          <Feather name="x" size={18} color="#fff" />
        </Pressable>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>
        <Text style={styles.heroTitle}>Invite your group</Text>
        <Text style={styles.heroSub}>
          Share this link with your members. They will auto-join your Chama after downloading the app.
        </Text>
      </View>

      {/* Body */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>

        {/* Link card */}
        <View style={styles.linkCard}>
          <Text style={styles.linkLabel}>YOUR INVITE LINK</Text>
          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>{shareLink}</Text>
            <Pressable style={[styles.copyBtn, { backgroundColor: themeColor }]} onPress={handleCopyLink}>
              <Feather name="copy" size={14} color="#fff" />
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>
        </View>

        {/* Share options */}
        <Pressable style={[styles.primaryBtn, { backgroundColor: "#25D366" }]} onPress={handleShareWhatsApp}>
          <Feather name="message-circle" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Share via WhatsApp</Text>
        </Pressable>

        <Pressable style={[styles.secondaryBtn, { borderColor: themeColor }]} onPress={handleCopyLink}>
          <Feather name="share-2" size={16} color={themeColor} />
          <Text style={[styles.secondaryBtnText, { color: themeColor }]}>Share via other apps</Text>
        </Pressable>

        {/* Done button */}
        <Pressable style={[styles.doneBtn, { backgroundColor: themeColor }]} onPress={goToDashboard}>
          <Text style={styles.doneBtnText}>Done — Go to Dashboard</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </Pressable>

        <Text style={styles.skipText} onPress={goToDashboard}>Skip for now</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  hero: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    overflow: "hidden",
    alignItems: "center",
  },
  circleTopRight: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -60,
  },
  circleBottomLeft: {
    position: "absolute", width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(0,0,0,0.08)", bottom: -50, left: -40,
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 16,
  },
  icon: { fontSize: 32 },
  heroTitle: {
    color: "#FFFFFF", fontSize: 26, fontWeight: "800",
    marginBottom: 8, textAlign: "center",
  },
  heroSub: {
    color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 20,
    textAlign: "center",
  },

  body: { flex: 1, backgroundColor: "#FFFFFF", marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  bodyContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },

  linkCard: {
    backgroundColor: "#F9FBFA", borderWidth: 1, borderColor: "#DEEBE6",
    borderRadius: 16, padding: 18, marginBottom: 20,
  },
  linkLabel: {
    color: "#8E9A96", fontSize: 11, fontWeight: "800",
    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10,
  },
  linkRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  linkText: { flex: 1, color: "#17231E", fontSize: 14, fontWeight: "700", marginRight: 10 },
  copyBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
  },
  copyBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },

  primaryBtn: {
    width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 16, paddingVertical: 17, marginBottom: 12,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },

  secondaryBtn: {
    width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, borderRadius: 16, paddingVertical: 16, borderWidth: 1.5, marginBottom: 24,
  },
  secondaryBtnText: { fontSize: 14, fontWeight: "700" },

  doneBtn: {
    width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, borderRadius: 16, paddingVertical: 17, marginBottom: 16,
  },
  doneBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },

  skipText: {
    textAlign: "center", color: "#8E9A96", fontSize: 13, fontWeight: "600",
  },
});
