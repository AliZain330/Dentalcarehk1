export interface AdminUser {
  id: string;
  name: string;
  nameZh: string;
  phone: string;
  email: string;
  avatar: string;
  status: "active" | "disabled";
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  lastActive: string;
  orders: AdminUserOrder[];
  reviews: AdminUserReview[];
  complaints: AdminUserComplaint[];
}

export interface AdminUserOrder {
  id: string;
  type: "in_clinic" | "consultation";
  institution: string;
  doctor: string;
  amount: number;
  date: string;
  status: "completed" | "confirmed" | "cancelled" | "pending";
}

export interface AdminUserReview {
  id: string;
  orderId: string;
  institution: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AdminUserComplaint {
  id: string;
  subject: string;
  content: string;
  date: string;
  status: "open" | "resolved" | "closed";
}

export const adminUsers: AdminUser[] = [
  {
    id: "USR-001", name: "Chan Tai Man", nameZh: "陳大文",
    phone: "+852 9123 4567", email: "taiman@gmail.com", avatar: "C",
    status: "active", registeredAt: "2025-08-15", totalOrders: 12, totalSpent: 24000, lastActive: "2026-03-09",
    orders: [
      { id: "ORD-20260309-001", type: "in_clinic", institution: "Bright Smile Dental Centre", doctor: "Dr. Sarah Chen", amount: 800, date: "2026-03-09", status: "completed" },
      { id: "OC-20260307-002", type: "consultation", institution: "Online", doctor: "Dr. Grace Fung", amount: 500, date: "2026-03-07", status: "completed" },
    ],
    reviews: [
      { id: "RV-001", orderId: "ORD-20260309-001", institution: "Bright Smile Dental Centre", rating: 5, comment: "Excellent service and very professional!", date: "2026-03-09" },
      { id: "RV-002", orderId: "OC-20260307-002", institution: "Online Consultation", rating: 4, comment: "Good experience overall.", date: "2026-03-08" },
    ],
    complaints: [
      { id: "CMP-001", subject: "Long waiting time", content: "Had to wait over 40 minutes past my appointment time.", date: "2026-01-16", status: "resolved" },
    ],
  },
  {
    id: "USR-002", name: "Wong Siu Ming", nameZh: "黃小明",
    phone: "+852 9234 5678", email: "siuming.w@outlook.com", avatar: "W",
    status: "active", registeredAt: "2025-10-02", totalOrders: 8, totalSpent: 16000, lastActive: "2026-03-07",
    orders: [
      { id: "ORD-20260309-002", type: "in_clinic", institution: "Happy Teeth Clinic", doctor: "Dr. Michael Wong", amount: 1500, date: "2026-03-09", status: "confirmed" },
      { id: "ORD-20260306-001", type: "in_clinic", institution: "Happy Teeth Clinic", doctor: "Dr. Michael Wong", amount: 3000, date: "2026-03-06", status: "cancelled" },
    ],
    reviews: [
      { id: "RV-010", orderId: "ORD-20260306-001", institution: "Happy Teeth Clinic", rating: 5, comment: "非常專業的服務！", date: "2026-03-06" },
    ],
    complaints: [],
  },
  {
    id: "USR-003", name: "Lee Ka Yan", nameZh: "李嘉欣",
    phone: "+852 9345 6789", email: "kayan.lee@yahoo.com", avatar: "L",
    status: "active", registeredAt: "2026-01-12", totalOrders: 3, totalSpent: 6000, lastActive: "2026-03-04",
    orders: [
      { id: "OC-20260309-001", type: "consultation", institution: "Online", doctor: "Dr. Emily Lau", amount: 200, date: "2026-03-09", status: "pending" },
      { id: "ORD-20260303-001", type: "in_clinic", institution: "Central Dental Hospital", doctor: "Dr. Emily Lau", amount: 4000, date: "2026-03-03", status: "completed" },
    ],
    reviews: [],
    complaints: [],
  },
  {
    id: "USR-004", name: "Lam Mei Ling", nameZh: "林美玲",
    phone: "+852 9456 7890", email: "meiling.lam@gmail.com", avatar: "L",
    status: "disabled", registeredAt: "2026-03-01", totalOrders: 0, totalSpent: 0, lastActive: "2026-03-02",
    orders: [],
    reviews: [],
    complaints: [
      { id: "CMP-010", subject: "Account issue", content: "Cannot access my account after registration.", date: "2026-03-02", status: "open" },
    ],
  },
  {
    id: "USR-005", name: "Ho Wing Kei", nameZh: "何詠琪",
    phone: "+852 9567 8901", email: "wingkei.ho@hotmail.com", avatar: "H",
    status: "active", registeredAt: "2025-12-20", totalOrders: 5, totalSpent: 10000, lastActive: "2026-03-08",
    orders: [
      { id: "ORD-20260308-001", type: "in_clinic", institution: "Central Dental Hospital", doctor: "Dr. Emily Lau", amount: 5000, date: "2026-03-08", status: "completed" },
      { id: "ORD-20260305-001", type: "in_clinic", institution: "Bright Smile Dental Centre", doctor: "Dr. Sarah Chen", amount: 600, date: "2026-03-05", status: "completed" },
    ],
    reviews: [
      { id: "RV-030", orderId: "ORD-20260308-001", institution: "Central Dental Hospital", rating: 3, comment: "Service was okay but the clinic was crowded.", date: "2026-03-08" },
    ],
    complaints: [
      { id: "CMP-020", subject: "Billing discrepancy", content: "I was charged HK$500 more than the quoted price.", date: "2026-02-16", status: "resolved" },
      { id: "CMP-021", subject: "Rude staff", content: "The receptionist was very impolite during my visit.", date: "2026-01-05", status: "closed" },
    ],
  },
  {
    id: "USR-006", name: "Ng Chi Wai", nameZh: "吳志偉",
    phone: "+852 9678 9012", email: "chiwai.ng@gmail.com", avatar: "N",
    status: "active", registeredAt: "2025-09-10", totalOrders: 15, totalSpent: 35000, lastActive: "2026-03-09",
    orders: [
      { id: "ORD-20260307-001", type: "in_clinic", institution: "Bright Smile Dental Centre", doctor: "Dr. Sarah Chen", amount: 2000, date: "2026-03-07", status: "completed" },
      { id: "OC-20260304-001", type: "consultation", institution: "Online", doctor: "Dr. Michael Wong", amount: 200, date: "2026-03-04", status: "completed" },
    ],
    reviews: [
      { id: "RV-040", orderId: "ORD-20260307-001", institution: "Bright Smile Dental Centre", rating: 5, comment: "Always a great experience here!", date: "2026-03-07" },
      { id: "RV-041", orderId: "OC-20260304-001", institution: "Online Consultation", rating: 4, comment: "Very convenient online consultation.", date: "2026-03-04" },
    ],
    complaints: [],
  },
];
