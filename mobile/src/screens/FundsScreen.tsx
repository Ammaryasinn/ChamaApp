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

import { useChamaContext } from "../context/ChamaContext";

export default function FundsScreen({ navigation }: any) {
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
            <Text style={S.heroTitle}>Funds</Text>
          </View>

          <Text style={S.balanceLabel}>TOTAL GROUP FUNDS</Text>
          <Text style={S.balance}>Ksh 156,000</Text>
          <Text style={S.cycleInfo}>Westlands Hybrid Chama · 20 members</Text>

          <View style={S.pillDark}>
            <Text style={[S.pillDarkValOk, { color: "#FDE68A" }]}>60% MGR</Text>
            <Text style={S.pillDarkDot}>·</Text>
            <Text style={[S.pillDarkValOk, { color: "#A7F3D0" }]}>
              30% Invest
            </Text>
            <Text style={S.pillDarkDot}>·</Text>
            <Text style={[S.pillDarkValOk, { color: "#E9D5FF" }]}>
              10% Welfare
            </Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={S.body}>
          {/* MGR Fund Card */}
          <View
            style={[
              S.fundCard,
              { borderColor: "#A7F3D0", backgroundColor: "#F0FDFA" },
            ]}
          >
            <View style={S.scTop}>
              <View style={[S.scIcon, { backgroundColor: "#047857" }]}>
                <Feather name="rotate-cw" color={Colors.textPrimary} size={16} />
              </View>
              <View style={S.scMeta}>
                <Text style={[S.scTitle, { color: "#065F46" }]}>MGR Pot</Text>
                <Text style={S.scSub}>
                  Merry-go-round · {(chama as any)?.mgrPercentage || 0}% of
                  contributions
                </Text>
              </View>
              <View style={[S.scPill, { backgroundColor: "#047857" }]}>
                <Text style={S.scPillText}>Cycle{"\n"}3</Text>
              </View>
            </View>
            <Text style={[S.scAmount, { color: Colors.primary, marginTop: 16 }]}>
              Ksh {Number((chama as any)?.mgrPotBalance || 0).toLocaleString()}
            </Text>
            <Text style={[S.scSub, { marginTop: 4, marginBottom: 12 }]}>
              Next payout: Muthoni Mwangi · April
            </Text>
            <View style={S.scProgressRow}>
              <Text style={S.scSub}>18 of 20 contributed</Text>
              <Text style={[S.scTitle, { color: "#047857" }]}>90%</Text>
            </View>
            <View style={S.scProgressTrack}>
              <View
                style={[
                  S.scProgressFill,
                  { backgroundColor: "#047857", width: "90%" },
                ]}
              />
            </View>
          </View>

          {/* Investment Fund Card */}
          <View
            style={[
              S.fundCard,
              { borderColor: "#BFDBFE", backgroundColor: Colors.surfaceElevated },
            ]}
          >
            <View style={S.scTop}>
              <View style={[S.scIcon, { backgroundColor: Colors.background }]}>
                <Feather name="trending-up" color={Colors.textPrimary} size={16} />
              </View>
              <View style={S.scMeta}>
                <Text style={[S.scTitle, { color: "#1D4ED8" }]}>
                  Investment Fund
                </Text>
                <Text style={[S.scSub, { color: Colors.primary }]}>
                  {(chama as any)?.investmentPercentage || 0}% of contributions
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: FontFamily.heading,
                  color: "#059669",
                  fontWeight: "700",
                }}
              >
                +8.2%
              </Text>
            </View>
            <Text style={[S.scAmount, { color: Colors.primary, marginTop: 16 }]}>
              Ksh{" "}
              {Number(
                (chama as any)?.investmentFundBalance || 0,
              ).toLocaleString()}
            </Text>
            <Text
              style={[
                S.scSub,
                { color: Colors.primary, marginTop: 4, marginBottom: 16 },
              ]}
            >
              Vote to invest → 1 proposal pending
            </Text>
            <TouchableOpacity
              style={[S.scBtn, { backgroundColor: Colors.background }]}
              onPress={() => navigation.navigate("Portfolio")}
            >
              <Text style={S.scBtnText}>View portfolio and vote</Text>
            </TouchableOpacity>
          </View>

          {/* Welfare Fund Card */}
          <View
            style={[
              S.fundCard,
              { borderColor: "#DDD6FE", backgroundColor: "#FAF5FF" },
            ]}
          >
            <View style={S.scTop}>
              <View style={[S.scIcon, { backgroundColor: Colors.accentDark }]}>
                <Feather name="heart" color={Colors.textPrimary} size={16} />
              </View>
              <View style={S.scMeta}>
                <Text style={[S.scTitle, { color: "#6D28D9" }]}>
                  Welfare Pot
                </Text>
                <Text style={[S.scSub, { color: Colors.accentDark }]}>
                  {(chama as any)?.welfarePercentage || 0}% of contributions ·
                  Emergency loans
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: FontFamily.heading,
                  color: "#059669",
                  fontWeight: "700",
                }}
              >
                ✓ Good
              </Text>
            </View>
            <Text style={[S.scAmount, { color: Colors.accentDark, marginTop: 16 }]}>
              Ksh{" "}
              {Number((chama as any)?.welfarePotBalance || 0).toLocaleString()}
            </Text>
            <Text
              style={[
                S.scSub,
                { color: Colors.accentDark, marginTop: 4, marginBottom: 16 },
              ]}
            >
              You can borrow up to Ksh 4,680
            </Text>
            <TouchableOpacity
              style={[S.scBtn, { backgroundColor: Colors.accentDark }]}
              onPress={() => navigation.navigate("LoanEligibility")}
            >
              <Text style={S.scBtnText}>Apply for a loan</Text>
            </TouchableOpacity>
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
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -80,
    right: -40,
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
    color: "#E8D6B5",
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
    fontSize: 44,
    color: "#E8D6B5",
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 52,
  },
  cycleInfo: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
  },

  pillDark: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pillDarkValOk: {
    fontFamily: FontFamily.heading,
    fontSize: 12,
    fontWeight: "700",
  },
  pillDarkDot: { color: "rgba(255,255,255,0.4)", fontSize: 14 },

  body: {
    backgroundColor: Colors.surface,
    paddingBottom: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    minHeight: 600,
    paddingHorizontal: 20,
    gap: 16,
  },

  fundCard: { borderWidth: 1, borderRadius: 20, padding: 20 },
  scTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  scIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scMeta: { flex: 1 },
  scTitle: { fontFamily: FontFamily.heading, fontSize: 15, fontWeight: "700" },
  scSub: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  scPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  scPillText: {
    fontFamily: FontFamily.heading,
    fontSize: 10,
    color: "#E8D6B5",
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 12,
  },

  scAmount: {
    fontFamily: FontFamily.extraBold,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  scProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  scProgressTrack: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  scProgressFill: { height: 6, borderRadius: 3 },

  scBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: 15,
    color: "#E8D6B5",
    fontWeight: "700",
  },
});
