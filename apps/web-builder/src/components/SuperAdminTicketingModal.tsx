"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Send,
  AlertCircle,
  Loader2,
  Lock,
  Search,
  CheckCircle2,
  User,
  Bot,
  Headphones,
  Star,
  Activity,
  Flame,
  Crown,
  RefreshCw,
} from "lucide-react";

interface SupportMessage {
  id: string;
  sender: "USER" | "SUPPORT" | "AI_BOT";
  senderName: string;
  content: string;
  createdAt: string;
  attachmentUrl?: string;
}

interface InternalNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  userPlan?: string;
  appPackageName?: string;
  subject: string;
  department: string;
  priority: string;
  status: "OPEN" | "IN_PROGRESS" | "ANSWERED" | "RESOLVED" | "CLOSED";
  assignedAgent?: string;
  rating?: number;
  ratingFeedback?: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
  internalNotes?: InternalNote[];
}

interface CannedResponse {
  id: string;
  title: string;
  department: string;
  content: string;
}

interface AdminStats {
  total: number;
  open: number;
  inProgress: number;
  answered: number;
  resolved: number;
  urgent: number;
  avgResponseTimeMinutes: number;
  satisfactionRatePercent: number;
  avgRating: number;
}

interface SuperAdminTicketingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuperAdminTicketingModal({ isOpen, onClose }: SuperAdminTicketingModalProps) {
  const [adminTickets, setAdminTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Reply Composer
  const [replyText, setReplyText] = useState("");
  const [agentName, setAgentName] = useState("مهندس حسینی (پشتیبانی ارشد فلاتر)");
  const [newStatus, setNewStatus] = useState<"ANSWERED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED">("ANSWERED");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Internal Note
  const [noteText, setNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"reply" | "notes">("reply");

  useEffect(() => {
    if (!isOpen) return;
    fetchAdminData();
  }, [isOpen, filterStatus, filterDepartment, filterPriority, searchQuery]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (filterStatus !== "ALL") q.set("status", filterStatus);
      if (filterDepartment !== "ALL") q.set("department", filterDepartment);
      if (filterPriority !== "ALL") q.set("priority", filterPriority);
      if (searchQuery.trim()) q.set("search", searchQuery.trim());

      const [tRes, sRes, cRes] = await Promise.all([
        fetch(`http://localhost:4000/api/support/admin/tickets?${q.toString()}`).then((r) => r.json()),
        fetch("http://localhost:4000/api/support/admin/stats").then((r) => r.json()),
        fetch("http://localhost:4000/api/support/admin/canned-responses").then((r) => r.json()),
      ]);

      if (tRes.success && tRes.tickets) {
        setAdminTickets(tRes.tickets);
        if (selectedTicket) {
          const fresh = tRes.tickets.find((t: any) => t.id === selectedTicket.id);
          if (fresh) setSelectedTicket(fresh);
          else if (tRes.tickets.length > 0) setSelectedTicket(tRes.tickets[0]);
        } else if (tRes.tickets.length > 0) {
          setSelectedTicket(tRes.tickets[0]);
        }
      }
      if (sRes.success && sRes.stats) setStats(sRes.stats);
      if (cRes.success && cRes.cannedResponses) setCannedResponses(cRes.cannedResponses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendAdminReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const res = await fetch(`http://localhost:4000/api/support/admin/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName,
          content: replyText.trim(),
          newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchAdminData();
      }
    } catch (_) {
      alert("خطا در ارسال پاسخ کارشناس");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleAddInternalNote = async (ticketId: string) => {
    if (!noteText.trim()) return;
    setIsAddingNote(true);
    try {
      const res = await fetch(`http://localhost:4000/api/support/admin/tickets/${ticketId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: "سوپرادمین سیستم", content: noteText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNoteText("");
        fetchAdminData();
      }
    } catch (_) {
      alert("خطا در ثبت یادداشت");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleUpdateMeta = async (ticketId: string, meta: any) => {
    try {
      const res = await fetch(`http://localhost:4000/api/support/admin/tickets/${ticketId}/meta`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meta),
      });
      const data = await res.json();
      if (data.success) fetchAdminData();
    } catch (_) {}
  };

  if (!isOpen) return null;

  const statusBadges: Record<string, { label: string; text: string; bg: string }> = {
    OPEN: { label: "نیازمند پاسخ", text: "text-rose-400", bg: "bg-rose-500/10" },
    IN_PROGRESS: { label: "در حال بررسی", text: "text-amber-400", bg: "bg-amber-500/10" },
    ANSWERED: { label: "پاسخ داده شده", text: "text-blue-400", bg: "bg-blue-500/10" },
    RESOLVED: { label: "حل شده", text: "text-emerald-400", bg: "bg-emerald-500/10" },
    CLOSED: { label: "بسته شده", text: "text-slate-400", bg: "bg-slate-700/20" },
  };

  const priorityBadges: Record<string, { label: string; color: string }> = {
    URGENT: { label: "فوری و بحرانی", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
    HIGH: { label: "اولویت بالا", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    MEDIUM: { label: "متوسط", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    LOW: { label: "عادی", color: "text-slate-400 bg-slate-800 border-slate-700" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden font-sans text-right" dir="rtl">
        {/* Header - SuperAdmin Pure */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">میز کار سوپرادمین و مرکز پاسخگویی تیکت‌ها</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  دسترسی اختصاصی پشتیبانی و مدیریت
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">مدیریت تیکت‌های دریافتی از تمام کاربران، پاسخگویی با قالب‌های آماده و درج یادداشت‌های فنی</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              title="بروزرسانی تیکت‌ها"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SuperAdmin KPI Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-4 bg-slate-950 border-b border-slate-800">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-right">
              <div className="text-[11px] text-slate-400">کل تیکت‌ها</div>
              <div className="text-lg font-black text-white">{stats.total}</div>
            </div>

            <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-right">
              <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                در انتظار پاسخ (Open)
              </div>
              <div className="text-lg font-black text-rose-300">{stats.open}</div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl text-right">
              <div className="text-[11px] text-amber-400 font-bold">در حال بررسی</div>
              <div className="text-lg font-black text-amber-300">{stats.inProgress}</div>
            </div>

            <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-2xl text-right">
              <div className="text-[11px] text-blue-400 font-bold">پاسخ کارشناس</div>
              <div className="text-lg font-black text-blue-300">{stats.answered}</div>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-right">
              <div className="text-[11px] text-emerald-400 font-bold">میانگین زمان پاسخ</div>
              <div className="text-lg font-black text-emerald-300">{stats.avgResponseTimeMinutes} دقیقه</div>
            </div>

            <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-2xl text-right">
              <div className="text-[11px] text-purple-400 font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-amber-400" />
                رضایت مشتریان
              </div>
              <div className="text-lg font-black text-purple-300">{stats.satisfactionRatePercent}٪ ({stats.avgRating}/۵)</div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس شماره تیکت، نام مشتری، موبایل یا موضوع..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="OPEN">نیازمند پاسخ (Open)</option>
              <option value="IN_PROGRESS">در حال بررسی (In Progress)</option>
              <option value="ANSWERED">پاسخ داده شده (Answered)</option>
              <option value="RESOLVED">حل شده (Resolved)</option>
              <option value="CLOSED">بسته شده (Closed)</option>
            </select>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
            >
              <option value="ALL">همه دپارتمان‌ها</option>
              <option value="TECHNICAL">پشتیبانی فنی و فلاتر</option>
              <option value="WOOCOMMERCE">همگام‌سازی ووکامرس</option>
              <option value="STORE_PUBLISHING">انتشار در مارکت</option>
              <option value="BUILD_ENGINE">موتور بیلد</option>
              <option value="BILLING">امور مالی</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
            >
              <option value="ALL">همه اولویت‌ها</option>
              <option value="URGENT">فوری و بحرانی</option>
              <option value="HIGH">اولویت بالا</option>
              <option value="MEDIUM">اولویت متوسط</option>
              <option value="LOW">اولویت عادی</option>
            </select>
          </div>
        </div>

        {/* Master-Detail Cockpit Layout */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden">
          {/* Queue List (4 cols) */}
          <div className="col-span-4 border-l border-slate-800 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            {adminTickets.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">تیکتی با این فیلترها در صف وجود ندارد.</div>
            ) : (
              adminTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3 rounded-2xl border text-right transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? "bg-purple-950/30 border-purple-500 shadow-md shadow-purple-600/10"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-purple-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {t.ticketNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold border ${priorityBadges[t.priority]?.color}`}>
                        {priorityBadges[t.priority]?.label}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-1">{t.subject}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{t.userName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${statusBadges[t.status]?.text}`}>
                        {statusBadges[t.status]?.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Ticket Detail & Action Area (8 cols) */}
          <div className="col-span-8 flex flex-col overflow-hidden bg-slate-900/60">
            {selectedTicket ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Information Bar */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400">{selectedTicket.ticketNumber}</span>
                      <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>مشتری: <strong className="text-white">{selectedTicket.userName}</strong> ({selectedTicket.userPhone})</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-bold text-[10px]">پلن {selectedTicket.userPlan || "PRO"}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{selectedTicket.appPackageName}</span>
                    </div>
                  </div>

                  {/* Quick Meta Controls */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateMeta(selectedTicket.id, { status: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none font-sans"
                    >
                      <option value="OPEN">باز / در انتظار</option>
                      <option value="IN_PROGRESS">در حال بررسی</option>
                      <option value="ANSWERED">پاسخ داده شده</option>
                      <option value="RESOLVED">حل شده</option>
                      <option value="CLOSED">بسته شده</option>
                    </select>

                    <select
                      value={selectedTicket.priority}
                      onChange={(e) => handleUpdateMeta(selectedTicket.id, { priority: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none font-sans"
                    >
                      <option value="LOW">اولویت کم</option>
                      <option value="MEDIUM">اولویت متوسط</option>
                      <option value="HIGH">اولویت بالا</option>
                      <option value="URGENT">فوری و اضطراری</option>
                    </select>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {selectedTicket.messages.map((msg) => {
                    const isUser = msg.sender === "USER";
                    const isAi = msg.sender === "AI_BOT";
                    return (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-2xl max-w-[85%] space-y-1 border ${
                          isUser
                            ? "mr-auto bg-slate-800/90 border-slate-700 text-right"
                            : isAi
                            ? "ml-auto bg-indigo-950/30 border-indigo-500/30 text-right"
                            : "ml-auto bg-purple-950/30 border-purple-500/30 text-right"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold flex items-center gap-1.5 ${isUser ? "text-slate-200" : isAi ? "text-indigo-400" : "text-purple-400"}`}>
                            {isUser ? <User className="w-3.5 h-3.5" /> : isAi ? <Bot className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.createdAt).toLocaleTimeString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{msg.content}</p>
                      </div>
                    );
                  })}

                  {/* Internal Notes Display */}
                  {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 && (
                    <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-2 mt-4">
                      <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        یادداشت‌های محرمانه داخلی (مشتری نمی‌بیند):
                      </div>
                      {selectedTicket.internalNotes.map((n) => (
                        <div key={n.id} className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                          <strong className="text-amber-300">{n.author}:</strong> {n.content}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Answering Box */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab("reply")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                          activeSubTab === "reply"
                            ? "bg-purple-600 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        ارسال پاسخ به مشتری
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSubTab("notes")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          activeSubTab === "notes"
                            ? "bg-amber-600 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        ثبت یادداشت داخلی
                      </button>
                    </div>

                    {activeSubTab === "reply" && cannedResponses.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400">پاسخ‌های آماده:</span>
                        <select
                          onChange={(e) => {
                            const selected = cannedResponses.find((c) => c.id === e.target.value);
                            if (selected) setReplyText(selected.content);
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-[11px] text-white focus:outline-none font-sans"
                        >
                          <option value="">انتخاب پاسخ آماده...</option>
                          {cannedResponses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {activeSubTab === "reply" ? (
                    <>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        placeholder="متن پاسخ رسمی کارشناس به مشتری را بنویسید..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            placeholder="نام کارشناس"
                            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white w-48 font-sans"
                          />
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white font-sans"
                          >
                            <option value="ANSWERED">تغییر وضعیت به: پاسخ داده شد</option>
                            <option value="RESOLVED">تغییر وضعیت به: حل شد</option>
                            <option value="IN_PROGRESS">تغییر وضعیت به: در حال بررسی</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendAdminReply(selectedTicket.id)}
                          disabled={isSendingReply || !replyText.trim()}
                          className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/20"
                        >
                          {isSendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          <span>ارسال پاسخ کارشناس</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={2}
                        placeholder="یادداشت محرمانه (فقط مدیران و کارشناسان پشتیبانی می‌بینند)..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleAddInternalNote(selectedTicket.id)}
                          disabled={isAddingNote || !noteText.trim()}
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                        >
                          {isAddingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>ذخیره یادداشت داخلی</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                تیکتی را برای بررسی انتخاب نمایید.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
