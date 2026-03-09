import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const FAQPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const faq = t.faq;
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(() => [
    { id: "1", q: faq.q1, a: faq.a1 },
    { id: "2", q: faq.q2, a: faq.a2 },
    { id: "3", q: faq.q3, a: faq.a3 },
    { id: "4", q: faq.q4, a: faq.a4 },
    { id: "5", q: faq.q5, a: faq.a5 },
    { id: "6", q: faq.q6, a: faq.a6 },
    { id: "7", q: faq.q7, a: faq.a7 },
    { id: "8", q: faq.q8, a: faq.a8 },
  ], [faq]);

  const filtered = items.filter(
    (item) => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{faq.title}</h1>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.customerService.searchFaq} className="pl-9" />
      </div>
      <div className="space-y-2">
        {filtered.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm overflow-hidden">
            <button onClick={() => setOpenId(openId === item.id ? null : item.id)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
              <span className="flex-1 text-sm font-medium text-foreground">{item.q}</span>
              {openId === item.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {openId === item.id && (
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
