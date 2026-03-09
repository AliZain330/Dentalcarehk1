export const adminMetrics = {
  totalUsers: 12_458,
  totalInstitutions: 86,
  totalDoctors: 342,
  todayOrders: 127,
  weekOrders: 843,
  monthOrders: 3_621,
  todayTransaction: 254_800,
  weekTransaction: 1_686_000,
  monthTransaction: 7_242_000,
  couponIssued: 5_420,
  couponUsed: 2_318,
  consultAcceptRate: 87.4,
};

export const orderTrendData = [
  { date: "03/03", orders: 98, amount: 196000 },
  { date: "03/04", orders: 112, amount: 224000 },
  { date: "03/05", orders: 134, amount: 268000 },
  { date: "03/06", orders: 105, amount: 210000 },
  { date: "03/07", orders: 127, amount: 254000 },
  { date: "03/08", orders: 89, amount: 178000 },
  { date: "03/09", orders: 127, amount: 254800 },
];

export const userGrowthData = [
  { month: "Oct", users: 8200, institutions: 52 },
  { month: "Nov", users: 9100, institutions: 60 },
  { month: "Dec", users: 9800, institutions: 68 },
  { month: "Jan", users: 10600, institutions: 74 },
  { month: "Feb", users: 11500, institutions: 80 },
  { month: "Mar", users: 12458, institutions: 86 },
];

export const couponUsageData = [
  { name: "Issued", value: 5420, fill: "hsl(174, 62%, 40%)" },
  { name: "Used", value: 2318, fill: "hsl(152, 60%, 42%)" },
  { name: "Expired", value: 784, fill: "hsl(210, 10%, 50%)" },
  { name: "Available", value: 2318, fill: "hsl(38, 92%, 50%)" },
];

export const regionData = [
  { region: "Hong Kong Island", orders: 1245, amount: 2_490_000 },
  { region: "Kowloon", orders: 1532, amount: 3_064_000 },
  { region: "New Territories", orders: 844, amount: 1_688_000 },
];

export const serviceTypeData = [
  { type: "General Check-up", orders: 1280, amount: 1_920_000 },
  { type: "Teeth Cleaning", orders: 820, amount: 1_640_000 },
  { type: "Orthodontics", orders: 340, amount: 2_040_000 },
  { type: "Implants", orders: 180, amount: 1_440_000 },
  { type: "Online Consultation", orders: 1001, amount: 202_000 },
];

export const topInstitutions = [
  { name: "Bright Smile Dental Centre", orders: 420, amount: 840_000 },
  { name: "Happy Teeth Clinic", orders: 380, amount: 760_000 },
  { name: "Central Dental Hospital", orders: 310, amount: 930_000 },
  { name: "Tsim Sha Tsui Dental", orders: 290, amount: 580_000 },
  { name: "Sha Tin Family Dental", orders: 245, amount: 490_000 },
];

export const acceptanceRateData = [
  { date: "03/03", rate: 85 },
  { date: "03/04", rate: 88 },
  { date: "03/05", rate: 82 },
  { date: "03/06", rate: 90 },
  { date: "03/07", rate: 87 },
  { date: "03/08", rate: 91 },
  { date: "03/09", rate: 87.4 },
];
