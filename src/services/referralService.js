const STORAGE_KEY = "tiffin-referral-demo";
export const REFERRAL_REWARD = 500;
export const REFERRAL_CREDIT = 100;
export const REQUIRED_REFERRALS = 5;
export const MINIMUM_REWARD_ORDER = 1000;

const dateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const createInitialState = () => {
  const suffix = globalThis.crypto?.randomUUID?.().slice(0, 6).toUpperCase() || Math.random().toString(36).slice(2, 8).toUpperCase();
  const profile = {
    id: `demo-${suffix.toLowerCase()}`,
    name: "Demo customer",
    referralCode: `TIFFIN-${suffix}`,
    isDemo: true,
  };
  const successful = [
    ["ref-1", "customer-a19", "Customer ••19", 28],
    ["ref-2", "customer-b42", "Customer ••42", 21],
    ["ref-3", "customer-c07", "Customer ••07", 14],
    ["ref-4", "customer-d61", "Customer ••61", 8],
    ["ref-5", "customer-e35", "Customer ••35", 3],
  ].map(([id, customerId, maskedCustomer, days], index) => ({
    id,
    customerId,
    maskedCustomer,
    referredAt: dateDaysAgo(days + 2),
    qualifiedAt: dateDaysAgo(days),
    status: "qualified",
    orderStatus: "completed",
    paymentStatus: "paid",
    isQualifyingPurchase: true,
    qualifyingOrderId: `DEMO-ORDER-${index + 1}`,
    rewardAmount: REFERRAL_CREDIT,
    walletStatus: "credited",
  }));
  const history = [
    ...successful,
    {
      id: "ref-pending-1",
      customerId: "customer-p88",
      maskedCustomer: "Customer ••88",
      referredAt: dateDaysAgo(1),
      qualifiedAt: null,
      status: "pending",
      orderStatus: "pending",
      paymentStatus: "unpaid",
      isQualifyingPurchase: false,
      qualifyingOrderId: null,
      rewardAmount: 0,
      walletStatus: "pending",
    },
  ];
  const ledger = successful.map((referral, index) => ({
    id: `wallet-credit-${referral.id}`,
    reference: `WCR-${String(index + 1).padStart(4, "0")}`,
    referralId: referral.id,
    qualifyingOrderId: referral.qualifyingOrderId,
    date: referral.qualifiedAt,
    description: `Referral reward · ${referral.maskedCustomer}`,
    amount: REFERRAL_CREDIT,
    type: "credit",
    status: "confirmed",
  }));
  return { version: 1, profile, history, ledger };
};

const safelyParse = (value) => {
  try { return JSON.parse(value); } catch { return null; }
};

export const getReferralState = () => {
  const stored = safelyParse(localStorage.getItem(STORAGE_KEY));
  if (stored?.version === 1 && stored.profile && Array.isArray(stored.history) && Array.isArray(stored.ledger)) return stored;
  const initial = createInitialState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

export const saveReferralState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
};

export const getQualifiedReferrals = (state) => {
  const qualifyingOrders = new Set();
  return state.history.filter((referral) => {
    if (
      referral.status !== "qualified"
      || referral.orderStatus !== "completed"
      || referral.paymentStatus !== "paid"
      || !referral.isQualifyingPurchase
      || !referral.qualifyingOrderId
      || referral.customerId === state.profile.id
    ) return false;
    if (qualifyingOrders.has(referral.qualifyingOrderId)) return false;
    qualifyingOrders.add(referral.qualifyingOrderId);
    return true;
  });
};

export const getWalletSummary = (state) => {
  const confirmed = state.ledger.filter((entry) => entry.status === "confirmed");
  const availableBalance = confirmed.reduce((total, entry) => total + entry.amount, 0);
  const lifetimeEarnings = confirmed.filter((entry) => entry.amount > 0).reduce((total, entry) => total + entry.amount, 0);
  const redeemedRewards = Math.abs(confirmed.filter((entry) => entry.type === "reward-redemption").reduce((total, entry) => total + entry.amount, 0));
  const successfulReferrals = getQualifiedReferrals(state).length;
  const earnedMilestones = Math.floor(successfulReferrals / REQUIRED_REFERRALS);
  const redeemedMilestones = confirmed.filter((entry) => entry.type === "reward-redemption").length;
  return {
    availableBalance,
    lifetimeEarnings,
    redeemedRewards,
    successfulReferrals,
    pendingReferrals: state.history.filter((referral) => referral.status === "pending").length,
    earnedMilestones,
    redeemedMilestones,
    rewardAvailable: earnedMilestones > redeemedMilestones && availableBalance >= REFERRAL_REWARD,
    progress: Math.min(100, ((successfulReferrals % REQUIRED_REFERRALS || (successfulReferrals ? REQUIRED_REFERRALS : 0)) / REQUIRED_REFERRALS) * 100),
  };
};

export const validateReferralReward = (state, merchandiseSubtotal) => {
  const wallet = getWalletSummary(state);
  if (!wallet.rewardAvailable) return { valid: false, message: "No ₹500 referral reward is currently available." };
  if (merchandiseSubtotal < MINIMUM_REWARD_ORDER) return { valid: false, message: `Add ${MINIMUM_REWARD_ORDER - merchandiseSubtotal} more in merchandise to use this reward.` };
  return { valid: true, amount: Math.min(REFERRAL_REWARD, merchandiseSubtotal) };
};

export const redeemReferralReward = ({ orderReference, merchandiseSubtotal }) => {
  const state = getReferralState();
  const duplicate = state.ledger.find((entry) => entry.type === "reward-redemption" && entry.orderReference === orderReference);
  if (duplicate) return state;
  const validation = validateReferralReward(state, merchandiseSubtotal);
  if (!validation.valid) throw new Error(validation.message);
  const wallet = getWalletSummary(state);
  const next = {
    ...state,
    ledger: [...state.ledger, {
      id: `wallet-redemption-${orderReference}`,
      reference: `WRD-${orderReference}`,
      orderReference,
      milestone: wallet.redeemedMilestones + 1,
      date: new Date().toISOString(),
      description: "₹500 referral milestone reward applied",
      amount: -validation.amount,
      type: "reward-redemption",
      status: "confirmed",
    }],
  };
  return saveReferralState(next);
};
