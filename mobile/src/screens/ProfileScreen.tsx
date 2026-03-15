import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
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

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("hazina.user").then((val) => {
      if (val) setUser(JSON.parse(val));
    });
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.clear();
    navigation.replace("Auth");
  };

  const avatarLetter = user?.fullName ? user.fullName[0].toUpperCase() : "U";
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const canGoBack = navigation.canGoBack();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Feather name="arrow-left" size={22} color={Colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.backBtnPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName || "Hazina User"}</Text>
          <Text style={styles.userPhone}>{user?.phoneNumber || ""}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified Member</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Active Chama</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>742</Text>
            <Text style={styles.statLabel}>Credit Score</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Months Active</Text>
          </View>
        </View>

        {/* Credit Score CTA */}
        <Pressable
          style={styles.creditCard}
          onPress={() => navigation.navigate("MemberCreditProfile")}
        >
          <View style={styles.creditCardLeft}>
            <Text style={styles.creditCardTitle}>Hazina Credit Score</Text>
            <Text style={styles.creditCardScore}>742</Text>
            <Text style={styles.creditCardDesc}>
              Good standing · Updated 2h ago
            </Text>
          </View>
          <View style={styles.creditCardRight}>
            <Text style={styles.creditCardArrow}>›</Text>
          </View>
        </Pressable>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>ACCOUNT</Text>

          <View style={styles.menuCard}>
            <Pressable style={styles.menuRow}>
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuLabel}>Edit Profile</Text>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuRow}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuLabel}>Notifications</Text>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuRow}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={styles.menuLabel}>Security & PIN</Text>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>CHAMA</Text>

          <View style={styles.menuCard}>
            <Pressable
              style={styles.menuRow}
              onPress={() => navigation.navigate("PremiumSubscription")}
            >
              <Text style={styles.menuIcon}>⭐</Text>
              <Text style={styles.menuLabel}>Upgrade to Premium</Text>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>FREE</Text>
              </View>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuRow}>
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuLabel}>Transaction History</Text>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable style={styles.menuRow}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuLabel}>Help & Support</Text>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Sign Out */}
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Log out of Hazina</Text>
        </Pressable>

        <Text style={styles.versionText}>Hazina v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnPlaceholder: {
    width: 38,
    height: 38,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    textAlign: "center",
    flex: 1,
  },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[7],
    paddingBottom: Spacing[12],
  },

  // Avatar
  avatarSection: { alignItems: "center", marginBottom: Spacing[7] },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[3.5],
    ...Shadow.fab,
  },
  avatarText: {
    color: Colors.textInverse,
    fontSize: FontSize["6xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  userPhone: {
    color: Colors.textSecondary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing[2.5],
  },
  verifiedBadge: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.successLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  verifiedText: {
    color: Colors.successDark,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing[5],
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing[1],
  },

  // Credit card
  creditCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.card,
    padding: Spacing[5],
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[7],
  },
  creditCardLeft: { flex: 1 },
  creditCardTitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
    marginBottom: Spacing[1.5],
  },
  creditCardScore: {
    color: Colors.textInverse,
    fontSize: FontSize["7xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 40,
    marginBottom: Spacing[1],
  },
  creditCardDesc: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  creditCardRight: { paddingLeft: Spacing[3] },
  creditCardArrow: {
    color: Colors.textInverseSoft,
    fontSize: FontSize["5xl"],
  },

  // Menu
  menuSection: { marginBottom: Spacing[5] },
  menuSectionTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: Spacing[2.5],
    marginLeft: Spacing[1],
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: "hidden",
    ...Shadow.xs,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  menuIcon: {
    fontSize: FontSize["2xl"],
    marginRight: Spacing[3.5],
    width: 28,
    textAlign: "center",
  },
  menuLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  menuChevron: { color: Colors.textMuted, fontSize: FontSize["3xl"] },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: 58,
  },

  premiumBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.md,
    marginRight: Spacing[2],
  },
  premiumBadgeText: {
    color: Colors.warningDark,
    fontSize: FontSize.micro,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // Sign out
  signOutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    backgroundColor: Colors.accentTint,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    alignItems: "center",
    marginBottom: Spacing[4],
    marginTop: Spacing[2],
  },
  signOutText: {
    color: Colors.warningDark,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  versionText: {
    color: Colors.borderStrong,
    fontSize: FontSize.xxs,
    textAlign: "center",
    marginTop: Spacing[2],
  },
});
