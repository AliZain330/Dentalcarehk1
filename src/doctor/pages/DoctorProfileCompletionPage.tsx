import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Camera, Upload, CheckCircle2, Clock, XCircle, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

type ReviewStatus = "draft" | "pending" | "approved" | "rejected";

const specialtyOptions = (isEn: boolean) => [
  { value: "general", label: isEn ? "General Dentistry" : "一般牙科" },
  { value: "orthodontics", label: isEn ? "Orthodontics" : "矯齒科" },
  { value: "implants", label: isEn ? "Implantology" : "植牙科" },
  { value: "cosmetic", label: isEn ? "Cosmetic Dentistry" : "美容牙科" },
  { value: "endodontics", label: isEn ? "Endodontics" : "牙髓科" },
  { value: "periodontics", label: isEn ? "Periodontics" : "牙周科" },
  { value: "pediatric", label: isEn ? "Pediatric Dentistry" : "兒童牙科" },
  { value: "oral_surgery", label: isEn ? "Oral Surgery" : "口腔外科" },
];

const DoctorProfileCompletionPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const [step, setStep] = useState(1); // 1=profile, 2=credentials, 3=review
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("draft");
  const rejectionReason = isEn ? "Professional certificate image is unclear. Please re-upload a high-resolution scan." : "專業證書圖片不清晰。請重新上傳高解像度掃描件。";

  // Profile fields
  const [nameEn, setNameEn] = useState("");
  const [nameZh, setNameZh] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [yearsExp, setYearsExp] = useState("");
  const [bioEn, setBioEn] = useState("");
  const [bioZh, setBioZh] = useState("");
  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const [certCount, setCertCount] = useState(0);

  const toggleSpecialty = (v: string) => setSpecialties((prev) => prev.includes(v) ? prev.filter((s) => s !== v) : [...prev, v]);

  const canSubmitProfile = nameEn.trim() && nameZh.trim() && specialties.length > 0 && yearsExp;
  const canSubmitCreds = certCount > 0;

  const handleSubmitForReview = () => {
    setReviewStatus("pending");
    setStep(3);
  };

  const handleSimulateApprove = () => setReviewStatus("approved");
  const handleSimulateReject = () => setReviewStatus("rejected");
  const handleRevise = () => { setReviewStatus("draft"); setStep(1); };

  const statusBadge = (status: ReviewStatus) => {
    const map = {
      draft: { label: isEn ? "Draft" : "草稿", className: "bg-muted text-muted-foreground" },
      pending: { label: isEn ? "Pending Review" : "待審核", className: "bg-warning/10 text-warning border-warning/20" },
      approved: { label: isEn ? "Approved" : "已通過", className: "bg-success/10 text-success border-success/20" },
      rejected: { label: isEn ? "Rejected" : "已拒絕", className: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    const s = map[status];
    return <Badge variant="outline" className={s.className}>{s.label}</Badge>;
  };

  // ---- REVIEW STATUS VIEW ----
  if (step === 3) {
    return (
      <div className="flex min-h-screen flex-col p-6">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Profile Review" : "資料審核"}</h1>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          {reviewStatus === "pending" && (
            <>
              <Clock className="h-16 w-16 text-warning" />
              <h2 className="mt-4 text-lg font-bold text-foreground">{isEn ? "Pending Institution Review" : "待機構審核"}</h2>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">{isEn ? "Your profile has been submitted for institution review. You'll be notified once the review is complete." : "您的資料已提交機構審核。審核完成後將會通知您。"}</p>
              <div className="mt-4">{statusBadge("pending")}</div>
              <div className="mt-8 flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSimulateApprove}>{isEn ? "Simulate: Approve" : "模擬：通過"}</Button>
                <Button variant="outline" size="sm" onClick={handleSimulateReject}>{isEn ? "Simulate: Reject" : "模擬：拒絕"}</Button>
              </div>
            </>
          )}
          {reviewStatus === "approved" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-success" />
              <h2 className="mt-4 text-lg font-bold text-foreground">{isEn ? "Profile Approved!" : "資料已通過！"}</h2>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">{isEn ? "Your profile has been approved and synchronized to the platform. You can now start accepting patients." : "您的資料已通過審核並同步至平台。您現在可以開始接診。"}</p>
              <div className="mt-4">{statusBadge("approved")}</div>
              <Button className="mt-6" onClick={() => navigate("/doctor/orders")}>{isEn ? "Enter Dashboard" : "進入工作台"}</Button>
            </>
          )}
          {reviewStatus === "rejected" && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <h2 className="mt-4 text-lg font-bold text-foreground">{isEn ? "Profile Rejected" : "資料被拒絕"}</h2>
              <div className="mt-4">{statusBadge("rejected")}</div>
              <Card className="mt-4 max-w-sm border-destructive/20 bg-destructive/5">
                <CardContent className="p-3 flex gap-2 items-start">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{isEn ? "Rejection Reason" : "拒絕原因"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rejectionReason}</p>
                  </div>
                </CardContent>
              </Card>
              <Button className="mt-6" onClick={handleRevise}>{isEn ? "Revise & Resubmit" : "修改並重新提交"}</Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Step indicators
  const StepIndicator = () => (
    <div className="mb-6 flex items-center justify-center gap-2">
      {[1, 2].map((s) => (
        <React.Fragment key={s}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</div>
          {s < 2 && <div className={`h-0.5 w-8 ${step > s ? "bg-primary" : "bg-muted"}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-sm">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Complete Profile" : "完善資料"}</h1>
        </div>

        <StepIndicator />

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">{isEn ? "Step 1: Personal Information" : "第一步：個人資料"}</p>

            {/* Avatar */}
            <div className="flex justify-center">
              <button onClick={() => { setAvatarUploaded(true); toast({ title: isEn ? "Avatar upload placeholder — API key not added yet" : "頭像上傳佔位 — 尚未添加API密鑰" }); }}
                className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-dashed border-border hover:bg-muted transition-colors">
                {avatarUploaded ? <CheckCircle2 className="h-8 w-8 text-success" /> : <Camera className="h-6 w-6 text-muted-foreground" />}
                <span className="text-[10px] text-muted-foreground mt-0.5">{avatarUploaded ? (isEn ? "Uploaded" : "已上傳") : (isEn ? "Avatar" : "頭像")}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">{isEn ? "Name (EN)" : "姓名（英文）"}</label>
                <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Dr. Chen Wei" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground">{isEn ? "Name (ZH)" : "姓名（中文）"}</label>
                <Input value={nameZh} onChange={(e) => setNameZh(e.target.value)} placeholder="陳偉醫生" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{isEn ? "Years of Experience" : "執業年數"}</label>
              <Input type="number" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} placeholder="15" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">{isEn ? "Specialties *" : "專科 *"}</label>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions(isEn).map((s) => (
                  <button key={s.value} onClick={() => toggleSpecialty(s.value)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${specialties.includes(s.value) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{isEn ? "Bio (EN)" : "簡介（英文）"}</label>
              <Textarea value={bioEn} onChange={(e) => setBioEn(e.target.value)} placeholder={isEn ? "Professional background..." : "專業背景..."} className="min-h-[60px]" maxLength={300} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">{isEn ? "Bio (ZH)" : "簡介（中文）"}</label>
              <Textarea value={bioZh} onChange={(e) => setBioZh(e.target.value)} placeholder="專業背景..." className="min-h-[60px]" maxLength={300} />
            </div>

            <Button className="w-full" disabled={!canSubmitProfile} onClick={() => setStep(2)}>{isEn ? "Next: Credentials" : "下一步：資歷證明"}</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">{isEn ? "Step 2: Professional Credentials" : "第二步：專業資歷證明"}</p>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{isEn ? "Dental Practitioner License" : "牙醫執業許可證"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{isEn ? "Upload a clear scan or photo of your license" : "上傳清晰的執照掃描件或照片"}</p>
                  </div>
                </div>
                <button onClick={() => { setCertCount((c) => c + 1); toast({ title: isEn ? "Upload placeholder — API key not added yet" : "上傳佔位 — 尚未添加API密鑰" }); }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-6 text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4" />
                  {certCount > 0 ? `${certCount} ${isEn ? "file(s) uploaded" : "個檔案已上傳"}` : (isEn ? "Tap to upload" : "點擊上傳")}
                </button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{isEn ? "Specialist Certificate (Optional)" : "專科證書（可選）"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{isEn ? "Upload specialist qualifications if applicable" : "如適用，上傳專科資格證明"}</p>
                  </div>
                </div>
                <button onClick={() => toast({ title: isEn ? "Upload placeholder — API key not added yet" : "上傳佔位 — 尚未添加API密鑰" })}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-6 text-sm text-muted-foreground hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4" />
                  {isEn ? "Tap to upload" : "點擊上傳"}
                </button>
              </CardContent>
            </Card>

            <ApiPlaceholderNotice service={isEn ? "Document Verification" : "文件驗證"} variant="inline" />

            <Button className="w-full" disabled={!canSubmitCreds} onClick={handleSubmitForReview}>{isEn ? "Submit for Review" : "提交審核"}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfileCompletionPage;
