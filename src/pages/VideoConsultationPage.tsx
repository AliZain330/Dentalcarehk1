import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { ArrowLeft, Mic, MicOff, VideoIcon, VideoOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

const VideoConsultationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { consultations, completeConsultation } = useConsultation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const order = consultations.find((c) => c.id === orderId);
  const doctor = order ? mockOnlineDoctors.find((d) => d.id === order.doctorId) : null;

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callState, setCallState] = useState<"waiting" | "connected" | "ended">("waiting");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Simulate doctor joining after 3s
    const timer = setTimeout(() => setCallState("connected"), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callState !== "connected") return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [callState]);

  if (!order || !doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleEnd = () => {
    setCallState("ended");
    completeConsultation(orderId!);
  };

  return (
    <div className="flex h-screen flex-col bg-foreground/95">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted/20"><ArrowLeft className="h-5 w-5 text-primary-foreground" /></button>
        <h1 className="text-sm font-medium text-primary-foreground">{t.consultation.videoConsultation}</h1>
      </div>

      {/* Video area */}
      <div className="flex flex-1 flex-col items-center justify-center">
        {callState === "waiting" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
              <span className="text-3xl font-bold text-primary">{doctor.name[lang].charAt(0)}</span>
            </div>
            <p className="text-lg font-semibold text-primary-foreground">{doctor.name[lang]}</p>
            <p className="mt-2 animate-pulse text-sm text-primary-foreground/70">{t.consultation.waitingForDoctor}</p>
          </div>
        )}

        {callState === "connected" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 ring-4 ring-success/50">
              <span className="text-4xl font-bold text-primary">{doctor.name[lang].charAt(0)}</span>
            </div>
            <p className="text-lg font-semibold text-primary-foreground">{doctor.name[lang]}</p>
            <p className="mt-1 text-success">{t.consultation.connected}</p>
            <p className="mt-2 font-mono text-2xl text-primary-foreground">{formatTime(elapsed)}</p>
          </div>
        )}

        {callState === "ended" && (
          <div className="text-center">
            <p className="text-lg font-semibold text-primary-foreground">{t.consultation.callEnded}</p>
            <p className="mt-1 text-sm text-primary-foreground/70">{t.consultation.duration}: {formatTime(elapsed)}</p>
            <Button variant="outline" className="mt-6" onClick={() => navigate(`/consultation/order/${orderId}`)}>
              {t.booking.viewOrder}
            </Button>
          </div>
        )}

        {/* Self view placeholder */}
        {callState === "connected" && !cameraOff && (
          <div className="absolute bottom-32 right-4 h-28 w-20 rounded-xl bg-muted/30 border border-primary-foreground/20 flex items-center justify-center">
            <span className="text-xs text-primary-foreground/50">{t.consultation.you}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      {callState !== "ended" && (
        <div className="flex items-center justify-center gap-6 pb-12 safe-bottom">
          <button
            onClick={() => setMuted(!muted)}
            className={`flex h-14 w-14 items-center justify-center rounded-full ${muted ? "bg-destructive" : "bg-primary-foreground/20"}`}
          >
            {muted ? <MicOff className="h-6 w-6 text-primary-foreground" /> : <Mic className="h-6 w-6 text-primary-foreground" />}
          </button>
          <button
            onClick={handleEnd}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive"
          >
            <Phone className="h-7 w-7 rotate-[135deg] text-primary-foreground" />
          </button>
          <button
            onClick={() => setCameraOff(!cameraOff)}
            className={`flex h-14 w-14 items-center justify-center rounded-full ${cameraOff ? "bg-destructive" : "bg-primary-foreground/20"}`}
          >
            {cameraOff ? <VideoOff className="h-6 w-6 text-primary-foreground" /> : <VideoIcon className="h-6 w-6 text-primary-foreground" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoConsultationPage;
