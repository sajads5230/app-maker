'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Briefcase,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Eye,
  Sliders,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Sparkles,
  Layers,
  Palette,
  Server,
  Lock,
} from 'lucide-react';

interface WhiteLabelSetting {
  id?: string;
  projectId: string;
  brandName: string;
  logoUrl?: string | null;
  customDomain?: string | null;
  dnsVerified: boolean;
  supportPhone?: string | null;
  supportEmail?: string | null;
  hideBranding: boolean;
  customFooterText?: string | null;
  primaryColor?: string;
}

interface DnsInstructions {
  recordType: string;
  host: string;
  target: string;
  aRecord: string;
  status: string;
}

interface WhiteLabelPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function WhiteLabelPortalModal({ isOpen, onClose, projectId }: WhiteLabelPortalModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifyingDns, setVerifyingDns] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  // Form State
  const [brandName, setBrandName] = useState('آریا اپ ساز (نمایندگی رسمی)');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop');
  const [customDomain, setCustomDomain] = useState('app.myagency.ir');
  const [supportPhone, setSupportPhone] = useState('02191001234');
  const [supportEmail, setSupportEmail] = useState('support@myagency.ir');
  const [hideBranding, setHideBranding] = useState(true);
  const [customFooterText, setCustomFooterText] = useState('قدرت‌گرفته از زیرساخت ابری اختصاصی آریا اپ');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [dnsVerified, setDnsVerified] = useState(false);
  const [dnsInstructions, setDnsInstructions] = useState<DnsInstructions | null>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchSettings();
    }
  }, [isOpen, projectId]);

  const fetchSettings = async () => {
    setLoading(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/white-label`);
      const data = await res.json();
      if (data.success && data.setting) {
        setBrandName(data.setting.brandName || '');
        setLogoUrl(data.setting.logoUrl || '');
        setCustomDomain(data.setting.customDomain || '');
        setSupportPhone(data.setting.supportPhone || '');
        setSupportEmail(data.setting.supportEmail || '');
        setHideBranding(Boolean(data.setting.hideBranding));
        setCustomFooterText(data.setting.customFooterText || '');
        setPrimaryColor(data.setting.primaryColor || '#3B82F6');
        setDnsVerified(Boolean(data.setting.dnsVerified));
        if (data.dnsInstructions) {
          setDnsInstructions(data.dnsInstructions);
        }
      }
    } catch (err) {
      console.error('Failed to load white-label settings:', err);
      setActionError('خطا در دریافت تنظیمات وایت‌لیبل از سرور');
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
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/white-label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          logoUrl,
          customDomain,
          supportPhone,
          supportEmail,
          hideBranding,
          customFooterText,
          primaryColor,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionSuccess('تنظیمات وایت‌لیبل نمایندگی با موفقیت ذخیره شد.');
      } else {
        setActionError(data.error || 'خطا در ثبت تنظیمات');
      }
    } catch (err) {
      console.error('Failed to save white-label:', err);
      setActionError('خطا در برقراری ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDns = async () => {
    setVerifyingDns(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/white-label/verify-dns`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setDnsVerified(true);
        setActionSuccess(data.message || 'رکورد DNS با موفقیت تایید شد!');
      } else {
        setActionError(data.error || 'رکورد DNS یافت نشد. لطفاً چند دقیقه دیگر بررسی کنید.');
      }
    } catch (err) {
      setActionError('خطا در بررسی وضعیت DNS');
    } finally {
      setVerifyingDns(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(label);
    setTimeout(() => setCopiedRecord(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">پنل نمایندگی وایت‌لیبل (White-Label Portal)</h2>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                  Agency Reseller
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                فروش سازمانی با دامنه، برند، لوگو و هویت بصری ۱۰۰٪ اختصاصی شما (بدون نام App Maker)
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span>در حال بارگذاری تنظیمات نمایندگی...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Settings (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Branding Identity Card */}
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm border-b border-slate-800 pb-2.5">
                    <Palette className="w-4 h-4" />
                    <span>هویت بصری و برند آژانس</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        نام برند آژانس / شرکت:
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                        placeholder="مثال: آژانس توسعه نرم‌افزار نوین"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        رنگ سازمانی (Primary Color):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white font-mono text-center focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      لینک لوگوی اختصاصی (PNG شفاف):
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://youragency.com/logo.png"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-left font-mono text-xs"
                      dir="ltr"
                    />
                  </div>

                  {/* Hide Branding Switch */}
                  <div className="pt-2">
                    <label className="flex items-center justify-between p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <Lock className="w-4 h-4 text-emerald-400" />
                          <span>حذف کامل نام و نشان App Maker</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          تمام فوترها، پکیج‌ها و متون پیش‌فرض حذف شده و هویت اختصاصی شما جایگزین می‌شود.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={hideBranding}
                        onChange={(e) => setHideBranding(e.target.checked)}
                        className="w-5 h-5 rounded text-indigo-600 focus:ring-0 cursor-pointer bg-slate-800 border-slate-600"
                      />
                    </label>
                  </div>
                </div>

                {/* Custom Domain & DNS Card */}
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                      <Globe className="w-4 h-4" />
                      <span>دامنه اختصاصی پنل مشتریان (Custom Domain)</span>
                    </div>
                    {dnsVerified ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        دامنه متصل و فعال
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        در انتظار اتصال DNS
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      آدرس ساب‌دامین اختصاصی پنل:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="app.youragency.ir"
                        className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-left"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyDns}
                        disabled={verifyingDns || !customDomain}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        {verifyingDns ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        <span>بررسی DNS</span>
                      </button>
                    </div>
                  </div>

                  {/* DNS Instructions Table */}
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-indigo-400" />
                      <span>راهنمای تنظیم در کلودفلر یا پنل هاستینگ:</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 bg-slate-950 rounded-lg text-slate-400 font-mono text-[11px]" dir="ltr">
                      <div className="font-semibold text-slate-300">Type: CNAME</div>
                      <div className="font-semibold text-slate-300">Name: {customDomain ? customDomain.split('.')[0] : 'app'}</div>
                      <div className="flex items-center justify-between text-indigo-300">
                        <span>cname.appmaker.ir</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('cname.appmaker.ir', 'cname')}
                          className="hover:text-white"
                          title="کپی"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 bg-slate-950 rounded-lg text-slate-400 font-mono text-[11px]" dir="ltr">
                      <div className="font-semibold text-slate-300">Type: A</div>
                      <div className="font-semibold text-slate-300">Name: @ (یا IP)</div>
                      <div className="flex items-center justify-between text-indigo-300">
                        <span>185.143.232.10</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('185.143.232.10', 'ip')}
                          className="hover:text-white"
                          title="کپی"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {copiedRecord && (
                      <p className="text-[11px] text-emerald-400 text-center">
                        رکورد {copiedRecord} در کلیپ‌بورد کپی شد!
                      </p>
                    )}
                  </div>
                </div>

                {/* Support & Contact Card */}
                <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm border-b border-slate-800 pb-2.5">
                    <Phone className="w-4 h-4" />
                    <span>اطلاعات تماس و پشتیبانی برای مشتریان شما</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        شماره تلفن پشتیبانی آژانس:
                      </label>
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        placeholder="02191001234"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-left"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        ایمیل پشتیبانی آژانس:
                      </label>
                      <input
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="support@agency.ir"
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      متن کپی‌رایت فوتر پنل و اپلیکیشن‌ها:
                    </label>
                    <input
                      type="text"
                      value={customFooterText}
                      onChange={(e) => setCustomFooterText(e.target.value)}
                      placeholder="قدرت‌گرفته از زیرساخت ابری نام شرکت شما"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>ذخیره کلیه تنظیمات نمایندگی</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Mockup / Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold px-1">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>پیش‌نمایش زنده پنل اختصاصی مشتریان شما</span>
                </div>

                {/* Mockup Frame */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
                  {/* Browser Bar */}
                  <div className="bg-slate-900/90 rounded-xl p-2.5 flex items-center gap-2 border border-slate-800" dir="ltr">
                    <div className="flex items-center gap-1.5 pl-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex-1 bg-slate-950 rounded-lg py-1 px-3 text-[11px] text-slate-400 font-mono text-center truncate border border-slate-800/80">
                      https://{customDomain || 'app.youragency.ir'}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 pr-1" />
                  </div>

                  {/* Mockup Client Dashboard View */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-5 text-center">
                    {/* Agency Brand & Logo */}
                    <div className="flex flex-col items-center gap-2">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={brandName}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {brandName ? brandName.charAt(0) : 'A'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base">{brandName || 'برند نمایندگی'}</h4>
                        <p className="text-xs text-slate-400">سامانه ابری ساخت و مدیریت اپلیکیشن</p>
                      </div>
                    </div>

                    {/* Fake Project List Card inside Preview */}
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-right space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">پروژه فعال کاربر شما:</span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ backgroundColor: primaryColor }}
                        >
                          فعال
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">فروشگاه آنلاین شیائومی اسمارت</p>
                    </div>

                    {/* Support Card */}
                    <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs space-y-1 text-slate-400">
                      <div className="flex justify-between items-center text-[11px]">
                        <span>تلفن تماس مستقیم:</span>
                        <span className="text-white font-mono">{supportPhone || '---'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span>پشتیبانی:</span>
                        <span className="text-white font-mono">{supportEmail || '---'}</span>
                      </div>
                    </div>

                    {/* Footer in Preview */}
                    <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      {hideBranding ? (
                        <span>{customFooterText || 'تمامی حقوق متعلق به شرکت شماست.'}</span>
                      ) : (
                        <span className="text-slate-600">قدرت‌گرفته از App Maker</span>
                      )}
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>گواهینامه SSL رایگان خودکار</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2 text-slate-300">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>بدون هیچ نامی از اپ‌میکر</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ماژول وایت‌لیبل فعال: به تمام کلاینت‌های سازمانی شما اجازه می‌دهد تا با نام شما کار کنند.</span>
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
