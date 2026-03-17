import React, { useState } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Switch, Pressable, Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }: any) {
  const [name, setName] = useState("Wanjiru Kamau");
  const [phone, setPhone] = useState("+254 712 345 678");
  const [notifContrib, setNotifContrib] = useState(true);
  const [notifLoans, setNotifLoans] = useState(true);
  const [notifVotes, setNotifVotes] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    Alert.alert("Saved", "Your profile has been updated.");
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out", style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("authToken");
          // getParent() climbs from the tab navigator to the root stack navigator
          const rootNav = navigation.getParent() ?? navigation;
          rootNav.reset({
            index: 0,
            routes: [{ name: "Auth" }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={S.hero}>
        <View style={S.circleTR} />
        <View style={S.heroNav}>
          <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
            <Feather name="chevron-left" size={18} color="#fff" />
          </Pressable>
          <Text style={S.heroTitle}>Settings</Text>
          <TouchableOpacity onPress={editing ? handleSave : () => setEditing(true)}>
            <Text style={S.editBtn}>{editing ? "Save" : "Edit"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile section */}
        <Text style={S.sectionLabel}>PROFILE</Text>
        <View style={S.card}>
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Full name</Text>
            {editing ? (
              <TextInput style={S.fieldInput} value={name} onChangeText={setName} />
            ) : (
              <Text style={S.fieldValue}>{name}</Text>
            )}
          </View>
          <View style={S.sep} />
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>Phone</Text>
            <Text style={[S.fieldValue, { color: Colors.textMuted }]}>{phone}</Text>
          </View>
          <View style={S.sep} />
          <View style={S.fieldRow}>
            <Text style={S.fieldLabel}>National ID</Text>
            <Text style={[S.fieldValue, { color: Colors.textMuted }]}>••••••••</Text>
          </View>
        </View>

        {/* Notifications */}
        <Text style={S.sectionLabel}>NOTIFICATIONS</Text>
        <View style={S.card}>
          {[
            { label: "Contribution reminders", sub: "Get reminded when payment is due", val: notifContrib, set: setNotifContrib },
            { label: "Loan votes", sub: "When a member requests a loan", val: notifLoans, set: setNotifLoans },
            { label: "Vote results", sub: "When a vote closes", val: notifVotes, set: setNotifVotes },
            { label: "Daily reminders", sub: "Morning nudge on contribution day", val: notifReminders, set: setNotifReminders },
          ].map((item, i, arr) => (
            <View key={item.label}>
              <View style={S.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={S.toggleLabel}>{item.label}</Text>
                  <Text style={S.toggleSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={item.val}
                  onValueChange={item.set}
                  trackColor={{ false: "#E5E7EB", true: Colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
              {i < arr.length - 1 && <View style={S.sep} />}
            </View>
          ))}
        </View>

        {/* Danger zone */}
        <Text style={S.sectionLabel}>ACCOUNT</Text>
        <View style={S.card}>
          <TouchableOpacity style={S.dangerRow} onPress={handleLogout}>
            <Feather name="log-out" size={18} color="#DC2626" />
            <Text style={S.dangerText}>Log out</Text>
          </TouchableOpacity>
        </View>

        <Text style={S.footer}>Hazina v1.0 · Made in Kenya 🇰🇪</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },
  circleTR: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.05)", top: -50, right: -50 },
  hero: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, overflow: "hidden" },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 20, color: "#FFFFFF", fontWeight: "800" },
  editBtn: { fontFamily: FontFamily.heading, fontSize: 14, color: "#F59E0B", fontWeight: "700" },

  scroll: { backgroundColor: "#F6F9F7", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  sectionLabel: { fontFamily: FontFamily.heading, fontSize: 10, color: Colors.textMuted, fontWeight: "700", letterSpacing: 0.8, marginBottom: 8, marginTop: 4 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#EBF1EF", marginBottom: 20, overflow: "hidden" },

  fieldRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  fieldLabel: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, width: 90 },
  fieldValue: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "600", flex: 1 },
  fieldInput: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "600", flex: 1, borderBottomWidth: 1, borderBottomColor: Colors.primary, paddingBottom: 2 },

  toggleRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  toggleLabel: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "600" },
  toggleSub: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  dangerRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  dangerText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#DC2626", fontWeight: "700" },

  sep: { height: 1, backgroundColor: "#F6F9F7", marginHorizontal: 14 },
  footer: { textAlign: "center", fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, marginTop: 12 },
});
