import {
  BadgeIndianRupee,
  Check,
  Clipboard,
  Copy,
  Gift,
  LockKeyhole,
  Share2,
  ShoppingBag,
  Users,
  WalletCards,
} from "lucide-react";
import { useState } from "react";
import { useReferral } from "../context/ReferralContext";
import { currency } from "../utils/currency";
import {
  MINIMUM_REWARD_ORDER,
  REFERRAL_REWARD,
  REQUIRED_REFERRALS,
} from "../services/referralService";

const steps = [
  [Share2, "Refer a friend", "Share your unique referral code with friends."],
  [ShoppingBag, "Friend makes a purchase", "A completed, qualifying first purchase earns a ₹100 credit."],
  [WalletCards, "Wallet balance", "Every confirmed referral credit is recorded as a separate ledger entry."],
  [Gift, "Redeem after 5 referrals", "Five successful referrals unlock one ₹500 reward entitlement."],
  [LockKeyhole, "Minimum purchase", "The reward is available on merchandise orders of ₹1,000 or more."],
  [BadgeIndianRupee, "Apply the reward", "Apply ₹500, then pay the remainder plus applicable delivery charges."],
];

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const field = document.createElement("textarea");
  field.className = "clipboard-helper";
  field.value = value;
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
};

export default function ReferralPage() {
  const { profile, history, ledger, wallet } = useReferral();
  const [copied, setCopied] = useState("");
  const referralLink = `${window.location.origin}/?ref=${encodeURIComponent(profile.referralCode)}`;
  const shareMessage = `Order your favorites from Tiffin & Co.! Use my referral code ${profile.referralCode} when you make your first qualifying purchase. ${referralLink}`;
  const copy = async (type, value) => {
    await copyText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(""), 1800);
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Tiffin & Co. Referral", text: shareMessage, url: referralLink }); return; } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    await copy("message", shareMessage);
  };
  const referralsTowardNext = wallet.successfulReferrals % REQUIRED_REFERRALS || (wallet.successfulReferrals ? REQUIRED_REFERRALS : 0);

  return (
    <div className="referral-page">
      <section className="referral-hero">
        <div>
          <span className="eyebrow">Referral & Earn · Demo account</span>
          <h1>Good food is better <em>shared.</em></h1>
          <p>Invite friends to Tiffin & Co., earn ₹100 for each completed qualifying referral, and unlock a ₹500 milestone reward.</p>
        </div>
        <div className="referral-code-card">
          <small>Your referral code</small>
          <strong>{profile.referralCode}</strong>
          <span>{profile.name} · locally stored demonstration</span>
          <div>
            <button type="button" onClick={() => copy("code", profile.referralCode)}>{copied === "code" ? <Check /> : <Copy />}{copied === "code" ? "Copied" : "Copy code"}</button>
            <button type="button" onClick={share}><Share2 />{copied === "message" ? "Message copied" : "Share"}</button>
          </div>
        </div>
      </section>

      <div className="demo-notice"><LockKeyhole /><span><strong>Frontend demonstration</strong>This referral profile and wallet are stored locally and are not real money. Production qualification and redemption require atomic backend validation.</span></div>

      <section className="referral-stats">
        <article><Users /><span><small>Successful referrals</small><strong>{wallet.successfulReferrals}</strong><em>{wallet.pendingReferrals} pending</em></span></article>
        <article><WalletCards /><span><small>Available balance</small><strong>{currency(wallet.availableBalance)}</strong><em>{currency(wallet.lifetimeEarnings)} lifetime earnings</em></span></article>
        <article className={wallet.rewardAvailable ? "eligible" : ""}><Gift /><span><small>Reward status</small><strong>{wallet.rewardAvailable ? "₹500 ready" : "Not yet eligible"}</strong><em>{wallet.redeemedRewards ? `${currency(wallet.redeemedRewards)} redeemed` : "No rewards redeemed"}</em></span></article>
      </section>

      <section className="referral-progress-card">
        <div><span className="eyebrow">Milestone progress</span><h2>{referralsTowardNext} of {REQUIRED_REFERRALS} qualifying referrals</h2><p>{wallet.rewardAvailable ? `Your ${currency(REFERRAL_REWARD)} reward is ready for an eligible checkout.` : `${REQUIRED_REFERRALS - referralsTowardNext} more to unlock your next reward.`}</p></div>
        <div className="progress-visual"><strong>{Math.round(wallet.progress)}%</strong><div className="progress-track"><span className={`progress-${Math.round(wallet.progress)}`} /></div><small>Minimum checkout merchandise subtotal: {currency(MINIMUM_REWARD_ORDER)}</small></div>
      </section>

      <section className="referral-section">
        <div className="section-heading"><div><span className="eyebrow">Simple and transparent</span><h2>How referrals work</h2></div><p>Only completed, qualifying purchases create confirmed wallet credits.</p></div>
        <div className="referral-steps">{steps.map(([Icon, title, description], index) => <article key={title}><span>{index + 1}</span><Icon /><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="share-panel">
        <div><span className="eyebrow">Ready to invite someone?</span><h2>Share your code</h2><p>{shareMessage}</p></div>
        <div><button type="button" className="secondary-button" onClick={() => copy("link", referralLink)}><Clipboard />{copied === "link" ? "Link copied" : "Copy link"}</button><button type="button" className="primary-button" onClick={share}><Share2 />Share referral</button></div>
      </section>

      <div className="referral-data-grid">
        <section className="history-card">
          <div className="data-card-head"><div><span className="eyebrow">Privacy-safe activity</span><h2>Referral history</h2></div><span>{history.length} referrals</span></div>
          {history.length ? <div className="data-table"><div className="data-row data-head"><span>Customer</span><span>Date</span><span>Status</span><span>Reward</span></div>{history.map((referral) => <div className="data-row" key={referral.id}><span><strong>{referral.maskedCustomer}</strong><small>{referral.walletStatus === "credited" ? "Wallet credited" : "Awaiting qualifying order"}</small></span><span>{new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(referral.referredAt))}</span><span><b className={`status ${referral.status}`}>{referral.status}</b></span><span>{currency(referral.rewardAmount)}</span></div>)}</div> : <div className="empty-state"><h3>No referrals yet</h3><p>Share your code to begin.</p></div>}
        </section>

        <section className="wallet-card">
          <div className="data-card-head"><div><span className="eyebrow">Confirmed ledger</span><h2>Wallet transactions</h2></div><strong>{currency(wallet.availableBalance)}</strong></div>
          <div className="wallet-ledger">{[...ledger].reverse().map((entry) => <article key={entry.id}><span className={`ledger-icon ${entry.amount < 0 ? "debit" : ""}`}>{entry.amount < 0 ? "−" : "+"}</span><div><strong>{entry.description}</strong><small>{entry.reference} · {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(entry.date))}</small></div><span className={entry.amount < 0 ? "debit-amount" : "credit-amount"}>{entry.amount < 0 ? "−" : "+"}{currency(Math.abs(entry.amount))}<small>{entry.status}</small></span></article>)}</div>
        </section>
      </div>
    </div>
  );
}
