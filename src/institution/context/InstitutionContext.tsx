import React, { createContext, useContext, useState, useCallback } from "react";

export type ReviewStatus = "draft" | "pending" | "approved" | "rejected";

export interface InstitutionProfile {
  name: string;
  creditCode: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  introduction: string;
  businessHours: string;
  contactPhone: string;
  transport: string;
  documents: {
    businessLicense: boolean;
    medicalLicense: boolean;
    personIdCard: boolean;
    otherDocs: boolean;
  };
  reviewStatus: ReviewStatus;
  rejectionReason?: string;
}

const defaultProfile: InstitutionProfile = {
  name: "",
  creditCode: "",
  contactPerson: "",
  mobile: "",
  email: "",
  address: "",
  introduction: "",
  businessHours: "",
  contactPhone: "",
  transport: "",
  documents: {
    businessLicense: false,
    medicalLicense: false,
    personIdCard: false,
    otherDocs: false,
  },
  reviewStatus: "draft",
};

interface InstitutionContextType {
  profile: InstitutionProfile;
  isRegistered: boolean;
  register: (data: Partial<InstitutionProfile>) => void;
  updateProfile: (data: Partial<InstitutionProfile>) => void;
  submitForReview: () => void;
  simulateApprove: () => void;
  simulateReject: (reason: string) => void;
  resetToDraft: () => void;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<InstitutionProfile>(defaultProfile);
  const [isRegistered, setIsRegistered] = useState(false);

  const register = useCallback((data: Partial<InstitutionProfile>) => {
    setProfile(prev => ({ ...prev, ...data, reviewStatus: "draft" }));
    setIsRegistered(true);
  }, []);

  const updateProfile = useCallback((data: Partial<InstitutionProfile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  }, []);

  const submitForReview = useCallback(() => {
    setProfile(prev => ({ ...prev, reviewStatus: "pending" }));
  }, []);

  const simulateApprove = useCallback(() => {
    setProfile(prev => ({ ...prev, reviewStatus: "approved", rejectionReason: undefined }));
  }, []);

  const simulateReject = useCallback((reason: string) => {
    setProfile(prev => ({ ...prev, reviewStatus: "rejected", rejectionReason: reason }));
  }, []);

  const resetToDraft = useCallback(() => {
    setProfile(prev => ({ ...prev, reviewStatus: "draft", rejectionReason: undefined }));
  }, []);

  return (
    <InstitutionContext.Provider value={{ profile, isRegistered, register, updateProfile, submitForReview, simulateApprove, simulateReject, resetToDraft }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const ctx = useContext(InstitutionContext);
  if (!ctx) throw new Error("useInstitution must be used within InstitutionProvider");
  return ctx;
};
