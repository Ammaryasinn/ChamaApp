import React from "react";
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily } from "../theme";
import { useChamaContext } from "../context/ChamaContext";

// Map route names to friendly copy
const COPY: Record<string, { icon: React.ComponentProps<typeof Feather>["name"]; title: string; sub: string }> = {
  Placeholder: { icon: "tool", title: "Coming soon", sub: "We're building this feature. Check back in the next update." },
  MeetingMinutes: { icon: "file-text", title: "Meeting minutes", sub: "Record agendas, take votes, and auto-generate minutes. Launching soon." },
  ManageChama: { icon: "settings", title: "Manage chama", sub: "Edit penalty rules, member roles, and chama settings. Launching soon." },
  AnnualReport: { icon: "bar-chart-2", title: "Annual report", sub: "Download a full PDF summary of your chama's year. Upgrade to PRO to unlock." },
};

export default function PlaceholderScreen({ navigation, route }: any) {
  const { activeChamaColor } = useChamaContext();
  const heroBg = activeChamaColor || Colors.primary;
  const key = route?.name ?? "Placeholder";
  const copy = COPY[key] ?? COPY["Placeholder"];

  return (
    <SafeAreaView style={[S.screen, { backgroundColor: heroBg }]}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={[S.hero, { backgroundColor: heroBg }]}>
        <View style={S.circleTR} />
        <View style={S.circleBL} />
        <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={18} color="#fff" />
        </Pressable>
      </View>

      {/* Body */}
      <View style={S.body}>
        <View style={S.iconWrap}>
          <Feather name={copy.icon} size={36} color={heroBg} />
        </View>
        <Text style={S.title}>{copy.title}</Text>
        <Text style={S.sub}>{copy.sub}</Text>

        <View style={S.tagRow}>
          <View style={S.tag}>
            <Feather name="clock" size={12} color="#D97706" />
            <Text style={S.tagText}>In development</Text>
          </View>
        </View>

        <TouchableOpacity style={[S.backBtnBody, { borderColor: heroBg, backgroundColor: heroBg + "18" }]} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Feather name="arrow-left" size={16} color={heroBg} />
          <Text style={[S.backBtnText, { color: heroBg }]}>Go back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },

  hero: {
    backgroundColor: Colors.primary, paddingHorizontal: 20,
    paddingTop: 40, paddingBottom: 32, overflow: "hidden",
  },
  circleTR: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -60 },
  circleBL: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(245,158,11,0.08)", bottom: -40, left: -30 },
  backBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },

  body: {
    flex: 1, backgroundColor: Colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -24, paddingHorizontal: 32,
    paddingTop: 48, alignItems: "center",
  },
  iconWrap: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: "#E8F7F4", borderWidth: 1, borderColor: "#A8D8CF",
    alignItems: "center", justifyContent: "center", marginBottom: 24,
  },
  title: {
    fontFamily: FontFamily.extraBold, fontSize: 24,
    color: "#E8D6B5", fontWeight: "800",
    textAlign: "center", marginBottom: 12,
  },
  sub: {
    fontFamily: FontFamily.regular, fontSize: 14,
    color: Colors.textSecondary, textAlign: "center",
    lineHeight: 22, marginBottom: 24,
  },
  tagRow: { flexDirection: "row", gap: 8, marginBottom: 40 },
  tag: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#FFFBEB", borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: "#FDE68A",
  },
  tagText: { fontFamily: FontFamily.heading, fontSize: 12, color: "#D97706", fontWeight: "700" },

  backBtnBody: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#E8F7F4", borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    borderWidth: 1, borderColor: "#A8D8CF",
  },
  backBtnText: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.primary, fontWeight: "700" },
});
