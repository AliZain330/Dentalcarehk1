import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrders } from "@/context/OrdersContext";
import { mockInstitutions } from "@/data/mockData";
import { ClipboardList, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/StatusBadge";

const OrdersPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const lang = language === "zh-HK" ? "zh" : "en";

  const tabs = [
    { key: "all", label: t.orderManagement.all },
    { key: "pending_acceptance", label: t.orderManagement.pendingAcceptance },
    { key: "pending_treatment", label: t.orderManagement.pendingTreatment },
    { key: "completed", label: t.orderManagement.completed },
    { key: "cancelled", label: t.orderManagement.cancelled },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === "all" || o.status === activeTab;
      if (!matchesTab) return false;
      if (!search) return true;
      const inst = mockInstitutions.find((i) => i.id === o.institutionId);
      return inst?.name[lang].toLowerCase().includes(search.toLowerCase()) || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    });
  }, [orders, activeTab, search, lang]);

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{t.orderManagement.title}</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t.orderManagement.searchOrders} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((order) => {
            const inst = mockInstitutions.find((i) => i.id === order.institutionId);
            const svc = inst?.services.find((s) => s.id === order.serviceId);
            const doc = inst?.doctors.find((d) => d.id === order.doctorId);
            return (
              <Card
                key={order.id}
                className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
                onClick={() => navigate(`/order/${order.id}`)}
              >
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
