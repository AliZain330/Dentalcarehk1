import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Coupon } from "@/data/mockData";
import { mockCoupons as initialCoupons } from "@/data/mockData";

interface CouponContextType {
  coupons: Coupon[];
  claimCoupon: (coupon: Coupon) => boolean;
  isClaimed: (couponId: string) => boolean;
  getApplicable: (price: number, type: "in_clinic" | "consultation") => Coupon[];
  calculateDeduction: (coupon: Coupon, price: number) => number;
}

const CouponContext = createContext<CouponContextType | null>(null);

export const CouponProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const claimCoupon = useCallback((coupon: Coupon): boolean => {
    if (claimedIds.has(coupon.id) || coupons.some((c) => c.id === coupon.id)) return false;
    setCoupons((prev) => [coupon, ...prev]);
    setClaimedIds((prev) => new Set(prev).add(coupon.id));
    return true;
  }, [claimedIds, coupons]);

  const isClaimed = useCallback((couponId: string) => {
    return claimedIds.has(couponId) || coupons.some((c) => c.id === couponId);
  }, [claimedIds, coupons]);

  const getApplicable = useCallback((price: number, type: "in_clinic" | "consultation") => {
    return coupons.filter((c) => {
      if (c.status !== "available") return false;
      if (c.minSpend > price) return false;
      if (c.applicableTo !== "all" && c.applicableTo !== type) return false;
      return true;
    });
  }, [coupons]);

  const calculateDeduction = useCallback((coupon: Coupon, price: number) => {
    if (coupon.discountAmount > 0) return coupon.discountAmount;
    const pctMatch = coupon.discount.match(/(\d+)%/);
    if (pctMatch) return Math.round(price * parseInt(pctMatch[1]) / 100);
    return 0;
  }, []);

  return (
    <CouponContext.Provider value={{ coupons, claimCoupon, isClaimed, getApplicable, calculateDeduction }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const ctx = useContext(CouponContext);
  if (!ctx) throw new Error("useCoupons must be used within CouponProvider");
  return ctx;
};
