import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  Animated,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
//  Types & Mock Data
// ─────────────────────────────────────────────────────────────────────────────

type ChamaType = "merry_go_round" | "investment" | "welfare" | "hybrid" | "group_purchase";

interface Chama {
  id: string;
  name: string;
  role: string;
  userRole: "chairperson" | "treasurer" | "secretary" | "member";
  members: number;
  chamaType: ChamaType;
  heroColor: string;
  typeLabel: string;
  initials: string;
  
  balanceLabel: string;
  balance: string;
  cycleInfo?: string;
  
  // Specifics
  statusPill?: { paid: number; pending: number; late: number };
  hybridSplit?: string;
  investReturns?: string;
  loanStatus?: string;
  borrowPower?: string;
  productName?: string;
  deliveryStatus?: string;
}

const MY_CHAMAS: Chama[] = [
  {
    id: "1",
    name: "Mama Mboga Group",
    role: "CHAIRPERSON",
    userRole: "chairperson",
    members: 20,
    chamaType: "merry_go_round",
    heroColor: "#006D5B",
    typeLabel: "Mchezo",
    initials: "MM",
    balanceLabel: "GROUP POT",
    balance: "Ksh 84,500",
    cycleInfo: "Cycle 4 of 20 · Muthoni receives this cycle",
    statusPill: { paid: 14, pending: 4, late: 2 },
  },
  {
    id: "2",
    name: "Kilimani Invest Club",
    role: "TREASURER",
    userRole: "treasurer",
    members: 12,
    chamaType: "investment",
    heroColor: "#0A1F18",
    typeLabel: "Uwekezaji",
    initials: "KI",
    balanceLabel: "TOTAL FUND VALUE",
    balance: "Ksh 2,100,000",
    cycleInfo: "Your share: Ksh 175,000",
    investReturns: "+12.4% this year  ·  2 votes pending",
  },
  {
    id: "3",
    name: "Kijiji Welfare Group",
    role: "MEMBER",
    userRole: "member",
    members: 18,
    chamaType: "welfare",
    heroColor: "#3C1278",
    typeLabel: "Akiba",
    initials: "KW",
    balanceLabel: "LOAN POOL AVAILABLE",
    balance: "Ksh 48,000",
    loanStatus: "3 active loans · Ksh 27,000 out",
    borrowPower: "You can borrow up to Ksh\n14,400",
  },
  {
    id: "4",
    name: "Westlands Hybrid Chama",
    role: "SECRETARY",
    userRole: "secretary",
    members: 20,
    chamaType: "hybrid",
    heroColor: "#006D5B",
    typeLabel: "Mchanganyiko",
    initials: "WH",
    balanceLabel: "TOTAL GROUP FUNDS",
    balance: "Ksh 156,000",
    hybridSplit: "60% MGR · 30% Invest · 10% Welfare",
    cycleInfo: "Cycle 3 of 20  ·  18 paid",
  },
  {
    id: "5",
    name: "Runda Appliance Group",
    role: "MEMBER",
    userRole: "member",
    members: 20,
    chamaType: "group_purchase",
    heroColor: "#7C2D12",
    typeLabel: "Nunua Pamoja",
    initials: "RA",
    balanceLabel: "SAVINGS TOWARDS GOAL",
    balance: "Ksh 640,000",
    productName: "Samsung 320L Fridge · Ksh 79,000 each · 20 members",
    deliveryStatus: "8 delivered  ·  12 remaining  ·  Next: Akinyi Apr",
  },
];

const RECENT_ACTIVITY = [
  { id: "1", name: "Wanjiru paid", sub: "Today 8:42 AM", amount: "+Ksh 5,000", ok: true },
  { id: "2", name: "Akinyi pending", sub: "Due today", amount: "Ksh 5,000", pending: true },
  { id: "3", name: "Muthoni late", sub: "3 days late", amount: "+Ksh 200", late: true },
];

const PORTFOLIO = [
  { id: "1", name: "NSE Shares", sub: "Safaricom, KCB, Equity", value: "Ksh 560,000", ret: "+8.2%", color: "#3B82F6" },
  { id: "2", name: "Land — Rongai", sub: "0.5 acre · Purchased Jun 2024", value: "Ksh 1,200,000", ret: "+18.0%", color: "#8B5CF6" },
  { id: "3", name: "CIC Unit Trust", sub: "Money market fund", value: "Ksh 340,000", ret: "+11.1%", color: "#F59E0B" },
];

const ROTATION = [
  { id: "1", initials: "WK", name: "Wanjiru", sub: "Feb ✓", status: "done", color: "#2E9E87" },
  { id: "2", initials: "AO", name: "Akinyi", sub: "Mar ✓", status: "done", color: "#3B82F6" },
  { id: "3", initials: "MM", name: "Muthoni", sub: "Apr", status: "now", color: "#F59E0B" },
  { id: "4", initials: "KK", name: "Kamau", sub: "May", status: "next", color: "#8B5CF6" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Shared Helpers
// ─────────────────────────────────────────────────────────────────────────────

function HeroCircles() {
  return (
    <>
      <View style={S.circleTopRight} />
      <View style={S.circleBottomLeft} />
    </>
  );
}

function HazinaLogo() {
  return (
    <Text style={S.logo}>
      <Text style={{ color: "#FFFFFF" }}>Hazi</Text>
      <Text style={{ color: "#F59E0B" }}>na</Text>
    </Text>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Sections
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={S.sectionHeader}>
      <Text style={S.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity>
          <Text style={S.seeAll}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─ Merry Go Round / General Activity
function MGRRotationSection() {
  return (
    <View style={S.section}>
      <SectionHeader title="MGR rotation" action="See all" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.rotationRow}>
        {ROTATION.map(r => (
          <View key={r.id} style={[S.rotCard, r.status === "now" && S.rotCardNow]}>
            <View style={[S.rotAvatar, { backgroundColor: r.color }]}>
              <Text style={S.rotAvatarText}>{r.initials}</Text>
            </View>
            <Text style={[S.rotName, r.status === "now" && { color: "#FFFFFF" }]}>{r.name}</Text>
            {r.status === "now" ? (
              <View style={S.rotNowBadge}><Text style={S.rotNowBadgeText}>NOW</Text></View>
            ) : (
              <Text style={S.rotSub}>{r.sub}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="This cycle" />
        <View style={S.cycleProgressRow}>
          <Text style={S.cycleProgressText}>14 of 20 collected</Text>
          <Text style={S.cycleProgressPct}>70%</Text>
        </View>
        <View style={S.progressTrackDark}>
          <View style={[S.progressFillDark, { width: "70%" }]} />
        </View>
      </View>
    </View>
  );
}

// ─ Recent Activity (Generic)
function RecentActivitySection() {
  return (
    <View style={S.section}>
      <SectionHeader title="Recent activity" />
      <View style={S.activityList}>
        {RECENT_ACTIVITY.map(a => (
          <View key={a.id} style={S.activityItem}>
            <View style={[S.actIcon, a.ok && S.actIconOk, a.pending && S.actIconWarn, a.late && S.actIconErr]}>
              {a.ok && <Feather name="check" size={14} color="#059669" />}
              {a.pending && <Feather name="clock" size={14} color="#D97706" />}
              {a.late && <Feather name="alert-circle" size={14} color="#DC2626" />}
            </View>
            <View style={S.actMeta}>
              <Text style={S.actName}>{a.name}</Text>
              <Text style={S.actSub}>{a.sub}</Text>
            </View>
            <Text style={[S.actAmt, a.ok && { color: "#059669" }, a.pending && { color: "#D97706" }, a.late && { color: "#DC2626" }]}>
              {a.amount}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─ Investment
function InvestmentPortfolioSection() {
  return (
    <View style={S.section}>
      <SectionHeader title="Portfolio" action="Full report" />
      <View style={S.portList}>
        {PORTFOLIO.map(p => (
          <View key={p.id} style={S.portItem}>
            <View style={[S.portDot, { backgroundColor: p.color }]} />
            <View style={S.actMeta}>
              <Text style={S.actName}>{p.name}</Text>
              <Text style={S.actSub}>{p.sub}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={S.actAmt}>{p.value}</Text>
              <Text style={[S.actSub, { color: "#059669", fontWeight: "700" }]}>{p.ret}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Pending vote" />
        <View style={S.voteCard}>
          <Text style={S.voteLabel}>PROPOSAL · 3 DAYS LEFT</Text>
          <Text style={S.voteTitle}>Invest Ksh 200,000 in additional NSE shares — Equity Bank stock</Text>
          <View style={S.voteBtns}>
            <TouchableOpacity style={S.voteApprove}><Text style={S.voteApproveText}>Approve</Text></TouchableOpacity>
            <TouchableOpacity style={S.voteDecline}><Text style={S.voteDeclineText}>Decline</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─ Welfare
function LoanPoolSection({ borrowPower }: { borrowPower?: string }) {
  return (
    <View style={S.section}>
      <View style={S.borrowCard}>
        <Text style={S.borrowLabel}>Your borrowing power</Text>
        <Text style={S.borrowVal}>{borrowPower?.replace("You can borrow up to Ksh\n", "Ksh ")}</Text>
        <Text style={S.borrowSub}>3× your contributions · 5% interest · Up to 3 months</Text>
        <TouchableOpacity style={S.borrowBtn}>
          <Text style={S.borrowBtnText}>Apply for a loan</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Active loans" action="See all" />
        <View style={S.activityList}>
          <View style={S.activityItem}>
            <View style={[S.actIcon, { backgroundColor: "#EDE9FE" }]}><Feather name="dollar-sign" size={14} color="#7C3AED" /></View>
            <View style={S.actMeta}>
              <Text style={S.actName}>Wanjiru Kamau</Text>
              <Text style={S.actSub}>Ksh 20,000 · Month 2 of 4</Text>
            </View>
            <View style={S.pillWarn}><Text style={S.pillWarnText}>Repaying</Text></View>
          </View>
          <View style={S.activityItem}>
            <View style={[S.actIcon, { backgroundColor: "#ECFDF5" }]}><Feather name="check" size={14} color="#059669" /></View>
            <View style={S.actMeta}>
              <Text style={S.actName}>Kamau Otieno</Text>
              <Text style={S.actSub}>Ksh 7,000 · Repaid in full</Text>
            </View>
            <View style={S.pillOk}><Text style={S.pillOkText}>Complete</Text></View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─ Hybrid
function HybridDashboardSection() {
  return (
    <View style={S.section}>
      <SectionHeader title="Fund breakdown" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.hybridRow}>
        <View style={[S.hybridCard, { borderColor: "#A7F3D0", backgroundColor: "#F0FDFA" }]}>
          <Text style={[S.hLabel, { color: "#047857" }]}>MGR POT</Text>
          <Text style={[S.hVal, { color: "#006D5B" }]}>Ksh{"\n"}93,600</Text>
          <Text style={S.hSub}>60% · Muthoni next</Text>
        </View>
        <View style={[S.hybridCard, { borderColor: "#BFDBFE", backgroundColor: "#EFF6FF" }]}>
          <Text style={[S.hLabel, { color: "#1D4ED8" }]}>INVEST</Text>
          <Text style={[S.hVal, { color: "#3B82F6" }]}>Ksh{"\n"}46,800</Text>
          <Text style={S.hSub}>30% · NSE shares</Text>
        </View>
        <View style={[S.hybridCard, { borderColor: "#DDD6FE", backgroundColor: "#FAF5FF" }]}>
          <Text style={[S.hLabel, { color: "#6D28D9" }]}>WELFARE</Text>
          <Text style={[S.hVal, { color: "#8B5CF6" }]}>Ksh{"\n"}15,600</Text>
          <Text style={S.hSub}>10% · Available</Text>
        </View>
      </ScrollView>
      <View style={{ marginTop: 24 }}>
        <MGRRotationSection />
      </View>
    </View>
  );
}

// ─ Group Purchase
function GroupPurchaseSection() {
  return (
    <View style={S.section}>
      <SectionHeader title="Delivery progress" action="Full schedule" />
      <View style={S.cycleProgressRow}>
        <Text style={S.cycleProgressText}>8 of 20 members received</Text>
        <Text style={S.cycleProgressPct}>40%</Text>
      </View>
      <View style={S.progressTrackDark}>
        <View style={[S.progressFillDark, { width: "40%", backgroundColor: "#EA580C" }]} />
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Current product" />
        <View style={S.productCard}>
          <View style={S.prodImg}><Feather name="tv" size={24} color="#9CA3AF" /></View>
          <View style={S.actMeta}>
            <Text style={S.actSub}>Samsung Kenya</Text>
            <Text style={S.actName}>320L Double Door Fridge</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
              <Text style={{ textDecorationLine: "line-through", color: Colors.textMuted, fontSize: 12 }}>Ksh 89,000</Text>
              <Text style={{ fontFamily: FontFamily.extraBold, color: "#006D5B", fontSize: 14 }}>Ksh 79,000</Text>
              <View style={S.pillOk}><Text style={S.pillOkText}>Chama price</Text></View>
            </View>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Delivery schedule" />
        <View style={S.activityList}>
          <View style={S.activityItem}>
            <View style={[S.actIcon, { backgroundColor: "#ECFDF5" }]}><Feather name="check" size={14} color="#059669" /></View>
            <View style={S.actMeta}>
              <Text style={S.actName}>Wanjiru Kamau</Text>
              <Text style={S.actSub}>Delivered Feb · Samsung Fridge</Text>
            </View>
            <View style={S.pillOk}><Text style={S.pillOkText}>Delivered</Text></View>
          </View>
          <View style={S.activityItem}>
            <View style={[S.actIcon, { backgroundColor: "#FFF7ED" }]}><Feather name="arrow-right" size={14} color="#EA580C" /></View>
            <View style={S.actMeta}>
              <Text style={S.actName}>Akinyi Otieno</Text>
              <Text style={S.actSub}>Next delivery · April 2026</Text>
            </View>
            <View style={S.pillWarn}><Text style={[S.pillWarnText, { color: "#EA580C" }]}>Up next</Text></View>
          </View>
        </View>
      </View>
    </View>
  );
}

import { useChamaContext } from "../context/ChamaContext";

export default function DashboardScreen({ navigation }: any) {
  const [activeId, setActiveId] = useState("1");
  const [modalVisible, setModalVisible] = useState(false);
  const { setActiveChamaType } = useChamaContext();

  const chama = MY_CHAMAS.find(c => c.id === activeId) || MY_CHAMAS[0];

  return (
    <SafeAreaView style={[S.screen, { backgroundColor: chama.heroColor }]}>
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]} bounces={false}>
        {/* ── HERO HEADER ── */}
        <View style={[S.hero, { backgroundColor: chama.heroColor }]}>
          <HeroCircles />
          <View style={S.heroNav}>
            <HazinaLogo />
            <TouchableOpacity style={S.notifBtn} onPress={() => navigation.navigate("Notifications")}>
              <Feather name="bell" size={20} color="rgba(255,255,255,0.9)" />
              {/* unread dot */}
              <View style={S.notifDot} />
            </TouchableOpacity>
          </View>

          <View style={S.chamaMetaRow}>
            <Text style={S.chamaName}>{chama.name}</Text>
            <View style={S.typePill}>
              <Text style={S.typePillText}>{chama.typeLabel}</Text>
            </View>
          </View>

          {chama.chamaType === "welfare" && (
            <Text style={S.chamaStats}>{chama.members} members · {chama.loanStatus}</Text>
          )}
          {chama.chamaType === "investment" && (
            <Text style={S.chamaStats}>{chama.members} members · {chama.cycleInfo}</Text>
          )}
          {chama.chamaType === "hybrid" && (
            <Text style={S.chamaStats}>{chama.members} members · {chama.hybridSplit}</Text>
          )}
          {chama.chamaType === "group_purchase" && (
            <Text style={S.chamaStats}>{chama.productName}</Text>
          )}

          <View style={{ marginTop: 24 }}>
            <Text style={S.balanceLabel}>{chama.balanceLabel}</Text>
            <Text style={S.balance}>{chama.balance}</Text>
            
            {chama.chamaType === "merry_go_round" && (
              <>
                <Text style={S.cycleInfo}>{chama.cycleInfo}</Text>
                {chama.statusPill && (
                  <View style={S.statusPillContainer}>
                    <View style={S.pillDark}>
                      <Text style={S.pillDarkValOk}>{chama.statusPill.paid}</Text>
                      <Text style={S.pillDarkLbl}>paid</Text>
                      <Text style={S.pillDarkDot}>·</Text>
                      <Text style={S.pillDarkValWarn}>{chama.statusPill.pending}</Text>
                      <Text style={S.pillDarkLbl}>pending</Text>
                      <Text style={S.pillDarkDot}>·</Text>
                      <Text style={S.pillDarkValErr}>{chama.statusPill.late}</Text>
                      <Text style={S.pillDarkLbl}>late</Text>
                    </View>
                  </View>
                )}
              </>
            )}

            {chama.chamaType === "hybrid" && (
              <View style={[S.pillDark, { alignSelf: "flex-start", marginTop: 8 }]}>
                <Text style={[S.pillDarkValOk, { color: "#A7F3D0" }]}>{chama.cycleInfo}</Text>
              </View>
            )}

            {chama.chamaType === "investment" && (
              <View style={[S.pillDark, { alignSelf: "flex-start", marginTop: 8, backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={[S.pillDarkValOk, { color: "#FFFFFF" }]}>{chama.investReturns}</Text>
              </View>
            )}

            {chama.chamaType === "welfare" && (
              <View style={[S.pillDark, { alignSelf: "flex-start", marginTop: 8, backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={[S.pillDarkValOk, { color: "#FFFFFF" }]}>{chama.borrowPower!.replace("\n", " ")}</Text>
              </View>
            )}

            {/* ── CHAIRPERSON ACTIONS (role-gated) ── */}
            {chama.userRole === "chairperson" && (
              <View style={S.chairRow}>
                <TouchableOpacity style={S.chairBtn} onPress={() => navigation.navigate("ContributionDay")}>
                  <Feather name="credit-card" size={15} color={chama.heroColor} />
                  <Text style={[S.chairBtnTxt, { color: chama.heroColor }]}>Contrib. Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={S.chairBtn}
                  onPress={() => {
                    const { Alert } = require("react-native");
                    Alert.alert(
                      "Disburse to Muthoni Mwangi?",
                      "This will trigger an M-Pesa B2C payout of Ksh 156,000 to the current recipient.",
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Disburse", onPress: () => {} },
                      ]
                    );
                  }}
                >
                  <Feather name="send" size={15} color={chama.heroColor} />
                  <Text style={[S.chairBtnTxt, { color: chama.heroColor }]}>Disburse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={S.chairBtn} onPress={() => navigation.navigate("Placeholder")}>
                  <Feather name="file-text" size={15} color={chama.heroColor} />
                  <Text style={[S.chairBtnTxt, { color: chama.heroColor }]}>Meeting</Text>
                </TouchableOpacity>
                <TouchableOpacity style={S.chairBtn} onPress={() => navigation.navigate("Settings")}>
                  <Feather name="settings" size={15} color={chama.heroColor} />
                  <Text style={[S.chairBtnTxt, { color: chama.heroColor }]}>Manage</Text>
                </TouchableOpacity>
              </View>
            )}

            {chama.chamaType === "group_purchase" && (
              <View style={[S.pillDark, { alignSelf: "flex-start", marginTop: 8, backgroundColor: "rgba(0,0,0,0.2)" }]}>
                <Text style={[S.pillDarkValOk, { color: "#FFEDD5" }]}>{chama.deliveryStatus}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── BODY SECTIONS BY TYPE ── */}
        <View style={S.body}>
          {chama.chamaType === "merry_go_round" && <MGRRotationSection />}
          {chama.chamaType === "investment" && <InvestmentPortfolioSection />}
          {chama.chamaType === "welfare" && <LoanPoolSection borrowPower={chama.borrowPower} />}
          {chama.chamaType === "hybrid" && <HybridDashboardSection />}
          {chama.chamaType === "group_purchase" && <GroupPurchaseSection />}

          {/* Render Recent Activity for types that need it */}
          {(chama.chamaType === "merry_go_round" || chama.chamaType === "hybrid") && (
            <RecentActivitySection />
          )}
        </View>
      </ScrollView>

      {/* Floating Chama Switcher FAB (for demo purposes since header changed) */}
      <TouchableOpacity style={S.fabSwitcher} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Feather name="layers" size={20} color="#FFFFFF" />
        <Text style={S.fabText}>Switch Chama</Text>
      </TouchableOpacity>

      {/* Switcher Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={S.overlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
          <View style={S.sheet}>
            <View style={S.sheetHandle} />
            <Text style={S.sheetTitle}>Switch chama</Text>
            <View style={S.sheetList}>
              {MY_CHAMAS.map((c, i) => {
                const isActive = c.id === activeId;
                return (
                  <View key={c.id}>
                    <TouchableOpacity
                      style={[S.sheetRow, isActive && { backgroundColor: "#F9FAFB" }]}
                      activeOpacity={0.7}
                      onPress={() => { 
                        setActiveId(c.id); 
                        setActiveChamaType(c.chamaType);
                        setModalVisible(false); 
                      }}
                    >
                      <View style={[S.sheetAvatar, { backgroundColor: c.heroColor }]}>
                        <Text style={S.sheetAvatarText}>{c.initials}</Text>
                      </View>
                      <View style={S.sheetMeta}>
                        <Text style={S.sheetName}>{c.name}</Text>
                        <Text style={S.sheetSub}>{c.chamaType.replace("_", " ").toUpperCase()}</Text>
                      </View>
                      <View style={isActive ? S.radioActive : S.radioInactive}>
                        {isActive && <Feather name="check" size={14} color={Colors.primary} />}
                      </View>
                    </TouchableOpacity>
                    {i < MY_CHAMAS.length - 1 && <View style={S.sheetDivider} />}
                  </View>
                );
              })}
            </View>
            <TouchableOpacity style={S.createSheetBtn} onPress={() => { setModalVisible(false); navigation.navigate("ChamaType"); }}>
              <Feather name="plus" size={16} color={Colors.primary} />
              <Text style={S.createSheetText}>Create or join a new chama</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Styles
// ─────────────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  screen: { flex: 1 },
  body: { backgroundColor: "#FFFFFF", paddingBottom: 100, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -24, paddingTop: 24, minHeight: 600 },

  // Hero
  hero: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 50, overflow: "hidden" },
  circleTopRight: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(255,255,255,0.03)", top: -100, right: -100 },
  circleBottomLeft: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(0,0,0,0.05)", bottom: -50, left: -50 },
  heroNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  logo: { fontFamily: FontFamily.extraBold, fontSize: 22, fontWeight: "800", letterSpacing: -0.4 },
  notifBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" },

  chamaMetaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  chamaName:    { fontFamily: FontFamily.extraBold, fontSize: 18, color: "#FFFFFF", fontWeight: "800" },
  typePill:     { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typePillText: { fontFamily: FontFamily.heading, fontSize: 10, color: "#FFFFFF", fontWeight: "700" },
  chamaStats:   { fontFamily: FontFamily.regular, fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 12 },

  balanceLabel: { fontFamily: FontFamily.semiBold, fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase" },
  balance:      { fontFamily: FontFamily.extraBold, fontSize: 44, color: "#FFFFFF", fontWeight: "800", letterSpacing: -1.5, lineHeight: 52 },
  cycleInfo:    { fontFamily: FontFamily.regular, fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 12 },

  // Status Pill Dark
  statusPillContainer: { flexDirection: "row" },
  pillDark: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 99, paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  pillDarkDot: { color: "rgba(255,255,255,0.3)", fontSize: 10 },
  pillDarkLbl: { fontFamily: FontFamily.medium, fontSize: 12, color: "#FFFFFF" },
  pillDarkValOk:   { fontFamily: FontFamily.heading, fontSize: 12, fontWeight: "700", color: "#A7F3D0" },
  pillDarkValWarn: { fontFamily: FontFamily.heading, fontSize: 12, fontWeight: "700", color: "#FDE68A" },
  pillDarkValErr:  { fontFamily: FontFamily.heading, fontSize: 12, fontWeight: "700", color: "#FECACA" },

  // Shared Section Styles
  section: { paddingHorizontal: 20, marginBottom: 32 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textPrimary, fontWeight: "800" },
  seeAll: { fontFamily: FontFamily.medium, fontSize: 13, color: Colors.primary },

  // Progress Track
  cycleProgressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cycleProgressText: { fontFamily: FontFamily.regular, fontSize: 13, color: Colors.textMuted },
  cycleProgressPct: { fontFamily: FontFamily.heading, fontSize: 13, color: Colors.primary, fontWeight: "700" },
  progressTrackDark: { height: 6, backgroundColor: "#EBF1EF", borderRadius: 3, overflow: "hidden" },
  progressFillDark: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },

  // MGR Rotation
  rotationRow: { gap: 12, paddingRight: 20 },
  rotCard: { width: 90, backgroundColor: "#F9FAF9", borderWidth: 1, borderColor: "#EBF1EF", borderRadius: 16, padding: 12, alignItems: "center" },
  rotCardNow: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rotAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  rotAvatarText: { fontFamily: FontFamily.heading, fontSize: 16, color: "#FFFFFF", fontWeight: "700" },
  rotName: { fontFamily: FontFamily.heading, fontSize: 13, color: Colors.textPrimary, fontWeight: "700", marginBottom: 4 },
  rotSub: { fontFamily: FontFamily.regular, fontSize: 11, color: Colors.textMuted },
  rotNowBadge: { backgroundColor: "#F59E0B", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  rotNowBadgeText: { fontFamily: FontFamily.extraBold, fontSize: 9, color: "#FFFFFF" },

  // Lists (Generic)
  activityList: { gap: 12 },
  activityItem: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#F3F4F6", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 3, elevation: 1 },
  actIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  actIconOk: { backgroundColor: "#ECFDF5" }, actIconWarn: { backgroundColor: "#FFFBEB" }, actIconErr: { backgroundColor: "#FEF2F2" },
  actMeta: { flex: 1 },
  actName: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.textPrimary, fontWeight: "700" },
  actSub: { fontFamily: FontFamily.regular, fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  actAmt: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: "700" },

  // Portfolio
  portList: { gap: 12 },
  portItem: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16 },
  portDot: { width: 10, height: 10, borderRadius: 5 },

  voteCard: { backgroundColor: "#FFFAF0", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 16, padding: 20 },
  voteLabel: { fontFamily: FontFamily.heading, fontSize: 10, color: "#D97706", fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
  voteTitle: { fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700", lineHeight: 22, marginBottom: 16 },
  voteBtns: { flexDirection: "row", gap: 12 },
  voteApprove: { flex: 1, backgroundColor: "#006D5B", height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  voteApproveText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#FFFFFF", fontWeight: "700" },
  voteDecline: { flex: 1, backgroundColor: "#FFF1F2", borderWidth: 1, borderColor: "#FECACA", height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  voteDeclineText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#E11D48", fontWeight: "700" },

  // Welfare
  borrowCard: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 16, padding: 20 },
  borrowLabel: { fontFamily: FontFamily.medium, fontSize: 13, color: "#065F46", marginBottom: 4 },
  borrowVal: { fontFamily: FontFamily.extraBold, fontSize: 32, color: "#006D5B", fontWeight: "800", letterSpacing: -1, marginBottom: 6 },
  borrowSub: { fontFamily: FontFamily.regular, fontSize: 12, color: "#047857", marginBottom: 16 },
  borrowBtn: { backgroundColor: "#006D5B", height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  borrowBtnText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#FFFFFF", fontWeight: "700" },
  
  pillWarn: { backgroundColor: "#FFFBEB", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillWarnText: { fontFamily: FontFamily.heading, fontSize: 10, color: "#D97706", fontWeight: "700" },
  pillOk: { backgroundColor: "#ECFDF5", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillOkText: { fontFamily: FontFamily.heading, fontSize: 10, color: "#059669", fontWeight: "700" },

  // Hybrid
  hybridRow: { gap: 12, paddingRight: 20 },
  hybridCard: { width: 110, borderWidth: 1, borderRadius: 16, padding: 14 },
  hLabel: { fontFamily: FontFamily.heading, fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  hVal: { fontFamily: FontFamily.extraBold, fontSize: 20, fontWeight: "800", letterSpacing: -0.5, marginVertical: 8 },
  hSub: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.textSecondary },

  // Group Purchase
  productCard: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 16 },
  prodImg: { width: 60, height: 60, borderRadius: 12, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },

  // Switcher FAB
  fabSwitcher: { position: "absolute", bottom: 24, alignSelf: "center", backgroundColor: Colors.primary, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 99, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  fabText: { fontFamily: FontFamily.heading, fontSize: 14, color: "#FFFFFF", fontWeight: "700" },

  // Modal Sheet
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: Platform.OS === "ios" ? 40 : 24 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "#E5E7EB", alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontFamily: FontFamily.extraBold, fontSize: 20, color: Colors.textPrimary, fontWeight: "800", marginBottom: 16 },
  sheetList: { gap: 12, marginBottom: 20 },
  sheetRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "#F3F4F6" },
  sheetAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  sheetAvatarText: { fontFamily: FontFamily.heading, fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
  sheetMeta: { flex: 1 },
  sheetName: { fontFamily: FontFamily.heading, fontSize: 15, color: Colors.textPrimary, fontWeight: "700", marginBottom: 2 },
  sheetSub: { fontFamily: FontFamily.medium, fontSize: 11, color: Colors.textMuted },
  radioActive: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  radioInactive: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: "#D1D5DB" },
  sheetDivider: { height: 1, backgroundColor: "#EBF1EF", marginHorizontal: 12 },
  createSheetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#F0FDFA", padding: 16, borderRadius: 14, borderStyle: "dashed", borderWidth: 1, borderColor: "#A7F3D0" },
  createSheetText: { fontFamily: FontFamily.heading, fontSize: 14, color: Colors.primary, fontWeight: "700" },

  // Notification dot on bell
  notifDot: { position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: "#F59E0B", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.4)" },

  // Chairperson quick-action row
  chairRow: { flexDirection: "row", gap: 8, marginTop: 20, flexWrap: "wrap" },
  chairBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  chairBtnTxt: { fontFamily: FontFamily.heading, fontSize: 12, fontWeight: "700" },
});
