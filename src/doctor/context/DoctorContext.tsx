import React, { createContext, useContext, useState, useCallback } from "react";
import type { ClinicOrderStatus, ConsultOrderStatus, DoctorClinicOrder, DoctorConsultOrder } from "@/doctor/pages/DoctorOrdersPage";

interface DoctorProfile {
  nameEn: string;
  nameZh: string;
  phone: string;
  email: string;
  licenseNo: string;
  bioEn: string;
  bioZh: string;
  specialties: string[];
  verified: boolean;
}

interface DoctorContextType {
  profile: DoctorProfile;
  updateProfile: (p: Partial<DoctorProfile>) => void;
  clinicOrders: DoctorClinicOrder[];
  consultOrders: DoctorConsultOrder[];
  updateClinicOrderStatus: (id: string, status: ClinicOrderStatus) => void;
  updateConsultOrderStatus: (id: string, status: ConsultOrderStatus, extras?: Partial<DoctorConsultOrder>) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
}

const DoctorContext = createContext<DoctorContextType | null>(null);

export const useDoctorContext = () => {
  const ctx = useContext(DoctorContext);
  if (!ctx) throw new Error("useDoctorContext must be used within DoctorProvider");
  return ctx;
};

// Re-export the initial mock data so it's the single source of truth
import { mockClinicOrders as initialClinicOrders, mockConsultOrders as initialConsultOrders } from "@/doctor/pages/DoctorOrdersPage";

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<DoctorProfile>({
    nameEn: "Chen Wei",
    nameZh: "陳偉",
    phone: "+852 9123 4567",
    email: "dr.chenwei@example.com",
    licenseNo: "DC-2018-00456",
    bioEn: "Over 8 years of experience in general and cosmetic dentistry. Specializes in dental implants and smile design.",
    bioZh: "超過8年一般牙科及美容牙科經驗，專注牙齒種植及笑容設計。",
    specialties: ["general", "cosmetic"],
    verified: true,
  });

  const [clinicOrders, setClinicOrders] = useState<DoctorClinicOrder[]>([...initialClinicOrders]);
  const [consultOrders, setConsultOrders] = useState<DoctorConsultOrder[]>([...initialConsultOrders]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const updateProfile = useCallback((p: Partial<DoctorProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
  }, []);

  const updateClinicOrderStatus = useCallback((id: string, status: ClinicOrderStatus) => {
    setClinicOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }, []);

  const updateConsultOrderStatus = useCallback((id: string, status: ConsultOrderStatus, extras?: Partial<DoctorConsultOrder>) => {
    setConsultOrders((prev) => prev.map((o) => o.id === id ? { ...o, status, ...extras } : o));
  }, []);

  return (
    <DoctorContext.Provider value={{
      profile, updateProfile,
      clinicOrders, consultOrders,
      updateClinicOrderStatus, updateConsultOrderStatus,
      isLoggedIn, setIsLoggedIn,
    }}>
      {children}
    </DoctorContext.Provider>
  );
};
