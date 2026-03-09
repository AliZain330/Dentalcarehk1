import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicyPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const content = language === "zh-HK"
    ? [
        "1. 資料收集：我們收集您在使用服務時提供的個人資料，包括姓名、聯絡方式和健康記錄。",
        "2. 資料用途：您的資料僅用於提供預約、諮詢和相關醫療服務。",
        "3. 資料安全：我們採用行業標準的安全措施保護您的個人資料。",
        "4. 第三方分享：未經您同意，我們不會與第三方分享您的個人資料，除法律要求外。",
        "5. Cookie 政策：我們使用 Cookie 來改善您的使用體驗。",
        "6. 資料保留：我們會按照適用法規保留您的資料。",
        "7. 聯絡我們：如有任何私隱查詢，請聯繫 privacy@dentalapp.hk。",
      ]
    : [
        "1. Data Collection: We collect personal information you provide when using our services, including name, contact details, and health records.",
        "2. Data Usage: Your information is used solely for appointment booking, consultations, and related dental services.",
        "3. Data Security: We implement industry-standard security measures to protect your personal information.",
        "4. Third-Party Sharing: We do not share your personal data with third parties without your consent, except as required by law.",
        "5. Cookie Policy: We use cookies to enhance your browsing experience.",
        "6. Data Retention: We retain your data in accordance with applicable regulations.",
        "7. Contact Us: For any privacy inquiries, please contact privacy@dentalapp.hk.",
      ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{t.privacyPolicy.title}</h1>
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

export default PrivacyPolicyPage;
