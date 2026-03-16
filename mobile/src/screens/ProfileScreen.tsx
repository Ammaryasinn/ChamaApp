import React from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

function HeroCircles() {
  return (
    <>
      <View style={S.cTR} />
      <View style={S.cBL} />
    </>
  );
}

interface MenuItem { icon: React.ComponentProps<typeof Feather>["name"]; label: string; sub: string; badge?: string; onPress: () => void; }

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <TouchableOpacity style={S.menuRow} onPress={item.onPress} activeOpacity={0.7}>
      <View style={S.menuIcon}>
        <Feather name={item.icon} size={20} color={Colors.primary} />
      </View>
      <View style={S.menuMeta}>
        <Text style={S.menuLabel}>{item.label}</Text>
        <Text style={S.menuSub}>{item.sub}</Text>
      </View>
      {item.badge ? (
        <View style={S.proBadge}><Text style={S.proBadgeText}>{item.badge}</Text></View>
      ) : (
        <Feather name="chevron-right" size={16} color={Colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={S.sectionHeader}>{title}</Text>;
}

export default function ProfileScreen({ navigation }: any) {
  const MENU: { section: string; items: MenuItem[] }[] = [
    {
      section: "MY CHAMAS",
      items: [
        { icon: "users",      label: "Invite members",    sub: "Add people to your chama",        onPress: () => navigation.navigate("InviteMembers") },
        { icon: "file-text",  label: "Meeting minutes",   sub: "Record and view decisions",        onPress: () => navigation.navigate("Placeholder") },
      ],
    },
    {
      section: "REPORTS",
      items: [
        { icon: "bar-chart-2", label: "Annual report", sub: "Download PDF · 2025", badge: "PRO", onPress: () => navigation.navigate("PremiumSubscription") },
      ],
    },
    {
      section: "MARKETPLACE",
      items: [
        { icon: "shopping-bag", label: "Group purchases", sub: "Samsung, Ramtons deals", onPress: () => navigation.navigate("ChamaType") },
      ],
    },
    {
      section: "ACCOUNT",
      items: [
        { icon: "settings", label: "Settings", sub: "Profile, notifications", onPress: () => navigation.navigate("Settings") },
      ],
    },
  ];

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={S.hero}>
        <HeroCircles />
        <Text style={S.loggedAs}>Logged in as</Text>
        <View style={S.profileRow}>
          <View style={S.avatar}>
            <Text style={S.avatarText}>WK</Text>
          </View>
          <View>
            <Text style={S.profileName}>Wanjiru Kamau</Text>
            <Text style={S.profileSub}>Chairperson · 2 chamas</Text>
          </View>
        </View>

        {/* Score + upgrade row */}
        <View style={S.scoreCard}>
          <View style={S.scoreLeft}>
            <Text style={S.scoreLabel}>Hazina Score</Text>
            <Text style={S.scoreNum}>742</Text>
          </View>
          <View style={S.scoreRight}>
            <Text style={S.freeTier}>Free tier</Text>
            <TouchableOpacity
              style={S.upgradeBtn}
              onPress={() => navigation.navigate("PremiumSubscription")}
              activeOpacity={0.85}
            >
              <Text style={S.upgradeBtnText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Menu */}
      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {MENU.map((section) => (
          <View key={section.section}>
            <SectionHeader title={section.section} />
            <View style={S.menuCard}>
              {section.items.map((item, i) => (
                <View key={i}>
                  <MenuRow item={item} />
                  {i < section.items.length - 1 && <View style={S.sep} />}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },
  cTR: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50 },
  cBL: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(245,158,11,0.10)", bottom: -40, left: -30 },

  hero: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 44, paddingBottom: 20, overflow: "hidden", gap: 8 },
  loggedAs: { fontFamily: FontFamily.regular, fontSize: 11, color: "rgba(255,255,255,0.55)" },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#2E9E87", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.3)" },
  avatarText: { fontFamily: FontFamily.heading, fontSize: 16, color: "#FFFFFF", fontWeight: "700" },
  profileName: { fontFamily: FontFamily.extraBold, fontSize: 18, color: "#FFFFFF", fontWeight: "800" },
  profileSub:  { fontFamily: FontFamily.regular, fontSize: 12, color: "rgba(255,255,255,0.65)" },

  scoreCard: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 12, marginTop: 4 },
  scoreLeft: { flex: 1 },
  scoreRight: { alignItems: "flex-end", gap: 6 },
  scoreLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: "rgba(255,255,255,0.6)" },
  scoreNum:   { fontFamily: FontFamily.extraBold, fontSize: 28, color: "#F59E0B", fontWeight: "800" },
  freeTier:   { fontFamily: FontFamily.regular, fontSize: 11, color: "rgba(255,255,255,0.55)" },
  upgradeBtn: { backgroundColor: "#F59E0B", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  upgradeBtnText: { fontFamily: FontFamily.heading, fontSize: 12, color: "#FFFFFF", fontWeight: "700" },

  scroll: { backgroundColor: "#F6F9F7", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  sectionHeader: { fontFamily: FontFamily.semiBold, fontSize: 10, color: Colors.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, marginTop: 16 },
  menuCard: { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#EBF1EF", overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#E8F7F4", alignItems: "center", justifyContent: "center" },
  menuMeta: { flex: 1 },
  menuLabel: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "700" },
  menuSub:   { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  proBadge: { backgroundColor: "#F59E0B", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  proBadgeText: { fontFamily: FontFamily.heading, fontSize: 10, color: "#FFFFFF", fontWeight: "700" },
  sep: { height: 1, backgroundColor: "#F6F9F7", marginHorizontal: 14 },
});
