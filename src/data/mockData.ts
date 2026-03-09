export interface Institution {
  id: string;
  name: { en: string; zh: string };
  description: { en: string; zh: string };
  rating: number;
  reviewCount: number;
  distance: number;
  address: { en: string; zh: string };
  phone: string;
  isOpen: boolean;
  hours: { day: string; time: string }[];
  transport: { en: string; zh: string };
  categories: string[];
  popularServices: { en: string; zh: string }[];
  logoColor: string;
  logoInitials: string;
  photoCount: number;
  doctors: Doctor[];
  services: ServiceItem[];
  reviews: Review[];
}

export interface Doctor {
  id: string;
  name: { en: string; zh: string };
  specialty: { en: string; zh: string };
  yearsExp: number;
  rating: number;
  consultations: number;
  bio: { en: string; zh: string };
  serviceIds: string[];
}

export interface ServiceItem {
  id: string;
  name: { en: string; zh: string };
  price: number;
  description: { en: string; zh: string };
  fullDescription: { en: string; zh: string };
  duration: number;
  category: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: { en: string; zh: string };
  envRating?: number;
  serviceRating?: number;
  doctorSkillRating?: number;
  doctorAttitudeRating?: number;
}

export interface PopularService {
  id: string;
  name: { en: string; zh: string };
  price: number;
  institutionIds: string[];
  icon: string;
}

export interface Coupon {
  id: string;
  title: { en: string; zh: string };
  discount: string;
  discountAmount: number;
  validUntil: string;
  status: "available" | "used" | "expired";
  minSpend: number;
  conditions: { en: string; zh: string };
  applicableTo: "all" | "in_clinic" | "consultation";
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AppointmentOrder {
  id: string;
  orderNumber: string;
  institutionId: string;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  status: "pending_acceptance" | "pending_treatment" | "completed" | "cancelled";
  price: number;
  couponId?: string;
  couponDeduction: number;
  finalAmount: number;
  createdAt: string;
  cancelledAt?: string;
  refundAmount?: number;
  reviewed?: boolean;
}

// ---- Online Consultation Types ----

export interface OnlineDoctor {
  id: string;
  name: { en: string; zh: string };
  title: { en: string; zh: string };
  specialty: { en: string; zh: string };
  rating: number;
  consultations: number;
  bio: { en: string; zh: string };
  textImagePrice: number;
  videoPrice: number;
  availableTypes: ("text_image" | "video")[];
  reviews: Review[];
}

export type ConsultationType = "text_image" | "video";

export interface ConsultationOrder {
  id: string;
  orderNumber: string;
  doctorId: string;
  consultationType: ConsultationType;
  symptoms: string;
  medicalHistory: string;
  imageCount: number;
  price: number;
  finalAmount: number;
  paymentMethod: string;
  status: "pending_acceptance" | "in_consultation" | "completed" | "cancelled";
  createdAt: string;
  cancelledAt?: string;
  refundAmount?: number;
  reviewed?: boolean;
  diagnosisNotes?: { en: string; zh: string };
  medicationAdvice?: { en: string; zh: string };
  consultationStartedAt?: string;
  consultationEndedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "doctor";
  type: "text" | "image";
  content: string;
  timestamp: string;
}

export interface CoinTransaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  description: { en: string; zh: string };
  date: string;
}

export interface ReferralRecord {
  id: string;
  friendName: string;
  friendMasked: string;
  registeredAt: string;
  firstOrderCompleted: boolean;
  firstOrderDate?: string;
  rewardStatus: "pending" | "claimable" | "claimed";
}

export interface CampaignCoupon {
  id: string;
  title: { en: string; zh: string };
  discount: string;
  discountAmount: number;
  validUntil: string;
  minSpend: number;
  conditions: { en: string; zh: string };
  applicableTo: "all" | "in_clinic" | "consultation";
  source: "campaign" | "referral" | "institution";
  sourceLabel: { en: string; zh: string };
}

// Generate time slots for a given date
export const generateTimeSlots = (date: string): TimeSlot[] => {
  const morning = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoon = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
  const all = [...morning, ...afternoon];
  return all.map((time) => {
    const hash = (date + time).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return { time, available: hash % 3 !== 0 };
  });
};

// ---- Online Consultation Doctors ----

export const mockOnlineDoctors: OnlineDoctor[] = [
  {
    id: "od1",
    name: { en: "Dr. Chen Wei", zh: "陳偉醫生" },
    title: { en: "Chief Dentist, HKU–SZH", zh: "港大深圳醫院主任牙醫" },
    specialty: { en: "General Dentistry", zh: "一般牙科" },
    rating: 4.9,
    consultations: 2340,
    bio: { en: "Dr. Chen Wei is a Chief Dentist at The University of Hong Kong–Shenzhen Hospital Dental Centre with over 15 years of clinical experience in preventive and restorative dentistry.", zh: "陳偉醫生是香港大學深圳醫院口腔醫學中心主任牙醫，擁有超過15年的預防及修復牙科臨床經驗。" },
    textImagePrice: 200,
    videoPrice: 380,
    availableTypes: ["text_image", "video"],
    reviews: [
      { id: "or1", userName: "Alice L.", rating: 5, date: "2026-01-15", comment: { en: "Very detailed online consultation, answered all my questions!", zh: "線上諮詢非常詳細，回答了我所有問題！" } },
      { id: "or2", userName: "Ben T.", rating: 4, date: "2026-01-10", comment: { en: "Quick response and helpful advice.", zh: "回覆快速，建議很有幫助。" } },
    ],
  },
  {
    id: "od2",
    name: { en: "Dr. Zhang Liming", zh: "張力明醫生" },
    title: { en: "Orthodontist, HKU–SZH", zh: "港大深圳醫院矯齒科醫生" },
    specialty: { en: "Orthodontics", zh: "矯齒科" },
    rating: 4.7,
    consultations: 1800,
    bio: { en: "Dr. Zhang Liming provides expert orthodontic consultations at HKU–Shenzhen Hospital. Specializes in Invisalign and ceramic braces for patients across the Greater Bay Area.", zh: "張力明醫生在港大深圳醫院提供專業矯齒諮詢，專注隱適美及陶瓷牙箍，服務大灣區患者。" },
    textImagePrice: 250,
    videoPrice: 450,
    availableTypes: ["text_image", "video"],
    reviews: [
      { id: "or3", userName: "Cindy W.", rating: 5, date: "2026-02-01", comment: { en: "Great advice on braces options!", zh: "對牙箍選擇的建議非常好！" } },
    ],
  },
  {
    id: "od3",
    name: { en: "Dr. Liu Yating", zh: "劉雅婷醫生" },
    title: { en: "Prosthodontist, HKU–SZH", zh: "港大深圳醫院修復科醫生" },
    specialty: { en: "Prosthodontics", zh: "修復牙科" },
    rating: 4.8,
    consultations: 3100,
    bio: { en: "Dr. Liu Yating specializes in smile design, porcelain veneers, and full-mouth rehabilitation at HKU–Shenzhen Hospital Dental Centre.", zh: "劉雅婷醫生專注於港大深圳醫院口腔醫學中心的笑容設計、瓷貼面及全口修復。" },
    textImagePrice: 180,
    videoPrice: 350,
    availableTypes: ["text_image"],
    reviews: [
      { id: "or4", userName: "Grace F.", rating: 5, date: "2026-01-20", comment: { en: "Helped me understand my veneer options perfectly.", zh: "幫助我完美了解瓷貼面選擇。" } },
    ],
  },
  {
    id: "od4",
    name: { en: "Dr. Wang Haoran", zh: "王浩然醫生" },
    title: { en: "Implant Specialist, HKU–SZH", zh: "港大深圳醫院植牙專科醫生" },
    specialty: { en: "Implantology", zh: "植牙科" },
    rating: 4.9,
    consultations: 3800,
    bio: { en: "Dr. Wang Haoran is a leading implant specialist at HKU–Shenzhen Hospital, trained at the Faculty of Dentistry, HKU. Expert in immediate loading implants and bone grafting.", zh: "王浩然醫生是港大深圳醫院的植牙專家，曾於香港大學牙醫學院受訓，擅長即刻負重植牙及骨移植。" },
    textImagePrice: 300,
    videoPrice: 500,
    availableTypes: ["text_image", "video"],
    reviews: [
      { id: "or5", userName: "Peter L.", rating: 5, date: "2026-02-05", comment: { en: "Excellent explanation of the implant process.", zh: "對植牙過程的解釋非常出色。" } },
    ],
  },
];

// Mock chat messages for demo
export const mockChatMessages: ChatMessage[] = [
  { id: "m1", sender: "user", type: "text", content: "Hello doctor, I have been experiencing tooth pain on the lower right side for about 3 days.", timestamp: "2026-03-09T10:00:00" },
  { id: "m2", sender: "doctor", type: "text", content: "Hello! Thank you for reaching out. Can you describe the pain? Is it sharp or dull? Does it get worse when eating?", timestamp: "2026-03-09T10:02:00" },
  { id: "m3", sender: "user", type: "text", content: "It's a sharp pain, especially when I drink cold water or bite down on food.", timestamp: "2026-03-09T10:05:00" },
  { id: "m4", sender: "doctor", type: "text", content: "Based on your description, this could be a cavity or a cracked tooth. I would recommend coming in for an X-ray. In the meantime, avoid very cold/hot foods and you can take ibuprofen for pain relief.", timestamp: "2026-03-09T10:08:00" },
];

// Mock coin transactions
export const mockCoinTransactions: CoinTransaction[] = [
  { id: "ct1", type: "earned", amount: 100, description: { en: "Referral: Alice signed up", zh: "推薦：Alice 已註冊" }, date: "2026-02-15" },
  { id: "ct2", type: "earned", amount: 50, description: { en: "Referral: Alice completed first booking", zh: "推薦：Alice 完成首次預約" }, date: "2026-02-20" },
  { id: "ct3", type: "earned", amount: 100, description: { en: "Referral: Ben signed up", zh: "推薦：Ben 已註冊" }, date: "2026-03-01" },
  { id: "ct4", type: "spent", amount: -50, description: { en: "Used for order ORD20260301001", zh: "用於訂單 ORD20260301001" }, date: "2026-03-02" },
  { id: "ct5", type: "earned", amount: 50, description: { en: "Welcome bonus", zh: "歡迎獎勵" }, date: "2026-01-10" },
];

// Mock referral records
export const mockReferralRecords: ReferralRecord[] = [
  { id: "ref1", friendName: "Alice L.", friendMasked: "Ali***", registeredAt: "2026-02-15", firstOrderCompleted: true, firstOrderDate: "2026-02-20", rewardStatus: "claimed" },
  { id: "ref2", friendName: "Ben T.", friendMasked: "Ben***", registeredAt: "2026-03-01", firstOrderCompleted: true, firstOrderDate: "2026-03-05", rewardStatus: "claimable" },
  { id: "ref3", friendName: "Cindy W.", friendMasked: "Cin***", registeredAt: "2026-03-07", firstOrderCompleted: false, rewardStatus: "pending" },
  { id: "ref4", friendName: "David C.", friendMasked: "Dav***", registeredAt: "2026-03-08", firstOrderCompleted: false, rewardStatus: "pending" },
];

// Mock campaign coupons (claimable from banners / institution pages)
export const mockCampaignCoupons: CampaignCoupon[] = [
  { id: "camp1", title: { en: "Welcome Gift: HK$30 Off", zh: "迎新禮物：減HK$30" }, discount: "HK$30", discountAmount: 30, validUntil: "2026-06-30", minSpend: 200, conditions: { en: "All services. Min. spend HK$200.", zh: "所有服務。最低消費 HK$200。" }, applicableTo: "all", source: "campaign", sourceLabel: { en: "Home Banner Campaign", zh: "首頁活動" } },
  { id: "camp2", title: { en: "Teeth Whitening Promo: HK$500 Off", zh: "牙齒美白優惠：減HK$500" }, discount: "HK$500", discountAmount: 500, validUntil: "2026-05-31", minSpend: 2000, conditions: { en: "In-clinic whitening only. Min. spend HK$2,000.", zh: "僅限到診美白。最低消費 HK$2,000。" }, applicableTo: "in_clinic", source: "campaign", sourceLabel: { en: "Promo Campaign", zh: "優惠活動" } },
  { id: "camp3", title: { en: "Referral Bonus: HK$50 Off", zh: "推薦獎賞：減HK$50" }, discount: "HK$50", discountAmount: 50, validUntil: "2026-12-31", minSpend: 0, conditions: { en: "No minimum spend. All services.", zh: "無最低消費。所有服務。" }, applicableTo: "all", source: "referral", sourceLabel: { en: "Referral Reward", zh: "推薦獎賞" } },
  { id: "camp4", title: { en: "HKU–SZH Dental Exclusive: 10% Off", zh: "港大深圳醫院口腔專屬：9折" }, discount: "10%", discountAmount: 0, validUntil: "2026-04-30", minSpend: 500, conditions: { en: "HKU–SZH Dental Centre only. Min. spend ¥500.", zh: "僅限港大深圳醫院口腔醫學中心。最低消費 ¥500。" }, applicableTo: "in_clinic", source: "institution", sourceLabel: { en: "HKU–SZH Dental", zh: "港大深圳醫院口腔" } },
];

// ---- Existing Mock Data ----

export const mockInstitutions: Institution[] = [
  {
    id: "1",
    name: { en: "HKU–Shenzhen Hospital Dental Centre", zh: "香港大學深圳醫院口腔醫學中心" },
    description: {
      en: "The Dental Centre of The University of Hong Kong–Shenzhen Hospital is a leading public dental facility in the Greater Bay Area, operated in collaboration with the HKU Faculty of Dentistry. It offers comprehensive dental services including general dentistry, orthodontics, implantology, prosthodontics, and oral surgery, with internationally trained specialists and state-of-the-art equipment.",
      zh: "香港大學深圳醫院口腔醫學中心是大灣區領先的公立口腔醫療機構，由港大牙醫學院協作營運。中心提供全面的口腔醫療服務，包括一般牙科、矯齒科、植牙科、修復科及口腔外科，擁有國際化培訓的專科醫生及先進設備。",
    },
    rating: 4.8, reviewCount: 526, distance: 0.5,
    address: { en: "No. 1 Haiyuan 1st Road, Futian District, Shenzhen", zh: "深圳市福田區海園一路1號" },
    phone: "+86 755 8691 3333", isOpen: true,
    hours: [
      { day: "mon", time: "08:00 - 12:00, 14:00 - 17:30" }, { day: "tue", time: "08:00 - 12:00, 14:00 - 17:30" },
      { day: "wed", time: "08:00 - 12:00, 14:00 - 17:30" }, { day: "thu", time: "08:00 - 12:00, 14:00 - 17:30" },
      { day: "fri", time: "08:00 - 12:00, 14:00 - 17:30" }, { day: "sat", time: "08:00 - 12:00" }, { day: "sun", time: "Closed" },
    ],
    transport: { en: "Shenzhen Metro Line 1 Luohu/Futian • Hospital shuttle from HK border", zh: "深圳地鐵1號線羅湖/福田站 • 醫院提供港深口岸接駁巴士" },
    categories: ["general", "orthodontics", "implants", "cosmetic"],
    popularServices: [{ en: "Dental Implants", zh: "種植牙" }, { en: "Orthodontics", zh: "正畸矯齒" }, { en: "Teeth Whitening", zh: "牙齒美白" }],
    logoColor: "bg-primary", logoInitials: "HKU", photoCount: 12,
    doctors: [
      { id: "d1", name: { en: "Dr. Chen Wei", zh: "陳偉醫生" }, specialty: { en: "General Dentistry", zh: "一般牙科" }, yearsExp: 15, rating: 4.9, consultations: 2340, bio: { en: "Chief Dentist at HKU–SZH Dental Centre. Specializes in preventive and restorative dentistry. Trained at HKU Faculty of Dentistry.", zh: "港大深圳醫院口腔醫學中心主任牙醫，專注預防及修復牙科，畢業於港大牙醫學院。" }, serviceIds: ["s1", "s2", "s3"] },
      { id: "d2", name: { en: "Dr. Zhang Liming", zh: "張力明醫生" }, specialty: { en: "Orthodontics", zh: "矯齒科" }, yearsExp: 10, rating: 4.7, consultations: 1800, bio: { en: "Orthodontic specialist at HKU–SZH. Expert in Invisalign and ceramic braces.", zh: "港大深圳醫院矯齒專科醫生，擅長隱適美及陶瓷牙箍。" }, serviceIds: ["s1", "s2", "s6"] },
      { id: "d3", name: { en: "Dr. Wang Haoran", zh: "王浩然醫生" }, specialty: { en: "Implantology", zh: "植牙科" }, yearsExp: 18, rating: 4.9, consultations: 3800, bio: { en: "Leading implant specialist at HKU–SZH. Expert in immediate loading implants and bone grafting.", zh: "港大深圳醫院植牙專家，擅長即刻負重植牙及骨移植。" }, serviceIds: ["s1", "s4", "s3"] },
    ],
    services: [
      { id: "s1", name: { en: "Dental Check-up & Consultation", zh: "口腔檢查及諮詢" }, price: 200, description: { en: "Comprehensive oral examination", zh: "全面口腔檢查" }, fullDescription: { en: "A thorough oral examination including visual inspection, digital X-rays, periodontal assessment, and personalized treatment planning by HKU-trained specialists.", zh: "全面口腔檢查，包括目視檢查、數碼X光片、牙周評估及由港大培訓專科醫生制定的個人化治療計劃。" }, duration: 30, category: "general" },
      { id: "s2", name: { en: "Scaling & Polishing", zh: "潔牙及拋光" }, price: 500, description: { en: "Professional teeth cleaning", zh: "專業牙齒清潔" }, fullDescription: { en: "Professional ultrasonic scaling and polishing to remove calculus, plaque, and stains. Includes oral hygiene instruction.", zh: "專業超聲波潔牙及拋光，去除牙結石、牙菌斑及色漬，包括口腔衛生指導。" }, duration: 45, category: "general" },
      { id: "s3", name: { en: "Teeth Whitening", zh: "牙齒美白" }, price: 2800, description: { en: "Professional whitening treatment", zh: "專業美白治療" }, fullDescription: { en: "In-office professional teeth whitening using Beyond™ advanced LED whitening technology, performed by experienced dental professionals.", zh: "診所內專業牙齒美白，採用Beyond™先進LED美白技術，由經驗豐富的口腔專業人員操作。" }, duration: 60, category: "cosmetic" },
      { id: "s4", name: { en: "Dental Implant (Single)", zh: "單顆種植牙" }, price: 12000, description: { en: "Single tooth implant with crown", zh: "單顆種植牙連牙冠" }, fullDescription: { en: "Straumann® or Nobel Biocare® titanium implant surgically placed into the jawbone, with customized porcelain crown. Includes 3D CT scan planning and follow-up visits.", zh: "Straumann®或Nobel Biocare®鈦金屬植體植入頜骨，配合訂製瓷牙冠。包括3D CT掃描計劃及覆診。" }, duration: 90, category: "implants" },
      { id: "s5", name: { en: "Root Canal Treatment", zh: "根管治療" }, price: 2500, description: { en: "Endodontic treatment", zh: "牙髓治療" }, fullDescription: { en: "Microscope-assisted root canal treatment to remove infected pulp tissue, disinfect and seal the canal system. Performed under rubber dam isolation.", zh: "顯微鏡輔助根管治療，去除感染牙髓組織，消毒及封閉根管系統。在橡皮障隔離下進行。" }, duration: 60, category: "general" },
      { id: "s6", name: { en: "Orthodontic Consultation", zh: "正畸矯齒諮詢" }, price: 300, description: { en: "Comprehensive orthodontic assessment", zh: "全面正畸評估" }, fullDescription: { en: "Comprehensive orthodontic assessment including digital scanning, cephalometric analysis, and discussion of treatment options (metal braces, ceramic braces, Invisalign).", zh: "全面正畸評估，包括數碼掃描、頭影測量分析及治療方案討論（金屬牙箍、陶瓷牙箍、隱適美）。" }, duration: 45, category: "orthodontics" },
    ],
    reviews: [
      { id: "r1", userName: "Alice L.", rating: 5, date: "2025-12-01", comment: { en: "Excellent facility! The doctors trained at HKU are very professional and thorough. Highly recommend the Dental Centre.", zh: "設施非常好！港大培訓的醫生非常專業和細心。強烈推薦口腔醫學中心。" }, envRating: 5, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
      { id: "r2", userName: "Tom K.", rating: 4, date: "2025-11-15", comment: { en: "Modern equipment, very clean environment. Wait times can be a bit long but quality is top-notch.", zh: "設備先進，環境非常乾淨。等候時間偶爾較長但質量一流。" }, envRating: 5, serviceRating: 4, doctorSkillRating: 5, doctorAttitudeRating: 4 },
      { id: "r3", userName: "Jenny W.", rating: 5, date: "2025-11-01", comment: { en: "Dr. Chen is amazing. He explained everything in detail. The cross-border shuttle is very convenient!", zh: "陳醫生很厲害，解釋得非常詳細。跨境接駁巴士非常方便！" }, envRating: 5, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
    ],
  },
  {
    id: "2",
    name: { en: "DentalPlus TST", zh: "齒科佳尖沙咀店" },
    description: { en: "DentalPlus is your trusted dental care provider in Tsim Sha Tsui.", zh: "齒科佳是尖沙咀值得信賴的牙科護理中心。" },
    rating: 4.6, reviewCount: 218, distance: 1.2,
    address: { en: "8/F, Mira Place One, 132 Nathan Road, TST", zh: "尖沙咀彌敦道132號美麗華廣場一期8樓" },
    phone: "+852 2367 1100", isOpen: true,
    hours: [{ day: "mon", time: "10:00 - 19:00" }, { day: "tue", time: "10:00 - 19:00" }, { day: "wed", time: "10:00 - 19:00" }, { day: "thu", time: "10:00 - 19:00" }, { day: "fri", time: "10:00 - 19:00" }, { day: "sat", time: "10:00 - 14:00" }, { day: "sun", time: "Closed" }],
    transport: { en: "MTR Tsim Sha Tsui Station Exit B1 • 5 min walk", zh: "港鐵尖沙咀站B1出口 • 步行5分鐘" },
    categories: ["general", "orthodontics", "pediatric"],
    popularServices: [{ en: "Braces", zh: "牙箍" }, { en: "Scaling", zh: "洗牙" }],
    logoColor: "bg-info", logoInitials: "D+", photoCount: 6,
    doctors: [
      { id: "d4", name: { en: "Dr. Kevin Tam", zh: "譚醫生" }, specialty: { en: "Orthodontics", zh: "矯齒科" }, yearsExp: 10, rating: 4.6, consultations: 1800, bio: { en: "Dr. Kevin Tam is an experienced orthodontist.", zh: "譚醫生是一位經驗豐富的矯齒科醫生。" }, serviceIds: ["s7", "s8", "s9"] },
      { id: "d5", name: { en: "Dr. Lisa Ng", zh: "吳醫生" }, specialty: { en: "Pediatric Dentistry", zh: "兒童牙科" }, yearsExp: 7, rating: 4.8, consultations: 980, bio: { en: "Dr. Lisa Ng specializes in treating children with gentle care.", zh: "吳醫生專注兒童牙科治療。" }, serviceIds: ["s7", "s8"] },
    ],
    services: [
      { id: "s7", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 250, description: { en: "Standard dental examination", zh: "標準牙齒檢查" }, fullDescription: { en: "Standard dental examination with visual inspection.", zh: "標準牙齒檢查，包括目視檢查。" }, duration: 30, category: "general" },
      { id: "s8", name: { en: "Braces Consultation", zh: "矯齒諮詢" }, price: 500, description: { en: "Orthodontic assessment", zh: "矯齒評估" }, fullDescription: { en: "Comprehensive orthodontic assessment.", zh: "全面矯齒評估。" }, duration: 45, category: "orthodontics" },
      { id: "s9", name: { en: "Ceramic Braces", zh: "陶瓷牙箍" }, price: 25000, description: { en: "Clear ceramic braces treatment", zh: "透明陶瓷牙箍治療" }, fullDescription: { en: "Aesthetic ceramic braces.", zh: "與天然牙齒顏色融合的陶瓷牙箍。" }, duration: 60, category: "orthodontics" },
    ],
    reviews: [
      { id: "r4", userName: "David C.", rating: 5, date: "2025-12-10", comment: { en: "Great orthodontist!", zh: "很棒的矯齒醫生！" }, envRating: 4, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
      { id: "r5", userName: "Mary H.", rating: 4, date: "2025-11-20", comment: { en: "Good service, friendly staff.", zh: "服務很好，員工很友善。" }, envRating: 4, serviceRating: 4, doctorSkillRating: 4, doctorAttitudeRating: 4 },
    ],
  },
  {
    id: "3",
    name: { en: "BrightDent Mong Kok", zh: "亮齒牙科旺角店" },
    description: { en: "BrightDent offers affordable, quality dental care in Mong Kok.", zh: "亮齒牙科位於旺角，提供價格實惠的優質牙科護理。" },
    rating: 4.4, reviewCount: 156, distance: 2.8,
    address: { en: "5/F, Grand Century Place, 193 Prince Edward Road West, MK", zh: "旺角太子道西193號新世紀廣場5樓" },
    phone: "+852 2398 5500", isOpen: false,
    hours: [{ day: "mon", time: "09:30 - 17:30" }, { day: "tue", time: "09:30 - 17:30" }, { day: "wed", time: "09:30 - 17:30" }, { day: "thu", time: "09:30 - 17:30" }, { day: "fri", time: "09:30 - 17:30" }, { day: "sat", time: "09:30 - 13:00" }, { day: "sun", time: "Closed" }],
    transport: { en: "MTR Mong Kok East Station Exit C", zh: "港鐵旺角東站C出口" },
    categories: ["general", "cosmetic"],
    popularServices: [{ en: "Fillings", zh: "補牙" }, { en: "Tooth Extraction", zh: "拔牙" }],
    logoColor: "bg-warning", logoInitials: "BD", photoCount: 5,
    doctors: [
      { id: "d6", name: { en: "Dr. Raymond Lee", zh: "李醫生" }, specialty: { en: "General Dentistry", zh: "一般牙科" }, yearsExp: 20, rating: 4.5, consultations: 4200, bio: { en: "Dr. Raymond Lee has 20 years of experience.", zh: "李醫生擁有20年經驗。" }, serviceIds: ["s10", "s11", "s12"] },
    ],
    services: [
      { id: "s10", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 200, description: { en: "Basic dental examination", zh: "基本牙齒檢查" }, fullDescription: { en: "Basic dental examination.", zh: "基本牙齒檢查。" }, duration: 20, category: "general" },
      { id: "s11", name: { en: "Tooth Filling", zh: "補牙" }, price: 600, description: { en: "Composite filling", zh: "複合樹脂補牙" }, fullDescription: { en: "Tooth-colored composite filling.", zh: "牙色複合樹脂補牙。" }, duration: 30, category: "general" },
      { id: "s12", name: { en: "Tooth Extraction", zh: "拔牙" }, price: 800, description: { en: "Simple tooth extraction", zh: "簡單拔牙" }, fullDescription: { en: "Simple tooth extraction under local anesthesia.", zh: "局部麻醉下的簡單拔牙。" }, duration: 30, category: "general" },
    ],
    reviews: [
      { id: "r6", userName: "Peter L.", rating: 4, date: "2025-12-05", comment: { en: "Affordable and efficient.", zh: "價格實惠，效率高。" }, envRating: 3, serviceRating: 4, doctorSkillRating: 4, doctorAttitudeRating: 4 },
    ],
  },
  {
    id: "4",
    name: { en: "Perfect Smile Causeway Bay", zh: "完美笑容銅鑼灣診所" },
    description: { en: "Perfect Smile is a premium dental clinic in Causeway Bay.", zh: "完美笑容是銅鑼灣的優質牙科診所。" },
    rating: 4.9, reviewCount: 412, distance: 1.8,
    address: { en: "15/F, Times Square, 1 Matheson Street, CWB", zh: "銅鑼灣勿地臣街1號時代廣場15樓" },
    phone: "+852 2890 3300", isOpen: true,
    hours: [{ day: "mon", time: "08:30 - 19:00" }, { day: "tue", time: "08:30 - 19:00" }, { day: "wed", time: "08:30 - 19:00" }, { day: "thu", time: "08:30 - 19:00" }, { day: "fri", time: "08:30 - 19:00" }, { day: "sat", time: "09:00 - 15:00" }, { day: "sun", time: "Closed" }],
    transport: { en: "MTR Causeway Bay Station Exit A • Times Square", zh: "港鐵銅鑼灣站A出口 • 時代廣場" },
    categories: ["cosmetic", "implants", "general"],
    popularServices: [{ en: "Veneers", zh: "瓷貼面" }, { en: "Implants", zh: "植牙" }],
    logoColor: "bg-success", logoInitials: "PS", photoCount: 12,
    doctors: [
      { id: "d7", name: { en: "Dr. Andrew Ho", zh: "何醫生" }, specialty: { en: "Implantology", zh: "植牙科" }, yearsExp: 18, rating: 4.9, consultations: 3800, bio: { en: "Dr. Andrew Ho is a renowned implantologist.", zh: "何醫生是著名植牙科專家。" }, serviceIds: ["s13", "s14"] },
      { id: "d8", name: { en: "Dr. Christine Yip", zh: "葉醫生" }, specialty: { en: "Cosmetic Dentistry", zh: "美容牙科" }, yearsExp: 14, rating: 4.8, consultations: 2600, bio: { en: "Dr. Christine Yip is an expert in smile design.", zh: "葉醫生是笑容設計專家。" }, serviceIds: ["s13"] },
    ],
    services: [
      { id: "s13", name: { en: "Porcelain Veneers", zh: "瓷貼面" }, price: 5000, description: { en: "Per tooth veneer", zh: "每顆瓷貼面" }, fullDescription: { en: "Custom-made porcelain veneers.", zh: "訂製瓷貼面。" }, duration: 60, category: "cosmetic" },
      { id: "s14", name: { en: "All-on-4 Implants", zh: "全口植牙" }, price: 120000, description: { en: "Full arch implant solution", zh: "全口植牙方案" }, fullDescription: { en: "Revolutionary full-arch dental implant solution.", zh: "革命性全口植牙方案。" }, duration: 180, category: "implants" },
    ],
    reviews: [
      { id: "r7", userName: "Grace F.", rating: 5, date: "2025-12-08", comment: { en: "World-class clinic!", zh: "世界級的診所！" }, envRating: 5, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
    ],
  },
];

export const mockPopularServices: PopularService[] = [
  { id: "ps1", name: { en: "Scaling & Polishing", zh: "潔牙及拋光" }, price: 500, institutionIds: ["1", "2", "3"], icon: "sparkles" },
  { id: "ps2", name: { en: "Root Canal Treatment", zh: "根管治療" }, price: 2500, institutionIds: ["1", "3"], icon: "shield" },
  { id: "ps3", name: { en: "Tooth Extraction", zh: "拔牙" }, price: 800, institutionIds: ["3", "1"], icon: "scissors" },
  { id: "ps4", name: { en: "Teeth Whitening", zh: "牙齒美白" }, price: 2800, institutionIds: ["1", "4"], icon: "sun" },
  { id: "ps5", name: { en: "Orthodontics", zh: "正畸矯齒" }, price: 25000, institutionIds: ["1", "2"], icon: "smile" },
  { id: "ps6", name: { en: "Dental Implant", zh: "種植牙" }, price: 12000, institutionIds: ["1", "4"], icon: "anchor" },
];

export const mockCoupons: Coupon[] = [
  { id: "c1", title: { en: "New Patient Discount", zh: "新患者優惠" }, discount: "20%", discountAmount: 0, validUntil: "2026-06-30", status: "available", minSpend: 500, conditions: { en: "Applicable to all services. Min. spend HK$500.", zh: "適用於所有服務。最低消費 HK$500。" }, applicableTo: "all" },
  { id: "c2", title: { en: "Scaling Promo", zh: "洗牙優惠" }, discount: "HK$100", discountAmount: 100, validUntil: "2026-04-30", status: "available", minSpend: 300, conditions: { en: "Applicable to in-clinic treatments only. Min. spend HK$300.", zh: "僅適用於到診治療。最低消費 HK$300。" }, applicableTo: "in_clinic" },
  { id: "c3", title: { en: "Referral Bonus", zh: "推薦獎賞" }, discount: "HK$200", discountAmount: 200, validUntil: "2025-12-31", status: "expired", minSpend: 1000, conditions: { en: "Applicable to all services. Min. spend HK$1,000.", zh: "適用於所有服務。最低消費 HK$1,000。" }, applicableTo: "all" },
  { id: "c4", title: { en: "Consultation Discount", zh: "諮詢優惠" }, discount: "HK$50", discountAmount: 50, validUntil: "2026-05-31", status: "available", minSpend: 150, conditions: { en: "Applicable to online consultations only. Min. spend HK$150.", zh: "僅適用於線上諮詢。最低消費 HK$150。" }, applicableTo: "consultation" },
  { id: "c5", title: { en: "Spring Festival Special", zh: "春節特別優惠" }, discount: "15%", discountAmount: 0, validUntil: "2026-02-28", status: "used", minSpend: 800, conditions: { en: "Applicable to all services. Min. spend HK$800.", zh: "適用於所有服務。最低消費 HK$800。" }, applicableTo: "all" },
];

// Helper: get applicable coupons for a given price and type
export const getApplicableCoupons = (price: number, type: "in_clinic" | "consultation"): Coupon[] => {
  return mockCoupons.filter((c) => {
    if (c.status !== "available") return false;
    if (c.minSpend > price) return false;
    if (c.applicableTo !== "all" && c.applicableTo !== type) return false;
    return true;
  });
};

// Helper: calculate coupon deduction
export const calculateCouponDeduction = (coupon: Coupon, price: number): number => {
  if (coupon.discountAmount > 0) return coupon.discountAmount;
  // Percentage discount — extract number from string like "20%" or "15%"
  const pctMatch = coupon.discount.match(/(\d+)%/);
  if (pctMatch) return Math.round(price * parseInt(pctMatch[1]) / 100);
  return 0;
};
