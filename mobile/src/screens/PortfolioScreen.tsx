import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

const HOLDINGS = [
  { id: "1", name: "NSE Shares", sub: "Safaricom, KCB, Equity Bank", value: "Ksh 560,000", ret: "+8.2%", retRaw: "+Ksh 42,500", color: "#3B82F6" },
  { id: "2", name: "Land — Rongai", sub: "0.5 acre · Purchased Jun 2024", value: "Ksh 1,200,000", ret: "+18.0%", retRaw: "+Ksh 183,000", color: "#8B5CF6" },
  { id: "3", name: "CIC Unit Trust", sub: "Money market fund", value: "Ksh 340,000", ret: "+11.1%", retRaw: "+Ksh 34,000", color: "#F59E0B" },
];

import { useChamaContext } from "../context/ChamaContext";
import { MY_CHAMAS } from "./DashboardScreen";

export default function PortfolioScreen({ navigation }: any) {
  const { activeChamaId } = useChamaContext();
  const chama = MY_CHAMAS.find((c: any) => c.id === activeChamaId) || MY_CHAMAS[0];
  const themeColor = chama.heroColor;
  const [activeTab, setActiveTab] = useState<"Holdings" | "Returns" | "History">("Holdings");
  return (
    <SafeAreaView style={[S.screen, { backgroundColor: themeColor }]}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]} bounces={false}>
        {/* ── HERO HEADER ── */}
        <View style={[S.hero, { backgroundColor: themeColor }]}>
          <View style={S.circleTopRight} />
          
          <View style={S.heroNav}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
              <Feather name="chevron-left" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={S.heroTitle}>Portfolio</Text>
            <View style={S.typePill}>
              <Text style={S.typePillText}>Uwekezaji</Text>
            </View>
          </View>

          <Text style={S.balanceLabel}>TOTAL FUND VALUE</Text>
          <Text style={S.balance}>Ksh 2,100,000</Text>
          <Text style={S.cycleInfo}>Kilimani Invest Club · 12 members</Text>

          <View style={S.pillDark}>
            <Text style={S.pillDarkValOk}>Your share: Ksh 175,000</Text>
            <Text style={S.pillDarkDot}>·</Text>
            <Text style={S.pillDarkValOk}>+12.4% this year</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={S.body}>
          {/* Your Return Summary */}
          <View style={S.summaryCard}>
            <View style={S.summaryRow}>
              <View>
                <Text style={S.summaryLabel}>Your personal share</Text>
                <Text style={S.summaryVal}>Ksh{"\n"}175,000</Text>
                <Text style={S.summarySub}>+Ksh 19,300 this year</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={S.summaryLabel}>Return</Text>
                <Text style={[S.summaryVal, { color: "#059669", letterSpacing: -1, fontSize: 36, marginTop: -4 }]}>+12.4%</Text>
              </View>
            </View>
          </View>

          {/* Tab Switcher */}
          <View style={S.tabSwitcher}>
            {(["Holdings", "Returns", "History"] as const).map(t => (
              <Pressable key={t} style={[S.tabOpt, activeTab === t && S.tabOptActive]} onPress={() => setActiveTab(t)}>
                <Text style={[S.tabOptText, activeTab === t && S.tabOptTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          {/* Holdings Tab */}
          {activeTab === "Holdings" && (
            <>
              <View style={S.section}>
                <View style={S.sectionHeader}>
                  <Text style={S.sectionTitle}>Current holdings</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("PremiumSubscription")}>
                    <Text style={S.seeAll}>Full report</Text>
                  </TouchableOpacity>
                </View>
                <View style={S.portList}>
                  {HOLDINGS.map(p => (
                    <View key={p.id} style={S.portItem}>
                      <View style={[S.portDot, { backgroundColor: p.color }]} />
                      <View style={S.actMeta}>
                        <Text style={S.actName}>{p.name}</Text>
                        <Text style={S.actSub}>{p.sub}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={S.actAmt}>{p.value}</Text>
                        <Text style={[S.actSub, { color: "#059669", fontWeight: "700" }]}>{p.ret} · {p.retRaw}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={S.section}>
                <View style={S.sectionHeader}>
                  <Text style={S.sectionTitle}>Pending vote</Text>
                  <Text style={{ fontFamily: FontFamily.heading, fontSize: 13, color: themeColor, fontWeight: "700" }}>1 of 2</Text>
                </View>
                <View style={S.voteCard}>
                  <Text style={S.voteLabel}>PROPOSAL · 3 DAYS LEFT</Text>
                  <Text style={S.voteTitle}>Invest Ksh 200,000 in additional Equity Bank shares on NSE</Text>
                  <View style={S.voteTallyRow}>
                    <View style={[S.voteTally, { backgroundColor: "#ECFDF5" }]}><Text style={[S.vtNum, { color: "#059669" }]}>7</Text><Text style={[S.vtLbl, { color: "#059669" }]}>Yes</Text></View>
                    <View style={[S.voteTally, { backgroundColor: "#FEF2F2" }]}><Text style={[S.vtNum, { color: "#DC2626" }]}>2</Text><Text style={[S.vtLbl, { color: "#DC2626" }]}>No</Text></View>
                    <View style={[S.voteTally, { backgroundColor: "#F9FAFB" }]}><Text style={[S.vtNum, { color: "#9CA3AF" }]}>3</Text><Text style={[S.vtLbl, { color: "#9CA3AF" }]}>Pending</Text></View>
                  </View>
                  <View style={S.voteBtns}>
                    <TouchableOpacity style={S.voteApprove} onPress={() => Alert.alert("✓ Voted", "Your approval has been recorded.")}>  
                      <Text style={S.voteApproveText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={S.voteDecline} onPress={() => Alert.alert("✗ Voted", "Your decline has been recorded.")}>  
                      <Text style={S.voteDeclineText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Returns Tab */}
          {activeTab === "Returns" && (
            <View style={S.section}>
              <Text style={S.sectionTitle}>Annual returns</Text>
              {HOLDINGS.map(p => (
                <View key={p.id} style={[S.portItem, { marginTop: 12 }]}>
                  <View style={[S.portDot, { backgroundColor: p.color }]} />
                  <View style={S.actMeta}>
                    <Text style={S.actName}>{p.name}</Text>
                    <Text style={S.actSub}>{p.sub}</Text>
                  </View>
                  <Text style={[S.actSub, { color: "#059669", fontWeight: "700" }]}>{p.ret}</Text>
                </View>
              ))}
            </View>
          )}

          {/* History Tab */}
          {activeTab === "History" && (
            <View style={S.section}>
              <Text style={S.sectionTitle}>Transaction history</Text>
              {[("NSE Shares purchase — Mar 2024"), ("Rongai land deposit — Jun 2024"), ("CIC Unit Trust — Dec 2024")].map((item, i) => (
                <View key={i} style={[S.portItem, { marginTop: 12 }]}>
                  <View style={[S.portDot, { backgroundColor: ["#3B82F6", "#8B5CF6", "#F59E0B"][i] }]} />
                  <Text style={S.actName}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1 },

  hero: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, overflow: "hidden" },
  circleTopRight: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(255,255,255,0.03)", top: -80, right: -80 },
  
  heroNav: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 12 },
  backBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 22, color: "#FFFFFF", fontWeight: "800", flex: 1 },
  typePill: { backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typePillText: { fontFamily: FontFamily.heading, fontSize: 10, color: "#FFFFFF", fontWeight: "700" },

  balanceLabel: { fontFamily: FontFamily.semiBold, fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase" },
  balance:      { fontFamily: FontFamily.extraBold, fontSize: 44, color: "#FFFFFF", fontWeight: "800", letterSpacing: -1.5, lineHeight: 52 },
  cycleInfo:    { fontFamily: FontFamily.regular, fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 16 },

  pillDark: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(37,99,235,0.2)", borderRadius: 99, paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignSelf: "flex-start" },
  pillDarkValOk: { fontFamily: FontFamily.heading, fontSize: 12, fontWeight: "700", color: "#93C5FD" },
  pillDarkDot: { color: "#60A5FA", fontSize: 14 },

  body: { backgroundColor: "#FFFFFF", paddingBottom: 100, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, paddingTop: 20, minHeight: 600 },
  
  summaryCard: { marginHorizontal: 20, backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 20, padding: 20, marginBottom: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontFamily: FontFamily.regular, fontSize: 12, color: "#065F46" },
  summaryVal: { fontFamily: FontFamily.extraBold, fontSize: 32, color: "#006D5B", fontWeight: "800", letterSpacing: -1, marginTop: 4, lineHeight: 36 },
  summarySub: { fontFamily: FontFamily.heading, fontSize: 13, color: "#059669", fontWeight: "700", marginTop: 8 },

  tabSwitcher: { flexDirection: "row", marginHorizontal: 20, backgroundColor: "#F9FAFB", borderRadius: 12, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: "#E5E7EB" },
  tabOpt: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 8 },
  tabOptActive: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  tabOptText: { fontFamily: FontFamily.heading, fontSize: 13, color: Colors.textSecondary, fontWeight: "700" },
  tabOptTextActive: { color: Colors.textPrimary },

  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textPrimary, fontWeight: "800" },
  seeAll: { fontFamily: FontFamily.medium, fontSize: 13, color: Colors.primary },

  portList: { gap: 12 },
  portItem: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16 },
  portDot: { width: 10, height: 10, borderRadius: 5 },
  actMeta: { flex: 1 },
  actName: { fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700" },
  actSub: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  actAmt: { fontFamily: FontFamily.heading, fontSize: 15, fontWeight: "700" },

  voteCard: { backgroundColor: "#FFFAF0", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 16, padding: 20 },
  voteLabel: { fontFamily: FontFamily.heading, fontSize: 10, color: "#D97706", fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  voteTitle: { fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textPrimary, fontWeight: "700", lineHeight: 22, marginBottom: 16 },
  
  voteTallyRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  voteTally: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 12 },
  vtNum: { fontFamily: FontFamily.extraBold, fontSize: 20, fontWeight: "800" },
  vtLbl: { fontFamily: FontFamily.medium, fontSize: 11, marginTop: 2 },

  voteBtns: { flexDirection: "row", gap: 12 },
  voteApprove: { flex: 1, backgroundColor: "#006D5B", height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  voteApproveText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
  voteDecline: { flex: 1, backgroundColor: "#FFF1F2", borderWidth: 1, borderColor: "#FECACA", height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  voteDeclineText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#E11D48", fontWeight: "700" },
});
