import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
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
import { LineChart, SparkLine } from "../components/LineChart";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - Spacing[5] * 2;
const CHART_HEIGHT = 160;

// ─── Mock data ────────────────────────────────────────────────────────────────

const PORTFOLIO_DATA: Record<string, number[]> = {
  "1W": [420000, 425000, 422000, 430000, 435000, 438000, 445000],
  "1M": [
    390000, 395000, 400000, 398000, 410000, 415000, 420000, 425000, 430000,
    435000, 438000, 445000,
  ],
  "3M": [
    340000, 348000, 355000, 350000, 360000, 372000, 368000, 375000, 382000,
    390000, 400000, 410000, 420000, 430000, 445000,
  ],
  "6M": [
    280000, 290000, 285000, 295000, 300000, 310000, 308000, 318000, 325000,
    330000, 340000, 348000, 355000, 365000, 375000, 385000, 395000, 405000,
    415000, 430000, 445000,
  ],
  "1Y": [
    210000, 220000, 215000, 225000, 230000, 240000, 238000, 248000, 255000,
    260000, 270000, 278000, 285000, 280000, 290000, 295000, 305000, 310000,
    320000, 330000, 340000, 350000, 360000, 375000, 390000, 400000, 415000,
    430000, 445000,
  ],
};

const STOCKS = [
  {
    ticker: "SCOM",
    name: "Safaricom",
    price: 28.5,
    change: 3.2,
    volume: "42.1M",
    mktCap: "1.14T",
    sparkData: [26.1, 26.8, 27.2, 26.9, 27.5, 28.0, 27.8, 28.5],
    held: true,
    shares: 5000,
  },
  {
    ticker: "KCB",
    name: "KCB Group",
    price: 42.75,
    change: -1.1,
    volume: "8.3M",
    mktCap: "137.3B",
    sparkData: [44.2, 43.8, 43.5, 43.9, 43.2, 42.9, 43.1, 42.75],
    held: true,
    shares: 2000,
  },
  {
    ticker: "EQTY",
    name: "Equity Group",
    price: 51.0,
    change: 2.8,
    volume: "6.9M",
    mktCap: "195.1B",
    sparkData: [48.5, 49.0, 49.5, 49.2, 50.0, 50.5, 50.8, 51.0],
    held: false,
    shares: 0,
  },
  {
    ticker: "EABL",
    name: "East African Breweries",
    price: 168.0,
    change: 0.6,
    volume: "1.1M",
    mktCap: "133.2B",
    sparkData: [165.0, 166.0, 165.5, 166.5, 167.0, 167.5, 167.8, 168.0],
    held: true,
    shares: 300,
  },
  {
    ticker: "COOP",
    name: "Co-operative Bank",
    price: 13.45,
    change: -0.4,
    volume: "5.2M",
    mktCap: "79.0B",
    sparkData: [13.8, 13.7, 13.6, 13.65, 13.5, 13.55, 13.48, 13.45],
    held: false,
    shares: 0,
  },
  {
    ticker: "BAMB",
    name: "Bamburi Cement",
    price: 42.0,
    change: 1.4,
    volume: "0.8M",
    mktCap: "15.2B",
    sparkData: [40.5, 40.8, 41.0, 41.2, 41.5, 41.8, 41.9, 42.0],
    held: false,
    shares: 0,
  },
];

const HOLDINGS = STOCKS.filter((s) => s.held);

const TIME_RANGES = ["1W", "1M", "3M", "6M", "1Y"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(2);
}

function portfolioReturn(data: number[]): number {
  if (data.length < 2) return 0;
  return ((data[data.length - 1] - data[0]) / data[0]) * 100;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StockRow({ stock }: { stock: (typeof STOCKS)[number] }) {
  const positive = stock.change >= 0;
  const changeColor = positive ? Colors.success : Colors.error;
  const changeBg = positive ? Colors.successBg : Colors.errorBg;

  return (
    <Pressable style={styles.stockRow}>
      {/* Ticker + name */}
      <View style={styles.stockLeft}>
        <View
          style={[styles.tickerBadge, stock.held && styles.tickerBadgeHeld]}
        >
          <Text
            style={[styles.tickerText, stock.held && styles.tickerTextHeld]}
          >
            {stock.ticker}
          </Text>
        </View>
        <View style={styles.stockMeta}>
          <Text style={styles.stockName}>{stock.name}</Text>
          <Text style={styles.stockVolume}>Vol {stock.volume}</Text>
        </View>
      </View>

      {/* Sparkline */}
      <View style={styles.sparkWrap}>
        <SparkLine
          data={stock.sparkData}
          positive={positive}
          width={52}
          height={26}
        />
      </View>

      {/* Price + change */}
      <View style={styles.stockRight}>
        <Text style={styles.stockPrice}>KES {stock.price.toFixed(2)}</Text>
        <View style={[styles.changePill, { backgroundColor: changeBg }]}>
          <Feather
            name={positive ? "trending-up" : "trending-down"}
            size={10}
            color={changeColor}
          />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {positive ? "+" : ""}
            {stock.change.toFixed(1)}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function HoldingRow({ stock }: { stock: (typeof STOCKS)[number] }) {
  const value = stock.price * stock.shares;
  const positive = stock.change >= 0;

  return (
    <View style={styles.holdingRow}>
      <View style={styles.holdingLeft}>
        <Text style={styles.holdingTicker}>{stock.ticker}</Text>
        <Text style={styles.holdingShares}>
          {stock.shares.toLocaleString()} shares
        </Text>
      </View>
      <View style={styles.holdingRight}>
        <Text style={styles.holdingValue}>KES {value.toLocaleString()}</Text>
        <Text
          style={[
            styles.holdingChange,
            { color: positive ? Colors.success : Colors.error },
          ]}
        >
          {positive ? "▲" : "▼"} {Math.abs(stock.change).toFixed(1)}% today
        </Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function InvestmentDashboardScreen({ navigation, route }: any) {
  const chamaName = route?.params?.name ?? "Investment Chama";
  const [timeRange, setTimeRange] = useState<TimeRange>("3M");

  const chartData = PORTFOLIO_DATA[timeRange];
  const portfolioValue = chartData[chartData.length - 1];
  const returnPct = portfolioReturn(chartData);
  const returnPositive = returnPct >= 0;
  const returnColor = returnPositive ? Colors.success : Colors.error;
  const absReturn = Math.abs(returnPct);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ── Sticky dark header ── */}
        <LinearGradient
          colors={[Colors.surfaceDeepDark, Colors.surfaceDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Feather
                name="arrow-left"
                size={20}
                color={Colors.textInverseSoft}
              />
            </Pressable>
            <View style={styles.headerMeta}>
              <Text style={styles.headerLabel}>PORTFOLIO</Text>
              <Text style={styles.headerChamaName}>{chamaName}</Text>
            </View>
            <Pressable
              style={styles.doneBtn}
              onPress={() => navigation.navigate("MainTabs")}
            >
              <Text style={styles.doneBtnText}>Dashboard</Text>
              <Feather name="home" size={14} color={Colors.textInverseSoft} />
            </Pressable>
          </View>

          {/* Portfolio value */}
          <View style={styles.valueRow}>
            <View>
              <Text style={styles.portfolioValue}>
                KES {portfolioValue.toLocaleString()}
              </Text>
              <View style={styles.returnRow}>
                <View
                  style={[
                    styles.returnBadge,
                    {
                      backgroundColor: returnPositive
                        ? "rgba(52,211,153,0.15)"
                        : "rgba(248,113,113,0.15)",
                    },
                  ]}
                >
                  <Feather
                    name={returnPositive ? "trending-up" : "trending-down"}
                    size={13}
                    color={returnColor}
                  />
                  <Text style={[styles.returnPct, { color: returnColor }]}>
                    {returnPositive ? "+" : "-"}
                    {absReturn.toFixed(1)}%
                  </Text>
                  <Text style={styles.returnRange}> this {timeRange}</Text>
                </View>
              </View>
            </View>

            {/* Quick stats */}
            <View style={styles.quickStats}>
              <View style={styles.quickStat}>
                <Text style={styles.quickStatValue}>{HOLDINGS.length}</Text>
                <Text style={styles.quickStatLabel}>Positions</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStat}>
                <Text style={styles.quickStatValue}>
                  KES {fmt(portfolioValue / 12)}
                </Text>
                <Text style={styles.quickStatLabel}>Per member</Text>
              </View>
            </View>
          </View>

          {/* ── Chart ── */}
          <View style={styles.chartWrap}>
            <LineChart
              data={chartData}
              width={CHART_WIDTH}
              height={CHART_HEIGHT}
              color={returnPositive ? Colors.success : Colors.error}
              gradientFrom={returnPositive ? Colors.success : Colors.error}
              gradientTo="transparent"
              strokeWidth={2.5}
            />
          </View>

          {/* Time range selector */}
          <View style={styles.timeRangeRow}>
            {TIME_RANGES.map((r) => (
              <Pressable
                key={r}
                style={[
                  styles.rangeBtn,
                  timeRange === r && styles.rangeBtnActive,
                ]}
                onPress={() => setTimeRange(r)}
              >
                <Text
                  style={[
                    styles.rangeBtnText,
                    timeRange === r && styles.rangeBtnTextActive,
                  ]}
                >
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>
        </LinearGradient>

        {/* ── Content ── */}
        <View style={styles.content}>
          {/* Group Holdings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Group positions</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>
                  {HOLDINGS.length} stocks
                </Text>
              </View>
            </View>

            <View style={styles.holdingsList}>
              {HOLDINGS.map((s, i) => (
                <View key={s.ticker}>
                  <HoldingRow stock={s} />
                  {i < HOLDINGS.length - 1 && (
                    <View style={styles.listDivider} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.actionBtn}>
              <View
                style={[styles.actionIcon, { backgroundColor: Colors.infoBg }]}
              >
                <Feather name="plus-circle" size={20} color={Colors.info} />
              </View>
              <Text style={styles.actionLabel}>Buy stock</Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: Colors.warningBg },
                ]}
              >
                <Feather name="minus-circle" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.actionLabel}>Sell</Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: Colors.successBg },
                ]}
              >
                <Feather name="bar-chart-2" size={20} color={Colors.success} />
              </View>
              <Text style={styles.actionLabel}>Report</Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: Colors.primaryLight },
                ]}
              >
                <Feather name="check-circle" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Vote</Text>
            </Pressable>
          </View>

          {/* NSE Market Watch */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NSE Market Watch</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>

            <View style={styles.marketNote}>
              <Feather name="info" size={13} color={Colors.textMuted} />
              <Text style={styles.marketNoteText}>
                Prices are simulated for demo purposes. Live NSE data connects
                at launch.
              </Text>
            </View>

            <View style={styles.stockList}>
              {STOCKS.map((s, i) => (
                <View key={s.ticker}>
                  <StockRow stock={s} />
                  {i < STOCKS.length - 1 && <View style={styles.listDivider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Allocation chart stub */}
          <View style={styles.allocationCard}>
            <Text style={styles.allocTitle}>Portfolio allocation</Text>
            <View style={styles.allocBar}>
              <View
                style={[
                  styles.allocSegment,
                  { flex: 5, backgroundColor: Colors.primary },
                ]}
              />
              <View
                style={[
                  styles.allocSegment,
                  { flex: 3, backgroundColor: Colors.info },
                ]}
              />
              <View
                style={[
                  styles.allocSegment,
                  { flex: 2, backgroundColor: Colors.accent },
                ]}
              />
            </View>
            <View style={styles.allocLegend}>
              <AllocLegendItem color={Colors.primary} label="SCOM" pct={50} />
              <AllocLegendItem color={Colors.info} label="KCB" pct={30} />
              <AllocLegendItem color={Colors.accent} label="EABL" pct={20} />
            </View>
          </View>

          {/* Bottom spacer */}
          <View style={{ height: Spacing[16] }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AllocLegendItem({
  color,
  label,
  pct,
}: {
  color: string;
  label: string;
  pct: number;
}) {
  return (
    <View style={styles.allocItem}>
      <View style={[styles.allocDot, { backgroundColor: color }]} />
      <Text style={styles.allocLabel}>{label}</Text>
      <Text style={styles.allocPct}>{pct}%</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    paddingBottom: Spacing[4],
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
    paddingBottom: Spacing[4],
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerMeta: { flex: 1, marginLeft: Spacing[3] },
  headerLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: 1.5,
  },
  headerChamaName: {
    color: Colors.textInverse,
    fontSize: FontSize.lg,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginTop: 1,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.button,
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  doneBtnText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // Portfolio value
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[5],
  },
  portfolioValue: {
    color: Colors.textInverse,
    fontSize: FontSize["7xl"],
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    letterSpacing: -1,
    lineHeight: 44,
    marginBottom: Spacing[1.5],
  },
  returnRow: { flexDirection: "row", alignItems: "center" },
  returnBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  returnPct: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },
  returnRange: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },

  // Quick stats
  quickStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: Radius.card,
    padding: Spacing[3],
    gap: Spacing[3],
    alignSelf: "flex-start",
    marginTop: Spacing[1],
  },
  quickStat: { alignItems: "center" },
  quickStatValue: {
    color: Colors.textInverse,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  quickStatLabel: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    marginTop: 1,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 2,
  },

  // Chart
  chartWrap: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
  },

  // Time range
  timeRangeRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    gap: Spacing[1],
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.badge,
    alignItems: "center",
  },
  rangeBtnActive: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  rangeBtnText: {
    color: Colors.textInverseSoft,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  rangeBtnTextActive: {
    color: Colors.textInverse,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Content
  content: {
    paddingTop: Spacing[5],
    paddingHorizontal: Spacing[5],
  },

  // Section
  section: { marginBottom: Spacing[6] },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[3],
    gap: Spacing[2],
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  sectionBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  sectionBadgeText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Holdings list
  holdingsList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: "hidden",
    ...Shadow.sm,
  },
  holdingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  holdingLeft: {},
  holdingTicker: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: 3,
  },
  holdingShares: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  holdingRight: { alignItems: "flex-end" },
  holdingValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  holdingChange: {
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // Actions row
  actionsRow: {
    flexDirection: "row",
    gap: Spacing[2],
    marginBottom: Spacing[6],
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    gap: Spacing[1.5],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.input,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.xs,
  },
  actionLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },

  // Live indicator
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    backgroundColor: Colors.successBg,
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
  },
  liveText: {
    color: Colors.success,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // Market note
  marketNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[1.5],
    backgroundColor: Colors.divider,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    marginBottom: Spacing[3],
  },
  marketNoteText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
    lineHeight: 17,
  },

  // Stock list
  stockList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    overflow: "hidden",
    ...Shadow.sm,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  stockLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2.5],
  },
  tickerBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: Colors.divider,
    minWidth: 48,
    alignItems: "center",
  },
  tickerBadgeHeld: {
    backgroundColor: Colors.primaryLight,
  },
  tickerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
  },
  tickerTextHeld: {
    color: Colors.primary,
  },
  stockMeta: {},
  stockName: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 1,
  },
  stockVolume: {
    color: Colors.textMuted,
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight.regular,
  },
  sparkWrap: {
    marginHorizontal: Spacing[3],
  },
  stockRight: { alignItems: "flex-end" },
  stockPrice: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
    marginBottom: 3,
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: Spacing[1.5],
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  changeText: {
    fontSize: FontSize.xs - 1,
    fontFamily: FontFamily.bold,
    fontWeight: FontWeight.bold,
  },

  // List divider
  listDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing[4],
  },

  // Allocation chart
  allocationCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing[5],
    marginBottom: Spacing[4],
    ...Shadow.sm,
  },
  allocTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontFamily: FontFamily.extraBold,
    fontWeight: FontWeight.extraBold,
    marginBottom: Spacing[4],
  },
  allocBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: Radius.full,
    overflow: "hidden",
    gap: 2,
    marginBottom: Spacing[4],
  },
  allocSegment: {
    borderRadius: Radius.full,
  },
  allocLegend: {
    flexDirection: "row",
    gap: Spacing[4],
  },
  allocItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1.5],
  },
  allocDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  allocLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  allocPct: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
});
