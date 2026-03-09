import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrders } from "@/context/OrdersContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockInstitutions, mockOnlineDoctors } from "@/data/mockData";
import { ClipboardList, Search, MessageSquareText, Video, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";
import ConsultationStatusBadge from "@/components/ConsultationStatusBadge";

const OrdersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { consultations } = useConsultation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const [orderType, setOrderType] = useState<"clinic" | "consultation">("clinic");

  const statusTabs = [
    { key: "all", label: t.orderManagement.all },
    { key: "pending_acceptance", label: t.orderManagement.pendingAcceptance },
    ...(orderType === "clinic"
      ? [{ key: "pending_treatment", label: t.orderManagement.pendingTreatment }]
      : [{ key: "in_consultation", label: t.consultation.textImage }]),
    { key: "completed", label: t.orderManagement.completed },
    { key: "cancelled", label: t.orderManagement.cancelled },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Clinic orders
  const filteredClinic = useMemo(() => {
    if (orderType !== "clinic") return [];
    return orders.filter((o) => {
      const matchesTab = activeTab === "all" || o.status === activeTab;
      if (!matchesTab) return false;
      if (!search) return true;
      const inst = mockInstitutions.find((i) => i.id === o.institutionId);
      return inst?.name[lang].toLowerCase().includes(search.toLowerCase()) || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    });
  }, [orders, activeTab, search, lang, orderType]);

  // Consultation orders
  const filteredConsultation = useMemo(() => {
    if (orderType !== "consultation") return [];
    return consultations.filter((c) => {
      const matchesTab = activeTab === "all" || c.status === activeTab;
      if (!matchesTab) return false;
      if (!search) return true;
      const doc = mockOnlineDoctors.find((d) => d.id === c.doctorId);
      return doc?.name[lang].toLowerCase().includes(search.toLowerCase()) || c.orderNumber.toLowerCase().includes(search.toLowerCase());
    });
  }, [consultations, activeTab, search, lang, orderType]);

  const isEmpty = orderType === "clinic" ? filteredClinic.length === 0 : filteredConsultation.length === 0;

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{t.orderManagement.title}</h1>

      {/* Order type toggle */}
      <div className="mb-4 flex rounded-xl bg-muted p-1">
        <button
          onClick={() => { setOrderType("clinic"); setActiveTab("all"); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${orderType === "clinic" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <Stethoscope className="h-3.5 w-3.5" /> {t.orderManagement.inClinic}
        </button>
        <button
          onClick={() => { setOrderType("consultation"); setActiveTab("all"); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${orderType === "consultation" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <MessageSquareText className="h-3.5 w-3.5" /> {t.orderManagement.onlineConsult}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t.orderManagement.searchOrders} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Status tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!isEmpty ? (
        <div className="space-y-3">
          {orderType === "clinic" && filteredClinic.map((order) => {
            const inst = mockInstitutions.find((i) => i.id === order.institutionId);
            const svc = inst?.services.find((s) => s.id === order.serviceId);
            const doc = inst?.doctors.find((d) => d.id === order.doctorId);
            return (
              <Card key={order.id} className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate(`/order/${order.id}`)}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{order.orderNumber}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex gap-3">
                    {inst && (
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${inst.logoColor}`}>
                        <span className="text-xs font-bold text-primary-foreground">{inst.logoInitials}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{svc?.name[lang]}</p>
                      <p className="text-xs text-muted-foreground">{doc?.name[lang]} · {order.date} {order.time}</p>
                      <p className="mt-1 text-sm font-bold text-primary">HK${order.finalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {orderType === "consultation" && filteredConsultation.map((con) => {
            const doc = mockOnlineDoctors.find((d) => d.id === con.doctorId);
            return (
              <Card key={con.id} className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate(`/consultation/order/${con.id}`)}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{con.orderNumber}</span>
                    <ConsultationStatusBadge status={con.status} />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{doc?.name[lang].charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{doc?.name[lang]}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {con.consultationType === "text_image" ? <MessageSquareText className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                        {con.consultationType === "text_image" ? t.consultation.textImage : t.consultation.video}
                      </div>
                      <p className="mt-1 text-sm font-bold text-primary">HK${con.finalAmount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <ClipboardList className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">{t.orderManagement.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.orderManagement.emptyDesc}</p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
