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
  duration: number; // minutes
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

// Generate time slots for a given date
export const generateTimeSlots = (date: string): TimeSlot[] => {
  const morning = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
  const afternoon = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
  const all = [...morning, ...afternoon];
  // pseudo-random availability based on date+time
  return all.map((time) => {
    const hash = (date + time).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return { time, available: hash % 3 !== 0 };
  });
};

export const mockInstitutions: Institution[] = [
  {
    id: "1",
    name: { en: "SmileCare Dental Central", zh: "微笑牙科中環診所" },
    description: {
      en: "SmileCare Dental is a leading dental clinic in Central, offering comprehensive dental care with state-of-the-art equipment and experienced dentists. We provide a comfortable and modern environment for all your dental needs.",
      zh: "微笑牙科是中環領先的牙科診所，提供全面的牙科護理服務，配備最先進的設備和經驗豐富的牙醫。我們為您提供舒適現代的就診環境。",
    },
    rating: 4.8,
    reviewCount: 326,
    distance: 0.5,
    address: { en: "12/F, One Exchange Square, Central, Hong Kong", zh: "香港中環交易廣場一座12樓" },
    phone: "+852 2523 8899",
    isOpen: true,
    hours: [
      { day: "mon", time: "09:00 - 18:00" },
      { day: "tue", time: "09:00 - 18:00" },
      { day: "wed", time: "09:00 - 18:00" },
      { day: "thu", time: "09:00 - 18:00" },
      { day: "fri", time: "09:00 - 18:00" },
      { day: "sat", time: "09:00 - 13:00" },
      { day: "sun", time: "Closed" },
    ],
    transport: { en: "MTR Central Station Exit A • 3 min walk from IFC Mall", zh: "港鐵中環站A出口 • 距IFC商場步行3分鐘" },
    categories: ["general", "cosmetic", "implants"],
    popularServices: [{ en: "Teeth Whitening", zh: "牙齒美白" }, { en: "Dental Implants", zh: "植牙" }],
    logoColor: "bg-primary",
    logoInitials: "SC",
    photoCount: 8,
    doctors: [
      { id: "d1", name: { en: "Dr. Sarah Chan", zh: "陳醫生" }, specialty: { en: "General Dentistry", zh: "一般牙科" }, yearsExp: 12, rating: 4.9, consultations: 2340, bio: { en: "Dr. Sarah Chan is a highly experienced general dentist with over 12 years of practice. She specializes in preventive care, restorative treatments, and patient education.", zh: "陳醫生是一位擁有超過12年執業經驗的資深牙醫，專注預防護理、修復治療及患者教育。" }, serviceIds: ["s1", "s2", "s3"] },
      { id: "d2", name: { en: "Dr. Michael Wong", zh: "黃醫生" }, specialty: { en: "Orthodontics", zh: "矯齒科" }, yearsExp: 8, rating: 4.7, consultations: 1560, bio: { en: "Dr. Michael Wong specializes in orthodontic treatments including traditional braces and clear aligners. He is passionate about creating beautiful smiles.", zh: "黃醫生專注矯齒治療，包括傳統牙箍及隱形矯正。他致力為患者打造美麗笑容。" }, serviceIds: ["s1", "s2"] },
      { id: "d3", name: { en: "Dr. Emily Lau", zh: "劉醫生" }, specialty: { en: "Cosmetic Dentistry", zh: "美容牙科" }, yearsExp: 15, rating: 4.8, consultations: 3100, bio: { en: "Dr. Emily Lau is a leading cosmetic dentist with 15 years of experience in veneers, whitening, and smile design.", zh: "劉醫生是一位擁有15年經驗的美容牙科專家，擅長瓷貼面、美白及笑容設計。" }, serviceIds: ["s1", "s3", "s4"] },
    ],
    services: [
      { id: "s1", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 300, description: { en: "Comprehensive dental examination", zh: "全面牙齒檢查" }, fullDescription: { en: "A thorough dental examination including visual inspection, X-rays if needed, gum health assessment, and personalized oral care recommendations.", zh: "全面的牙齒檢查，包括目視檢查、必要時X光片、牙齦健康評估及個人化口腔護理建議。" }, duration: 30, category: "general" },
      { id: "s2", name: { en: "Scaling & Polishing", zh: "洗牙及拋光" }, price: 800, description: { en: "Professional teeth cleaning", zh: "專業牙齒清潔" }, fullDescription: { en: "Professional dental cleaning to remove tartar, plaque, and stains. Includes ultrasonic scaling, hand scaling, and polishing for a fresh clean feel.", zh: "專業牙齒清潔，去除牙石、牙菌斑及污漬。包括超聲波洗牙、手動洗牙及拋光。" }, duration: 45, category: "general" },
      { id: "s3", name: { en: "Teeth Whitening", zh: "牙齒美白" }, price: 3500, description: { en: "Professional whitening treatment", zh: "專業美白治療" }, fullDescription: { en: "In-office professional teeth whitening using advanced LED technology. Achieve up to 8 shades whiter in a single session. Safe and effective.", zh: "診所內專業牙齒美白，採用先進LED技術。一次療程可美白高達8個色階，安全有效。" }, duration: 60, category: "cosmetic" },
      { id: "s4", name: { en: "Dental Implant", zh: "植牙" }, price: 15000, description: { en: "Single tooth implant", zh: "單顆植牙" }, fullDescription: { en: "A titanium implant surgically placed into the jawbone to replace a missing tooth. Includes consultation, surgery, and crown placement over multiple visits.", zh: "鈦金屬植體植入頜骨以替代缺失牙齒。包括諮詢、手術及牙冠安裝，需多次就診。" }, duration: 90, category: "implants" },
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
    description: { en: "DentalPlus is your trusted dental care provider in Tsim Sha Tsui, specializing in orthodontics and preventive care for the whole family.", zh: "齒科佳是尖沙咀值得信賴的牙科護理中心，專注矯齒及全家預防性牙齒護理。" },
    rating: 4.6, reviewCount: 218, distance: 1.2,
    address: { en: "8/F, Mira Place One, 132 Nathan Road, TST", zh: "尖沙咀彌敦道132號美麗華廣場一期8樓" },
    phone: "+852 2367 1100", isOpen: true,
    hours: [{ day: "mon", time: "10:00 - 19:00" }, { day: "tue", time: "10:00 - 19:00" }, { day: "wed", time: "10:00 - 19:00" }, { day: "thu", time: "10:00 - 19:00" }, { day: "fri", time: "10:00 - 19:00" }, { day: "sat", time: "10:00 - 14:00" }, { day: "sun", time: "Closed" }],
    transport: { en: "MTR Tsim Sha Tsui Station Exit B1 • 5 min walk", zh: "港鐵尖沙咀站B1出口 • 步行5分鐘" },
    categories: ["general", "orthodontics", "pediatric"],
    popularServices: [{ en: "Braces", zh: "牙箍" }, { en: "Scaling", zh: "洗牙" }],
    logoColor: "bg-info", logoInitials: "D+", photoCount: 6,
    doctors: [
      { id: "d4", name: { en: "Dr. Kevin Tam", zh: "譚醫生" }, specialty: { en: "Orthodontics", zh: "矯齒科" }, yearsExp: 10, rating: 4.6, consultations: 1800, bio: { en: "Dr. Kevin Tam is an experienced orthodontist dedicated to creating perfect smiles with braces and clear aligners.", zh: "譚醫生是一位經驗豐富的矯齒科醫生，致力以牙箍及隱形矯正打造完美笑容。" }, serviceIds: ["s5", "s6", "s7"] },
      { id: "d5", name: { en: "Dr. Lisa Ng", zh: "吳醫生" }, specialty: { en: "Pediatric Dentistry", zh: "兒童牙科" }, yearsExp: 7, rating: 4.8, consultations: 980, bio: { en: "Dr. Lisa Ng specializes in treating children with gentle care, making dental visits fun and stress-free.", zh: "吳醫生專注兒童牙科治療，以溫柔的方式讓小朋友輕鬆愉快地看牙醫。" }, serviceIds: ["s5", "s6"] },
    ],
    services: [
      { id: "s5", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 250, description: { en: "Standard dental examination", zh: "標準牙齒檢查" }, fullDescription: { en: "Standard dental examination with visual inspection and basic oral health assessment.", zh: "標準牙齒檢查，包括目視檢查及基本口腔健康評估。" }, duration: 30, category: "general" },
      { id: "s6", name: { en: "Braces Consultation", zh: "矯齒諮詢" }, price: 500, description: { en: "Orthodontic assessment", zh: "矯齒評估" }, fullDescription: { en: "Comprehensive orthodontic assessment including bite analysis and treatment planning.", zh: "全面矯齒評估，包括咬合分析及治療計劃。" }, duration: 45, category: "orthodontics" },
      { id: "s7", name: { en: "Ceramic Braces", zh: "陶瓷牙箍" }, price: 25000, description: { en: "Clear ceramic braces treatment", zh: "透明陶瓷牙箍治療" }, fullDescription: { en: "Aesthetic ceramic braces that blend with natural teeth color. Full orthodontic treatment over 12-24 months.", zh: "與天然牙齒顏色融合的陶瓷牙箍。完整矯齒療程約12至24個月。" }, duration: 60, category: "orthodontics" },
    ],
    reviews: [
      { id: "r4", userName: "David C.", rating: 5, date: "2025-12-10", comment: { en: "Great orthodontist! My braces journey was smooth.", zh: "很棒的矯齒醫生！矯齒過程很順利。" }, envRating: 4, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
      { id: "r5", userName: "Mary H.", rating: 4, date: "2025-11-20", comment: { en: "Good service, friendly staff.", zh: "服務很好，員工很友善。" }, envRating: 4, serviceRating: 4, doctorSkillRating: 4, doctorAttitudeRating: 4 },
    ],
  },
  {
    id: "3",
    name: { en: "BrightDent Mong Kok", zh: "亮齒牙科旺角店" },
    description: { en: "BrightDent offers affordable, quality dental care in the heart of Mong Kok.", zh: "亮齒牙科位於旺角中心地帶，提供價格實惠的優質牙科護理。" },
    rating: 4.4, reviewCount: 156, distance: 2.8,
    address: { en: "5/F, Grand Century Place, 193 Prince Edward Road West, MK", zh: "旺角太子道西193號新世紀廣場5樓" },
    phone: "+852 2398 5500", isOpen: false,
    hours: [{ day: "mon", time: "09:30 - 17:30" }, { day: "tue", time: "09:30 - 17:30" }, { day: "wed", time: "09:30 - 17:30" }, { day: "thu", time: "09:30 - 17:30" }, { day: "fri", time: "09:30 - 17:30" }, { day: "sat", time: "09:30 - 13:00" }, { day: "sun", time: "Closed" }],
    transport: { en: "MTR Mong Kok East Station Exit C • Inside Grand Century Place", zh: "港鐵旺角東站C出口 • 新世紀廣場內" },
    categories: ["general", "cosmetic"],
    popularServices: [{ en: "Fillings", zh: "補牙" }, { en: "Tooth Extraction", zh: "拔牙" }],
    logoColor: "bg-warning", logoInitials: "BD", photoCount: 5,
    doctors: [
      { id: "d6", name: { en: "Dr. Raymond Lee", zh: "李醫生" }, specialty: { en: "General Dentistry", zh: "一般牙科" }, yearsExp: 20, rating: 4.5, consultations: 4200, bio: { en: "Dr. Raymond Lee has 20 years of experience in general dentistry, providing reliable and affordable dental care.", zh: "李醫生擁有20年一般牙科經驗，提供可靠且價格合理的牙科護理。" }, serviceIds: ["s8", "s9", "s10"] },
    ],
    services: [
      { id: "s8", name: { en: "Dental Check-up", zh: "牙齒檢查" }, price: 200, description: { en: "Basic dental examination", zh: "基本牙齒檢查" }, fullDescription: { en: "Basic dental examination including visual inspection.", zh: "基本牙齒檢查，包括目視檢查。" }, duration: 20, category: "general" },
      { id: "s9", name: { en: "Tooth Filling", zh: "補牙" }, price: 600, description: { en: "Composite filling", zh: "複合樹脂補牙" }, fullDescription: { en: "Tooth-colored composite filling to restore damaged or decayed teeth. Durable and natural-looking.", zh: "牙色複合樹脂補牙，修復受損或蛀牙，耐用且外觀自然。" }, duration: 30, category: "general" },
      { id: "s10", name: { en: "Tooth Extraction", zh: "拔牙" }, price: 800, description: { en: "Simple tooth extraction", zh: "簡單拔牙" }, fullDescription: { en: "Simple tooth extraction under local anesthesia. Includes post-extraction care instructions.", zh: "局部麻醉下的簡單拔牙，包括拔牙後護理指引。" }, duration: 30, category: "general" },
    ],
    reviews: [
      { id: "r6", userName: "Peter L.", rating: 4, date: "2025-12-05", comment: { en: "Affordable and efficient.", zh: "價格實惠，效率高。" }, envRating: 3, serviceRating: 4, doctorSkillRating: 4, doctorAttitudeRating: 4 },
    ],
  },
  {
    id: "4",
    name: { en: "Perfect Smile Causeway Bay", zh: "完美笑容銅鑼灣診所" },
    description: { en: "Perfect Smile is a premium dental clinic in Causeway Bay, specializing in cosmetic dentistry and dental implants.", zh: "完美笑容是銅鑼灣的優質牙科診所，專注美容牙科及植牙。" },
    rating: 4.9, reviewCount: 412, distance: 1.8,
    address: { en: "15/F, Times Square, 1 Matheson Street, CWB", zh: "銅鑼灣勿地臣街1號時代廣場15樓" },
    phone: "+852 2890 3300", isOpen: true,
    hours: [{ day: "mon", time: "08:30 - 19:00" }, { day: "tue", time: "08:30 - 19:00" }, { day: "wed", time: "08:30 - 19:00" }, { day: "thu", time: "08:30 - 19:00" }, { day: "fri", time: "08:30 - 19:00" }, { day: "sat", time: "09:00 - 15:00" }, { day: "sun", time: "Closed" }],
    transport: { en: "MTR Causeway Bay Station Exit A • Times Square", zh: "港鐵銅鑼灣站A出口 • 時代廣場" },
    categories: ["cosmetic", "implants", "general"],
    popularServices: [{ en: "Veneers", zh: "瓷貼面" }, { en: "Implants", zh: "植牙" }],
    logoColor: "bg-success", logoInitials: "PS", photoCount: 12,
    doctors: [
      { id: "d7", name: { en: "Dr. Andrew Ho", zh: "何醫生" }, specialty: { en: "Implantology", zh: "植牙科" }, yearsExp: 18, rating: 4.9, consultations: 3800, bio: { en: "Dr. Andrew Ho is a renowned implantologist with 18 years of experience in complex implant procedures.", zh: "何醫生是著名植牙科專家，擁有18年複雜植牙手術經驗。" }, serviceIds: ["s11", "s12"] },
      { id: "d8", name: { en: "Dr. Christine Yip", zh: "葉醫生" }, specialty: { en: "Cosmetic Dentistry", zh: "美容牙科" }, yearsExp: 14, rating: 4.8, consultations: 2600, bio: { en: "Dr. Christine Yip is an expert in smile design, veneers, and cosmetic dental treatments.", zh: "葉醫生是笑容設計、瓷貼面及美容牙科治療專家。" }, serviceIds: ["s11"] },
    ],
    services: [
      { id: "s11", name: { en: "Porcelain Veneers", zh: "瓷貼面" }, price: 5000, description: { en: "Per tooth veneer", zh: "每顆瓷貼面" }, fullDescription: { en: "Custom-made porcelain veneers bonded to the front of teeth for a perfect smile. Natural-looking and long-lasting.", zh: "訂製瓷貼面貼合牙齒前面，打造完美笑容。外觀自然，持久耐用。" }, duration: 60, category: "cosmetic" },
      { id: "s12", name: { en: "All-on-4 Implants", zh: "全口植牙" }, price: 120000, description: { en: "Full arch implant solution", zh: "全口植牙方案" }, fullDescription: { en: "Revolutionary full-arch dental implant solution using only 4 implants. Immediate function and natural aesthetics.", zh: "革命性全口植牙方案，僅需4顆植體。即時功能及自然美觀。" }, duration: 180, category: "implants" },
    ],
    reviews: [
      { id: "r7", userName: "Grace F.", rating: 5, date: "2025-12-08", comment: { en: "World-class clinic! Worth every penny.", zh: "世界級的診所！物有所值。" }, envRating: 5, serviceRating: 5, doctorSkillRating: 5, doctorAttitudeRating: 5 },
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
