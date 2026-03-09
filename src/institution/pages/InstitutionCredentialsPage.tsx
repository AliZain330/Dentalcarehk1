import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInstitution } from "../context/InstitutionContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StepIndicator from "../components/StepIndicator";
import DocumentUploadCard from "../components/DocumentUploadCard";
import ReviewStatusBadge from "../components/ReviewStatusBadge";
import { AlertTriangle, CheckCircle, XCircle, Clock, Send } from "lucide-react";

const InstitutionCredentialsPage: React.FC = () => {
  const { language } = useLanguage();
  const {
    profile, isRegistered, updateProfile, submitForReview,
    simulateApprove, simulateReject, resetToDraft,
  } = useInstitution();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEn = language === "en";

  const [info, setInfo] = useState({
    address: profile.address,
    introduction: profile.introduction,
    businessHours: profile.businessHours,
    contactPhone: profile.contactPhone,
    transport: profile.transport,
  });

  const steps = [
    { label: isEn ? "Registration" : "註冊" },
    { label: isEn ? "Documents" : "文件" },
    { label: isEn ? "Information" : "資訊" },
    { label: isEn ? "Review" : "審核" },
  ];

  const currentStep =
    profile.reviewStatus === "approved" ? 4 :
    profile.reviewStatus === "pending" ? 3 :
    profile.reviewStatus === "rejected" ? 3 : isRegistered ? 1 : 0;

  const handleDocToggle = (key: keyof typeof profile.documents) => {
    updateProfile({
      documents: { ...profile.documents, [key]: !profile.documents[key] },
    });
    toast({ title: isEn ? "Document uploaded (mock)" : "文件已上傳（模擬）" });
  };

  const handleSaveInfo = () => {
    updateProfile(info);
    toast({ title: isEn ? "Information saved" : "資訊已儲存" });
  };

  const handleSubmit = () => {
    updateProfile(info);
    submitForReview();
    toast({ title: isEn ? "Submitted for review" : "已提交審核" });
  };

  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">
              {isEn ? "Registration Required" : "需要先註冊"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEn ? "Please complete institution registration first." : "請先完成機構註冊。"}
            </p>
            <Button onClick={() => navigate("/institution/register")}>
              {isEn ? "Go to Registration" : "前往註冊"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Approved state
  if (profile.reviewStatus === "approved") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <StepIndicator steps={steps} currentStep={4} />
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-success mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">
              {isEn ? "Onboarding Complete!" : "入駐完成！"}
            </h2>
            <p className="text-muted-foreground">
              {isEn
                ? "Your institution has been verified and approved. You can now access the dashboard."
                : "您的機構已通過審核。您現在可以進入管理控制台。"}
            </p>
            <ReviewStatusBadge status="approved" />
            <div className="pt-4">
              <Button size="lg" onClick={() => navigate("/institution/dashboard")}>
                {isEn ? "Enter Dashboard" : "進入控制台"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pending state
  if (profile.reviewStatus === "pending") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <StepIndicator steps={steps} currentStep={3} />
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Clock className="h-16 w-16 text-warning mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold text-foreground">
              {isEn ? "Under Review" : "審核中"}
            </h2>
            <p className="text-muted-foreground">
              {isEn
                ? "Your application is being reviewed. This usually takes 1-3 business days."
                : "您的申請正在審核中。通常需要1-3個工作天。"}
            </p>
            <ReviewStatusBadge status="pending" />

            {/* Simulation controls */}
            <div className="pt-6 border-t border-border space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {isEn ? "Simulation Controls (Dev)" : "模擬控制（開發用）"}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button size="sm" variant="outline" className="text-success border-success/30" onClick={() => simulateApprove()}>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  {isEn ? "Simulate Approve" : "模擬通過"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/30"
                  onClick={() => simulateReject(isEn ? "Business license is unclear. Please re-upload." : "營業執照不清晰，請重新上傳。")}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  {isEn ? "Simulate Reject" : "模擬駁回"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rejected state
  if (profile.reviewStatus === "rejected") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <StepIndicator steps={steps} currentStep={3} />
        <Card>
          <CardContent className="p-8 space-y-4">
            <div className="text-center space-y-3">
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">
                {isEn ? "Application Rejected" : "申請被駁回"}
              </h2>
              <ReviewStatusBadge status="rejected" />
            </div>

            <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
              <p className="text-sm font-medium text-destructive mb-1">
                {isEn ? "Rejection Reason:" : "駁回原因："}
              </p>
              <p className="text-sm text-foreground">{profile.rejectionReason}</p>
            </div>

            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => resetToDraft()}>
                {isEn ? "Revise & Resubmit" : "修改並重新提交"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Draft state — full form
  const documents = [
    { key: "businessLicense" as const, label: isEn ? "Business License" : "營業執照", desc: isEn ? "Upload a clear scan of your business license" : "請上傳清晰的營業執照掃描件" },
    { key: "medicalLicense" as const, label: isEn ? "Medical Institution Practice License" : "醫療機構執業許可證", desc: isEn ? "Required for all dental institutions" : "所有牙科機構必需" },
    { key: "personIdCard" as const, label: isEn ? "Person-in-Charge ID" : "負責人身份證明", desc: isEn ? "ID card of the institution's principal" : "機構負責人身份證件" },
    { key: "otherDocs" as const, label: isEn ? "Other Supporting Documents" : "其他證明文件", desc: isEn ? "Additional certifications or permits" : "其他資質證書或許可證" },
  ];

  const infoFields = [
    { key: "address", label: isEn ? "Address" : "地址", placeholder: isEn ? "Full address" : "完整地址", textarea: false },
    { key: "introduction", label: isEn ? "Introduction" : "機構介紹", placeholder: isEn ? "Brief introduction of your institution..." : "簡要介紹您的機構...", textarea: true },
    { key: "businessHours", label: isEn ? "Business Hours" : "營業時間", placeholder: isEn ? "e.g. Mon-Fri 9:00-18:00" : "例如：週一至週五 9:00-18:00", textarea: false },
    { key: "contactPhone", label: isEn ? "Contact Phone" : "聯絡電話", placeholder: "+852 XXXX XXXX", textarea: false },
    { key: "transport", label: isEn ? "Transportation Guidance" : "交通指引", placeholder: isEn ? "How to get to your clinic..." : "如何到達您的診所...", textarea: true },
  ];

  const allDocsUploaded = Object.values(profile.documents).every(Boolean);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Credential Review" : "資質審核"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEn ? "Upload documents and fill in details to complete verification" : "上傳文件並填寫資料以完成認證"}
        </p>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isEn ? "Qualification Documents" : "資質文件"}</CardTitle>
          <CardDescription>{isEn ? "Upload required institution documents" : "上傳所需的機構文件"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {documents.map((doc) => (
            <DocumentUploadCard
              key={doc.key}
              label={doc.label}
              description={doc.desc}
              uploaded={profile.documents[doc.key]}
              onUpload={() => handleDocToggle(doc.key)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Institution Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isEn ? "Institution Information" : "機構資訊"}</CardTitle>
          <CardDescription>{isEn ? "Fill in your institution details" : "填寫您的機構詳細資料"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {infoFields.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label>{f.label}</Label>
              {f.textarea ? (
                <Textarea
                  placeholder={f.placeholder}
                  value={(info as any)[f.key]}
                  onChange={(e) => setInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
                  rows={3}
                />
              ) : (
                <Input
                  placeholder={f.placeholder}
                  value={(info as any)[f.key]}
                  onChange={(e) => setInfo(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleSaveInfo} className="flex-1">
              {isEn ? "Save Draft" : "儲存草稿"}
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={!allDocsUploaded}>
              <Send className="h-4 w-4 mr-2" />
              {isEn ? "Submit for Review" : "提交審核"}
            </Button>
          </div>

          {!allDocsUploaded && (
            <p className="text-xs text-muted-foreground text-center">
              {isEn ? "Please upload all required documents before submitting" : "請先上傳所有必要文件再提交"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitutionCredentialsPage;
