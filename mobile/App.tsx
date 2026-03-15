import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Sora_700Bold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

import AppNavigator from "./src/AppNavigator";

// Keep the splash screen visible while fonts are loading.
SplashScreen.preventAutoHideAsync();

export type AuthUser = {
  id: string;
  phoneNumber: string;
  fullName: string;
  isVerified: boolean;
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Sora_700Bold,
    Sora_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontError) {
      console.warn(
        "[Hazina] Failed to load Sora / DM Sans fonts:",
        fontError,
      );
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppNavigator />
    </View>
  );
}
