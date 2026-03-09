import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, HelpCircle, Headphones, MessageSquareWarning } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

const CustomerServicePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const cs = t.customerService;

  const items = [
    { icon: HelpCircle, label: cs.faq, action: () => navigate("/customer-service/faq") },
    { icon: Headphones, label: cs.onlineSupport, action: () => toast({ title: "Online Support API key not added yet" }) },
    { icon: MessageSquareWarning, label: cs.complaint, action: () => navigate("/customer-service/complaint") },
  ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{cs.title}</h1>
      </div>
      <ApiPlaceholderNotice service="Customer Support Chat" className="mb-4" />
      <Card className="border-0 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          {items.map((item, i) => (
            <button key={i} onClick={item.action} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerServicePage;
