"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  LifeBuoy,
  MessageSquare,
  Send,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  User,
  Bot,
  Headphones,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  Paperclip,
  Star,
  ArrowRight,
} from "lucide-react";

interface SupportMessage {
  id: string;
  sender: "USER" | "SUPPORT" | "AI_BOT";
  senderName: string;
  content: string;
  createdAt: string;
  attachmentUrl?: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
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
}

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface SupportDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportDeskModal({ isOpen, onClose }: SupportDeskModalProps) {
  const [activeTab, setActiveTab] = useState<"tickets" | "new_ticket" | "ai_chat" | "faq">("tickets");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // New Ticket Form state
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("TECHNICAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [content, setContent] = useState("");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  // User Reply state
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Rating state
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Live AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "bot",
      text: "سلام و درود! من دستیار هوشمند ۲۴ ساعته پلتفرم اپ‌ساز هستم. هر سوالی در رابطه با اتصال ووکامرس، ساخت فایل APK و AAB، درگاه پرداخت یا انتشار در کافه‌بازار و مایکت دارید در خدمتم.",
      time: new Date().toLocaleTimeString("fa-IR"),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetchUserData();
  }, [isOpen]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [tRes, fRes] = await Promise.all([
        fetch("http://localhost:4000/api/support/tickets").then((r) => r.json()),
        fetch("http://localhost:4000/api/support/faq").then((r) => r.json()),
      ]);
      if (tRes.success && tRes.tickets) {
        setTickets(tRes.tickets);
        if (selectedTicket) {
          const fresh = tRes.tickets.find((t: any) => t.id === selectedTicket.id);
          if (fresh) setSelectedTicket(fresh);
        }
      }
      if (fRes.success && fRes.faqs) setFaqs(fRes.faqs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;

    setIsSubmittingTicket(true);
    setTicketSuccess(null);
    try {
      const res = await fetch("http://localhost:4000/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          department,
          priority,
          content: content.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSuccess(`تیکت شما با شماره پیگیری «${data.ticket?.ticketNumber}» ثبت گردید.`);
        setSubject("");
        setContent("");
        fetchUserData();
        setTimeout(() => {
          setActiveTab("tickets");
          setTicketSuccess(null);
        }, 2000);
      }
    } catch (_) {
      alert("خطا در ثبت تیکت پشتیبانی");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleSendReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const res = await fetch(`http://localhost:4000/api/support/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchUserData();
      }
    } catch (_) {
      alert("خطا در ارسال پیام");
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleRateTicket = async (ticketId: string) => {
    setIsSubmittingRating(true);
    try {
      const res = await fetch(`http://localhost:4000/api/support/tickets/${ticketId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: ratingStars, feedback: ratingFeedback.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setRatingSubmitted(true);
        fetchUserData();
      }
    } catch (_) {
      alert("خطا در ثبت امتیاز");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    if (!confirm("آیا از بستن این تیکت اطمینان دارید؟")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/support/tickets/${ticketId}/close`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        fetchUserData();
      }
    } catch (_) {}
  };

  const handleSendAiChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time: new Date().toLocaleTimeString("fa-IR") },
    ]);
    setChatInput("");
    setIsBotTyping(true);

    try {
      const res = await fetch("http://localhost:4000/api/support/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setIsBotTyping(false);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer || "متاسفانه ارتباط موقتاً با سرور برقرار نشد.",
          time: new Date().toLocaleTimeString("fa-IR"),
        },
      ]);
    } catch (_) {
      setIsBotTyping(false);
    }
  };

  const departmentLabels: Record<string, string> = {
    TECHNICAL: "پشتیبانی فنی و فلاتر",
    BILLING: "امور مالی و فاکتورها",
    BUILD_ENGINE: "موتور بیلد APK / AAB",
    WOOCOMMERCE: "همگام‌سازی ووکامرس",
    STORE_PUBLISHING: "انتشار در بازار و مایکت",
  };

  const statusBadges: Record<string, { label: string; bg: string; text: string; border: string }> = {
    OPEN: { label: "جدید / در انتظار پاسخ", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
    IN_PROGRESS: { label: "در حال بررسی", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
    ANSWERED: { label: "پاسخ داده شده", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
    RESOLVED: { label: "حل شده", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
    CLOSED: { label: "بسته شده", bg: "bg-slate-700/20", text: "text-slate-400", border: "border-slate-700" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-right" dir="rtl">
        {/* Header - Purely Customer Facing (No Admin switch) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">پشتیبانی و تیکت‌های مشتری</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  پاسخگویی سریع
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">ارسال سوالات، پیگیری مشکلات فنی و گفتگو با کارشناسان اختصاصی شما</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-4">
          {[
            { id: "tickets", label: "تیکت‌های من", icon: MessageSquare, badge: tickets.length },
            { id: "new_ticket", label: "ثبت تیکت جدید", icon: PlusCircle },
            { id: "ai_chat", label: "دستیار هوشمند ۲۴ ساعته", icon: Bot, isNew: true },
            { id: "faq", label: "پایگاه دانش و سوالات متداول", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedTicket(null);
                }}
                className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  active ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full font-mono">
                    {tab.badge}
                  </span>
                )}
                {tab.isNew && (
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-bold">
                    AI Bot
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: User Tickets List or Detail */}
          {activeTab === "tickets" && (
            selectedTicket ? (
              <div className="space-y-4 max-w-3xl mx-auto animate-fadeIn">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 mb-2 font-bold cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  بازگشت به لیست تیکت‌ها
                </button>

                {/* Ticket Header Card */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold">
                        {selectedTicket.ticketNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span>دپارتمان: <strong className="text-slate-200">{departmentLabels[selectedTicket.department] || selectedTicket.department}</strong></span>
                      <span>•</span>
                      <span>تاریخ ثبت: {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${statusBadges[selectedTicket.status]?.bg} ${statusBadges[selectedTicket.status]?.text} ${statusBadges[selectedTicket.status]?.border}`}>
                      {statusBadges[selectedTicket.status]?.label}
                    </span>

                    {selectedTicket.status !== "CLOSED" && (
                      <button
                        onClick={() => handleCloseTicket(selectedTicket.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition cursor-pointer"
                      >
                        بستن تیکت
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="space-y-3 min-h-[220px]">
                  {selectedTicket.messages.map((msg) => {
                    const isUser = msg.sender === "USER";
                    const isAi = msg.sender === "AI_BOT";
                    return (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-2xl max-w-[85%] space-y-1.5 border animate-fadeIn ${
                          isUser
                            ? "mr-auto bg-slate-800/80 border-slate-700/80 text-right"
                            : isAi
                            ? "ml-auto bg-indigo-950/30 border-indigo-500/30 text-right"
                            : "ml-auto bg-emerald-950/20 border-emerald-500/30 text-right"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold flex items-center gap-1.5 ${isUser ? "text-slate-300" : isAi ? "text-indigo-400" : "text-emerald-400"}`}>
                            {isUser ? <User className="w-3.5 h-3.5" /> : isAi ? <Bot className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.createdAt).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{msg.content}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Rating Section (If resolved/closed) */}
                {(selectedTicket.status === "RESOLVED" || selectedTicket.status === "CLOSED") && !ratingSubmitted && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-current" />
                        امتیاز شما به کیفیت پاسخگویی و حل این تیکت:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRatingStars(s)}
                            className={`p-1 cursor-pointer transition ${s <= ratingStars ? "text-amber-400" : "text-slate-600"}`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ratingFeedback}
                        onChange={(e) => setRatingFeedback(e.target.value)}
                        placeholder="دیدگاه اختیاری شما درباره نحوه پشتیبانی..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleRateTicket(selectedTicket.id)}
                        disabled={isSubmittingRating}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        ثبت امتیاز
                      </button>
                    </div>
                  </div>
                )}

                {/* User Reply Box */}
                {selectedTicket.status !== "CLOSED" && (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      placeholder="متن پیام جدید خود را بنویسید..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>پیوست اسکرین‌شات یا لاگ خطا</span>
                      </button>
                      <button
                        onClick={() => handleSendReply(selectedTicket.id)}
                        disabled={isSendingReply || !replyText.trim()}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-indigo-600/20"
                      >
                        {isSendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>ارسال پیام</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Tickets List */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>لیست تیکت‌های پشتیبانی شما</span>
                  <button
                    onClick={() => setActiveTab("new_ticket")}
                    className="text-xs text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    ثبت تیکت جدید
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                    <div>هنوز تیکتی از طرف شما ثبت نشده است.</div>
                    <button
                      onClick={() => setActiveTab("new_ticket")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold mt-2 cursor-pointer"
                    >
                      اولین تیکت خود را ثبت کنید
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-4 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {ticket.ticketNumber}
                            </span>
                            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                              {ticket.subject}
                            </h4>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{departmentLabels[ticket.department] || ticket.department}</span>
                            <span>•</span>
                            <span>{new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}</span>
                            <span>•</span>
                            <span>{ticket.messages.length} پیام</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${statusBadges[ticket.status]?.bg} ${statusBadges[ticket.status]?.text} ${statusBadges[ticket.status]?.border}`}>
                            {statusBadges[ticket.status]?.label}
                          </span>
                          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition -rotate-90" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* TAB 2: New Ticket Form */}
          {activeTab === "new_ticket" && (
            <div className="max-w-2xl mx-auto space-y-4 animate-fadeIn">
              {ticketSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{ticketSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-4 bg-slate-950/60 border border-slate-800 p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  فرم ارسال درخواست پشتیبانی
                </h3>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">موضوع تیکت</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="مثلاً: راهنمایی برای تنظیم درگاه پرداخت یا خطای ووکامرس"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">دپارتمان مربوطه</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                    >
                      <option value="TECHNICAL">پشتیبانی فنی و فلاتر</option>
                      <option value="WOOCOMMERCE">همگام‌سازی ووکامرس</option>
                      <option value="STORE_PUBLISHING">انتشار در بازار و مایکت</option>
                      <option value="BUILD_ENGINE">موتور بیلد APK / AAB</option>
                      <option value="BILLING">امور مالی و فاکتورها</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">میزان اولویت</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                    >
                      <option value="LOW">عادی</option>
                      <option value="MEDIUM">متوسط</option>
                      <option value="HIGH">بالا</option>
                      <option value="URGENT">فوری / بحرانی</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">شرح کامل پیام یا درخواست</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="توضیحات کامل شامل متن خطا، لینک صفحه، یا اقداماتی که تاکنون انجام داده‌اید..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingTicket ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>ثبت و ارسال تیکت</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: 24/7 AI Smart Assistant */}
          {activeTab === "ai_chat" && (
            <div className="max-w-2xl mx-auto flex flex-col h-[460px] bg-slate-950/60 border border-slate-800 rounded-3xl overflow-hidden animate-fadeIn">
              <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">پشتیبان هوشمند ۲۴ ساعته اپ‌ساز</div>
                  <div className="text-[10px] text-emerald-400">آنلاین و آماده پاسخ به سوالات فنی</div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl max-w-[80%] text-xs space-y-1 ${
                      msg.sender === "user"
                        ? "mr-auto bg-indigo-600 text-white text-right"
                        : "ml-auto bg-slate-800/90 text-slate-200 border border-slate-700 text-right leading-relaxed"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="text-[9px] opacity-60 text-left">{msg.time}</div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="ml-auto bg-slate-800 text-slate-400 text-xs px-3 py-2 rounded-2xl border border-slate-700 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>در حال تایپ پاسخ...</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendAiChatMessage()}
                  placeholder="سوال خود درباره ووکامرس، بیلد یا بازار را بپرسید..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleSendAiChatMessage}
                  className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FAQ */}
          {activeTab === "faq" && (
            <div className="max-w-2xl mx-auto space-y-3 animate-fadeIn">
              <div className="text-xs text-slate-400 font-bold mb-2">سوالات متداول مشتریان</div>
              {faqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div key={faq.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full p-4 flex items-center justify-between text-right text-xs font-bold text-white hover:bg-slate-900 transition cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
