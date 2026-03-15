import React from "react";
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

export default function MemberCreditProfileScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Member Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>WK</Text>
          </View>
          <Text style={styles.name}>Wanjiru Kamau</Text>
          <Text style={styles.joinDate}>Member since Jan 2023</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>TREASURER</Text>
          </View>
        </View>

        {/* Global Score Card */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreHeader}>Chama Credit Score</Text>
          <View style={styles.scoreTop}>
            <Text style={styles.scoreNumber}>742</Text>
            <Text style={styles.scoreLimit}> / 850</Text>
          </View>

          <View style={styles.gradientBarWrapper}>
            <View style={styles.gradientBar}>
              <View
                style={[styles.barSegment, { backgroundColor: "#DC2626" }]}
              />
              <View
                style={[styles.barSegment, { backgroundColor: "#D97706" }]}
              />
              <View
                style={[styles.barSegment, { backgroundColor: "#059669" }]}
              />
              <View
                style={[styles.barSegment, { backgroundColor: "#006D5B" }]}
              />
            </View>
            <View style={[styles.marker, { left: "87%" }]} />
          </View>

          <View style={styles.scoreStatusRow}>
            <Text style={styles.scoreStatus}>Good standing</Text>
            <Text style={styles.scoreUpdate}>UPDATED 2H AGO</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Factors section */}
        <Text style={styles.sectionTitle}>Credit Factors</Text>

        <View style={styles.factorsList}>
          {/* Factor 1 */}
          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>Payment consistency</Text>
              <View style={styles.factorScoreBox}>
                <Text style={styles.factorScoreMain}>92/100</Text>
                <Text style={styles.factorWeight}> 35%</Text>
              </View>
            </View>
            <View style={styles.factorBarBg}>
              <View style={[styles.factorBarFill, { width: "92%" }]} />
            </View>
          </View>

          {/* Factor 2 */}
          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>Loan repayment history</Text>
              <View style={styles.factorScoreBox}>
                <Text style={styles.factorScoreMain}>100/100</Text>
                <Text style={styles.factorWeight}> 25%</Text>
              </View>
            </View>
            <View style={styles.factorBarBg}>
              <View style={[styles.factorBarFill, { width: "100%" }]} />
            </View>
          </View>

          {/* Factor 3 */}
          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>Tenure in group</Text>
              <View style={styles.factorScoreBox}>
                <Text style={styles.factorScoreMain}>80/100</Text>
                <Text style={styles.factorWeight}> 20%</Text>
              </View>
            </View>
            <View style={styles.factorBarBg}>
              <View style={[styles.factorBarFill, { width: "80%" }]} />
            </View>
          </View>

          {/* Factor 4 */}
          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>Contribution growth</Text>
              <View style={styles.factorScoreBox}>
                <Text style={styles.factorScoreMain}>85/100</Text>
                <Text style={styles.factorWeight}> 10%</Text>
              </View>
            </View>
            <View style={styles.factorBarBg}>
              <View style={[styles.factorBarFill, { width: "85%" }]} />
            </View>
          </View>

          {/* Factor 5 */}
          <View style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>Penalty record</Text>
              <View style={styles.factorScoreBox}>
                <Text style={styles.factorScoreMain}>70/100</Text>
                <Text style={styles.factorWeight}> 10%</Text>
              </View>
            </View>
            <View style={styles.factorBarBg}>
              <View
                style={[
                  styles.factorBarFill,
                  { width: "70%", backgroundColor: "#D97706" },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.streakSection}>
          <Text style={styles.sectionTitle}>Contribution Streak</Text>
          <View style={styles.dotsRow}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.streakDot,
                  i === 20 ? styles.streakLate : styles.streakOnTime,
                ]}
              />
            ))}
          </View>
          <Text style={styles.streakDesc}>
            22 consecutive months paid on time
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.loanHistoryHeader}>
          <Text style={styles.sectionTitle}>Loan History</Text>
        </View>

        <View style={styles.loanHistoryList}>
          <View style={styles.loanItem}>
            <View style={styles.loanIconBox}>
              <Text style={styles.loanIcon}>✓</Text>
            </View>
            <View style={styles.loanItemContent}>
              <Text style={styles.loanItemTitle}>Ksh 20,000</Text>
              <Text style={styles.loanItemDesc}>Repaid in full · 3 months</Text>
            </View>
            <Text style={styles.loanItemDate}>MAR 2024</Text>
          </View>

          <View style={styles.loanItem}>
            <View style={styles.loanIconBox}>
              <Text style={styles.loanIcon}>✓</Text>
            </View>
            <View style={styles.loanItemContent}>
              <Text style={styles.loanItemTitle}>Ksh 8,000</Text>
              <Text style={styles.loanItemDesc}>Repaid in full · 2 months</Text>
            </View>
            <Text style={styles.loanItemDate}>AUG 2023</Text>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.offerBanner}>
          <Text style={styles.offerBannerTitle}>✓ Bank Loan Eligibility</Text>
          <Text style={styles.offerBannerText}>
            Wanjiru qualifies for a bank loan — up to Ksh 80,000
          </Text>
          <Pressable
            style={styles.offerBtn}
            onPress={() =>
              navigation.navigate("LoanEligibility", { maxAmount: 80000 })
            }
          >
            <Text style={styles.offerBtnText}>Check my loan eligibility →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  header: {
    padding: Spacing[5],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: { paddingVertical: Spacing[2] },
  backText: {
    color: Colors.primary,
    fontSize: FontSize["4xl"],
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  placeholder: { width: 30 },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[10],
  },
  profileHeader: { alignItems: "center", marginBottom: Spacing[8] },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3],
  },
  avatarText: {
    color: Colors.textInverse,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: FontSize["4xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  joinDate: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing[2],
  },
  roleBadge: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: Spacing[2.5],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  roleBadgeText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1,
  },

  scoreContainer: { marginBottom: Spacing[8] },
  scoreHeader: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing[2],
  },
  scoreTop: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing[4],
  },
  scoreNumber: {
    color: Colors.textPrimary,
    fontSize: 48,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 56,
  },
  scoreLimit: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    marginLeft: Spacing[1],
  },

  gradientBarWrapper: {
    position: "relative",
    height: 16,
    justifyContent: "center",
    marginBottom: Spacing[2],
  },
  gradientBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: Radius.xs,
    overflow: "hidden",
  },
  barSegment: { flex: 1 },
  marker: {
    position: "absolute",
    top: 0,
    width: 4,
    height: 16,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.xs,
  },

  scoreStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreStatus: {
    color: Colors.success,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  scoreUpdate: {
    color: Colors.textMuted,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing[8],
  },

  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[5],
  },
  factorsList: { gap: Spacing[5] },
  factorItem: {},
  factorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[2],
  },
  factorName: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  factorScoreBox: { flexDirection: "row", alignItems: "baseline" },
  factorScoreMain: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  factorWeight: {
    color: Colors.textMuted,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  factorBarBg: {
    height: 6,
    backgroundColor: Colors.divider,
    borderRadius: Radius.full,
  },
  factorBarFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },

  streakSection: {},
  dotsRow: {
    flexDirection: "row",
    gap: Spacing[1.5],
    flexWrap: "wrap",
    marginBottom: Spacing[3],
  },
  streakDot: { width: 12, height: 12, borderRadius: Radius.full },
  streakOnTime: { backgroundColor: Colors.primary },
  streakLate: { backgroundColor: Colors.accent },
  streakDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxs,
    fontStyle: "italic",
  },

  loanHistoryHeader: { marginBottom: Spacing[4] },
  loanHistoryList: { gap: Spacing[4], marginBottom: Spacing[10] },
  loanItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing[4],
    borderRadius: Radius.lg,
  },
  loanIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.successLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[4],
  },
  loanIcon: {
    color: Colors.success,
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  loanItemContent: { flex: 1 },
  loanItemTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: 2,
  },
  loanItemDesc: { color: Colors.textSecondary, fontSize: FontSize.sm },
  loanItemDate: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },

  offerBanner: {
    backgroundColor: Colors.primary,
    padding: Spacing[6],
    borderRadius: Radius.card,
  },
  offerBannerTitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    textTransform: "uppercase",
    marginBottom: Spacing[2],
    letterSpacing: 0.5,
  },
  offerBannerText: {
    color: Colors.textInverse,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 24,
    marginBottom: Spacing[5],
  },
  offerBtn: {
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: Radius.input,
    alignItems: "center",
  },
  offerBtnText: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
});
