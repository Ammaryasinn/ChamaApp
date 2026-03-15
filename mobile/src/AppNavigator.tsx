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
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
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

// ─── Bold Earth tab icon + label ────────────────────────────────────────────

type TabIconName = React.ComponentProps<typeof Feather>["name"];

function TabIcon({
  icon,
  label,
  focused,
}: {
  icon: TabIconName;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={S.tabItem}>
      <Feather
        name={icon}
        size={22}
        color={focused ? Colors.primary : Colors.tabBarInactive}
      />
      <Text
        style={[
          S.tabLabel,
          focused ? S.tabLabelActive : S.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
      {focused && <View style={S.tabDot} />}
    </View>
  );
}

// ─── Main bottom-tab navigator ──────────────────────────────────────────────

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: S.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="home" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Members"
        component={MembersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="users" label="Members" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Loans"
        component={GroupLoanScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="dollar-sign" label="Loans" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Score"
        component={MemberCreditProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="star" label="Score" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="menu" label="More" focused={focused} />
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
        <Stack.Screen name="InvestmentSetup" component={InvestmentSetupScreen} />
        <Stack.Screen name="InvestmentDashboard" component={InvestmentDashboardScreen} />
        <Stack.Screen name="WelfareSetup" component={WelfareSetupScreen} />
        <Stack.Screen name="HybridConfig" component={HybridConfigScreen} />
        <Stack.Screen name="ContributionDay" component={ContributionDayScreen} />
        {/* Detail screens */}
        <Stack.Screen name="MemberCreditProfile" component={MemberCreditProfileScreen} />
        <Stack.Screen name="LoanEligibility" component={LoanEligibilityScreen} />
        <Stack.Screen name="BankLoanOffer" component={BankLoanOfferScreen} />
        <Stack.Screen name="Perks" component={PerksScreen} />
        <Stack.Screen name="MGRSchedule" component={MGRScheduleScreen} />
        <Stack.Screen name="GroupLoan" component={GroupLoanScreen} />
        <Stack.Screen name="Members" component={MembersScreen} />
        <Stack.Screen name="InviteMembers" component={InviteMembersScreen} />
        <Stack.Screen name="PremiumSubscription" component={PremiumSubscriptionScreen} />
        <Stack.Screen name="Settings" component={ProfileScreen} />
        <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.divider,
    borderTopWidth: 1,
    height: 68,
    paddingHorizontal: 0,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    gap: 3,
    minWidth: 56,
  },

  tabLabel: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: FontFamily.semiBold,
  },
  tabLabelInactive: {
    color: Colors.tabBarInactive,
  },

  // ● green dot below active label
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    marginTop: 1,
  },
});
