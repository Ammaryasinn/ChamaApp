import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";

// ─── Eligibility criteria definition ─────────────────────────────────────────

interface Criterion {
  id: string;
  label: string;
  description: string;
  icon: string;
  current: number;
  required: number;
  unit: string;
  format: (v: number) => string;
}

// Removed static mock MEMBER_DATA and CRITERIA.

function passesCriterion(c: Criterion): boolean {
  if (c.id === "loans") return c.current === 0;
  return c.current >= c.required;
}

function progressPct(c: Criterion): number {
  if (c.id === "loans") return c.current === 0 ? 100 : 0;
  return Math.min(100, Math.round((c.current / c.required) * 100));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CriterionCard({ criterion }: { criterion: Criterion }) {
  const passes = passesCriterion(criterion);
  const pct = progressPct(criterion);
  const iconColor = passes ? Colors.success : Colors.warning;
  const iconBg = passes ? Colors.successBg : Colors.warningBg;
  const barColor = passes ? Colors.success : Colors.warning;

  return (
    <View style={[criterionStyles.card, passes && criterionStyles.cardPassed]}>
      {/* Icon + status */}
      <View style={criterionStyles.top}>
        <View style={[criterionStyles.iconWrap, { backgroundColor: iconBg }]}>
          <Feather name={criterion.icon as any} size={18} color={iconColor} />
        </View>

        <View style={criterionStyles.textBlock}>
          <Text style={criterionStyles.label}>{criterion.label}</Text>
          <Text style={criterionStyles.desc}>{criterion.description}</Text>
        </View>

        <View
          style={[
            criterionStyles.statusBadge,
            { backgroundColor: passes ? Colors.successBg : Colors.warningBg },
          ]}
        >
          <Feather
            name={passes ? "check" : "clock"}
            size={12}
            color={passes ? Colors.success : Colors.warning}
          />
          <Text
            style={[
              criterionStyles.statusText,
              { color: passes ? Colors.success : Colors.warning },
            ]}
          >
            {passes ? "MET" : "PENDING"}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={criterionStyles.progressRow}>
        <View style={criterionStyles.progressTrack}>
          <View
            style={[
              criterionStyles.progressFill,
              { width: `${pct}%`, backgroundColor: barColor },
            ]}
          />
        </View>
        <Text style={[criterionStyles.progressLabel, { color: iconColor }]}>
          {criterion.format(criterion.current)}
          {!passes && criterion.id !== "loans" && (
            <Text style={criterionStyles.progressRequired}>
              {" "}
              / {criterion.format(criterion.required)}
            </Text>
          )}
        </Text>
      </View>

      {/* What's missing */}
      {!passes && criterion.id !== "loans" && (
        <View style={criterionStyles.gapRow}>
          <Feather name="info" size={12} color={Colors.textMuted} />
          <Text style={criterionStyles.gapText}>
            {criterion.id === "tenure" &&
              `${criterion.required - criterion.current} more month${
                criterion.required - criterion.current !== 1 ? "s" : ""
              } needed`}
            {criterion.id === "score" &&
              `${criterion.required - criterion.current} more points needed`}
            {criterion.id === "ontime" &&
              `${criterion.required - criterion.current}% improvement needed`}
            {criterion.id === "contributions" &&
              `KES ${(
                criterion.required - criterion.current
              ).toLocaleString()} more to contribute`}
          </Text>
        </View>
      )}
    </View>
  );
}

const criterionStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing[4],
    gap: Spacing[3],
    ...Shadow.xs,
  },
  cardPassed: {
    borderColor: Colors.successLight,
    backgroundColor: Colors.successBg,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.input,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textBlock: { flex: 1 },
  label: {
    color: "#E8D6B5",
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 17,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.divider,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: Radius.full,
  },
  progressLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    minWidth: 100,
    textAlign: "right",
  },
  progressRequired: {
    color: Colors.textMuted,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  gapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
    paddingTop: Spacing[0.5],
  },
  gapText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
});

// ─── Score ring ───────────────────────────────────────────────────────────────

function EligibilityRing({
  passedCount,
  total,
}: {
  passedCount: number;
  total: number;
}) {
  const allPassed = passedCount === total;
  const pct = Math.round((passedCount / total) * 100);

  return (
    <View style={ringStyles.wrap}>
      <View
        style={[
          ringStyles.ring,
          {
            borderColor: allPassed
              ? Colors.success
              : passedCount >= 3
                ? Colors.warning
                : Colors.error,
          },
        ]}
      >
        <Text
          style={[
            ringStyles.number,
            {
              color: allPassed
                ? Colors.success
                : passedCount >= 3
                  ? Colors.warning
                  : Colors.error,
            },
          ]}
        >
          {passedCount}/{total}
        </Text>
        <Text style={ringStyles.label}>criteria</Text>
      </View>
      <Text style={ringStyles.pct}>{pct}% eligible</Text>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrap: { alignItems: "center" },
  ring: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: Spacing[2],
  },
  number: {
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 28,
  },
  label: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginTop: 2,
  },
  pct: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LoanEligibilityScreen({ navigation, route }: any) {
  const maxAmount: number = route?.params?.maxAmount ?? 80000;

  const [scoreData, setScoreData] = useState<any>(null);

  React.useEffect(() => {
    import("../api/client").then(({ apiClient }) => {
       apiClient.get("/credit-scores/me")
         .then(res => setScoreData(res.data))
         .catch(console.error);
    });
  }, []);

  const memberData = {
    monthsAsMember: scoreData?.totalMonthsTracked || 0,
    creditScore: scoreData?.score || 300,
    onTimeRate: scoreData?.paymentConsistencyScore || 0,
    totalContributed: scoreData?.totalContributed || 0,
    activeLoans: 0,
    hasDefaultHistory: (scoreData?.penaltyRecordScore || 100) < 70,
  };

  const criteria: Criterion[] = [
    {
      id: "tenure",
      label: "Minimum membership",
      description: "You must have been an active member for at least 6 months.",
      icon: "calendar",
      current: memberData.monthsAsMember,
      required: 6,
      unit: "months",
      format: (v) => `${v} month${v !== 1 ? "s" : ""}`,
    },
    {
      id: "score",
      label: "Hazina Credit Score",
      description: "Your score is built from payment consistency, loan history, and tenure.",
      icon: "bar-chart-2",
      current: memberData.creditScore,
      required: 600,
      unit: "pts",
      format: (v) => `${v} / 850`,
    },
    {
      id: "ontime",
      label: "On-time payment rate",
      description: "At least 75% of your contributions must have been paid on time.",
      icon: "check-circle",
      current: memberData.onTimeRate,
      required: 75,
      unit: "%",
      format: (v) => `${v}%`,
    },
    {
      id: "contributions",
      label: "Total contributed",
      description: "You must have contributed at least KES 30,000 across all cycles.",
      icon: "trending-up",
      current: memberData.totalContributed,
      required: 30000,
      unit: "KES",
      format: (v) => `KES ${v.toLocaleString()}`,
    },
    {
      id: "loans",
      label: "No active defaults",
      description: "You must have no outstanding loan defaults or active loan penalties.",
      icon: "shield",
      current: memberData.hasDefaultHistory ? 1 : 0,
      required: 0,
      unit: "defaults",
      format: (v) => (v === 0 ? "Clean record" : `${v} default${v !== 1 ? "s" : ""}`),
    },
  ];

  const passedCriteria = criteria.filter(passesCriterion);
  const failedCriteria = criteria.filter((c) => !passesCriterion(c));
  const isEligible = failedCriteria.length === 0 && scoreData !== null;

  // Estimate months until eligible (based on longest failing criterion)
  const monthsToEligible = !isEligible
    ? Math.max(
        ...failedCriteria.map((c) => {
          if (c.id === "tenure") return c.required - c.current;
          if (c.id === "contributions")
            return Math.ceil((c.required - c.current) / 5000); // ~5k/month
          if (c.id === "ontime") return 2; // 2 months of good behaviour
          if (c.id === "score") return 3;
          return 1;
        }),
      )
    : 0;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Dark hero ── */}
        <LinearGradient
          colors={[Colors.surfaceDeepDark, Colors.surfaceDark, Colors.surfaceElevated]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Feather
              name="arrow-left"
              size={20}
              color={Colors.textInverseSoft}
            />
          </Pressable>

          {/* Hero content */}
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroOverline}>BANK LOAN ELIGIBILITY</Text>
              <Text style={styles.heroTitle}>
                {isEligible ? "You qualify! 🎉" : "Your eligibility\ncheck"}
              </Text>
              <Text style={styles.heroSub}>
                {isEligible
                  ? `You're pre-approved for up to KES ${maxAmount.toLocaleString()} from partner banks.`
                  : `Complete ${failedCriteria.length} more criteria to unlock bank loan offers.`}
              </Text>
            </View>

            <EligibilityRing
              passedCount={passedCriteria.length}
              total={criteria.length}
            />
          </View>

          {/* Eligible banner */}
          {isEligible && (
            <View style={styles.eligibleBanner}>
              <Feather name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.eligibleBannerText}>
                All criteria met — 3 banks ready to offer
              </Text>
            </View>
          )}

          {/* Not eligible timeline */}
          {!isEligible && (
            <View style={styles.timelineBanner}>
              <Feather name="clock" size={14} color={Colors.accent} />
              <Text style={styles.timelineBannerText}>
                Keep contributing consistently —{" "}
                <Text style={styles.timelineBold}>
                  eligible in ~{monthsToEligible} month
                  {monthsToEligible !== 1 ? "s" : ""}
                </Text>
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* ── White content card ── */}
        <View style={styles.card}>
          {/* Section header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Eligibility criteria</Text>
            <View
              style={[
                styles.sectionBadge,
                {
                  backgroundColor: isEligible
                    ? Colors.successBg
                    : Colors.warningBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionBadgeText,
                  { color: isEligible ? Colors.success : Colors.warning },
                ]}
              >
                {passedCriteria.length} of {criteria.length} met
              </Text>
            </View>
          </View>

          {/* Passed criteria first */}
          {passedCriteria.length > 0 && (
            <View style={styles.criteriaGroup}>
              {passedCriteria.map((c) => (
                <CriterionCard key={c.id} criterion={c} />
              ))}
            </View>
          )}

          {/* Failed criteria */}
          {failedCriteria.length > 0 && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerLabel}>Still needed</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.criteriaGroup}>
                {failedCriteria.map((c) => (
                  <CriterionCard key={c.id} criterion={c} />
                ))}
              </View>
            </>
          )}

          {/* How we score you */}
          <View style={styles.howCard}>
            <View style={styles.howHeader}>
              <Feather name="info" size={15} color={Colors.primary} />
              <Text style={styles.howTitle}>
                How your eligibility is scored
              </Text>
            </View>
            <Text style={styles.howBody}>
              Hazina builds your credit profile from your chama activity —{" "}
              <Text style={styles.howBold}>
                no salary slips or bank statements needed.
              </Text>
              {"\n\n"}
              Every on-time contribution, loan repayment, and month of active
              membership improves your score. Banks see your verified track
              record — not just a number.
            </Text>

            <View style={styles.howPoints}>
              {[
                {
                  icon: "calendar",
                  text: "Contribution consistency — 35% weight",
                },
                { icon: "repeat", text: "Loan repayment history — 25% weight" },
                {
                  icon: "clock",
                  text: "Months of active membership — 20% weight",
                },
                {
                  icon: "trending-up",
                  text: "Contribution growth — 10% weight",
                },
                { icon: "alert-triangle", text: "Penalty record — 10% weight" },
              ].map((p, i) => (
                <View key={i} style={styles.howPoint}>
                  <View style={styles.howPointIcon}>
                    <Feather
                      name={p.icon as any}
                      size={13}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.howPointText}>{p.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Partner banks */}
          <View style={styles.banksSection}>
            <Text style={styles.banksTitle}>Partner banks</Text>
            <View style={styles.banksRow}>
              {["Equity Bank", "KCB", "Co-op Bank"].map((bank) => (
                <View key={bank} style={styles.bankChip}>
                  <Feather
                    name="briefcase"
                    size={12}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.bankChipText}>{bank}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.banksNote}>
              Offers are pre-approved based on your Hazina profile. No branch
              visit required — disbursed directly via M-Pesa.
            </Text>
          </View>

          <View style={{ height: Spacing[4] }} />
        </View>
      </ScrollView>

      {/* ── Sticky footer CTA ── */}
      <View style={styles.footer}>
        {isEligible ? (
          <Pressable
            style={styles.ctaBtn}
            onPress={() => navigation.navigate("BankLoanOffer", { maxAmount })}
          >
            <Feather name="star" size={18} color={Colors.surfaceDark} />
            <Text style={styles.ctaBtnText}>View your pre-approved offer</Text>
            <Feather name="arrow-right" size={18} color={Colors.surfaceDark} />
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.ctaBtnLocked} onPress={() => {}} disabled>
              <Feather name="lock" size={16} color={Colors.textMuted} />
              <Text style={styles.ctaBtnLockedText}>
                Complete {failedCriteria.length} more criteria to unlock
              </Text>
            </Pressable>
            <Pressable
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryBtnText}>
                Keep building my profile →
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },

  // Hero
  hero: {
    paddingBottom: Spacing[6],
  },
  backBtn: {
    margin: Spacing[5],
    marginBottom: Spacing[2],
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[5],
    gap: Spacing[4],
  },
  heroLeft: { flex: 1 },
  heroOverline: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.5,
    marginBottom: Spacing[2],
  },
  heroTitle: {
    color: Colors.textInverse,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: Spacing[2],
  },
  heroSub: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    opacity: 0.85,
  },

  // Eligible banner
  eligibleBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginHorizontal: Spacing[5],
    backgroundColor: "rgba(52,211,153,0.12)",
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.25)",
    borderRadius: Radius.input,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  eligibleBannerText: {
    color: Colors.success,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    flex: 1,
  },

  // Not eligible timeline banner
  timelineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginHorizontal: Spacing[5],
    backgroundColor: "rgba(245,158,11,0.1)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.2)",
    borderRadius: Radius.input,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  timelineBannerText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    flex: 1,
    lineHeight: 18,
    opacity: 0.9,
  },
  timelineBold: {
    color: Colors.accent,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Card
  card: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    marginTop: -Spacing[4],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[7],
    paddingBottom: Spacing[4],
    ...Shadow.heroCard,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    color: "#E8D6B5",
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  sectionBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  sectionBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Criteria groups
  criteriaGroup: { gap: Spacing[3], marginBottom: Spacing[3] },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginVertical: Spacing[4],
  },
  divider: { flex: 1, height: 1, backgroundColor: Colors.divider },
  dividerLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // How we score you
  howCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing[5],
    marginTop: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.xs,
  },
  howHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  howTitle: {
    color: "#E8D6B5",
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  howBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    marginBottom: Spacing[4],
  },
  howBold: {
    color: "#E8D6B5",
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  howPoints: { gap: Spacing[2.5] },
  howPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  howPointIcon: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  howPointText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 18,
  },

  // Partner banks
  banksSection: {
    marginTop: Spacing[5],
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.xs,
  },
  banksTitle: {
    color: "#E8D6B5",
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing[3],
  },
  banksRow: {
    flexDirection: "row",
    gap: Spacing[2],
    flexWrap: "wrap",
    marginBottom: Spacing[3],
  },
  bankChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
    backgroundColor: Colors.divider,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.full,
  },
  bankChipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  banksNote: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 17,
  },

  // Footer
  footer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[6],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing[2],
    ...Shadow.heroCard,
  },
  ctaBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.button,
    paddingVertical: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },
  ctaBtnText: {
    color: Colors.surfaceDark,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.2,
  },
  ctaBtnLocked: {
    backgroundColor: Colors.divider,
    borderRadius: Radius.button,
    paddingVertical: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },
  ctaBtnLockedText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: Spacing[3],
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
});
