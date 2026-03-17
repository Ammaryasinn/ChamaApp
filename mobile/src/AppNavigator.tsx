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
import WelcomeScreen from "./screens/WelcomeScreen";
import JoinChamaScreen from "./screens/JoinChamaScreen";
import GroupPurchaseSetupScreen from "./screens/GroupPurchaseSetupScreen";
import SplashScreen from "./screens/SplashScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import SettingsScreen from "./screens/SettingsScreen";

// ── Context & New Screens ──
import { ChamaProvider, useChamaContext } from "./context/ChamaContext";
import PortfolioScreen from "./screens/PortfolioScreen";
import FundsScreen from "./screens/FundsScreen";
import DealsScreen from "./screens/DealsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Bold Earth tab icon + label ────────────────────────────────────────────

type TabIconName = React.ComponentProps<typeof Feather>["name"];

function TabIcon({
  icon,
  label,
  focused,
  activeColor,
}: {
  icon: TabIconName;
  label: string;
  focused: boolean;
  activeColor: string;
}) {
  return (
    <View style={S.tabItem}>
      <Feather
        name={icon}
        size={22}
        color={focused ? activeColor : Colors.tabBarInactive}
      />
      <Text
        style={[
          S.tabLabel,
          focused ? { color: activeColor, fontFamily: FontFamily.semiBold } : S.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
      {focused && <View style={[S.tabDot, { backgroundColor: activeColor }]} />}
    </View>
  );
}

// ─── Main bottom-tab navigator ──────────────────────────────────────────────

function MainTabNavigator() {
  const { activeChamaType, activeChamaColor } = useChamaContext();
  const themeColor = activeChamaColor || Colors.primary;

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
            <TabIcon icon="home" label="Home" focused={focused} activeColor={themeColor} />
          ),
        }}
      />
      <Tab.Screen
        name="Members"
        component={MembersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="users" label="Members" focused={focused} activeColor={themeColor} />
          ),
        }}
      />

      {/* ─── DYNAMIC MIDDLE TAB ─── */}
      {activeChamaType === "investment" ? (
        <Tab.Screen
          name="Portfolio"
          component={PortfolioScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="bar-chart-2" label="Portfolio" focused={focused} activeColor={themeColor} />
            ),
          }}
        />
      ) : activeChamaType === "hybrid" ? (
        <Tab.Screen
          name="Funds"
          component={FundsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="sliders" label="Funds" focused={focused} activeColor={themeColor} />
            ),
          }}
        />
      ) : activeChamaType === "group_purchase" ? (
        <Tab.Screen
          name="Deals"
          component={DealsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="shopping-bag" label="Deals" focused={focused} activeColor={themeColor} />
            ),
          }}
        />
      ) : (
        // MGR & Welfare default to Loans
        <Tab.Screen
          name="Loans"
          component={GroupLoanScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="dollar-sign" label="Loans" focused={focused} activeColor={themeColor} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Score"
        component={MemberCreditProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="star" label="Score" focused={focused} activeColor={themeColor} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="menu" label="More" focused={focused} activeColor={themeColor} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─── Root stack navigator ───────────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <ChamaProvider>
      <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right", animationDuration: 280 }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="JoinChama" component={JoinChamaScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        {/* Chama creation flow */}
        <Stack.Screen name="ChamaType" component={ChamaTypeScreen} />
        <Stack.Screen name="GroupPurchaseSetup" component={GroupPurchaseSetupScreen} />
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
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </ChamaProvider>
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
