import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadow,
  Spacing,
} from "./theme";

// ─── Context ────────────────────────────────────────────────────────────────
import { ChamaProvider, useChamaContext } from "./context/ChamaContext";
import { setUnauthorizedHandler } from "./lib/api";

// ─── Auth / Onboarding Screens ───────────────────────────────────────────────
import SplashScreen      from "./screens/SplashScreen";
import AuthScreen        from "./screens/AuthScreen";
import OnboardingScreen  from "./screens/OnboardingScreen";
import WelcomeScreen     from "./screens/WelcomeScreen";
import JoinChamaScreen   from "./screens/JoinChamaScreen";

// ─── Main Tab Screens ────────────────────────────────────────────────────────
import DashboardScreen    from "./screens/DashboardScreen";
import ChamasListScreen   from "./screens/ChamasListScreen";
import PerksScreen        from "./screens/PerksScreen";
import ProfileScreen      from "./screens/ProfileScreen";

// ─── Dynamic Middle Tab Screens ──────────────────────────────────────────────
import PortfolioScreen  from "./screens/PortfolioScreen";
import FundsScreen      from "./screens/FundsScreen";
import DealsScreen      from "./screens/DealsScreen";
import GroupLoanScreen  from "./screens/GroupLoanScreen";

// ─── Chama Setup Flow ────────────────────────────────────────────────────────
import ChamaTypeScreen        from "./screens/ChamaTypeScreen";
import ChamaDetailsScreen     from "./screens/ChamaDetailsScreen";
import MGRSetupScreen         from "./screens/MGRSetupScreen";
import InvestmentSetupScreen  from "./screens/InvestmentSetupScreen";
import WelfareSetupScreen     from "./screens/WelfareSetupScreen";
import HybridConfigScreen     from "./screens/HybridConfigScreen";
import GroupPurchaseSetupScreen from "./screens/GroupPurchaseSetupScreen";
import ContributionDayScreen  from "./screens/ContributionDayScreen";

// ─── Detail / Feature Screens ────────────────────────────────────────────────
import InvestmentDashboardScreen from "./screens/InvestmentDashboardScreen";
import MemberCreditProfileScreen from "./screens/MemberCreditProfileScreen";
import HazinaScoreScreen         from "./screens/HazinaScoreScreen";
import LoanRequestScreen         from "./screens/LoanRequestScreen";
import ChamaAdminScreen         from "./screens/ChamaAdminScreen";
import LoanEligibilityScreen     from "./screens/LoanEligibilityScreen";
import BankLoanOfferScreen       from "./screens/BankLoanOfferScreen";
import MGRScheduleScreen         from "./screens/MGRScheduleScreen";
import MembersScreen             from "./screens/MembersScreen";
import InviteMembersScreen       from "./screens/InviteMembersScreen";
import PremiumSubscriptionScreen from "./screens/PremiumSubscriptionScreen";
import NotificationsScreen       from "./screens/NotificationsScreen";
import SettingsScreen            from "./screens/SettingsScreen";
import ContributionModal         from "./screens/ContributionModal";
import PlaceholderScreen         from "./screens/PlaceholderScreen";

// ─────────────────────────────────────────────────────────────────────────────
//  Navigators
// ─────────────────────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ─────────────────────────────────────────────────────────────────────────────
//  Tab Icon
// ─────────────────────────────────────────────────────────────────────────────
type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

function TabIcon({
  icon,
  label,
  focused,
  activeColor,
}: {
  icon: FeatherIconName;
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
          focused
            ? { color: activeColor, fontFamily: FontFamily.semiBold }
            : S.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
      {focused && (
        <View style={[S.tabDot, { backgroundColor: activeColor }]} />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Dynamic middle-tab label + icon per chama type
// ─────────────────────────────────────────────────────────────────────────────
function middleTabMeta(type: string): { label: string; icon: FeatherIconName } {
  switch (type) {
    case "investment":     return { label: "Portfolio",  icon: "trending-up"  };
    case "welfare":        return { label: "Welfare",    icon: "heart"        };
    case "hybrid":         return { label: "Funds",      icon: "sliders"      };
    case "group_purchase": return { label: "Deals",      icon: "shopping-bag" };
    default:               return { label: "Loans",      icon: "dollar-sign"  }; // merry_go_round
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main bottom-tab navigator
//  Tabs: Home · Chamas · [Dynamic] · Marketplace · Profile
// ─────────────────────────────────────────────────────────────────────────────
function MainTabNavigator() {
  const { activeChamaType, activeChamaColor } = useChamaContext();
  const themeColor = activeChamaColor || Colors.primary;
  const middleMeta = middleTabMeta(activeChamaType);

  // Resolve the component for the dynamic middle tab
  const MiddleComponent = (() => {
    switch (activeChamaType) {
      case "investment":     return PortfolioScreen;
      case "hybrid":         return FundsScreen;
      case "group_purchase": return DealsScreen;
      default:               return GroupLoanScreen; // MGR + Welfare
    }
  })();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: S.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* 1 — Home (active chama dashboard) */}
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="home" label="Home" focused={focused} activeColor={themeColor} />
          ),
        }}
      />

      {/* 2 — Chamas (list of all chamas) */}
      <Tab.Screen
        name="Chamas"
        component={ChamasListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="users" label="Chamas" focused={focused} activeColor={themeColor} />
          ),
        }}
      />

      {/* 3 — Dynamic middle tab */}
      <Tab.Screen
        name={middleMeta.label}
        component={MiddleComponent}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={middleMeta.icon}
              label={middleMeta.label}
              focused={focused}
              activeColor={themeColor}
            />
          ),
        }}
      />

      {/* 4 — Marketplace */}
      <Tab.Screen
        name="Marketplace"
        component={PerksScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="tag" label="Market" focused={focused} activeColor={themeColor} />
          ),
        }}
      />

      {/* 5 — Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="user" label="Profile" focused={focused} activeColor={themeColor} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Root stack navigator
// ─────────────────────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const navRef = useRef<NavigationContainerRef<any>>(null);

  // Auto-redirect to Auth on any 401
  setUnauthorizedHandler(() => {
    navRef.current?.reset({ index: 0, routes: [{ name: "Auth" }] });
  });

  return (
    <ChamaProvider>
      <NavigationContainer ref={navRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 280,
          }}
        >
          {/* ── Splash / Auth / Onboarding ── */}
          <Stack.Screen name="Splash"      component={SplashScreen} />
          <Stack.Screen name="Auth"        component={AuthScreen} />
          <Stack.Screen name="Onboarding"  component={OnboardingScreen} />
          <Stack.Screen name="Welcome"     component={WelcomeScreen} />
          <Stack.Screen name="JoinChama"   component={JoinChamaScreen} />

          {/* ── Main Tab Navigator ── */}
          <Stack.Screen name="MainTabs"    component={MainTabNavigator} />

          {/* ── Chama creation flow ── */}
          <Stack.Screen name="ChamaType"           component={ChamaTypeScreen} />
          <Stack.Screen name="ChamaDetails"        component={ChamaDetailsScreen} />
          <Stack.Screen name="MGRSetup"            component={MGRSetupScreen} />
          <Stack.Screen name="InvestmentSetup"     component={InvestmentSetupScreen} />
          <Stack.Screen name="WelfareSetup"        component={WelfareSetupScreen} />
          <Stack.Screen name="HybridConfig"        component={HybridConfigScreen} />
          <Stack.Screen name="GroupPurchaseSetup"  component={GroupPurchaseSetupScreen} />
          <Stack.Screen name="ContributionDay"     component={ContributionDayScreen} />

          {/* ── Dashboard detail screens ── */}
          <Stack.Screen name="Portfolio"           component={PortfolioScreen} />
          <Stack.Screen name="Funds"               component={FundsScreen} />
          <Stack.Screen name="Deals"               component={DealsScreen} />
          <Stack.Screen name="InvestmentDashboard" component={InvestmentDashboardScreen} />
          <Stack.Screen name="MGRSchedule"         component={MGRScheduleScreen} />
          <Stack.Screen name="GroupLoan"           component={GroupLoanScreen} />
          <Stack.Screen name="Members"             component={MembersScreen} />
          <Stack.Screen name="InviteMembers"       component={InviteMembersScreen} />
          <Stack.Screen name="ChamaAdmin"          component={ChamaAdminScreen} />

          {/* ── Credit score ── */}
          <Stack.Screen name="MemberCreditProfile" component={MemberCreditProfileScreen} />
          <Stack.Screen name="HazinaScore"         component={HazinaScoreScreen} />

          {/* ── Loan flow ── */}
          <Stack.Screen name="LoanRequest"         component={LoanRequestScreen} />
          <Stack.Screen name="LoanEligibility"     component={LoanEligibilityScreen} />
          <Stack.Screen name="BankLoanOffer"        component={BankLoanOfferScreen} />

          {/* ── Profile / Account ── */}
          <Stack.Screen name="PremiumSubscription" component={PremiumSubscriptionScreen} />
          <Stack.Screen name="Notifications"       component={NotificationsScreen} />
          <Stack.Screen name="Settings"            component={SettingsScreen} />
          <Stack.Screen name="Perks"               component={PerksScreen} />
          <Stack.Screen name="Placeholder"         component={PlaceholderScreen} />

          {/* ── Modal screens (slide up from bottom) ── */}
          <Stack.Screen
            name="ContributionModal"
            component={ContributionModal}
            options={{
              animation: "slide_from_bottom",
              presentation: "modal",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ChamaProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────
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
  tabLabelInactive: {
    color: Colors.tabBarInactive,
  },

  // Active dot indicator below label
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    marginTop: 1,
  },
});
