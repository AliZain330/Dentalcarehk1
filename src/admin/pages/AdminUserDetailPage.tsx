import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft, Users, Phone, Mail, Calendar, ClipboardList, Wallet, Star, MessageSquareWarning, Ban, CheckCircle,
} from "lucide-react";
import { adminUsers, type AdminUser } from "../data/adminUserData";
import { getOrdersByUserId } from "../data/adminRelations";
import AdminMetricCard from "../components/AdminMetricCard";
import { toast } from "sonner";

const AdminUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const source = adminUsers.find((u) => u.id === id);
  const [user, setUser] = useState<AdminUser | null>(source ? { ...source } : null);
  const relatedOrders = user ? getOrdersByUserId(user.id) : [];


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{isEn ? "User not found" : "找不到用戶"}</p>
        <Button variant="link" onClick={() => navigate("/admin/users")}>{isEn ? "Back to list" : "返回列表"}</Button>
      </div>
    );
  }

  const handleToggle = () => {
    const ns = user.status === "disabled" ? "active" : "disabled";
    setUser((p) => p ? { ...p, status: ns as AdminUser["status"] } : p);
    toast.success(isEn ? `User ${ns === "disabled" ? "disabled" : "enabled"}` : `用戶已${ns === "disabled" ? "停用" : "啟用"}`);
  };

  const orderStatusBadge = (s: string) => {
    const m: Record<string, { l: string; v: "default" | "secondary" | "destructive" | "outline" }> = {
      completed: { l: isEn ? "Completed" : "已完成", v: "default" },
      confirmed: { l: isEn ? "Confirmed" : "已確認", v: "secondary" },
      pending: { l: isEn ? "Pending" : "待處理", v: "outline" },
      cancelled: { l: isEn ? "Cancelled" : "已取消", v: "destructive" },
    };
    const c = m[s] || m.pending;
    return <Badge variant={c.v}>{c.l}</Badge>;
  };

  const complaintBadge = (s: string) => {
    const m: Record<string, { l: string; v: "default" | "secondary" | "outline" }> = {
      open: { l: isEn ? "Open" : "待處理", v: "secondary" },
      resolved: { l: isEn ? "Resolved" : "已解決", v: "default" },
      closed: { l: isEn ? "Closed" : "已關閉", v: "outline" },
    };
    const c = m[s] || m.open;
    return <Badge variant={c.v}>{c.l}</Badge>;
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium text-foreground">{value || "—"}</p></div>
    </div>
  );

  const EmptyState = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="flex flex-col items-center justify-center py-10">
      <Icon className="h-8 w-8 text-muted-foreground/40 mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}><ArrowLeft className="h-4 w-4" /></Button>
        <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">{user.avatar}</AvatarFallback></Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{isEn ? user.name : user.nameZh}</h1>
            <Badge variant={user.status === "active" ? "default" : "outline"}>
              {user.status === "active" ? (isEn ? "Active" : "活躍") : (isEn ? "Disabled" : "已停用")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.id}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleToggle} className="gap-1">
          {user.status === "disabled" ? <><CheckCircle className="h-3.5 w-3.5" />{isEn ? "Enable" : "啟用"}</> : <><Ban className="h-3.5 w-3.5" />{isEn ? "Disable" : "停用"}</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={ClipboardList} label={isEn ? "Total Orders" : "總訂單"} value={user.totalOrders} />
        <AdminMetricCard icon={Wallet} label={isEn ? "Total Spent" : "總消費"} value={`HK$${user.totalSpent.toLocaleString()}`} />
        <AdminMetricCard icon={Star} label={isEn ? "Reviews" : "評價"} value={user.reviews.length} />
        <AdminMetricCard icon={MessageSquareWarning} label={isEn ? "Complaints" : "投訴"} value={user.complaints.length} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Profile" : "基本資料"}</CardTitle></CardHeader>
          <CardContent className="space-y-1 divide-y divide-border">
            <InfoRow icon={Users} label={isEn ? "Name" : "姓名"} value={`${user.name} / ${user.nameZh}`} />
            <InfoRow icon={Phone} label={isEn ? "Phone" : "電話"} value={user.phone} />
            <InfoRow icon={Mail} label={isEn ? "Email" : "電郵"} value={user.email} />
            <InfoRow icon={Calendar} label={isEn ? "Registered" : "註冊日期"} value={user.registeredAt} />
            <InfoRow icon={Calendar} label={isEn ? "Last Active" : "最後活躍"} value={user.lastActive} />
          </CardContent>
        </Card>

        {/* Behavior tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">{isEn ? "Orders" : "訂單"} ({Math.max(user.orders.length, relatedOrders.length)})</TabsTrigger>
              <TabsTrigger value="reviews">{isEn ? "Reviews" : "評價"} ({user.reviews.length})</TabsTrigger>
              <TabsTrigger value="complaints">{isEn ? "Complaints" : "投訴"} ({user.complaints.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardContent className="p-0">
                  {relatedOrders.length === 0 && user.orders.length === 0 ? (
                    <EmptyState icon={ClipboardList} text={isEn ? "No order history" : "沒有訂單記錄"} />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{isEn ? "Order ID" : "訂單號"}</TableHead>
                          <TableHead>{isEn ? "Type" : "類型"}</TableHead>
                          <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                          <TableHead>{isEn ? "Doctor" : "醫生"}</TableHead>
                          <TableHead className="text-right">{isEn ? "Amount" : "金額"}</TableHead>
                          <TableHead>{isEn ? "Date" : "日期"}</TableHead>
                          <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(relatedOrders.length > 0
                          ? relatedOrders.map((order) => ({
                              id: order.id,
                              type: order.type,
                              institution: order.institution,
                              doctor: order.doctor,
                              amount: order.amount,
                              date: order.createdAt.split(" ")[0],
                              status: order.status === "in_progress" ? "pending" : order.status,
                            }))
                          : user.orders
                        ).map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-mono text-xs">
                              <button className="hover:text-primary hover:underline" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                                {o.id}
                              </button>
                            </TableCell>
                            <TableCell><Badge variant="outline">{o.type === "in_clinic" ? (isEn ? "Clinic" : "到店") : (isEn ? "Consult" : "問診")}</Badge></TableCell>
                            <TableCell>{o.institution}</TableCell>
                            <TableCell>{o.doctor}</TableCell>
                            <TableCell className="text-right">HK${o.amount.toLocaleString()}</TableCell>
                            <TableCell>{o.date}</TableCell>
                            <TableCell className="text-center">{orderStatusBadge(o.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardContent className="p-0">
                  {user.reviews.length === 0 ? (
                    <EmptyState icon={Star} text={isEn ? "No reviews yet" : "沒有評價記錄"} />
                  ) : (
                    <div className="divide-y divide-border">
                      {user.reviews.map((r) => (
                        <div key={r.id} className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{r.institution}</p>
                            <span className="text-xs text-muted-foreground">{r.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                          <p className="text-sm text-foreground">{r.comment}</p>
                          <p className="text-xs text-muted-foreground mt-1">{isEn ? "Order" : "訂單"}: {r.orderId}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="complaints">
              <Card>
                <CardContent className="p-0">
                  {user.complaints.length === 0 ? (
                    <EmptyState icon={MessageSquareWarning} text={isEn ? "No complaints" : "沒有投訴記錄"} />
                  ) : (
                    <div className="divide-y divide-border">
                      {user.complaints.map((c) => (
                        <div key={c.id} className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">{c.subject}</p>
                            {complaintBadge(c.status)}
                          </div>
                          <p className="text-sm text-foreground mb-1">{c.content}</p>
                          <p className="text-xs text-muted-foreground">{c.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
