import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
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

function ToggleSwitch({
  isOn,
  onToggle,
}: {
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.toggleTrack,
        isOn ? styles.toggleTrackOn : styles.toggleTrackOff,
      ]}
      accessibilityRole="switch"
    >
      <View
        style={[
          styles.toggleThumb,
          isOn ? styles.toggleThumbOn : styles.toggleThumbOff,
        ]}
      />
    </Pressable>
  );
}

export default function HybridConfigScreen({ navigation, route }: any) {
  const { name, aim } = route.params || { name: "New Chama" };

  const [mgrEnabled, setMgrEnabled] = useState(true);
  const [investEnabled, setInvestEnabled] = useState(true);
  const [welfareEnabled, setWelfareEnabled] = useState(false);

  const baseContribution = 5000;
  const [mgrPercent, setMgrPercent] = useState(60);

  const activeCount = [mgrEnabled, investEnabled, welfareEnabled].filter(
    Boolean,
  ).length;

  // Derived split — welfare gets a fixed slice when enabled
  const welfarePercent = welfareEnabled ? 10 : 0;
  const remainingForMgrAndInvest = 100 - welfarePercent;

  // mgrPercent is clamped within what's available
  const clampedMgr = Math.min(mgrPercent, remainingForMgrAndInvest - 10);
  const investPercent = remainingForMgrAndInvest - clampedMgr;

  const mgrAmount = Math.round((baseContribution * clampedMgr) / 100);
  const invAmount = Math.round((baseContribution * investPercent) / 100);
  const welfareAmount = baseContribution - mgrAmount - invAmount;

  const adjustMgr = (delta: number) => {
    const max = remainingForMgrAndInvest - 10;
    const min = investEnabled ? 10 : remainingForMgrAndInvest;
    setMgrPercent((prev) => Math.min(max, Math.max(min, prev + delta)));
  };

  const handleConfirm = () => {
    navigation.navigate("InviteMembers", {
      chamaType: "HYBRID",
      name,
      aim,
      mgrPercent: clampedMgr,
      investPercent,
      welfarePercent,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Configure your hybrid chama</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>
          Choose which types to combine and set the contribution split
        </Text>

        {/* Type Toggles */}
        <View style={styles.toggleSection}>
          <Pressable
            style={styles.toggleRow}
            onPress={() => setMgrEnabled((v) => !v)}
          >
            <View style={[styles.typeIcon, { backgroundColor: "#FEF3C7" }]}>
              <Text style={styles.typeIconText}>↺</Text>
            </View>
            <View style={styles.typeTextBlock}>
              <Text style={styles.typeTitle}>Merry-go-round</Text>
              <Text style={styles.typeDesc}>Classic rotating savings</Text>
            </View>
            <ToggleSwitch
              isOn={mgrEnabled}
              onToggle={() => setMgrEnabled((v) => !v)}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.toggleRow}
            onPress={() => setInvestEnabled((v) => !v)}
          >
            <View style={[styles.typeIcon, { backgroundColor: "#DBEAFE" }]}>
              <Text style={styles.typeIconText}>📈</Text>
            </View>
            <View style={styles.typeTextBlock}>
              <Text style={styles.typeTitle}>Investment fund</Text>
              <Text style={styles.typeDesc}>Long-term wealth creation</Text>
            </View>
            <ToggleSwitch
              isOn={investEnabled}
              onToggle={() => setInvestEnabled((v) => !v)}
            />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.toggleRow}
            onPress={() => setWelfareEnabled((v) => !v)}
          >
            <View style={[styles.typeIcon, { backgroundColor: "#F3E8FF" }]}>
              <Text style={styles.typeIconText}>🤝</Text>
            </View>
            <View style={styles.typeTextBlock}>
              <Text style={styles.typeTitle}>Welfare / savings</Text>
              <Text style={styles.typeDesc}>Emergency fund for members</Text>
            </View>
            <ToggleSwitch
              isOn={welfareEnabled}
              onToggle={() => setWelfareEnabled((v) => !v)}
            />
          </Pressable>
        </View>

        {/* Split Section */}
        {activeCount >= 2 && (
          <>
            <Text style={styles.splitSectionTitle}>
              How should each contribution be split?
            </Text>

            {/* MGR Slider */}
            {mgrEnabled && (
              <View style={styles.sliderBlock}>
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderLabel}>MERRY-GO-ROUND</Text>
                  <Text style={styles.sliderPercent}>{clampedMgr}%</Text>
                </View>
                <View style={styles.sliderControls}>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => adjustMgr(-10)}
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </Pressable>
                  <View style={styles.trackBg}>
                    <View
                      style={[
                        styles.trackFill,
                        { width: `${clampedMgr}%` as any },
                      ]}
                    />
                    <View
                      style={[
                        styles.trackThumb,
                        { left: `${clampedMgr}%` as any, marginLeft: -10 },
                      ]}
                    />
                  </View>
                  <Pressable
                    style={styles.stepBtn}
                    onPress={() => adjustMgr(10)}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Investment bar (auto) */}
            {investEnabled && (
              <View style={styles.sliderBlock}>
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderLabel}>INVESTMENT FUND</Text>
                  <Text style={[styles.sliderPercent, { color: "#3B82F6" }]}>
                    {investPercent}%
                  </Text>
                </View>
                <View style={styles.trackBg}>
                  <View
                    style={[
                      styles.trackFill,
                      {
                        width: `${investPercent}%` as any,
                        backgroundColor: "#93C5FD",
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Welfare bar (auto, fixed 10%) */}
            {welfareEnabled && (
              <View style={styles.sliderBlock}>
                <View style={styles.sliderLabelRow}>
                  <Text style={styles.sliderLabel}>WELFARE</Text>
                  <Text style={[styles.sliderPercent, { color: "#7C3AED" }]}>
                    {welfarePercent}%
                  </Text>
                </View>
                <View style={styles.trackBg}>
                  <View
                    style={[
                      styles.trackFill,
                      {
                        width: `${welfarePercent}%` as any,
                        backgroundColor: "#C4B5FD",
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Breakdown info card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardIcon}>💡</Text>
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardTitle}>
                  Each{" "}
                  <Text style={styles.infoCardBold}>
                    Ksh {baseContribution.toLocaleString()}
                  </Text>{" "}
                  contribution splits as:
                </Text>
                {mgrEnabled && (
                  <Text style={styles.infoLine}>
                    <Text style={styles.infoBullet}>›</Text> Ksh{" "}
                    {mgrAmount.toLocaleString()} → MGR pot
                  </Text>
                )}
                {investEnabled && (
                  <Text style={styles.infoLine}>
                    <Text style={styles.infoBullet}>›</Text> Ksh{" "}
                    {invAmount.toLocaleString()} → Investment fund
                  </Text>
                )}
                {welfareEnabled && (
                  <Text style={styles.infoLine}>
                    <Text style={styles.infoBullet}>›</Text> Ksh{" "}
                    {welfareAmount.toLocaleString()} → Welfare pot
                  </Text>
                )}
              </View>
            </View>
          </>
        )}

        {activeCount < 2 && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              ⚠️ Please enable at least two types to create a hybrid chama.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          style={[
            styles.confirmBtn,
            activeCount < 2 && styles.confirmBtnDisabled,
          ]}
          onPress={handleConfirm}
          disabled={activeCount < 2}
        >
          <Text style={styles.confirmBtnText}>Confirm setup ›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3.5],
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: { padding: Spacing[1] },
  backText: {
    color: Colors.primary,
    fontSize: 22,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing[2],
  },
  headerSpacer: { width: 30 },

  content: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[7],
    paddingBottom: Spacing[12],
  },

  title: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 30,
    marginBottom: Spacing[7],
  },

  // Toggle Section
  toggleSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[8],
    overflow: "hidden",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[3.5],
  },
  typeIconText: { fontSize: FontSize["2xl"] },
  typeTextBlock: { flex: 1 },
  typeTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  typeDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[4],
  },

  // Toggle Switch
  toggleTrack: {
    width: 46,
    height: 27,
    borderRadius: Radius.full,
    padding: 3,
    justifyContent: "center",
  },
  toggleTrackOn: { backgroundColor: Colors.primary },
  toggleTrackOff: { backgroundColor: Colors.borderStrong },
  toggleThumb: {
    width: 21,
    height: 21,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  toggleThumbOn: { alignSelf: "flex-end" },
  toggleThumbOff: { alignSelf: "flex-start" },

  // Split section
  splitSectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[6],
  },

  sliderBlock: { marginBottom: Spacing[6] },
  sliderLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  sliderLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sliderPercent: {
    color: Colors.primary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  sliderControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.divider,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtnText: {
    color: Colors.primary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    marginTop: -2,
  },

  trackBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radius.xs,
    position: "relative",
    justifyContent: "center",
    overflow: "visible",
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
  },
  trackThumb: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.primary,
    top: -7,
    ...Shadow.sm,
  },

  // Info card
  infoCard: {
    flexDirection: "row",
    backgroundColor: Colors.successBg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.successLight,
    padding: 18,
    marginTop: Spacing[2],
  },
  infoCardIcon: {
    fontSize: FontSize["3xl"],
    marginRight: Spacing[3],
    marginTop: 1,
  },
  infoCardText: { flex: 1 },
  infoCardTitle: {
    color: Colors.successDark,
    fontSize: FontSize.base,
    lineHeight: 20,
    marginBottom: Spacing[2.5],
  },
  infoCardBold: {
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  infoLine: {
    color: Colors.success,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing[1],
  },
  infoBullet: {
    color: Colors.success,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // Warning
  warningCard: {
    backgroundColor: Colors.accentTint,
    borderRadius: Radius.button,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    padding: Spacing[4],
    marginTop: Spacing[2],
  },
  warningText: {
    color: Colors.warningDark,
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    lineHeight: 20,
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[8],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4.5],
    alignItems: "center",
    ...Shadow.button,
  },
  confirmBtnDisabled: { backgroundColor: Colors.textMuted },
  confirmBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
});
