import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

const ComplaintPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const cs = t.customerService;
  const [type, setType] = useState("appointment");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const types = [
    { value: "appointment", label: cs.typeAppointment },
    { value: "payment", label: cs.typePayment },
    { value: "consultation", label: cs.typeConsultation },
    { value: "other", label: cs.typeOther },
  ];

  const handleSubmit = () => {
    if (!content.trim()) return;
    // TODO: Integrate real complaint submission API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center p-8 pt-20 text-center">
        <CheckCircle className="mb-4 h-16 w-16 text-primary" />
        <h2 className="text-lg font-bold text-foreground">{cs.complaintSuccess}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{cs.complaintSuccessDesc}</p>
        <Button className="mt-6" onClick={() => navigate(-1)}>{t.common.back}</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-4 pt-5 pb-8">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{cs.complaintTitle}</h1>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">{cs.complaintDesc}</p>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">{cs.complaintType}</label>
            <div className="flex flex-wrap gap-2">
              {types.map((tp) => (
                <button
                  key={tp.value}
                  onClick={() => setType(tp.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${type === tp.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >{tp.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{cs.complaintContent}</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={cs.complaintContentPlaceholder} className="min-h-[100px]" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">{cs.complaintImages}</label>
            <button
              onClick={() => toast({ title: "Image Upload API key not added yet" })}
              className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border hover:bg-muted"
            >
              <Camera className="h-6 w-6 text-muted-foreground" />
            </button>
            <ApiPlaceholderNotice service="Image Upload" className="mt-2" />
          </div>
        </CardContent>
      </Card>
      <Button className="w-full" onClick={handleSubmit} disabled={!content.trim()}>{cs.complaintSubmit}</Button>
    </div>
  );
};

export default ComplaintPage;
