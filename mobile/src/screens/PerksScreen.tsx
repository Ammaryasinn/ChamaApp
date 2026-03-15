import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
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

const CATEGORIES = [
  { id: "all", label: "All", icon: "grid" },
  { id: "food", label: "Food", icon: "coffee" },
  { id: "tech", label: "Tech", icon: "smartphone" },
  { id: "appliances", label: "Appliances", icon: "home" },
  { id: "fashion", label: "Fashion", icon: "shopping-bag" },
  { id: "health", label: "Health", icon: "heart" },
  { id: "transport", label: "Transport", icon: "truck" },
] as const;

type Category = (typeof CATEGORIES)[number]["id"];

const PARTNERS = [
  {
    id: "1",
    name: "Chicken Inn",
    tagline: "Kenya's favourite chicken",
    category: "food",
    initials: "CI",
    color: "#DC2626",
    bg: "#FEE2E2",
    deals: 2,
    featured: true,
  },
  {
    id: "2",
    name: "Java House",
    tagline: "Coffee & comfort food",
    category: "food",
    initials: "JH",
    color: "#92400E",
    bg: "#FEF3C7",
    deals: 1,
    featured: true,
  },
  {
    id: "3",
    name: "Jumia Kenya",
    tagline: "Africa's online marketplace",
    category: "tech",
    initials: "JM",
    color: "#D97706",
    bg: "#FEF3C7",
    deals: 3,
    featured: true,
  },
  {
    id: "4",
    name: "Hotpoint",
    tagline: "Quality home appliances",
    category: "appliances",
    initials: "HP",
    color: "#2563EB",
    bg: "#EFF6FF",
    deals: 1,
    featured: true,
  },
  {
    id: "5",
    name: "Naivas",
    tagline: "Fresh groceries everyday",
    category: "food",
    initials: "NV",
    color: "#059669",
    bg: "#ECFDF5",
    deals: 2,
    featured: false,
  },
  {
    id: "6",
    name: "Mr Price",
    tagline: "Fashion for everyone",
    category: "fashion",
    initials: "MP",
    color: "#7C3AED",
    bg: "#F5F3FF",
    deals: 1,
    featured: false,
  },
];

const DEALS = [
  {
    id: "d1",
    partnerId: "1",
    partnerName: "Chicken Inn",
    partnerInitials: "CI",
    partnerColor: "#DC2626",
    partnerBg: "#FEE2E2",
    category: "food",
    title: "20% off your next meal",
    description:
      "Valid at all Chicken Inn branches countrywide. Dine-in and takeaway. Present code at till.",
    discount: "20% OFF",
    code: "HAZINA20",
    validUntil: "Mar 31, 2026",
    claimed: 1204,
    isNew: false,
    expiringSoon: false,
    exclusive: true,
  },
  {
    id: "d2",
    partnerId: "3",
    partnerName: "Jumia Kenya",
    partnerInitials: "JM",
    partnerColor: "#D97706",
    partnerBg: "#FEF3C7",
    category: "tech",
    title: "KES 500 off electronics",
    description:
      "Min. order of KES 3,000 on electronics, phones, and accessories. One use per account.",
    discount: "KES 500",
    code: "HJUMIA500",
    validUntil: "Apr 15, 2026",
    claimed: 873,
    isNew: true,
    expiringSoon: false,
    exclusive: true,
  },
  {
    id: "d3",
    partnerId: "4",
    partnerName: "Hotpoint",
    partnerInitials: "HP",
    partnerColor: "#2563EB",
    partnerBg: "#EFF6FF",
    category: "appliances",
    title: "15% off kitchen appliances",
    description:
      "Refrigerators, microwaves, blenders and more. Valid in-store and online at hotpoint.co.ke.",
    discount: "15% OFF",
    code: "HZNAPPLIANCE",
    validUntil: "Mar 20, 2026",
    claimed: 356,
    isNew: false,
    expiringSoon: true,
    exclusive: true,
  },
  {
    id: "d4",
    partnerId: "2",
    partnerName: "Java House",
    partnerInitials: "JH",
    partnerColor: "#92400E",
    partnerBg: "#FEF3C7",
    category: "food",
    title: "Buy 1 get 1 free — any coffee",
    description:
      "Valid on all hot and cold coffee beverages. Any Java House branch. Weekdays only.",
    discount: "BOGO",
    code: "JAVAHAZINA",
    validUntil: "Apr 30, 2026",
    claimed: 2107,
    isNew: false,
    expiringSoon: false,
    exclusive: false,
  },
  {
    id: "d5",
    partnerId: "5",
    partnerName: "Naivas",
    partnerInitials: "NV",
    partnerColor: "#059669",
    partnerBg: "#ECFDF5",
    category: "food",
    title: "10% off groceries",
    description:
      "Valid on total grocery bills above KES 1,500. Any Naivas branch countrywide.",
    discount: "10% OFF",
    code: "NAIVASHAZ10",
    validUntil: "Apr 10, 2026",
    claimed: 991,
    isNew: false,
    expiringSoon: false,
    exclusive: false,
  },
  {
    id: "d6",
    partnerId: "6",
    partnerName: "Mr Price",
    partnerInitials: "MP",
    partnerColor: "#7C3AED",
    partnerBg: "#F5F3FF",
    category: "fashion",
    title: "25% off full-price clothing",
    description:
      "Valid on full-price items only. Not applicable with other offers. All Mr Price branches.",
    discount: "25% OFF",
    code: "MRPHAZINA",
    validUntil: "May 1, 2026",
    claimed: 418,
    isNew: true,
    expiringSoon: false,
    exclusive: true,
  },
  {
    id: "d7",
    partnerId: "3",
    partnerName: "Jumia Kenya",
    partnerInitials: "JM",
    partnerColor: "#D97706",
    partnerBg: "#FEF3C7",
    category: "tech",
    title: "Free delivery on any order",
    description:
      "Free delivery islandwide. No minimum order. Valid for 30 days from claim date.",
    discount: "FREE DELIVERY",
    code: "HJUMIAFREE",
    validUntil: "Apr 30, 2026",
    claimed: 3342,
    isNew: false,
    expiringSoon: false,
    exclusive: false,
  },
  {
    id: "d8",
    partnerId: "1",
    partnerName: "Chicken Inn",
    partnerInitials: "CI",
    partnerColor: "#DC2626",
    partnerBg: "#FEE2E2",
    category: "food",
    title: "Free drink with any combo meal",
    description:
      "Redeem a free 500ml Pepsi, Mirinda, or water with any combo meal purchase.",
    discount: "FREE DRINK",
    code: "CIDRINK",
    validUntil: "Mar 25, 2026",
    claimed: 587,
    isNew: false,
    expiringSoon: true,
    exclusive: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PartnerCard({ partner }: { partner: (typeof PARTNERS)[number] }) {
  return (
    <View style={partnerStyles.card}>
      <View style={[partnerStyles.logo, { backgroundColor: partner.bg }]}>
        <Text style={[partnerStyles.logoText, { color: partner.color }]}>
          {partner.initials}
        </Text>
      </View>
      <Text style={partnerStyles.name} numberOfLines={1}>
        {partner.name}
      </Text>
      <View style={[partnerStyles.dealBadge, { backgroundColor: partner.bg }]}>
        <Text style={[partnerStyles.dealCount, { color: partner.color }]}>
          {partner.deals} deal{partner.deals !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
}

const partnerStyles = StyleSheet.create({
  card: {
    width: 90,
    alignItems: "center",
    gap: Spacing[1.5],
    marginRight: Spacing[3],
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.xs,
  },
  logoText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    textAlign: "center",
  },
  dealBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  dealCount: {
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
});

function DealCard({
  deal,
  onClaim,
}: {
  deal: (typeof DEALS)[number];
  onClaim: (code: string, partnerName: string) => void;
}) {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    onClaim(deal.code, deal.partnerName);
  };

  return (
    <View style={dealStyles.card}>
      {/* Top badges */}
      <View style={dealStyles.badgeRow}>
        {deal.isNew && (
          <View style={dealStyles.newBadge}>
            <Text style={dealStyles.newBadgeText}>NEW</Text>
          </View>
        )}
        {deal.expiringSoon && (
          <View style={dealStyles.expiringBadge}>
            <Feather name="clock" size={10} color={Colors.warningDark} />
            <Text style={dealStyles.expiringText}>Expiring soon</Text>
          </View>
        )}
        {deal.exclusive && (
          <View style={dealStyles.exclusiveBadge}>
            <Feather name="star" size={10} color={Colors.primary} />
            <Text style={dealStyles.exclusiveText}>Hazina exclusive</Text>
          </View>
        )}
      </View>

      {/* Partner row */}
      <View style={dealStyles.partnerRow}>
        <View
          style={[dealStyles.partnerLogo, { backgroundColor: deal.partnerBg }]}
        >
          <Text
            style={[dealStyles.partnerLogoText, { color: deal.partnerColor }]}
          >
            {deal.partnerInitials}
          </Text>
        </View>
        <View style={dealStyles.partnerMeta}>
          <Text style={dealStyles.partnerName}>{deal.partnerName}</Text>
          <Text style={dealStyles.categoryLabel}>
            {CATEGORIES.find((c) => c.id === deal.category)?.label ?? ""}
          </Text>
        </View>
        <View
          style={[dealStyles.discountPill, { backgroundColor: deal.partnerBg }]}
        >
          <Text style={[dealStyles.discountText, { color: deal.partnerColor }]}>
            {deal.discount}
          </Text>
        </View>
      </View>

      {/* Deal title + description */}
      <Text style={dealStyles.title}>{deal.title}</Text>
      <Text style={dealStyles.description}>{deal.description}</Text>

      {/* Coupon code row */}
      <View style={dealStyles.codeRow}>
        <View style={dealStyles.codeBox}>
          <Text style={dealStyles.codeLabel}>COUPON CODE</Text>
          <Text style={dealStyles.codeValue}>{deal.code}</Text>
        </View>
        <Pressable
          style={[dealStyles.claimBtn, claimed && dealStyles.claimBtnClaimed]}
          onPress={handleClaim}
          disabled={claimed}
        >
          <Feather
            name={claimed ? "check" : "copy"}
            size={14}
            color={claimed ? Colors.success : Colors.textInverse}
          />
          <Text
            style={[
              dealStyles.claimBtnText,
              claimed && dealStyles.claimBtnTextClaimed,
            ]}
          >
            {claimed ? "Copied!" : "Copy code"}
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={dealStyles.footer}>
        <View style={dealStyles.footerLeft}>
          <Feather name="calendar" size={11} color={Colors.textMuted} />
          <Text style={dealStyles.validUntil}>
            Valid until {deal.validUntil}
          </Text>
        </View>
        <View style={dealStyles.footerRight}>
          <Feather name="users" size={11} color={Colors.textMuted} />
          <Text style={dealStyles.claimedCount}>
            {deal.claimed.toLocaleString()} claimed
          </Text>
        </View>
      </View>
    </View>
  );
}

const dealStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    ...Shadow.sm,
  },

  badgeRow: {
    flexDirection: "row",
    gap: Spacing[2],
    marginBottom: Spacing[3],
    flexWrap: "wrap",
  },
  newBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  newBadgeText: {
    color: Colors.textInverse,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.8,
  },
  expiringBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  expiringText: {
    color: Colors.warningDark,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  exclusiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primaryTint,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  exclusiveText: {
    color: Colors.primary,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[3],
    gap: Spacing[3],
  },
  partnerLogo: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  partnerLogoText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  partnerMeta: { flex: 1 },
  partnerName: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 1,
  },
  categoryLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  discountPill: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.badge,
  },
  discountText: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 0.3,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1.5],
    lineHeight: 22,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 19,
    marginBottom: Spacing[4],
  },

  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  codeBox: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.input,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2.5],
  },
  codeLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  codeValue: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.5,
  },
  claimBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[3],
    borderRadius: Radius.input,
    ...Shadow.button,
  },
  claimBtnClaimed: {
    backgroundColor: Colors.successBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  claimBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  claimBtnTextClaimed: {
    color: Colors.success,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
  },
  validUntil: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  claimedCount: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PerksScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filteredDeals =
    activeCategory === "all"
      ? DEALS
      : DEALS.filter((d) => d.category === activeCategory);

  const featuredPartners = PARTNERS.filter((p) => p.featured);

  const handleClaim = (code: string, partnerName: string) => {
    Alert.alert(
      "Code copied! 🎉",
      `Your coupon code for ${partnerName} is:\n\n${code}\n\nPresent this at checkout to redeem your discount.`,
      [{ text: "Got it", style: "default" }],
    );
  };

  const newDeals = DEALS.filter((d) => d.isNew).length;
  const expiringDeals = DEALS.filter((d) => d.expiringSoon).length;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Dark hero ── */}
        <LinearGradient
          colors={[Colors.surfaceDeepDark, Colors.surfaceDark, "#0D2E22"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Header row */}
          <View style={styles.heroHeader}>
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
            <Pressable style={styles.searchBtn} hitSlop={8}>
              <Feather name="search" size={18} color={Colors.textInverseSoft} />
            </Pressable>
          </View>

          {/* Title block */}
          <View style={styles.heroBody}>
            <View style={styles.heroIconWrap}>
              <Feather name="gift" size={26} color={Colors.accent} />
            </View>
            <Text style={styles.heroOverline}>MEMBER PERKS</Text>
            <Text style={styles.heroTitle}>
              Savings built{"\n"}for Hazina members
            </Text>
            <Text style={styles.heroSub}>
              Exclusive deals from Kenya's top brands — yours because you save.
            </Text>
          </View>

          {/* Stats pills */}
          <View style={styles.statsPills}>
            <View style={styles.statPill}>
              <Text style={styles.statPillValue}>{DEALS.length}</Text>
              <Text style={styles.statPillLabel}>active deals</Text>
            </View>
            <View style={styles.statPillDivider} />
            <View style={styles.statPill}>
              <Text style={styles.statPillValue}>{PARTNERS.length}</Text>
              <Text style={styles.statPillLabel}>partners</Text>
            </View>
            {newDeals > 0 && (
              <>
                <View style={styles.statPillDivider} />
                <View style={[styles.statPill, styles.statPillAmber]}>
                  <Feather name="star" size={12} color={Colors.accent} />
                  <Text
                    style={[styles.statPillLabel, { color: Colors.accent }]}
                  >
                    {newDeals} new this week
                  </Text>
                </View>
              </>
            )}
          </View>
        </LinearGradient>

        {/* ── White content ── */}
        <View style={styles.content}>
          {/* Featured partners */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured partners</Text>
              <Text style={styles.sectionCount}>{PARTNERS.length} brands</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.partnersScroll}
            >
              {featuredPartners.map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
              {/* Become a partner CTA */}
              <Pressable style={styles.becomePartnerCard}>
                <View style={styles.becomePartnerIcon}>
                  <Feather name="plus" size={22} color={Colors.primary} />
                </View>
                <Text style={styles.becomePartnerText}>
                  List your{"\n"}brand
                </Text>
              </Pressable>
            </ScrollView>
          </View>

          {/* Expiring soon banner */}
          {expiringDeals > 0 && (
            <Pressable
              style={styles.expirBanner}
              onPress={() => setActiveCategory("all")}
            >
              <View style={styles.expirBannerLeft}>
                <Feather name="clock" size={16} color={Colors.warningDark} />
                <View>
                  <Text style={styles.expirBannerTitle}>
                    {expiringDeals} deal{expiringDeals !== 1 ? "s" : ""}{" "}
                    expiring soon
                  </Text>
                  <Text style={styles.expirBannerSub}>
                    Grab them before they're gone
                  </Text>
                </View>
              </View>
              <Feather
                name="chevron-right"
                size={16}
                color={Colors.warningDark}
              />
            </Pressable>
          )}

          {/* Category filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
            style={styles.filterBar}
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setActiveCategory(cat.id)}
                >
                  <Feather
                    name={cat.icon as any}
                    size={13}
                    color={active ? Colors.textInverse : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      active && styles.filterChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Deals feed */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeCategory === "all"
                  ? "All deals"
                  : CATEGORIES.find((c) => c.id === activeCategory)?.label +
                    " deals"}
              </Text>
              <Text style={styles.sectionCount}>
                {filteredDeals.length} available
              </Text>
            </View>

            {filteredDeals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>
                  No deals in this category yet
                </Text>
                <Text style={styles.emptyDesc}>
                  More partner deals are being added every week. Check back
                  soon!
                </Text>
                <Pressable
                  style={styles.emptyBtn}
                  onPress={() => setActiveCategory("all")}
                >
                  <Text style={styles.emptyBtnText}>View all deals</Text>
                </Pressable>
              </View>
            ) : (
              filteredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} onClaim={handleClaim} />
              ))
            )}
          </View>

          {/* Become a partner banner */}
          <LinearGradient
            colors={[Colors.surfaceDark, "#0D2E22"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.partnerBanner}
          >
            <View style={styles.partnerBannerLeft}>
              <Text style={styles.partnerBannerTitle}>Are you a brand?</Text>
              <Text style={styles.partnerBannerSub}>
                Reach 50,000+ financially-active Kenyans saving together. List
                your deals free for the first 3 months.
              </Text>
              <Pressable style={styles.partnerBannerBtn}>
                <Text style={styles.partnerBannerBtnText}>
                  Become a partner →
                </Text>
              </Pressable>
            </View>
            <Text style={styles.partnerBannerEmoji}>🤝</Text>
          </LinearGradient>

          {/* How it works */}
          <View style={styles.howSection}>
            <Text style={styles.howTitle}>How member perks work</Text>
            {[
              {
                icon: "check-circle",
                title: "Save consistently",
                desc: "Active Hazina members unlock access to all partner deals automatically.",
              },
              {
                icon: "copy",
                title: "Copy the coupon code",
                desc: "Tap 'Copy code' on any deal — the code is copied to your clipboard instantly.",
              },
              {
                icon: "shopping-bag",
                title: "Redeem at checkout",
                desc: "Present the code in-store or paste it online at checkout to claim your discount.",
              },
            ].map((step, i) => (
              <View key={i} style={styles.howStep}>
                <View style={styles.howStepNumber}>
                  <Text style={styles.howStepNumberText}>{i + 1}</Text>
                </View>
                <View style={styles.howStepIcon}>
                  <Feather
                    name={step.icon as any}
                    size={18}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.howStepText}>
                  <Text style={styles.howStepTitle}>{step.title}</Text>
                  <Text style={styles.howStepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: Spacing[8] }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },

  // Hero
  hero: {
    paddingBottom: Spacing[6],
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[3],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBody: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[5],
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[4],
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
    marginBottom: Spacing[2],
  },
  heroSub: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    opacity: 0.85,
  },

  // Stats pills row
  statsPills: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing[5],
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: Radius.card,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[3],
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
  },
  statPillAmber: {},
  statPillDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  statPillValue: {
    color: Colors.textInverse,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  statPillLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // Content
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    marginTop: -Spacing[4],
    paddingTop: Spacing[6],
    ...Shadow.heroCard,
  },

  // Section
  section: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[6],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  sectionCount: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    backgroundColor: Colors.divider,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },

  // Partners scroll
  partnersScroll: {
    paddingRight: Spacing[5],
  },
  becomePartnerCard: {
    width: 90,
    alignItems: "center",
    gap: Spacing[1.5],
    justifyContent: "center",
  },
  becomePartnerIcon: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryTint,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  becomePartnerText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
    textAlign: "center",
    lineHeight: 16,
  },

  // Expiring soon banner
  expirBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: Colors.warningLight,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[4],
  },
  expirBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    flex: 1,
  },
  expirBannerTitle: {
    color: Colors.warningDark,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  expirBannerSub: {
    color: Colors.warning,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // Category filter
  filterBar: {
    marginBottom: Spacing[5],
  },
  filterScroll: {
    paddingHorizontal: Spacing[5],
    gap: Spacing[2],
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.xs,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  filterChipTextActive: {
    color: Colors.textInverse,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
  },
  emptyIcon: { fontSize: 40, marginBottom: Spacing[4] },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    textAlign: "center",
    marginBottom: Spacing[2],
  },
  emptyDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing[5],
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    borderRadius: Radius.button,
    ...Shadow.button,
  },
  emptyBtnText: {
    color: Colors.textInverse,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Partner banner
  partnerBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[6],
    borderRadius: Radius.card,
    padding: Spacing[5],
    ...Shadow.md,
  },
  partnerBannerLeft: { flex: 1, marginRight: Spacing[3] },
  partnerBannerTitle: {
    color: Colors.textInverse,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[1],
  },
  partnerBannerSub: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 17,
    marginBottom: Spacing[4],
    opacity: 0.85,
  },
  partnerBannerBtn: {
    alignSelf: "flex-start",
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.button,
  },
  partnerBannerBtnText: {
    color: Colors.surfaceDark,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  partnerBannerEmoji: {
    fontSize: 44,
    opacity: 0.9,
  },

  // How it works
  howSection: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
  },
  howTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[5],
  },
  howStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[3],
    marginBottom: Spacing[5],
  },
  howStepNumber: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  howStepNumberText: {
    color: Colors.textInverse,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  howStepIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.input,
    backgroundColor: Colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  howStepText: { flex: 1 },
  howStepTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 4,
  },
  howStepDesc: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 19,
  },
});
