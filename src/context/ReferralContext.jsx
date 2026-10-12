import { createContext, useContext, useMemo, useState } from "react";
import {
  getReferralState,
  getWalletSummary,
  redeemReferralReward,
  validateReferralReward,
} from "../services/referralService";

const ReferralContext = createContext(null);

export function ReferralProvider({ children }) {
  const [state, setState] = useState(getReferralState);
  const wallet = useMemo(() => getWalletSummary(state), [state]);
  const validateReward = (subtotal) => validateReferralReward(state, subtotal);
  const redeemReward = (orderReference, subtotal) => {
    const next = redeemReferralReward({ orderReference, merchandiseSubtotal: subtotal });
    setState(next);
    return next;
  };
  const value = useMemo(() => ({
    profile: state.profile,
    history: state.history,
    ledger: state.ledger,
    wallet,
    validateReward,
    redeemReward,
  }), [state, wallet]);
  return <ReferralContext.Provider value={value}>{children}</ReferralContext.Provider>;
}

export const useReferral = () => useContext(ReferralContext);
