import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, FileText, Save, Send, ChevronRight, CheckCircle2, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type ReportStatus = "draft" | "submitted";

interface DiagnosisTemplate {
  id: string;
  title: { en: string; zh: string };
  diagnosis: { en: string; zh: string };
  medication: { en: string; zh: string };
  precautions: { en: string; zh: string };
}

const templates: DiagnosisTemplate[] = [
  {
    id: "t1",
    title: { en: "Dental Caries (Cavity)", zh: "齲齒（蛀牙）" },
    diagnosis: { en: "Patient presents with dental caries on the affected tooth. Cavity observed on visual and radiographic examination.", zh: "患者受影響牙齒出現齲齒。視診及X光檢查觀察到蛀洞。" },
    medication: { en: "- Desensitizing toothpaste (e.g., Sensodyne) twice daily\n- Chlorhexidine mouthwash 0.12% for 7 days\n- Ibuprofen 400mg as needed for pain", zh: "- 抗敏感牙膏（如舒適達）每日兩次\n- 氯己定漱口水 0.12% 使用7天\n- 布洛芬 400mg 按需止痛" },
    precautions: { en: "- Avoid extremely hot or cold food/drinks\n- Schedule follow-up for filling treatment within 2 weeks\n- Maintain oral hygiene with soft-bristle brush", zh: "- 避免過冷過熱食物飲品\n- 2週內預約補牙治療\n- 使用軟毛牙刷保持口腔衛生" },
  },
  {
    id: "t2",
    title: { en: "Gingivitis", zh: "牙齦炎" },
    diagnosis: { en: "Patient shows signs of gingivitis with inflamed and bleeding gums. Plaque accumulation observed along gumline.", zh: "患者出現牙齦炎症狀，牙齦紅腫出血。牙齦線沿線可見牙菌斑堆積。" },
    medication: { en: "- Antiseptic mouthwash twice daily after brushing\n- Vitamin C supplement 500mg daily\n- Metronidazole 200mg TID for 5 days if bacterial infection suspected", zh: "- 抗菌漱口水每日兩次（刷牙後使用）\n- 維生素C 500mg 每日一次\n- 若懷疑細菌感染：甲硝唑 200mg 每日三次，共5天" },
    precautions: { en: "- Use interdental brushes or floss daily\n- Schedule professional cleaning within 1 week\n- Avoid smoking", zh: "- 每日使用牙間刷或牙線\n- 1週內預約專業潔牙\n- 戒煙" },
  },
  {
    id: "t3",
    title: { en: "Tooth Sensitivity", zh: "牙齒敏感" },
    diagnosis: { en: "Patient reports sensitivity to cold, hot, and sweet stimuli. Examination reveals enamel erosion and/or gum recession.", zh: "患者反映對冷、熱、甜等刺激敏感。檢查顯示琺瑯質磨蝕及/或牙齦退縮。" },
    medication: { en: "- Desensitizing toothpaste (potassium nitrate) twice daily\n- Fluoride varnish application recommended\n- Avoid acidic foods and beverages", zh: "- 抗敏感牙膏（含硝酸鉀）每日兩次\n- 建議塗氟治療\n- 避免酸性食物及飲品" },
    precautions: { en: "- Use soft-bristle toothbrush\n- Avoid aggressive brushing\n- Follow up in 4 weeks to assess improvement", zh: "- 使用軟毛牙刷\n- 避免過度用力刷牙\n- 4週後覆診評估改善情況" },
  },
];

const DoctorDiagnosisReportPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";

  const [reportStatus, setReportStatus] = useState<ReportStatus>("draft");
  const [showTemplates, setShowTemplates] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [medication, setMedication] = useState("");
  const [precautions, setPrecautions] = useState("");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const applyTemplate = (t: DiagnosisTemplate) => {
    setDiagnosis(t.diagnosis[lang]);
    setMedication(t.medication[lang]);
    setPrecautions(t.precautions[lang]);
    setShowTemplates(false);
    toast({ title: isEn ? `Template "${t.title[lang]}" applied` : `已套用模板「${t.title[lang]}」` });
  };

  const handleSaveDraft = () => {
    toast({ title: isEn ? "Draft saved" : "草稿已儲存" });
  };

  const handleSubmit = () => {
    if (!diagnosis.trim() || !medication.trim()) {
      toast({ title: isEn ? "Please complete required fields" : "請填寫必填欄位", variant: "destructive" });
      return;
    }
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    setReportStatus("submitted");
    setShowSubmitConfirm(false);
    toast({ title: isEn ? "Diagnosis report submitted" : "診斷報告已提交" });
  };

  if (reportStatus === "submitted") {
    return (
      <div className="animate-fade-in flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="mx-auto max-w-sm text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{isEn ? "Report Submitted" : "報告已提交"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Your diagnosis report has been submitted and will be visible to the patient and institution." : "您的診斷報告已提交，患者和機構將可查閱。"}</p>

          <Card className="border-0 shadow-sm text-left">
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{isEn ? "DIAGNOSIS" : "診斷結果"}</p>
                <p className="mt-1 text-sm text-foreground whitespace-pre-line">{diagnosis}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{isEn ? "MEDICATION" : "用藥建議"}</p>
                <p className="mt-1 text-sm text-foreground whitespace-pre-line">{medication}</p>
              </div>
              {precautions && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{isEn ? "PRECAUTIONS" : "注意事項"}</p>
                  <p className="mt-1 text-sm text-foreground whitespace-pre-line">{precautions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate(`/doctor/orders/consult/${orderId}`)}>{isEn ? "View Order" : "查看訂單"}</Button>
            <Button className="flex-1" onClick={() => navigate("/doctor/orders")}>{isEn ? "Back to Orders" : "返回訂單"}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-32">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{isEn ? "Diagnosis Report" : "診斷報告"}</h1>
            <p className="text-xs text-muted-foreground">#{orderId?.slice(0, 8)}</p>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">{isEn ? "Draft" : "草稿"}</Badge>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 p-4">
        {/* Template selector */}
        <Card className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => setShowTemplates(true)}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{isEn ? "Use a Template" : "使用模板"}</p>
              <p className="text-xs text-muted-foreground">{isEn ? "Quick-fill from predefined templates" : "從預設模板快速填寫"}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            {isEn ? "Diagnosis Result" : "診斷結果"} <span className="text-destructive">*</span>
          </label>
          <Textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder={isEn ? "Describe the diagnosis..." : "描述診斷結果..."} className="min-h-[100px]" />
        </div>

        {/* Medication */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            {isEn ? "Medication Advice" : "用藥建議"} <span className="text-destructive">*</span>
          </label>
          <Textarea value={medication} onChange={(e) => setMedication(e.target.value)} placeholder={isEn ? "List medications and dosage..." : "列出藥物及劑量..."} className="min-h-[100px]" />
        </div>

        {/* Precautions */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">{isEn ? "Precautions" : "注意事項"}</label>
          <Textarea value={precautions} onChange={(e) => setPrecautions(e.target.value)} placeholder={isEn ? "Any precautions or follow-up advice..." : "注意事項或覆診建議..."} className="min-h-[80px]" />
        </div>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg flex gap-2 px-4 py-3">
          <Button variant="outline" className="flex-1" onClick={handleSaveDraft}>
            <Save className="mr-1.5 h-4 w-4" />{isEn ? "Save Draft" : "儲存草稿"}
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            <Send className="mr-1.5 h-4 w-4" />{isEn ? "Submit Report" : "提交報告"}
          </Button>
        </div>
      </div>

      {/* Templates dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isEn ? "Diagnosis Templates" : "診斷模板"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {templates.map((t) => (
              <Card key={t.id} className="cursor-pointer border shadow-sm hover:shadow-md transition-shadow" onClick={() => applyTemplate(t)}>
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-foreground">{t.title[lang]}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{t.diagnosis[lang]}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-[10px]">{isEn ? "Diagnosis" : "診斷"}</Badge>
                    <Badge variant="outline" className="text-[10px]">{isEn ? "Medication" : "用藥"}</Badge>
                    <Badge variant="outline" className="text-[10px]">{isEn ? "Precautions" : "注意事項"}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit confirmation */}
      <Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{isEn ? "Submit Report?" : "提交報告？"}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{isEn ? "Once submitted, the diagnosis report will be visible to the patient and institution. This action cannot be undone." : "提交後，診斷報告將對患者和機構可見。此操作不可撤銷。"}</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowSubmitConfirm(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button className="flex-1" onClick={confirmSubmit}>{isEn ? "Confirm Submit" : "確認提交"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDiagnosisReportPage;
