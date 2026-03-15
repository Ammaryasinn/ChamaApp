import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function InviteMembersScreen({ navigation }: any) {
  const shareLink = "https://hazina.app/join/T2x9P";

  const goToDashboard = () => {
    navigation.navigate("MainTabs");
  };

  const handleCopyLink = () => {
    // In a real app we'd use Clipboard.setString(shareLink)
    goToDashboard();
  };

  const handleShareWhatsApp = () => {
    // Mock for Sharing API or Linking.openURL
    goToDashboard();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕ Close</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>
        <Text style={styles.title}>Invite your group</Text>
        <Text style={styles.subtitle}>
          Share this unique link with your friends or community members. They
          will be directed to download the app and auto-join your Chama.
        </Text>

        <View style={styles.linkCard}>
          <Text style={styles.linkLabel}>Your Invite Link</Text>
          <View style={styles.linkRow}>
            <Text style={styles.linkText} numberOfLines={1}>
              {shareLink}
            </Text>
            <Pressable style={styles.copyBtn} onPress={handleCopyLink}>
              <Text style={styles.copyBtnText}>Copy</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.primaryBtn} onPress={handleShareWhatsApp}>
          <Text style={styles.primaryBtnText}>Share via WhatsApp</Text>
        </Pressable>

        <Pressable style={styles.doneBtn} onPress={goToDashboard}>
          <Text style={styles.doneBtnText}>Done — Go to Dashboard →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { padding: 20, alignItems: "flex-end" },
  closeBtn: { padding: 8 },
  closeText: { color: "#59655F", fontSize: 16, fontWeight: "700" },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E3F2ED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: { fontSize: 36 },
  title: {
    color: "#17231E",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    color: "#59655F",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 40,
  },
  linkCard: {
    width: "100%",
    backgroundColor: "#F9FBFA",
    borderWidth: 1,
    borderColor: "#DEEBE6",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  linkLabel: {
    color: "#8E9A96",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkText: {
    flex: 1,
    color: "#006D5B",
    fontSize: 17,
    fontWeight: "700",
    marginRight: 12,
  },
  copyBtn: {
    backgroundColor: "#E3F2ED",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  copyBtnText: { color: "#006D5B", fontSize: 14, fontWeight: "800" },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#25D366",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  }, // WhatsApp Green
  primaryBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  doneBtn: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  doneBtnText: {
    color: "#006D5B",
    fontSize: 15,
    fontWeight: "700",
  },
});
