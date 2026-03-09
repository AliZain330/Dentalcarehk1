export interface AdminCoupon {
  id: string;
  name: string;
  nameZh: string;
  type: "fixed" | "percentage";
  source: "platform" | "institution";
  institutionName?: string;
  amount: number; // HKD for fixed, % for percentage
  minSpend: number;
  applicableTo: "all" | "in_clinic" | "consultation";
  validFrom: string;
  validTo: string;
  totalIssued: number;
  totalUsed: number;
  maxPerUser: number;
  distribution: "auto_new_user" | "manual" | "campaign" | "institution";
  status: "active" | "draft" | "disabled" | "expired";
}

export interface AdminCampaign {
  id: string;
  name: string;
  nameZh: string;
  type: "banner" | "recommendation" | "referral" | "promotion";
  startDate: string;
  endDate: string;
  participatingInstitutions: number;
  participatingUsers: number;
  impressions: number;
  conversions: number;
  rules: string;
  rulesZh: string;
  status: "active" | "paused" | "ended" | "draft";
}

export interface AdminBanner {
  id: string;
  title: string;
  titleZh: string;
  imageUrl: string; // placeholder
  linkUrl: string;
  displayFrom: string;
  displayTo: string;
  sortOrder: number;
  status: "active" | "scheduled" | "disabled";
  clicks: number;
  impressions: number;
}

export const mockPlatformCoupons: AdminCoupon[] = [
  {
    id: "CPN-P001", name: "New User Welcome", nameZh: "新用戶迎新券",
    type: "fixed", source: "platform", amount: 50, minSpend: 200,
    applicableTo: "all", validFrom: "2025-01-01", validTo: "2025-12-31",
    totalIssued: 5000, totalUsed: 2340, maxPerUser: 1,
    distribution: "auto_new_user", status: "active",
  },
  {
    id: "CPN-P002", name: "Spring Dental Care", nameZh: "春季護齒優惠",
    type: "percentage", source: "platform", amount: 15, minSpend: 500,
    applicableTo: "in_clinic", validFrom: "2025-03-01", validTo: "2025-05-31",
    totalIssued: 3000, totalUsed: 890, maxPerUser: 2,
    distribution: "manual", status: "active",
  },
  {
    id: "CPN-P003", name: "Consultation Discount", nameZh: "線上問診折扣",
    type: "fixed", source: "platform", amount: 30, minSpend: 100,
    applicableTo: "consultation", validFrom: "2025-02-01", validTo: "2025-06-30",
    totalIssued: 2000, totalUsed: 650, maxPerUser: 3,
    distribution: "campaign", status: "active",
  },
  {
    id: "CPN-P004", name: "CNY Lucky Coupon", nameZh: "新年利是券",
    type: "fixed", source: "platform", amount: 88, minSpend: 300,
    applicableTo: "all", validFrom: "2025-01-20", validTo: "2025-02-15",
    totalIssued: 1000, totalUsed: 1000, maxPerUser: 1,
    distribution: "auto_new_user", status: "expired",
  },
  {
    id: "CPN-P005", name: "Summer Draft", nameZh: "夏季推廣草稿",
    type: "percentage", source: "platform", amount: 20, minSpend: 400,
    applicableTo: "all", validFrom: "2025-06-01", validTo: "2025-08-31",
    totalIssued: 0, totalUsed: 0, maxPerUser: 1,
    distribution: "manual", status: "draft",
  },
];

export const mockInstitutionCoupons: AdminCoupon[] = [
  {
    id: "CPN-I001", name: "Bright Smile VIP", nameZh: "Bright Smile VIP券",
    type: "fixed", source: "institution", institutionName: "Bright Smile Dental Centre",
    amount: 100, minSpend: 500, applicableTo: "in_clinic",
    validFrom: "2025-01-01", validTo: "2025-12-31",
    totalIssued: 500, totalUsed: 120, maxPerUser: 1,
    distribution: "institution", status: "active",
  },
  {
    id: "CPN-I002", name: "Happy Teeth Promo", nameZh: "Happy Teeth推廣券",
    type: "percentage", source: "institution", institutionName: "Happy Teeth Clinic",
    amount: 10, minSpend: 300, applicableTo: "in_clinic",
    validFrom: "2025-02-01", validTo: "2025-07-31",
    totalIssued: 800, totalUsed: 210, maxPerUser: 2,
    distribution: "institution", status: "active",
  },
  {
    id: "CPN-I003", name: "Pearl Dental Special", nameZh: "Pearl Dental特價券",
    type: "fixed", source: "institution", institutionName: "Pearl Dental Care",
    amount: 200, minSpend: 1000, applicableTo: "in_clinic",
    validFrom: "2025-03-01", validTo: "2025-04-30",
    totalIssued: 200, totalUsed: 45, maxPerUser: 1,
    distribution: "institution", status: "disabled",
  },
];

export const mockCampaigns: AdminCampaign[] = [
  {
    id: "CMP-001", name: "Spring Cleaning Sale", nameZh: "春季洗牙特惠",
    type: "promotion", startDate: "2025-03-01", endDate: "2025-05-31",
    participatingInstitutions: 24, participatingUsers: 1520,
    impressions: 45000, conversions: 890,
    rules: "All cleaning services 20% off", rulesZh: "全部洗牙服務八折",
    status: "active",
  },
  {
    id: "CMP-002", name: "Referral Rewards", nameZh: "推薦獎賞",
    type: "referral", startDate: "2025-01-01", endDate: "2025-12-31",
    participatingInstitutions: 0, participatingUsers: 3200,
    impressions: 120000, conversions: 420,
    rules: "Refer a friend, both get HK$50", rulesZh: "推薦好友，雙方各得HK$50",
    status: "active",
  },
  {
    id: "CMP-003", name: "Holiday Banner Push", nameZh: "假日橫幅推廣",
    type: "banner", startDate: "2025-04-01", endDate: "2025-04-15",
    participatingInstitutions: 10, participatingUsers: 0,
    impressions: 28000, conversions: 340,
    rules: "Featured Easter promotions", rulesZh: "復活節精選推廣",
    status: "paused",
  },
  {
    id: "CMP-004", name: "Top Picks Showcase", nameZh: "精選推薦",
    type: "recommendation", startDate: "2025-02-01", endDate: "2025-03-31",
    participatingInstitutions: 8, participatingUsers: 5600,
    impressions: 92000, conversions: 1200,
    rules: "Curated list of top-rated services", rulesZh: "精選高評分服務推薦",
    status: "ended",
  },
  {
    id: "CMP-005", name: "Summer Whitening Campaign", nameZh: "夏季美白活動",
    type: "promotion", startDate: "2025-06-01", endDate: "2025-08-31",
    participatingInstitutions: 0, participatingUsers: 0,
    impressions: 0, conversions: 0,
    rules: "Whitening packages at special prices", rulesZh: "美白套餐特價",
    status: "draft",
  },
];

export const mockBanners: AdminBanner[] = [
  {
    id: "BNR-001", title: "Spring Dental Care", titleZh: "春季護齒推廣",
    imageUrl: "", linkUrl: "/promotions/spring", displayFrom: "2025-03-01", displayTo: "2025-05-31",
    sortOrder: 1, status: "active", clicks: 2340, impressions: 45000,
  },
  {
    id: "BNR-002", title: "Online Consultation Launch", titleZh: "線上問診上線",
    imageUrl: "", linkUrl: "/consultation/doctors", displayFrom: "2025-01-01", displayTo: "2025-12-31",
    sortOrder: 2, status: "active", clicks: 5600, impressions: 120000,
  },
  {
    id: "BNR-003", title: "Referral Program", titleZh: "推薦計劃",
    imageUrl: "", linkUrl: "/referral", displayFrom: "2025-01-01", displayTo: "2025-12-31",
    sortOrder: 3, status: "active", clicks: 1800, impressions: 85000,
  },
  {
    id: "BNR-004", title: "Easter Special", titleZh: "復活節特惠",
    imageUrl: "", linkUrl: "/promotions/easter", displayFrom: "2025-04-15", displayTo: "2025-04-30",
    sortOrder: 4, status: "scheduled", clicks: 0, impressions: 0,
  },
  {
    id: "BNR-005", title: "Old Year-end Banner", titleZh: "舊年末橫幅",
    imageUrl: "", linkUrl: "/promotions/yearend", displayFrom: "2024-12-01", displayTo: "2024-12-31",
    sortOrder: 5, status: "disabled", clicks: 3200, impressions: 60000,
  },
];
