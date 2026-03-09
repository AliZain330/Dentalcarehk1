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
  // Completed output
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
    name: { en: "Dr. Sarah Chan", zh: "陳醫生" },
    title: { en: "Senior Dentist", zh: "資深牙醫" },
    specialty: { en: "General Dentistry", zh: "一般牙科" },
    rating: 4.9,
    consultations: 2340,
    bio: { en: "Dr. Sarah Chan is a highly experienced general dentist with over 12 years of practice. She specializes in preventive care and patient education through online consultations.", zh: "陳醫生是一位擁有超過12年執業經驗的資深牙醫，專注透過線上諮詢提供預防護理及患者教育。" },
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
    name: { en: "Dr. Kevin Tam", zh: "譚醫生" },
    title: { en: "Orthodontist", zh: "矯齒科醫生" },
    specialty: { en: "Orthodontics", zh: "矯齒科" },
    rating: 4.7,
    consultations: 1800,
    bio: { en: "Dr. Kevin Tam provides expert orthodontic consultations online. Perfect for initial assessments and follow-up questions about braces and aligners.", zh: "譚醫生提供專業的線上矯齒諮詢。適合初步評估和有關牙箍及隱形矯正的跟進問題。" },
    textImagePrice: 250,
    videoPrice: 450,
    availableTypes: ["text_image", "video"],
    reviews: [
      { id: "or3", userName: "Cindy W.", rating: 5, date: "2026-02-01", comment: { en: "Great advice on braces options!", zh: "對牙箍選擇的建議非常好！" } },
    ],
  },
  {
    id: "od3",
    name: { en: "Dr. Emily Lau", zh: "劉醫生" },
    title: { en: "Cosmetic Dentist", zh: "美容牙科醫生" },
    specialty: { en: "Cosmetic Dentistry", zh: "美容牙科" },
    rating: 4.8,
    consultations: 3100,
    bio: { en: "Dr. Emily Lau offers online consultations for smile design, teeth whitening advice, and veneer assessments.", zh: "劉醫生提供線上笑容設計、牙齒美白建議及瓷貼面評估諮詢。" },
    textImagePrice: 180,
    videoPrice: 350,
    availableTypes: ["text_image"],
    reviews: [
      { id: "or4", userName: "Grace F.", rating: 5, date: "2026-01-20", comment: { en: "Helped me understand my whitening options perfectly.", zh: "幫助我完美了解美白選擇。" } },
    ],
  },
  {
    id: "od4",
    name: { en: "Dr. Andrew Ho", zh: "何醫生" },
    title: { en: "Implant Specialist", zh: "植牙專科醫生" },
    specialty: { en: "Implantology", zh: "植牙科" },
    rating: 4.9,
    consultations: 3800,
    bio: { en: "Dr. Andrew Ho provides implant consultations online, helping patients understand treatment options and costs before visiting the clinic.", zh: "何醫生提供線上植牙諮詢，幫助患者在到診前了解治療方案及費用。" },
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

// ---- Existing Mock Data ----

export const mockInstitutions: Institution[] = [
  {
    id: "1",
    name: { en: "SmileCare Dental Central", zh: "微笑牙科中環診所" },
    description: {
      en: "SmileCare Dental is a leading dental clinic in Central, offering comprehensive dental care with state-of-the-art equipment and experienced dentists. We provide a comfortable and modern environment for all your dental needs.",
      zh: "微笑牙科是中環領先的牙科診所，提供全面的牙科護理服務，配備最先進的設備和經驗豐富的牙醫。我們為您提供舒適現代的就診環境。",
    },
    rating: 4.8, reviewCount: 326, distance: 0.5,
    address: { en: "12/F, One Exchange Square, Central, Hong Kong", zh: "香港中環交易廣場一座12樓" },
    phone: "+852 2523 8899", isOpen: true,
    hours: [
      { day: "mon", time: "09:00 - 18:00" }, { day: "tue", time: "09:00 - 18:00" }, { day: "wed", time: "09:00 - 18:00" },
      { day: "thu", time: "09:00 - 18:00" }, { day: "fri", time: "09:00 - 18:00" }, { day: "sat", time: "09:00 - 13:00" }, { day: "sun", time: "Closed" },
    ],
    transport: { en: "MTR Central Station Exit A • 3 min walk from IFC Mall", zh: "港鐵中環站A出口 • 距IFC商場步行3分鐘" },
    categories: ["general", "cosmetic", "implants"],
    popularServices: [{ en: "Teeth Whitening", zh: "牙齒美白" }, { en: "Dental Implants", zh: "植牙" }],
    logoColor: "bg-primary", logoInitials: "SC", photoCount: 8,
    doctors: [
      { id: "d1", name: { en: "Dr. Sarah Chan", zh: "陳醫生" }, specialty: { en: "General Dentistry", zh: "一般牙科" }, yearsExp: 12, rating: 4.9, consultations: 2340, bio: { en: "Dr. Sarah Chan is a highly experienced general dentist with over 12 years of practice.", zh: "陳醫生是一位擁有超過12年執業經驗的資深牙醫。" }, serviceIds: ["s1", "s2", "s3"] },
      { id: "d2", name: { en: "Dr. Michael Wong", zh: "黃醫生" }, specialty: { en: "Orthodontics", zh: "矯齒科" }, yearsExp: 8, rating: 4.7, consultations: 1560, bio: { en: "Dr. Michael Wong specializes in orthodontic treatments.", zh: "黃醫生專注矯齒治療。" }, serviceIds: ["s1", "s2"] },
      { id: "d3", name: { en: "Dr. Emily Lau", zh: "劉醫生" }, specialty: { en: "Cosmetic Dentistry", zh: "美容牙科" }, yearsExp: 15, rating: 4.8, consultations: 3100, bio: { en: "Dr. Emily Lau is a leading cosmetic dentist.", zh: "劉醫生是一位美容牙科專家。" }, serviceIds: ["s1", "s3", "s4"] },
    ],
    services: [
      { id: "s1", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 300, description: { en: "Comprehensive dental examination", zh: "全面牙齒檢查" }, fullDescription: { en: "A thorough dental examination including visual inspection, X-rays if needed, gum health assessment, and personalized oral care recommendations.", zh: "全面的牙齒檢查，包括目視檢查、必要時X光片、牙齦健康評估及個人化口腔護理建議。" }, duration: 30, category: "general" },
      { id: "s2", name: { en: "Scaling & Polishing", zh: "洗牙及拋光" }, price: 800, description: { en: "Professional teeth cleaning", zh: "專業牙齒清潔" }, fullDescription: { en: "Professional dental cleaning to remove tartar, plaque, and stains.", zh: "專業牙齒清潔，去除牙石、牙菌斑及污漬。" }, duration: 45, category: "general" },
      { id: "s3", name: { en: "Teeth Whitening", zh: "牙齒美白" }, price: 3500, description: { en: "Professional whitening treatment", zh: "專業美白治療" }, fullDescription: { en: "In-office professional teeth whitening using advanced LED technology.", zh: "診所內專業牙齒美白，採用先進LED技術。" }, duration: 60, category: "cosmetic" },
      { id: "s4", name: { en: "Dental Implant", zh: "植牙" }, price: 15000, description: { en: "Single tooth implant", zh: "單顆植牙" }, fullDescription: { en: "A titanium implant surgically placed into the jawbone.", zh: "鈦金屬植體植入頜骨以替代缺失牙齒。" }, duration: 90, category: "implants" },
    ],
    reviews: [
      { id: "r1", userName: "Alice L.", rating: 5, date: "2025-12-01", comment: { en: "Excellent service! Very professional and gentle.", zh: "服務非常好！非常專業和溫柔。" }, envRating: 5, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
      { id: "r2", userName: "Tom K.", rating: 4, date: "2025-11-15", comment: { en: "Clean clinic, reasonable waiting time.", zh: "診所很乾淨，等候時間合理。" }, envRating: 4, serviceRating: 4, doctorSkillRating: 4, doctorAttitudeRating: 4 },
      { id: "r3", userName: "Jenny W.", rating: 5, date: "2025-11-01", comment: { en: "Dr. Chan is amazing. Highly recommend!", zh: "陳醫生很厲害，強烈推薦！" }, envRating: 5, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
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
      { id: "d4", name: { en: "Dr. Kevin Tam", zh: "譚醫生" }, specialty: { en: "Orthodontics", zh: "矯齒科" }, yearsExp: 10, rating: 4.6, consultations: 1800, bio: { en: "Dr. Kevin Tam is an experienced orthodontist.", zh: "譚醫生是一位經驗豐富的矯齒科醫生。" }, serviceIds: ["s5", "s6", "s7"] },
      { id: "d5", name: { en: "Dr. Lisa Ng", zh: "吳醫生" }, specialty: { en: "Pediatric Dentistry", zh: "兒童牙科" }, yearsExp: 7, rating: 4.8, consultations: 980, bio: { en: "Dr. Lisa Ng specializes in treating children with gentle care.", zh: "吳醫生專注兒童牙科治療。" }, serviceIds: ["s5", "s6"] },
    ],
    services: [
      { id: "s5", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 250, description: { en: "Standard dental examination", zh: "標準牙齒檢查" }, fullDescription: { en: "Standard dental examination with visual inspection.", zh: "標準牙齒檢查，包括目視檢查。" }, duration: 30, category: "general" },
      { id: "s6", name: { en: "Braces Consultation", zh: "矯齒諮詢" }, price: 500, description: { en: "Orthodontic assessment", zh: "矯齒評估" }, fullDescription: { en: "Comprehensive orthodontic assessment.", zh: "全面矯齒評估。" }, duration: 45, category: "orthodontics" },
      { id: "s7", name: { en: "Ceramic Braces", zh: "陶瓷牙箍" }, price: 25000, description: { en: "Clear ceramic braces treatment", zh: "透明陶瓷牙箍治療" }, fullDescription: { en: "Aesthetic ceramic braces.", zh: "與天然牙齒顏色融合的陶瓷牙箍。" }, duration: 60, category: "orthodontics" },
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
      { id: "d6", name: { en: "Dr. Raymond Lee", zh: "李醫生" }, specialty: { en: "General Dentistry", zh: "一般牙科" }, yearsExp: 20, rating: 4.5, consultations: 4200, bio: { en: "Dr. Raymond Lee has 20 years of experience.", zh: "李醫生擁有20年經驗。" }, serviceIds: ["s8", "s9", "s10"] },
    ],
    services: [
      { id: "s8", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 200, description: { en: "Basic dental examination", zh: "基本牙齒檢查" }, fullDescription: { en: "Basic dental examination.", zh: "基本牙齒檢查。" }, duration: 20, category: "general" },
      { id: "s9", name: { en: "Tooth Filling", zh: "補牙" }, price: 600, description: { en: "Composite filling", zh: "複合樹脂補牙" }, fullDescription: { en: "Tooth-colored composite filling.", zh: "牙色複合樹脂補牙。" }, duration: 30, category: "general" },
      { id: "s10", name: { en: "Tooth Extraction", zh: "拔牙" }, price: 800, description: { en: "Simple tooth extraction", zh: "簡單拔牙" }, fullDescription: { en: "Simple tooth extraction under local anesthesia.", zh: "局部麻醉下的簡單拔牙。" }, duration: 30, category: "general" },
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
      { id: "d7", name: { en: "Dr. Andrew Ho", zh: "何醫生" }, specialty: { en: "Implantology", zh: "植牙科" }, yearsExp: 18, rating: 4.9, consultations: 3800, bio: { en: "Dr. Andrew Ho is a renowned implantologist.", zh: "何醫生是著名植牙科專家。" }, serviceIds: ["s11", "s12"] },
      { id: "d8", name: { en: "Dr. Christine Yip", zh: "葉醫生" }, specialty: { en: "Cosmetic Dentistry", zh: "美容牙科" }, yearsExp: 14, rating: 4.8, consultations: 2600, bio: { en: "Dr. Christine Yip is an expert in smile design.", zh: "葉醫生是笑容設計專家。" }, serviceIds: ["s11"] },
    ],
    services: [
      { id: "s11", name: { en: "Porcelain Veneers", zh: "瓷貼面" }, price: 5000, description: { en: "Per tooth veneer", zh: "每顆瓷貼面" }, fullDescription: { en: "Custom-made porcelain veneers.", zh: "訂製瓷貼面。" }, duration: 60, category: "cosmetic" },
      { id: "s12", name: { en: "All-on-4 Implants", zh: "全口植牙" }, price: 120000, description: { en: "Full arch implant solution", zh: "全口植牙方案" }, fullDescription: { en: "Revolutionary full-arch dental implant solution.", zh: "革命性全口植牙方案。" }, duration: 180, category: "implants" },
    ],
    reviews: [
      { id: "r7", userName: "Grace F.", rating: 5, date: "2025-12-08", comment: { en: "World-class clinic!", zh: "世界級的診所！" }, envRating: 5, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
    ],
  },
];

export const mockPopularServices: PopularService[] = [
  { id: "ps1", name: { en: "Scaling & Polishing", zh: "洗牙" }, price: 800, institutionIds: ["1", "2", "3"], icon: "sparkles" },
  { id: "ps2", name: { en: "Tooth Filling", zh: "補牙" }, price: 600, institutionIds: ["1", "3"], icon: "shield" },
  { id: "ps3", name: { en: "Tooth Extraction", zh: "拔牙" }, price: 800, institutionIds: ["3", "1"], icon: "scissors" },
  { id: "ps4", name: { en: "Teeth Whitening", zh: "牙齒美白" }, price: 3500, institutionIds: ["1", "4"], icon: "sun" },
  { id: "ps5", name: { en: "Braces", zh: "矯齒" }, price: 25000, institutionIds: ["2"], icon: "smile" },
  { id: "ps6", name: { en: "Dental Implant", zh: "植牙" }, price: 15000, institutionIds: ["1", "4"], icon: "anchor" },
];

export const mockCoupons: Coupon[] = [
  { id: "c1", title: { en: "New Patient Discount", zh: "新患者優惠" }, discount: "20%", discountAmount: 0, validUntil: "2026-06-30", status: "available" },
  { id: "c2", title: { en: "Scaling Promo", zh: "洗牙優惠" }, discount: "HK$100", discountAmount: 100, validUntil: "2026-04-30", status: "available" },
  { id: "c3", title: { en: "Referral Bonus", zh: "推薦獎賞" }, discount: "HK$200", discountAmount: 200, validUntil: "2025-12-31", status: "expired" },
];
