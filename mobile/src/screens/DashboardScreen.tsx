import React, { useEffect, useState } from "react";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { apiClient } from "../api/client";

// ─── Shared shadow — now sourced from theme tokens ────────────────────────────
const CARD_SHADOW = Shadow.sm as object;

// ─── Component ────────────────────────────────────────────────────────────────
export default function DashboardScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [chamas, setChamas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const val = await AsyncStorage.getItem("hazina.user");
        if (val) setUser(JSON.parse(val));

        const res = await apiClient.get("/chamas");
        setChamas(res.data);
      } catch (err) {
        console.warn("Failed to fetch chamas", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleProfilePress = () => navigation.navigate("Settings");

  const activeChama = chamas[0];
  const balance = activeChama?.totalGroupFloat ?? 124500;
  const chamaName = activeChama?.name ?? "Mama Mboga Investment Group";
  const membersCount = 12;
  const firstName = user?.fullName?.split(" ")[0] ?? "User";
  const avatarLetter = user?.fullName?.[0]?.toUpperCase() ?? "U";

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!loading && chamas.length === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Dark hero */}
          <LinearGradient
            colors={[Colors.surfaceDeepDark, Colors.surfaceDark, "#0D2E22"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.welcomeTitle}>Welcome, {firstName} 👋</Text>
                <Text style={styles.welcomeSub}>
                  No chamas yet — create one below
                </Text>
              </View>
              <Pressable
                onPress={handleProfilePress}
                style={styles.avatarCircle}
              >
                <Text style={styles.avatarLetter}>{avatarLetter}</Text>
              </Pressable>
            </View>
          </LinearGradient>

          {/* Empty card */}
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyEmoji}>🌱</Text>
            </View>
            <Text style={styles.emptyTitle}>Ready to grow your money?</Text>
            <Text style={styles.emptyDesc}>
              Join a friends group or start your own Chama today and become its
              Chairperson.
            </Text>

            <Pressable
              style={styles.btnPrimary}
              onPress={() => navigation.navigate("ChamaType")}
            >
              <Text style={styles.btnPrimaryText}>Create a Chama</Text>
            </Pressable>

            <Pressable
              style={styles.btnOutlineGreen}
              onPress={() => navigation.navigate("PremiumSubscription")}
            >
              <Text style={styles.btnOutlineGreenText}>View Pricing Plans</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main dashboard ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Dark gradient hero ──────────────────────────────────────────────── */}
        <LinearGradient
          colors={[Colors.surfaceDeepDark, Colors.surfaceDark, "#0D2E22"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Top row: chama name + avatar */}
          <View style={styles.headerRow}>
            <View style={styles.groupIconWrap}>
              <Feather name="users" size={18} color={Colors.textInverseSoft} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {chamaName}
              </Text>
              <Text style={styles.headerSubtitle}>
                {membersCount} members · Chairperson
              </Text>
            </View>
            <Pressable onPress={handleProfilePress} style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>{avatarLetter}</Text>
            </Pressable>
          </View>

          {/* Balance block */}
          <View style={styles.heroBalanceBlock}>
            <Text style={styles.heroBalanceLabel}>GROUP POT BALANCE</Text>
            <Text style={styles.heroBalanceAmount}>
              KES {balance.toLocaleString()}
            </Text>

            {/* Progress bar */}
            <View style={styles.heroProgressTrack}>
              <View style={[styles.heroProgressFill, { width: "83%" }]} />
            </View>

            {/* Pills */}
            <View style={styles.heroPillsRow}>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>✓ 10 paid this cycle</Text>
              </View>
              <View style={[styles.heroPill, styles.heroPillAmber]}>
                <Text style={styles.heroPillTextAmber}>! 2 pending</Text>
              </View>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>Feb 28 due</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── Quick Actions ──────────────────────────────────────────────────── */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={() => navigation.navigate("ContributionDay")}
          >
            <Feather name="dollar-sign" size={17} color={Colors.primary} />
            <Text style={styles.actionBtnLabel}>Collect</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={() => navigation.navigate("Members")}
          >
            <Feather name="users" size={17} color={Colors.primary} />
            <Text style={styles.actionBtnLabel}>Members</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={() => navigation.navigate("GroupLoan")}
          >
            <Feather name="credit-card" size={17} color={Colors.primary} />
            <Text style={styles.actionBtnLabel}>Loans</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              pressed && styles.actionBtnPressed,
            ]}
            onPress={() => navigation.navigate("InviteMembers")}
          >
            <Feather name="user-plus" size={17} color={Colors.primary} />
            <Text style={styles.actionBtnLabel}>Invite</Text>
          </Pressable>
        </View>

        {/* ── This Cycle — Contributions ─────────────────────────────────────── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>THIS CYCLE</Text>
          <Pressable onPress={() => navigation.navigate("Members")}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {/* Member list card */}
        <View style={styles.memberCard}>
          {/* Alice Wambui — PAID */}
          <View style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: "#D1FAE5" }]}>
              <Text style={[styles.memberInitials, { color: "#065F46" }]}>
                AW
              </Text>
            </View>
            <View style={styles.memberMeta}>
              <Text style={styles.memberName}>Alice Wambui</Text>
              <Text style={styles.memberAmt}>KES 5,000</Text>
            </View>
            <View style={styles.badgePaid}>
              <Text style={styles.badgePaidText}>PAID</Text>
            </View>
          </View>

          <View style={styles.memberDivider} />

          {/* John Musyoka — LATE */}
          <View style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: "#DBEAFE" }]}>
              <Text style={[styles.memberInitials, { color: "#1D4ED8" }]}>
                JM
              </Text>
            </View>
            <View style={styles.memberMeta}>
              <Text style={styles.memberName}>John Musyoka</Text>
              <Text style={styles.memberAmt}>KES 5,000</Text>
            </View>
            <View style={styles.badgeLate}>
              <Text style={styles.badgeLateText}>LATE +200</Text>
            </View>
          </View>

          <View style={styles.memberDivider} />

          {/* Catherine Njeri — PENDING */}
          <View style={styles.memberRow}>
            <View style={[styles.memberAvatar, { backgroundColor: "#F3F4F6" }]}>
              <Text style={[styles.memberInitials, { color: "#6B7280" }]}>
                CN
              </Text>
            </View>
            <View style={styles.memberMeta}>
              <Text style={styles.memberName}>Catherine Njeri</Text>
              <Text style={styles.memberAmt}>KES 5,000</Text>
            </View>
            <View style={styles.badgePending}>
              <Text style={styles.badgePendingText}>PENDING</Text>
            </View>
          </View>
        </View>

        {/* ── Member Perks Card ──────────────────────────────────────────────── */}
        <Pressable
          style={({ pressed }) => [
            styles.perksCard,
            pressed && { opacity: 0.92 },
          ]}
          onPress={() => navigation.navigate("Perks")}
        >
          <LinearGradient
            colors={[Colors.surfaceDeepDark, "#0D2E22"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.perksCardGradient}
          >
            <View style={styles.perksCardLeft}>
              <View style={styles.perksIconWrap}>
                <Feather name="gift" size={20} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.perksCardTitle}>Member Perks</Text>
                <Text style={styles.perksCardSub}>
                  8 deals live · Chicken Inn, Java, Jumia & more
                </Text>
              </View>
            </View>
            <View style={styles.perksCardArrow}>
              <Feather
                name="chevron-right"
                size={18}
                color={Colors.textInverseSoft}
              />
            </View>
          </LinearGradient>
        </Pressable>

        {/* ── Upcoming ───────────────────────────────────────────────────────── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>UPCOMING</Text>
        </View>

        {/* FEB 01 — MGR payout */}
        <Pressable
          style={({ pressed }) => [
            styles.upcomingCard,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => navigation.navigate("MGRSchedule")}
        >
          <View style={[styles.dateBox, { backgroundColor: Colors.successBg }]}>
            <Text style={[styles.dateMonth, { color: Colors.successDark }]}>
              FEB
            </Text>
            <Text style={[styles.dateDay, { color: Colors.successDark }]}>
              01
            </Text>
          </View>
          <View style={styles.upcomingMeta}>
            <Text style={styles.upcomingTitle}>MGR payout</Text>
            <Text style={styles.upcomingDesc}>
              Wanjiru receives{" "}
              <Text style={styles.upcomingHighlight}>KES 62,500</Text>
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* JAN 28 — Next meeting */}
        <Pressable
          style={({ pressed }) => [
            styles.upcomingCard,
            pressed && { opacity: 0.9 },
          ]}
        >
          <View
            style={[styles.dateBox, { backgroundColor: Colors.accentLight }]}
          >
            <Text style={[styles.dateMonth, { color: Colors.warningDark }]}>
              JAN
            </Text>
            <Text style={[styles.dateDay, { color: Colors.warningDark }]}>
              28
            </Text>
          </View>
          <View style={styles.upcomingMeta}>
            <Text style={styles.upcomingTitle}>Next meeting</Text>
            <Text style={styles.upcomingDesc}>
              Sunday, 6:00 PM · Community Center
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Layout ────────────────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing[16],
  },

  // ── Hero dark header ──────────────────────────────────────────────────────
  hero: {
    paddingHorizontal: Spacing[5],
    paddingTop: Platform.OS === "ios" ? Spacing[4] : Spacing[5],
    paddingBottom: Spacing[7],
  },
  profileIconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Hero balance block
  heroBalanceBlock: {
    marginTop: Spacing[5],
  },
  heroBalanceLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.5,
    marginBottom: Spacing[1],
  },
  heroBalanceAmount: {
    color: Colors.accent,
    fontSize: FontSize["7xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: -1.5,
    lineHeight: 50,
    marginBottom: Spacing[4],
  },
  heroProgressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: Radius.full,
    overflow: "hidden",
    marginBottom: Spacing[3],
  },
  heroProgressFill: {
    height: 6,
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  heroPillsRow: {
    flexDirection: "row",
    gap: Spacing[2],
  },
  heroPill: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.full,
  },
  heroPillText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  heroPillAmber: {
    backgroundColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
  },
  heroPillTextAmber: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // ── Content area (white) ─────────────────────────────────────────────────
  contentPad: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
  },

  // ── Header shared ─────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    color: Colors.textInverse,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // ── Empty-state header ────────────────────────────────────────────────────
  welcomeTitle: {
    color: Colors.textInverse,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: -0.3,
  },
  welcomeSub: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginTop: 2,
    opacity: 0.85,
  },

  // ── Dashboard header ──────────────────────────────────────────────────────
  groupIconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  groupIcon: {
    fontSize: FontSize["2xl"],
  },
  headerTitle: {
    color: Colors.textInverse,
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    marginTop: 1,
    opacity: 0.85,
  },

  // ── Empty state card ──────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.cardLg,
    paddingHorizontal: Spacing[7],
    paddingVertical: Spacing[9],
    alignItems: "center",
    marginTop: Spacing[5],
    marginHorizontal: Spacing[5],
    ...CARD_SHADOW,
  },
  emptyIconWrap: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[6],
  },
  emptyEmoji: {
    fontSize: 38,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[3],
    textAlign: "center",
    letterSpacing: -0.2,
  },
  emptyDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: Spacing[8],
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  btnPrimaryText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  btnOutlineGreen: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.button,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
  },
  btnOutlineGreenText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // ── Quick actions ─────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: "row",
    gap: Spacing[3],
    marginBottom: Spacing[6],
    paddingHorizontal: Spacing[5],
    marginTop: Spacing[5],
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.button,
    ...CARD_SHADOW,
  },
  actionBtnPressed: {
    backgroundColor: Colors.primaryLight,
  },
  actionBtnIcon: {
    fontSize: FontSize.xl,
  },
  actionBtnLabel: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // ── Section header ────────────────────────────────────────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[3],
    paddingHorizontal: Spacing[5],
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.4,
  },
  viewAll: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // ── Member list card ──────────────────────────────────────────────────────
  memberCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: "hidden",
    marginBottom: Spacing[4],
    marginHorizontal: Spacing[5],
    ...CARD_SHADOW,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: 14,
  },
  memberDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[4],
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  memberInitials: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  memberMeta: {
    flex: 1,
  },
  memberName: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  memberAmt: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // badges
  badgePaid: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 9,
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.successLight,
  },
  badgePaidText: {
    color: Colors.successDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.6,
  },
  badgeLate: {
    backgroundColor: Colors.accentTint,
    paddingHorizontal: 9,
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.warningLight,
  },
  badgeLateText: {
    color: Colors.warningDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.6,
  },
  badgePending: {
    backgroundColor: Colors.background,
    paddingHorizontal: 9,
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgePendingText: {
    color: Colors.textSecondary,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.6,
  },

  // ── Upcoming cards ────────────────────────────────────────────────────────
  // ── Perks card ────────────────────────────────────────────────────────────
  perksCard: {
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[5],
    borderRadius: Radius.card,
    overflow: "hidden",
    ...Shadow.md,
  },
  perksCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    borderRadius: Radius.card,
  },
  perksCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    flex: 1,
  },
  perksIconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.input,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.25)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  perksCardTitle: {
    color: Colors.textInverse,
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: 2,
  },
  perksCardSub: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    opacity: 0.85,
  },
  perksCardArrow: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  upcomingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[3],
    ...CARD_SHADOW,
  },
  dateBox: {
    width: 54,
    height: 54,
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[3.5],
  },
  dateMonth: {
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1,
    marginBottom: 1,
  },
  dateDay: {
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 24,
  },
  upcomingMeta: {
    flex: 1,
  },
  upcomingTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing[1],
  },
  upcomingDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 18,
  },
  upcomingHighlight: {
    color: Colors.success,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: FontSize["5xl"],
    lineHeight: 28,
    paddingLeft: Spacing[1.5],
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
});
