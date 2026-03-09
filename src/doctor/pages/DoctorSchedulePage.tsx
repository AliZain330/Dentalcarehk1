import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User } from "lucide-react";

const DoctorSchedulePage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language !== "zh-HK";

  const today = "2026-03-09";
  const [selectedDate, setSelectedDate] = useState(today);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 2, 9 + i);
    return { date: d.toISOString().split("T")[0], day: d.toLocaleDateString(isEn ? "en" : "zh-HK", { weekday: "short" }), num: d.getDate() };
  });

  const mockSlots = [
    { time: "09:00", patient: "Alice L.", service: isEn ? "Check-up" : "檢查", status: "booked" },
    { time: "09:30", patient: null, service: null, status: "available" },
    { time: "10:00", patient: "Tom K.", service: isEn ? "Scaling" : "潔牙", status: "booked" },
    { time: "10:30", patient: null, service: null, status: "available" },
    { time: "11:00", patient: null, service: null, status: "available" },
    { time: "11:30", patient: "Jenny W.", service: isEn ? "Consultation" : "諮詢", status: "booked" },
    { time: "14:00", patient: null, service: null, status: "available" },
    { time: "14:30", patient: "David C.", service: isEn ? "Filling" : "補牙", status: "booked" },
    { time: "15:00", patient: null, service: null, status: "blocked" },
    { time: "15:30", patient: null, service: null, status: "available" },
  ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{isEn ? "Schedule" : "排班表"}</h1>

      {/* Date selector */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {dates.map((d) => (
          <button key={d.date} onClick={() => setSelectedDate(d.date)}
            className={`flex shrink-0 flex-col items-center rounded-xl px-3 py-2 transition-colors ${selectedDate === d.date ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            <span className="text-xs">{d.day}</span>
            <span className="text-lg font-bold">{d.num}</span>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Card className="border-0 shadow-sm"><CardContent className="p-3 text-center"><p className="text-lg font-bold text-primary">{mockSlots.filter((s) => s.status === "booked").length}</p><p className="text-xs text-muted-foreground">{isEn ? "Booked" : "已預約"}</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 text-center"><p className="text-lg font-bold text-success">{mockSlots.filter((s) => s.status === "available").length}</p><p className="text-xs text-muted-foreground">{isEn ? "Available" : "可用"}</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-3 text-center"><p className="text-lg font-bold text-muted-foreground">{mockSlots.filter((s) => s.status === "blocked").length}</p><p className="text-xs text-muted-foreground">{isEn ? "Blocked" : "已封鎖"}</p></CardContent></Card>
      </div>

      {/* Slots */}
      <div className="space-y-2">
        {mockSlots.map((slot) => (
          <Card key={slot.time} className={`border-0 shadow-sm ${slot.status === "booked" ? "" : slot.status === "blocked" ? "opacity-50" : ""}`}>
            <CardContent className="flex items-center gap-3 p-3">
              <div className="w-14 text-center">
                <p className="text-sm font-semibold text-foreground">{slot.time}</p>
              </div>
              <div className={`h-8 w-1 rounded-full ${slot.status === "booked" ? "bg-primary" : slot.status === "available" ? "bg-success" : "bg-muted-foreground/30"}`} />
              <div className="flex-1">
                {slot.status === "booked" ? (
                  <div>
                    <div className="flex items-center gap-1"><User className="h-3 w-3 text-muted-foreground" /><span className="text-sm font-medium text-foreground">{slot.patient}</span></div>
                    <p className="text-xs text-muted-foreground">{slot.service}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{slot.status === "available" ? (isEn ? "Available" : "可預約") : (isEn ? "Blocked" : "已封鎖")}</p>
                )}
              </div>
              {slot.status === "booked" && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{isEn ? "Booked" : "已約"}</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorSchedulePage;
