import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockOnlineDoctors, type ChatMessage } from "@/data/mockData";
import { ArrowLeft, Send, Camera, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MAX_USER_MESSAGES = 10;

const mockDoctorReplies = [
  "I understand. Let me review your description carefully.",
  "Could you provide more detail about when the pain started?",
  "Based on what you've described, I recommend visiting a clinic for an X-ray.",
  "In the meantime, avoid very hot or cold foods.",
  "You can take over-the-counter pain relief if needed.",
  "Is there anything else you'd like to ask?",
];

const ConsultationChatPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { consultations, getMessages, addMessage, getUserMessageCount, completeConsultation } = useConsultation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const order = consultations.find((c) => c.id === orderId);
  const doctor = order ? mockOnlineDoctors.find((d) => d.id === order.doctorId) : null;
  const messages = getMessages(orderId || "");
  const userMsgCount = getUserMessageCount(orderId || "");
  const remaining = MAX_USER_MESSAGES - userMsgCount;

  const [input, setInput] = useState("");
  const [ended, setEnded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (!order || !doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const isEnded = ended || order.status === "completed" || remaining <= 0;

  const handleSend = () => {
    if (!input.trim() || isEnded) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      type: "text",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(orderId!, userMsg);
    setInput("");

    // Simulate doctor reply
    setTimeout(() => {
      const replyIndex = (userMsgCount + 1) % mockDoctorReplies.length;
      const docMsg: ChatMessage = {
        id: `msg-${Date.now()}-doc`,
        sender: "doctor",
        type: "text",
        content: mockDoctorReplies[replyIndex],
        timestamp: new Date().toISOString(),
      };
      addMessage(orderId!, docMsg);

      // End after max messages
      if (userMsgCount + 1 >= MAX_USER_MESSAGES) {
        completeConsultation(orderId!);
        setEnded(true);
      }
    }, 1500);
  };

  const handleImageSend = () => {
    if (isEnded) return;
    const imgMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      type: "image",
      content: "[Image uploaded]",
      timestamp: new Date().toISOString(),
    };
    addMessage(orderId!, imgMsg);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-bold text-primary">{doctor.name[lang].charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{doctor.name[lang]}</p>
            <p className="text-xs text-muted-foreground">{t.consultation.textImage}</p>
          </div>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between bg-secondary px-4 py-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageCircle className="h-3 w-3" />
          <span>{t.consultation.messagesRemaining}: {remaining}/{MAX_USER_MESSAGES}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>24h</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Consultation info */}
        <div className="mx-auto max-w-xs rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
          {t.consultation.chatStarted}
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
              msg.sender === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card text-foreground shadow-sm rounded-bl-md"
            }`}>
              {msg.type === "image" ? (
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="text-sm">{msg.content}</span>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              <p className={`mt-1 text-xs ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isEnded && (
          <div className="mx-auto max-w-xs rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
            {t.consultation.chatEnded}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-3 safe-bottom">
        {isEnded ? (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">{t.consultation.chatEnded}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate(`/consultation/order/${orderId}`)}>
              {t.booking.viewOrder}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={handleImageSend} className="rounded-full p-2 hover:bg-muted"><Camera className="h-5 w-5 text-muted-foreground" /></button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.consultation.typeMessage}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationChatPage;
