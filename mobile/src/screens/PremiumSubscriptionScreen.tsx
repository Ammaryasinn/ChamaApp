import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import {
  Colors,
  FontFamily,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../theme";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: "bure",
    name: "Bure",
    tagline: "Get started free",
    monthlyPrice: 0,
    badge: null,
    badgeColor: null,
    accentColor: Colors.textMuted,
    features: [
      { text: "Up to 10 members", included: true },
      { text: "M-Pesa contribution collection", included: true },
      { text: "Live group balance", included: true },
      { text: "Paid / unpaid tracker", included: true },
      { text: "Auto penalty calculator", included: true },
      { text: "Transaction history", included: true },
      { text: "MGR rotation tracker", included: false },
      { text: "Internal loan system", included: false },
      { text: "Hazina Credit Score", included: false },
      { text: "Bank loan offers", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "The full system",
    monthlyPrice: 999,
    badge: "MOST POPULAR",
    badgeColor: Colors.accent,
    accentColor: Colors.primary,
    features: [
      { text: "Unlimited members", included: true },
      { text: "Everything in Free", included: true },
      { text: "MGR rotation + swap requests", included: true },
      { text: "Internal loan voting system", included: true },
      { text: "Hybrid chama builder", included: true },
      { text: "Annual PDF financial report", included: true },
      { text: "Hazina Credit Score — full history", included: true },
      { text: "Pre-qualified bank loan offers", included: true },
      { text: "Priority support", included: true },
      { text: "Investment portfolio tracking", included: true },
    ],
  },
  {
    id: "taasisi",
    name: "Taasisi",
    tagline: "For SACCOs & institutions",
    monthlyPrice: 9999,
    badge: "INSTITUTION",
    badgeColor: "#7C3AED",
    accentColor: "#7C3AED",
    features: [
      { text: "Up to 20 chamas, one dashboard", included: true },
      { text: "Everything in Premium", included: true },
      { text: "Bulk M-Pesa across all groups", included: true },
      { text: "Cross-chama reporting", included: true },
      { text: "Custom branding — your logo", included: true },
      { text: "Direct bank API integration", included: true },
      { text: "Group loan product", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SLA-backed uptime guarantee", included: true },
      { text: "Annual audit-ready export", included: true },
    ],
  },
];

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({
  text,
  included,
  accentColor,
}: {
  text: string;
  included: boolean;
  accentColor: string;
}) {
  return (
    <View style={featureStyles.row}>
      <View
        style={[
          featureStyles.iconWrap,
          { backgroundColor: included ? `${accentColor}18` : Colors.divider },
        ]}
      >
        <Feather
          name={included ? "check" : "minus"}
          size={11}
          color={included ? accentColor : Colors.textMuted}
        />
      </View>
      <Text style={[featureStyles.text, !included && featureStyles.textDimmed]}>
        {text}
      </Text>
    </View>
  );
}

const featureStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2.5],
    paddingVertical: 5,
  },
  iconWrap: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  text: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
  },
  textDimmed: {
    color: Colors.textMuted,
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
});

// ─── Tier card ────────────────────────────────────────────────────────────────

function TierCard({
  tier,
  annual,
  selected,
  onSelect,
}: {
  tier: (typeof TIERS)[number];
  annual: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const price = annual
    ? Math.round(tier.monthlyPrice * 0.75)
    : tier.monthlyPrice;
  const isFree = tier.monthlyPrice === 0;
  const saving =
    annual && !isFree
      ? `Save ${Math.round(tier.monthlyPrice * 0.25 * 12).toLocaleString()}/yr`
      : null;

  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.tierCard,
        selected && { borderColor: tier.accentColor, borderWidth: 2 },
      ]}
    >
      {/* Tier header */}
      <View style={styles.tierHeader}>
        <View style={styles.tierNameRow}>
          <Text style={styles.tierName}>{tier.name}</Text>
          {tier.badge && (
            <View
              style={[
                styles.tierBadge,
                { backgroundColor: `${tier.badgeColor}22` },
              ]}
            >
              <Text style={[styles.tierBadgeText, { color: tier.badgeColor! }]}>
                {tier.badge}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.tierTagline}>{tier.tagline}</Text>
      </View>

      {/* Price */}
      <View style={styles.priceBlock}>
        {isFree ? (
          <Text style={styles.priceMain}>Free forever</Text>
        ) : (
          <View style={styles.priceRow}>
            <Text style={styles.priceCurrency}>KES </Text>
            <Text style={styles.priceAmount}>{price.toLocaleString()}</Text>
            <Text style={styles.pricePeriod}>/mo</Text>
          </View>
        )}
        {saving && (
          <View style={styles.savingPill}>
            <Text style={styles.savingText}>{saving}</Text>
          </View>
        )}
        {annual && !isFree && (
          <Text style={styles.billedNote}>
            Billed KES {(price * 12).toLocaleString()} annually
          </Text>
        )}
      </View>

      {/* Divider */}
      <View style={styles.tierDivider} />

      {/* Features */}
      <View style={styles.featureList}>
        {tier.features.map((f, i) => (
          <FeatureRow
            key={i}
            text={f.text}
            included={f.included}
            accentColor={tier.accentColor}
          />
        ))}
      </View>

      {/* CTA */}
      <Pressable
        style={[
          styles.tierCta,
          isFree && styles.tierCtaOutline,
          { borderColor: tier.accentColor },
          !isFree && { backgroundColor: tier.accentColor },
        ]}
      >
        <Text
          style={[
            styles.tierCtaText,
            isFree
              ? { color: tier.accentColor }
              : { color: Colors.textInverse },
          ]}
        >
          {isFree ? "Current plan" : `Get ${tier.name}`}
        </Text>
        {!isFree && (
          <Feather name="arrow-right" size={16} color={Colors.textInverse} />
        )}
      </Pressable>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PremiumSubscriptionScreen({ navigation }: any) {
  const [annual, setAnnual] = useState(false);
  const [selectedTier, setSelectedTier] = useState("premium");

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Dark hero header ── */}
        <LinearGradient
          colors={[Colors.surfaceDeepDark, Colors.surfaceDark, "#0D2E22"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Back button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Feather
              name="arrow-left"
              size={20}
              color={Colors.textInverseSoft}
            />
          </Pressable>

          {/* Icon */}
          <View style={styles.heroIconWrap}>
            <Feather name="star" size={28} color={Colors.accent} />
          </View>

          <Text style={styles.heroOverline}>HAZINA PLANS</Text>
          <Text style={styles.heroTitle}>Upgrade your{"\n"}chama's power</Text>
          <Text style={styles.heroSubtitle}>
            From free tracking to full financial infrastructure — choose the
            plan that fits your group.
          </Text>

          {/* Annual / monthly toggle */}
          <View style={styles.toggleRow}>
            <Text
              style={[styles.toggleLabel, !annual && styles.toggleLabelActive]}
            >
              Monthly
            </Text>
            <Switch
              value={annual}
              onValueChange={setAnnual}
              trackColor={{ false: Colors.borderStrong, true: Colors.primary }}
              thumbColor={Colors.surface}
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
            <Text
              style={[styles.toggleLabel, annual && styles.toggleLabelActive]}
            >
              Annual
            </Text>
            {annual && (
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save 25%</Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* ── Tier cards ── */}
        <View style={styles.tiersSection}>
          {TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              annual={annual}
              selected={selectedTier === tier.id}
              onSelect={() => setSelectedTier(tier.id)}
            />
          ))}
        </View>

        {/* ── Trust signals ── */}
        <View style={styles.trustRow}>
          <TrustItem icon="shield" text="Secure M-Pesa payments" />
          <TrustItem icon="refresh-cw" text="Cancel anytime" />
          <TrustItem icon="lock" text="Bank-grade security" />
        </View>

        {/* ── FAQ ── */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Common questions</Text>

          <FaqItem
            q="Can I switch plans later?"
            a="Yes. Upgrade or downgrade at any time from your profile settings. Changes take effect on your next billing date."
          />
          <FaqItem
            q="How is Premium billed?"
            a="Monthly or annually — paid via M-Pesa Paybill. Annual billing saves you 25% and unlocks a priority onboarding call."
          />
          <FaqItem
            q="What happens if I downgrade?"
            a="Your data is never deleted. Features are locked until you re-upgrade, but your history and contributions remain intact."
          />
          <FaqItem
            q="Does Taasisi support SACCOs?"
            a="Yes. Taasisi is built for organisations running multiple chamas — SACCOs, churches, estate managers, and co-operatives."
          />
        </View>

        <View style={{ height: Spacing[12] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Trust item ───────────────────────────────────────────────────────────────

function TrustItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={trustStyles.item}>
      <Feather name={icon as any} size={16} color={Colors.primary} />
      <Text style={trustStyles.text}>{text}</Text>
    </View>
  );
}

const trustStyles = StyleSheet.create({
  item: {
    alignItems: "center",
    gap: Spacing[1.5],
    flex: 1,
  },
  text: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.medium,
    fontWeight: FontWeight.medium,
    textAlign: "center",
    lineHeight: 16,
  },
});

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable style={faqStyles.item} onPress={() => setOpen(!open)}>
      <View style={faqStyles.qRow}>
        <Text style={faqStyles.question}>{q}</Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={Colors.textMuted}
        />
      </View>
      {open && <Text style={faqStyles.answer}>{a}</Text>}
    </Pressable>
  );
}

const faqStyles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingVertical: Spacing[4],
  },
  qRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing[3],
  },
  question: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    lineHeight: 22,
  },
  answer: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    marginTop: Spacing[2],
  },
});

// ─── Main styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },

  // Hero
  hero: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[9],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[6],
  },
  heroIconWrap: {
    width: 58,
    height: 58,
    borderRadius: Radius.cardLg,
    backgroundColor: "rgba(245,158,11,0.12)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[5],
  },
  heroOverline: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 2,
    marginBottom: Spacing[2],
  },
  heroTitle: {
    color: Colors.textInverse,
    fontSize: FontSize["6xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: Spacing[3],
  },
  heroSubtitle: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 22,
    opacity: 0.85,
    marginBottom: Spacing[7],
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  toggleLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    opacity: 0.6,
  },
  toggleLabelActive: {
    color: Colors.textInverse,
    opacity: 1,
  },
  saveBadge: {
    backgroundColor: `${Colors.accent}22`,
    borderWidth: 1,
    borderColor: `${Colors.accent}44`,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  saveBadgeText: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },

  // Tiers
  tiersSection: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    gap: Spacing[4],
  },
  tierCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.cardLg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing[5],
    ...Shadow.md,
  },
  tierHeader: {
    marginBottom: Spacing[4],
  },
  tierNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: Spacing[1],
  },
  tierName: {
    color: Colors.textPrimary,
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  tierBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  tierBadgeText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.5,
  },
  tierTagline: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // Price
  priceBlock: {
    marginBottom: Spacing[4],
  },
  priceMain: {
    color: Colors.textPrimary,
    fontSize: FontSize["3xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceCurrency: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  priceAmount: {
    color: Colors.textPrimary,
    fontSize: FontSize["5xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: -1,
  },
  pricePeriod: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginLeft: 2,
  },
  savingPill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.successBg,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: Spacing[1.5],
    marginBottom: 2,
  },
  savingText: {
    color: Colors.success,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  billedNote: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginTop: 4,
  },

  // Tier body
  tierDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: Spacing[4],
  },
  featureList: {
    marginBottom: Spacing[5],
  },

  // CTA
  tierCta: {
    borderRadius: Radius.button,
    paddingVertical: Spacing[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },
  tierCtaOutline: {
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  tierCtaText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.2,
  },

  // Trust
  trustRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[7],
    gap: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: Spacing[6],
  },

  // FAQ
  faqSection: {
    paddingHorizontal: Spacing[5],
  },
  faqTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize["2xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[2],
  },
});
