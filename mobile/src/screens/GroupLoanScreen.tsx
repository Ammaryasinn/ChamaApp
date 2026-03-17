import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Pressable,
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

const TABS = ["Active", "Vote", "History"] as const;
type Tab = typeof TABS[number];

import { useChamaContext } from "../context/ChamaContext";
import { MY_CHAMAS } from "./DashboardScreen";

export default function GroupLoanScreen({ navigation }: any) {
  const { activeChamaId } = useChamaContext();
  const chama = MY_CHAMAS.find((c: any) => c.id === activeChamaId) || MY_CHAMAS[0];
  const themeColor = chama.heroColor;

  const [tab, setTab] = useState<Tab>("Active");
  const [voted, setVoted] = useState<"approve" | "decline" | null>(null);

  return (
    <SafeAreaView style={[S.screen, { backgroundColor: themeColor }]}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={[S.hero, { backgroundColor: themeColor }]}>
        <HeroCircles />
        <View style={S.heroNav}>
          <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>
          <Text style={S.heroTitle}>Loans</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={S.heroSub}>Mama Mboga Group</Text>
        <View style={S.pill}>
          <Text style={S.pillWhite}>2 active loans</Text>
          <Text style={S.pillDot}>·</Text>
          <Text style={S.pillAmber}>1 vote pending</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={S.tabRow}>
        {TABS.map((t) => (
          <Pressable
            key={t}
            style={[S.tabBtn, tab === t && { ...S.tabBtnActive, backgroundColor: themeColor }]}
            onPress={() => setTab(t)}
          >
            <Text style={[S.tabBtnText, tab === t && S.tabBtnTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {/* Pending vote card */}
        {(tab === "Active" || tab === "Vote") && (
          <View style={S.voteCard}>
            <Text style={S.votePending}>Pending vote · 48 hrs left</Text>
            <Text style={S.voteRequestor}>Kamau Otieno requests</Text>
            <Text style={S.voteAmount}>Ksh 15,000</Text>
            <Text style={S.votePurpose}>Purpose: School fees · 3 months</Text>

            <View style={S.voteStats}>
              <View style={S.voteStat}>
                <Text style={S.voteStatNum}>7</Text>
                <Text style={[S.voteStatLabel, { color: "#059669" }]}>Yes</Text>
              </View>
              <View style={S.voteStat}>
                <Text style={[S.voteStatNum, { color: "#DC2626" }]}>2</Text>
                <Text style={[S.voteStatLabel, { color: "#DC2626" }]}>No</Text>
              </View>
              <View style={S.voteStat}>
                <Text style={S.voteStatNum}>9</Text>
                <Text style={S.voteStatLabel}>Pending</Text>
              </View>
            </View>

            <View style={S.voteActions}>
              {voted ? (
                <View style={[S.approveBtn, voted === "decline" && S.declineBtn, { opacity: 0.7 }]}>
                  <Text style={voted === "approve" ? S.approveBtnText : S.declineBtnText}>
                    {voted === "approve" ? "✓ You approved" : "✗ You declined"}
                  </Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity style={S.approveBtn} activeOpacity={0.85} onPress={() => setVoted("approve")}>
                    <Text style={S.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={S.declineBtn} activeOpacity={0.85} onPress={() => setVoted("decline")}>
                    <Text style={S.declineBtnText}>Decline</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

        {/* History tab */}
        {tab === "History" && (
          <View style={{ paddingBottom: 12 }}>
            {[
              { name: "Wanjiru Kamau", amount: "Ksh 10,000", period: "Repaid · Jan 2026", icon: "check", color: "#059669", bg: "#ECFDF5" },
              { name: "Akinyi Otieno", amount: "Ksh 8,000", period: "Repaid · Dec 2025", icon: "check", color: "#059669", bg: "#ECFDF5" },
              { name: "Kamau Otieno", amount: "Ksh 15,000", period: "Defaulted · Nov 2025", icon: "x", color: "#DC2626", bg: "#FEF2F2" },
            ].map((loan, i) => (
              <View key={i} style={S.activeLoanCard}>
                <View style={S.activeLoanTop}>
                  <View style={[{ width: 32, height: 32, borderRadius: 16, backgroundColor: loan.bg, alignItems: "center", justifyContent: "center" }]}>
                    <Feather name={loan.icon as any} size={14} color={loan.color} />
                  </View>
                  <View style={[S.activeLoanMeta, { flex: 1, marginLeft: 12 }]}>
                    <Text style={S.activeLoanName}>{loan.name}</Text>
                    <Text style={S.activeLoanPurpose}>{loan.period}</Text>
                  </View>
                  <Text style={[S.activeLoanAmtLarge, { fontSize: 15, color: loan.color }]}>{loan.amount}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Active loan card */}
        {(tab === "Active") && (
          <View style={S.activeLoanCard}>
            <View style={S.activeLoanTop}>
              <View style={S.activeLoanMeta}>
                <Text style={S.activeLoanName}>Wanjiru Kamau</Text>
                <Text style={S.activeLoanPurpose}>Medical emergency</Text>
              </View>
              <View>
                <Text style={S.activeLoanAmt}>Ksh</Text>
                <Text style={S.activeLoanAmtLarge}>20,000</Text>
                <Text style={S.activeLoanPeriod}>Month 2 of 4</Text>
              </View>
            </View>
            <Text style={S.repaidLabel}>Repaid so far</Text>
            <View style={S.repaidBarTrack}>
              <View style={[S.repaidBarFill, { width: "50%" }]} />
            </View>
            <Text style={S.repaidAmt}>Ksh 10,000</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={S.footer}>
        <TouchableOpacity style={S.requestBtn} activeOpacity={0.85} onPress={() => navigation.navigate("LoanEligibility")}>
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={S.requestBtnText}>Request a loan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },
  cTR: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50 },
  cBL: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(245,158,11,0.10)", bottom: -40, left: -30 },

  hero: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, overflow: "hidden", gap: 6 },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 20, color: "#FFFFFF", fontWeight: "800" },
  heroSub:   { fontFamily: FontFamily.regular, fontSize: 12, color: "rgba(255,255,255,0.65)" },

  pill: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  pillWhite: { fontFamily: FontFamily.heading, fontSize: 11, color: "#FFFFFF", fontWeight: "700" },
  pillAmber: { fontFamily: FontFamily.heading, fontSize: 11, color: "#F59E0B", fontWeight: "700" },
  pillDot:   { color: "rgba(255,255,255,0.4)", fontSize: 14 },

  // Tabs
  tabRow: { flexDirection: "row", backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  tabBtn: { borderRadius: 99, paddingHorizontal: 16, paddingVertical: 7, backgroundColor: "#F6F9F7", borderWidth: 1, borderColor: "#EBF1EF" },
  tabBtnActive: { borderColor: Colors.primary },
  tabBtnText:   { fontFamily: FontFamily.medium, fontSize: 13, color: Colors.textMuted },
  tabBtnTextActive: { color: "#FFFFFF", fontFamily: FontFamily.heading, fontWeight: "700" },

  scroll: { backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },

  // Vote card
  voteCard: { backgroundColor: "#FFFBEB", borderRadius: 14, borderWidth: 1.5, borderColor: "#FDE68A", padding: 16, marginBottom: 12 },
  votePending:   { fontFamily: FontFamily.heading, fontSize: 12, color: "#D97706", fontWeight: "700", marginBottom: 4 },
  voteRequestor: { fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700" },
  voteAmount:    { fontFamily: FontFamily.extraBold, fontSize: 28, color: Colors.textPrimary, fontWeight: "800", letterSpacing: -0.5 },
  votePurpose:   { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginBottom: 14 },
  voteStats: { flexDirection: "row", gap: 10, marginBottom: 14 },
  voteStat:  { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 10, alignItems: "center", padding: 10 },
  voteStatNum:   { fontFamily: FontFamily.extraBold, fontSize: 22, color: Colors.textPrimary, fontWeight: "800" },
  voteStatLabel: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted },
  voteActions: { flexDirection: "row", gap: 10 },
  approveBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: Radius.button, height: 46, alignItems: "center", justifyContent: "center" },
  approveBtnText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#FFFFFF", fontWeight: "700" },
  declineBtn: { flex: 1, backgroundColor: "#FEF2F2", borderRadius: Radius.button, height: 46, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#FECACA" },
  declineBtnText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#DC2626", fontWeight: "700" },

  // Active loan card
  activeLoanCard: { backgroundColor: "#E8F7F4", borderRadius: 14, borderWidth: 1, borderColor: "#A8D8CF", padding: 16, marginBottom: 12 },
  activeLoanTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  activeLoanMeta: {},
  activeLoanName: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "700" },
  activeLoanPurpose: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  activeLoanAmt: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.primary, textAlign: "right" },
  activeLoanAmtLarge: { fontFamily: FontFamily.extraBold, fontSize: 22, color: Colors.primary, fontWeight: "800", textAlign: "right" },
  activeLoanPeriod: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, textAlign: "right" },
  repaidLabel: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.textSecondary, marginBottom: 6 },
  repaidBarTrack: { height: 6, backgroundColor: "#A8D8CF", borderRadius: 3, marginBottom: 4, overflow: "hidden" },
  repaidBarFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  repaidAmt: { fontFamily: FontFamily.heading, fontSize: 12, color: Colors.primary, fontWeight: "700", textAlign: "right" },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#EBF1EF", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  requestBtn: { backgroundColor: Colors.primary, borderRadius: Radius.button, height: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  requestBtnText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
