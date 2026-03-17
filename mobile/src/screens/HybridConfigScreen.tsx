import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";
import { Feather } from "@expo/vector-icons";

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      style={[S.toggleTrack, isOn ? S.toggleTrackOn : S.toggleTrackOff]}
      accessibilityRole="switch"
    >
      <View style={[S.toggleThumb, isOn ? S.toggleThumbOn : S.toggleThumbOff]} />
    </Pressable>
  );
}

// ─── Percent stepper bar ──────────────────────────────────────────────────────
function PercentBar({
  label,
  percent,
  color,
  onIncrease,
  onDecrease,
  editable = false,
}: {
  label: string;
  percent: number;
  color: string;
  onIncrease?: () => void;
  onDecrease?: () => void;
  editable?: boolean;
}) {
  const fillPct = Math.min(100, Math.max(0, percent));
  return (
    <View style={S.sliderBlock}>
      <View style={S.sliderLabelRow}>
        <Text style={S.sliderLabel}>{label}</Text>
        <Text style={[S.sliderPercent, { color }]}>{percent}%</Text>
      </View>
      <View style={S.sliderControls}>
        {editable && (
          <Pressable
            style={[S.stepBtn, percent <= 10 && S.stepBtnDisabled]}
            onPress={onDecrease}
            disabled={percent <= 10}
          >
            <Text style={[S.stepBtnText, percent <= 10 && { color: Colors.textMuted }]}>−</Text>
          </Pressable>
        )}
        <View style={S.trackBg}>
          <View style={[S.trackFill, { width: `${fillPct}%` as any, backgroundColor: color }]} />
          {editable && fillPct > 0 && fillPct < 100 && (
            <View style={[S.trackThumb, { left: `${fillPct}%` as any, marginLeft: -10, borderColor: color }]} />
          )}
        </View>
        {editable && (
          <Pressable
            style={[S.stepBtn, percent >= 80 && S.stepBtnDisabled]}
            onPress={onIncrease}
            disabled={percent >= 80}
          >
            <Text style={[S.stepBtnText, percent >= 80 && { color: Colors.textMuted }]}>+</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HybridConfigScreen({ navigation, route }: any) {
  const [chamaName, setChamaName] = useState(route.params?.name || "");

  const [mgrEnabled, setMgrEnabled] = useState(true);
  const [investEnabled, setInvestEnabled] = useState(true);
  const [welfareEnabled, setWelfareEnabled] = useState(false);

  const baseContribution = 5000;

  // We store mgrPercent and welfarePercent; invest is always the remainder
  // Welfare is fixed at 10% when enabled
  const welfareFixed = 10;
  const [mgrPercent, setMgrPercent] = useState(60);

  // Compute a clean split from the enabled toggles
  const computeSplit = () => {
    const wPct = welfareEnabled ? welfareFixed : 0;
    const remaining = 100 - wPct;

    if (mgrEnabled && investEnabled) {
      const mClamped = Math.min(mgrPercent, remaining - 10);
      const iPct = remaining - mClamped;
      return { mgr: mClamped, invest: iPct, welfare: wPct };
    }
    if (mgrEnabled && !investEnabled) {
      return { mgr: remaining, invest: 0, welfare: wPct };
    }
    if (!mgrEnabled && investEnabled) {
      return { mgr: 0, invest: remaining, welfare: wPct };
    }
    // Welfare only — shouldn't be reachable (we require ≥2)
    return { mgr: 0, invest: 0, welfare: wPct };
  };

  const split = computeSplit();

  const mgrAmount    = Math.round((baseContribution * split.mgr)    / 100);
  const invAmount    = Math.round((baseContribution * split.invest)  / 100);
  const welfareAmount = Math.round((baseContribution * split.welfare) / 100);

  const adjustMgr = (delta: number) => {
    const wPct = welfareEnabled ? welfareFixed : 0;
    const remaining = 100 - wPct;
    const min = investEnabled ? 10 : remaining;
    const max = investEnabled ? remaining - 10 : remaining;
    setMgrPercent((prev) => Math.min(max, Math.max(min, prev + delta)));
  };

  const enabledCount = [mgrEnabled, investEnabled, welfareEnabled].filter(Boolean).length;
  const canConfirm = enabledCount >= 2 && chamaName.trim().length > 0;

  const handleToggleMgr = () => {
    // Prevent turning off MGR if invest is also off (need ≥2)
    if (mgrEnabled && !investEnabled) {
      Alert.alert("At least 2 required", "Enable Investment or Welfare first before disabling MGR.");
      return;
    }
    setMgrEnabled((v) => !v);
  };

  const handleToggleInvest = () => {
    if (investEnabled && !mgrEnabled) {
      Alert.alert("At least 2 required", "Enable MGR or Welfare first before disabling Investment.");
      return;
    }
    setInvestEnabled((v) => !v);
  };

  const handleToggleWelfare = () => {
    if (welfareEnabled && enabledCount <= 2) {
      Alert.alert("At least 2 required", "You cannot disable all types. Enable another type first.");
      return;
    }
    setWelfareEnabled((v) => !v);
  };

  const handleConfirm = () => {
    if (!chamaName.trim()) {
      Alert.alert("Name required", "Please enter a name for your Hybrid Chama.");
      return;
    }
    if (enabledCount < 2) {
      Alert.alert("Select at least 2", "A hybrid chama needs at least 2 combined types.");
      return;
    }
    navigation.navigate("InviteMembers", {
      chamaType: "HYBRID",
      name: chamaName.trim(),
      mgrPercent: split.mgr,
      investPercent: split.invest,
      welfarePercent: split.welfare,
    });
  };

  return (
    <SafeAreaView style={S.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={S.header}>
        <Pressable onPress={() => navigation.goBack()} style={S.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={20} color={Colors.primary} />
        </Pressable>
        <Text style={S.headerTitle}>Hybrid Chama Setup</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={S.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Chama Name */}
        <Text style={S.sectionLabel}>CHAMA NAME</Text>
        <View style={S.nameCard}>
          <Feather name="edit-2" size={16} color={Colors.textMuted} />
          <TextInput
            style={S.nameInput}
            placeholder="e.g. Kilimani Hybrid Group"
            placeholderTextColor={Colors.textMuted}
            value={chamaName}
            onChangeText={setChamaName}
            maxLength={40}
          />
        </View>

        {/* Type Toggles */}
        <Text style={S.sectionLabel}>CHOOSE TYPES TO COMBINE</Text>
        <View style={S.toggleSection}>
          {/* MGR */}
          <View style={S.toggleRow}>
            <View style={[S.typeIcon, { backgroundColor: "#FEF3C7" }]}>
              <Text style={S.typeIconText}>↺</Text>
            </View>
            <View style={S.typeTextBlock}>
              <Text style={S.typeTitle}>Merry-go-round</Text>
              <Text style={S.typeDesc}>Classic rotating savings pot</Text>
            </View>
            <ToggleSwitch isOn={mgrEnabled} onToggle={handleToggleMgr} />
          </View>

          <View style={S.divider} />

          {/* Investment */}
          <View style={S.toggleRow}>
            <View style={[S.typeIcon, { backgroundColor: "#DBEAFE" }]}>
              <Text style={S.typeIconText}>📈</Text>
            </View>
            <View style={S.typeTextBlock}>
              <Text style={S.typeTitle}>Investment fund</Text>
              <Text style={S.typeDesc}>Long-term wealth creation</Text>
            </View>
            <ToggleSwitch isOn={investEnabled} onToggle={handleToggleInvest} />
          </View>

          <View style={S.divider} />

          {/* Welfare */}
          <View style={S.toggleRow}>
            <View style={[S.typeIcon, { backgroundColor: "#F3E8FF" }]}>
              <Text style={S.typeIconText}>🤝</Text>
            </View>
            <View style={S.typeTextBlock}>
              <Text style={S.typeTitle}>Welfare / savings</Text>
              <Text style={S.typeDesc}>Emergency fund · fixed 10%</Text>
            </View>
            <ToggleSwitch isOn={welfareEnabled} onToggle={handleToggleWelfare} />
          </View>
        </View>

        {/* Warning */}
        {enabledCount < 2 && (
          <View style={S.warningCard}>
            <Feather name="alert-triangle" size={16} color={Colors.warning} />
            <Text style={S.warningText}>Enable at least 2 types to create a hybrid chama.</Text>
          </View>
        )}

        {/* Split Sliders */}
        {enabledCount >= 2 && (
          <>
            <Text style={S.splitSectionTitle}>Set the contribution split</Text>

            {mgrEnabled && (
              <PercentBar
                label="MERRY-GO-ROUND"
                percent={split.mgr}
                color={Colors.primary}
                editable={investEnabled} // only adjustable if invest is also on
                onIncrease={() => adjustMgr(10)}
                onDecrease={() => adjustMgr(-10)}
              />
            )}

            {investEnabled && (
              <PercentBar
                label="INVESTMENT FUND"
                percent={split.invest}
                color="#3B82F6"
                editable={false} // auto-calculated remainder
              />
            )}

            {welfareEnabled && (
              <PercentBar
                label="WELFARE (fixed)"
                percent={split.welfare}
                color="#7C3AED"
                editable={false}
              />
            )}

            {/* Breakdown card */}
            <View style={S.infoCard}>
              <Text style={S.infoCardIcon}>💡</Text>
              <View style={S.infoCardText}>
                <Text style={S.infoCardTitle}>
                  Each{" "}
                  <Text style={S.infoCardBold}>Ksh {baseContribution.toLocaleString()}</Text>
                  {" "}contribution splits as:
                </Text>
                {mgrEnabled && (
                  <Text style={S.infoLine}>
                    <Text style={S.infoBullet}>›</Text> Ksh {mgrAmount.toLocaleString()} → MGR pot ({split.mgr}%)
                  </Text>
                )}
                {investEnabled && (
                  <Text style={[S.infoLine, { color: "#2563EB" }]}>
                    <Text style={[S.infoBullet, { color: "#2563EB" }]}>›</Text> Ksh {invAmount.toLocaleString()} → Investment fund ({split.invest}%)
                  </Text>
                )}
                {welfareEnabled && (
                  <Text style={[S.infoLine, { color: "#6D28D9" }]}>
                    <Text style={[S.infoBullet, { color: "#6D28D9" }]}>›</Text> Ksh {welfareAmount.toLocaleString()} → Welfare pot ({split.welfare}%)
                  </Text>
                )}
                <Text style={S.infoTotal}>
                  Total: Ksh {(mgrAmount + invAmount + welfareAmount).toLocaleString()} = 100%
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={S.footer}>
        <Pressable
          style={[S.confirmBtn, !canConfirm && S.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!canConfirm}
        >
          <Text style={S.confirmBtnText}>Confirm setup</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </Pressable>
        {!chamaName.trim() && (
          <Text style={S.footerHint}>Enter a chama name above to continue</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: Spacing[5], paddingVertical: Spacing[3.5],
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.divider, alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    color: Colors.textPrimary, fontSize: FontSize.md,
    fontFamily: FontFamily.bold, fontWeight: FontWeight.bold,
    flex: 1, textAlign: "center",
  },

  content: {
    paddingHorizontal: Spacing[5], paddingTop: Spacing[6], paddingBottom: Spacing[12],
  },

  sectionLabel: {
    color: Colors.textMuted, fontSize: FontSize.xxs, fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold, letterSpacing: 1.2, marginBottom: Spacing[2.5],
    marginTop: Spacing[1],
  },

  // Name input
  nameCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#FFFFFF", borderRadius: Radius.input,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing[4], paddingVertical: Spacing[3.5],
    marginBottom: Spacing[7],
  },
  nameInput: {
    flex: 1, fontFamily: FontFamily.bold, fontSize: FontSize.md,
    color: Colors.textPrimary,
  },

  // Toggle Section
  toggleSection: {
    backgroundColor: Colors.surface, borderRadius: Radius.card,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing[6], overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: Spacing[4], paddingVertical: Spacing[4],
  },
  typeIcon: {
    width: 44, height: 44, borderRadius: Radius.full,
    alignItems: "center", justifyContent: "center", marginRight: Spacing[3.5],
  },
  typeIconText: { fontSize: FontSize["2xl"] },
  typeTextBlock: { flex: 1 },
  typeTitle: {
    color: Colors.textPrimary, fontSize: FontSize.md,
    fontFamily: FontFamily.bold, fontWeight: FontWeight.bold, marginBottom: 2,
  },
  typeDesc: {
    color: Colors.textSecondary, fontSize: FontSize.sm,
    fontFamily: FontFamily.regular, fontWeight: FontWeight.regular,
  },
  divider: { height: 1, backgroundColor: Colors.divider, marginHorizontal: Spacing[4] },

  // Toggle Switch
  toggleTrack: { width: 46, height: 27, borderRadius: Radius.full, padding: 3, justifyContent: "center" },
  toggleTrackOn: { backgroundColor: Colors.primary },
  toggleTrackOff: { backgroundColor: Colors.borderStrong },
  toggleThumb: { width: 21, height: 21, borderRadius: Radius.full, backgroundColor: Colors.surface, ...Shadow.sm },
  toggleThumbOn: { alignSelf: "flex-end" },
  toggleThumbOff: { alignSelf: "flex-start" },

  // Warning
  warningCard: {
    flexDirection: "row", alignItems: "center", gap: Spacing[2.5],
    backgroundColor: Colors.accentTint, borderRadius: Radius.button,
    borderWidth: 1, borderColor: Colors.warningLight,
    padding: Spacing[4], marginBottom: Spacing[4],
  },
  warningText: {
    color: Colors.warningDark, fontSize: FontSize.sm, fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold, flex: 1, lineHeight: 18,
  },

  // Split section
  splitSectionTitle: {
    color: Colors.textPrimary, fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold, fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[5], marginTop: Spacing[2],
  },

  sliderBlock: { marginBottom: Spacing[6] },
  sliderLabelRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: Spacing[3],
  },
  sliderLabel: {
    color: Colors.textSecondary, fontSize: FontSize.xxs,
    fontFamily: FontFamily.extraBold, fontWeight: FontWeight.extraBold,
    letterSpacing: 1.2, textTransform: "uppercase",
  },
  sliderPercent: {
    fontSize: FontSize.xl, fontFamily: FontFamily.extraBold, fontWeight: FontWeight.extraBold,
  },
  sliderControls: { flexDirection: "row", alignItems: "center", gap: Spacing[3] },
  stepBtn: {
    width: 40, height: 40, borderRadius: Radius.full,
    backgroundColor: Colors.divider, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: Colors.border,
  },
  stepBtnDisabled: { opacity: 0.4 },
  stepBtnText: {
    color: Colors.primary, fontSize: FontSize["3xl"],
    fontFamily: FontFamily.semiBold, fontWeight: FontWeight.semiBold, marginTop: -2,
  },
  trackBg: {
    flex: 1, height: 8, backgroundColor: Colors.border,
    borderRadius: Radius.xs, position: "relative", overflow: "hidden",
  },
  trackFill: {
    position: "absolute", left: 0, height: 8,
    backgroundColor: Colors.primary, borderRadius: Radius.xs,
  },
  trackThumb: {
    position: "absolute", width: 20, height: 20, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 3,
    borderColor: Colors.primary, top: -6,
    ...Shadow.sm,
  },

  // Info card
  infoCard: {
    flexDirection: "row", backgroundColor: Colors.successBg,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.successLight,
    padding: 18, marginTop: Spacing[2],
  },
  infoCardIcon: { fontSize: FontSize["3xl"], marginRight: Spacing[3], marginTop: 1 },
  infoCardText: { flex: 1 },
  infoCardTitle: {
    color: Colors.successDark, fontSize: FontSize.base, lineHeight: 20, marginBottom: Spacing[2.5],
  },
  infoCardBold: { fontFamily: FontFamily.extraBold, fontWeight: FontWeight.extraBold },
  infoLine: {
    color: Colors.success, fontSize: FontSize.md,
    fontFamily: FontFamily.bold, fontWeight: FontWeight.bold, marginBottom: Spacing[1],
  },
  infoBullet: { color: Colors.success, fontFamily: FontFamily.regular, fontWeight: FontWeight.regular },
  infoTotal: {
    color: Colors.textMuted, fontSize: FontSize.xs, fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold, marginTop: Spacing[2], borderTopWidth: 1,
    borderTopColor: Colors.successLight, paddingTop: Spacing[2],
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing[5], paddingTop: Spacing[3], paddingBottom: Spacing[8],
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  confirmBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.lg,
    paddingVertical: Spacing[4.5], alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 8, ...Shadow.button,
  },
  confirmBtnDisabled: { backgroundColor: Colors.textMuted },
  confirmBtnText: {
    color: Colors.textInverse, fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold, fontWeight: FontWeight.extraBold,
  },
  footerHint: {
    textAlign: "center", color: Colors.textMuted,
    fontSize: FontSize.xs, fontFamily: FontFamily.regular, marginTop: Spacing[2],
  },
});
