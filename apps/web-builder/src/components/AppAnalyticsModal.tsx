'use client';

import React, { useState } from 'react';
import {
  X,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Smartphone,
  Eye,
  ShoppingCart,
  CheckCircle2,
  Filter,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
  Flame,
} from 'lucide-react';

interface AppAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function AppAnalyticsModal({ isOpen, onClose, projectId }: AppAnalyticsModalProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  if (!isOpen) return null;

  const METRICS = {
    totalOpens: timeRange === '7d' ? '۱۲,۴۵۰' : '۵۴,۳۰۰',
    dau: '۱,۸۲۰',
    avgDuration: '۴:۲۲ دقیقه',
    conversionRate: '۳.۸٪',
    revenueGenerated: timeRange === '7d' ? '۶۴,۲۰۰,۰۰۰ تومان' : '۲۸۴,۰۰۰,۰۰۰ تومان',
  };

  const BLOCK_HEATMAP = [
    { title: 'بنر اسلایدر جشنواره فروش', type: 'banner_slider', clicks: '۴,۳۱۰', percent: 38, color: 'bg-indigo-500' },
    { title: 'کروسل کالاهای پرفروش', type: 'product_carousel', clicks: '۳,۱۹۰', percent: 28, color: 'bg-rose-500' },
    { title: 'گردونه شانس و تخفیف', type: 'lucky_wheel', clicks: '۲,۰۵۰', percent: 18, color: 'bg-amber-500' },
    { title: 'فرم پذیرش و مشاوره آنلاین', type: 'custom_form', clicks: '۱,۱۲۰', percent: 10, color: 'bg-blue-500' },
    { title: 'استوری‌های برگزیده هدر', type: 'story_circles', clicks: '۶۸۰', percent: 6, color: 'bg-purple-500' },
  ];

  const FUNNEL_STEPS = [
    { label: 'باز کردن اپلیکیشن', count: '۱۲,۴۵۰', percent: 100, drop: '۰٪' },
    { label: 'مشاهده صفحه کالا', count: '۷,۹۶۰', percent: 64, drop: '۳۶٪ ریزش' },
    { label: 'افزودن به سبد خرید', count: '۲,۶۱۰', percent: 21, drop: '۶۷٪ ریزش' },
    { label: 'ورود به مرحله پرداخت', count: '۸۴۰', percent: 6.8, drop: '۶۸٪ ریزش' },
    { label: 'تکمیل موفق سفارش', count: '۴۷۳', percent: 3.8, drop: '۴۴٪ ریزش' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">هوش آماری و رفتار کاربران (App Analytics & Heatmap)</h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  آمار زنده
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                بررسی میزان بازدید، بلوک‌های پرکلیک، نرخ تبدیل خرید و عملکرد اپلیکیشن شما
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    timeRange === r ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === '7d' ? '۷ روز اخیر' : r === '30d' ? '۳۰ روز اخیر' : '۳ ماه گذشته'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>تعداد باز شدن اپلیکیشن</span>
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{METRICS.totalOpens}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+۱۲.۴٪ نسبت به دوره قبل</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>کاربران فعال روزانه (DAU)</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{METRICS.dau}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+۸.۲٪ نرخ بازگشت مشتری</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>نرخ تبدیل به خرید (Conversion)</span>
                <ShoppingCart className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{METRICS.conversionRate}</div>
              <div className="text-[11px] text-slate-400">میانگین استاندارد صنف: ۲.۲٪</div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>فروش نهایی ایجادشده</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-sm font-bold text-amber-400 truncate tracking-tight">{METRICS.revenueGenerated}</div>
              <div className="text-[11px] text-emerald-400 font-medium">سود مستقیم از اپلیکیشن</div>
            </div>
          </div>

          {/* Middle: Funnel & Block Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Conversion Funnel (6 cols) */}
            <div className="lg:col-span-6 p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>قیف تبدیل خرید (Sales Funnel)</span>
                </div>
                <span className="text-xs text-slate-400">از ورود تا ثبت فاکتور</span>
              </div>

              <div className="space-y-3 pt-1">
                {FUNNEL_STEPS.map((step, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-white font-medium">{step.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[11px]">{step.count}</span>
                        <span className="font-bold text-indigo-400 text-xs">{step.percent}٪</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${step.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Block Click Heatmap (6 cols) */}
            <div className="lg:col-span-6 p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>هیت‌مپ کلیک روی بلوک‌های اپلیکیشن</span>
                </div>
                <span className="text-xs text-slate-400">پرمخاطب‌ترین اجزا</span>
              </div>

              <div className="space-y-3 pt-1">
                {BLOCK_HEATMAP.map((block, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white">{block.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px] font-mono">{block.clicks} کلیک</span>
                        <span className="font-bold text-rose-400">{block.percent}٪</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${block.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${block.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Distribution Bar */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">توزیع پلتفرم‌های کاربران:</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300">اندروید نیتیو (۷۲٪)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-slate-300">وب‌اپلیکیشن PWA و iOS (۲۸٪)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>آمار به صورت لحظه‌ای با هر تعامل کاربر در اپلیکیشن فلاتر همگام‌سازی می‌شود.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
