import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

const VerificationPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { target?: string; mode?: string; flow?: string } | null;
  const target = state?.target || "user@example.com";
  const flow = state?.flow || "register";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      if (flow === "reset") {
        navigate("/login");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-0 shadow-md">
        <CardContent className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </button>

          <h1 className="mb-2 text-xl font-bold text-foreground">{t.auth.verificationTitle}</h1>
          {/* TODO: Replace with real SMS/Email verification service */}
          <ApiPlaceholderNotice service="SMS / Email Verification" className="mb-4" />
          <p className="mb-6 text-sm text-muted-foreground">
            {t.auth.verificationDesc} <span className="font-medium text-foreground">{target}</span>
          </p>

          {/* OTP Inputs */}
          <div className="mb-6 flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-12 w-10 rounded-lg border border-input bg-background text-center text-lg font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={code.join("").length < 6}
            className="mb-4 w-full"
          >
            {t.auth.verifyCode}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {countdown > 0 ? (
              <>
                {t.auth.resendIn} {countdown}s
              </>
            ) : (
              <button
                onClick={() => setCountdown(60)}
                className="font-medium text-primary hover:underline"
              >
                {t.auth.resendCode}
              </button>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPage;
