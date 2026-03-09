import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Bot, AlertTriangle, Shield, Clock, Camera, ChevronRight, History, Trash2, CalendarDays, Video, FileText, Share2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

type Step = "input" | "processing" | "result" | "history";
type Urgency = "low" | "moderate" | "high";

interface TriageEntry {
  id: string;
  date: string;
  mainSymptom: string;
  urgency: Urgency;
  category: { en: string; zh: string };
  recommendation: { en: string; zh: string };
}

const painLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const durationOptions = (isEn: boolean) => [
  { value: "today", label: isEn ? "Today" : "今天" },
  { value: "few_days", label: isEn ? "A few days" : "數天" },
  { value: "1_week", label: isEn ? "About 1 week" : "約一週" },
  { value: "2_weeks", label: isEn ? "2+ weeks" : "兩週以上" },
  { value: "1_month", label: isEn ? "1+ month" : "一個月以上" },
];
const areaOptions = (isEn: boolean) => [
  { value: "upper_front", label: isEn ? "Upper Front" : "上前牙" },
  { value: "upper_back", label: isEn ? "Upper Back" : "上後牙" },
  { value: "lower_front", label: isEn ? "Lower Front" : "下前牙" },
  { value: "lower_back", label: isEn ? "Lower Back" : "下後牙" },
  { value: "gums", label: isEn ? "Gums" : "牙齦" },
  { value: "jaw", label: isEn ? "Jaw / TMJ" : "顎骨/顳顎關節" },
  { value: "whole_mouth", label: isEn ? "Whole mouth" : "全口" },
  { value: "unsure", label: isEn ? "Not sure" : "不確定" },
];

const mockHistory: TriageEntry[] = [
  { id: "t1", date: "2026-03-05", mainSymptom: "Toothache lower right", urgency: "moderate", category: { en: "Possible Cavity / Pulpitis", zh: "疑似蛀牙/牙髓炎" }, recommendation: { en: "Book an in-clinic appointment for examination and X-ray", zh: "預約到診檢查及X光" } },
  { id: "t2", date: "2026-02-18", mainSymptom: "Bleeding gums", urgency: "low", category: { en: "Gingivitis / Periodontal Issue", zh: "牙齦炎/牙周問題" }, recommendation: { en: "Schedule a scaling & polishing appointment", zh: "預約潔牙及拋光" } },
];

const AiTriagePage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const [step, setStep] = useState<Step>("input");
  const [mainSymptom, setMainSymptom] = useState("");
  const [painLevel, setPainLevel] = useState(0);
  const [duration, setDuration] = useState("");
  const [area, setArea] = useState("");
  const [swelling, setSwelling] = useState<boolean | null>(null);
  const [bleeding, setBleeding] = useState<boolean | null>(null);
  const [fever, setFever] = useState<boolean | null>(null);
  const [medicalNotes, setMedicalNotes] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<TriageEntry[]>(mockHistory);
  const [detailEntry, setDetailEntry] = useState<TriageEntry | null>(null);

  // Mock result
  const mockUrgency: Urgency = painLevel >= 7 || fever ? "high" : painLevel >= 4 ? "moderate" : "low";
  const mockCategory = mockUrgency === "high"
    ? { en: "Possible Acute Infection / Abscess", zh: "疑似急性感染/膿腫" }
    : mockUrgency === "moderate"
    ? { en: "Possible Cavity / Pulpitis", zh: "疑似蛀牙/牙髓炎" }
    : { en: "Minor Dental Issue / Sensitivity", zh: "輕微牙齒問題/敏感" };
  const mockRecommendation = mockUrgency === "high"
    ? { en: "Seek urgent dental attention as soon as possible. Consider visiting the HKU–SZH Dental Centre emergency service.", zh: "請盡快尋求緊急牙科治療。可考慮前往港大深圳醫院口腔急診。" }
    : mockUrgency === "moderate"
    ? { en: "Book an in-clinic appointment for professional examination and treatment.", zh: "建議預約到診進行專業檢查及治療。" }
    : { en: "Monitor symptoms. Consider an online consultation for professional guidance.", zh: "觀察症狀變化。可考慮線上諮詢獲取專業指導。" };

  const selfCare = mockUrgency === "high"
    ? { en: "Rinse with warm salt water. Take over-the-counter pain relief. Avoid hot/cold foods. Do NOT delay seeking professional care.", zh: "用溫鹽水漱口。服用非處方止痛藥。避免過冷過熱食物。切勿延遲就醫。" }
    : mockUrgency === "moderate"
    ? { en: "Maintain gentle brushing. Avoid biting on the affected side. Use desensitizing toothpaste if sensitive.", zh: "保持輕柔刷牙。避免用患側咀嚼。如有敏感可使用抗敏牙膏。" }
    : { en: "Brush gently twice daily. Floss daily. Use fluoride mouthwash. Monitor for changes.", zh: "每天輕柔刷牙兩次。每天使用牙線。使用含氟漱口水。注意觀察變化。" };

  const canSubmit = mainSymptom.trim().length > 0 && painLevel > 0 && duration && area;

  const handleSubmit = () => {
    setStep("processing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setTimeout(() => setStep("result"), 300); return 100; }
        return p + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const handleSave = () => {
    const entry: TriageEntry = {
      id: `t${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      mainSymptom,
      urgency: mockUrgency,
      category: mockCategory,
      recommendation: mockRecommendation,
    };
    setHistory((prev) => [entry, ...prev]);
    toast({ title: isEn ? "Triage summary saved" : "分診摘要已儲存" });
  };

  const handleReset = () => {
    setStep("input");
    setMainSymptom(""); setPainLevel(0); setDuration(""); setArea("");
    setSwelling(null); setBleeding(null); setFever(null); setMedicalNotes(""); setImageCount(0);
  };

  const urgencyColor = (u: Urgency) => u === "high" ? "text-destructive" : u === "moderate" ? "text-warning" : "text-success";
  const urgencyBg = (u: Urgency) => u === "high" ? "bg-destructive/10 text-destructive border-destructive/20" : u === "moderate" ? "bg-warning/10 text-warning border-warning/20" : "bg-success/10 text-success border-success/20";
  const urgencyLabel = (u: Urgency) => u === "high" ? (isEn ? "High" : "高") : u === "moderate" ? (isEn ? "Moderate" : "中等") : (isEn ? "Low" : "低");

  const YesNoSelector = ({ value, onChange, label }: { value: boolean | null; onChange: (v: boolean) => void; label: string }) => (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex gap-2">
        {[true, false].map((v) => (
          <button key={String(v)} onClick={() => onChange(v)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${value === v ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
            {v ? (isEn ? "Yes" : "是") : (isEn ? "No" : "否")}
          </button>
        ))}
      </div>
    </div>
  );

  // ---- HISTORY VIEW ----
  if (step === "history") {
    return (
      <div className="animate-fade-in p-4 pt-5 pb-24">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => setStep("input")} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Triage History" : "分診記錄"}</h1>
        </div>
        {history.length === 0 ? (
          <div className="py-16 text-center">
            <History className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">{isEn ? "No triage history yet" : "暫無分診記錄"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <Card key={entry.id} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => setDetailEntry(entry)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{entry.mainSymptom}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{entry.category[isEn ? "en" : "zh"]}</p>
                      <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={urgencyBg(entry.urgency)}>{urgencyLabel(entry.urgency)}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail dialog */}
        <Dialog open={!!detailEntry} onOpenChange={() => setDetailEntry(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>{isEn ? "Triage Detail" : "分診詳情"}</DialogTitle></DialogHeader>
            {detailEntry && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={urgencyBg(detailEntry.urgency)}>{isEn ? "Urgency" : "緊急程度"}: {urgencyLabel(detailEntry.urgency)}</Badge>
                  <span className="text-xs text-muted-foreground">{detailEntry.date}</span>
                </div>
                <div><p className="text-xs text-muted-foreground">{isEn ? "Symptom" : "症狀"}</p><p className="text-sm font-medium text-foreground">{detailEntry.mainSymptom}</p></div>
                <div><p className="text-xs text-muted-foreground">{isEn ? "Possible Category" : "可能類別"}</p><p className="text-sm font-medium text-foreground">{detailEntry.category[isEn ? "en" : "zh"]}</p></div>
                <div><p className="text-xs text-muted-foreground">{isEn ? "Recommendation" : "建議"}</p><p className="text-sm text-foreground">{detailEntry.recommendation[isEn ? "en" : "zh"]}</p></div>
                <Card className="border-warning/30 bg-warning/5"><CardContent className="p-3 flex gap-2 items-start"><AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" /><p className="text-xs text-muted-foreground">{isEn ? "This is preliminary AI-assisted guidance only, not a confirmed diagnosis. Please consult a licensed dentist for professional advice." : "此為初步AI輔助指引，並非確診結果。請諮詢持牌牙醫獲取專業意見。"}</p></CardContent></Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ---- PROCESSING VIEW ----
  if (step === "processing") {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center p-8 pt-20">
        <Bot className="h-16 w-16 text-primary animate-pulse" />
        <h2 className="mt-4 text-lg font-bold text-foreground">{isEn ? "Analyzing Symptoms..." : "正在分析症狀..."}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{isEn ? "AI-assisted preliminary assessment" : "AI輔助初步評估"}</p>
        <div className="mt-6 w-full max-w-xs">
          <Progress value={Math.min(progress, 100)} className="h-2" />
        </div>
        <ApiPlaceholderNotice service={isEn ? "AI Triage Engine" : "AI分診引擎"} variant="inline" />
      </div>
    );
  }

  // ---- RESULT VIEW ----
  if (step === "result") {
    return (
      <div className="animate-fade-in p-4 pt-5 pb-24">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={handleReset} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Triage Guidance" : "分診指引"}</h1>
        </div>

        {/* Disclaimer banner */}
        <Card className="mb-4 border-warning/30 bg-warning/5">
          <CardContent className="p-3 flex gap-2 items-start">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">{isEn ? "Preliminary Guidance Only" : "僅供初步參考"}</p>
              <p className="text-xs text-muted-foreground">{isEn ? "This is not a confirmed diagnosis. This AI-assisted guidance is for reference only. Please consult a licensed dentist for professional medical advice." : "此並非確診結果。此AI輔助指引僅供參考。請諮詢持牌牙醫獲取專業醫療意見。"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Urgency */}
        <Card className="mb-3 border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">{isEn ? "Urgency Level" : "緊急程度"}</p>
            <p className={`text-2xl font-bold ${urgencyColor(mockUrgency)}`}>{urgencyLabel(mockUrgency).toUpperCase()}</p>
          </CardContent>
        </Card>

        {/* Category */}
        <Card className="mb-3 border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{isEn ? "Possible Issue Category" : "可能問題類別"}</p>
            <p className="text-base font-semibold text-foreground mt-1">{mockCategory[isEn ? "en" : "zh"]}</p>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="mb-3 border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{isEn ? "Recommended Action" : "建議行動"}</p>
            <p className="text-sm text-foreground mt-1">{mockRecommendation[isEn ? "en" : "zh"]}</p>
          </CardContent>
        </Card>

        {/* Self-care */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{isEn ? "Self-Care Guidance" : "自我護理指引"}</p>
            <p className="text-sm text-foreground mt-1">{selfCare[isEn ? "en" : "zh"]}</p>
          </CardContent>
        </Card>

        {/* Next steps */}
        <h3 className="mb-2 text-sm font-semibold text-foreground">{isEn ? "Next Steps" : "下一步"}</h3>
        <div className="space-y-2 mb-4">
          <Button className="w-full justify-start gap-3" onClick={() => navigate("/consultation/doctors")}>
            <Video className="h-4 w-4" /> {isEn ? "Book Online Consultation" : "預約線上諮詢"}
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3" onClick={() => navigate("/institutions")}>
            <CalendarDays className="h-4 w-4" /> {isEn ? "Book In-Clinic Appointment" : "預約到診治療"}
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3" onClick={handleSave}>
            <FileText className="h-4 w-4" /> {isEn ? "Save Triage Summary" : "儲存分診摘要"}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => toast({ title: isEn ? "API key not added yet" : "尚未添加API密鑰" })}>
            <Share2 className="h-4 w-4" /> {isEn ? "Share Summary" : "分享摘要"}
          </Button>
        </div>

        <ApiPlaceholderNotice service={isEn ? "AI Diagnosis Engine" : "AI診斷引擎"} variant="inline" />
      </div>
    );
  }

  // ---- INPUT VIEW ----
  return (
    <div className="animate-fade-in p-4 pt-5 pb-24">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{isEn ? "AI Symptom Guide" : "AI症狀指引"}</h1>
            <p className="text-xs text-muted-foreground">{isEn ? "Preliminary triage assistance" : "初步分診輔助"}</p>
          </div>
        </div>
        <button onClick={() => setStep("history")} className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80">
          <History className="h-3.5 w-3.5" /> {isEn ? "History" : "記錄"}
        </button>
      </div>

      {/* Disclaimer */}
      <Card className="mb-4 border-info/30 bg-info/5">
        <CardContent className="p-3 flex gap-2 items-start">
          <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{isEn ? "This tool provides preliminary guidance only and is not a substitute for professional dental diagnosis. Always consult a licensed dentist." : "此工具僅提供初步指引，不能替代專業牙科診斷。請務必諮詢持牌牙醫。"}</p>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {/* Main symptom */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">{isEn ? "Main Symptom *" : "主要症狀 *"}</label>
          <Textarea value={mainSymptom} onChange={(e) => setMainSymptom(e.target.value)} placeholder={isEn ? "Describe your dental symptom, e.g. toothache on lower right side..." : "描述您的牙齒症狀，例如右下方牙痛..."} className="min-h-[80px]" maxLength={500} />
          <p className="mt-1 text-xs text-muted-foreground text-right">{mainSymptom.length}/500</p>
        </div>

        {/* Pain level */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">{isEn ? "Pain Level *" : "疼痛程度 *"} <span className="text-xs font-normal text-muted-foreground">(1={isEn ? "mild" : "輕微"}, 10={isEn ? "severe" : "劇烈"})</span></label>
          <div className="flex gap-1.5 flex-wrap">
            {painLevels.map((l) => (
              <button key={l} onClick={() => setPainLevel(l)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${painLevel === l ? (l >= 7 ? "bg-destructive text-destructive-foreground" : l >= 4 ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground") : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">{isEn ? "How Long? *" : "持續多久？ *"}</label>
          <div className="flex flex-wrap gap-2">
            {durationOptions(isEn).map((d) => (
              <button key={d.value} onClick={() => setDuration(d.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${duration === d.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Affected area */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">{isEn ? "Affected Area *" : "受影響區域 *"}</label>
          <div className="grid grid-cols-2 gap-2">
            {areaOptions(isEn).map((a) => (
              <button key={a.value} onClick={() => setArea(a.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${area === a.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Swelling */}
        <YesNoSelector label={isEn ? "Swelling present?" : "有腫脹嗎？"} value={swelling} onChange={setSwelling} />

        {/* Bleeding */}
        <YesNoSelector label={isEn ? "Bleeding present?" : "有出血嗎？"} value={bleeding} onChange={setBleeding} />

        {/* Fever */}
        <YesNoSelector label={isEn ? "Fever or signs of infection?" : "有發燒或感染跡象嗎？"} value={fever} onChange={setFever} />

        {/* Medical history */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">{isEn ? "Medical History Notes" : "病史備註"} <span className="text-xs font-normal text-muted-foreground">({isEn ? "optional" : "可選"})</span></label>
          <Textarea value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} placeholder={isEn ? "Allergies, medications, existing conditions..." : "過敏、正在服用的藥物、現有疾病..."} className="min-h-[60px]" maxLength={300} />
        </div>

        {/* Image upload placeholder */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">{isEn ? "Upload Images" : "上傳圖片"} <span className="text-xs font-normal text-muted-foreground">({isEn ? "optional" : "可選"})</span></label>
          <button onClick={() => { setImageCount((c) => Math.min(c + 1, 3)); toast({ title: isEn ? "Image upload placeholder — API key not added yet" : "圖片上傳佔位 — 尚未添加API密鑰" }); }}
            className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors w-full">
            <Camera className="h-4 w-4" />
            {imageCount > 0 ? `${imageCount} ${isEn ? "image(s) selected" : "張已選"}` : (isEn ? "Tap to upload dental photos" : "點擊上傳牙齒照片")}
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button className="w-full gap-2" disabled={!canSubmit} onClick={handleSubmit}>
            <Bot className="h-4 w-4" /> {isEn ? "Get AI Guidance" : "獲取AI指引"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiTriagePage;
