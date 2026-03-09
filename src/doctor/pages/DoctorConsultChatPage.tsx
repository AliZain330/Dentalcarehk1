import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Send, Image, Clock, AlertTriangle, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

type ChatStatus = "waiting" | "active" | "expiring" | "ended" | "completed";

interface ChatMessage {
  id: string;
  sender: "doctor" | "patient";
  type: "text" | "image";
  content: string;
  time: string;
}

const TOTAL_MINUTES = 30;

const mockMessages: ChatMessage[] = [
  { id: "m1", sender: "patient", type: "text", content: "Hello doctor, I've been having pain on my upper left molar for about 3 days.", time: "14:01" },
  { id: "m2", sender: "patient", type: "image", content: "[Image placeholder]", time: "14:02" },
  { id: "m3", sender: "doctor", type: "text", content: "I can see. Can you describe the pain — is it sharp or dull? Does it worsen when biting?", time: "14:03" },
  { id: "m4", sender: "patient", type: "text", content: "It's a sharp pain, especially when I bite down or drink cold water.", time: "14:04" },
];

const DoctorConsultChatPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("active");
  const [remainingMin, setRemainingMin] = useState(TOTAL_MINUTES - 5);
  const [showApiNotice, setShowApiNotice] = useState(false);

  // Simulate timer countdown
  useEffect(() => {
    if (status !== "active" && status !== "expiring") return;
    const interval = setInterval(() => {
      setRemainingMin((prev) => {
        if (prev <= 1) { setStatus("ended"); return 0; }
        if (prev <= 5 && status !== "expiring") setStatus("expiring");
        return prev - 1;
      });
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!input.trim() || status === "ended" || status === "completed") return;
    setMessages((prev) => [...prev, { id: `d${Date.now()}`, sender: "doctor", type: "text", content: input.trim(), time: new Date().toTimeString().slice(0, 5) }]);
    setInput("");
  };

  const statusConfig: Record<ChatStatus, { label: string; cls: string }> = {
    waiting: { label: isEn ? "Waiting to Start" : "等待開始", cls: "bg-muted text-muted-foreground" },
    active: { label: isEn ? "In Consultation" : "諮詢中", cls: "bg-info/10 text-info" },
    expiring: { label: isEn ? "Expiring Soon" : "即將結束", cls: "bg-warning/10 text-warning" },
    ended: { label: isEn ? "Consultation Ended" : "諮詢已結束", cls: "bg-destructive/10 text-destructive" },
    completed: { label: isEn ? "Completed" : "已完成", cls: "bg-success/10 text-success" },
  };
  const st = statusConfig[status];

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-foreground truncate">{isEn ? "Consultation Chat" : "諮詢對話"}</h1>
            <p className="text-xs text-muted-foreground">Alice L. · #{orderId?.slice(0, 8)}</p>
          </div>
          <Badge variant="outline" className={st.cls}>{st.label}</Badge>
        </div>
        {/* Timer & count */}
        <div className="mx-auto mt-2 flex max-w-lg items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{isEn ? `${remainingMin} min remaining` : `剩餘 ${remainingMin} 分鐘`}</span>
          <span>{messages.length} {isEn ? "messages" : "條訊息"}</span>
        </div>
      </div>

      {/* Expiring banner */}
      {status === "expiring" && (
        <div className="mx-auto w-full max-w-lg bg-warning/10 px-4 py-2 text-center text-xs text-warning flex items-center justify-center gap-1">
          <AlertTriangle className="h-3 w-3" />{isEn ? "Consultation will end in less than 5 minutes" : "諮詢將在 5 分鐘內結束"}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-lg space-y-3">
          {status === "waiting" && (
            <div className="py-12 text-center text-sm text-muted-foreground">{isEn ? "Waiting for consultation to start..." : "等待諮詢開始..."}</div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] space-y-1 ${msg.sender === "doctor" ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-3.5 py-2.5 text-sm ${msg.sender === "doctor" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                  {msg.type === "image" ? (
                    <div className="flex items-center gap-2 text-xs opacity-80"><Image className="h-4 w-4" />{isEn ? "Image attachment" : "圖片附件"}</div>
                  ) : msg.content}
                </div>
                <p className={`text-[10px] text-muted-foreground ${msg.sender === "doctor" ? "text-right" : "text-left"}`}>{msg.time}</p>
              </div>
            </div>
          ))}

          {status === "ended" && (
            <div className="mx-auto my-4 max-w-xs rounded-xl bg-muted p-4 text-center">
              <p className="text-sm font-semibold text-foreground">{isEn ? "Consultation Ended" : "諮詢已結束"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{isEn ? "Please write a diagnosis report." : "請撰寫診斷報告。"}</p>
              <Button size="sm" className="mt-3" onClick={() => navigate(`/doctor/consult/${orderId}/report`)}>
                <FileText className="mr-1.5 h-3.5 w-3.5" />{isEn ? "Write Report" : "撰寫報告"}
              </Button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card px-4 py-3 safe-bottom">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setShowApiNotice(true)} disabled={status === "ended" || status === "completed"}>
            <Image className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(`/doctor/consult/${orderId}/video`)} disabled={status === "ended" || status === "completed"}>
            <Video className="h-5 w-5 text-info" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={status === "ended" || status === "completed" ? (isEn ? "Consultation ended" : "諮詢已結束") : (isEn ? "Type a message..." : "輸入訊息...")}
            disabled={status === "ended" || status === "completed"}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || status === "ended" || status === "completed"}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {/* Quick actions for demo */}
        {status === "active" && (
          <div className="mx-auto mt-2 flex max-w-lg gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setStatus("expiring")}>{isEn ? "⏩ Simulate Expiring" : "⏩ 模擬即將結束"}</Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => { setStatus("ended"); setRemainingMin(0); }}>{isEn ? "⏩ End Now" : "⏩ 立即結束"}</Button>
          </div>
        )}
      </div>

      {/* API notice dialog */}
      {showApiNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowApiNotice(false)}>
          <Card className="max-w-sm" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <ApiPlaceholderNotice feature={isEn ? "Image Upload" : "圖片上傳"} />
              <Button className="mt-4 w-full" variant="outline" onClick={() => setShowApiNotice(false)}>{isEn ? "Close" : "關閉"}</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorConsultChatPage;
