import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

const SCHEDULE = [
  {
    id: "1",
    initials: "WK",
    name: "Wanjiru Kamau",
    sub: "Delivered Feb 2026",
    status: "Done",
    color: "#2E9E87",
  },
  {
    id: "2",
    initials: "AO",
    name: "Akinyi Otieno",
    sub: "Next · April 2026",
    status: "Up next",
    color: Colors.primary,
  },
  {
    id: "3",
    initials: "MM",
    name: "Muthoni Mwangi",
    sub: "May 2026",
    status: "Scheduled",
    color: Colors.accentDark,
  },
  {
    id: "4",
    initials: "JN",
    name: "Jane Njeri",
    sub: "June 2026",
    status: "Scheduled",
    color: "#EC4899",
  },
];

const PARTNERS = [
  {
    id: "1",
    initial: "R",
    name: "Ramtons Kenya",
    sub: "Fridges, microwaves, washing machines",
    deal: "Up to 8% off",
    color: "#EF4444",
  },
  {
    id: "2",
    initial: "LG",
    name: "LG Electronics",
    sub: "TVs, washing machines, fridges",
    deal: "Up to 6% off",
    color: "#2563EB",
  },
  {
    id: "3",
    initial: "CIC",
    name: "CIC Insurance",
    sub: "Group health and last expense cover",
    deal: "Group rates",
    color: "#047857",
  },
];

import { useChamaContext } from "../context/ChamaContext";
// Mock data completely removed

export default function DealsScreen({ navigation }: any) {
  const { activeChamaId, chamas } = useChamaContext();
  const chama = chamas.find((c: any) => c.id === activeChamaId) || chamas[0];
  const themeColor = chama?.heroColor || Colors.primary;
  return (
    <SafeAreaView style={[S.screen, { backgroundColor: themeColor }]}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        bounces={false}
      >
        {/* ── HERO HEADER ── */}
        <View style={[S.hero, { backgroundColor: themeColor }]}>
          <View style={S.circleTopRight} />

          <View style={S.heroNav}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={S.backBtn}
              hitSlop={12}
            >
              <Feather name="chevron-left" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={S.heroTitle}>Deals</Text>
          </View>

          <Text style={S.balanceLabel}>ACTIVE PURCHASE GOAL</Text>
          <Text style={S.balance}>Samsung 320L Fridge</Text>
          <Text style={S.cycleInfo}>
            Ksh 79,000 each · 20 members · 8 delivered
          </Text>

          <View style={S.pillDark}>
            <Text style={S.pillDarkValOk}>40% complete</Text>
            <Text style={S.pillDarkDot}>·</Text>
            <Text style={S.pillDarkValOk}>Next: Akinyi · April</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={S.body}>
          {/* Current product card */}
          <View style={S.productCard}>
            <View style={S.pcTopRow}>
              <View style={S.pcImgBox}>
                <Feather name="tv" size={24} color="#D97706" />
              </View>
              <View style={S.pcMeta}>
                <Text style={S.pcBrand}>Samsung Kenya · Official partner</Text>
                <Text style={S.pcName}>320L Double Door Fridge</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 4,
                  }}
                >
                  <Text style={S.pcStrike}>Ksh 89,000</Text>
                  <Text style={S.pcPrice}>Ksh 79,000</Text>
                  <View style={S.pcBadge}>
                    <Text style={S.pcBadgeText}>Chama price</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={S.pcProgressArea}>
              <View style={S.pcProgressHeader}>
                <Text style={S.pcProgressLabel}>Delivery progress</Text>
                <Text style={S.pcProgressVal}>8 of 20</Text>
              </View>
              <View style={S.pcProgressTrack}>
                <View style={[S.pcProgressFill, { width: "40%" }]} />
              </View>
            </View>
          </View>

          {/* Schedule */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <Text style={S.sectionTitle}>Delivery schedule</Text>
              <TouchableOpacity>
                <Text style={S.seeAll}>Full list</Text>
              </TouchableOpacity>
            </View>

            <View style={S.scheduleList}>
              {SCHEDULE.map((s) => (
                <View key={s.id} style={S.scheduleItem}>
                  <View style={[S.schAvatar, { backgroundColor: s.color }]}>
                    <Text style={S.schAvatarText}>{s.initials}</Text>
                  </View>
                  <View style={S.actMeta}>
                    <Text style={S.actName}>{s.name}</Text>
                    <Text style={S.actSub}>{s.sub}</Text>
                  </View>
                  <View
                    style={[
                      S.schPill,
                      s.status === "Done"
                        ? { backgroundColor: "#ECFDF5" }
                        : s.status === "Up next"
                          ? { backgroundColor: "#FFF7ED" }
                          : { backgroundColor: Colors.background },
                    ]}
                  >
                    <Text
                      style={[
                        S.schPillText,
                        s.status === "Done"
                          ? { color: "#059669" }
                          : s.status === "Up next"
                            ? { color: "#EA580C" }
                            : { color: "#9CA3AF" },
                      ]}
                    >
                      {s.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Deals */}
          <View style={S.section}>
            <View style={S.sectionHeader}>
              <Text style={S.sectionTitle}>Browse partner deals</Text>
            </View>

            <View style={S.partnerList}>
              {PARTNERS.map((p) => (
                <View key={p.id} style={S.partnerItem}>
                  <View style={[S.pAvatar, { backgroundColor: p.color }]}>
                    <Text style={S.pAvatarText}>{p.initial}</Text>
                  </View>
                  <View style={S.actMeta}>
                    <Text style={S.actName}>{p.name}</Text>
                    <Text
                      style={[S.actSub, { lineHeight: 16 }]}
                      numberOfLines={2}
                    >
                      {p.sub}
                    </Text>
                  </View>
                  <Text style={S.pDeal}>{p.deal.replace(" ", "\n")}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1 },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    overflow: "hidden",
  },
  circleTopRight: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.03)",
    top: -100,
    right: -50,
  },

  heroNav: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: "800",
    flex: 1,
  },

  balanceLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  balance: {
    fontFamily: FontFamily.extraBold,
    fontSize: 32,
    color: Colors.textPrimary,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 40,
  },
  cycleInfo: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
    marginTop: 4,
  },

  pillDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
    alignSelf: "flex-start",
  },
  pillDarkValOk: {
    fontFamily: FontFamily.heading,
    fontSize: 13,
    fontWeight: "700",
    color: "#FFEDD5",
  },
  pillDarkDot: { color: "rgba(255,255,255,0.4)", fontSize: 16 },

  body: {
    backgroundColor: Colors.surface,
    paddingBottom: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    minHeight: 600,
  },

  productCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFAF0",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  pcTopRow: { flexDirection: "row", gap: 16 },
  pcImgBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  pcMeta: { flex: 1 },
  pcBrand: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
  },
  pcName: {
    fontFamily: FontFamily.heading,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "800",
    marginBottom: 6,
  },
  pcStrike: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
    textDecorationLine: "line-through",
  },
  pcPrice: {
    fontFamily: FontFamily.extraBold,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "800",
  },
  pcBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pcBadgeText: {
    fontFamily: FontFamily.heading,
    fontSize: 10,
    color: "#059669",
    fontWeight: "700",
  },

  pcProgressArea: { marginTop: 24 },
  pcProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pcProgressLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  pcProgressVal: {
    fontFamily: FontFamily.heading,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "700",
  },
  pcProgressTrack: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  pcProgressFill: { height: 6, backgroundColor: "#EA580C", borderRadius: 3 },

  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "800",
  },
  seeAll: { fontFamily: FontFamily.medium, fontSize: 13, color: "#14B8A6" },

  scheduleList: { gap: 10 },
  scheduleItem: { flexDirection: "row", alignItems: "center", gap: 14 },
  schAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  schAvatarText: {
    fontFamily: FontFamily.heading,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  actMeta: { flex: 1 },
  actName: {
    fontFamily: FontFamily.heading,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  actSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  schPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  schPillText: {
    fontFamily: FontFamily.heading,
    fontSize: 11,
    fontWeight: "700",
  },

  partnerList: { gap: 12 },
  partnerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
  },
  pAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pAvatarText: {
    fontFamily: FontFamily.extraBold,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "800",
  },
  pDeal: {
    fontFamily: FontFamily.extraBold,
    fontSize: 14,
    color: "#047857",
    fontWeight: "800",
    textAlign: "right",
  },
});
