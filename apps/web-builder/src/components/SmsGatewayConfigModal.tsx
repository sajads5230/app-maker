'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Key,
  Smartphone,
  Radio,
  Save,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface SmsGatewaySettings {
  activeProvider: 'kavenegar' | 'farazsms' | 'melipayamak' | 'simulator';
  kavenegarApiKey: string;
  kavenegarTemplate: string;
  farazSmsApiKey: string;
  farazSmsPattern: string;
  farazSmsSender: string;
  meliPayamakUsername: string;
  meliPayamakPassword: string;
  meliPayamakSender: string;
  isTestMode: boolean;
}

interface SmsGatewayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmsGatewayConfigModal({ isOpen, onClose }: SmsGatewayConfigModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testPhone, setTestPhone] = useState('09121234567');
  const [statusMessage, setStatusMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const [settings, setSettings] = useState<SmsGatewaySettings>({
    activeProvider: 'kavenegar',
    kavenegarApiKey: '',
    kavenegarTemplate: 'verify',
    farazSmsApiKey: '',
    farazSmsPattern: '',
    farazSmsSender: '+983000505',
    meliPayamakUsername: '',
    meliPayamakPassword: '',
    meliPayamakSender: '5000400',
    isTestMode: true,
  });

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/auth/sms/config');
      const data = await res.json();
      if (data.success && data.config) {
        setSettings(data.config);
      }
    } catch (_) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);
      const res = await fetch('http://localhost:4000/api/auth/sms/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ text: 'تنظیمات درگاه پیامک با موفقیت ذخیره شد.', ok: true });
      } else {
        setStatusMessage({ text: data.error || 'خطا در ذخیره تنظیمات.', ok: false });
      }
    } catch (e: any) {
      setStatusMessage({ text: 'خطا در برقراری ارتباط با سرور: ' + e.message, ok: false });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!testPhone.trim() || !/^09[0-9]{9}$/.test(testPhone.trim())) {
      setStatusMessage({ text: 'لطفاً یک شماره موبایل معتبر ۱۱ رقمی (با ۰۹) وارد کنید.', ok: false });
      return;
    }

    try {
      setTesting(true);
      setStatusMessage(null);
      const res = await fetch('http://localhost:4000/api/auth/sms/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testPhone.trim(),
          message: `کد تایید ورود به اپلیکیشن: ${Math.floor(10000 + Math.random() * 90000)} (تست اتصال پلتفرم اپ‌ساز)`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          text: `پیامک تست با موفقیت ارسال شد! شناسه پیگیری: ${data.details?.messageId || 'OK'}`,
          ok: true,
        });
      } else {
        setStatusMessage({ text: data.message || 'خطا در ارسال پیامک تست.', ok: false });
      }
    } catch (e: any) {
      setStatusMessage({ text: 'خطا در اتصال به درگاه پیامک: ' + e.message, ok: false });
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                تنظیمات درگاه پیامک و احراز هویت OTP
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-normal">
                  سرویس خدماتی بدون بلک‌لیست
                </span>
              </h2>
              <p className="text-xs text-slate-400">اتصال به کاوه‌نگار، فراز اس‌ام‌اس و ملی‌پیامک جهت ارسال سریع رمز یکبار مصرف</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 text-sm border animate-fadeIn ${
                statusMessage.ok
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
              }`}
            >
              {statusMessage.ok ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              انتخاب سامانه پیامکی فعال
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'kavenegar', name: 'کاوه‌نگار', desc: 'پترن Lookup سریع', badge: 'پیشنهادی' },
                { id: 'farazsms', name: 'فراز اس‌ام‌اس', desc: 'IPPanel Pattern', badge: 'محبوب' },
                { id: 'melipayamak', name: 'ملی‌پیامک', desc: 'وب‌سرویس پترن', badge: 'سازمانی' },
                { id: 'simulator', name: 'شبیه‌ساز تستی', desc: 'حالت دولوپر محلی', badge: 'رایگان' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, activeProvider: prov.id as any })}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between relative ${
                    settings.activeProvider === prov.id
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-slate-200">{prov.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">{prov.badge}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{prov.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Provider Specific Settings */}
          {settings.activeProvider === 'kavenegar' && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Key className="w-4 h-4" />
                تنظیمات وب‌سرویس کاوه‌نگار (Kavenegar Lookup)
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">API Key اختصاصی کاوه‌نگار</label>
                  <input
                    type="password"
                    value={settings.kavenegarApiKey}
                    onChange={(e) => setSettings({ ...settings, kavenegarApiKey: e.target.value })}
                    placeholder="مثلاً: 4A53646F7A...6D45743D"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">نام الگوی تایید (Template Pattern)</label>
                  <input
                    type="text"
                    value={settings.kavenegarTemplate}
                    onChange={(e) => setSettings({ ...settings, kavenegarTemplate: e.target.value })}
                    placeholder="مثلاً: verify یا otp"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
                    dir="ltr"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">الگویی که در پنل کاوه‌نگار برای عبور از بلک‌لیست تبلیغاتی تعریف کرده‌اید (پارامتر %token).</p>
                </div>
              </div>
            </div>
          )}

          {settings.activeProvider === 'farazsms' && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Key className="w-4 h-4" />
                تنظیمات فراز اس‌ام‌اس / IPPanel
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">API Key وب‌سرویس فراز</label>
                  <input
                    type="password"
                    value={settings.farazSmsApiKey}
                    onChange={(e) => setSettings({ ...settings, farazSmsApiKey: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">کد پترن (Pattern Code)</label>
                  <input
                    type="text"
                    value={settings.farazSmsPattern}
                    onChange={(e) => setSettings({ ...settings, farazSmsPattern: e.target.value })}
                    placeholder="مثلاً: 120594"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {settings.activeProvider === 'melipayamak' && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Key className="w-4 h-4" />
                تنظیمات سامانه ملی‌پیامک
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">نام کاربری ملی‌پیامک</label>
                  <input
                    type="text"
                    value={settings.meliPayamakUsername}
                    onChange={(e) => setSettings({ ...settings, meliPayamakUsername: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">کلمه عبور وب‌سرویس</label>
                  <input
                    type="password"
                    value={settings.meliPayamakPassword}
                    onChange={(e) => setSettings({ ...settings, meliPayamakPassword: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <div>
              <div className="text-sm font-semibold text-white">حالت شبیه‌سازی و تست بدون کسر شارژ</div>
              <div className="text-xs text-slate-400">در این حالت، پیامک‌ها در لاگ سرور چاپ می‌شوند تا شارژ پیامکی پنل شما مصرف نشود.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isTestMode}
                onChange={(e) => setSettings({ ...settings, isTestMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Live SMS Testing Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                تست بلادرنگ ارسال پیامک به گوشی
              </span>
              <span className="text-[11px] text-slate-400">تست تحویل سریع زیر ۵ ثانیه</span>
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="09121234567"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono text-center"
                dir="ltr"
              />
              <button
                type="button"
                onClick={handleSendTest}
                disabled={testing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                ارسال پیامک تست
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            تضمین عبور ۱۰۰٪ از لیست سیاه مخابرات با الگوی خدماتی
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              ذخیره تنظیمات درگاه پیامک
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
