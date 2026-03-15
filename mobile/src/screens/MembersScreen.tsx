import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TextInput, TouchableOpacity, Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

function HeroCircles() {
  return (
    <>
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

type MemberStatus = "paid" | "pending" | "late";
interface Member {
  initials: string; name: string; role: string;
  status: MemberStatus; penaltyNote?: string; avatarColor: string;
}

const MEMBERS: Member[] = [
  { initials: "WK", name: "Wanjiru Kamau",  role: "Chairperson", status: "paid",    avatarColor: "#006D5B" },
  { initials: "AO", name: "Akinyi Otieno",  role: "Treasurer",   status: "paid",    avatarColor: "#3B82F6" },
  { initials: "MM", name: "Muthoni Mwangi", role: "Member",      status: "pending", avatarColor: "#7C3AED" },
  { initials: "JN", name: "Jane Njeri",     role: "Secretary",   status: "late",    penaltyNote: "+200",    avatarColor: "#E11D48" },
  { initials: "KO", name: "Kamau Otieno",   role: "Member",      status: "paid",    avatarColor: "#F59E0B" },
];

const STATUS_STYLE: Record<MemberStatus, { label: string; color: string }> = {
  paid:    { label: "Paid",    color: "#059669" },
  pending: { label: "Pending", color: "#D97706" },
  late:    { label: "Late",    color: "#DC2626" },
};

function MemberRow({ item, onPress }: { item: Member; onPress: () => void }) {
  const st = STATUS_STYLE[item.status];
  return (
    <Pressable style={S.memberRow} onPress={onPress}>
      <View style={[S.avatar, { backgroundColor: item.avatarColor }]}>
        <Text style={S.avatarText}>{item.initials}</Text>
      </View>
      <View style={S.memberMeta}>
        <Text style={S.memberName}>{item.name}</Text>
        <Text style={S.memberRole}>{item.role}</Text>
      </View>
      <Text style={[S.memberStatus, { color: st.color }]}>
        {item.status === "late" && item.penaltyNote
          ? `Late +${item.penaltyNote}`
          : st.label}
      </Text>
    </Pressable>
  );
}

export default function MembersScreen({ navigation }: any) {
  const [query, setQuery] = useState("");
  const filtered = MEMBERS.filter(
    (m) => m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={S.hero}>
        <HeroCircles />
        <View style={S.heroNav}>
          <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>
          <Text style={S.heroTitle}>Members</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={S.heroSub}>Mama Mboga Group · 20 members</Text>

        <View style={S.pill}>
          <Text style={S.pillPaid}>14 paid</Text>
          <Text style={S.pillDot}>·</Text>
          <Text style={S.pillPending}>4 pending</Text>
          <Text style={S.pillDot}>·</Text>
          <Text style={S.pillLate}>2 late</Text>
        </View>
      </View>

      {/* Body */}
      <View style={S.body}>
        {/* Search */}
        <View style={S.searchWrap}>
          <Feather name="search" size={16} color={Colors.textMuted} style={S.searchIcon} />
          <TextInput
            style={S.searchInput}
            placeholder="Search members..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <MemberRow item={item} onPress={() => navigation.navigate("MemberCreditProfile")} />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
          ItemSeparatorComponent={() => <View style={S.sep} />}
          scrollEnabled={false}
        />
      </View>

      {/* Bottom CTA */}
      <View style={S.footer}>
        <TouchableOpacity style={S.collectBtn} activeOpacity={0.85}>
          <Feather name="credit-card" size={18} color="#FFFFFF" />
          <Text style={S.collectBtnText}>Collect via M-Pesa</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },
  circleTopRight: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50 },
  circleBottomLeft: { position: "absolute", width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(245,158,11,0.10)", bottom: -40, left: -30 },

  hero: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, overflow: "hidden", gap: 8 },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 20, color: "#FFFFFF", fontWeight: "800" },
  heroSub: { fontFamily: FontFamily.regular, fontSize: 12, color: "rgba(255,255,255,0.65)" },

  pill: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  pillPaid:    { fontFamily: FontFamily.heading, fontSize: 11, color: "#FFFFFF",  fontWeight: "700" },
  pillPending: { fontFamily: FontFamily.heading, fontSize: 11, color: "#F59E0B",  fontWeight: "700" },
  pillLate:    { fontFamily: FontFamily.heading, fontSize: 11, color: "#FCA5A5",  fontWeight: "700" },
  pillDot:     { color: "rgba(255,255,255,0.4)", fontSize: 14 },

  body: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: 16 },

  searchWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#F6F9F7", borderRadius: 10, borderWidth: 1, borderColor: "#EBF1EF", paddingHorizontal: 12, height: 44, marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontFamily: FontFamily.regular, fontSize: 14, color: Colors.textPrimary },

  memberRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#FFFFFF", fontWeight: "700" },
  memberMeta: { flex: 1 },
  memberName: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "700" },
  memberRole: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  memberStatus: { fontFamily: FontFamily.heading, fontSize: 13, fontWeight: "700" },
  sep: { height: 1, backgroundColor: "#F6F9F7" },

  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#EBF1EF", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  collectBtn: { backgroundColor: Colors.primary, borderRadius: Radius.button, height: 50, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  collectBtnText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
