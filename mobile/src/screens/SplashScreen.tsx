import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, FontFamily } from "../theme";

export default function SplashScreen({ navigation }: any) {
  const logoScale = new Animated.Value(0.8);
  const logoOpacity = new Animated.Value(0);

  useEffect(() => {
    // Animate logo in
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // After 1.5 seconds, check for token and navigate
    const timer = setTimeout(async () => {
      try {
        const token = await AsyncStorage.getItem("hazina.accessToken");
        if (token) {
          // Returning user — go straight to the app
          navigation.replace("MainTabs");
        } else {
          // New user — go through auth
          navigation.replace("Auth");
        }
      } catch {
        navigation.replace("Auth");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={S.screen}>
      <StatusBar style="light" />

      {/* Background circles */}
      <View style={S.circleTR} />
      <View style={S.circleBL} />

      <Animated.View style={[S.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Image source={require("../../assets/images/logo.png")} style={{ width: 260, height: 260, resizeMode: "contain" }} />
      </Animated.View>

      <Text style={S.version}>v1.0</Text>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: "center", justifyContent: "center",
  },
  circleTR: {
    position: "absolute", width: 300, height: 300, borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.05)", top: -100, right: -100,
  },
  circleBL: {
    position: "absolute", width: 220, height: 220, borderRadius: 110,
    backgroundColor: "rgba(245,158,11,0.10)", bottom: -60, left: -60,
  },
  logoWrap: { alignItems: "center", gap: 12 },
  logo: {
    fontFamily: FontFamily.extraBold, fontSize: 56,
    fontWeight: "800", letterSpacing: -1,
  },
  tagline: {
    fontFamily: FontFamily.regular, fontSize: 14,
    color: "rgba(255,255,255,0.65)", letterSpacing: 0.3,
  },
  version: {
    position: "absolute", bottom: 40,
    fontFamily: FontFamily.regular, fontSize: 11,
    color: "rgba(255,255,255,0.3)",
  },
});
