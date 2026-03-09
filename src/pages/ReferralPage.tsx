import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gift, Copy, QrCode, Coins, Check, Share2, Users, ShoppingBag, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCoinTransactions } from "@/data/mockData";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

const ReferralPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const [copied, setCopied] = useState(false);
  const [historyTab, setHistoryTab] = useState<"all" | "earned" | "spent">("all");
  const referralLink = "https://dentalplus.hk/ref/USER123";
  const coinsBalance = 250;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { icon: Share2, text: t.referralPage.step1 },
    { icon: Users, text: t.referralPage.step2 },
    { icon: ShoppingBag, text: t.referralPage.step3 },
  ];

  const filteredTransactions = mockCoinTransactions.filter((tx) =>
    historyTab === "all" ? true : tx.type === historyTab
  );

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{t.referralPage.title}</h1>
      </div>

      {/* Hero */}
      <Card className="mb-5 border-0 bg-gradient-to-r from-primary to-primary/80 shadow-sm">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Gift className="mb-2 h-10 w-10 text-primary-foreground" />
          <h2 className="text-lg font-bold text-primary-foreground">{t.referralPage.subtitle}</h2>
        </CardContent>
      </Card>

      {/* Coin Balance */}
      <Card className="mb-5 border-0 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
            <Coins className="h-7 w-7 text-warning" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t.referralPage.balance}</p>
            <p className="text-2xl font-bold text-foreground">{coinsBalance} <span className="text-sm font-normal text-muted-foreground">{t.referralPage.coins}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t.referralPage.conversion}</p>
            <p className="text-sm font-semibold text-primary">≈ HK${(coinsBalance / 10).toFixed(0)}</p>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="mb-5 border-0 shadow-sm">
        <CardContent className="p-4">
          <h3 className="mb-3 text-base font-semibold text-foreground">{t.referralPage.howItWorks}</h3>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-foreground">{step.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t.referralPage.conversionNote}</p>
        </CardContent>
      </Card>

      {/* Referral Link */}
      <Card className="mb-5 border-0 shadow-sm">
        <CardContent className="p-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">{t.referralPage.yourLink}</h3>
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            <p className="flex-1 truncate text-xs text-muted-foreground">{referralLink}</p>
            <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0">
              {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
              {copied ? t.referralPage.copied : t.referralPage.copy}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code placeholder — TODO: Replace with real QR code generation */}
      <Card className="mb-5 border-0 shadow-sm">
        <CardContent className="flex flex-col items-center p-6">
          <div className="mb-2 flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-border">
            <QrCode className="h-16 w-16 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t.referralPage.qrCode}</p>
          <ApiPlaceholderNotice service="QR Code" className="mt-3" />
        </CardContent>
      </Card>

      {/* Coin Transaction History */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <h3 className="mb-3 text-base font-semibold text-foreground">{t.referralPage.history}</h3>
          <div className="mb-3 flex gap-2">
            {(["all", "earned", "spent"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setHistoryTab(tab)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  historyTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {tab === "all" ? t.orderManagement.all : tab === "earned" ? t.referralPage.earned : t.referralPage.spent}
              </button>
            ))}
          </div>
          {filteredTransactions.length > 0 ? (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${tx.type === "earned" ? "bg-success/10" : "bg-destructive/10"}`}>
                    {tx.type === "earned" ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{tx.description[lang]}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === "earned" ? "text-success" : "text-destructive"}`}>
                    {tx.type === "earned" ? "+" : ""}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <Gift className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{t.referralPage.emptyHistory}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.referralPage.emptyHistoryDesc}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralPage;
