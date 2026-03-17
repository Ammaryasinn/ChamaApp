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
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { apiClient } from "../api/client";
import { useChamaContext } from "../context/ChamaContext";
import { MY_CHAMAS } from "./DashboardScreen";

const MOCK_MEMBERS = [
  {
    id: "1",
    initials: "JD",
    name: "Julie Doe",
    avatarBg: "#D1FAE5",
    avatarColor: "#065F46",
    status: "paid",
    amount: 5000,
    cycleInfo: "Cycle 1 | Received Ksh 5,000",
  },
  {
    id: "2",
    initials: "DK",
    name: "David Kinyua",
    avatarBg: "#DBEAFE",
    avatarColor: "#1D4ED8",
    status: "pending",
    amount: 5000,
    cycleInfo: "Cycle 2 | Upcoming",
  },
  {
    id: "3",
    initials: "SN",
    name: "Sarah Njeri",
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
    status: "late",
    amount: 5000,
    penalty: 200,
    cycleInfo: "Cycle 3 | Late",
  },
  {
    id: "4",
    initials: "AO",
    name: "Alex Otieno",
    avatarBg: "#F3E8FF",
    avatarColor: "#7C3AED",
    status: "paid",
    amount: 5000,
    cycleInfo: "Cycle 4 | Paid",
  },
  {
    id: "5",
    initials: "GW",
    name: "Grace Wambui",
    avatarBg: "#FCE7F3",
    avatarColor: "#9D174D",
    status: "pending",
    amount: 5000,
    cycleInfo: "Cycle 5 | Upcoming",
  },
];

function StatusBadge({
  status,
  penalty,
}: {
  status: string;
  penalty?: number;
}) {
  if (status === "paid") {
    return (
      <View style={styles.badgePaid}>
        <Text style={styles.badgePaidText}>PAID</Text>
      </View>
    );
  }
  if (status === "late") {
    return (
      <View style={styles.badgeLate}>
        <Text style={styles.badgeLateText}>LATE +KSH{penalty || 200}</Text>
      </View>
    );
  }
  if (status === "stk_sent") {
    return (
      <View style={styles.badgeStk}>
        <Text style={styles.badgeStkText}>STK SENT</Text>
      </View>
    );
  }
  return (
    <View style={styles.badgePending}>
      <Text style={styles.badgePendingText}>PENDING</Text>
    </View>
  );
}

export default function ContributionDayScreen({ navigation }: any) {
  const { activeChamaId } = useChamaContext();
  const chama = MY_CHAMAS.find((c: any) => c.id === activeChamaId) || MY_CHAMAS[0];
  const themeColor = chama.heroColor;

  const [members, setMembers] = useState<any[]>(MOCK_MEMBERS);
  const [apiChama, setApiChama] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [collectingId, setCollectingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chamasRes = await apiClient.get("/chamas");
        if (chamasRes.data.length === 0) return;
        const activeChama = chamasRes.data[0];
        setApiChama(activeChama);

        const cyclesRes = await apiClient.get(
          `/chamas/${activeChama.id}/cycles`,
        );
        if (cyclesRes.data.length > 0) {
          const activeCycle = cyclesRes.data[0];
          const contRes = await apiClient.get(
            `/chamas/${activeChama.id}/cycles/${activeCycle.id}/contributions`,
          );
          if (contRes.data.length > 0) {
            setMembers(contRes.data);
          }
        }
      } catch {
        // fall back to mock data
      }
    };
    fetchData();
  }, []);

  const paidCount = members.filter((m) => m.status === "paid").length;
  const pendingCount = members.filter((m) => m.status !== "paid").length;
  const totalExpected = members.length * 5000;
  const totalCollected = paidCount * 5000;
  const progressPct =
    totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  const handleCollect = async (member: any) => {
    if (!apiChama) return;
    setCollectingId(member.id);
    try {
      await apiClient.post("/mpesa/stkpush", {
        phoneNumber: member.phoneNumber || "+254700000000",
        amount: member.amount || 5000,
        chamaId: apiChama.id,
      });
      alert("STK Push sent! Ask the member to check their phone.");
    } catch {
      alert("Failed to send STK push. Please try again.");
    } finally {
      setCollectingId(null);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColor }]}>
      <StatusBar style="light" />

      {/* Dark Header */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Contribution day · 1 Feb 2025</Text>
          <Text style={styles.headerSubtitle}>
            Ksh 5,000 per member · {members.length} members expected
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: themeColor }]}>
          <Text style={styles.summaryAmount}>Ksh 5,000 per member</Text>
          <Text style={styles.summaryPotLabel}>
            Pot size this month:{" "}
            <Text style={styles.summaryPotValue}>
              Ksh {totalExpected.toLocaleString()}
            </Text>
          </Text>

          <View style={styles.pillRow}>
            <View style={styles.pillGreen}>
              <Text style={styles.pillGreenText}>
                ✓ {paidCount} paid this cycle
              </Text>
            </View>
            {pendingCount > 0 && (
              <View style={styles.pillAmber}>
                <Text style={styles.pillAmberText}>
                  ! {pendingCount} pending
                </Text>
              </View>
            )}
          </View>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, progressPct)}%` as any },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelLeft}>Cycle Progress</Text>
            <Text style={styles.progressLabelRight}>
              {Math.round(progressPct)}%
            </Text>
          </View>
        </View>

        {/* Collect Button */}
        <Pressable style={[styles.collectBtn, { backgroundColor: themeColor }]}>
          <Text style={styles.collectBtnText}>Collect via M-Pesa STK push</Text>
        </Pressable>

        {/* Member List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>THIS CYCLE — CONTRIBUTIONS</Text>
        </View>

        <View style={styles.memberList}>
          {members.map((member, index) => (
            <View key={member.id}>
              <View style={styles.memberRow}>
                {/* Avatar */}
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: member.avatarBg || "#D1FAE5" },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      { color: member.avatarColor || "#065F46" },
                    ]}
                  >
                    {member.initials ||
                      member.chamaMember?.user?.fullName
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ||
                      "MM"}
                  </Text>
                </View>

                {/* Info */}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {member.name ||
                      member.chamaMember?.user?.fullName ||
                      "Member"}
                  </Text>
                  <Text style={styles.memberCycleInfo}>
                    {member.cycleInfo ||
                      `Cycle ${index + 1} | ${member.status}`}
                  </Text>
                </View>

                {/* Right side */}
                <View style={styles.memberRight}>
                  {member.status === "pending" || member.status === "late" ? (
                    <Pressable
                      style={styles.collectSmallBtn}
                      onPress={() => handleCollect(member)}
                      disabled={collectingId === member.id}
                    >
                      {collectingId === member.id ? (
                        <ActivityIndicator color="#FFF" size="small" />
                      ) : (
                        <Text style={styles.collectSmallBtnText}>
                          Collect Ksh {(member.amount || 5000).toLocaleString()}
                        </Text>
                      )}
                    </Pressable>
                  ) : (
                    <StatusBadge
                      status={member.status}
                      penalty={member.penalty}
                    />
                  )}
                </View>
              </View>

              {index < members.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        {/* Mark Complete */}
        <Pressable style={[styles.markCompleteBtn, { borderColor: themeColor }]}>
          <Text style={[styles.markCompleteBtnText, { color: themeColor }]}>Mark collection complete</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surfaceDark },

  header: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[4.5],
    backgroundColor: Colors.surfaceDark,
  },
  backBtn: { marginBottom: Spacing[2.5] },
  backText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  headerTextBlock: {},
  headerTitle: {
    color: Colors.textInverse,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  headerSubtitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
  },

  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.sheet,
    borderTopRightRadius: Radius.sheet,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[12],
    minHeight: 600,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.card,
    padding: 22,
    marginBottom: Spacing[4],
  },
  summaryAmount: {
    color: Colors.textInverse,
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  summaryPotLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginBottom: Spacing[4.5],
  },
  summaryPotValue: {
    color: Colors.textInverse,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  pillRow: { flexDirection: "row", gap: Spacing[2], marginBottom: Spacing[4] },
  pillGreen: {
    backgroundColor: "#014A3D",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.full,
  },
  pillGreenText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  pillAmber: {
    backgroundColor: "rgba(245,179,66,0.18)",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  pillAmberText: {
    color: Colors.accentLight,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
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
  progressLabelLeft: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  progressLabelRight: {
    color: Colors.textInverse,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // Collect button
  collectBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    alignItems: "center",
    marginBottom: Spacing[7],
    ...Shadow.button,
  },
  collectBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // Section header
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
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[4],
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[3],
  },
  avatarText: {
    fontSize: FontSize.base,
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
  memberCycleInfo: {
    color: Colors.textMuted,
    fontSize: FontSize.xxs,
  },

  memberRight: { marginLeft: Spacing[2], alignItems: "flex-end" },

  // Badges
  badgePaid: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  badgePaidText: {
    color: Colors.successDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },

  badgeLate: {
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  badgeLateText: {
    color: Colors.warningDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },

  badgePending: {
    backgroundColor: Colors.divider,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  badgePendingText: {
    color: Colors.textSecondary,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },

  badgeStk: {
    backgroundColor: Colors.infoBg,
    borderWidth: 1,
    borderColor: Colors.infoLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: Radius.md,
  },
  badgeStkText: {
    color: Colors.info,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },

  // Collect small button
  collectSmallBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.badge,
    minWidth: 100,
    alignItems: "center",
  },
  collectSmallBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // Mark complete
  markCompleteBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  markCompleteBtnText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
});
