import React, { useState } from "react";
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
} from "react-native";
import { StatusBar } from "expo-status-bar";

const SCHEDULE = [
  {
    id: "1",
    cycle: 1,
    name: "Sarah M.",
    initials: "SM",
    avatarBg: "#D1FAE5",
    avatarColor: "#065F46",
    status: "past",
    amount: 60000,
    month: "Nov",
    desc: "Cycle 1 | Nov | Received Ksh 60,000",
  },
  {
    id: "2",
    cycle: 2,
    name: "Peter K.",
    initials: "PK",
    avatarBg: "#DBEAFE",
    avatarColor: "#1D4ED8",
    status: "past",
    amount: 60000,
    month: "Dec",
    desc: "Cycle 2 | Dec | Received Ksh 60,000",
  },
  {
    id: "3",
    cycle: 3,
    name: "Wanjiru K.",
    initials: "WK",
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
    status: "current",
    amount: 60000,
    month: "Jan",
    desc: "Cycle 3 | Jan | Receiving this cycle",
    isYou: true,
  },
  {
    id: "4",
    cycle: 4,
    name: "Otieno J.",
    initials: "OJ",
    avatarBg: "#F3F4F6",
    avatarColor: "#6B7280",
    status: "future",
    amount: 60000,
    month: "Feb",
    desc: "Cycle 4 | Feb | Future",
    pendingSwap: true,
    swapDesc: "Pending Otieno's approval",
  },
  {
    id: "5",
    cycle: 5,
    name: "Alice W.",
    initials: "AW",
    avatarBg: "#F3E8FF",
    avatarColor: "#7C3AED",
    status: "future",
    amount: 60000,
    month: "Mar",
    desc: "Cycle 5 | Mar | Future",
  },
];

export default function MGRScheduleScreen({ navigation }: any) {
  const [swapRequested, setSwapRequested] = useState(false);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Rotation schedule</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle label */}
        <Text style={styles.cycleLabel}>CYCLE 3 OF 12</Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardLeft}>
            <Text style={styles.infoCardAmount}>Ksh 5,000 per member</Text>
            <View style={styles.infoCardRow}>
              <Text style={styles.infoCardLabel}>Pot size this month: </Text>
              <Text style={styles.infoCardValue}>Ksh 60,000</Text>
            </View>
          </View>
          <View style={styles.infoCardRight}>
            <Text style={styles.infoCardIcon}>💰</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {SCHEDULE.map((item, index) => (
            <View key={item.id} style={styles.timelineRow}>
              {/* Node + line column */}
              <View style={styles.nodeColumn}>
                {/* Dot */}
                {item.status === "past" && (
                  <View style={styles.dotPast}>
                    <Text style={styles.dotPastIcon}>✓</Text>
                  </View>
                )}
                {item.status === "current" && (
                  <View style={styles.dotCurrent}>
                    <View style={styles.dotCurrentInner} />
                  </View>
                )}
                {item.status === "future" && (
                  <View style={styles.dotFuture}>
                    <View style={styles.dotFutureInner} />
                  </View>
                )}

                {/* Connector line */}
                {index < SCHEDULE.length - 1 && <View style={styles.line} />}
              </View>

              {/* Card */}
              <View
                style={[
                  styles.card,
                  item.status === "current" && styles.cardCurrent,
                  item.pendingSwap && styles.cardWarning,
                ]}
              >
                <View style={styles.cardTop}>
                  {/* Avatar */}
                  <View
                    style={[styles.avatar, { backgroundColor: item.avatarBg }]}
                  >
                    <Text
                      style={[styles.avatarText, { color: item.avatarColor }]}
                    >
                      {item.initials}
                    </Text>
                  </View>

                  {/* Text */}
                  <View style={styles.cardTextBlock}>
                    <View style={styles.cardNameRow}>
                      <Text style={styles.cardName}>{item.name}</Text>
                      {item.isYou && (
                        <View style={styles.youBadge}>
                          <Text style={styles.youBadgeText}>YOU</Text>
                        </View>
                      )}
                      {item.pendingSwap && (
                        <View style={styles.swapBadge}>
                          <Text style={styles.swapBadgeText}>
                            Swap Requested
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardDesc}>{item.desc}</Text>

                    {item.status === "current" && (
                      <Text style={styles.currentHighlight}>
                        ✓ Receiving this cycle
                      </Text>
                    )}
                    {item.pendingSwap && item.swapDesc && (
                      <Text style={styles.swapDesc}>{item.swapDesc}</Text>
                    )}
                  </View>
                </View>

                {/* Swap action for future "you" slot (not already pending) */}
                {item.isYou &&
                  item.status === "future" &&
                  !item.pendingSwap &&
                  !swapRequested && (
                    <Pressable
                      style={styles.swapBtn}
                      onPress={() => setSwapRequested(true)}
                    >
                      <Text style={styles.swapBtnText}>Request slot swap</Text>
                    </Pressable>
                  )}
              </View>
            </View>
          ))}

          {/* Ghost — more members */}
          <View style={styles.ghostRow}>
            <View style={styles.nodeColumn}>
              <View style={styles.dotGhost} />
            </View>
            <View style={styles.ghostCard}>
              <Text style={styles.ghostText}>+ 7 more members</Text>
              <Text style={styles.ghostSubtext}>Scheduling for Apr – Oct</Text>
            </View>
          </View>
        </View>

        {/* Swap Positions Button */}
        <Pressable style={styles.swapPositionsBtn}>
          <Text style={styles.swapPositionsIcon}>↻ </Text>
          <Text style={styles.swapPositionsText}>Swap positions</Text>
        </Pressable>

        {/* Full Cycle History */}
        <Pressable style={styles.historyLink}>
          <Text style={styles.historyLinkText}>Full cycle history</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3.5],
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
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing[2],
  },
  headerSpacer: { width: 30 },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[12],
  },

  cycleLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: Spacing[3.5],
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing[5],
    marginBottom: Spacing[8],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoCardLeft: {},
  infoCardAmount: {
    color: Colors.textInverse,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1.5],
  },
  infoCardRow: { flexDirection: "row", alignItems: "center" },
  infoCardLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  infoCardValue: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  infoCardRight: {},
  infoCardIcon: { fontSize: 32, opacity: 0.6 },

  // Timeline
  timeline: { marginBottom: Spacing[7] },

  timelineRow: {
    flexDirection: "row",
    marginBottom: Spacing[5],
  },

  nodeColumn: {
    width: 32,
    alignItems: "center",
  },

  // Dots
  dotPast: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  dotPastIcon: {
    color: Colors.textInverse,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  dotCurrent: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentLight,
    borderWidth: 2.5,
    borderColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  dotCurrentInner: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.warning,
  },

  dotFuture: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  dotFutureInner: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
  },

  dotGhost: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
  },

  // Connector line
  line: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 2,
    marginBottom: -18,
  },

  // Cards
  card: {
    flex: 1,
    marginLeft: Spacing[3.5],
    marginBottom: Spacing[1],
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    padding: Spacing[3.5],
    ...Shadow.xs,
  },
  cardCurrent: {
    borderColor: Colors.textInverseSoft,
    backgroundColor: Colors.primaryLight,
  },
  cardWarning: {
    borderColor: Colors.warningLight,
    backgroundColor: Colors.accentTint,
  },

  cardTop: { flexDirection: "row", alignItems: "flex-start" },

  avatar: {
    width: 40,
    height: 40,
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

  cardTextBlock: { flex: 1 },

  cardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: Spacing[1],
  },
  cardName: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  youBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing[1.5],
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  youBadgeText: {
    color: Colors.successDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  swapBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing[1.5],
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  swapBadgeText: {
    color: Colors.warningDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  cardDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 18,
  },

  currentHighlight: {
    color: Colors.success,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginTop: Spacing[1.5],
  },
  swapDesc: {
    color: Colors.warning,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginTop: Spacing[1],
  },

  swapBtn: {
    marginTop: Spacing[3],
    alignSelf: "flex-start",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    paddingHorizontal: Spacing[3.5],
    paddingVertical: Spacing[2],
    borderRadius: Radius.badge,
  },
  swapBtnText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Ghost row
  ghostRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing[1],
  },
  ghostCard: { marginLeft: Spacing[3.5] },
  ghostText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  ghostSubtext: {
    color: Colors.borderStrong,
    fontSize: FontSize.xxs,
    marginTop: 2,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // Swap positions button
  swapPositionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    marginBottom: Spacing[5],
    backgroundColor: Colors.surface,
  },
  swapPositionsIcon: { color: Colors.primary, fontSize: FontSize.xl },
  swapPositionsText: {
    color: Colors.primary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // History link
  historyLink: { alignItems: "center", paddingVertical: Spacing[2] },
  historyLinkText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
});
