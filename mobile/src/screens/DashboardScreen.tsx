import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
//  Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function HeroCircles() {
  return (
    <>
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

function HazinaLogo() {
  return (
    <Text style={S.logo}>
      <Text style={{ color: "#FFFFFF" }}>Hazi</Text>
      <Text style={{ color: "#F59E0B" }}>na</Text>
    </Text>
  );
}

function StatusPill({ paid, pending, late }: { paid: number; pending: number; late: number }) {
  return (
    <View style={S.pill}>
      <Text style={S.pillPaid}>{paid} paid</Text>
      <Text style={S.pillDot}>·</Text>
      <Text style={S.pillPending}>{pending} pending</Text>
      <Text style={S.pillDot}>·</Text>
      <Text style={S.pillLate}>{late} late</Text>
    </View>
  );
}

// Status badge for activity rows
function StatusBadge({ status }: { status: "paid" | "pending" | "late" }) {
  const map = {
    paid:    { bg: "#ECFDF5", text: "#059669", label: "Paid" },
    pending: { bg: "#FFFBEB", text: "#D97706", label: "Pending" },
    late:    { bg: "#FEF2F2", text: "#DC2626", label: "Late" },
  };
  const { bg, text, label } = map[status];
  return (
    <View style={[S.badge, { backgroundColor: bg }]}>
      <Text style={[S.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
}

// Member avatar chip
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <View style={[S.avatar, { backgroundColor: color }]}>
      <Text style={S.avatarText}>{initials}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Mock data
// ─────────────────────────────────────────────────────────────────────────────

const ROTATION = [
  { initials: "WK", name: "Wanjiru", month: "Feb", color: "#006D5B", done: true },
  { initials: "AO", name: "Akinyi",  month: "Mar", color: "#3B82F6", done: true },
  { initials: "MM", name: "Muthoni", month: "Apr", color: "#F59E0B", isCurrent: true },
  { initials: "KM", name: "Kamau",   month: "May", color: "#7C3AED" },
  { initials: "JN", name: "Jane",    month: "Jun", color: "#EC4899" },
];

const ACTIVITY = [
  { name: "Wanjiru Kamau",  sub: "Today · 8:42 AM",             amount: "+Ksh 5,000", status: "paid"    as const, icon: "check-circle"  as const },
  { name: "Akinyi Otieno",  sub: "Due today",                    amount: "Ksh 5,000",  status: "pending" as const, icon: "clock"          as const },
  { name: "Muthoni Mwangi", sub: "3 days late · +Ksh 200 penalty", amount: "Ksh 5,000",  status: "late"    as const, icon: "x-circle"       as const },
];

const ICON_COLOR: Record<string, string> = {
  "check-circle": "#059669",
  "clock":        "#D97706",
  "x-circle":     "#DC2626",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardScreen({ navigation }: any) {
  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* ── Hero ── */}
        <View style={S.hero}>
          <HeroCircles />
          <View style={S.heroNav}>
            <HazinaLogo />
            <TouchableOpacity
              style={S.notifBtn}
              onPress={() => {}}
              accessibilityLabel="Notifications"
            >
              <Feather name="bell" size={20} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>

          <Text style={S.greeting}>Habari za asubuhi</Text>
          <Text style={S.userName}>Wanjiru Kamau</Text>

          <Text style={S.balanceLabel}>GROUP POT BALANCE</Text>
          <Text style={S.balance}>Ksh 84,500</Text>
          <Text style={S.cycleInfo}>Mama Mboga Group · Cycle 4 of 20 · Due Mar 28</Text>

          <StatusPill paid={14} pending={4} late={2} />
        </View>

        {/* White body */}
        <View style={S.body}>
          {/* MGR Rotation */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <Text style={S.sectionTitle}>MGR rotation</Text>
              <TouchableOpacity onPress={() => navigation.navigate("MGRSchedule")}>
                <Text style={S.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.rotationRow}>
              {ROTATION.map((r, i) => (
                <View key={i} style={[S.rotationCard, r.isCurrent && S.rotationCardCurrent]}>
                  <View style={[S.rotationAvatar, { backgroundColor: r.isCurrent ? "#F59E0B" : r.color }]}>
                    <Text style={S.rotationInitials}>{r.initials}</Text>
                  </View>
                  <Text style={[S.rotationName, r.isCurrent && { color: "#FFFFFF" }]}>{r.name}</Text>
                  <View style={S.rotationBottom}>
                    <Text style={[S.rotationMonth, r.isCurrent && { color: "rgba(255,255,255,0.8)" }]}>{r.month}</Text>
                    {r.done      && <Feather name="check" size={12} color="rgba(255,255,255,0.8)" style={{ marginLeft: 2 }} />}
                    {r.isCurrent && (
                      <View style={S.nowBadge}><Text style={S.nowBadgeText}>NOW</Text></View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Recent activity */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>Recent activity</Text>
            <View style={S.activityList}>
              {ACTIVITY.map((a, i) => (
                <View key={i} style={S.activityRow}>
                  <Feather name={a.icon} size={20} color={ICON_COLOR[a.icon]} />
                  <View style={S.activityMeta}>
                    <Text style={S.activityName}>{a.name}</Text>
                    <Text style={S.activitySub}>{a.sub}</Text>
                  </View>
                  <Text style={[
                    S.activityAmount,
                    a.status === "paid"    && { color: "#059669" },
                    a.status === "pending" && { color: "#D97706" },
                    a.status === "late"    && { color: "#DC2626" },
                  ]}>
                    {a.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* New Chama CTA */}
          <View style={S.section}>
            <TouchableOpacity
              style={S.newChamaCard}
              onPress={() => navigation.navigate("ChamaType")}
              activeOpacity={0.85}
            >
              <View style={S.newChamaIcon}>
                <Feather name="plus" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={S.newChamaTitle}>Create a new chama</Text>
                <Text style={S.newChamaSub}>MGR, investment, welfare or hybrid</Text>
              </View>
              <Feather name="chevron-right" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Collect CTA */}
          <View style={S.section}>
            <TouchableOpacity
              style={S.collectBtn}
              onPress={() => navigation.navigate("ContributionDay")}
              activeOpacity={0.85}
            >
              <Feather name="credit-card" size={18} color="#FFFFFF" />
              <Text style={S.collectBtnText}>Collect via M-Pesa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },

  // Hero
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    overflow: "hidden",
    gap: 4,
  },
  circleTopRight: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -60,
  },
  circleBottomLeft: {
    position: "absolute", width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(245,158,11,0.10)", bottom: -50, left: -40,
  },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  logo: { fontFamily: FontFamily.extraBold, fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
  notifBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center", justifyContent: "center",
  },
  greeting: { fontFamily: FontFamily.regular, fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 },
  userName:  { fontFamily: FontFamily.extraBold, fontSize: 20, color: "#FFFFFF", fontWeight: "800", marginBottom: 12 },
  balanceLabel: { fontFamily: FontFamily.semiBold, fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 1, textTransform: "uppercase" },
  balance:  { fontFamily: FontFamily.extraBold, fontSize: 38, color: "#FFFFFF", fontWeight: "800", letterSpacing: -1, lineHeight: 46 },
  cycleInfo: { fontFamily: FontFamily.regular, fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 12, lineHeight: 17 },

  // Status pill
  pill: {
    flexDirection: "row", alignItems: "center", gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 99,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  pillPaid:    { fontFamily: FontFamily.heading, fontSize: 11, color: "#FFFFFF", fontWeight: "700" },
  pillPending: { fontFamily: FontFamily.heading, fontSize: 11, color: "#F59E0B", fontWeight: "700" },
  pillLate:    { fontFamily: FontFamily.heading, fontSize: 11, color: "#FCA5A5", fontWeight: "700" },
  pillDot:     { color: "rgba(255,255,255,0.4)", fontSize: 14 },

  // Body
  body: { backgroundColor: "#FFFFFF", paddingBottom: 100 },

  // Section
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textPrimary, fontWeight: "700" },
  seeAll:       { fontFamily: FontFamily.semiBold, fontSize: 13, color: Colors.primary },

  // MGR Rotation
  rotationRow: { gap: 10, paddingBottom: 4 },
  rotationCard: {
    width: 72, alignItems: "center", gap: 6,
    backgroundColor: "#F6F9F7", borderRadius: 12,
    padding: 10, borderWidth: 1, borderColor: "#EBF1EF",
  },
  rotationCardCurrent: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rotationAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  rotationInitials: { fontFamily: FontFamily.heading, fontSize: 13, color: "#FFFFFF", fontWeight: "700" },
  rotationName: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.textPrimary, textAlign: "center" },
  rotationBottom: { flexDirection: "row", alignItems: "center", gap: 2 },
  rotationMonth: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textMuted },
  nowBadge: { backgroundColor: "#F59E0B", borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1, marginTop: 2 },
  nowBadgeText: { fontFamily: FontFamily.heading, fontSize: 8, color: "#FFFFFF", fontWeight: "700" },

  // Activity
  activityList: { gap: 0 },
  activityRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F6F9F7",
  },
  activityMeta:   { flex: 1 },
  activityName:   { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "700" },
  activitySub:    { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  activityAmount: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: "700" },

  // Badge
  badge:     { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontFamily: FontFamily.heading, fontSize: 11, fontWeight: "700" },

  // Collect button
  collectBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.button,
    height: 52, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8,
  },
  collectBtnText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#FFFFFF", fontWeight: "700" },

  // New Chama card
  newChamaCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#E8F7F4", borderRadius: 12, borderWidth: 1,
    borderColor: "#A8D8CF", padding: 14,
  },
  newChamaIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center",
  },
  newChamaTitle: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.primary, fontWeight: "700" },
  newChamaSub:   { fontFamily: FontFamily.regular,  fontSize: 12, color: Colors.textMuted, marginTop: 1 },

  // Avatar (not used in this screen but exported for other screens)
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#FFFFFF", fontWeight: "700" },
});
