import React, { createContext, useContext, useState, useCallback } from "react";
import type { ConsultationOrder, ChatMessage, ConsultationType } from "@/data/mockData";
import { mockChatMessages } from "@/data/mockData";

interface ConsultationContextType {
  consultations: ConsultationOrder[];
  addConsultation: (order: ConsultationOrder) => void;
  cancelConsultation: (id: string) => void;
  acceptConsultation: (id: string) => void;
  completeConsultation: (id: string) => void;
  markConsultationReviewed: (id: string) => void;
  getMessages: (orderId: string) => ChatMessage[];
  addMessage: (orderId: string, msg: ChatMessage) => void;
  getUserMessageCount: (orderId: string) => number;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

const seedConsultations: ConsultationOrder[] = [
  {
    id: "con-1",
    orderNumber: "CON20260308001",
    doctorId: "od1",
    consultationType: "text_image",
    symptoms: "Lower right tooth pain for 3 days, worse when drinking cold water",
    medicalHistory: "No major dental issues before",
    imageCount: 2,
    price: 200,
    finalAmount: 200,
    paymentMethod: "credit-card",
    status: "in_consultation",
    createdAt: "2026-03-08T09:00:00",
    consultationStartedAt: "2026-03-09T10:00:00",
  },
  {
    id: "con-2",
    orderNumber: "CON20260305001",
    doctorId: "od2",
    consultationType: "video",
    symptoms: "Want to discuss braces options",
    medicalHistory: "Previous dental cleaning 6 months ago",
    imageCount: 0,
    price: 450,
    finalAmount: 450,
    paymentMethod: "alipay",
    status: "completed",
    createdAt: "2026-03-05T14:00:00",
    consultationStartedAt: "2026-03-05T15:00:00",
    consultationEndedAt: "2026-03-05T15:25:00",
    diagnosisNotes: {
      en: "Patient has mild crowding in the lower anterior teeth. Recommended clear aligner treatment (Invisalign) or ceramic braces. Treatment duration estimated at 12-18 months. No urgent dental issues detected.",
      zh: "患者下前牙有輕度擁擠。建議使用隱形矯正（Invisalign）或陶瓷牙箍治療。預計療程約12至18個月。未發現緊急牙齒問題。",
    },
    medicationAdvice: {
      en: "No medication required at this stage. Maintain regular brushing and flossing. Schedule an in-clinic visit for detailed assessment and X-rays before starting treatment.",
      zh: "現階段無需用藥。保持定期刷牙和使用牙線。在開始治療前安排到診詳細評估和X光片。",
    },
    reviewed: false,
  },
  {
    id: "con-3",
    orderNumber: "CON20260309001",
    doctorId: "od4",
    consultationType: "text_image",
    symptoms: "Missing tooth, considering implant options",
    medicalHistory: "Tooth extracted 3 months ago",
    imageCount: 1,
    price: 300,
    finalAmount: 300,
    paymentMethod: "wechat",
    status: "pending_acceptance",
    createdAt: "2026-03-09T08:00:00",
  },
];

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<ConsultationOrder[]>(seedConsultations);
  const [messageStore, setMessageStore] = useState<Record<string, ChatMessage[]>>({
    "con-1": [...mockChatMessages],
  });

  const addConsultation = useCallback((order: ConsultationOrder) => {
    setConsultations((prev) => [order, ...prev]);
    setMessageStore((prev) => ({ ...prev, [order.id]: [] }));
  }, []);

  const cancelConsultation = useCallback((id: string) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "cancelled" as const, cancelledAt: new Date().toISOString(), refundAmount: c.finalAmount }
          : c
      )
    );
  }, []);

  const acceptConsultation = useCallback((id: string) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "in_consultation" as const, consultationStartedAt: new Date().toISOString() }
          : c
      )
    );
  }, []);

  const completeConsultation = useCallback((id: string) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "completed" as const,
              consultationEndedAt: new Date().toISOString(),
              diagnosisNotes: {
                en: "Based on the consultation, no immediate concerns were found. Recommend scheduling an in-clinic visit for a thorough examination.",
                zh: "根據諮詢，未發現即時問題。建議安排到診進行全面檢查。",
              },
              medicationAdvice: {
                en: "Maintain regular oral hygiene. Use a soft-bristled toothbrush and fluoride toothpaste.",
                zh: "保持定期口腔衛生。使用軟毛牙刷及含氟牙膏。",
              },
            }
          : c
      )
    );
  }, []);

  const markConsultationReviewed = useCallback((id: string) => {
    setConsultations((prev) => prev.map((c) => (c.id === id ? { ...c, reviewed: true } : c)));
  }, []);

  const getMessages = useCallback(
    (orderId: string) => messageStore[orderId] || [],
    [messageStore]
  );

  const addMessage = useCallback((orderId: string, msg: ChatMessage) => {
    setMessageStore((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), msg],
    }));
  }, []);

  const getUserMessageCount = useCallback(
    (orderId: string) => (messageStore[orderId] || []).filter((m) => m.sender === "user").length,
    [messageStore]
  );

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        addConsultation,
        cancelConsultation,
        acceptConsultation,
        completeConsultation,
        markConsultationReviewed,
        getMessages,
        addMessage,
        getUserMessageCount,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error("useConsultation must be within ConsultationProvider");
  return ctx;
};
