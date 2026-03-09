export interface AdminDoctor {
  id: string;
  name: string;
  nameZh: string;
  institutionId: string;
  institution: string;
  institutionZh: string;
  specialties: string[];
  status: "active" | "pending" | "disabled";
  credentialStatus: "approved" | "pending" | "rejected" | "not_submitted";
  rating: number;
  reviewCount: number;
  consultations: number;
  clinicOrders: number;
  onboardingDate: string;
  phone: string;
  email: string;
  license: string;
  yearsExp: number;
  bio: string;
  bioZh: string;
  certificates: string[];
  rejectionReason?: string;
  permissions: {
    inClinic: boolean;
    textConsult: boolean;
    videoConsult: boolean;
    canPrescribe: boolean;
    canIssueSickLeave: boolean;
  };
}

export const adminDoctors: AdminDoctor[] = [
  {
    id: "DOC-001", name: "Dr. Sarah Chen", nameZh: "陳莎拉醫生",
    institutionId: "INST-001", institution: "Bright Smile Dental Centre", institutionZh: "燦爛微笑牙科中心",
    specialties: ["Orthodontics", "General Dentistry"],
    status: "active", credentialStatus: "approved",
    rating: 4.8, reviewCount: 86, consultations: 142, clinicOrders: 280,
    onboardingDate: "2025-07-01", phone: "+852 9123 0001", email: "sarah.chen@brightsmile.hk",
    license: "DL-HK-2018-1234", yearsExp: 8,
    bio: "Specialist in orthodontics with 8 years of clinical experience.",
    bioZh: "正畸專科醫生，擁有8年臨床經驗。",
    certificates: ["dental_license.pdf", "orthodontics_cert.pdf", "cpr_cert.pdf"],
    permissions: { inClinic: true, textConsult: true, videoConsult: true, canPrescribe: true, canIssueSickLeave: true },
  },
  {
    id: "DOC-002", name: "Dr. Michael Wong", nameZh: "黃邁克醫生",
    institutionId: "INST-002", institution: "Happy Teeth Clinic", institutionZh: "開心牙科診所",
    specialties: ["Implants", "Oral Surgery"],
    status: "active", credentialStatus: "approved",
    rating: 4.9, reviewCount: 62, consultations: 98, clinicOrders: 195,
    onboardingDate: "2025-08-15", phone: "+852 9123 0002", email: "michael.wong@happyteeth.hk",
    license: "DL-HK-2016-2345", yearsExp: 10,
    bio: "Expert in dental implants and oral surgery.",
    bioZh: "牙科種植及口腔外科專家。",
    certificates: ["dental_license.pdf", "implant_cert.pdf"],
    permissions: { inClinic: true, textConsult: true, videoConsult: true, canPrescribe: true, canIssueSickLeave: false },
  },
  {
    id: "DOC-003", name: "Dr. Emily Lau", nameZh: "劉艾美醫生",
    institutionId: "INST-003", institution: "Central Dental Hospital", institutionZh: "中環牙科醫院",
    specialties: ["General Dentistry", "Preventive Care"],
    status: "active", credentialStatus: "approved",
    rating: 4.7, reviewCount: 134, consultations: 210, clinicOrders: 420,
    onboardingDate: "2025-06-01", phone: "+852 9123 0003", email: "emily.lau@centraldental.hk",
    license: "DL-HK-2015-3456", yearsExp: 11,
    bio: "Experienced general dentist focused on preventive care.",
    bioZh: "資深全科牙醫，專注預防護理。",
    certificates: ["dental_license.pdf", "hygiene_cert.pdf"],
    permissions: { inClinic: true, textConsult: true, videoConsult: false, canPrescribe: true, canIssueSickLeave: true },
  },
  {
    id: "DOC-004", name: "Dr. James Lee", nameZh: "李占士醫生",
    institutionId: "", institution: "N/A", institutionZh: "無",
    specialties: ["Cosmetic Dentistry"],
    status: "pending", credentialStatus: "pending",
    rating: 0, reviewCount: 0, consultations: 0, clinicOrders: 0,
    onboardingDate: "2026-03-05", phone: "+852 9123 0004", email: "james.lee@gmail.com",
    license: "DL-HK-2020-4567", yearsExp: 6,
    bio: "Cosmetic dentistry specialist applying for platform access.",
    bioZh: "美容牙科專家，正在申請平台准入。",
    certificates: ["dental_license.pdf", "cosmetic_cert.pdf", "portfolio.pdf"],
    permissions: { inClinic: false, textConsult: false, videoConsult: false, canPrescribe: false, canIssueSickLeave: false },
  },
  {
    id: "DOC-005", name: "Dr. Alice Yip", nameZh: "葉愛麗醫生",
    institutionId: "INST-005", institution: "Pearl Dental Care", institutionZh: "珍珠牙科護理",
    specialties: ["Pediatric Dentistry"],
    status: "disabled", credentialStatus: "approved",
    rating: 4.5, reviewCount: 45, consultations: 67, clinicOrders: 130,
    onboardingDate: "2025-10-20", phone: "+852 9123 0005", email: "alice.yip@pearldental.hk",
    license: "DL-HK-2017-5678", yearsExp: 9,
    bio: "Pediatric dentistry specialist with gentle approach.",
    bioZh: "兒童牙科專家，手法溫柔。",
    certificates: ["dental_license.pdf", "pediatric_cert.pdf"],
    permissions: { inClinic: true, textConsult: true, videoConsult: false, canPrescribe: true, canIssueSickLeave: false },
  },
  {
    id: "DOC-006", name: "Dr. Raymond Yau", nameZh: "邱瑞蒙醫生",
    institutionId: "INST-007", institution: "Elite Orthodontics", institutionZh: "精英正畸中心",
    specialties: ["Orthodontics"],
    status: "pending", credentialStatus: "pending",
    rating: 0, reviewCount: 0, consultations: 0, clinicOrders: 0,
    onboardingDate: "2026-03-07", phone: "+852 9123 0006", email: "raymond.yau@eliteortho.hk",
    license: "DL-HK-2019-6789", yearsExp: 7,
    bio: "Orthodontics specialist seeking platform credential approval.",
    bioZh: "正畸專科醫生，正在申請平台資質審核。",
    certificates: ["dental_license.pdf", "orthodontics_advanced.pdf"],
    permissions: { inClinic: false, textConsult: false, videoConsult: false, canPrescribe: false, canIssueSickLeave: false },
  },
  {
    id: "DOC-007", name: "Dr. Grace Fung", nameZh: "馮嘉麗醫生",
    institutionId: "INST-006", institution: "Sunshine Dental Studio", institutionZh: "陽光牙科工作室",
    specialties: ["Endodontics", "General Dentistry"],
    status: "active", credentialStatus: "approved",
    rating: 4.6, reviewCount: 28, consultations: 45, clinicOrders: 88,
    onboardingDate: "2025-12-01", phone: "+852 9123 0007", email: "grace.fung@sunshinedental.hk",
    license: "DL-HK-2014-7890", yearsExp: 12,
    bio: "Root canal treatment specialist with over a decade of experience.",
    bioZh: "根管治療專家，擁有超過十年經驗。",
    certificates: ["dental_license.pdf", "endodontics_cert.pdf"],
    permissions: { inClinic: true, textConsult: true, videoConsult: true, canPrescribe: true, canIssueSickLeave: true },
  },
];
