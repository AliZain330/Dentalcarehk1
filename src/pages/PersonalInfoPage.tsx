import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Plus, Pencil, Trash2, MapPin, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

interface Address {
  id: string;
  label: "home" | "work" | "other";
  area: string;
  detail: string;
}

const mockAddresses: Address[] = [
  { id: "a1", label: "home", area: "Central", detail: "12/F, One Exchange Square, Central, Hong Kong" },
  { id: "a2", label: "work", area: "Tsim Sha Tsui", detail: "8/F, Mira Place One, 132 Nathan Road, TST" },
];

const PersonalInfoPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const pi = t.personalInfo;

  const [nickname, setNickname] = useState("User");
  const [mobile] = useState("+852 9123 4567");
  const [email] = useState("user@example.com");
  const [editing, setEditing] = useState(false);
  const [tempNick, setTempNick] = useState(nickname);

  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState({ label: "home" as Address["label"], area: "", detail: "" });

  const labelMap = { home: pi.home, work: pi.work, other: pi.other };

  const handleSaveNickname = () => {
    if (!tempNick.trim()) return;
    setNickname(tempNick.trim());
    setEditing(false);
    toast({ title: pi.saved });
  };

  const openNewAddr = () => {
    setEditingAddr({ id: "", label: "home", area: "", detail: "" });
    setAddrForm({ label: "home", area: "", detail: "" });
  };
  const openEditAddr = (addr: Address) => {
    setEditingAddr(addr);
    setAddrForm({ label: addr.label, area: addr.area, detail: addr.detail });
  };
  const saveAddr = () => {
    if (!addrForm.detail.trim()) return;
    if (editingAddr?.id) {
      setAddresses((prev) => prev.map((a) => (a.id === editingAddr.id ? { ...a, ...addrForm } : a)));
    } else {
      setAddresses((prev) => [...prev, { id: `a${Date.now()}`, ...addrForm }]);
    }
    setEditingAddr(null);
    toast({ title: pi.saved });
  };
  const deleteAddr = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="animate-fade-in p-4 pt-5 pb-8">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{pi.title}</h1>
      </div>

      {/* Avatar */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
            <button
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-muted border border-border"
              onClick={() => toast({ title: "Avatar", description: "Image Upload API key not added yet" })}
            >
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1">
            <ApiPlaceholderNotice service="Image Upload" className="mb-2" />
          </div>
        </CardContent>
      </Card>

      {/* Info fields */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          {/* Nickname */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-24 text-sm text-muted-foreground">{pi.nickname}</span>
            {editing ? (
              <div className="flex flex-1 items-center gap-2">
                <Input value={tempNick} onChange={(e) => setTempNick(e.target.value)} className="h-8 flex-1" />
                <Button size="sm" onClick={handleSaveNickname}>{pi.save}</Button>
                <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setTempNick(nickname); }}>{pi.cancel}</Button>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm font-medium text-foreground">{nickname}</span>
                <button onClick={() => setEditing(true)}><Pencil className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            )}
          </div>
          {/* Mobile */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-24 text-sm text-muted-foreground">{pi.mobile}</span>
            <span className="text-sm font-medium text-foreground">{mobile}</span>
          </div>
          {/* Email */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="w-24 text-sm text-muted-foreground">{pi.email}</span>
            <span className="text-sm font-medium text-foreground">{email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">{pi.addresses}</h2>
        <Button size="sm" variant="outline" onClick={openNewAddr}><Plus className="mr-1 h-3.5 w-3.5" />{pi.addAddress}</Button>
      </div>

      {addresses.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <MapPin className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">{pi.noAddresses}</p>
            <p className="mt-1 text-xs text-muted-foreground">{pi.noAddressesDesc}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <Card key={addr.id} className="border-0 shadow-sm">
              <CardContent className="flex items-start gap-3 p-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px]">{labelMap[addr.label]}</Badge>
                    <span className="text-xs text-muted-foreground">{addr.area}</span>
                  </div>
                  <p className="text-sm text-foreground">{addr.detail}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditAddr(addr)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button onClick={() => deleteAddr(addr.id)} className="p-1.5 hover:bg-muted rounded"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Address edit modal */}
      {editingAddr && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setEditingAddr(null)}>
          <div className="w-full max-w-lg rounded-t-2xl bg-background p-5 pb-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-base font-semibold text-foreground">{editingAddr.id ? pi.editAddress : pi.addAddress}</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{pi.addressLabel}</label>
                <div className="flex gap-2">
                  {(["home", "work", "other"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setAddrForm((p) => ({ ...p, label: l }))}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${addrForm.label === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >{labelMap[l]}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{pi.addressArea}</label>
                <Input value={addrForm.area} onChange={(e) => setAddrForm((p) => ({ ...p, area: e.target.value }))} placeholder={pi.areaPlaceholder} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{pi.addressDetail}</label>
                <Input value={addrForm.detail} onChange={(e) => setAddrForm((p) => ({ ...p, detail: e.target.value }))} placeholder={pi.addressPlaceholder} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditingAddr(null)}>{pi.cancel}</Button>
                <Button className="flex-1" onClick={saveAddr} disabled={!addrForm.detail.trim()}>{pi.save}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoPage;
