import React, { createContext, useContext, useState, useCallback } from "react";
import type { AppointmentOrder } from "@/data/mockData";

interface OrdersContextType {
  orders: AppointmentOrder[];
  addOrder: (order: AppointmentOrder) => void;
  cancelOrder: (id: string, refundAmount: number) => void;
  markReviewed: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Seed with sample orders
const seedOrders: AppointmentOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD20260301001",
    institutionId: "1",
    serviceId: "s2",
    doctorId: "d1",
    date: "2026-03-15",
    time: "10:00",
    status: "pending_treatment",
    price: 800,
    couponId: "c2",
    couponDeduction: 100,
    finalAmount: 700,
    createdAt: "2026-03-01T10:00:00",
  },
  {
    id: "ord-2",
    orderNumber: "ORD20260228001",
    institutionId: "2",
    serviceId: "s5",
    doctorId: "d4",
    date: "2026-02-20",
    time: "14:30",
    status: "completed",
    price: 250,
    couponDeduction: 0,
    finalAmount: 250,
    createdAt: "2026-02-18T09:00:00",
    reviewed: false,
  },
  {
    id: "ord-3",
    orderNumber: "ORD20260225001",
    institutionId: "1",
    serviceId: "s3",
    doctorId: "d3",
    date: "2026-03-20",
    time: "15:00",
    status: "pending_acceptance",
    price: 3500,
    couponDeduction: 0,
    finalAmount: 3500,
    createdAt: "2026-02-25T14:00:00",
  },
];

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<AppointmentOrder[]>(seedOrders);

  const addOrder = useCallback((order: AppointmentOrder) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const cancelOrder = useCallback((id: string, refundAmount: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "cancelled" as const, cancelledAt: new Date().toISOString(), refundAmount } : o
      )
    );
  }, []);

  const markReviewed = useCallback((id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, reviewed: true } : o)));
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, cancelOrder, markReviewed }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be within OrdersProvider");
  return ctx;
};
