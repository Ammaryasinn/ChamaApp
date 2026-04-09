import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";
import { useChamaContext, ChamaUI } from "../context/ChamaContext";

// ─────────────────────────────────────────────────────────────────────────────
//  Type badge colours
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_META: Record<
  string,
  { label: string; icon: React.ComponentProps<typeof Feather>["name"] }
> = {
  merry_go_round: { label: "MGR", icon: "rotate-cw" },
  investment: { label: "Investment", icon: "trending-up" },
  welfare: { label: "Welfare / Savings", icon: "heart" },
  hybrid: { label: "Hybrid", icon: "grid" },
  group_purchase: { label: "Group Purchase", icon: "shopping-bag" },
};

// ─────────────────────────────────────────────────────────────────────────────
//  Pill helpers
// ─────────────────────────────────────────────────────────────────────────────
function StatusPill({
  paid,
  pending,
  late,
}: {
  paid: number;
  pending: number;
  late: number;
}) {
  return (
    <View style={S.statusRow}>
      <View style={[S.pill, S.pillGreen]}>
        <Text style={[S.pillText, { color: "#065F46" }]}>{paid} paid</Text>
      </View>
      {pending > 0 && (
        <View style={[S.pill, S.pillAmber]}>
          <Text style={[S.pillText, { color: "#92400E" }]}>
            {pending} pending
          </Text>
        </View>
      )}
      {late > 0 && (
        <View style={[S.pill, S.pillRed]}>
          <Text style={[S.pillText, { color: "#991B1B" }]}>{late} late</Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Single chama card
// ─────────────────────────────────────────────────────────────────────────────
function ChamaCard({
  chama,
  isActive,
  onPress,
}: {
  chama: ChamaUI;
  isActive: boolean;
  onPress: () => void;
}) {
  const meta = TYPE_META[chama.chamaType] ?? TYPE_META.merry_go_round;

  return (
    <TouchableOpacity
      style={[
        S.card,
        isActive && { borderColor: chama.heroColor, borderWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Left accent bar */}
      <View style={[S.cardAccent, { backgroundColor: chama.heroColor }]} />

      <View style={S.cardBody}>
        {/* Top row */}
        <View style={S.cardTop}>
          <View style={[S.avatar, { backgroundColor: chama.heroColor }]}>
            <Text style={S.avatarText}>{chama.initials}</Text>
          </View>
          <View style={S.cardMeta}>
            <Text style={S.cardName} numberOfLines={1}>
              {chama.name}
            </Text>
            <View style={S.typeChip}>
              <Feather name={meta.icon} size={10} color={chama.heroColor} />
              <Text style={[S.typeChipText, { color: chama.heroColor }]}>
                {meta.label}
              </Text>
            </View>
          </View>
          {isActive && (
            <View style={[S.activeBadge, { backgroundColor: chama.heroColor }]}>
              <Text style={S.activeBadgeText}>ACTIVE</Text>
            </View>
          )}
        </View>

        {/* Balance */}
        <View style={S.balanceRow}>
          <View>
            <Text style={S.balanceLabel}>BALANCE</Text>
            <Text style={S.balanceVal}>{chama.balance}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={S.balanceLabel}>MEMBERS</Text>
            <Text style={S.membersVal}>{chama.members}</Text>
          </View>
        </View>

        {/* Status pills */}
        {chama.statusPill && (
          <StatusPill
            paid={chama.statusPill.paid}
            pending={chama.statusPill.pending}
            late={chama.statusPill.late}
          />
        )}

        {/* Role badge */}
        <View style={S.roleRow}>
          <View style={S.rolePill}>
            <Feather name="shield" size={10} color={Colors.textMuted} />
            <Text style={S.rolePillText}>{chama.userRole.toUpperCase()}</Text>
          </View>
          <View style={S.arrowChip}>
            <Text style={[S.arrowChipText, { color: chama.heroColor }]}>
              Open
            </Text>
            <Feather name="chevron-right" size={13} color={chama.heroColor} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState({
  onCreate,
  onJoin,
}: {
  onCreate: () => void;
  onJoin: () => void;
}) {
  return (
    <View style={S.empty}>
      <View style={S.emptyIcon}>
        <Feather name="users" size={36} color={Colors.primary} />
      </View>
      <Text style={S.emptyTitle}>You have no chamas yet</Text>
      <Text style={S.emptySub}>
        You haven't joined or created a chama yet. Start your group savings
        journey today.
      </Text>
      <TouchableOpacity
        style={S.emptyBtn}
        onPress={onCreate}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={16} color={Colors.textPrimary} />
        <Text style={S.emptyBtnText}>Create a Chama</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={S.emptyBtnSecondary}
        onPress={onJoin}
        activeOpacity={0.85}
      >
        <Feather name="log-in" size={16} color={Colors.primary} />
        <Text style={S.emptyBtnSecondaryText}>Join with invite code</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function ChamasListScreen({ navigation }: any) {
  const {
    chamas,
    isLoadingChamas,
    activeChamaId,
    setActiveChama,
    refreshChamas,
  } = useChamaContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshChamas();
    setRefreshing(false);
  }, [refreshChamas]);

  const handleChamaPress = (chama: ChamaUI) => {
    setActiveChama(chama.id, chama.chamaType);
    // Navigate to the Home tab which shows the active chama dashboard
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={S.header}>
        <View>
          <Text style={S.headerTitle}>Chamas zangu</Text>
          <Text style={S.headerSub}>My groups · {chamas.length} active</Text>
        </View>
        <TouchableOpacity
          style={S.headerBtn}
          onPress={() => navigation.navigate("ChamaType")}
          activeOpacity={0.85}
        >
          <Feather name="plus" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoadingChamas ? (
        <View style={S.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={S.loadingText}>Loading chamas...</Text>
        </View>
      ) : chamas.length === 0 ? (
        <EmptyState
          onCreate={() => navigation.navigate("ChamaType")}
          onJoin={() => navigation.navigate("JoinChama")}
        />
      ) : (
        <ScrollView
          contentContainerStyle={S.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        >
          {chamas.map((chama) => (
            <ChamaCard
              key={chama.id}
              chama={chama}
              isActive={chama.id === activeChamaId}
              onPress={() => handleChamaPress(chama)}
            />
          ))}

          {/* Action CTAs */}
          <View style={S.ctaRow}>
            <TouchableOpacity
              style={S.ctaBtn}
              onPress={() => navigation.navigate("ChamaType")}
              activeOpacity={0.85}
            >
              <Feather name="plus-circle" size={18} color={Colors.primary} />
              <Text style={S.ctaBtnText}>Create new chama</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.ctaBtn, S.ctaBtnSecondary]}
              onPress={() => navigation.navigate("JoinChama")}
              activeOpacity={0.85}
            >
              <Feather name="log-in" size={18} color={Colors.textSecondary} />
              <Text style={[S.ctaBtnText, { color: Colors.textSecondary }]}>
                Join with code
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 22,
    color: "#E8D6B5",
    fontWeight: "800",
  },
  headerSub: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  list: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

  // ── Card ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardAccent: { width: 5 },
  cardBody: { flex: 1, padding: 16 },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: FontFamily.extraBold,
    fontSize: 16,
    color: "#E8D6B5",
    fontWeight: "800",
  },
  cardMeta: { flex: 1 },
  cardName: {
    fontFamily: FontFamily.extraBold,
    fontSize: 16,
    color: "#E8D6B5",
    fontWeight: "800",
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  typeChipText: { fontFamily: FontFamily.semiBold, fontSize: 11 },

  activeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activeBadgeText: {
    fontFamily: FontFamily.heading,
    fontSize: 9,
    color: "#E8D6B5",
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  balanceLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  balanceVal: {
    fontFamily: FontFamily.extraBold,
    fontSize: 18,
    color: "#E8D6B5",
    fontWeight: "800",
    marginTop: 2,
  },
  membersVal: {
    fontFamily: FontFamily.extraBold,
    fontSize: 18,
    color: "#E8D6B5",
    fontWeight: "800",
    marginTop: 2,
    textAlign: "right",
  },

  statusRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  pillGreen: { backgroundColor: "#D1FAE5" },
  pillAmber: { backgroundColor: "#FDE68A" },
  pillRed: { backgroundColor: "#FECACA" },
  pillText: { fontFamily: FontFamily.heading, fontSize: 10, fontWeight: "700" },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rolePillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
    color: Colors.textMuted,
  },
  arrowChip: { flexDirection: "row", alignItems: "center", gap: 2 },
  arrowChipText: { fontFamily: FontFamily.semiBold, fontSize: 13 },

  // ── CTAs ─────────────────────────────────────────────────────────────────
  ctaRow: { gap: 10, marginTop: 8 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#E8F7F4",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#A8D8CF",
    borderStyle: "dashed",
    paddingVertical: 16,
  },
  ctaBtnSecondary: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  ctaBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "700",
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F7F4",
    borderWidth: 1.5,
    borderColor: "#A8D8CF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 22,
    color: "#E8D6B5",
    fontWeight: "800",
    textAlign: "center",
  },
  emptySub: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 21,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyBtnText: {
    fontFamily: FontFamily.heading,
    fontSize: 15,
    color: "#E8D6B5",
    fontWeight: "700",
  },
  emptyBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E8F7F4",
    borderRadius: Radius.button,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "#A8D8CF",
  },
  emptyBtnSecondaryText: {
    fontFamily: FontFamily.heading,
    fontSize: 15,
    color: Colors.primary,
    fontWeight: "700",
  },

  // ── Misc ────────────────────────────────────────────────────────────────
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textMuted,
  },
});
