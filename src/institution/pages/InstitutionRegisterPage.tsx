import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInstitution } from "../context/InstitutionContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle } from "lucide-react";

const InstitutionRegisterPage: React.FC = () => {
  const { language } = useLanguage();
  const { register, isRegistered, profile } = useInstitution();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEn = language === "en";

  const [form, setForm] = useState({
    name: profile.name || "",
    creditCode: profile.creditCode || "",
    contactPerson: profile.contactPerson || "",
    mobile: profile.mobile || "",
    email: profile.email || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = isEn ? "Institution name is required" : "請輸入機構名稱";
    if (!form.creditCode.trim()) e.creditCode = isEn ? "Credit code is required" : "請輸入統一社會信用代碼";
    if (!form.contactPerson.trim()) e.contactPerson = isEn ? "Contact person is required" : "請輸入聯絡人";
    if (!form.mobile.trim() || !/^\d{8}$/.test(form.mobile)) e.mobile = isEn ? "Valid 8-digit HK number required" : "請輸入有效的8位手機號碼";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = isEn ? "Valid email required" : "請輸入有效電郵";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    register(form);
    toast({ title: isEn ? "Registration submitted!" : "註冊申請已提交！" });
    navigate("/institution/credentials");
  };

  if (isRegistered && profile.reviewStatus !== "draft") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-success mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">
              {isEn ? "Registration Completed" : "註冊已完成"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEn ? "Your institution registration has been submitted. Please proceed to credential review." : "您的機構註冊已提交。請前往資質審核。"}
            </p>
            <Button onClick={() => navigate("/institution/credentials")}>
              {isEn ? "Go to Credentials" : "前往資質審核"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fields = [
    { key: "name", label: isEn ? "Institution Name" : "機構名稱", placeholder: isEn ? "e.g. Bright Smile Dental" : "例如：光明微笑牙科" },
    { key: "creditCode", label: isEn ? "Unified Social Credit Code" : "統一社會信用代碼", placeholder: isEn ? "Enter credit code" : "請輸入信用代碼" },
    { key: "contactPerson", label: isEn ? "Contact Person" : "聯絡人", placeholder: isEn ? "Full name" : "全名" },
    { key: "mobile", label: isEn ? "Mobile Number" : "手機號碼", placeholder: "+852 XXXX XXXX", type: "tel" },
    { key: "email", label: isEn ? "Email" : "電郵", placeholder: "clinic@example.com", type: "email" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Institution Registration" : "機構註冊"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEn ? "Register your dental institution to join the platform" : "註冊您的牙科機構以加入平台"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            {isEn ? "Basic Information" : "基本資訊"}
          </CardTitle>
          <CardDescription>
            {isEn ? "Please fill in your institution details" : "請填寫您的機構資訊"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={f.key}>{f.label} <span className="text-destructive">*</span></Label>
                <Input
                  id={f.key}
                  type={(f as any).type || "text"}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className={errors[f.key] ? "border-destructive" : ""}
                />
                {errors[f.key] && <p className="text-xs text-destructive">{errors[f.key]}</p>}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {isEn ? "Submit Registration" : "提交註冊"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitutionRegisterPage;
