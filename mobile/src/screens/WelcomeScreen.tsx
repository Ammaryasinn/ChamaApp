import React from "react";
import { View, Text, Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
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

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={S.hero}>
        <HeroCircles />
        <Image source={require("../../assets/images/logo.png")} style={{ width: 220, height: 220, resizeMode: "contain", alignSelf: "center", marginBottom: 12 }} />
        <Text style={S.heroSub}>Let's get started. How would you like to use Hazina today?</Text>
      </View>

      {/* Content */}
      <View style={S.content}>
        
        {/* Create Card */}
        <TouchableOpacity 
          style={S.card} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate("ChamaType")}
        >
          <View style={[S.iconWrap, { backgroundColor: "#E8F7F4" }]}>
            <Feather name="plus" size={24} color={Colors.primary} />
          </View>
          <View style={S.cardBody}>
            <Text style={S.cardTitle}>Create a new chama</Text>
            <Text style={S.cardSub}>Start a bold new group. MGR, investment, welfare, or custom hybrid.</Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Join Card */}
        <TouchableOpacity 
          style={S.card} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate("JoinChama")}
        >
          <View style={[S.iconWrap, { backgroundColor: Colors.surfaceElevated }]}>
            <Feather name="log-in" size={24} color="#D97706" />
          </View>
          <View style={S.cardBody}>
            <Text style={S.cardTitle}>Join existing chama</Text>
            <Text style={S.cardSub}>Got an invite code? Enter it here to join your friends instantly.</Text>
          </View>
          <Feather name="chevron-right" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },

  // Hero
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40,
    overflow: "hidden", gap: 12,
  },
  circleTopRight: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.05)", top: -60, right: -60,
  },
  circleBottomLeft: {
    position: "absolute", width: 140, height: 140, borderRadius: 70,
    backgroundColor: "rgba(245,158,11,0.10)", bottom: -40, left: -30,
  },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 32, color: "#E8D6B5", fontWeight: "800", letterSpacing: -0.5 },
  heroSub:   { fontFamily: FontFamily.regular, fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 22, paddingRight: 40 },

  // Content
  content: {
    flex: 1, backgroundColor: "#F6F9F7",
    padding: 20, gap: 16,
  },
  
  card: {
    flexDirection: "row", alignItems: "center", gap: 16,
    backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: "#EBF1EF",
    padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  iconWrap: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: "center", justifyContent: "center",
  },
  cardBody: { flex: 1 },
  cardTitle: { fontFamily: FontFamily.extraBold, fontSize: 16, color: "#E8D6B5", fontWeight: "800", marginBottom: 4 },
  cardSub: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, lineHeight: 18 },

  skipBtn: { alignItems: "center", marginTop: 24, padding: 10 },
  skipText: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textSecondary, fontWeight: "700" },
});
