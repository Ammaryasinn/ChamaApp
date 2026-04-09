import React from "react";
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
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

const SCORE_DATA = [
  { label: "Payment consistency", weight: "35%", score: 92,  color: Colors.primary },
  { label: "Loan repayment",      weight: "25%", score: 100, color: Colors.primary },
  { label: "Group tenure",        weight: "20%", score: 80,  color: Colors.primary },
  { label: "Penalty record",      weight: "10%", score: 70,  color: "#D97706" },
  { label: "Contribution growth", weight: "10%", score: 85,  color: Colors.primary },
];

import { useChamaContext } from "../context/ChamaContext";
// Mock data completely removed

export default function MemberCreditProfileScreen({ navigation }: any) {
  const { activeChamaId, chamas } = useChamaContext();
  const chama = chamas.find((c: any) => c.id === activeChamaId) || chamas[0];
  const themeColor = chama?.heroColor || Colors.primary;
  return (
    <SafeAreaView style={[S.screen, { backgroundColor: themeColor }]}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[S.hero, { backgroundColor: themeColor }]}>
          <HeroCircles />
          <View style={S.heroNav}>
            <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
              <Feather name="chevron-left" size={18} color="#fff" />
            </Pressable>
            <Text style={S.heroTitle}>Hazina Score</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Big score number */}
          <Text style={S.scoreNumber}>742</Text>
          <Text style={S.scoreRating}>Good · 22 months tracked</Text>

          {/* Range bar */}
          <View style={S.rangeWrap}>
            <View style={S.rangeTrack}>
              <View style={[S.rangeFill, { width: "75%" }]} />
              <View style={[S.rangeThumb, { left: "75%", marginLeft: -8, borderColor: themeColor }]} />
            </View>
            <View style={S.rangeLabels}>
              <Text style={S.rangeLabelStart}>300</Text>
              <Text style={S.rangeLabelMid}>Poor</Text>
              <Text style={S.rangeLabelMid}>Fair</Text>
              <Text style={S.rangeLabelMid}>Good</Text>
              <Text style={S.rangeLabelEnd}>850</Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={S.body}>
          <Text style={S.sectionTitle}>Score breakdown</Text>

          {SCORE_DATA.map((row, i) => (
            <View key={i} style={S.scoreRow}>
              <View style={S.scoreRowTop}>
                <Text style={S.scoreLabel}>{row.label}</Text>
                <Text style={S.scoreWeight}>{row.weight}</Text>
                <Text style={[S.scoreVal, { color: row.color }]}>{row.score}</Text>
              </View>
              <View style={S.barTrack}>
                <View style={[S.barFill, { width: `${row.score}%` as any, backgroundColor: row.color }]} />
              </View>
            </View>
          ))}

          {/* Loan offer */}
          <View style={S.loanCard}>
            <Text style={S.loanCardTop}>BANK LOAN UNLOCKED</Text>
            <Text style={S.loanCardTitle}>Co-operative Bank</Text>
            <Text style={S.loanAmount}>Ksh 50,000</Text>
            <Text style={S.loanTerms}>16% p.a. · Up to 12 months</Text>
            <TouchableOpacity
              style={S.applyBtn}
              onPress={() => navigation.navigate("BankLoanOffer")}
              activeOpacity={0.85}
            >
              <Text style={S.applyBtnText}>Apply now — no branch visit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1 },
  circleTopRight: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50 },
  circleBottomLeft: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(245,158,11,0.10)", bottom: -50, left: -40 },

  hero: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 30, overflow: "hidden", alignItems: "center" },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", alignSelf: "stretch", marginBottom: 12 },
  backBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 18, color: "#E8D6B5", fontWeight: "800" },

  scoreNumber: { fontFamily: FontFamily.extraBold, fontSize: 72, color: "#E8D6B5", fontWeight: "800", letterSpacing: -2, lineHeight: 80 },
  scoreRating: { fontFamily: FontFamily.regular, fontSize: 14, color: "rgba(255,255,255,0.7)", marginBottom: 16 },

  rangeWrap: { alignSelf: "stretch" },
  rangeTrack: { height: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "visible", position: "relative" },
  rangeFill: {
    position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 4,
    backgroundColor: Colors.surface,
  },
  rangeThumb: {
    position: "absolute", top: -5, width: 18, height: 18,
    borderRadius: 9, backgroundColor: Colors.surface, borderWidth: 2.5,
  },
  rangeLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  rangeLabelStart: { fontFamily: FontFamily.regular, fontSize: 10, color: "rgba(255,255,255,0.5)" },
  rangeLabelMid:   { fontFamily: FontFamily.regular, fontSize: 10, color: "rgba(255,255,255,0.5)" },
  rangeLabelEnd:   { fontFamily: FontFamily.regular, fontSize: 10, color: "rgba(255,255,255,0.5)" },

  body: { backgroundColor: Colors.surface, padding: 20, paddingBottom: 100 },
  sectionTitle: { fontFamily: FontFamily.heading, fontSize: 16, color: "#E8D6B5", fontWeight: "700", marginBottom: 16 },

  scoreRow: { marginBottom: 16 },
  scoreRowTop: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  scoreLabel:  { flex: 1, fontFamily: FontFamily.regular, fontSize: 13, color: "#E8D6B5" },
  scoreWeight: { fontFamily: FontFamily.medium, fontSize: 12, color: Colors.textMuted, marginRight: 8 },
  scoreVal:    { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: "700", minWidth: 28, textAlign: "right" },
  barTrack: { height: 6, backgroundColor: "#EBF1EF", borderRadius: 3, overflow: "hidden" },
  barFill:  { height: 6, borderRadius: 3 },

  loanCard: {
    backgroundColor: "#E8F7F4", borderRadius: 14, borderWidth: 1,
    borderColor: "#A8D8CF", padding: 16, marginTop: 8,
  },
  loanCardTop:   { fontFamily: FontFamily.heading, fontSize: 10, color: "#2E9E87", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  loanCardTitle: { fontFamily: FontFamily.heading, fontSize: 14, color: "#E8D6B5", fontWeight: "700", marginBottom: 2 },
  loanAmount:    { fontFamily: FontFamily.extraBold, fontSize: 28, color: Colors.primary, fontWeight: "800", letterSpacing: -0.5 },
  loanTerms:     { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginBottom: 14 },
  applyBtn:      { backgroundColor: Colors.primary, borderRadius: Radius.button, height: 48, alignItems: "center", justifyContent: "center" },
  applyBtnText:  { fontFamily: FontFamily.heading, fontSize: 14, color: "#E8D6B5", fontWeight: "700" },
});
