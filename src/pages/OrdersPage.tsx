import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OrdersPage: React.FC = () => {
  const { t } = useLanguage();
  const tabs = [
    t.orders.all,
    t.orders.pending,
    t.orders.confirmed,
    t.orders.completed,
    t.orders.cancelled,
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="animate-fade-in p-4 pt-6">
      <h1 className="mb-4 text-xl font-bold text-foreground">{t.orders.title}</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === i
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <ClipboardList className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">{t.orders.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.orders.emptyDesc}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
