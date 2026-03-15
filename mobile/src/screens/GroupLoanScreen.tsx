import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";

const MOCK_MEMBERS = [
  {
    id: "1",
    initials: "JD",
    name: "Julie Doe",
    avatarBg: "#D1FAE5",
    avatarColor: "#065F46",
    status: "on_track",
    due: 2267,
    paid: 2267,
  },
  {
    id: "2",
    initials: "DK",
    name: "David Kinyua",
    avatarBg: "#DBEAFE",
    avatarColor: "#1D4ED8",
    status: "late",
    due: 2267,
    paid: 1000,
  },
  {
    id: "3",
    initials: "SW",
    name: "Sarah Wangari",
    avatarBg: "#FEE2E2",
    avatarColor: "#DC2626",
    status: "overdue",
    due: 2267,
    paid: 0,
  },
  {
    id: "4",
    initials: "AO",
    name: "Alex Otieno",
    avatarBg: "#F3E8FF",
    avatarColor: "#7C3AED",
    status: "on_track",
    due: 2267,
    paid: 2267,
  },
  {
    id: "5",
    initials: "GW",
    name: "Grace Wambui",
    avatarBg: "#FCE7F3",
    avatarColor: "#9D174D",
    status: "on_track",
    due: 2267,
    paid: 2267,
  },
  {
    id: "6",
    initials: "MO",
    name: "Michael Okoth",
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
    status: "overdue",
    due: 2267,
    paid: 500,
  },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "on_track") {
    return (
      <View style={styles.badgeGreen}>
        <Text style={styles.badgeGreenText}>ON TRACK</Text>
      </View>
    );
  }
  if (status === "late") {
    return (
      <View style={styles.badgeAmber}>
        <Text style={styles.badgeAmberText}>LATE</Text>
      </View>
    );
  }
  return (
    <View style={styles.badgeRed}>
      <Text style={styles.badgeRedText}>OVERDUE</Text>
    </View>
  );
}

export default function GroupLoanScreen({ navigation }: any) {
  const totalLoan = 68000;
  const totalRepaid = 12400;
  const repaidPct = (totalRepaid / totalLoan) * 100;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Group loan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageSubtitle}>Active loan from the group pot</Text>

        {/* Loan Summary Card */}
        <View style={styles.loanCard}>
          <Text style={styles.loanCardLabel}>Total disbursed</Text>
          <Text style={styles.loanAmount}>
            Ksh {totalLoan.toLocaleString()}
          </Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>INTEREST</Text>
              <Text style={styles.statValue}>13.5% p.a.</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>REPAYMENT</Text>
              <Text style={styles.statValue}>6, 12, or 24 mos.</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>TERM</Text>
              <Text style={styles.statValue}>3 months</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressBg}>
            <View
              style={[styles.progressFill, { width: `${repaidPct}%` as any }]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLeft}>
              Ksh {totalRepaid.toLocaleString()} repaid
            </Text>
            <Text style={styles.progressRight}>{Math.round(repaidPct)}%</Text>
          </View>
        </View>

        {/* Quick info pills */}
        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>📅 Next due: Feb 28</Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>
              👥 {MOCK_MEMBERS.length} borrowers
            </Text>
          </View>
          <View
            style={[
              styles.infoPill,
              { backgroundColor: "#FEF3C7", borderColor: "#FDE68A" },
            ]}
          >
            <Text style={[styles.infoPillText, { color: "#92400E" }]}>
              ⚠ 2 overdue
            </Text>
          </View>
        </View>

        {/* Member Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MEMBER STATUS</Text>
        </View>

        <View style={styles.memberList}>
          {MOCK_MEMBERS.map((m, i) => (
            <View key={m.id}>
              <View style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: m.avatarBg }]}>
                  <Text style={[styles.avatarText, { color: m.avatarColor }]}>
                    {m.initials}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberMeta}>
                    Due: Ksh {m.due.toLocaleString()} · Paid: Ksh{" "}
                    {m.paid.toLocaleString()}
                  </Text>
                </View>
                <StatusBadge status={m.status} />
              </View>
              {i < MOCK_MEMBERS.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </View>
          ))}
        </View>

        {/* Actions */}
        <Pressable style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>📝 Record new loan</Text>
        </Pressable>

        <Pressable style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Collect via M-Pesa STK push</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3.5],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: { padding: Spacing[1] },
  backText: {
    color: Colors.primary,
    fontSize: 22,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: { width: 30 },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[12],
  },

  pageSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    marginBottom: Spacing[4],
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Loan card
  loanCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.cardLg,
    padding: Spacing[6],
    marginBottom: Spacing[4],
  },
  loanCardLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    marginBottom: Spacing[1.5],
  },
  loanAmount: {
    color: Colors.textInverse,
    fontSize: FontSize["7xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: -1,
    marginBottom: Spacing[5],
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: Radius.button,
    padding: Spacing[3.5],
    marginBottom: Spacing[5],
  },
  statBox: { flex: 1, alignItems: "center" },
  statLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.8,
    marginBottom: Spacing[1],
  },
  statValue: {
    color: Colors.textInverse,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: Spacing[2],
  },

  progressBg: {
    height: 8,
    backgroundColor: "#014A3D",
    borderRadius: Radius.xs,
    overflow: "hidden",
    marginBottom: Spacing[2],
  },
  progressFill: {
    height: 8,
    backgroundColor: Colors.accent,
    borderRadius: Radius.xs,
  },
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressLeft: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  progressRight: {
    color: Colors.textInverse,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // Info pills
  infoRow: {
    flexDirection: "row",
    gap: Spacing[2],
    flexWrap: "wrap",
    marginBottom: Spacing[7],
  },
  infoPill: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  infoPillText: {
    color: Colors.successDark,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // Section
  sectionHeader: { marginBottom: Spacing[3] },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  // Member list
  memberList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: "hidden",
    marginBottom: Spacing[5],
    ...Shadow.sm,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3.5],
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[4],
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[3],
  },
  avatarText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  memberInfo: { flex: 1 },
  memberName: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  memberMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // Badges
  badgeGreen: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  badgeGreenText: {
    color: Colors.successDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  badgeAmber: {
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  badgeAmberText: {
    color: Colors.warningDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  badgeRed: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  badgeRedText: {
    color: Colors.errorDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // Buttons
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginBottom: Spacing[3],
  },
  outlineBtnText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    alignItems: "center",
    ...Shadow.button,
  },
  primaryBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
});
