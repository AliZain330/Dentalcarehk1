import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, HelpCircle, MessageSquare, AlertTriangle, ChevronRight, ChevronDown, Send, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

const DoctorSupportPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const [view, setView] = useState<"main" | "faq" | "appeal">("main");
  const [appealText, setAppealText] = useState("");
  const [showUploadNotice, setShowUploadNotice] = useState(false);

  const faqs = [
    { q: { en: "How do I update my consultation pricing?", zh: "如何更新我的諮詢定價？" }, a: { en: "Go to Profile → Service Settings → Pricing. Changes require institution approval.", zh: "前往「我的」→「服務設定」→「定價」。更改需要機構審批。" } },
    { q: { en: "Why is my profile under review?", zh: "為什麼我的資料在審核中？" }, a: { en: "After submitting profile changes, the institution reviews them before publishing to the platform.", zh: "提交資料更改後，機構會在發佈到平台前進行審核。" } },
    { q: { en: "How are platform fees calculated?", zh: "平台費用如何計算？" }, a: { en: "Platform fees are typically 10-15% of the consultation fee, depending on your institution agreement.", zh: "平台費通常為諮詢費的10-15%，取決於您的機構協議。" } },
    { q: { en: "Can I reject a consultation request?", zh: "我可以拒絕諮詢請求嗎？" }, a: { en: "Yes, you can reject with a reason. The patient will be notified and can choose another dentist.", zh: "可以，您可以附上原因拒絕。患者會收到通知並可選擇其他醫生。" } },
    { q: { en: "How do I set up time slots?", zh: "如何設定時段？" }, a: { en: "Go to Service Settings → Time Slots. You can configure available days, hours, and break periods.", zh: "前往「服務設定」→「時段」。您可以設定可用日期、時間及休息時段。" } },
  ];

  const lang = isEn ? "en" : "zh";

  if (view === "faq") {
    return (
      <div className="animate-fade-in">
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <button onClick={() => setView("main")} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
            <h1 className="text-lg font-bold text-foreground">{isEn ? "FAQ" : "常見問題"}</h1>
          </div>
        </div>
        <div className="mx-auto max-w-lg p-4 space-y-2">
          {faqs.map((faq, i) => (
            <Collapsible key={i}>
              <Card className="border-0 shadow-sm">
                <CollapsibleTrigger className="w-full">
                  <CardContent className="p-4 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground text-left flex-1">{faq.q[lang]}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform" />
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 pt-0"><p className="text-sm text-muted-foreground pl-6">{faq.a[lang]}</p></div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    );
  }

  if (view === "appeal") {
    return (
      <div className="animate-fade-in pb-24">
        <div className="border-b border-border bg-card px-4 py-3">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <button onClick={() => setView("main")} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
            <h1 className="text-lg font-bold text-foreground">{isEn ? "Submit Feedback" : "提交反饋"}</h1>
          </div>
        </div>
        <div className="mx-auto max-w-lg p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{isEn ? "Subject" : "主題"}</label>
            <Input placeholder={isEn ? "Brief description of your issue" : "簡要描述您的問題"} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{isEn ? "Details" : "詳情"}</label>
            <Textarea value={appealText} onChange={(e) => setAppealText(e.target.value)} placeholder={isEn ? "Please describe in detail..." : "請詳細描述..."} className="min-h-[120px]" maxLength={1000} />
            <p className="text-xs text-muted-foreground text-right">{appealText.length}/1000</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{isEn ? "Attachments" : "附件"}</label>
            <Card className="cursor-pointer border-dashed" onClick={() => setShowUploadNotice(true)}>
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <Image className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{isEn ? "Tap to upload images" : "點擊上傳圖片"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
          <div className="mx-auto max-w-lg px-4 py-3">
            <Button className="w-full" onClick={() => { toast({ title: isEn ? "Feedback submitted" : "反饋已提交" }); setView("main"); }}>
              <Send className="mr-1.5 h-4 w-4" />{isEn ? "Submit" : "提交"}
            </Button>
          </div>
        </div>
        {showUploadNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUploadNotice(false)}>
            <Card className="max-w-sm" onClick={(e) => e.stopPropagation()}>
              <CardContent className="p-6">
                <ApiPlaceholderNotice service={isEn ? "File Upload" : "檔案上傳"} />
                <Button className="mt-4 w-full" variant="outline" onClick={() => setShowUploadNotice(false)}>{isEn ? "Close" : "關閉"}</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Customer Service" : "客服中心"}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-lg p-4 space-y-2">
        {[
          { icon: HelpCircle, label: isEn ? "FAQ" : "常見問題", desc: isEn ? "Common questions and answers" : "常見問題及解答", action: () => setView("faq") },
          { icon: MessageSquare, label: isEn ? "Online Support" : "在線客服", desc: isEn ? "Chat with support team" : "與客服團隊對話", action: () => toast({ title: isEn ? "API key not added yet" : "API 金鑰尚未添加" }) },
          { icon: AlertTriangle, label: isEn ? "Submit Feedback / Appeal" : "提交反饋 / 申訴", desc: isEn ? "Report issues or appeal decisions" : "報告問題或申訴決定", action: () => setView("appeal") },
        ].map((item) => (
          <Card key={item.label} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={item.action}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><item.icon className="h-4 w-4 text-foreground" /></div>
              <div className="flex-1"><p className="text-sm font-semibold text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorSupportPage;
