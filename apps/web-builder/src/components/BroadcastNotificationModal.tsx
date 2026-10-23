"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  Send,
  Sparkles,
  Users,
  Target,
  Smartphone,
  Layers,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Loader2,
  BarChart2,
  Flame,
  ShoppingBag,
  Zap,
} from "lucide-react";

interface BroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onNotificationSent?: (title: string) => void;
}

export default function BroadcastNotificationModal({
  isOpen,
  onClose,
  projectId = "app-demo-techmarket",
  onNotificationSent,
}: BroadcastNotificationModalProps) {
  const [title, setTitle] = useState("🔥 تخفیف ویژه آخر هفته شیائومی اسمارت!");
  const [body, setBody] = useState("تا ۳۵٪ تخفیف بر روی تمامی لوازم هوشمند و ساعت‌های ورزشی به همراه ارسال رایگان");
  const [type, setType] = useState<"sale" | "news" | "order">("sale");
  const [segment, setSegment] = useState<"all" | "abandoned" | "vip" | "inactive">("all");
  const [deepLinkType, setDeepLinkType] = useState<"home" | "category" | "product" | "url">("product");
  const [deepLinkValue, setDeepLinkValue] = useState("10160");
  const [provider, setProvider] = useState<"fcm" | "najva" | "chabok">("najva");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=300&fit=crop");
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchRecent();
    }
  }, [isOpen]);

  const fetchRecent = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/notifications/inbox?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setRecentNotifications((data.notifications || []).slice(0, 5));
      }
    } catch (_) {}
  };

  if (!isOpen) return null;

  const segmentAudienceCounts: Record<string, string> = {
    all: "۱۴,۲۵۰ کاربر نصب‌شده",
    abandoned: "۸۴ کاربر با سبد رها شده",
    vip: "۴۲۰ عضو وفادار VIP",
    inactive: "۱,۸۹۰ کاربر بدون خرید در ۷ روز",
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      setStatusMsg({ text: "لطفاً عنوان و متن اعلان را وارد نمایید.", ok: false });
      return;
    }

    setIsSending(true);
    setStatusMsg(null);

    try {
      const res = await fetch("http://localhost:4000/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: title.trim(),
          body: body.trim(),
          type,
          segment,
          provider,
          actionUrl: deepLinkType === "url" ? deepLinkValue : undefined,
          productId: deepLinkType === "product" ? deepLinkValue : undefined,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          text: `کمپین پوش‌نوتیفیکیشن با موفقیت برای (${segmentAudienceCounts[segment]}) ارسال گردید!`,
          ok: true,
        });
        if (onNotificationSent) onNotificationSent(title.trim());
        fetchRecent();
      } else {
        setStatusMsg({ text: data.error || "خطا در ارسال اعلان.", ok: false });
      }
    } catch (e: any) {
      setStatusMsg({ text: "عدم برقراری ارتباط با سرور نوتیفیکیشن: " + e.message, ok: false });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                پنل مدیریت کمپین‌های پوش‌نوتیفیکیشن هوشمند
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-normal">
                  سگمنت‌بندی مخاطبان + دیپ‌لینک
                </span>
              </h2>
              <p className="text-xs text-slate-400">ارسال اعلان هدفمند به کاربران موبایل با امکان انتخاب سگمنت و تصویر بنری</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Two Columns (Form + Live Mobile Preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {statusMsg && (
              <div
                className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs border animate-fadeIn ${
                  statusMsg.ok
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                }`}
              >
                {statusMsg.ok ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* Target Audience Segmentation */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                سگمنت و جامعه هدف اعلان
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", name: "همه کاربران اپ", count: "۱۴,۲۵۰ کاربر", icon: Users },
                  { id: "abandoned", name: "سبد خرید رها شده", count: "۸۴ کاربر", icon: ShoppingBag },
                  { id: "vip", name: "مشتریان وفادار VIP", count: "۴۲۰ کاربر", icon: Sparkles },
                  { id: "inactive", name: "کم‌فعالیت (۷ روز)", count: "۱,۸۹۰ کاربر", icon: Clock },
                ].map((seg) => {
                  const Icon = seg.icon;
                  const isSelected = segment === seg.id;
                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSegment(seg.id as any)}
                      className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-600/15 border-indigo-500 text-white shadow-sm"
                          : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                        <div>
                          <div className="text-xs font-bold text-slate-200">{seg.name}</div>
                          <div className="text-[10px] text-slate-500">{seg.count}</div>
                        </div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-600"}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign Category & Notification Provider */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">نوع پیام</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "sale", label: "تخفیف", icon: "🔥" },
                    { id: "news", label: "اطلاعیه", icon: "📢" },
                    { id: "order", label: "سفارش", icon: "📦" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                        type === t.id
                          ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold"
                          : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">ارائه‌دهنده سرویس (Gateway)</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="najva">نجوا (Najva Push)</option>
                  <option value="chabok">چابک (Chabok Push)</option>
                  <option value="fcm">گوگل فایربیس (FCM Native)</option>
                </select>
              </div>
            </div>

            {/* Title & Body */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">عنوان اعلان (Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: جشنواره شگفت‌انگیز پاییزه آغاز شد!"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">متن اعلان (Body)</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={2}
                  placeholder="توضیحات جذاب و ترغیب‌کننده برای باز کردن اپلیکیشن..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            {/* Deep Link Action */}
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                  عملیات پس از لمس اعلان (Deep Link)
                </label>
                <span className="text-[10px] text-slate-400">هدایت مستقیم کاربر به صفحه مورد نظر</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "home", label: "صفحه خانه" },
                  { id: "category", label: "دسته‌بندی" },
                  { id: "product", label: "محصول خاص" },
                  { id: "url", label: "لینک دلخواه" },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setDeepLinkType(act.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition ${
                      deepLinkType === act.id
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
              {deepLinkType !== "home" && (
                <input
                  type="text"
                  value={deepLinkValue}
                  onChange={(e) => setDeepLinkValue(e.target.value)}
                  placeholder={
                    deepLinkType === "product"
                      ? "شناسه محصول (مثلاً: 10160)"
                      : deepLinkType === "category"
                      ? "نامک دسته (مثلاً: smart-watch)"
                      : "https://xiaomismart.ir/campaign"
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono text-left focus:outline-none focus:border-indigo-500"
                  dir="ltr"
                />
              )}
            </div>

            {/* Banner Image URL */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">آدرس اینترنتی تصویر بنر بزرگ (اختیاری)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://.../banner.jpg"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-left focus:outline-none focus:border-indigo-500"
                dir="ltr"
              />
            </div>
          </div>

          {/* Right Column: Live Mobile Push Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 space-y-4">
            <div className="w-full flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                پیش‌نمایش زنده در صفحه قفل گوشی
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">اندروید / iOS</span>
            </div>

            {/* Mobile Phone Simulation Card */}
            <div className="w-full max-w-[280px] bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-3 shadow-2xl space-y-3 relative overflow-hidden">
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
                <span>14:30</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>95%</span>
                </div>
              </div>

              {/* Notification Banner Container */}
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 shadow-lg space-y-2 backdrop-blur-md animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-rose-500 flex items-center justify-center text-white text-[9px] font-bold">
                      XS
                    </div>
                    <span className="text-[11px] font-bold text-slate-200">شیائومی اسمارت</span>
                  </div>
                  <span className="text-[9px] text-slate-400">همین الان</span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white line-clamp-1">{title || "عنوان اعلان"}</div>
                  <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mt-0.5">
                    {body || "متن پیام در این قسمت قرار می‌گیرد..."}
                  </div>
                </div>

                {imageUrl && (
                  <div className="rounded-xl overflow-hidden h-24 w-full bg-slate-950 border border-slate-700/50">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Campaign Impact Estimation */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>جامعه هدف:</span>
                  <span className="text-indigo-400 font-bold">{segmentAudienceCounts[segment]}</span>
                </div>
                <div className="flex justify-between">
                  <span>تخمین نرخ کلیک (CTR):</span>
                  <span className="text-emerald-400 font-bold">۱۴.۵٪ الی ۱۹٪</span>
                </div>
              </div>
            </div>

            {/* Recent Campaigns Table Snippet */}
            <div className="w-full text-right space-y-2">
              <div className="text-xs font-bold text-slate-400">آخرین کمپین‌های ارسال‌شده:</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="truncate max-w-[170px]">{notif.title}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">ارسال شد</span>
                    </div>
                  ))
                ) : (
                  <div className="text-[11px] text-slate-500 text-center py-2">هنوز کمپینی ارسال نشده است.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            ارسال با سرعت بالا (تحویل کمتر از ۳ ثانیه روی گوشی مخاطبان)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-rose-600/20"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              انتشار و ارسال سراسری کمپین
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
