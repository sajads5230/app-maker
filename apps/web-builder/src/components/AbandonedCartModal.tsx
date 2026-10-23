'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Send,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  Tag,
  RefreshCw,
  Loader2,
  DollarSign,
  Package,
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface AbandonedCart {
  id: string;
  projectId: string;
  customerPhone?: string | null;
  customerName?: string | null;
  totalAmount: number;
  status: string; // 'ABANDONED' | 'RECOVERED'
  recoveryDiscountCode?: string;
  notificationSent: boolean;
  notifiedAt?: string | null;
  createdAt: string;
  itemCount: number;
  items: CartItem[];
}

interface CartStats {
  totalCarts: number;
  abandonedCount: number;
  recoveredCount: number;
  totalAbandonedAmount: number;
  totalRecoveredAmount: number;
  recoveryRate: number;
}

interface AbandonedCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function AbandonedCartModal({ isOpen, onClose, projectId }: AbandonedCartModalProps) {
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<CartStats>({
    totalCarts: 0,
    abandonedCount: 0,
    recoveredCount: 0,
    totalAbandonedAmount: 0,
    totalRecoveredAmount: 0,
    recoveryRate: 0,
  });
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchCarts();
    }
  }, [isOpen, projectId]);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/abandoned-carts`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setCarts(data.carts);
      }
    } catch (err) {
      console.error('Failed to fetch abandoned carts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerRecovery = async (cartId?: string) => {
    setTriggering(true);
    setActionSuccess(null);
    try {
      const res = await fetch(
        `http://localhost:4000/api/projects/${projectId}/abandoned-carts/trigger-recovery`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message);
        await fetchCarts();
      }
    } catch (err) {
      console.error('Failed to trigger recovery:', err);
    } finally {
      setTriggering(false);
    }
  };

  const handleMarkRecovered = async (cartId: string) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/projects/${projectId}/abandoned-carts/${cartId}/mark-recovered`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (data.success) {
        setActionSuccess('سبد خرید با موفقیت به عنوان بازگردانی‌شده ثبت گردید!');
        await fetchCarts();
      }
    } catch (err) {
      console.error('Failed to mark cart as recovered:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">اتوماسیون بازیابی سبدهای خرید رها شده</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  مشابه Shopney & PushOwl
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ارسال خودکار اعلان پوش و کد تخفیف ویژه به مشتریانی که خرید خود را نهایی نکرده‌اند
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTriggerRecovery()}
              disabled={triggering || stats.abandonedCount === 0}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {triggering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ارسال هوشمند...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ارسال هوشمند به تمام سبدهای معلق ({stats.abandonedCount})</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {actionSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400/80 hover:text-emerald-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Analytics Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>ارزش سبدهای در خطر</span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-amber-400">
                {stats.totalAbandonedAmount.toLocaleString('fa-IR')}
                <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {stats.abandonedCount} سفارش بلاتکلیف
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>فروش بازگردانده شده</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400">
                {stats.totalRecoveredAmount.toLocaleString('fa-IR')}
                <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {stats.recoveredCount} سبد با تخفیف تکمیل شد
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>نرخ بازگشت مشتری (ROI)</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-black text-purple-400">
                %{stats.recoveryRate.toLocaleString('fa-IR')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                میانگین جهانی رقبا: ۲۲٪
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>وضعیت اعلان‌ها</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-black text-cyan-400">
                خودکار
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                همگام با سرویس پیامک و نوتیفیکیشن
              </div>
            </div>
          </div>

          {/* List of Abandoned Carts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>لیست سبدهای شناسایی‌شده</span>
                <span className="text-xs text-slate-500 font-normal">({carts.length} مورد)</span>
              </h3>
              <button
                onClick={fetchCarts}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>بروزرسانی</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span>در حال دریافت لیست سبدهای رها شده...</span>
              </div>
            ) : carts.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">هیچ سبد خریدی در وضعیت رها شده قرار ندارد.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {carts.map((cart) => {
                  const isRecovered = cart.status === 'RECOVERED';

                  return (
                    <div
                      key={cart.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isRecovered
                          ? 'bg-emerald-950/10 border-emerald-500/20'
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isRecovered
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {isRecovered ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <ShoppingCart className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">
                                {cart.customerName || 'کاربر موبایل'}
                              </span>
                              {cart.customerPhone && (
                                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                  {cart.customerPhone}
                                </span>
                              )}
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  isRecovered
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {isRecovered ? '✅ خرید نهایی شد (بازیابی موفق)' : '⏳ سبد رها شده'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                                ارزش سبد:{' '}
                                <strong className="text-white">
                                  {cart.totalAmount.toLocaleString('fa-IR')} تومان
                                </strong>
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="w-3.5 h-3.5 text-slate-500" />
                                {cart.itemCount} قلم کالا
                              </span>
                              <span className="flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5 text-amber-400" />
                                کد تخفیف:{' '}
                                <code className="text-amber-300 font-bold bg-amber-500/10 px-1.5 rounded">
                                  {cart.recoveryDiscountCode || 'CART10'}
                                </code>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {!isRecovered && (
                            <>
                              <button
                                onClick={() => handleTriggerRecovery(cart.id)}
                                disabled={triggering}
                                className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
                                  cart.notificationSent
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                                }`}
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{cart.notificationSent ? 'ارسال مجدد اعلان' : 'ارسال پیشنهاد بازگشت'}</span>
                              </button>
                              <button
                                onClick={() => handleMarkRecovered(cart.id)}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition"
                              >
                                ثبت بازگشت
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedCart(selectedCart?.id === cart.id ? null : cart)}
                            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                          >
                            {selectedCart?.id === cart.id ? 'بستن جزئیات' : 'مشاهده کالاها'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Items Drawer */}
                      {selectedCart?.id === cart.id && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-fadeIn">
                          <span className="text-[11px] font-bold text-slate-400 block mb-1">
                            اقلام درون سبد مشتری:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {cart.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-8 h-8 rounded-lg object-cover bg-slate-800"
                                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                                    />
                                  )}
                                  <div>
                                    <span className="text-white font-medium block truncate max-w-[200px]">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      تعداد: {item.quantity} عدد
                                    </span>
                                  </div>
                                </div>
                                <span className="text-amber-400 font-bold">
                                  {item.price.toLocaleString('fa-IR')} ت
                                </span>
                              </div>
                            ))}
                          </div>
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
    </div>
  );
}
