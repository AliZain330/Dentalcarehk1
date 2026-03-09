import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClipboardList, Video, Stethoscope, Clock, Search, User } from "lucide-react";
import DoctorStatusBadge from "@/doctor/components/DoctorStatusBadge";
import DoctorEmptyState from "@/doctor/components/DoctorEmptyState";
import { useDoctorContext } from "@/doctor/context/DoctorContext";
import type { DoctorBadgeType } from "@/doctor/components/DoctorStatusBadge";

export type ClinicOrderStatus = "pending_acceptance" | "pending_treatment" | "completed";
export type ConsultOrderStatus = "pending_acceptance" | "in_consultation" | "completed" | "rejected";

export interface DoctorClinicOrder {
  id: string;
  orderNo: string;
  patient: { name: string; phone: string; gender: { en: string; zh: string } };
  service: { en: string; zh: string };
  institution: { en: string; zh: string };
  date: string;
  time: string;
  duration: number;
  status: ClinicOrderStatus;
  amount: number;
  notes?: { en: string; zh: string };
  createdAt: string;
}

export interface DoctorConsultOrder {
  id: string;
  orderNo: string;
  patient: { name: string; phone: string; gender: { en: string; zh: string } };
  consultationType: "text_image" | "video";
  symptoms: { en: string; zh: string };
  medicalHistory: { en: string; zh: string };
  imageCount: number;
  status: ConsultOrderStatus;
  amount: number;
  createdAt: string;
  rejectionReason?: string;
  diagnosisNotes?: { en: string; zh: string };
  medicationAdvice?: { en: string; zh: string };
  consultationStartedAt?: string;
  consultationEndedAt?: string;
}

export const mockClinicOrders: DoctorClinicOrder[] = [
  { id: "co1", orderNo: "IC20260310001", patient: { name: "Alice L.", phone: "+852 9111 2222", gender: { en: "Female", zh: "女" } }, service: { en: "Dental Check-up & Consultation", zh: "口腔檢查及諮詢" }, institution: { en: "HKU–SZH Dental Centre", zh: "港大深圳醫院口腔醫學中心" }, date: "2026-03-10", time: "09:30", duration: 30, status: "pending_acceptance", amount: 200, createdAt: "2026-03-09T08:00:00" },
  { id: "co2", orderNo: "IC20260310002", patient: { name: "Tom K.", phone: "+852 9333 4444", gender: { en: "Male", zh: "男" } }, service: { en: "Scaling & Polishing", zh: "潔牙及拋光" }, institution: { en: "HKU–SZH Dental Centre", zh: "港大深圳醫院口腔醫學中心" }, date: "2026-03-10", time: "10:30", duration: 45, status: "pending_treatment", amount: 500, createdAt: "2026-03-08T14:00:00" },
  { id: "co3", orderNo: "IC20260310003", patient: { name: "Ben T.", phone: "+852 9555 6666", gender: { en: "Male", zh: "男" } }, service: { en: "Teeth Whitening", zh: "牙齒美白" }, institution: { en: "HKU–SZH Dental Centre", zh: "港大深圳醫院口腔醫學中心" }, date: "2026-03-11", time: "14:00", duration: 60, status: "pending_acceptance", amount: 2800, createdAt: "2026-03-09T10:30:00" },
  { id: "co4", orderNo: "IC20260307001", patient: { name: "Mary H.", phone: "+852 9777 8888", gender: { en: "Female", zh: "女" } }, service: { en: "Root Canal Treatment", zh: "根管治療" }, institution: { en: "HKU–SZH Dental Centre", zh: "港大深圳醫院口腔醫學中心" }, date: "2026-03-07", time: "11:00", duration: 60, status: "completed", amount: 2500, notes: { en: "Patient reported mild sensitivity, normal post-treatment.", zh: "患者報告輕微敏感，屬術後正常反應。" }, createdAt: "2026-03-06T09:00:00" },
  { id: "co5", orderNo: "IC20260305001", patient: { name: "Grace F.", phone: "+852 9999 0000", gender: { en: "Female", zh: "女" } }, service: { en: "Dental Check-up & Consultation", zh: "口腔檢查及諮詢" }, institution: { en: "HKU–SZH Dental Centre", zh: "港大深圳醫院口腔醫學中心" }, date: "2026-03-05", time: "09:00", duration: 30, status: "completed", amount: 200, createdAt: "2026-03-04T15:00:00" },
];

export const mockConsultOrders: DoctorConsultOrder[] = [
  { id: "oc1", orderNo: "OC20260309001", patient: { name: "Jenny W.", phone: "+852 6111 2222", gender: { en: "Female", zh: "女" } }, consultationType: "text_image", symptoms: { en: "Sharp pain on lower right molar when biting", zh: "咬合時右下臼齒劇痛" }, medicalHistory: { en: "No allergies", zh: "無過敏史" }, imageCount: 2, status: "pending_acceptance", amount: 200, createdAt: "2026-03-09T13:30:00" },
  { id: "oc2", orderNo: "OC20260309002", patient: { name: "David C.", phone: "+852 6333 4444", gender: { en: "Male", zh: "男" } }, consultationType: "video", symptoms: { en: "Bleeding gums when brushing for 2 weeks", zh: "刷牙時牙齦出血持續兩週" }, medicalHistory: { en: "Taking blood thinners", zh: "正服用抗凝血藥" }, imageCount: 0, status: "in_consultation", amount: 380, createdAt: "2026-03-09T10:00:00", consultationStartedAt: "2026-03-09T10:15:00" },
  { id: "oc3", orderNo: "OC20260308001", patient: { name: "Peter L.", phone: "+852 6555 6666", gender: { en: "Male", zh: "男" } }, consultationType: "text_image", symptoms: { en: "Sensitivity to cold drinks on upper left teeth", zh: "上左牙齒對冷飲敏感" }, medicalHistory: { en: "None", zh: "無" }, imageCount: 1, status: "completed", amount: 200, createdAt: "2026-03-08T09:00:00", consultationStartedAt: "2026-03-08T09:20:00", consultationEndedAt: "2026-03-08T09:50:00", diagnosisNotes: { en: "Likely early-stage cavity on upper left premolar (#24). Recommend in-clinic examination and X-ray to confirm.", zh: "上左前磨牙（#24）疑似早期蛀牙。建議到診檢查及X光確認。" }, medicationAdvice: { en: "Use desensitizing toothpaste twice daily. Avoid very cold/hot beverages.", zh: "每天使用抗敏牙膏兩次。避免過冷過熱飲品。" } },
  { id: "oc4", orderNo: "OC20260307001", patient: { name: "Cindy W.", phone: "+852 6777 8888", gender: { en: "Female", zh: "女" } }, consultationType: "video", symptoms: { en: "Jaw clicking and pain when opening mouth wide", zh: "大幅張嘴時顎骨彈響及疼痛" }, medicalHistory: { en: "History of bruxism", zh: "有磨牙史" }, imageCount: 0, status: "completed", amount: 380, createdAt: "2026-03-07T14:00:00", consultationStartedAt: "2026-03-07T14:10:00", consultationEndedAt: "2026-03-07T14:40:00", diagnosisNotes: { en: "Temporomandibular joint dysfunction (TMD). Recommend in-clinic assessment for night guard.", zh: "顳顎關節紊亂（TMD）。建議到診評估及訂製夜間咬合板。" }, medicationAdvice: { en: "Apply warm compress to jaw area. Avoid hard foods.", zh: "對顎部進行熱敷。避免硬食。" } },
  { id: "oc5", orderNo: "OC20260306001", patient: { name: "Alex M.", phone: "+852 6999 0000", gender: { en: "Male", zh: "男" } }, consultationType: "text_image", symptoms: { en: "White spot on tongue, mild discomfort", zh: "舌頭白斑，輕微不適" }, medicalHistory: { en: "Smoker", zh: "吸煙者" }, imageCount: 3, status: "rejected", amount: 200, createdAt: "2026-03-06T16:00:00", rejectionReason: "This condition requires an oral medicine specialist." },
];

const clinicBadgeMap: Record<ClinicOrderStatus, { type: DoctorBadgeType; en: string; zh: string }> = {
  pending_acceptance: { type: "pending", en: "Pending", zh: "待接受" },
  pending_treatment: { type: "confirmed", en: "Confirmed", zh: "待治療" },
  completed: { type: "completed", en: "Completed", zh: "已完成" },
};

const consultBadgeMap: Record<ConsultOrderStatus, { type: DoctorBadgeType; en: string; zh: string }> = {
  pending_acceptance: { type: "pending", en: "Pending", zh: "待接受" },
  in_consultation: { type: "active", en: "In Progress", zh: "諮詢中" },
  completed: { type: "completed", en: "Completed", zh: "已完成" },
  rejected: { type: "rejected", en: "Rejected", zh: "已拒絕" },
};

const DoctorOrdersPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";
  const { clinicOrders, consultOrders } = useDoctorContext();

  const [mainTab, setMainTab] = useState("in_clinic");
  const [clinicFilter, setClinicFilter] = useState("all");
  const [consultFilter, setConsultFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClinic = clinicOrders.filter((o) => {
    if (clinicFilter !== "all" && o.status !== clinicFilter) return false;
    if (searchQuery && !o.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) && !o.orderNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredConsult = consultOrders.filter((o) => {
    if (consultFilter !== "all" && o.status !== consultFilter) return false;
    if (searchQuery && !o.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) && !o.orderNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-3 text-xl font-bold text-foreground">{isEn ? "Order Management" : "訂單管理"}</h1>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={isEn ? "Search patient, order no..." : "搜尋患者、訂單號..."} className="pl-9" />
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="w-full mb-3">
          <TabsTrigger value="in_clinic" className="flex-1 gap-1"><Stethoscope className="h-3.5 w-3.5" />{isEn ? "In-Clinic" : "到診"}</TabsTrigger>
          <TabsTrigger value="consultation" className="flex-1 gap-1"><Video className="h-3.5 w-3.5" />{isEn ? "Online" : "線上"}</TabsTrigger>
        </TabsList>

        <TabsContent value="in_clinic">
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {([["all", isEn ? "All" : "全部"], ["pending_acceptance", isEn ? "Pending" : "待接受"], ["pending_treatment", isEn ? "Confirmed" : "待治療"], ["completed", isEn ? "Completed" : "已完成"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setClinicFilter(v)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${clinicFilter === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
          {filteredClinic.length === 0 ? (
            <DoctorEmptyState icon={<ClipboardList className="h-6 w-6 text-muted-foreground/40" />} title={isEn ? "No orders found" : "未找到訂單"} />
          ) : (
            <div className="space-y-3">
              {filteredClinic.map((order) => {
                const badge = clinicBadgeMap[order.status];
                return (
                  <Card key={order.id} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/doctor/orders/clinic/${order.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="text-sm font-semibold text-foreground">{order.service[lang]}</span>
                        <DoctorStatusBadge status={badge.type} label={badge[lang]} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><User className="h-3 w-3" />{order.patient.name} · {order.patient.gender[lang]}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{order.date} {order.time}</span>
                        <span className="font-semibold text-foreground">HK${order.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{order.orderNo}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="consultation">
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {([["all", isEn ? "All" : "全部"], ["pending_acceptance", isEn ? "Pending" : "待接受"], ["in_consultation", isEn ? "Active" : "諮詢中"], ["completed", isEn ? "Completed" : "已完成"], ["rejected", isEn ? "Rejected" : "已拒絕"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setConsultFilter(v)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${consultFilter === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
          {filteredConsult.length === 0 ? (
            <DoctorEmptyState icon={<ClipboardList className="h-6 w-6 text-muted-foreground/40" />} title={isEn ? "No orders found" : "未找到訂單"} />
          ) : (
            <div className="space-y-3">
              {filteredConsult.map((order) => {
                const badge = consultBadgeMap[order.status];
                return (
                  <Card key={order.id} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/doctor/orders/consult/${order.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Video className="h-3.5 w-3.5 text-info" />
                          <span className="text-sm font-semibold text-foreground">{order.consultationType === "text_image" ? (isEn ? "Text & Image" : "圖文諮詢") : (isEn ? "Video Call" : "視頻諮詢")}</span>
                        </div>
                        <DoctorStatusBadge status={badge.type} label={badge[lang]} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><User className="h-3 w-3" />{order.patient.name}</div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{order.symptoms[lang]}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{order.createdAt.split("T")[0]}</span>
                        <span className="font-semibold text-foreground">HK${order.amount}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{order.orderNo}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorOrdersPage;
