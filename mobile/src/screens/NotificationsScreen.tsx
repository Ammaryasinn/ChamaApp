import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily } from "../theme";
import { useChamaContext } from "../context/ChamaContext";

type NotifType = "payment" | "loan" | "vote" | "system" | "reminder";

interface Notif {
  id: string; type: NotifType; title: string;
  body: string; time: string; read: boolean;
}

const NOTIFS: Notif[] = [
  { id: "1", type: "payment",  title: "Contribution received",       body: "Akinyi Otieno paid Ksh 5,000 for March.",         time: "2 min ago",   read: false },
  { id: "2", type: "vote",     title: "Vote needed · Loan request",  body: "Kamau Otieno is requesting Ksh 15,000. 48 hrs.", time: "1 hr ago",    read: false },
  { id: "3", type: "reminder", title: "Contribution due tomorrow",   body: "March contribution of Ksh 5,000 is due Mar 17.", time: "3 hrs ago",   read: false },
  { id: "4", type: "loan",     title: "Loan approved",               body: "Your Ksh 20,000 request was approved by the group.", time: "Yesterday", read: true },
  { id: "5", type: "system",   title: "Bank loan unlocked 🎉",       body: "Your Hazina Score hit 742 — Co-op Bank offer ready.", time: "2 days ago", read: true },
  { id: "6", type: "payment",  title: "Late penalty applied",        body: "Jane Njeri incurred Ksh 200 penalty for Feb.",   time: "5 days ago",  read: true },
];

const TYPE_ICON: Record<NotifType, { icon: React.ComponentProps<typeof Feather>["name"]; bg: string; color: string }> = {
  payment:  { icon: "check-circle", bg: "#ECFDF5", color: "#059669" },
  loan:     { icon: "dollar-sign",  bg: "#EFF6FF", color: "#3B82F6" },
  vote:     { icon: "alert-circle", bg: "#FFFBEB", color: "#D97706" },
  system:   { icon: "star",         bg: "#F5F3FF", color: "#7C3AED" },
  reminder: { icon: "clock",        bg: "#FFF7ED", color: "#EA580C" },
};

export default function NotificationsScreen({ navigation }: any) {
  const { activeChamaColor } = useChamaContext();
  const heroBg = activeChamaColor || Colors.primary;

  const [notifs, setNotifs] = useState(NOTIFS);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={[S.hero, { backgroundColor: heroBg }]}>
        <View style={S.circleTR} />
        <View style={S.heroNav}>
          <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>
          <Text style={S.heroTitle}>Notifications</Text>
          <View style={{ width: 28 }} />
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead}>
            <Text style={S.markAll}>Mark all as read · {unreadCount} unread</Text>
          </Pressable>
        )}
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {notifs.map(n => {
          const ic = TYPE_ICON[n.type];
          return (
            <TouchableOpacity
              key={n.id}
              style={[S.card, !n.read && S.cardUnread]}
              activeOpacity={0.8}
              onPress={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            >
              <View style={[S.icon, { backgroundColor: ic.bg }]}>
                <Feather name={ic.icon} size={18} color={ic.color} />
              </View>
              <View style={S.meta}>
                <Text style={[S.title, !n.read && S.titleUnread]}>{n.title}</Text>
                <Text style={S.body}>{n.body}</Text>
                <Text style={S.time}>{n.time}</Text>
              </View>
              {!n.read && <View style={[S.dot, { backgroundColor: heroBg }]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },
  circleTR: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50 },
  hero: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, overflow: "hidden", gap: 10 },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 20, color: "#FFFFFF", fontWeight: "800" },
  markAll: { fontFamily: FontFamily.regular, fontSize: 12, color: "rgba(255,255,255,0.7)", textDecorationLine: "underline" },

  scroll: { backgroundColor: "#F6F9F7", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 },
  card: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#EBF1EF", padding: 14, marginBottom: 10 },
  cardUnread: { borderColor: Colors.primary + "40", backgroundColor: "#F0FBF8" },
  icon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 2 },
  meta: { flex: 1, gap: 3 },
  title: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "600" },
  titleUnread: { fontFamily: FontFamily.extraBold, fontWeight: "800" },
  body: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  time: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 6 },
});
