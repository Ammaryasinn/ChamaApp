import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily } from "../theme";
import { useChamaContext } from "../context/ChamaContext";
import { notificationApi } from "../lib/api";

const TYPE_ICON: Record<
  string,
  {
    icon: React.ComponentProps<typeof Feather>["name"];
    bg: string;
    color: string;
  }
> = {
  announcement: { icon: "bell", bg: Colors.surfaceElevated, color: Colors.accent },
  payment: { icon: "check-circle", bg: "#ECFDF5", color: "#059669" },
  loan: { icon: "dollar-sign", bg: Colors.surfaceElevated, color: Colors.primary },
  vote: { icon: "alert-circle", bg: "#FFFBEB", color: "#D97706" },
  system: { icon: "star", bg: Colors.surfaceElevated, color: Colors.accent },
  reminder: { icon: "clock", bg: "#FFF7ED", color: "#EA580C" },
  alert: { icon: "alert-triangle", bg: "#FEF2F2", color: "#DC2626" },
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function NotificationsScreen({ navigation }: any) {
  const { activeChamaColor } = useChamaContext();
  const heroBg = activeChamaColor || Colors.primary;

  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifs();
  }, []);

  const loadNotifs = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getMyNotifications();
      setNotifs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = () =>
    setNotifs((n) => n.map((x) => ({ ...x, isRead: true })));
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={[S.hero, { backgroundColor: heroBg }]}>
        <View style={S.circleTR} />
        <View style={S.heroNav}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={S.backBtn}
            hitSlop={12}
          >
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>
          <Text style={S.heroTitle}>Notifications</Text>
          <View style={{ width: 28 }} />
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead}>
            <Text style={S.markAll}>
              Mark all as read · {unreadCount} unread
            </Text>
          </Pressable>
        )}
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={S.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={heroBg}
            style={{ marginTop: 40 }}
          />
        ) : notifs.length === 0 ? (
          <Text
            style={{
              textAlign: "center",
              marginTop: 40,
              color: Colors.textMuted,
            }}
          >
            No notifications yet.
          </Text>
        ) : (
          notifs.map((n) => {
            const ic = TYPE_ICON[n.type] || TYPE_ICON["system"];
            return (
              <TouchableOpacity
                key={n.id}
                style={[S.card, !n.isRead && S.cardUnread]}
                activeOpacity={0.8}
                onPress={() =>
                  setNotifs((prev) =>
                    prev.map((x) =>
                      x.id === n.id ? { ...x, isRead: true } : x,
                    ),
                  )
                }
              >
                <View style={[S.icon, { backgroundColor: ic.bg }]}>
                  <Feather name={ic.icon} size={18} color={ic.color} />
                </View>
                <View style={S.meta}>
                  <Text style={[S.title, !n.isRead && S.titleUnread]}>
                    {n.title}
                  </Text>
                  <Text style={S.body}>{n.message}</Text>
                  <Text style={S.time}>
                    {n.chama?.name ? `${n.chama.name} · ` : ""}
                    {formatTimeAgo(n.createdAt)}
                  </Text>
                </View>
                {!n.isRead && (
                  <View style={[S.dot, { backgroundColor: heroBg }]} />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },
  circleTR: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -50,
    right: -50,
  },
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    overflow: "hidden",
    gap: 10,
  },
  heroNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: 20,
    color: "#E8D6B5",
    fontWeight: "800",
  },
  markAll: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textDecorationLine: "underline",
  },

  scroll: {
    backgroundColor: "#F6F9F7",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EBF1EF",
    padding: 14,
    marginBottom: 10,
  },
  cardUnread: {
    borderColor: Colors.primary + "40",
    backgroundColor: "#F0FBF8",
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  meta: { flex: 1, gap: 3 },
  title: {
    fontFamily: FontFamily.heading,
    fontSize: 14,
    color: "#E8D6B5",
    fontWeight: "600",
  },
  titleUnread: { fontFamily: FontFamily.extraBold, fontWeight: "800" },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
});
