import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

interface Props {
  label: string;
  description: string;
  uploaded: boolean;
  onUpload: () => void;
}

const DocumentUploadCard: React.FC<Props> = ({ label, description, uploaded, onUpload }) => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        uploaded ? "border-success/50 bg-success/5" : "border-dashed border-border"
      }`}
      onClick={onUpload}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
            uploaded ? "bg-success/10" : "bg-muted"
          }`}
        >
          {uploaded ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <Upload className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          {!uploaded && (
            <div className="mt-2">
              <ApiPlaceholderNotice service={isEn ? "File Upload" : "文件上傳"} variant="inline" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadCard;
