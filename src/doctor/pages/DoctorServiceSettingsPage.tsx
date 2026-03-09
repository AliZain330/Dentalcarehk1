import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Stethoscope, Video, Clock, Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

type PriceStatus = "current" | "pending" | "approved" | "rejected";

const days = ["mon", "tue", "wed", "thu", "fri", "sat"];
const dayLabelsEn: Record<string, string> = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" };
const dayLabelsZh: Record<string, string> = { mon: "星期一", tue: "星期二", wed: "星期三", thu: "星期四", fri: "星期五", sat: "星期六" };

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

const DoctorServiceSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  // Consultation settings
  const [acceptInClinic, setAcceptInClinic] = useState(true);
  const [acceptOnline, setAcceptOnline] = useState(true);

  // Pricing
  const [textPrice, setTextPrice] = useState("200");
  const [videoPrice, setVideoPrice] = useState("380");
  const [textPriceStatus, setTextPriceStatus] = useState<PriceStatus>("current");
  const [videoPriceStatus, setVideoPriceStatus] = useState<PriceStatus>("current");
  const [pendingTextPrice, setPendingTextPrice] = useState("");
  const [pendingVideoPrice, setPendingVideoPrice] = useState("");

  // Schedule
  const [enabledDays, setEnabledDays] = useState<Record<string, boolean>>({ mon: true, tue: true, wed: true, thu: true, fri: true, sat: true });
  const [disabledSlots, setDisabledSlots] = useState<Set<string>>(new Set(["12:00-mon", "12:30-mon"]));
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("14:00");

  const toggleDay = (day: string) => setEnabledDays((prev) => ({ ...prev, [day]: !prev[day] }));
  const toggleSlot = (slot: string, day: string) => {
    const key = `${slot}-${day}`;
    setDisabledSlots((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const priceStatusBadge = (status: PriceStatus) => {
    const map = {
      current: { label: isEn ? "Active" : "生效中", cls: "bg-success/10 text-success border-success/20" },
      pending: { label: isEn ? "Pending Approval" : "待審批", cls: "bg-warning/10 text-warning border-warning/20" },
      approved: { label: isEn ? "Approved" : "已批准", cls: "bg-success/10 text-success border-success/20" },
      rejected: { label: isEn ? "Rejected" : "已拒絕", cls: "bg-destructive/10 text-destructive border-destructive/20" },
    };
    const s = map[status];
    return <Badge variant="outline" className={s.cls}>{s.label}</Badge>;
  };

  const handleSubmitPrice = (type: "text" | "video") => {
    if (type === "text") { setPendingTextPrice(textPrice); setTextPriceStatus("pending"); }
    else { setPendingVideoPrice(videoPrice); setVideoPriceStatus("pending"); }
    toast({ title: isEn ? "Price change submitted for institution approval" : "價格變更已提交機構審批" });
  };

  return (
    <div className="animate-fade-in p-4 pt-5 pb-24">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{isEn ? "Service Settings" : "服務設定"}</h1>
      </div>

      <Tabs defaultValue="consultation" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="consultation" className="flex-1">{isEn ? "Consultation" : "接診設定"}</TabsTrigger>
          <TabsTrigger value="pricing" className="flex-1">{isEn ? "Pricing" : "定價"}</TabsTrigger>
          <TabsTrigger value="schedule" className="flex-1">{isEn ? "Schedule" : "排班"}</TabsTrigger>
        </TabsList>

        {/* ---- CONSULTATION SETTINGS ---- */}
        <TabsContent value="consultation">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{isEn ? "Choose which service types you accept" : "選擇您接受的服務類型"}</p>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Stethoscope className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{isEn ? "In-Clinic Treatment" : "到診治療"}</p>
                    <p className="text-xs text-muted-foreground">{isEn ? "Accept walk-in and booked appointments" : "接受預約及即場就診"}</p>
                  </div>
                </div>
                <Switch checked={acceptInClinic} onCheckedChange={setAcceptInClinic} />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10"><Video className="h-5 w-5 text-info" /></div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{isEn ? "Online Consultation" : "線上諮詢"}</p>
                    <p className="text-xs text-muted-foreground">{isEn ? "Text/image and video consultations" : "圖文及視頻諮詢"}</p>
                  </div>
                </div>
                <Switch checked={acceptOnline} onCheckedChange={setAcceptOnline} />
              </CardContent>
            </Card>

            {!acceptInClinic && !acceptOnline && (
              <Card className="border-warning/30 bg-warning/5"><CardContent className="p-3 flex gap-2 items-center"><AlertCircle className="h-4 w-4 text-warning" /><p className="text-xs text-muted-foreground">{isEn ? "You need at least one service type enabled" : "您需要至少啟用一種服務類型"}</p></CardContent></Card>
            )}
          </div>
        </TabsContent>

        {/* ---- PRICING ---- */}
        <TabsContent value="pricing">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{isEn ? "Pricing takes effect after institution approval" : "定價需經機構審批後生效"}</p>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{isEn ? "Text & Image Consultation" : "圖文諮詢"}</p>
                  {priceStatusBadge(textPriceStatus)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">HK$</span>
                  <Input type="number" value={textPrice} onChange={(e) => setTextPrice(e.target.value)} className="w-28" />
                  <span className="text-xs text-muted-foreground">/ {isEn ? "session" : "次"}</span>
                </div>
                {textPriceStatus === "pending" && <p className="text-xs text-warning">{isEn ? `Pending: HK$${pendingTextPrice}` : `待審批：HK$${pendingTextPrice}`}</p>}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSubmitPrice("text")}>{isEn ? "Submit for Approval" : "提交審批"}</Button>
                  {textPriceStatus === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => { setTextPriceStatus("approved"); toast({ title: isEn ? "Simulated: Approved" : "模擬：已批准" }); }}>{isEn ? "Simulate Approve" : "模擬批准"}</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{isEn ? "Video Consultation" : "視頻諮詢"}</p>
                  {priceStatusBadge(videoPriceStatus)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">HK$</span>
                  <Input type="number" value={videoPrice} onChange={(e) => setVideoPrice(e.target.value)} className="w-28" />
                  <span className="text-xs text-muted-foreground">/ {isEn ? "session" : "次"}</span>
                </div>
                {videoPriceStatus === "pending" && <p className="text-xs text-warning">{isEn ? `Pending: HK$${pendingVideoPrice}` : `待審批：HK$${pendingVideoPrice}`}</p>}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSubmitPrice("video")}>{isEn ? "Submit for Approval" : "提交審批"}</Button>
                  {videoPriceStatus === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => { setVideoPriceStatus("approved"); toast({ title: isEn ? "Simulated: Approved" : "模擬：已批准" }); }}>{isEn ? "Simulate Approve" : "模擬批准"}</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---- SCHEDULE ---- */}
        <TabsContent value="schedule">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{isEn ? "Set your available consultation days and time slots" : "設定您的可用接診日及時段"}</p>

            {/* Break period */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-2">{isEn ? "Break Period" : "休息時段"}</p>
                <div className="flex items-center gap-2">
                  <Input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} className="w-28" />
                  <span className="text-sm text-muted-foreground">—</span>
                  <Input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} className="w-28" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{isEn ? "Slots during break are auto-disabled" : "休息時段內的時間會自動停用"}</p>
              </CardContent>
            </Card>

            {/* Day toggles */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">{isEn ? "Available Days" : "可用日期"}</p>
                <div className="space-y-2">
                  {days.map((day) => (
                    <div key={day} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-sm text-foreground">{isEn ? dayLabelsEn[day] : dayLabelsZh[day]}</span>
                      <Switch checked={enabledDays[day]} onCheckedChange={() => toggleDay(day)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time slot grid */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-2">{isEn ? "Time Slots" : "時段管理"}</p>
                <p className="text-xs text-muted-foreground mb-3">{isEn ? "Tap to enable/disable individual slots" : "點擊以啟用/停用個別時段"}</p>
                <div className="overflow-x-auto">
                  <div className="inline-grid gap-1" style={{ gridTemplateColumns: `80px repeat(${days.filter((d) => enabledDays[d]).length}, 44px)` }}>
                    {/* Header */}
                    <div />
                    {days.filter((d) => enabledDays[d]).map((d) => (
                      <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground">{(isEn ? dayLabelsEn[d] : dayLabelsZh[d]).slice(0, 3)}</div>
                    ))}
                    {/* Slots */}
                    {timeSlots.map((slot) => {
                      const isBreak = slot >= breakStart && slot < breakEnd;
                      return (
                        <React.Fragment key={slot}>
                          <div className="text-xs text-muted-foreground py-1">{slot}</div>
                          {days.filter((d) => enabledDays[d]).map((day) => {
                            const key = `${slot}-${day}`;
                            const disabled = isBreak || disabledSlots.has(key);
                            return (
                              <button key={key} onClick={() => !isBreak && toggleSlot(slot, day)}
                                className={`h-7 w-10 rounded text-[10px] font-medium transition-colors ${isBreak ? "bg-muted/50 text-muted-foreground/30 cursor-not-allowed" : disabled ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-success/10 text-success border border-success/20"}`}>
                                {isBreak ? "—" : disabled ? "Off" : "On"}
                              </button>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => toast({ title: isEn ? "Schedule saved (mock)" : "排班已儲存（模擬）" })}>{isEn ? "Save Schedule" : "儲存排班"}</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorServiceSettingsPage;
