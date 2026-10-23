'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Smartphone,
  Sparkles,
  ShieldAlert,
  Download,
  ExternalLink,
  Layers,
  ArrowUpCircle,
  Tag,
} from 'lucide-react';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function AppUpdateModal({ isOpen, onClose, projectId }: AppUpdateModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Form State
  const [latestVersion, setLatestVersion] = useState('1.2.0');
  const [minVersion, setMinVersion] = useState('1.0.0');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [apkDownloadUrl, setApkDownloadUrl] = useState('');
  const [marketUrl, setMarketUrl] = useState('bazar://details?id=ir.xiaomismart.store');
  const [changelog, setChangelog] = useState(
    '• اضافه شدن مارکت‌پلیس چندفروشندگی دکان\n• سیستم کارت وفاداری و پاداش امتیازی مشتریان\n• فرم‌ساز اختصاصی با صدور شماره پیگیری آنلاین\n• رفع باگ‌های جزئی و سازگاری کامل با اندروید ۱۴ و ۱۵'
  );

  useEffect(() => {
    if (isOpen && projectId) {
      fetchUpdateConfig();
    }
  }, [isOpen, projectId]);

  const fetchUpdateConfig = async () => {
    setLoading(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/app-update`);
      const data = await res.json();
      if (data.success) {
        if (data.latestVersion) setLatestVersion(data.latestVersion);
        if (data.minVersion) setMinVersion(data.minVersion);
        setForceUpdate(Boolean(data.forceUpdate));
        if (data.apkDownloadUrl) setApkDownloadUrl(data.apkDownloadUrl);
        if (data.marketUrl) setMarketUrl(data.marketUrl);
        if (data.changelog) setChangelog(data.changelog);
      }
    } catch (err) {
      console.error('Failed to fetch app update config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/app-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latestVersion,
          minVersion,
          forceUpdate,
          apkDownloadUrl: apkDownloadUrl || `http://localhost:4000/downloads/${projectId}-v${latestVersion}.apk`,
          marketUrl,
          changelog,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess('تنظیمات انتشار نسخه جدید با موفقیت ذخیره شد. کاربران اپلیکیشن پیام آپدیت را دریافت خواهند کرد.');
      } else {
        setActionError(data.error || 'خطا در ثبت تنظیمات نسخه');
      }
    } catch (err) {
      setActionError('خطا در برقراری ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">مدیریت آپدیت درون‌برنامه‌ای (In-App OTA Updates)</h2>
                <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-medium">
                  سیستم انتشار آنی
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                بدون نیاز به انتظار برای تایید مارکت‌ها، نسخه جدید را مستقیم به دست کاربران خود برسانید.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {actionSuccess && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span>در حال بارگذاری وضعیت نسخه اپلیکیشن...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Settings (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        جدیدترین نسخه منتشرشده (Latest Version):
                      </label>
                      <input
                        type="text"
                        value={latestVersion}
                        onChange={(e) => setLatestVersion(e.target.value)}
                        required
                        placeholder="1.2.0"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        حداقل نسخه مجاز (Minimum Version):
                      </label>
                      <input
                        type="text"
                        value={minVersion}
                        onChange={(e) => setMinVersion(e.target.value)}
                        required
                        placeholder="1.0.0"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Force Update Toggle */}
                  <label className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>بروزرسانی اجباری (Force Update)</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        کاربر تا زمانی که اپلیکیشن را آپدیت نکند، امکان استفاده از برنامه را نخواهد داشت.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={forceUpdate}
                      onChange={(e) => setForceUpdate(e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-0 cursor-pointer bg-slate-800 border-slate-600"
                    />
                  </label>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      لینک مستقیم دانلود فایل نصبی APK:
                    </label>
                    <input
                      type="url"
                      value={apkDownloadUrl}
                      onChange={(e) => setApkDownloadUrl(e.target.value)}
                      placeholder={`http://localhost:4000/downloads/${projectId}-v${latestVersion}.apk`}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      لینک صفحه برنامه در کافه‌بازار یا مایکت (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={marketUrl}
                      onChange={(e) => setMarketUrl(e.target.value)}
                      placeholder="bazar://details?id=ir.xiaomismart.store"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      توضیحات و تغییرات نسخه جدید (Changelog):
                    </label>
                    <textarea
                      rows={4}
                      value={changelog}
                      onChange={(e) => setChangelog(e.target.value)}
                      placeholder="• بهبود عملکرد برنامه&#10;• رفع باگ‌های جزئی"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>ذخیره و انتشار پیام آپدیت به کاربران</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Mockup Dialog in Mobile (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold px-1">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>پیش‌نمایش زنده پنجره آپدیت روی گوشی کاربر</span>
                </div>

                {/* Mobile Preview Frame */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                  <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 text-center">
                    {/* Circle Icon */}
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <ArrowUpCircle className="w-7 h-7 text-white" />
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {forceUpdate ? 'بروزرسانی ضروری اپلیکیشن' : 'نسخه جدید آماده نصب است!'}
                      </h4>
                      <div className="inline-flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-300 font-mono mt-2" dir="ltr">
                        <span>v1.0.0</span>
                        <span className="text-amber-400">➔</span>
                        <span className="text-amber-400 font-bold">v{latestVersion || '1.2.0'}</span>
                      </div>
                    </div>

                    {/* Changelog Box */}
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-right text-xs space-y-1.5">
                      <div className="text-[11px] font-bold text-white flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>تغییرات این نسخه:</span>
                      </div>
                      <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                        {changelog || '• بهبود عملکرد و سرعت برنامه'}
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
                    >
                      <Download className="w-4 h-4" />
                      <span>دانلود مستقیم نسخه جدید (v{latestVersion})</span>
                    </button>

                    {!forceUpdate && (
                      <div className="text-[11px] text-slate-500">یادآوری در دفعات بعد</div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>سرویس آپدیت OTA متصل است؛ هنگام باز شدن اپ توسط کاربر بررسی می‌شود.</span>
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
