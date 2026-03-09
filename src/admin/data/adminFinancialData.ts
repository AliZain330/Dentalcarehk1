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
  { id: "TXN-001", orderId: "ORD-20260301-001", userName: "Chan Tai Man", institutionName: "Bright Smile Dental", paymentAmount: 1500, paymentMethod: "credit_card", paymentTime: "2026-03-01 10:30", serviceFeeRate: 0.10, serviceFee: 150, settlementAmount: 1350, orderType: "in_clinic", status: "completed" },
  { id: "TXN-002", orderId: "ORD-20260301-002", userName: "Wong Siu Ming", institutionName: "Happy Teeth Clinic", paymentAmount: 800, paymentMethod: "fps", paymentTime: "2026-03-01 11:15", serviceFeeRate: 0.10, serviceFee: 80, settlementAmount: 720, orderType: "in_clinic", status: "completed" },
  { id: "TXN-003", orderId: "CON-20260301-001", userName: "Lee Ka Yan", institutionName: "Central Dental Hospital", paymentAmount: 300, paymentMethod: "alipay", paymentTime: "2026-03-01 14:00", serviceFeeRate: 0.12, serviceFee: 36, settlementAmount: 264, orderType: "consultation", status: "completed" },
  { id: "TXN-004", orderId: "ORD-20260302-001", userName: "Cheung Wing Kee", institutionName: "Bright Smile Dental", paymentAmount: 3200, paymentMethod: "credit_card", paymentTime: "2026-03-02 09:45", serviceFeeRate: 0.10, serviceFee: 320, settlementAmount: 2880, orderType: "in_clinic", status: "completed" },
  { id: "TXN-005", orderId: "CON-20260302-002", userName: "Lam Mei Ling", institutionName: "Pearl Dental Centre", paymentAmount: 250, paymentMethod: "wechat_pay", paymentTime: "2026-03-02 16:20", serviceFeeRate: 0.15, serviceFee: 37.5, settlementAmount: 212.5, orderType: "consultation", status: "completed" },
  { id: "TXN-006", orderId: "ORD-20260303-001", userName: "Ho Chi Keung", institutionName: "Tsim Sha Tsui Dental", paymentAmount: 4800, paymentMethod: "payme", paymentTime: "2026-03-03 10:00", serviceFeeRate: 0.10, serviceFee: 480, settlementAmount: 4320, orderType: "in_clinic", status: "completed" },
  { id: "TXN-007", orderId: "ORD-20260303-002", userName: "Ng Wai Man", institutionName: "Happy Teeth Clinic", paymentAmount: 1200, paymentMethod: "credit_card", paymentTime: "2026-03-03 14:30", serviceFeeRate: 0.10, serviceFee: 120, settlementAmount: 1080, orderType: "in_clinic", status: "refunded" },
  { id: "TXN-008", orderId: "CON-20260304-001", userName: "Yip Hoi Ching", institutionName: "Central Dental Hospital", paymentAmount: 350, paymentMethod: "fps", paymentTime: "2026-03-04 09:00", serviceFeeRate: 0.12, serviceFee: 42, settlementAmount: 308, orderType: "consultation", status: "pending" },
  { id: "TXN-009", orderId: "ORD-20260304-002", userName: "Fung Siu Wai", institutionName: "Bright Smile Dental", paymentAmount: 2600, paymentMethod: "credit_card", paymentTime: "2026-03-04 11:45", serviceFeeRate: 0.10, serviceFee: 260, settlementAmount: 2340, orderType: "in_clinic", status: "completed" },
  { id: "TXN-010", orderId: "ORD-20260305-001", userName: "Kwok Man Hin", institutionName: "Pearl Dental Centre", paymentAmount: 5500, paymentMethod: "fps", paymentTime: "2026-03-05 15:00", serviceFeeRate: 0.15, serviceFee: 825, settlementAmount: 4675, orderType: "in_clinic", status: "completed" },
];

export const mockSettlements: AdminSettlement[] = [
  {
    id: "STL-001", institutionId: "INST-001", institutionName: "Bright Smile Dental",
    cycle: "2026-02", orderCount: 156, grossAmount: 840000, serviceFeeRate: 0.10,
    totalServiceFee: 84000, netSettlement: 756000, status: "settled",
    generatedAt: "2026-03-01", settledAt: "2026-03-05",
    orders: [
      { orderId: "ORD-20260201-001", amount: 5400, fee: 540, net: 4860, date: "2026-02-01" },
      { orderId: "ORD-20260201-015", amount: 3200, fee: 320, net: 2880, date: "2026-02-01" },
      { orderId: "ORD-20260202-003", amount: 1800, fee: 180, net: 1620, date: "2026-02-02" },
      { orderId: "CON-20260203-001", amount: 300, fee: 30, net: 270, date: "2026-02-03" },
      { orderId: "ORD-20260205-008", amount: 7200, fee: 720, net: 6480, date: "2026-02-05" },
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
      { orderId: "CON-20260204-005", amount: 350, fee: 35, net: 315, date: "2026-02-04" },
    ],
  },
  {
    id: "STL-003", institutionId: "INST-003", institutionName: "Central Dental Hospital",
    cycle: "2026-02", orderCount: 195, grossAmount: 930000, serviceFeeRate: 0.12,
    totalServiceFee: 111600, netSettlement: 818400, status: "confirmed",
    generatedAt: "2026-03-01",
    orders: [
      { orderId: "ORD-20260201-030", amount: 6800, fee: 816, net: 5984, date: "2026-02-01" },
      { orderId: "CON-20260202-012", amount: 300, fee: 36, net: 264, date: "2026-02-02" },
      { orderId: "ORD-20260203-018", amount: 4500, fee: 540, net: 3960, date: "2026-02-03" },
    ],
  },
  {
    id: "STL-004", institutionId: "INST-004", institutionName: "Tsim Sha Tsui Dental",
    cycle: "2026-03", orderCount: 72, grossAmount: 580000, serviceFeeRate: 0.10,
    totalServiceFee: 58000, netSettlement: 522000, status: "pending",
    generatedAt: "2026-03-08",
    orders: [
      { orderId: "ORD-20260301-040", amount: 3600, fee: 360, net: 3240, date: "2026-03-01" },
      { orderId: "ORD-20260302-025", amount: 2200, fee: 220, net: 1980, date: "2026-03-02" },
    ],
  },
  {
    id: "STL-005", institutionId: "INST-005", institutionName: "Pearl Dental Centre",
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
  { id: "WDR-001", institutionId: "INST-001", institutionName: "Bright Smile Dental", amount: 756000, bankName: "HSBC", bankAccount: "****5678", requestedAt: "2026-03-05 10:00", status: "paid", processedAt: "2026-03-06 14:00", adminNote: "Wire transfer completed" },
  { id: "WDR-002", institutionId: "INST-002", institutionName: "Happy Teeth Clinic", amount: 684000, bankName: "Bank of China (HK)", bankAccount: "****1234", requestedAt: "2026-03-05 11:30", status: "payment_arranged", processedAt: "2026-03-06 15:00" },
  { id: "WDR-003", institutionId: "INST-003", institutionName: "Central Dental Hospital", amount: 818400, bankName: "Standard Chartered", bankAccount: "****9012", requestedAt: "2026-03-07 09:00", status: "approved", processedAt: "2026-03-07 16:00" },
  { id: "WDR-004", institutionId: "INST-004", institutionName: "Tsim Sha Tsui Dental", amount: 522000, bankName: "Hang Seng Bank", bankAccount: "****3456", requestedAt: "2026-03-08 10:30", status: "pending" },
  { id: "WDR-005", institutionId: "INST-005", institutionName: "Pearl Dental Centre", amount: 200000, bankName: "DBS Bank (HK)", bankAccount: "****7890", requestedAt: "2026-03-06 14:00", status: "rejected", processedAt: "2026-03-07 10:00", rejectionReason: "Settlement under dispute, please resolve dispute DSP-003 first" },
];
