import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Mic, MicOff, Camera, CameraOff, PhoneOff, User, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

type CallStatus = "connecting" | "active" | "ended";

const DoctorVideoConsultPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const [callStatus, setCallStatus] = useState<CallStatus>("connecting");
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [seconds, setSeconds] = useState(0);

  // Auto-connect after 2s
  useEffect(() => {
    if (callStatus === "connecting") {
      const t = setTimeout(() => setCallStatus("active"), 2000);
      return () => clearTimeout(t);
    }
  }, [callStatus]);

  // Timer
  useEffect(() => {
    if (callStatus !== "active") return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleEndCall = () => {
    setCallStatus("ended");
  };

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Top bar */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-white/10"><ArrowLeft className="h-5 w-5 text-white" /></button>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{isEn ? "Video Consultation" : "視頻諮詢"}</p>
          <p className="text-xs text-white/60">Alice L.</p>
        </div>
        {callStatus === "active" && (
          <Badge className="bg-destructive/80 text-white border-0 animate-pulse">
            <Clock className="mr-1 h-3 w-3" />{formatTime(seconds)}
          </Badge>
        )}
      </div>

      {/* Video areas */}
      <div className="relative flex-1">
        {/* Remote video placeholder (patient) */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          {callStatus === "connecting" ? (
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 animate-pulse">
                <User className="h-10 w-10 text-white/40" />
              </div>
              <p className="text-sm text-white/60">{isEn ? "Connecting..." : "連線中..."}</p>
            </div>
          ) : callStatus === "ended" ? (
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                <PhoneOff className="h-10 w-10 text-white/40" />
              </div>
              <p className="text-sm text-white/60">{isEn ? "Call Ended" : "通話已結束"}</p>
              <p className="text-xs text-white/40">{isEn ? "Duration" : "通話時長"}: {formatTime(seconds)}</p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                <User className="h-12 w-12 text-white/30" />
              </div>
              <p className="text-xs text-white/40">{isEn ? "Patient video feed" : "患者視頻畫面"}</p>
            </div>
          )}
        </div>

        {/* Self preview (doctor) */}
        {callStatus !== "ended" && (
          <div className="absolute bottom-4 right-4 h-36 w-24 overflow-hidden rounded-xl border-2 border-white/20 bg-muted/30">
            <div className="flex h-full w-full items-center justify-center">
              {cameraOn ? (
                <div className="text-center">
                  <User className="mx-auto h-8 w-8 text-white/40" />
                  <p className="mt-1 text-[10px] text-white/40">{isEn ? "You" : "您"}</p>
                </div>
              ) : (
                <CameraOff className="h-6 w-6 text-white/30" />
              )}
            </div>
          </div>
        )}

        {/* API notice overlay */}
        <div className="absolute left-4 top-4 max-w-[200px]">
          <Card className="bg-black/60 border-white/10">
            <CardContent className="p-3">
              <ApiPlaceholderNotice service={isEn ? "Video SDK" : "視頻 SDK"} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 bg-black/80 px-4 py-6 safe-bottom">
        <div className="mx-auto flex max-w-xs items-center justify-around">
          <button
            className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${muted ? "bg-destructive" : "bg-white/10 hover:bg-white/20"}`}
            onClick={() => setMuted(!muted)}
            disabled={callStatus === "ended"}
          >
            {muted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
          </button>
          <button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive hover:bg-destructive/90 transition-colors"
            onClick={handleEndCall}
            disabled={callStatus === "ended"}
          >
            <PhoneOff className="h-7 w-7 text-white" />
          </button>
          <button
            className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${!cameraOn ? "bg-destructive" : "bg-white/10 hover:bg-white/20"}`}
            onClick={() => setCameraOn(!cameraOn)}
            disabled={callStatus === "ended"}
          >
            {cameraOn ? <Camera className="h-6 w-6 text-white" /> : <CameraOff className="h-6 w-6 text-white" />}
          </button>
        </div>

        {/* Post-call actions */}
        {callStatus === "ended" && (
          <div className="mx-auto mt-4 flex max-w-xs gap-2">
            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => navigate(`/doctor/consult/${orderId}/chat`)}>
              <MessageSquare className="mr-1.5 h-4 w-4" />{isEn ? "Back to Chat" : "返回對話"}
            </Button>
            <Button className="flex-1" onClick={() => navigate(`/doctor/consult/${orderId}/report`)}>
              {isEn ? "Write Report" : "撰寫報告"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVideoConsultPage;
