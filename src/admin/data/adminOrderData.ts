export interface AdminOrder {
  id: string;
  type: "in_clinic" | "consultation";
  userId: string; userName: string; userPhone: string;
  institutionId: string; institution: string;
  doctorId: string; doctor: string;
  service: string;
  amount: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  settlementStatus: "unsettled" | "settled" | "refunded";
  paymentMethod: string;
  createdAt: string;
  appointmentDate?: string;
  hasDispute: boolean;
  disputeId?: string;
}

export interface AdminDispute {
  id: string;
  orderId: string;
  source: "user" | "institution" | "doctor";
  sourceName: string;
  subject: string;
  description: string;
  evidence: string[];
  status: "open" | "under_review" | "resolved" | "refunded" | "compensated" | "closed";
  createdAt: string;
  resolvedAt?: string;
  adminNotes: string;
  resolution?: string;
  refundAmount?: number;
  couponCompensation?: string;
}

export const adminOrders: AdminOrder[] = [
  { id: "ORD-20260309-001", type: "in_clinic", userId: "USR-001", userName: "Chan Tai Man", userPhone: "+852 9123 4567", institutionId: "INST-001", institution: "Bright Smile Dental Centre", doctorId: "DOC-001", doctor: "Dr. Sarah Chen", service: "Teeth Cleaning", amount: 800, status: "completed", settlementStatus: "settled", paymentMethod: "Credit Card", createdAt: "2026-03-09 09:30", appointmentDate: "2026-03-09 14:00", hasDispute: true, disputeId: "DSP-004" },
  { id: "ORD-20260309-002", type: "in_clinic", userId: "USR-002", userName: "Wong Siu Ming", userPhone: "+852 9234 5678", institutionId: "INST-002", institution: "Happy Teeth Clinic", doctorId: "DOC-002", doctor: "Dr. Michael Wong", service: "Dental Implant Consult", amount: 1500, status: "confirmed", settlementStatus: "unsettled", paymentMethod: "Alipay", createdAt: "2026-03-09 10:15", appointmentDate: "2026-03-10 10:00", hasDispute: false },
  { id: "OC-20260309-001", type: "consultation", userId: "USR-003", userName: "Lee Ka Yan", userPhone: "+852 9345 6789", institutionId: "", institution: "Online", doctorId: "DOC-003", doctor: "Dr. Emily Lau", service: "Text Consultation", amount: 200, status: "in_progress", settlementStatus: "unsettled", paymentMethod: "WeChat Pay", createdAt: "2026-03-09 11:00", hasDispute: false },
  { id: "ORD-20260308-001", type: "in_clinic", userId: "USR-005", userName: "Ho Wing Kei", userPhone: "+852 9567 8901", institutionId: "INST-003", institution: "Central Dental Hospital", doctorId: "DOC-003", doctor: "Dr. Emily Lau", service: "Root Canal Treatment", amount: 5000, status: "completed", settlementStatus: "settled", paymentMethod: "Credit Card", createdAt: "2026-03-08 08:45", appointmentDate: "2026-03-08 15:00", hasDispute: true, disputeId: "DSP-001" },
  { id: "ORD-20260307-001", type: "in_clinic", userId: "USR-006", userName: "Ng Chi Wai", userPhone: "+852 9678 9012", institutionId: "INST-001", institution: "Bright Smile Dental Centre", doctorId: "DOC-001", doctor: "Dr. Sarah Chen", service: "Orthodontics Adjustment", amount: 2000, status: "completed", settlementStatus: "settled", paymentMethod: "Credit Card", createdAt: "2026-03-07 09:00", appointmentDate: "2026-03-07 11:00", hasDispute: false },
  { id: "OC-20260307-002", type: "consultation", userId: "USR-001", userName: "Chan Tai Man", userPhone: "+852 9123 4567", institutionId: "", institution: "Online", doctorId: "DOC-007", doctor: "Dr. Grace Fung", service: "Video Consultation", amount: 500, status: "completed", settlementStatus: "settled", paymentMethod: "Alipay", createdAt: "2026-03-07 14:30", hasDispute: true, disputeId: "DSP-002" },
  { id: "ORD-20260306-001", type: "in_clinic", userId: "USR-002", userName: "Wong Siu Ming", userPhone: "+852 9234 5678", institutionId: "INST-002", institution: "Happy Teeth Clinic", doctorId: "DOC-002", doctor: "Dr. Michael Wong", service: "Teeth Whitening", amount: 3000, status: "cancelled", settlementStatus: "refunded", paymentMethod: "Credit Card", createdAt: "2026-03-06 16:00", appointmentDate: "2026-03-08 09:00", hasDispute: false },
  { id: "ORD-20260305-001", type: "in_clinic", userId: "USR-005", userName: "Ho Wing Kei", userPhone: "+852 9567 8901", institutionId: "INST-001", institution: "Bright Smile Dental Centre", doctorId: "DOC-001", doctor: "Dr. Sarah Chen", service: "Dental Check-up", amount: 600, status: "completed", settlementStatus: "settled", paymentMethod: "WeChat Pay", createdAt: "2026-03-05 10:30", appointmentDate: "2026-03-05 16:00", hasDispute: false },
  { id: "OC-20260304-001", type: "consultation", userId: "USR-006", userName: "Ng Chi Wai", userPhone: "+852 9678 9012", institutionId: "", institution: "Online", doctorId: "DOC-002", doctor: "Dr. Michael Wong", service: "Text Consultation", amount: 200, status: "completed", settlementStatus: "settled", paymentMethod: "Alipay", createdAt: "2026-03-04 13:00", hasDispute: false },
  { id: "ORD-20260303-001", type: "in_clinic", userId: "USR-003", userName: "Lee Ka Yan", userPhone: "+852 9345 6789", institutionId: "INST-003", institution: "Central Dental Hospital", doctorId: "DOC-003", doctor: "Dr. Emily Lau", service: "Wisdom Tooth Extraction", amount: 4000, status: "completed", settlementStatus: "unsettled", paymentMethod: "Credit Card", createdAt: "2026-03-03 09:15", appointmentDate: "2026-03-03 14:30", hasDispute: true, disputeId: "DSP-003" },
];

export const adminDisputes: AdminDispute[] = [
  {
    id: "DSP-001", orderId: "ORD-20260308-001", source: "user", sourceName: "Ho Wing Kei",
    subject: "Overcharged for root canal treatment",
    description: "I was quoted HK$4,000 but charged HK$5,000 after additional procedures were performed without my prior consent.",
    evidence: ["receipt_photo.jpg", "quote_screenshot.png"],
    status: "under_review", createdAt: "2026-03-08 18:00", adminNotes: "Contacted institution for clarification. Awaiting response.",
    resolution: undefined, refundAmount: undefined, couponCompensation: undefined,
  },
  {
    id: "DSP-002", orderId: "OC-20260307-002", source: "user", sourceName: "Chan Tai Man",
    subject: "Doctor did not join video consultation",
    description: "I waited 20 minutes but the doctor never connected to the video call. I would like a full refund.",
    evidence: ["waiting_screenshot.png"],
    status: "resolved", createdAt: "2026-03-07 15:10", resolvedAt: "2026-03-08 10:00",
    adminNotes: "Verified with system logs. Doctor had a scheduling conflict. Full refund approved.",
    resolution: "Full refund issued", refundAmount: 500, couponCompensation: undefined,
  },
  {
    id: "DSP-003", orderId: "ORD-20260303-001", source: "institution", sourceName: "Central Dental Hospital",
    subject: "Patient no-show, requesting cancellation fee",
    description: "Patient did not show up for the scheduled wisdom tooth extraction. We request the standard cancellation fee be applied.",
    evidence: ["appointment_log.pdf"],
    status: "open", createdAt: "2026-03-03 16:00", adminNotes: "",
    resolution: undefined, refundAmount: undefined, couponCompensation: undefined,
  },
  {
    id: "DSP-004", orderId: "ORD-20260309-001", source: "doctor", sourceName: "Dr. Sarah Chen",
    subject: "Patient left negative review with false claims",
    description: "The patient left a 1-star review claiming I was unprofessional, but the treatment was completed successfully and the patient was satisfied during the visit.",
    evidence: ["treatment_notes.pdf", "patient_consent.pdf"],
    status: "compensated", createdAt: "2026-03-09 12:00", resolvedAt: "2026-03-09 16:00",
    adminNotes: "Reviewed treatment records. Review content flagged for moderation. Coupon issued to patient as goodwill.",
    resolution: "Review flagged, coupon compensation to patient", refundAmount: undefined, couponCompensation: "HK$100 coupon",
  },
];
