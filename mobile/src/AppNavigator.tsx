import React from "react";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "./theme";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  type GestureResponderEvent,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  type BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";

import AuthScreen from "./screens/AuthScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ContributionDayScreen from "./screens/ContributionDayScreen";
import MGRScheduleScreen from "./screens/MGRScheduleScreen";
import MGRSetupScreen from "./screens/MGRSetupScreen";
import MemberCreditProfileScreen from "./screens/MemberCreditProfileScreen";
import BankLoanOfferScreen from "./screens/BankLoanOfferScreen";
import ChamaTypeScreen from "./screens/ChamaTypeScreen";
import HybridConfigScreen from "./screens/HybridConfigScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PlaceholderScreen from "./screens/PlaceholderScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ChamaDetailsScreen from "./screens/ChamaDetailsScreen";
import InviteMembersScreen from "./screens/InviteMembersScreen";
import PremiumSubscriptionScreen from "./screens/PremiumSubscriptionScreen";
import GroupLoanScreen from "./screens/GroupLoanScreen";
import MembersScreen from "./screens/MembersScreen";
import InvestmentSetupScreen from "./screens/InvestmentSetupScreen";
import InvestmentDashboardScreen from "./screens/InvestmentDashboardScreen";
import WelfareSetupScreen from "./screens/WelfareSetupScreen";
import LoanEligibilityScreen from "./screens/LoanEligibilityScreen";
import PerksScreen from "./screens/PerksScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── FAB centre button ──────────────────────────────────────────────────────

function CenterTabButton({ onPress }: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress as (e: GestureResponderEvent) => void}
      activeOpacity={0.82}
      style={styles.centerWrapper}
      accessibilityRole="button"
      accessibilityLabel="Create new chama"
    >
      <View style={styles.centerCircle}>
        {/* Render a plain "+" so it stays white regardless of tint */}
        <Text style={styles.centerIcon}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main bottom-tab navigator ──────────────────────────────────────────────

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* 1 – Home */}
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Feather name={focused ? "home" : "home"} size={21} color={color} />
          ),
        }}
      />

      {/* 2 – Perks */}
      <Tab.Screen
        name="Perks"
        component={PerksScreen}
        options={{
          tabBarLabel: "Perks",
          tabBarIcon: ({ color }) => (
            <Feather name="gift" size={21} color={color} />
          ),
        }}
      />

      {/* 3 – Centre FAB (Create) */}
      <Tab.Screen
        name="Create"
        component={ChamaTypeScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => <CenterTabButton {...props} />,
        }}
      />

      {/* 4 – Loans */}
      <Tab.Screen
        name="Loans"
        component={MemberCreditProfileScreen}
        options={{
          tabBarLabel: "Credit",
          tabBarIcon: ({ color }) => (
            <Feather name="trending-up" size={21} color={color} />
          ),
        }}
      />

      {/* 5 – Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={21} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root stack navigator ───────────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        {/* Chama creation flow */}
        <Stack.Screen name="ChamaType" component={ChamaTypeScreen} />
        <Stack.Screen name="ChamaDetails" component={ChamaDetailsScreen} />
        {/* Chama type-specific setup screens */}
        <Stack.Screen name="MGRSetup" component={MGRSetupScreen} />
        <Stack.Screen
          name="InvestmentSetup"
          component={InvestmentSetupScreen}
        />
        <Stack.Screen
          name="InvestmentDashboard"
          component={InvestmentDashboardScreen}
        />
        <Stack.Screen name="WelfareSetup" component={WelfareSetupScreen} />
        <Stack.Screen name="HybridConfig" component={HybridConfigScreen} />
        <Stack.Screen
          name="ContributionDay"
          component={ContributionDayScreen}
        />
        {/* Detail screens reachable from tabs or dashboard */}
        <Stack.Screen
          name="MemberCreditProfile"
          component={MemberCreditProfileScreen}
        />
        <Stack.Screen
          name="LoanEligibility"
          component={LoanEligibilityScreen}
        />
        <Stack.Screen name="BankLoanOffer" component={BankLoanOfferScreen} />
        <Stack.Screen name="Perks" component={PerksScreen} />
        <Stack.Screen name="MGRSchedule" component={MGRScheduleScreen} />
        <Stack.Screen name="GroupLoan" component={GroupLoanScreen} />
        <Stack.Screen name="Members" component={MembersScreen} />
        <Stack.Screen name="InviteMembers" component={InviteMembersScreen} />
        <Stack.Screen
          name="PremiumSubscription"
          component={PremiumSubscriptionScreen}
        />
        {/* Alias so navigation.navigate("Settings") from Dashboard works */}
        <Stack.Screen name="Settings" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Tab bar container
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 68,
    paddingTop: Spacing[2],
    paddingBottom: Spacing[3],
  },

  // Label beneath each regular tab icon
  tabLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    marginTop: 2,
  },

  // Outer touchable wrapper for the FAB — lifted above the bar
  centerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // Push the circle upward so it floats above the tab bar
    marginTop: -28,
  },

  // The green circle itself
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.fab,
  },

  // White "+" glyph inside the circle
  centerIcon: {
    color: Colors.textInverse,
    fontFamily: FontFamily.regular,
    fontSize: 34,
    fontWeight: FontWeight.regular,
    // Optical centre correction
    lineHeight: 38,
    marginTop: -2,
  },
});
