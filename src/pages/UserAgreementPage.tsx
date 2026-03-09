import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const UserAgreementPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const content = language === "zh-HK"
    ? [
        "1. 服務條款：使用本平台即表示您同意遵守以下條款。",
        "2. 帳戶責任：您有責任維護帳戶安全並對所有活動負責。",
        "3. 預約政策：預約須按照取消政策進行管理，詳見相關頁面。",
        "4. 付款條款：所有付款均通過安全的第三方支付處理。",
        "5. 免責聲明：本平台提供的資訊僅供參考，不構成醫療建議。",
        "6. 修改條款：我們保留隨時修改這些條款的權利。",
        "7. 聯絡我們：如有任何疑問，請聯繫 support@dentalapp.hk。",
      ]
    : [
        "1. Terms of Service: By using this platform, you agree to comply with the following terms.",
        "2. Account Responsibility: You are responsible for maintaining account security and all activities under your account.",
        "3. Appointment Policy: Appointments must be managed according to the cancellation policy detailed on the relevant pages.",
        "4. Payment Terms: All payments are processed through secure third-party payment providers.",
        "5. Disclaimer: Information provided on this platform is for reference only and does not constitute medical advice.",
        "6. Modifications: We reserve the right to modify these terms at any time.",
        "7. Contact Us: For any inquiries, please contact support@dentalapp.hk.",
      ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{t.userAgreement.title}</h1>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-3">
          {content.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAgreementPage;
