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

export default function BankLoanOfferScreen({ navigation }: any) {
  const maxAmount = 80000;
  const minAmount = 5000;
  const step = 5000;

  const [selectedAmount, setSelectedAmount] = useState(maxAmount);
  const [selectedMonths, setSelectedMonths] = useState(12);

  const interestRate = 0.14; // 14% flat approx for simple math
  const totalRepayable =
    selectedAmount + selectedAmount * interestRate * (selectedMonths / 12);
  const monthlyRepayment = Math.round(totalRepayable / selectedMonths);

  const adjustAmount = (change: number) => {
    let newAmount = selectedAmount + change;
    if (newAmount < minAmount) newAmount = minAmount;
    if (newAmount > maxAmount) newAmount = maxAmount;
    setSelectedAmount(newAmount);
  };

  const fillPercentage =
    ((selectedAmount - minAmount) / (maxAmount - minAmount)) * 100;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Pre-qualified offer</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Offer Banner */}
        <View style={styles.offerCard}>
          <View style={styles.offerHeaderRow}>
            <Text style={styles.bankName}>EQUITY BANK</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>Score: 742</Text>
            </View>
          </View>
          <Text style={styles.offerTitle}>
            You're pre-approved for up to Ksh {maxAmount.toLocaleString()}
          </Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>No branch visit</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Auto-collected via M-Pesa</Text>
            </View>
          </View>
        </View>

        {/* Amount Selector */}
        <Text style={styles.sectionTitle}>How much do you need?</Text>

        <View style={styles.amountSelectorCard}>
          <Text style={styles.amountValueMain}>
            Ksh {selectedAmount.toLocaleString()}
          </Text>

          <View style={styles.sliderContainer}>
            <Pressable
              style={styles.adjustBtn}
              onPress={() => adjustAmount(-step)}
            >
              <Text style={styles.adjustBtnText}>-</Text>
            </Pressable>

            <View style={styles.trackBg}>
              <View
                style={[styles.trackFill, { width: `${fillPercentage}%` }]}
              />
              <View
                style={[
                  styles.trackThumb,
                  { left: `${fillPercentage}%`, marginLeft: -10 },
                ]}
              />
            </View>

            <Pressable
              style={styles.adjustBtn}
              onPress={() => adjustAmount(step)}
            >
              <Text style={styles.adjustBtnText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.limitsRow}>
            <Text style={styles.limitText}>
              Min: Ksh {minAmount.toLocaleString()}
            </Text>
            <Text style={styles.limitText}>
              Max: Ksh {maxAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Repayment options</Text>

        <View style={styles.monthsSelector}>
          {[6, 12, 24].map((months) => (
            <Pressable
              key={months}
              style={[
                styles.monthBtn,
                selectedMonths === months && styles.monthBtnActive,
              ]}
              onPress={() => setSelectedMonths(months)}
            >
              <Text
                style={[
                  styles.monthBtnText,
                  selectedMonths === months && styles.monthBtnTextActive,
                ]}
              >
                {months} months
              </Text>
              {selectedMonths === months && (
                <View style={styles.monthCheck}>
                  <Text style={styles.monthCheckIcon}>✓</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.calculationCard}>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Monthly Repayment</Text>
            <Text style={styles.calcValue}>
              Ksh {monthlyRepayment.toLocaleString()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>Total repayable</Text>
            <Text style={styles.calcTotalValue}>
              Ksh {totalRepayable.toLocaleString()}
            </Text>
          </View>
          <Text style={styles.calcFootnote}>
            Includes 14% flat interest rate. No hidden fees.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.applyBtn}>
          <Text style={styles.applyBtnText}>Accept and Apply</Text>
        </Pressable>
      </View>
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
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  placeholder: { width: 40 },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[10],
    gap: Spacing[6],
  },

  offerCard: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.card,
    padding: Spacing[5],
  },
  offerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  bankName: {
    color: "#7A5314",
    fontSize: FontSize.sm,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1,
  },
  scoreBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[2.5],
    paddingVertical: Spacing[1],
    borderRadius: Radius.input,
  },
  scoreBadgeText: {
    color: Colors.warning,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  offerTitle: {
    color: "#1D170B",
    fontSize: FontSize["4xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[4],
    lineHeight: 30,
  },

  badges: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[2] },
  badge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[2.5],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.md,
  },
  badgeText: {
    color: Colors.warningDark,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginTop: Spacing[2],
  },

  amountSelectorCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.card,
    padding: Spacing[6],
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountValueMain: {
    color: Colors.primary,
    fontSize: FontSize["7xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[6],
  },

  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: Spacing[4],
    marginBottom: Spacing[4],
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.xs,
  },
  adjustBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize["4xl"],
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    marginTop: -2,
  },

  trackBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.xs,
    position: "relative",
    justifyContent: "center",
  },
  trackFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
    position: "absolute",
    left: 0,
  },
  trackThumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.primary,
    ...Shadow.sm,
  },

  limitsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: Spacing[2],
  },
  limitText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  monthsSelector: { flexDirection: "row", gap: Spacing[3] },
  monthBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    alignItems: "center",
    position: "relative",
  },
  monthBtnActive: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
    borderWidth: 2,
  },
  monthBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  monthBtnTextActive: { color: Colors.success },
  monthCheck: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  monthCheckIcon: {
    color: Colors.textInverse,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  calculationCard: {
    backgroundColor: Colors.background,
    borderRadius: Radius.card,
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing[2],
  },
  calcLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  calcValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  calcTotalValue: {
    color: Colors.primary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing[2],
  },
  calcFootnote: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    marginTop: Spacing[3],
  },

  footer: {
    padding: Spacing[5],
    paddingTop: Spacing[2.5],
    paddingBottom: Spacing[8],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4.5],
    alignItems: "center",
    ...Shadow.button,
  },
  applyBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
});
