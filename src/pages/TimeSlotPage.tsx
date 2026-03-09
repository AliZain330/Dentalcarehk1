import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBooking } from "@/context/BookingContext";
import { mockInstitutions, generateTimeSlots } from "@/data/mockData";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";

const TimeSlotPage: React.FC = () => {
  const { instId, svcId, docId } = useParams<{ instId: string; svcId: string; docId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const lang = language === "zh-HK" ? "zh" : "en";

  const institution = mockInstitutions.find((i) => i.id === instId);
  const service = institution?.services.find((s) => s.id === svcId);
  const doctor = institution?.doctors.find((d) => d.id === docId);

  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>("");

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const slots = useMemo(() => generateTimeSlots(dateStr), [dateStr]);
  const morningSlots = slots.filter((s) => parseInt(s.time) < 12);
  const afternoonSlots = slots.filter((s) => parseInt(s.time) >= 12);

  if (!institution || !service || !doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.booking.selectTime}</h1>
      </div>

      <div className="space-y-4 px-4">
        {/* Summary */}
        <Card className="border-0 bg-secondary shadow-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${institution.logoColor}`}>
                <span className="text-xs font-bold text-primary-foreground">{institution.logoInitials}</span>
              </div>
              <div className="flex-1 text-xs">
                <p className="font-medium text-foreground">{service.name[lang]}</p>
                <p className="text-muted-foreground">{doctor.name[lang]} · HK${service.price.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => { if (d) { setSelectedDate(d); setSelectedTime(""); } }}
              disabled={(d) => d < new Date()}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Morning slots */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">{t.booking.morning}</h3>
            {morningSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      !slot.available
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                        : selectedTime === slot.time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t.booking.noSlots}</p>
            )}
          </CardContent>
        </Card>

        {/* Afternoon slots */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">{t.booking.afternoon}</h3>
            {afternoonSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      !slot.available
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                        : selectedTime === slot.time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t.booking.noSlots}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button
            className="w-full"
            disabled={!selectedTime}
            onClick={() => {
              setBooking({ date: dateStr, time: selectedTime });
              navigate(`/booking/confirm/${instId}/${svcId}/${docId}`);
            }}
          >
            {t.booking.confirmBooking}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPage;
