import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";
import {
  Search, Eye, CheckCircle, XCircle, Clock, Calendar, User, Stethoscope,
  DollarSign, FileText, AlertTriangle, Play, CheckCheck, Ban, MessageSquare, Video,
} from "lucide-react";

type InClinicStatus = "pending_acceptance" | "pending_treatment" | "completed" | "cancelled";
type ConsultStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
type CancelRequestStatus = "none" | "pending" | "approved" | "rejected";

interface InClinicOrder {
  id: string;
  orderNo: string;
  userName: string;
  userPhone: string;
  serviceName: string;
  serviceNameZh: string;
  doctorName: string;
  doctorNameZh: string;
  appointmentDate: string;
  appointmentTime: string;
  amount: number;
  status: InClinicStatus;
  cancelRequest: CancelRequestStatus;
  cancelReason?: string;
  rejectReason?: string;
  createdAt: string;
}

interface ConsultOrder {
  id: string;
  orderNo: string;
  userName: string;
  userPhone: string;
  doctorId: string;
  doctorName: string;
  doctorNameZh: string;
  consultType: "text" | "video";
  symptoms: string;
  amount: number;
  status: ConsultStatus;
  createdAt: string;
}

const mockInClinicOrders: InClinicOrder[] = [
  { id: "o1", orderNo: "IC20240301001", userName: "Alice Wong", userPhone: "9123 4567", serviceName: "Teeth Cleaning", serviceNameZh: "洗牙", doctorName: "Dr. James Wong", doctorNameZh: "黃俊明醫生", appointmentDate: "2024-03-15", appointmentTime: "10:00", amount: 380, status: "pending_acceptance", cancelRequest: "none", createdAt: "2024-03-01 14:30" },
  { id: "o2", orderNo: "IC20240302002", userName: "Bob Chan", userPhone: "9234 5678", serviceName: "Teeth Whitening", serviceNameZh: "牙齒美白", doctorName: "Dr. Emily Chen", doctorNameZh: "陳美玲醫生", appointmentDate: "2024-03-16", appointmentTime: "14:30", amount: 2800, status: "pending_treatment", cancelRequest: "none", createdAt: "2024-03-02 09:15" },
  { id: "o3", orderNo: "IC20240303003", userName: "Carol Lee", userPhone: "9345 6789", serviceName: "Dental Check-up", serviceNameZh: "牙齒檢查", doctorName: "Dr. James Wong", doctorNameZh: "黃俊明醫生", appointmentDate: "2024-03-10", appointmentTime: "11:00", amount: 280, status: "completed", cancelRequest: "none", createdAt: "2024-03-03 16:20" },
  { id: "o4", orderNo: "IC20240304004", userName: "David Lam", userPhone: "9456 7890", serviceName: "Root Canal", serviceNameZh: "根管治療", doctorName: "Dr. Michael Lee", doctorNameZh: "李偉明醫生", appointmentDate: "2024-03-18", appointmentTime: "09:30", amount: 4500, status: "pending_acceptance", cancelRequest: "pending", cancelReason: "Schedule conflict", createdAt: "2024-03-04 11:45" },
  { id: "o5", orderNo: "IC20240305005", userName: "Eva Ng", userPhone: "9567 8901", serviceName: "Orthodontics Consultation", serviceNameZh: "矯齒諮詢", doctorName: "Dr. Emily Chen", doctorNameZh: "陳美玲醫生", appointmentDate: "2024-03-12", appointmentTime: "15:00", amount: 500, status: "cancelled", cancelRequest: "approved", createdAt: "2024-03-05 08:30" },
];

const mockConsultOrders: ConsultOrder[] = [
  { id: "c1", orderNo: "OC20240301001", userName: "Frank Ho", userPhone: "9678 9012", doctorId: "d1", doctorName: "Dr. James Wong", doctorNameZh: "黃俊明醫生", consultType: "text", symptoms: "Tooth sensitivity when eating cold food", amount: 280, status: "pending", createdAt: "2024-03-01 10:00" },
  { id: "c2", orderNo: "OC20240302002", userName: "Grace Yip", userPhone: "9789 0123", doctorId: "d2", doctorName: "Dr. Emily Chen", doctorNameZh: "陳美玲醫生", consultType: "video", symptoms: "Interested in teeth alignment options", amount: 520, status: "accepted", createdAt: "2024-03-02 14:20" },
  { id: "c3", orderNo: "OC20240303003", userName: "Henry Tam", userPhone: "9890 1234", doctorId: "d1", doctorName: "Dr. James Wong", doctorNameZh: "黃俊明醫生", consultType: "text", symptoms: "Gum bleeding when brushing", amount: 280, status: "in_progress", createdAt: "2024-03-03 09:45" },
  { id: "c4", orderNo: "OC20240304004", userName: "Ivy Chow", userPhone: "9901 2345", doctorId: "d2", doctorName: "Dr. Emily Chen", doctorNameZh: "陳美玲醫生", consultType: "video", symptoms: "Follow-up on orthodontics progress", amount: 520, status: "completed", createdAt: "2024-03-04 16:30" },
  { id: "c5", orderNo: "OC20240305005", userName: "Jack Ma", userPhone: "9012 3456", doctorId: "d1", doctorName: "Dr. James Wong", doctorNameZh: "黃俊明醫生", consultType: "text", symptoms: "Wisdom tooth pain", amount: 280, status: "cancelled", createdAt: "2024-03-05 11:15" },
];

const doctorOptions = [
  { id: "all", name: "All Doctors", nameZh: "全部醫生" },
  { id: "d1", name: "Dr. James Wong", nameZh: "黃俊明醫生" },
  { id: "d2", name: "Dr. Emily Chen", nameZh: "陳美玲醫生" },
];

const InstitutionOrdersPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [mainTab, setMainTab] = useState<"inclinic" | "consult">("inclinic");
  const [inClinicOrders, setInClinicOrders] = useState(mockInClinicOrders);
  const [consultOrders, setConsultOrders] = useState(mockConsultOrders);
  
  // In-clinic filters
  const [icSearch, setIcSearch] = useState("");
  const [icStatusFilter, setIcStatusFilter] = useState<"all" | InClinicStatus>("all");
  
  // Consult filters
  const [coSearch, setCoSearch] = useState("");
  const [coStatusFilter, setCoStatusFilter] = useState<"all" | ConsultStatus>("all");
  const [coDoctorFilter, setCoDoctorFilter] = useState("all");
  
  // Detail dialogs
  const [icDetailOrder, setIcDetailOrder] = useState<InClinicOrder | null>(null);
  const [coDetailOrder, setCoDetailOrder] = useState<ConsultOrder | null>(null);
  
  // Cancel rejection
  const [rejectDialogOrder, setRejectDialogOrder] = useState<InClinicOrder | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Filtered lists
  const filteredIcOrders = useMemo(() => {
    let list = inClinicOrders;
    if (icStatusFilter !== "all") list = list.filter(o => o.status === icStatusFilter);
    if (icSearch.trim()) {
      const q = icSearch.toLowerCase();
      list = list.filter(o => o.orderNo.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q));
    }
    return list;
  }, [inClinicOrders, icStatusFilter, icSearch]);

  const filteredCoOrders = useMemo(() => {
    let list = consultOrders;
    if (coStatusFilter !== "all") list = list.filter(o => o.status === coStatusFilter);
    if (coDoctorFilter !== "all") list = list.filter(o => o.doctorId === coDoctorFilter);
    if (coSearch.trim()) {
      const q = coSearch.toLowerCase();
      list = list.filter(o => o.orderNo.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q));
    }
    return list;
  }, [consultOrders, coStatusFilter, coDoctorFilter, coSearch]);

  // Status helpers
  const icStatusConfig: Record<InClinicStatus, { label: string; labelZh: string; color: string }> = {
    pending_acceptance: { label: "Pending Acceptance", labelZh: "待確認", color: "bg-warning/10 text-warning border-warning/30" },
    pending_treatment: { label: "Pending Treatment", labelZh: "待治療", color: "bg-info/10 text-info border-info/30" },
    completed: { label: "Completed", labelZh: "已完成", color: "bg-success/10 text-success border-success/30" },
    cancelled: { label: "Cancelled", labelZh: "已取消", color: "bg-destructive/10 text-destructive border-destructive/30" },
  };

  const coStatusConfig: Record<ConsultStatus, { label: string; labelZh: string; color: string }> = {
    pending: { label: "Pending", labelZh: "待接受", color: "bg-warning/10 text-warning border-warning/30" },
    accepted: { label: "Accepted", labelZh: "已接受", color: "bg-info/10 text-info border-info/30" },
    in_progress: { label: "In Progress", labelZh: "進行中", color: "bg-primary/10 text-primary border-primary/30" },
    completed: { label: "Completed", labelZh: "已完成", color: "bg-success/10 text-success border-success/30" },
    cancelled: { label: "Cancelled", labelZh: "已取消", color: "bg-destructive/10 text-destructive border-destructive/30" },
  };

  const IcStatusBadge = ({ status }: { status: InClinicStatus }) => {
    const c = icStatusConfig[status];
    return <Badge variant="outline" className={c.color}>{isEn ? c.label : c.labelZh}</Badge>;
  };

  const CoStatusBadge = ({ status }: { status: ConsultStatus }) => {
    const c = coStatusConfig[status];
    return <Badge variant="outline" className={c.color}>{isEn ? c.label : c.labelZh}</Badge>;
  };

  // Actions
  const handleIcAction = (orderId: string, action: "accept" | "start" | "complete") => {
    setInClinicOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      if (action === "accept") return { ...o, status: "pending_treatment" as InClinicStatus };
      if (action === "start") return { ...o, status: "pending_treatment" as InClinicStatus };
      if (action === "complete") return { ...o, status: "completed" as InClinicStatus };
      return o;
    }));
    setIcDetailOrder(prev => {
      if (!prev || prev.id !== orderId) return prev;
      if (action === "accept") return { ...prev, status: "pending_treatment" };
      if (action === "complete") return { ...prev, status: "completed" };
      return prev;
    });
    toast({ title: isEn ? "Order updated" : "訂單已更新" });
  };

  const handleCancelApprove = (orderId: string) => {
    setInClinicOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "cancelled" as InClinicStatus, cancelRequest: "approved" as CancelRequestStatus } : o));
    setIcDetailOrder(prev => prev && prev.id === orderId ? { ...prev, status: "cancelled", cancelRequest: "approved" } : prev);
    toast({ title: isEn ? "Cancellation approved" : "取消已批准", description: isEn ? "Refund will be processed (API not connected)" : "退款將被處理（API未連接）" });
  };

  const handleCancelReject = () => {
    if (!rejectDialogOrder || !rejectReason.trim()) {
      toast({ title: isEn ? "Please provide a reason" : "請提供原因", variant: "destructive" });
      return;
    }
    setInClinicOrders(prev => prev.map(o => o.id === rejectDialogOrder.id ? { ...o, cancelRequest: "rejected" as CancelRequestStatus, rejectReason } : o));
    setIcDetailOrder(prev => prev && prev.id === rejectDialogOrder.id ? { ...prev, cancelRequest: "rejected", rejectReason } : prev);
    setRejectDialogOrder(null);
    setRejectReason("");
    toast({ title: isEn ? "Cancellation rejected" : "取消已拒絕" });
  };

  // Stats
  const icStats = useMemo(() => ({
    pending: inClinicOrders.filter(o => o.status === "pending_acceptance").length,
    treatment: inClinicOrders.filter(o => o.status === "pending_treatment").length,
    completed: inClinicOrders.filter(o => o.status === "completed").length,
    cancelRequests: inClinicOrders.filter(o => o.cancelRequest === "pending").length,
  }), [inClinicOrders]);

  const coStats = useMemo(() => ({
    pending: consultOrders.filter(o => o.status === "pending").length,
    inProgress: consultOrders.filter(o => o.status === "in_progress" || o.status === "accepted").length,
    completed: consultOrders.filter(o => o.status === "completed").length,
  }), [consultOrders]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Order Management" : "訂單管理"}</h1>
        <p className="text-sm text-muted-foreground mt-1">{isEn ? "Manage in-clinic and online consultation orders" : "管理到診及線上諮詢訂單"}</p>
      </div>

      <Tabs value={mainTab} onValueChange={v => setMainTab(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="inclinic" className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {isEn ? "In-Clinic" : "到診預約"}
          </TabsTrigger>
          <TabsTrigger value="consult" className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" /> {isEn ? "Consultation" : "線上諮詢"}
          </TabsTrigger>
        </TabsList>

        {/* In-Clinic Orders Tab */}
        <TabsContent value="inclinic" className="mt-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: isEn ? "Pending" : "待確認", value: icStats.pending, color: "text-warning" },
              { label: isEn ? "Treatment" : "待治療", value: icStats.treatment, color: "text-info" },
              { label: isEn ? "Completed" : "已完成", value: icStats.completed, color: "text-success" },
              { label: isEn ? "Cancel Requests" : "取消請求", value: icStats.cancelRequests, color: "text-destructive" },
            ].map((s, i) => (
              <Card key={i}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
            ))}
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={isEn ? "Search order no. or user..." : "搜尋訂單號或用戶..."} value={icSearch} onChange={e => setIcSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={icStatusFilter} onValueChange={v => setIcStatusFilter(v as any)}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isEn ? "All Status" : "全部狀態"}</SelectItem>
                  <SelectItem value="pending_acceptance">{isEn ? "Pending Acceptance" : "待確認"}</SelectItem>
                  <SelectItem value="pending_treatment">{isEn ? "Pending Treatment" : "待治療"}</SelectItem>
                  <SelectItem value="completed">{isEn ? "Completed" : "已完成"}</SelectItem>
                  <SelectItem value="cancelled">{isEn ? "Cancelled" : "已取消"}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              {filteredIcOrders.length === 0 ? (
                <div className="py-16 text-center">
                  <Calendar className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">{isEn ? "No orders found" : "找不到訂單"}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isEn ? "Order No." : "訂單號"}</TableHead>
                      <TableHead>{isEn ? "User" : "用戶"}</TableHead>
                      <TableHead className="hidden md:table-cell">{isEn ? "Service" : "服務"}</TableHead>
                      <TableHead className="hidden lg:table-cell">{isEn ? "Appointment" : "預約時間"}</TableHead>
                      <TableHead>{isEn ? "Amount" : "金額"}</TableHead>
                      <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIcOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.orderNo}</TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground">{order.userName}</p>
                          <p className="text-xs text-muted-foreground">{order.userPhone}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{isEn ? order.serviceName : order.serviceNameZh}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{order.appointmentDate} {order.appointmentTime}</TableCell>
                        <TableCell className="font-medium">HK${order.amount}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <IcStatusBadge status={order.status} />
                            {order.cancelRequest === "pending" && (
                              <Badge variant="outline" className="bg-destructive/10 text-destructive text-xs block w-fit">{isEn ? "Cancel Request" : "取消請求"}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIcDetailOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Online Consultation Tab */}
        <TabsContent value="consult" className="mt-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: isEn ? "Pending" : "待接受", value: coStats.pending, color: "text-warning" },
              { label: isEn ? "In Progress" : "進行中", value: coStats.inProgress, color: "text-info" },
              { label: isEn ? "Completed" : "已完成", value: coStats.completed, color: "text-success" },
            ].map((s, i) => (
              <Card key={i}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
            ))}
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={isEn ? "Search order no. or user..." : "搜尋訂單號或用戶..."} value={coSearch} onChange={e => setCoSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={coDoctorFilter} onValueChange={setCoDoctorFilter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {doctorOptions.map(d => (
                    <SelectItem key={d.id} value={d.id}>{isEn ? d.name : d.nameZh}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={coStatusFilter} onValueChange={v => setCoStatusFilter(v as any)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isEn ? "All Status" : "全部狀態"}</SelectItem>
                  <SelectItem value="pending">{isEn ? "Pending" : "待接受"}</SelectItem>
                  <SelectItem value="accepted">{isEn ? "Accepted" : "已接受"}</SelectItem>
                  <SelectItem value="in_progress">{isEn ? "In Progress" : "進行中"}</SelectItem>
                  <SelectItem value="completed">{isEn ? "Completed" : "已完成"}</SelectItem>
                  <SelectItem value="cancelled">{isEn ? "Cancelled" : "已取消"}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              {filteredCoOrders.length === 0 ? (
                <div className="py-16 text-center">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">{isEn ? "No consultations found" : "找不到諮詢"}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isEn ? "Order No." : "訂單號"}</TableHead>
                      <TableHead>{isEn ? "User" : "用戶"}</TableHead>
                      <TableHead>{isEn ? "Doctor" : "醫生"}</TableHead>
                      <TableHead className="hidden md:table-cell">{isEn ? "Type" : "類型"}</TableHead>
                      <TableHead>{isEn ? "Amount" : "金額"}</TableHead>
                      <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.orderNo}</TableCell>
                        <TableCell>
                          <p className="font-medium text-foreground">{order.userName}</p>
                          <p className="text-xs text-muted-foreground">{order.userPhone}</p>
                        </TableCell>
                        <TableCell className="text-sm">{isEn ? order.doctorName : order.doctorNameZh}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {order.consultType === "text" ? <MessageSquare className="h-3 w-3 mr-1" /> : <Video className="h-3 w-3 mr-1" />}
                            {order.consultType === "text" ? (isEn ? "Text" : "圖文") : (isEn ? "Video" : "視頻")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">HK${order.amount}</TableCell>
                        <TableCell><CoStatusBadge status={order.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCoDetailOrder(order)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* In-Clinic Order Detail Dialog */}
      <Dialog open={!!icDetailOrder} onOpenChange={() => setIcDetailOrder(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {icDetailOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{isEn ? "Order Details" : "訂單詳情"}</span>
                  <IcStatusBadge status={icDetailOrder.status} />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Order No." : "訂單號"}</p><p className="font-mono">{icDetailOrder.orderNo}</p></div>
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Created" : "下單時間"}</p><p>{icDetailOrder.createdAt}</p></div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">{isEn ? "User Information" : "用戶資訊"}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><User className="h-4 w-4 text-muted-foreground" /></div>
                    <div><p className="font-medium">{icDetailOrder.userName}</p><p className="text-xs text-muted-foreground">{icDetailOrder.userPhone}</p></div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">{isEn ? "Appointment Information" : "預約資訊"}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">{isEn ? "Service" : "服務"}</p><p>{isEn ? icDetailOrder.serviceName : icDetailOrder.serviceNameZh}</p></div>
                    <div><p className="text-xs text-muted-foreground">{isEn ? "Doctor" : "醫生"}</p><p>{isEn ? icDetailOrder.doctorName : icDetailOrder.doctorNameZh}</p></div>
                    <div><p className="text-xs text-muted-foreground">{isEn ? "Date" : "日期"}</p><p>{icDetailOrder.appointmentDate}</p></div>
                    <div><p className="text-xs text-muted-foreground">{isEn ? "Time" : "時間"}</p><p>{icDetailOrder.appointmentTime}</p></div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isEn ? "Payment Amount" : "付款金額"}</span>
                  <span className="text-lg font-bold text-primary">HK${icDetailOrder.amount}</span>
                </div>

                {/* Cancel Request Section */}
                {icDetailOrder.cancelRequest === "pending" && (
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-destructive">{isEn ? "Cancellation Requested" : "用戶申請取消"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{isEn ? "Reason" : "原因"}: {icDetailOrder.cancelReason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleCancelApprove(icDetailOrder.id)}>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Approve" : "批准"}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setRejectDialogOrder(icDetailOrder)}>
                        <XCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Reject" : "拒絕"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isEn ? "Expected refund: " : "預計退款："}<span className="font-medium">HK${icDetailOrder.amount}</span>
                      <span className="ml-2 text-warning">(API key not added yet)</span>
                    </p>
                  </div>
                )}

                {icDetailOrder.cancelRequest === "rejected" && (
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-xs text-muted-foreground">{isEn ? "Cancellation rejected" : "取消已拒絕"}</p>
                    <p className="text-sm mt-1">{isEn ? "Reason" : "原因"}: {icDetailOrder.rejectReason}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {icDetailOrder.status === "pending_acceptance" && icDetailOrder.cancelRequest !== "pending" && (
                  <Button className="w-full" onClick={() => handleIcAction(icDetailOrder.id, "accept")}>
                    <CheckCircle className="h-4 w-4 mr-1" /> {isEn ? "Confirm Acceptance" : "確認接受"}
                  </Button>
                )}
                {icDetailOrder.status === "pending_treatment" && (
                  <Button className="w-full" onClick={() => handleIcAction(icDetailOrder.id, "complete")}>
                    <CheckCheck className="h-4 w-4 mr-1" /> {isEn ? "Mark as Completed" : "標記為已完成"}
                  </Button>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIcDetailOrder(null)}>{isEn ? "Close" : "關閉"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Consultation Order Detail Dialog */}
      <Dialog open={!!coDetailOrder} onOpenChange={() => setCoDetailOrder(null)}>
        <DialogContent className="max-w-lg">
          {coDetailOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{isEn ? "Consultation Details" : "諮詢詳情"}</span>
                  <CoStatusBadge status={coDetailOrder.status} />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Order No." : "訂單號"}</p><p className="font-mono">{coDetailOrder.orderNo}</p></div>
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Created" : "下單時間"}</p><p>{coDetailOrder.createdAt}</p></div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">{isEn ? "User Information" : "用戶資訊"}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><User className="h-4 w-4 text-muted-foreground" /></div>
                    <div><p className="font-medium">{coDetailOrder.userName}</p><p className="text-xs text-muted-foreground">{coDetailOrder.userPhone}</p></div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Doctor" : "醫生"}</p><p>{isEn ? coDetailOrder.doctorName : coDetailOrder.doctorNameZh}</p></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{isEn ? "Type" : "類型"}</p>
                    <Badge variant="outline" className="mt-1">
                      {coDetailOrder.consultType === "text" ? (isEn ? "Text & Image" : "圖文諮詢") : (isEn ? "Video" : "視頻諮詢")}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{isEn ? "Symptoms" : "症狀描述"}</p>
                  <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{coDetailOrder.symptoms}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isEn ? "Consultation Fee" : "諮詢費用"}</span>
                  <span className="text-lg font-bold text-primary">HK${coDetailOrder.amount}</span>
                </div>
                <ApiPlaceholderNotice service={isEn ? "Consultation Management" : "諮詢管理"} variant="inline" />
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCoDetailOrder(null)}>{isEn ? "Close" : "關閉"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Rejection Dialog */}
      <Dialog open={!!rejectDialogOrder} onOpenChange={() => { setRejectDialogOrder(null); setRejectReason(""); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEn ? "Reject Cancellation" : "拒絕取消"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {isEn ? "Please provide a reason for rejecting this cancellation request." : "請提供拒絕此取消請求的原因。"}
            </p>
            <div className="space-y-1.5">
              <Label>{isEn ? "Rejection Reason" : "拒絕原因"}</Label>
              <Textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder={isEn ? "Enter reason..." : "輸入原因..."}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectDialogOrder(null); setRejectReason(""); }}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleCancelReject}>{isEn ? "Confirm Rejection" : "確認拒絕"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionOrdersPage;
