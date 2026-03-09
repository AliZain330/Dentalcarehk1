import React from "react";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentMethodCardProps {
  id: string;
  name: string;
  icon: "credit-card" | "alipay" | "wechat";
  selected: boolean;
  onSelect: () => void;
}

const iconColors: Record<string, string> = {
  "credit-card": "bg-info/10 text-info",
  alipay: "bg-[hsl(210,80%,55%)]/10 text-[hsl(210,80%,55%)]",
  wechat: "bg-success/10 text-success",
};

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ name, icon, selected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
        selected ? "border-primary bg-secondary" : "border-border"
      }`}
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconColors[icon]}`}>
        {icon === "credit-card" ? (
          <CreditCard className="h-5 w-5" />
        ) : (
          <Wallet className="h-5 w-5" />
        )}
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">{name}</span>
      <div className={`h-5 w-5 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border"}`}>
        {selected && <div className="m-0.5 h-3 w-3 rounded-full bg-primary-foreground" />}
      </div>
    </button>
  );
};

export default PaymentMethodCard;
