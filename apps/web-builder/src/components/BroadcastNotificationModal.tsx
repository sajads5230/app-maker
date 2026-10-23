"use client";

import React, { useState, useEffect } from "react";

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
  const [body, setBody] = useState("تا ۳۵٪ تخفیف بر روی تمامی لوازم هوشمند و جاروبرقی‌های رباتیک به همراه ارسال رایگان");
  const [type, setType] = useState<"sale" | "news" | "order">("sale");
  const [targetPhone, setTargetPhone] = useState("");
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
          targetPhone: targetPhone.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          text: `اعلان با موفقیت برای تمامی کاربران ارسال شد! (شناسه: ${data.notification?.id || "ثبت گردید"})`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">مرکز ارسال پوش‌نوتیفیکیشن و پیام همگانی</h3>
              <p className="text-[11px] text-slate-400">ارسال آنی پیام‌های تبلیغاتی و اطلاعیه به کاربران اپلیکیشن موبایل</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                statusMsg.ok
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              }`}
            >
              <span className="text-sm">{statusMsg.ok ? "✓" : "⚠"}</span>
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">نوع پیام</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType("sale")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === "sale"
                    ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <span>🔥</span>
                <span>تخفیف و جشنواره</span>
              </button>
              <button
                type="button"
                onClick={() => setType("news")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === "news"
                    ? "bg-blue-500/20 border-blue-500 text-blue-300 font-bold"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <span>📢</span>
                <span>خبر و اطلاعیه</span>
              </button>
              <button
                type="button"
                onClick={() => setType("order")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  type === "order"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <span>📦</span>
                <span>پیگیری سفارش</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">عنوان اعلان (Title)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: تخفیف شگفت‌انگیز ساعت هوشمند شیائومی"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">متن پیام (Message Body)</label>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="متن کامل پیامی که روی صفحه قفل و نوار نوتیفیکیشن گوشی کاربر نمایش داده می‌شود..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 resize-none"
            />
          </div>

          {/* Image URL & Target Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">آدرس تصویر بنر (اختیاری)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">شماره موبایل خاص (خالی = همه کاربران)</label>
              <input
                type="text"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                placeholder="0912..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          {/* Live Phone Notification Preview */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">پیش‌نمایش زنده در نوار وضعیت گوشی:</span>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex gap-3 items-start shadow-inner">
              <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md">
                ش
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-bold text-slate-200">شیائومی اسمارت</span>
                  <span className="text-[9px] text-slate-500">هم‌اکنون</span>
                </div>
                <p className="text-[11px] font-semibold text-rose-400 truncate">{title || "عنوان اعلان"}</p>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{body || "متن پیام..."}</p>
              </div>
            </div>
          </div>

          {/* Recent Sent List */}
          {recentNotifications.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">اعلان‌های اخیراً ارسال شده:</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {recentNotifications.map((n, i) => (
                  <div key={i} className="text-[10px] bg-slate-800/40 border border-slate-800 rounded-lg p-2 flex justify-between items-center text-slate-300">
                    <span className="font-bold truncate max-w-[280px]">{n.title}</span>
                    <span className="text-slate-500 text-[9px] shrink-0">{n.createdAt?.split("T")[0] || "امروز"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-rose-600/25 transition cursor-pointer disabled:opacity-50"
          >
            {isSending ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>در حال ارسال...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>ارسال اعلان همگانی</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
