export type AdminRoleKey = "operations" | "review" | "finance" | "customerService";

export type PermissionAction = "view" | "create" | "edit" | "approve" | "disable" | "export";

export interface BasicSystemSettings {
  platformName: string;
  logoUrl: string;
  serviceFeeRate: number;
  appointmentCancellationHours: number;
  appointmentPenaltyRate: number;
  consultationTextMessageCount: number;
  consultationTimeWindowMinutes: number;
  consultationVideoDurationMinutes: number;
  updatedAt: string;
}

export interface LanguageCopyItem {
  id: string;
  module: string;
  moduleZh: string;
  key: string;
  valueEn: string;
  valueZh: string;
  updatedBy: string;
  updatedAt: string;
}

export interface PermissionModule {
  id: string;
  name: string;
  nameZh: string;
  permissions: Record<PermissionAction, Record<AdminRoleKey, boolean>>;
}

export interface AdminAccount {
  id: string;
  name: string;
  nameZh: string;
  role: AdminRoleKey;
  email: string;
  status: "enabled" | "disabled";
  createdAt: string;
}

export interface SystemLogRecord {
  id: string;
  logType: "operation" | "login";
  account: string;
  role: AdminRoleKey;
  operationType: string;
  operationTypeZh: string;
  target: string;
  targetZh: string;
  status: "success" | "failed";
  ipAddress: string;
  createdAt: string;
}

export const adminRoles: { key: AdminRoleKey; label: string; labelZh: string }[] = [
  { key: "operations", label: "Operations", labelZh: "營運" },
  { key: "review", label: "Review", labelZh: "審核" },
  { key: "finance", label: "Finance", labelZh: "財務" },
  { key: "customerService", label: "Customer Service", labelZh: "客服" },
];

export const permissionActions: { key: PermissionAction; label: string; labelZh: string }[] = [
  { key: "view", label: "View", labelZh: "查看" },
  { key: "create", label: "Create", labelZh: "新增" },
  { key: "edit", label: "Edit", labelZh: "編輯" },
  { key: "approve", label: "Approve", labelZh: "審批" },
  { key: "disable", label: "Disable/Enable", labelZh: "停用/啟用" },
  { key: "export", label: "Export", labelZh: "導出" },
];

export const basicSystemSettings: BasicSystemSettings = {
  platformName: "Hong Kong DentalCare Platform",
  logoUrl: "/placeholder.svg",
  serviceFeeRate: 8.5,
  appointmentCancellationHours: 24,
  appointmentPenaltyRate: 15,
  consultationTextMessageCount: 20,
  consultationTimeWindowMinutes: 45,
  consultationVideoDurationMinutes: 15,
  updatedAt: "2026-03-08 14:20",
};

export const languageCopyItems: LanguageCopyItem[] = [
  {
    id: "copy-001",
    module: "Booking",
    moduleZh: "預約",
    key: "booking.confirmation.title",
    valueEn: "Appointment Confirmed",
    valueZh: "預約已確認",
    updatedBy: "Olivia Chan",
    updatedAt: "2026-03-08 10:24",
  },
  {
    id: "copy-002",
    module: "Consultation",
    moduleZh: "在線問診",
    key: "consultation.queue.message",
    valueEn: "Doctor will reply shortly",
    valueZh: "醫生將盡快回覆",
    updatedBy: "Olivia Chan",
    updatedAt: "2026-03-07 17:08",
  },
  {
    id: "copy-003",
    module: "Payments",
    moduleZh: "支付",
    key: "payment.failed.subtitle",
    valueEn: "Please retry or use another payment method",
    valueZh: "請重試或使用其他支付方式",
    updatedBy: "Grace Wong",
    updatedAt: "2026-03-06 12:42",
  },
];

const defaultPermissionRow = {
  operations: false,
  review: false,
  finance: false,
  customerService: false,
};

export const permissionModules: PermissionModule[] = [
  {
    id: "module-booking",
    name: "Booking Orders",
    nameZh: "到診訂單",
    permissions: {
      view: { ...defaultPermissionRow, operations: true, review: true, finance: true, customerService: true },
      create: { ...defaultPermissionRow, operations: true },
      edit: { ...defaultPermissionRow, operations: true, customerService: true },
      approve: { ...defaultPermissionRow, review: true },
      disable: { ...defaultPermissionRow, operations: true, review: true },
      export: { ...defaultPermissionRow, operations: true, finance: true },
    },
  },
  {
    id: "module-consult",
    name: "Online Consultation",
    nameZh: "在線問診",
    permissions: {
      view: { ...defaultPermissionRow, operations: true, review: true, customerService: true },
      create: { ...defaultPermissionRow, operations: true },
      edit: { ...defaultPermissionRow, operations: true, customerService: true },
      approve: { ...defaultPermissionRow, review: true },
      disable: { ...defaultPermissionRow, operations: true, review: true },
      export: { ...defaultPermissionRow, operations: true, finance: true },
    },
  },
  {
    id: "module-finance",
    name: "Finance & Settlement",
    nameZh: "財務及結算",
    permissions: {
      view: { ...defaultPermissionRow, operations: true, finance: true },
      create: { ...defaultPermissionRow, finance: true },
      edit: { ...defaultPermissionRow, finance: true },
      approve: { ...defaultPermissionRow, review: true, finance: true },
      disable: { ...defaultPermissionRow, review: true },
      export: { ...defaultPermissionRow, finance: true },
    },
  },
];

export const adminAccounts: AdminAccount[] = [
  {
    id: "ADM-1001",
    name: "Olivia Chan",
    nameZh: "陳詠琳",
    role: "operations",
    email: "olivia.chan@dentalcarehk.mock",
    status: "enabled",
    createdAt: "2025-12-01 09:10",
  },
  {
    id: "ADM-1002",
    name: "Grace Wong",
    nameZh: "黃雅婷",
    role: "review",
    email: "grace.wong@dentalcarehk.mock",
    status: "enabled",
    createdAt: "2025-12-15 10:35",
  },
  {
    id: "ADM-1003",
    name: "Leo Lau",
    nameZh: "劉浩然",
    role: "finance",
    email: "leo.lau@dentalcarehk.mock",
    status: "disabled",
    createdAt: "2026-01-10 14:22",
  },
  {
    id: "ADM-1004",
    name: "Mandy Ho",
    nameZh: "何敏婷",
    role: "customerService",
    email: "mandy.ho@dentalcarehk.mock",
    status: "enabled",
    createdAt: "2026-01-22 11:08",
  },
];

export const systemLogs: SystemLogRecord[] = [
  {
    id: "LOG-9001",
    logType: "operation",
    account: "Olivia Chan",
    role: "operations",
    operationType: "Update basic settings",
    operationTypeZh: "更新基本設定",
    target: "Service fee rate",
    targetZh: "平台服務費率",
    status: "success",
    ipAddress: "203.86.12.30",
    createdAt: "2026-03-09 09:10:12",
  },
  {
    id: "LOG-9002",
    logType: "login",
    account: "Grace Wong",
    role: "review",
    operationType: "Admin login",
    operationTypeZh: "管理員登入",
    target: "Admin portal",
    targetZh: "管理後台",
    status: "success",
    ipAddress: "203.86.24.51",
    createdAt: "2026-03-09 08:56:48",
  },
  {
    id: "LOG-9003",
    logType: "operation",
    account: "Leo Lau",
    role: "finance",
    operationType: "Export settlement logs",
    operationTypeZh: "導出結算記錄",
    target: "February settlement report",
    targetZh: "二月結算報告",
    status: "failed",
    ipAddress: "203.86.31.77",
    createdAt: "2026-03-08 17:33:04",
  },
  {
    id: "LOG-9004",
    logType: "operation",
    account: "Mandy Ho",
    role: "customerService",
    operationType: "Disable admin account",
    operationTypeZh: "停用管理員帳號",
    target: "ADM-1011",
    targetZh: "ADM-1011",
    status: "success",
    ipAddress: "203.86.27.113",
    createdAt: "2026-03-08 15:20:27",
  },
];
