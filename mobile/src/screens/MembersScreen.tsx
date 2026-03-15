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
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const ALL_MEMBERS = [
  {
    id: "1",
    initials: "WK",
    name: "Wanjiru Kamau",
    role: "chairperson",
    joined: "Jan 2023",
    contributed: 84000,
    status: "active",
    avatarBg: "#D1FAE5",
    avatarColor: "#065F46",
  },
  {
    id: "2",
    initials: "JD",
    name: "Julie Doe",
    role: "treasurer",
    joined: "Mar 2023",
    contributed: 72000,
    status: "active",
    avatarBg: "#DBEAFE",
    avatarColor: "#1D4ED8",
  },
  {
    id: "3",
    initials: "DK",
    name: "David Kinyua",
    role: "member",
    joined: "Jun 2023",
    contributed: 60000,
    status: "active",
    avatarBg: "#F3E8FF",
    avatarColor: "#7C3AED",
  },
  {
    id: "4",
    initials: "SW",
    name: "Sarah Wangari",
    role: "member",
    joined: "Jun 2023",
    contributed: 55000,
    status: "late",
    avatarBg: "#FEF3C7",
    avatarColor: "#92400E",
  },
  {
    id: "5",
    initials: "AO",
    name: "Alex Otieno",
    role: "member",
    joined: "Aug 2023",
    contributed: 48000,
    status: "active",
    avatarBg: "#FCE7F3",
    avatarColor: "#9D174D",
  },
  {
    id: "6",
    initials: "GW",
    name: "Grace Wambui",
    role: "member",
    joined: "Sep 2023",
    contributed: 42000,
    status: "active",
    avatarBg: "#ECFDF5",
    avatarColor: "#059669",
  },
  {
    id: "7",
    initials: "MO",
    name: "Michael Okoth",
    role: "member",
    joined: "Nov 2023",
    contributed: 36000,
    status: "late",
    avatarBg: "#FEE2E2",
    avatarColor: "#DC2626",
  },
  {
    id: "8",
    initials: "CN",
    name: "Catherine Njeri",
    role: "member",
    joined: "Jan 2024",
    contributed: 30000,
    status: "active",
    avatarBg: "#FFF7ED",
    avatarColor: "#C2410C",
  },
  {
    id: "9",
    initials: "PK",
    name: "Peter Kamau",
    role: "member",
    joined: "Mar 2024",
    contributed: 24000,
    status: "active",
    avatarBg: "#F0FDF4",
    avatarColor: "#166534",
  },
  {
    id: "10",
    initials: "AM",
    name: "Alice Mwangi",
    role: "secretary",
    joined: "May 2024",
    contributed: 18000,
    status: "active",
    avatarBg: "#EFF6FF",
    avatarColor: "#1E40AF",
  },
  {
    id: "11",
    initials: "JM",
    name: "John Musyoka",
    role: "member",
    joined: "Jul 2024",
    contributed: 12000,
    status: "active",
    avatarBg: "#F5F3FF",
    avatarColor: "#5B21B6",
  },
  {
    id: "12",
    initials: "MN",
    name: "Mary Njoroge",
    role: "member",
    joined: "Sep 2024",
    contributed: 6000,
    status: "active",
    avatarBg: "#FDF2F8",
    avatarColor: "#9D174D",
  },
];

const FILTERS = ["All", "Active", "Late", "Admins"] as const;
type Filter = (typeof FILTERS)[number];

const ROLE_LABELS: Record<string, string> = {
  chairperson: "CHAIRPERSON",
  treasurer: "TREASURER",
  secretary: "SECRETARY",
  member: "MEMBER",
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  chairperson: { bg: "#FEF3C7", text: "#92400E" },
  treasurer: { bg: "#ECFDF5", text: "#065F46" },
  secretary: { bg: "#EFF6FF", text: "#1E40AF" },
  member: { bg: "#F3F4F6", text: "#374151" },
};

export default function MembersScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filtered = ALL_MEMBERS.filter((m) => {
    const matchesSearch =
      search.trim() === "" ||
      m.name.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Active" && m.status === "active") ||
      (activeFilter === "Late" && m.status === "late") ||
      (activeFilter === "Admins" &&
        ["chairperson", "treasurer", "secretary"].includes(m.role));

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Members</Text>
          <Text style={styles.headerSubtitle}>
            {ALL_MEMBERS.length} members
          </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search members..."
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            style={styles.filterTab}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === f && styles.filterTabTextActive,
              ]}
            >
              {f}
            </Text>
            {activeFilter === f && <View style={styles.filterTabUnderline} />}
          </Pressable>
        ))}
      </ScrollView>

      {/* Member list */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No members found</Text>
            <Text style={styles.emptyDesc}>
              Try a different search or filter.
            </Text>
          </View>
        ) : (
          <View style={styles.memberList}>
            {filtered.map((m, i) => {
              const roleStyle = ROLE_COLORS[m.role] || ROLE_COLORS.member;
              return (
                <View key={m.id}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.memberRow,
                      pressed && styles.memberRowPressed,
                    ]}
                    onPress={() => navigation.navigate("MemberCreditProfile")}
                  >
                    {/* Avatar */}
                    <View
                      style={[styles.avatar, { backgroundColor: m.avatarBg }]}
                    >
                      <Text
                        style={[styles.avatarText, { color: m.avatarColor }]}
                      >
                        {m.initials}
                      </Text>
                    </View>

                    {/* Info */}
                    <View style={styles.memberInfo}>
                      <View style={styles.memberNameRow}>
                        <Text style={styles.memberName}>{m.name}</Text>
                        {/* Status dot */}
                        <View
                          style={[
                            styles.statusDot,
                            m.status === "active"
                              ? styles.statusDotActive
                              : styles.statusDotLate,
                          ]}
                        />
                      </View>
                      <View style={styles.memberMetaRow}>
                        <View
                          style={[
                            styles.roleBadge,
                            { backgroundColor: roleStyle.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.roleBadgeText,
                              { color: roleStyle.text },
                            ]}
                          >
                            {ROLE_LABELS[m.role]}
                          </Text>
                        </View>
                        <Text style={styles.memberJoined}>
                          · Since {m.joined}
                        </Text>
                      </View>
                      <Text style={styles.memberContributed}>
                        Ksh {m.contributed.toLocaleString()} contributed
                      </Text>
                    </View>

                    {/* Chevron */}
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>

                  {i < filtered.length - 1 && (
                    <View style={styles.rowDivider} />
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Bottom padding for FAB */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* FAB — Invite */}
      <View style={styles.fabWrapper}>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.88 }]}
          onPress={() => navigation.navigate("InviteMembers")}
        >
          <Text style={styles.fabText}>+ Invite member</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: 14,
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
  headerCenter: { alignItems: "center" },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxs,
    marginTop: 1,
  },
  headerSpacer: { width: 30 },

  // Search
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing[4],
    marginTop: 14,
    marginBottom: Spacing[1],
    borderRadius: Radius.button,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: Spacing[3],
  },
  searchIcon: { fontSize: FontSize.lg, marginRight: Spacing[2.5] },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
  },
  clearBtn: { padding: Spacing[1] },
  clearBtnText: { color: Colors.textMuted, fontSize: FontSize.base },

  // Filter bar
  filterBar: { maxHeight: 52, backgroundColor: Colors.surface },
  filterBarContent: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[1],
    alignItems: "center",
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: "relative",
    alignItems: "center",
  },
  filterTabText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  filterTabTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  filterTabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2.5,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: 14,
  },
  memberList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: "hidden",
    ...Shadow.sm,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: 14,
    backgroundColor: Colors.surface,
  },
  memberRowPressed: { backgroundColor: Colors.background },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[4],
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  memberInfo: { flex: 1 },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: 5,
  },
  memberName: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  statusDotActive: { backgroundColor: Colors.success },
  statusDotLate: { backgroundColor: Colors.accent },

  memberMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
    marginBottom: Spacing[1],
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  roleBadgeText: {
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.3,
  },
  memberJoined: { color: Colors.textMuted, fontSize: FontSize.xxs },
  memberContributed: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
  },

  chevron: { color: Colors.borderStrong, fontSize: FontSize["4xl"] },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyIcon: { fontSize: 40, marginBottom: Spacing[4] },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing[2],
  },
  emptyDesc: { color: Colors.textMuted, fontSize: FontSize.base },

  // FAB
  fabWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[6],
    paddingTop: Spacing[3],
    backgroundColor: "rgba(246,249,247,0.95)",
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  fab: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 17,
    alignItems: "center",
    ...Shadow.fab,
  },
  fabText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
});
