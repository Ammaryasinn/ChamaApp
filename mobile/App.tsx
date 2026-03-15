import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

import AppNavigator from "./src/AppNavigator";

// Keep the splash screen visible while fonts are loading.
// Must be called before any rendering.
SplashScreen.preventAutoHideAsync();

export type AuthUser = {
  id: string;
  phoneNumber: string;
  fullName: string;
  isVerified: boolean;
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Once fonts are loaded (or failed — we'll fall back to system font),
      // hide the splash screen and let the app render.
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontError) {
      // Non-fatal — the app will still render using system font fallbacks
      // defined in typography.ts (SF Pro on iOS, Roboto on Android).
      console.warn(
        "[Hazina] Failed to load Plus Jakarta Sans fonts:",
        fontError,
      );
    }
  }, [fontError]);

  // Block render until fonts are ready (or have failed).
  // The splash screen stays visible during this time.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppNavigator />
    </View>
  );
}
