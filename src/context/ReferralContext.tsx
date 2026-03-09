import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockReferralRecords as initialRecords, mockCoinTransactions as initialTx, type ReferralRecord, type CoinTransaction } from "@/data/mockData";

interface ReferralContextType {
  records: ReferralRecord[];
  transactions: CoinTransaction[];
  coinsBalance: number;
  totalReferred: number;
  completedFirstOrder: number;
  rewardsEarned: number;
  claimReward: (recordId: string) => boolean;
}

const ReferralContext = createContext<ReferralContextType | null>(null);

export const ReferralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<ReferralRecord[]>(initialRecords);
  const [transactions, setTransactions] = useState<CoinTransaction[]>(initialTx);

  const coinsBalance = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalReferred = records.length;
  const completedFirstOrder = records.filter((r) => r.firstOrderCompleted).length;
  const rewardsEarned = records.filter((r) => r.rewardStatus === "claimed").length;

  const claimReward = useCallback((recordId: string): boolean => {
    const record = records.find((r) => r.id === recordId);
    if (!record || record.rewardStatus !== "claimable") return false;
    setRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, rewardStatus: "claimed" as const } : r))
    );
    setTransactions((prev) => [
      {
        id: `ct-${Date.now()}`,
        type: "earned" as const,
        amount: 500,
        description: {
          en: `Referral reward: ${record.friendName} completed first order`,
          zh: `推薦獎賞：${record.friendName} 完成首張訂單`,
        },
        date: new Date().toISOString().split("T")[0],
      },
      ...prev,
    ]);
    return true;
  }, [records]);

  return (
    <ReferralContext.Provider value={{ records, transactions, coinsBalance, totalReferred, completedFirstOrder, rewardsEarned, claimReward }}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const ctx = useContext(ReferralContext);
  if (!ctx) throw new Error("useReferral must be used within ReferralProvider");
  return ctx;
};
