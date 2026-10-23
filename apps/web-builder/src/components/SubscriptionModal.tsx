"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Check,
  ShieldCheck,
  CreditCard,
  Zap,
  Crown,
  Receipt,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  Layers,
  ChevronLeft,
} from "lucide-react";

interface PlanItem {
  id: string;
  name: string;
  period: string;
  price: number;
  formattedPrice: string;
  days: number;
  maxBuildsPerMonth: number;
  watermark: boolean;
  features: string[];
  recommended?: boolean;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInvoices?: () => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onOpenInvoices,
}: SubscriptionModalProps) {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [quota, setQuota] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan_pro");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    // Fetch plans and current subscription
    Promise.all([
      fetch("http://localhost:4000/api/subscriptions/plans").then((r) => r.json()),
      fetch("http://localhost:4000/api/subscriptions/my-subscription").then((r) => r.json()),
    ])
      .then(([plansData, subData]) => {
        if (plansData.success && plansData.plans) {
          setPlans(plansData.plans);
        }
        if (subData.success) {
          setActiveSub(subData.subscription);
          setQuota(subData.quota);
          setDaysRemaining(subData.daysRemaining || 0);
        }
      })
      .catch((err) => console.error("Error fetching subscription data:", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async (planId: string) => {
    try {
      setCheckoutLoading(true);
      const res = await fetch("http://localhost:4000/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          returnUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.error || "خطا در برقراری ارتباط با درگاه پرداخت بانکی.");
      }
    } catch (err) {
      alert("خطا در اتصال به درگاه شاپرک.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">پلن‌های اشتراک تجاری و ارتقا</h3>
                <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  SaaS Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                پلن مناسب کسب‌وکار خود را انتخاب کنید تا خروجی‌های واقعی بدون محدودیت و پشتیبانی ویژه فعال شوند
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenInvoices && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInvoices();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>فاکتورهای رسمی</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Status Pill if active */}
        {activeSub && (
          <div className="px-6 py-2.5 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border-b border-emerald-500/20 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">
                اشتراک فعال شما:{" "}
                <span className="font-bold text-emerald-300">
                  {quota?.planName || activeSub.plan}
                </span>
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">
                اعتبار باقی‌مانده:{" "}
                <span className="font-bold text-emerald-400 font-mono">
                  {daysRemaining > 365 ? "دائمی (مادام‌العمر)" : `${daysRemaining} روز`}
                </span>
              </span>
            </div>

            {quota && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>سهمیه بیلد ماه جاری:</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">
                  {quota.remainingBuilds} از {quota.maxBuildsPerMonth || "نامحدود"} بیلد
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Body / Pricing Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-24 text-center text-slate-400 text-xs">در حال بارگذاری پلن‌های تجاری...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((p) => {
                const isSelected = selectedPlanId === p.id;
                const isPro = p.id === "plan_pro";
                const isLifetime = p.id === "plan_lifetime";

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer relative border ${
                      isSelected
                        ? isPro
                          ? "bg-slate-950/90 border-rose-500 shadow-xl shadow-rose-500/10 ring-1 ring-rose-500"
                          : isLifetime
                          ? "bg-slate-950/90 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500"
                          : "bg-slate-950/90 border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500"
                        : "bg-slate-950/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Badge */}
                    {p.recommended && (
                      <div className="absolute -top-3 right-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>پیشنهاد محبوب تجاری</span>
                      </div>
                    )}
                    {isLifetime && (
                      <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        <span>یک‌بار برای همیشه</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Plan Title & Period */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-base text-white">{p.name}</h4>
                          <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                            {p.period}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span
                            className={`text-2xl font-black ${
                              isPro
                                ? "text-rose-400"
                                : isLifetime
                                ? "text-emerald-400"
                                : "text-white"
                            }`}
                          >
                            {p.price.toLocaleString("fa-IR")}
                          </span>
                          <span className="text-xs text-slate-400">تومان</span>
                        </div>
                      </div>

                      <div className="w-full h-px bg-slate-800/80" />

                      {/* Features List */}
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        {p.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                isPro
                                  ? "bg-rose-500/20 text-rose-400"
                                  : isLifetime
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-6">
                      <button
                        type="button"
                        disabled={checkoutLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckout(p.id);
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                          isPro
                            ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-rose-600/25"
                            : isLifetime
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25"
                            : "bg-slate-800 hover:bg-slate-700 text-white"
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>پرداخت آنلاین شاپرک ({p.period})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Security & Iranian Payment Guarantee */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                پرداخت از طریق تمامی کارت‌های عضو شبکه شتاب با تضمین بازگشت وجه ۷ روزه و صدور آنی فاکتور رسمی
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">درگاه‌های فعال:</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">شاپرک</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded text-amber-300 font-mono">زرین‌پال</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>فعال‌سازی آنی پس از پرداخت بدون نیاز به تایید دستی اپراتور</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
