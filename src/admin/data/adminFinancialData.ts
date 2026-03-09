export interface AdminTransaction {
  id: string;
  orderId: string;
  userName: string;
  institutionName: string;
  paymentAmount: number;
  paymentMethod: "credit_card" | "fps" | "alipay" | "wechat_pay" | "payme";
  paymentTime: string;
  serviceFeeRate: number; // e.g. 0.10
  serviceFee: number;
  settlementAmount: number;
  orderType: "in_clinic" | "consultation";
  status: "completed" | "refunded" | "pending";
}

export interface AdminSettlement {
  id: string;
  institutionId: string;
  institutionName: string;
  cycle: string; // e.g. "2026-02"
  orderCount: number;
  grossAmount: number;
  serviceFeeRate: number;
  totalServiceFee: number;
  netSettlement: number;
  status: "pending" | "confirmed" | "settled" | "disputed";
  generatedAt: string;
  settledAt?: string;
  orders: { orderId: string; amount: number; fee: number; net: number; date: string }[];
}

export interface AdminWithdrawal {
  id: string;
  institutionId: string;
  institutionName: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  requestedAt: string;
  status: "pending" | "approved" | "payment_arranged" | "paid" | "rejected";
  processedAt?: string;
  rejectionReason?: string;
  adminNote?: string;
}

export const mockTransactions: AdminTransaction[] = [
  { id: "TXN-001", orderId: "ORD-20260309-001", userName: "Chan Tai Man", institutionName: "Bright Smile Dental Centre", paymentAmount: 800, paymentMethod: "credit_card", paymentTime: "2026-03-09 09:30", serviceFeeRate: 0.10, serviceFee: 80, settlementAmount: 720, orderType: "in_clinic", status: "completed" },
  { id: "TXN-002", orderId: "ORD-20260309-002", userName: "Wong Siu Ming", institutionName: "Happy Teeth Clinic", paymentAmount: 1500, paymentMethod: "alipay", paymentTime: "2026-03-09 10:15", serviceFeeRate: 0.10, serviceFee: 150, settlementAmount: 1350, orderType: "in_clinic", status: "pending" },
  { id: "TXN-003", orderId: "OC-20260309-001", userName: "Lee Ka Yan", institutionName: "Online Consultation", paymentAmount: 200, paymentMethod: "wechat_pay", paymentTime: "2026-03-09 11:00", serviceFeeRate: 0.12, serviceFee: 24, settlementAmount: 176, orderType: "consultation", status: "pending" },
  { id: "TXN-004", orderId: "ORD-20260308-001", userName: "Ho Wing Kei", institutionName: "Central Dental Hospital", paymentAmount: 5000, paymentMethod: "credit_card", paymentTime: "2026-03-08 08:45", serviceFeeRate: 0.12, serviceFee: 600, settlementAmount: 4400, orderType: "in_clinic", status: "completed" },
  { id: "TXN-005", orderId: "ORD-20260307-001", userName: "Ng Chi Wai", institutionName: "Bright Smile Dental Centre", paymentAmount: 2000, paymentMethod: "credit_card", paymentTime: "2026-03-07 09:00", serviceFeeRate: 0.10, serviceFee: 200, settlementAmount: 1800, orderType: "in_clinic", status: "completed" },
  { id: "TXN-006", orderId: "OC-20260307-002", userName: "Chan Tai Man", institutionName: "Online Consultation", paymentAmount: 500, paymentMethod: "alipay", paymentTime: "2026-03-07 14:30", serviceFeeRate: 0.12, serviceFee: 60, settlementAmount: 440, orderType: "consultation", status: "completed" },
  { id: "TXN-007", orderId: "ORD-20260306-001", userName: "Wong Siu Ming", institutionName: "Happy Teeth Clinic", paymentAmount: 3000, paymentMethod: "credit_card", paymentTime: "2026-03-06 16:00", serviceFeeRate: 0.10, serviceFee: 300, settlementAmount: 2700, orderType: "in_clinic", status: "refunded" },
  { id: "TXN-008", orderId: "ORD-20260305-001", userName: "Ho Wing Kei", institutionName: "Bright Smile Dental Centre", paymentAmount: 600, paymentMethod: "wechat_pay", paymentTime: "2026-03-05 10:30", serviceFeeRate: 0.10, serviceFee: 60, settlementAmount: 540, orderType: "in_clinic", status: "completed" },
  { id: "TXN-009", orderId: "OC-20260304-001", userName: "Ng Chi Wai", institutionName: "Online Consultation", paymentAmount: 200, paymentMethod: "alipay", paymentTime: "2026-03-04 13:00", serviceFeeRate: 0.12, serviceFee: 24, settlementAmount: 176, orderType: "consultation", status: "completed" },
  { id: "TXN-010", orderId: "ORD-20260303-001", userName: "Lee Ka Yan", institutionName: "Central Dental Hospital", paymentAmount: 4000, paymentMethod: "credit_card", paymentTime: "2026-03-03 09:15", serviceFeeRate: 0.12, serviceFee: 480, settlementAmount: 3520, orderType: "in_clinic", status: "completed" },
];

export const mockSettlements: AdminSettlement[] = [
  {
    id: "STL-001", institutionId: "INST-001", institutionName: "Bright Smile Dental Centre",
    cycle: "2026-02", orderCount: 156, grossAmount: 840000, serviceFeeRate: 0.10,
    totalServiceFee: 84000, netSettlement: 756000, status: "settled",
    generatedAt: "2026-03-01", settledAt: "2026-03-05",
    orders: [
      { orderId: "ORD-20260309-001", amount: 800, fee: 80, net: 720, date: "2026-03-09" },
      { orderId: "ORD-20260201-015", amount: 3200, fee: 320, net: 2880, date: "2026-02-01" },
      { orderId: "ORD-20260202-003", amount: 1800, fee: 180, net: 1620, date: "2026-02-02" },
      { orderId: "OC-20260307-002", amount: 500, fee: 50, net: 450, date: "2026-03-07" },
      { orderId: "ORD-20260305-001", amount: 600, fee: 60, net: 540, date: "2026-03-05" },
    ],
  },
  {
    id: "STL-002", institutionId: "INST-002", institutionName: "Happy Teeth Clinic",
    cycle: "2026-02", orderCount: 128, grossAmount: 760000, serviceFeeRate: 0.10,
    totalServiceFee: 76000, netSettlement: 684000, status: "settled",
    generatedAt: "2026-03-01", settledAt: "2026-03-05",
    orders: [
      { orderId: "ORD-20260201-020", amount: 4200, fee: 420, net: 3780, date: "2026-02-01" },
      { orderId: "ORD-20260202-010", amount: 2800, fee: 280, net: 2520, date: "2026-02-02" },
      { orderId: "ORD-20260309-002", amount: 1500, fee: 150, net: 1350, date: "2026-03-09" },
    ],
  },
  {
    id: "STL-003", institutionId: "INST-003", institutionName: "Central Dental Hospital",
    cycle: "2026-02", orderCount: 195, grossAmount: 930000, serviceFeeRate: 0.12,
    totalServiceFee: 111600, netSettlement: 818400, status: "confirmed",
    generatedAt: "2026-03-01",
    orders: [
      { orderId: "ORD-20260201-030", amount: 6800, fee: 816, net: 5984, date: "2026-02-01" },
      { orderId: "OC-20260309-001", amount: 200, fee: 24, net: 176, date: "2026-03-09" },
      { orderId: "ORD-20260203-018", amount: 4500, fee: 540, net: 3960, date: "2026-02-03" },
    ],
  },
  {
    id: "STL-004", institutionId: "INST-004", institutionName: "New Smile Dental",
    cycle: "2026-03", orderCount: 72, grossAmount: 580000, serviceFeeRate: 0.10,
    totalServiceFee: 58000, netSettlement: 522000, status: "pending",
    generatedAt: "2026-03-08",
    orders: [
      { orderId: "ORD-20260301-040", amount: 3600, fee: 360, net: 3240, date: "2026-03-01" },
      { orderId: "ORD-20260302-025", amount: 2200, fee: 220, net: 1980, date: "2026-03-02" },
    ],
  },
  {
    id: "STL-005", institutionId: "INST-005", institutionName: "Pearl Dental Care",
    cycle: "2026-02", orderCount: 88, grossAmount: 420000, serviceFeeRate: 0.15,
    totalServiceFee: 63000, netSettlement: 357000, status: "disputed",
    generatedAt: "2026-03-01",
    orders: [
      { orderId: "ORD-20260201-050", amount: 5500, fee: 825, net: 4675, date: "2026-02-01" },
      { orderId: "ORD-20260203-032", amount: 3800, fee: 570, net: 3230, date: "2026-02-03" },
    ],
  },
];

export const mockWithdrawals: AdminWithdrawal[] = [
  { id: "WDR-001", institutionId: "INST-001", institutionName: "Bright Smile Dental Centre", amount: 756000, bankName: "HSBC", bankAccount: "****5678", requestedAt: "2026-03-05 10:00", status: "paid", processedAt: "2026-03-06 14:00", adminNote: "Wire transfer completed" },
  { id: "WDR-002", institutionId: "INST-002", institutionName: "Happy Teeth Clinic", amount: 684000, bankName: "Bank of China (HK)", bankAccount: "****1234", requestedAt: "2026-03-05 11:30", status: "payment_arranged", processedAt: "2026-03-06 15:00" },
  { id: "WDR-003", institutionId: "INST-003", institutionName: "Central Dental Hospital", amount: 818400, bankName: "Standard Chartered", bankAccount: "****9012", requestedAt: "2026-03-07 09:00", status: "approved", processedAt: "2026-03-07 16:00" },
  { id: "WDR-004", institutionId: "INST-004", institutionName: "New Smile Dental", amount: 522000, bankName: "Hang Seng Bank", bankAccount: "****3456", requestedAt: "2026-03-08 10:30", status: "pending" },
  { id: "WDR-005", institutionId: "INST-005", institutionName: "Pearl Dental Care", amount: 200000, bankName: "DBS Bank (HK)", bankAccount: "****7890", requestedAt: "2026-03-06 14:00", status: "rejected", processedAt: "2026-03-07 10:00", rejectionReason: "Settlement under dispute, please resolve dispute DSP-003 first" },
];
