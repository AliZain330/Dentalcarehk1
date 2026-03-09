import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useReferral } from "@/context/ReferralContext";
import { ArrowLeft, UserCheck, UserX, Gift, CheckCircle2, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ReferralRecordsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const { records, totalReferred, completedFirstOrder, rewardsEarned, claimReward } = useReferral();

  const handleClaim = (recordId: string) => {
    const success = claimReward(recordId);
    if (success) {
      toast({ title: lang === "zh" ? "獎賞已領取！HK$50 優惠券已添加。" : "Reward claimed! HK$50 coupon added." });
    }
  };

  const statusConfig = {
    pending: { label: lang === "zh" ? "等待中" : "Pending", icon: Clock, color: "text-warning bg-warning/10" },
    claimable: { label: lang === "zh" ? "可領取" : "Claimable", icon: Gift, color: "text-primary bg-primary/10" },
    claimed: { label: lang === "zh" ? "已領取" : "Claimed", icon: CheckCircle2, color: "text-success bg-success/10" },
  };

  return (
    <div className="animate-fade-in p-4 pt-5 pb-28">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">
          {lang === "zh" ? "推薦紀錄" : "Referral Records"}
        </h1>
      </div>

      {/* Summary stats */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { value: totalReferred, label: lang === "zh" ? "總推薦" : "Total Referred", icon: UserCheck, color: "text-primary" },
          { value: completedFirstOrder, label: lang === "zh" ? "完成首單" : "First Orders", icon: Award, color: "text-success" },
          { value: rewardsEarned, label: lang === "zh" ? "獎賞已領" : "Rewards Claimed", icon: Gift, color: "text-warning" },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center p-3 text-center">
              <stat.icon className={`mb-1 h-5 w-5 ${stat.color}`} />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reward rule */}
      <Card className="mb-5 border-0 bg-gradient-to-r from-primary/5 to-transparent shadow-sm">
        <CardContent className="flex items-center gap-3 p-4">
          <Gift className="h-5 w-5 shrink-0 text-primary" />
          <p className="text-xs text-foreground">
            {lang === "zh"
              ? "每位推薦的朋友完成首張訂單後，您將獲得一張 HK$50 無門檻優惠券作為獎賞。"
              : "For each referred friend who completes their first order, you'll receive a HK$50 no-threshold coupon as a reward."}
          </p>
        </CardContent>
      </Card>

      {/* Records list */}
      {records.length > 0 ? (
        <div className="space-y-3">
          {records.map((record) => {
            const config = statusConfig[record.rewardStatus];
            const StatusIcon = config.icon;
            return (
              <Card key={record.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-bold text-foreground">{record.friendName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{record.friendMasked}</p>
                        <p className="text-xs text-muted-foreground">
                          {lang === "zh" ? "註冊於 " : "Registered "}
                          {record.registeredAt}
                        </p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      {record.firstOrderCompleted ? (
                        <UserCheck className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <UserX className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className={record.firstOrderCompleted ? "text-success" : "text-muted-foreground"}>
                        {record.firstOrderCompleted
                          ? `${lang === "zh" ? "首單完成 " : "First order "}${record.firstOrderDate}`
                          : lang === "zh" ? "尚未完成首單" : "First order pending"}
                      </span>
                    </div>
                  </div>

                  {record.rewardStatus === "claimable" && (
                    <Button size="sm" className="mt-3 w-full" onClick={() => handleClaim(record.id)}>
                      <Gift className="mr-1 h-3.5 w-3.5" />
                      {lang === "zh" ? "領取 HK$50 優惠券獎賞" : "Claim HK$50 Coupon Reward"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <UserCheck className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">
            {lang === "zh" ? "暫無推薦紀錄" : "No referral records yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === "zh" ? "分享您的推薦連結開始邀請朋友" : "Share your referral link to start inviting friends"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReferralRecordsPage;
