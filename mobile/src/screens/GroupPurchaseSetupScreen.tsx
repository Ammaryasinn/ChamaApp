import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily } from "../theme";
import { useChamaContext } from "../context/ChamaContext";
import { chamaApi } from "../lib/api";
import { Alert, ActivityIndicator } from "react-native";

// ─────────────────────────────────────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────────────────────────────────────

const TERRACOTTA = Colors.primaryLight;
const TERRACOTTA_LIGHT = Colors.surfaceElevated;
const TERRACOTTA_MID = "#9A3412";

const CATEGORIES = [
  { id: "appliances",  label: "Appliances",    sub: "Fridge, TV, washer",     icon: "tv",         iconBg: "#083326", iconColor: "#D97706" },
  { id: "furniture",   label: "Furniture",      sub: "Sofa, beds, tables",     icon: "home",       iconBg: "#083326", iconColor: Colors.primary },
  { id: "solar",       label: "Solar / Energy", sub: "Panels, batteries",      icon: "sun",        iconBg: "#ECFDF5", iconColor: "#059669" },
  { id: "insurance",   label: "Insurance",      sub: "Health, last expense",   icon: "heart",      iconBg: "#FAF5FF", iconColor: Colors.accentDark },
  { id: "land",        label: "Land / Property",sub: "Plots, building",        icon: "map-pin",    iconBg: "#FFF7ED", iconColor: "#EA580C" },
  { id: "other",       label: "Other",          sub: "Anything else",          icon: "more-horizontal", iconBg: "#F9FAFB", iconColor: "#9CA3AF" },
];

const PRODUCTS = [
  { id: "1", brand: "Samsung Kenya",   name: "320L Double Door Fridge", normalPrice: 89000, chamaPrice: 79000, iconBg: "#083326", iconColor: "#D97706" },
  { id: "2", brand: "Ramtons Kenya",   name: "RF/244 200L Fridge",      normalPrice: 42000, chamaPrice: 38500, iconBg: "#F9FAFB", iconColor: "#9CA3AF" },
  { id: "3", brand: "LG Electronics",  name: "7kg Front Load Washer",   normalPrice: 65000, chamaPrice: 58500, iconBg: "#F9FAFB", iconColor: "#9CA3AF" },
];

const ROTATION = [
  { pos: 1, name: "Wanjiru Kamau",  month: "Month 1 — January 2026",  status: "First",     statusColor: Colors.primaryLight },
  { pos: 2, name: "Akinyi Otieno",  month: "Month 2 — February 2026", status: "Scheduled", statusColor: "#9CA3AF" },
  { pos: 3, name: "Muthoni Mwangi", month: "Month 3 — March 2026",    status: "Scheduled", statusColor: "#9CA3AF" },
];

const FREQS = [
  { id: "weekly",    label: "Weekly",    sub: "Every 7 days" },
  { id: "monthly",   label: "Monthly",   sub: "Once a month" },
  { id: "biweekly",  label: "Bi-weekly", sub: "Every 2 weeks" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-KE");
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hero (shared across steps)
// ─────────────────────────────────────────────────────────────────────────────

function Hero({
  step, title, sub, onBack,
}: { step: number; title: string; sub: string; onBack: () => void }) {
  const dots = [1, 2, 3, 4];
  const pct = (step / 4) * 100;
  return (
    <View style={H.hero}>
      <View style={H.circleRight} />
      {/* Nav row */}
      <View style={H.heroNav}>
        <TouchableOpacity style={H.backBtn} onPress={onBack} hitSlop={12}>
          <Feather name="chevron-left" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={H.heroStep}>Group purchase · Step {step} of 4</Text>
      </View>
      {/* Progress bar */}
      <View style={H.barTrack}>
        <View style={[H.barFill, { width: `${pct}%` }]} />
      </View>
      {/* Dots */}
      <View style={H.dots}>
        {dots.map(d => (
          <View key={d} style={[H.dot, d === step && H.dotActive]} />
        ))}
      </View>
      {/* Title */}
      <Text style={H.heroTitle}>{title}</Text>
      <Text style={H.heroSub}>{sub}</Text>
    </View>
  );
}

const H = StyleSheet.create({
  hero: { backgroundColor: TERRACOTTA, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36, overflow: "hidden" },
  circleRight: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(255,255,255,0.04)", top: -80, right: -80 },
  heroNav: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  backBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  heroStep: { fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700" },
  barTrack: { height: 4, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, overflow: "hidden", marginBottom: 10 },
  barFill: { height: 4, backgroundColor: Colors.background, borderRadius: 2 },
  dots: { flexDirection: "row", gap: 8, marginBottom: 20 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(255,255,255,0.3)" },
  dotActive: { backgroundColor: Colors.background },
  heroTitle: { fontFamily: FontFamily.extraBold, fontSize: 28, color: Colors.textPrimary, fontWeight: "800", lineHeight: 34, marginBottom: 8 },
  heroSub: { fontFamily: FontFamily.regular, fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 18 },
});

// ─────────────────────────────────────────────────────────────────────────────
//  CTA Button
// ─────────────────────────────────────────────────────────────────────────────

function CtaBtn({ label, onPress, icon }: { label: string; onPress: () => void; icon?: string }) {
  return (
    <TouchableOpacity style={B.btn} onPress={onPress} activeOpacity={0.85}>
      {icon && <Feather name={icon as any} size={18} color={Colors.textPrimary} />}
      <Text style={B.btnText}>{label}</Text>
      {!icon && <Feather name="arrow-right" size={18} color={Colors.textPrimary} />}
    </TouchableOpacity>
  );
}

const B = StyleSheet.create({
  btn: { backgroundColor: TERRACOTTA, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 56, borderRadius: 16, marginHorizontal: 20, marginBottom: 16 },
  btnText: { fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textPrimary, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────────────────────
//  Step 1 — Category
// ─────────────────────────────────────────────────────────────────────────────

function Step1Category({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <View style={S1.wrap}>
      <Text style={S1.heading}>Choose a category</Text>
      <Text style={S1.sub}>Select the type of product your group wants to purchase together</Text>

      <View style={S1.grid}>
        {CATEGORIES.map(c => {
          const active = selected === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[S1.card, active && S1.cardActive]}
              activeOpacity={0.85}
              onPress={() => onSelect(c.id)}
            >
              <View style={[S1.iconBox, { backgroundColor: active ? TERRACOTTA_LIGHT : c.iconBg }]}>
                <Feather name={c.icon as any} size={22} color={active ? Colors.primaryLight : c.iconColor} />
              </View>
              <Text style={[S1.cardLabel, active && { color: Colors.primaryLight }]}>{c.label}</Text>
              <Text style={S1.cardSub}>{c.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const S1 = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  heading: { fontFamily: FontFamily.extraBold, fontSize: 20, color: Colors.textPrimary, fontWeight: "800", marginBottom: 4 },
  sub: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, marginBottom: 24, lineHeight: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "47%", backgroundColor: Colors.background, borderWidth: 1.5, borderColor: "#E5E7EB",
    borderRadius: 16, padding: 14, alignItems: "flex-start",
  },
  cardActive: { borderColor: Colors.primaryLight, backgroundColor: TERRACOTTA_LIGHT },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  cardLabel: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "700", marginBottom: 2 },
  cardSub: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted },
});

// ─────────────────────────────────────────────────────────────────────────────
//  Step 2 — Product
// ─────────────────────────────────────────────────────────────────────────────

function Step2Product({ selected, onSelect, category }: { selected: string; onSelect: (id: string) => void; category: string }) {
  const cat = CATEGORIES.find(c => c.id === category);
  return (
    <View style={S2.wrap}>
      <Text style={S2.heading}>{cat?.label ?? "Products"}</Text>
      <Text style={S2.sub}>Partner deals — available only to Hazina saving groups</Text>

      <View style={S2.list}>
        {PRODUCTS.map(p => {
          const active = selected === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[S2.card, active && S2.cardActive]}
              activeOpacity={0.85}
              onPress={() => onSelect(p.id)}
            >
              <View style={[S2.prodIcon, { backgroundColor: p.iconBg }]}>
                <Feather name="tv" size={18} color={p.iconColor} />
              </View>
              <View style={S2.prodMeta}>
                <Text style={S2.brand}>{p.brand}</Text>
                <Text style={S2.prodName}>{p.name}</Text>
                <View style={S2.pricing}>
                  <Text style={S2.normal}>Ksh{"\n"}{fmt(p.normalPrice)}</Text>
                  <Text style={S2.chama}>Ksh{"\n"}{fmt(p.chamaPrice)}</Text>
                  <View style={S2.badge}><Text style={S2.badgeText}>Chama{"\n"}price</Text></View>
                </View>
              </View>
              <View style={[S2.radio, active && S2.radioActive]}>
                {active && <View style={S2.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Own product option */}
      <TouchableOpacity style={S2.ownCard}>
        <Feather name="plus" size={16} color={Colors.primaryLight} />
        <Text style={S2.ownText}>Enter our own product and target price</Text>
      </TouchableOpacity>
    </View>
  );
}

const S2 = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  heading: { fontFamily: FontFamily.extraBold, fontSize: 20, color: Colors.textPrimary, fontWeight: "800", marginBottom: 4 },
  sub: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, marginBottom: 20, lineHeight: 18 },
  list: { gap: 12, marginBottom: 14 },
  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.background, borderWidth: 1.5, borderColor: "#E5E7EB",
    borderRadius: 16, padding: 14,
  },
  cardActive: { borderColor: Colors.primaryLight, backgroundColor: TERRACOTTA_LIGHT },
  prodIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  prodMeta: { flex: 1 },
  brand: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  prodName: { fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700", marginBottom: 8 },
  pricing: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  normal: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted, textDecorationLine: "line-through", lineHeight: 15 },
  chama: { fontFamily: FontFamily.extraBold, fontSize: 13, color: Colors.primary, fontWeight: "800", lineHeight: 15 },
  badge: { backgroundColor: "#E8F7F4", paddingHorizontal: 6, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontFamily: FontFamily.heading, fontSize: 9, color: Colors.primary, fontWeight: "700", lineHeight: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center" },
  radioActive: { borderColor: Colors.primaryLight },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primaryLight },
  ownCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1.5, borderColor: "#FCA995", borderStyle: "dashed",
    backgroundColor: TERRACOTTA_LIGHT, borderRadius: 14, padding: 16,
  },
  ownText: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.primaryLight, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────────────────────
//  Step 3 — Schedule
// ─────────────────────────────────────────────────────────────────────────────

function Step3Schedule({
  freq, setFreq, amount, setAmount, product,
 members, setMembers }: { freq: string; setFreq: (f: string) => void; amount: string; setAmount: (a: string) => void; product: any; members: string; setMembers: (m: string) => void }) {
  const amtNum = parseInt(amount.replace(/,/g, ""), 10) || 0;
  const months = product && amtNum > 0 ? Math.ceil(product.chamaPrice / amtNum) : "—";

  return (
    <View style={S3.wrap}>
      <Text style={S3.heading}>Contribution setup</Text>
      <Text style={S3.sub}>
        For {product?.name ?? "product"} · Ksh {product ? fmt(product.chamaPrice) : "—"} each · {members || "0"} members
      </Text>

      
      {/* Members */}
      <Text style={[S3.label, { marginTop: 20 }]}>NUMBER OF MEMBERS</Text>
      <View style={S3.inputRow}>
        <Text style={S3.inputPre}>🧑</Text>
        <TextInput
          style={S3.input}
          value={members}
          onChangeText={(v) => setMembers(v.replace(/D/g, ""))}
          keyboardType="number-pad"
          placeholder="e.g. 20"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Frequency */}
      <Text style={S3.label}>HOW OFTEN DO MEMBERS CONTRIBUTE?</Text>
      <View style={S3.freqRow}>
        {FREQS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[S3.freqCard, freq === f.id && S3.freqCardActive]}
            onPress={() => setFreq(f.id)}
            activeOpacity={0.8}
          >
            <Text style={[S3.freqLabel, freq === f.id && { color: Colors.textPrimary }]}>{f.label}</Text>
            <Text style={[S3.freqSub, freq === f.id && { color: "rgba(255,255,255,0.75)" }]}>{f.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Amount */}
      <Text style={[S3.label, { marginTop: 20 }]}>CONTRIBUTION AMOUNT PER MEMBER</Text>
      <View style={S3.inputRow}>
        <Text style={S3.inputPre}>Ksh</Text>
        <TextInput
          style={S3.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#D1D5DB"
        />
      </View>

      {/* Auto-calc card */}
      {amtNum > 0 && (
        <View style={S3.calcCard}>
          <Text style={S3.calcSub}>Each member contributes</Text>
          <Text style={S3.calcVal}>Ksh {fmt(amtNum)}/month</Text>
          <Text style={S3.calcSub}>
            Full product funded in {months} months · Delivery starts month 1
          </Text>
        </View>
      )}

      {/* Rotation */}
      <Text style={[S3.label, { marginTop: 24 }]}>DELIVERY ROTATION ORDER</Text>
      <View style={S3.rotList}>
        {ROTATION.map(r => (
          <View key={r.pos} style={S3.rotRow}>
            <View style={[S3.rotNum, r.pos === 1 && S3.rotNumActive]}>
              <Text style={[S3.rotNumText, r.pos === 1 && { color: Colors.textPrimary }]}>{r.pos}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S3.rotName}>{r.name}</Text>
              <Text style={S3.rotMonth}>{r.month}</Text>
            </View>
            <Text style={[S3.rotStatus, { color: r.statusColor }]}>{r.status}</Text>
          </View>
        ))}
        <Text style={S3.rotNote}>+ 17 more members · Randomised order — can be changed after setup</Text>
      </View>
    </View>
  );
}

const S3 = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  heading: { fontFamily: FontFamily.extraBold, fontSize: 20, color: Colors.textPrimary, fontWeight: "800", marginBottom: 4 },
  sub: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, marginBottom: 20, lineHeight: 18 },
  label: { fontFamily: FontFamily.heading, fontSize: 10, color: Colors.textMuted, fontWeight: "700", letterSpacing: 0.8, marginBottom: 10 },
  freqRow: { flexDirection: "row", gap: 8 },
  freqCard: { flex: 1, borderWidth: 1.5, borderColor: "#E5E7EB", borderRadius: 12, padding: 12, alignItems: "center" },
  freqCardActive: { borderColor: Colors.primaryLight, backgroundColor: Colors.primaryLight },
  freqLabel: { fontFamily: FontFamily.heading, fontSize: 13, color: Colors.textPrimary, fontWeight: "700" },
  freqSub: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textMuted, marginTop: 3, textAlign: "center" },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: Colors.primaryLight, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, backgroundColor: Colors.surface, gap: 8 },
  inputPre: { fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textMuted, fontWeight: "700" },
  input: { flex: 1, fontFamily: FontFamily.extraBold, fontSize: 20, color: Colors.textPrimary, fontWeight: "800" },
  calcCard: { backgroundColor: "#F0FDFA", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 14, padding: 16, marginTop: 14 },
  calcSub: { fontFamily: FontFamily.regular, fontSize: 12, color: "#065F46" },
  calcVal: { fontFamily: FontFamily.extraBold, fontSize: 26, color: Colors.primary, fontWeight: "800", letterSpacing: -0.5, marginVertical: 4 },
  rotList: { gap: 14, marginTop: 4 },
  rotRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  rotNum: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  rotNumActive: { backgroundColor: TERRACOTTA, borderColor: Colors.primaryLight },
  rotNumText: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textMuted, fontWeight: "700" },
  rotName: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "700" },
  rotMonth: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  rotStatus: { fontFamily: FontFamily.heading, fontSize: 12, fontWeight: "700" },
  rotNote: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, fontStyle: "italic" },
});

// ─────────────────────────────────────────────────────────────────────────────
//  Step 4 — Confirm
// ─────────────────────────────────────────────────────────────────────────────

function Step4Confirm({ product, amount, onLaunch }: { product: any; amount: string; onLaunch: () => void }) {
  const amtNum = parseInt(amount.replace(/,/g, ""), 10) || 5000;
  const members = 20;
  const totalCommitment = amtNum * members * (product?.chamaPrice ? Math.ceil(product.chamaPrice / amtNum) : 20);
  const savings = product ? product.normalPrice - product.chamaPrice : 0;
  const months = product && amtNum > 0 ? Math.ceil(product.chamaPrice / amtNum) : 20;
  const endDate = "Sept 2027";

  return (
    <View style={S4.wrap}>
      {/* Summary card */}
      <View style={S4.summaryCard}>
        <Text style={S4.summaryTitle}>Purchase summary</Text>

        <View style={S4.row}>
          <Text style={S4.rowLabel}>Product</Text>
          <Text style={S4.rowVal}>{product?.name ?? "—"}</Text>
        </View>
        <View style={S4.row}>
          <Text style={S4.rowLabel}>Brand partner</Text>
          <Text style={[S4.rowVal, { color: Colors.primary }]}>{product?.brand ?? "—"} (official)</Text>
        </View>
        <View style={S4.row}>
          <Text style={S4.rowLabel}>Normal price</Text>
          <Text style={[S4.rowVal, { color: Colors.textMuted, textDecorationLine: "line-through" }]}>
            Ksh {product ? fmt(product.normalPrice) : "—"}
          </Text>
        </View>
        <View style={S4.row}>
          <Text style={S4.rowLabel}>Chama price</Text>
          <Text style={[S4.rowVal, { color: Colors.primary }]}>Ksh {product ? fmt(product.chamaPrice) : "—"}</Text>
        </View>
        <View style={S4.row}>
          <Text style={S4.rowLabel}>You save</Text>
          <Text style={[S4.rowVal, { color: Colors.primaryLight }]}>Ksh {fmt(savings)} per unit</Text>
        </View>

        <View style={S4.divider} />

        <View style={S4.row}>
          <Text style={S4.rowLabel}>Members</Text>
          <Text style={S4.rowVal}>{members} members</Text>
        </View>
        <View style={S4.row}>
          <Text style={S4.rowLabel}>Contribution</Text>
          <Text style={S4.rowVal}>Ksh {fmt(amtNum)}/month each</Text>
        </View>
        <View style={S4.row}>
          <Text style={S4.rowLabel}>Delivery starts</Text>
          <Text style={S4.rowVal}>Month 1 — Wanjiru Kamau</Text>
        </View>
        <View style={S4.row}>
          <Text style={S4.rowLabel}>Full cycle completes</Text>
          <Text style={S4.rowVal}>{months} months · {endDate}</Text>
        </View>

        <View style={S4.divider} />

        <View style={S4.row}>
          <Text style={[S4.rowLabel, { fontWeight: "700", color: Colors.textPrimary, fontSize: 14 }]}>Total group commitment</Text>
          <Text style={[S4.rowVal, { color: Colors.primaryLight, fontSize: 22, fontFamily: FontFamily.extraBold }]}>Ksh {fmt(totalCommitment)}</Text>
        </View>
      </View>

      {/* Nudge banner */}
      <View style={S4.nudge}>
        <Feather name="info" size={16} color="#D97706" style={{ marginTop: 2 }} />
        <Text style={S4.nudgeText}>
          Once launched, all {members} members will receive an invite via SMS. The purchase cycle starts when{" "}
          <Text style={{ fontWeight: "700", color: Colors.textPrimary }}>at least 15 members have joined and paid their first contribution.</Text>
        </Text>
      </View>
    </View>
  );
}

const S4 = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  summaryCard: { backgroundColor: TERRACOTTA_LIGHT, borderWidth: 1, borderColor: "#FCA995", borderRadius: 20, padding: 20, marginBottom: 16 },
  summaryTitle: { fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textPrimary, fontWeight: "800", marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 7 },
  rowLabel: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted, flex: 1 },
  rowVal: { fontFamily: FontFamily.heading, fontSize: 13, color: Colors.textPrimary, fontWeight: "700", textAlign: "right", flex: 1 },
  divider: { height: 1, backgroundColor: "#FCA995", marginVertical: 10 },
  nudge: { backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 14, padding: 16, flexDirection: "row", gap: 10, marginBottom: 8 },
  nudgeText: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textPrimary, flex: 1, lineHeight: 20 },
});

// ─────────────────────────────────────────────────────────────────────────────
//  Main Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function GroupPurchaseSetupScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("appliances");
  const [productId, setProductId] = useState("1");
  const [freq, setFreq] = useState("monthly");
  const [amount, setAmount] = useState("5,000");
  const [members, setMembers] = useState("20");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("Group Purchase");

  const selectedProduct = PRODUCTS.find(p => p.id === productId) ?? PRODUCTS[0];
  const selectedCategory = CATEGORIES.find(c => c.id === category);

  const ctaLabel = () => {
    if (step === 1) return `Continue — ${selectedCategory?.label ?? "?"} selected`;
    if (step === 2) return `Continue — ${selectedProduct.brand.split(" ")[0]} Fridge selected`;
    if (step === 3) return "Continue — Review summary";
    return "Launch group purchase chama";
  };

  const handleContinue = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (!name) {
        Alert.alert("Error", "Please enter a chama name");
        return;
      }
      setLoading(true);
      try {
        const newChama = await chamaApi.createChama({
          name: name.trim(),
          chamaType: "group_purchase",
          contributionAmount: parseInt(amount.replace(/,/g, "")) || 0,
          contributionFrequency: freq,
          penaltyAmount: 0,
          penaltyGraceDays: 3,
          meetingDay: 6,
          maxLoanMultiplier: 3,
          loanInterestRate: 10,
          minVotesToApproveLoan: 3,
          mgrPercentage: 100,
          investmentPercentage: 0,
          welfarePercentage: 0,
        });
        navigation.navigate("InviteMembers", { chamaId: newChama.id, chamaType: "GROUP_PURCHASE", name: name.trim() });
      } catch (e: any) {
        Alert.alert("Error", e?.response?.data?.error || "Failed to create Chama.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  const HERO_TITLES = [
    "What is your group\nsaving to buy?",
    "Pick your product",
    "Set the contribution\nschedule",
    "Confirm your group\npurchase",
  ];

  const HERO_SUBS = [
    "Choose a category — we'll show you the best chama deals",
    "Chama-exclusive prices from our partners",
    "How often will members contribute toward the purchase?",
    "Review everything before launching the chama",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryLight }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} stickyHeaderIndices={[0]}>
          <Hero
            step={step}
            title={HERO_TITLES[step - 1]}
            sub={HERO_SUBS[step - 1]}
            onBack={handleBack}
          />

          <View style={{ backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20, minHeight: 600 }}>
            {step === 1 && (
              <Step1Category selected={category} onSelect={setCategory} />
            )}
            {step === 2 && (
              <Step2Product selected={productId} onSelect={setProductId} category={category} />
            )}
            {step === 3 && (
              <Step3Schedule freq={freq} setFreq={setFreq} amount={amount} setAmount={setAmount} product={selectedProduct} members={members} setMembers={setMembers} />
            )}
            {step === 4 && (
              
              <View><Text style={{ fontFamily: FontFamily.semiBold, fontSize: 13, color: Colors.textSecondary, marginBottom: 8, marginTop: 24, letterSpacing: 1 }}>CHAMA NAME</Text>
              <TextInput style={{ backgroundColor: Colors.surface, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, padding: 14, fontFamily: FontFamily.medium, color: Colors.textPrimary, fontSize: 16 }} value={name} onChangeText={setName} placeholder="Enter chama name..." placeholderTextColor={Colors.textMuted} />
              <Step4Confirm product={selectedProduct} amount={amount} onLaunch={handleContinue} /></View>
            )}
          </View>
        </ScrollView>

        <View style={{ backgroundColor: Colors.surface, paddingTop: 8 }}>
          <CtaBtn
            label={ctaLabel()}
            onPress={handleContinue}
            icon={step === 4 ? "check-circle" : undefined}
          />
          {step === 4 && (
            <Text style={{ textAlign: "center", fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginBottom: 12 }}>
              Samsung will be notified of your committed group order
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
