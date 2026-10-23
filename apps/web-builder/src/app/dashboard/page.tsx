'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { STORE_TEMPLATES, StoreTemplate } from '@/lib/templates';
import { StoreCatalogModal } from '@/components/StoreCatalogModal';
import BroadcastNotificationModal from '@/components/BroadcastNotificationModal';
import { AbandonedCartModal } from '@/components/AbandonedCartModal';
import { SourceExportModal } from '@/components/SourceExportModal';
import { CustomFormManagerModal } from '@/components/CustomFormManagerModal';
import { LoyaltyClubModal } from '@/components/LoyaltyClubModal';
import { DokanMarketplaceModal } from '@/components/DokanMarketplaceModal';
import { WhiteLabelPortalModal } from '@/components/WhiteLabelPortalModal';
import { AiAppGeneratorModal } from '@/components/AiAppGeneratorModal';
import { AppUpdateModal } from '@/components/AppUpdateModal';
import { AppAnalyticsModal } from '@/components/AppAnalyticsModal';
import { InvoiceModal } from '@/components/InvoiceModal';
import { StoreReleaseModal } from '@/components/StoreReleaseModal';
import { LiveHealthMonitoringModal } from '@/components/LiveHealthMonitoringModal';
import { SupportDeskModal } from '@/components/SupportDeskModal';
import { MigrationWizardModal } from '@/components/MigrationWizardModal';

interface Project {
  id: string;
  name: string;
  packageName: string;
  version: string;
  updatedAt: string;
}

interface SubscriptionInfo {
  plan?: string;
  daysRemaining?: number;
  quota?: {
    allowed: boolean;
    remainingBuilds: number;
    usedBuilds: number;
    planName: string;
  };
}

interface BuildHistoryJob {
  id: string;
  platform: string;
  status: string;
  downloadUrl?: string;
  aabUrl?: string;
  keystoreUrl?: string;
  createdAt: string;
  project?: { name: string; packageName: string };
}

interface CurrentUser {
  id: string;
  name?: string;
  phone: string;
  role: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [buildHistory, setBuildHistory] = useState<BuildHistoryJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [buildingProjectId, setBuildingProjectId] = useState<string | null>(null);
  const [storeCatalogProjectId, setStoreCatalogProjectId] = useState<string | null>(null);
  const [pushProjectId, setPushProjectId] = useState<string | null>(null);
  const [exportSourceProject, setExportSourceProject] = useState<Project | null>(null);
  const [abandonedCartProjectId, setAbandonedCartProjectId] = useState<string | null>(null);
  const [formManagerProjectId, setFormManagerProjectId] = useState<string | null>(null);
  const [loyaltyProjectId, setLoyaltyProjectId] = useState<string | null>(null);
  const [dokanProjectId, setDokanProjectId] = useState<string | null>(null);
  const [whiteLabelProjectId, setWhiteLabelProjectId] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [updateProjectId, setUpdateProjectId] = useState<string | null>(null);
  const [analyticsProjectId, setAnalyticsProjectId] = useState<string | null>(null);
  const [releaseModalProject, setReleaseModalProject] = useState<Project | null>(null);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // Auth Modal state
  const [authStep, setAuthStep] = useState<'PHONE' | 'CODE'>('PHONE');
  const [authPhone, setAuthPhone] = useState('09121234567');
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authSimulatedMsg, setAuthSimulatedMsg] = useState<string | null>(null);

  // New project form
  const [newAppName, setNewAppName] = useState('');
  const [newPackageName, setNewPackageName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<StoreTemplate>(STORE_TEMPLATES[0]);
  const [creatingApp, setCreatingApp] = useState(false);

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('appmaker_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const backup = localStorage.getItem('admin_backup_token');
      if (backup) {
        setIsImpersonating(true);
      }
    }
    checkCurrentUser();
    fetchDashboardData();
  }, []);

  const handleExitImpersonation = () => {
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('admin_backup_token');
      if (adminToken) {
        localStorage.setItem('appmaker_token', adminToken);
        localStorage.removeItem('admin_backup_token');
        localStorage.removeItem('impersonated_user_name');
        window.location.href = '/admin';
      }
    }
  };

  const checkCurrentUser = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('appmaker_token') : null;
      if (token) {
        const res = await fetch('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      }
    } catch (_) {}
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch user projects with JWT
      const projRes = await fetch('http://localhost:4000/api/projects', {
        headers: getHeaders(),
      });
      const projData = await projRes.json();
      if (projData.projects) {
        setProjects(projData.projects);
      }

      // 2. Fetch subscription & quota info
      const subRes = await fetch('http://localhost:4000/api/subscriptions/my-subscription', {
        headers: getHeaders(),
      });
      const subData = await subRes.json();
      if (subData.success) {
        setSubInfo(subData);
      }

      // 3. Fetch build history for primary project
      const historyRes = await fetch('http://localhost:4000/api/build/project/app-demo-techmarket');
      const historyData = await historyRes.json();
      if (historyData.jobs) {
        setBuildHistory(historyData.jobs);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // SMS OTP Request
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: authPhone.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthStep('CODE');
        if (data.simulated) {
          setAuthSimulatedMsg('کد پیامکی آزمایشی: ۱۲۳۴۵ (یا کد ۵ رقمی لاگ سرور)');
        }
      } else {
        setAuthError(data.error || 'خطا در ارسال پیامک.');
      }
    } catch (err) {
      setAuthError('خطا در ارتباط با سرور احراز هویت.');
    } finally {
      setAuthLoading(false);
    }
  };

  // SMS OTP Verify
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: authPhone.trim(), code: authCode.trim() }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('appmaker_token', data.token);
        setCurrentUser(data.user);
        setShowAuthModal(false);
        setAuthStep('PHONE');
        setAuthCode('');
        fetchDashboardData();
      } else {
        setAuthError(data.error || 'کد تایید نامعتبر است.');
      }
    } catch (err) {
      setAuthError('خطا در اعتبارسنجی کد.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('appmaker_token');
    setCurrentUser(null);
    fetchDashboardData();
  };

  const handleCreateNewApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    try {
      setCreatingApp(true);
      const pkg = newPackageName.trim() || `ir.${newAppName.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'app'}.store`;

      const response = await fetch('http://localhost:4000/api/projects', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: newAppName.trim(),
          packageName: pkg,
          config: selectedTemplate.config,
        }),
      });

      const data = await response.json();
      if (data.success && data.project) {
        setShowCreateModal(false);
        setNewAppName('');
        setNewPackageName('');
        window.location.href = `/?project=${data.project.id}`;
      }
    } catch (err) {
      alert('خطا در ساخت اپلیکیشن جدید. لطفاً مجدداً تلاش فرمایید.');
    } finally {
      setCreatingApp(false);
    }
  };

  const handleTriggerBuild = async (projectId: string) => {
    try {
      setBuildingProjectId(projectId);
      const res = await fetch('http://localhost:4000/api/build/trigger', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ projectId, platform: 'ALL' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('درخواست بیلد ابری در محیط ایزوله سندباکس آغاز شد. نتیجه تا لحظاتی دیگر در جدول تاریخچه قرار می‌گیرد.');
        fetchDashboardData();
      } else {
        alert(data.error || 'خطا در ثبت درخواست بیلد.');
      }
    } catch (err) {
      alert('خطا در ارتباط با سرور بیلد.');
    } finally {
      setBuildingProjectId(null);
    }
  };

  const handleCheckoutPlan = async (planId: string) => {
    try {
      const res = await fetch('http://localhost:4000/api/subscriptions/checkout', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      alert('خطا در اتصال به درگاه بانکی شاپرک.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-lg sticky top-0 z-50 border-b border-amber-400/30" dir="rtl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>حالت مشاهده پنل مشتری: شما به عنوان سوپرادمین در حال مشاهده و مدیریت پنل کاربری «{currentUser?.name || currentUser?.phone || 'مشتری'}» هستید.</span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="bg-black/40 hover:bg-black/60 text-white px-3.5 py-1.5 rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer text-xs font-bold shadow-sm"
          >
            <span>🔙 خروج و بازگشت به پنل سوپرادمین</span>
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-white shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
                AM
              </div>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                App Maker SaaS
              </span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              داشبورد تجاری مدیریت
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 transition-colors"
            >
              صفحه اصلی
            </Link>

            {/* Live Server Telemetry */}
            <button
              onClick={() => setShowMonitoringModal(true)}
              className="text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="مانیتورینگ سلامت سرور، تاخیر دیتابیس و لاگ‌های زنده"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>سلامت سرور</span>
            </button>

            {/* Support Desk */}
            <button
              onClick={() => setShowSupportModal(true)}
              className="text-xs font-bold text-blue-300 hover:text-white px-3 py-1.5 rounded-lg border border-blue-800/40 bg-blue-950/40 hover:bg-blue-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="پشتیبانی آنلاین و دستیار هوشمند ۲۴ ساعته"
            >
              <span>پشتیبانی آنلاین</span>
            </button>

            <Link
              href="/admin"
              className="text-xs font-bold text-rose-300 hover:text-white px-3 py-1.5 rounded-lg border border-rose-800/40 bg-rose-950/40 hover:bg-rose-900/60 transition-colors flex items-center gap-1.5"
            >
              <span>پنل سوپرادمین</span>
            </Link>

            <Link
              href="/builder"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              ورود به استودیو
            </Link>

            <div className="flex items-center gap-3 pr-3 border-r border-slate-800">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-200">{currentUser.name || currentUser.phone}</div>
                    <div className="text-[10px] text-emerald-400 font-medium">کاربر تاییدشده پیامکی</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="خروج از حساب"
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 transition-colors"
                  >
                    ⎋
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                >
                  ورود پیامکی (OTP)
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Account Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
            <div className="text-xs font-medium text-slate-400 mb-1">پلن اشتراک تجاری</div>
            <div className="text-xl font-black text-white flex items-center gap-2">
              <span>{subInfo?.quota?.planName || 'مادام‌العمر سازمانی'}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                فعال
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              اعتبار: {subInfo?.daysRemaining || 3650} روز باقی‌مانده
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                تمدید یا تغییر پلن ←
              </button>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                فاکتورهای رسمی
              </button>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="text-xs font-medium text-slate-400 mb-1">سهمیه بیلد ابری ماهانه</div>
            <div className="text-xl font-black text-emerald-400">
              {subInfo?.quota?.remainingBuilds?.toLocaleString('fa-IR') || '۹,۹۹۱'}
              <span className="text-xs font-normal text-slate-400 mr-1.5">بیلد باقی‌مانده</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[98%]" />
            </div>
            <div className="text-[10px] text-slate-500 mt-1">بیلد بدون صف و ایزوله سندباکس</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="text-xs font-medium text-slate-400 mb-1">پروژه‌های ثبت‌شده</div>
            <div className="text-xl font-black text-white">
              {projects.length}
              <span className="text-xs font-normal text-slate-400 mr-1.5">اپلیکیشن فعال</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">پشتیبانی از چندمستأجری ایزوله</div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-bold"
            >
              + ثبت پروژه جدید
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="text-xs font-medium text-slate-400 mb-1">امنیت امضای دیجیتال (Release)</div>
            <div className="text-xl font-black text-rose-400 flex items-center gap-1.5">
              <span>Keystore 2048</span>
              <span className="text-xs bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">RSA</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 truncate">سازگار با کافه‌بازار و مایکت</div>
            <a
              href="http://localhost:4000/downloads/ir.techmarket.app-release-keystore.jks"
              download
              className="mt-3 inline-block text-xs text-slate-300 hover:text-white underline decoration-slate-600"
            >
              دانلود بکاپ کلید (.jks)
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">اپلیکیشن‌های من</h2>
              <p className="text-xs text-slate-400">لیست اپلیکیشن‌های طراحی‌شده، وضعیت بیلدها و خروجی‌های مارکت‌ها</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all"
              >
                <span className="text-sm">✨</span>
                <span>تولید با هوش مصنوعی (AI)</span>
              </button>
                            <button
                onClick={() => setShowMigrationModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                title="مهاجرت و انتقال پروژه از پازلی، مستراپ، جو‌اپ و وب‌تو‌اپ"
              >
                <span className="text-sm">🔄</span>
                <span>مهاجرت از سایر اپ‌سازها</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                قالب‌های دستی
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">در حال بارگذاری اطلاعات...</div>
          ) : projects.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="text-sm font-bold text-white mb-1">هنوز هیچ اپلیکیشنی نساخته‌اید!</h3>
              <p className="text-xs text-slate-400 mb-4">می‌توانید با انتخاب یکی از قالب‌های آماده در چند ثانیه شروع کنید.</p>
                            <button
                onClick={() => setShowMigrationModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                title="مهاجرت و انتقال پروژه از پازلی، مستراپ، جو‌اپ و وب‌تو‌اپ"
              >
                <span className="text-sm">🔄</span>
                <span>مهاجرت از سایر اپ‌سازها</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold"
              >
                ساخت اولین اپلیکیشن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-xl shadow-md">
                          {proj.id.includes('tech') ? '💻' : proj.id.includes('limoo') || proj.name.includes('مد') ? '👗' : '📱'}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">
                            {proj.name}
                          </h3>
                          <div className="text-[11px] font-mono text-slate-400" dir="ltr">
                            {proj.packageName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                        v{proj.version || '1.0.0'}
                      </span>
                    </div>

                    <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-850 space-y-1.5 text-[11px] mb-4">
                      <div className="flex justify-between text-slate-400">
                        <span>نوع معماری:</span>
                        <span className="text-emerald-400 font-bold">Server-Driven UI</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>کد امضا:</span>
                        <span className="text-slate-300 font-mono">SHA-256 Validated</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex gap-2">
                      <Link
                        href={`/builder?projectId=${proj.id}`}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        ویرایش در استودیو
                      </Link>

                      <button
                        onClick={() => handleTriggerBuild(proj.id)}
                        disabled={buildingProjectId === proj.id}
                        className="py-2 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {buildingProjectId === proj.id ? 'در حال ارسال...' : '🔨 بیلد ابری'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setStoreCatalogProjectId(proj.id)}
                        className="py-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        کاتالوگ و کالاها
                      </button>
                      <button
                        onClick={() => setPushProjectId(proj.id)}
                        className="py-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        ارسال اعلان
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAbandonedCartProjectId(proj.id)}
                        className="py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-amber-400">🛍️</span>
                        سبد رها شده
                      </button>
                      <button
                        onClick={() => setExportSourceProject(proj)}
                        className="py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-cyan-400">⚡</span>
                        سورس کامل فلاتر
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFormManagerProjectId(proj.id)}
                        className="py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-blue-400">📝</span>
                        فرم‌ساز اختصاصی
                      </button>
                      <button
                        onClick={() => setLoyaltyProjectId(proj.id)}
                        className="py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-amber-400">👑</span>
                        باشگاه مشتریان
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDokanProjectId(proj.id)}
                        className="py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-teal-400">🏪</span>
                        مارکت‌پلیس دکان
                      </button>
                      <button
                        onClick={() => setWhiteLabelProjectId(proj.id)}
                        className="py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-indigo-400">🏢</span>
                        پنل نمایندگی
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setUpdateProjectId(proj.id)}
                        className="py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-blue-400">🚀</span>
                        آپدیت درون‌برنامه
                      </button>
                      <button
                        onClick={() => setAnalyticsProjectId(proj.id)}
                        className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="text-emerald-400">📊</span>
                        آمار و رفتار کاربران
                      </button>
                    </div>

                    <button
                      onClick={() => setReleaseModalProject(proj)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-cyan-500/15 hover:from-teal-500/25 hover:to-cyan-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>🏪 انتشار در بازار و مایکت (تست سازگاری)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                      <a
                        href={`http://localhost:4000/downloads/${proj.packageName}-v${proj.version || '1.0.0'}.apk`}
                        download
                        className="py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 transition-colors"
                      >
                        دانلود APK مستقیم
                      </a>
                      <a
                        href={`http://localhost:4000/downloads/${proj.packageName}-v${proj.version || '1.0.0'}.aab`}
                        download
                        className="py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-amber-300 border border-slate-750 transition-colors"
                      >
                        باندل AAB بازار/مایکت
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Store Templates Showcase */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">کتابخانه قالب‌های آماده اصناف</h2>
              <p className="text-xs text-slate-400">انتخاب و ساخت فوری فروشگاه متناسب با کسب‌وکار شما</p>
            </div>
            <span className="text-xs text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
              ۱۴ صنف تخصصی
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {STORE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplate(tmpl);
                  setShowCreateModal(true);
                }}
                className="bg-slate-950/60 border border-slate-800 hover:border-rose-500/40 rounded-xl p-3.5 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.theme.primaryColor }}
                    />
                  </div>
                  <h4 className="font-bold text-xs text-white mb-1 line-clamp-1">{tmpl.name}</h4>
                  <span className="text-[9.5px] text-slate-400 block mb-1">{tmpl.category}</span>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{tmpl.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">{tmpl.sampleBlocksCount} بلوک دیزاین</span>
                  <span className="text-rose-400 font-bold">انتخاب قالب ←</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Build History Table */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">تاریخچه آخرین بسته‌های تجاری ساخته‌شده (Build Logs)</h2>
            <button
              onClick={fetchDashboardData}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              🔄 به‌روزرسانی وضعیت
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-bold">شناسه خروجی</th>
                  <th className="py-3 px-4 font-bold">نوع خروجی</th>
                  <th className="py-3 px-4 font-bold">وضعیت کامپایل</th>
                  <th className="py-3 px-4 font-bold">تاریخ ساخت</th>
                  <th className="py-3 px-4 font-bold">دانلود بسته‌ها</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {buildHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      هنوز هیچ سابقه‌ای برای این پروژه ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  buildHistory.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{job.id.slice(0, 13)}...</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                          {job.platform}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {job.status === 'SUCCESS' ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            ✓ موفق (آماده مارکت‌ها)
                          </span>
                        ) : job.status === 'BUILDING' ? (
                          <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                            ⚙ در حال ساخت...
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold">خطا</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(job.createdAt).toLocaleDateString('fa-IR')} - {new Date(job.createdAt).toLocaleTimeString('fa-IR')}
                      </td>
                      <td className="py-3 px-4">
                        {job.status === 'SUCCESS' && (
                          <div className="flex gap-2 text-[10px]">
                            {job.downloadUrl && (
                              <a
                                href={`http://localhost:4000${job.downloadUrl}`}
                                download
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold"
                              >
                                APK
                              </a>
                            )}
                            {job.aabUrl && (
                              <a
                                href={`http://localhost:4000${job.aabUrl}`}
                                download
                                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-bold"
                              >
                                AAB بازار
                              </a>
                            )}
                            {job.keystoreUrl && (
                              <a
                                href={`http://localhost:4000${job.keystoreUrl}`}
                                download
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded"
                              >
                                Keystore
                              </a>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal: SMS OTP Auth */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">ورود / ثبت‌نام با پیامک</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            {authStep === 'PHONE' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">شماره موبایل</label>
                  <input
                    type="tel"
                    required
                    placeholder="09121234567"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono text-center text-sm"
                  />
                </div>

                {authError && <div className="text-rose-400 text-xs font-bold">{authError}</div>}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {authLoading ? 'در حال ارسال پیامک...' : 'دریافت کد تایید ۵ رقمی'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    کد تایید ارسال‌شده به {authPhone}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="•••••"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    dir="ltr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono text-center tracking-widest text-lg font-bold"
                  />
                </div>

                {authSimulatedMsg && (
                  <div className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    {authSimulatedMsg}
                  </div>
                )}

                {authError && <div className="text-rose-400 text-xs font-bold">{authError}</div>}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthStep('PHONE')}
                    className="flex-1 py-2 rounded-xl border border-slate-800 text-xs text-slate-400"
                  >
                    تغییر شماره
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading || authCode.length < 4}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {authLoading ? 'در حال بررسی...' : 'تایید و ورود'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create New App */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">ساخت اپلیکیشن جدید</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewApp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">نام اپلیکیشن / فروشگاه</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: فروشگاه ورزشی رکورد"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">شناسه پکیج اندروید (Package Name)</label>
                <input
                  type="text"
                  placeholder="ir.mybusiness.app (اختیاری)"
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>انتخاب قالب اولیه صنف کسب‌وکار</span>
                  <span className="text-[10px] text-rose-400 font-normal">۱۴ قالب فعال</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {STORE_TEMPLATES.map((tmpl) => (
                    <button
                      type="button"
                      key={tmpl.id}
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`text-right p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2 ${
                        selectedTemplate.id === tmpl.id
                          ? 'bg-rose-500/10 border-rose-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-lg shrink-0">{tmpl.icon}</span>
                      <div className="truncate text-right">
                        <span className="truncate block font-bold text-[11px]">{tmpl.name}</span>
                        <span className="text-[9.5px] text-slate-500 block truncate">{tmpl.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={creatingApp || !newAppName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {creatingApp ? 'در حال ایجاد...' : '✓ ایجاد و ورود به استودیو'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upgrade Plan */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">انتخاب و ارتقای اشتراک App Maker</h3>
                <p className="text-xs text-slate-400">اتصال مستقیم به شبکه پرداخت الکترونیک شاپرک</p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">پلن پایه (۴ ماهه)</h4>
                  <div className="text-lg font-black text-slate-200 mt-2">۲,۲۰۰,۰۰۰ <span className="text-xs font-normal">تومان</span></div>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 mt-3">
                    <li>✓ ۵ بیلد ابری در ماه</li>
                    <li>✓ خروجی APK و AAB</li>
                    <li>✓ همگام‌سازی ووکامرس</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleCheckoutPlan('plan_basic')}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                >
                  انتخاب پلن پایه
                </button>
              </div>

              <div className="bg-slate-950 border-2 border-rose-500 rounded-xl p-4 flex flex-col justify-between relative shadow-lg shadow-rose-500/10">
                <span className="absolute -top-3 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  پیشنهاد ویژه
                </span>
                <div>
                  <h4 className="font-bold text-sm text-white">کسب‌وکار حرفه‌ای (سالیانه)</h4>
                  <div className="text-lg font-black text-rose-400 mt-2">۱۳,۵۰۰,۰۰۰ <span className="text-xs font-normal">تومان</span></div>
                  <ul className="text-[11px] text-slate-300 space-y-1.5 mt-3">
                    <li>✓ ۵۰ بیلد ابری در ماه</li>
                    <li>✓ بدون واترمارک</li>
                    <li>✓ اتصال همه ۲۹ ماژول بازارچه</li>
                    <li>✓ کلید اختصاصی Keystore</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleCheckoutPlan('plan_pro')}
                  className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  خرید و پرداخت شاپرک
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">مادام‌العمر سازمانی</h4>
                  <div className="text-lg font-black text-emerald-400 mt-2">۲۱,۹۰۰,۰۰۰ <span className="text-xs font-normal">تومان</span></div>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 mt-3">
                    <li>✓ بیلد کاملاً نامحدود</li>
                    <li>✓ یک‌بار پرداخت دائمی</li>
                    <li>✓ پشتیبانی VIP مستقیم</li>
                    <li>✓ امکان نصب سورس روی سرور</li>
                  </ul>
                </div>
                <button
                  onClick={() => handleCheckoutPlan('plan_lifetime')}
                  className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  خرید پلن مادام‌العمر
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Store & Catalog Manager Modal */}
      {storeCatalogProjectId && (
        <StoreCatalogModal
          isOpen={Boolean(storeCatalogProjectId)}
          onClose={() => setStoreCatalogProjectId(null)}
          projectId={storeCatalogProjectId}
          storeMode="standalone"
          setStoreMode={() => {}}
        />
      )}

      {/* Broadcast Notification Modal */}
      {pushProjectId && (
        <BroadcastNotificationModal
          isOpen={Boolean(pushProjectId)}
          onClose={() => setPushProjectId(null)}
          projectId={pushProjectId}
        />
      )}

      {/* Abandoned Cart Recovery Modal */}
      {abandonedCartProjectId && (
        <AbandonedCartModal
          isOpen={Boolean(abandonedCartProjectId)}
          onClose={() => setAbandonedCartProjectId(null)}
          projectId={abandonedCartProjectId}
        />
      )}

      {/* Flutter Source Code Export Modal */}
      {exportSourceProject && (
        <SourceExportModal
          isOpen={Boolean(exportSourceProject)}
          onClose={() => setExportSourceProject(null)}
          projectId={exportSourceProject.id}
          projectName={exportSourceProject.name}
          packageName={exportSourceProject.packageName}
        />
      )}

      {/* Custom Form Manager Modal */}
      {formManagerProjectId && (
        <CustomFormManagerModal
          isOpen={Boolean(formManagerProjectId)}
          onClose={() => setFormManagerProjectId(null)}
          projectId={formManagerProjectId}
        />
      )}

      {/* Loyalty Club Modal */}
      {loyaltyProjectId && (
        <LoyaltyClubModal
          isOpen={Boolean(loyaltyProjectId)}
          onClose={() => setLoyaltyProjectId(null)}
          projectId={loyaltyProjectId}
        />
      )}

      {/* Dokan Multi-Vendor Modal */}
      {dokanProjectId && (
        <DokanMarketplaceModal
          isOpen={Boolean(dokanProjectId)}
          onClose={() => setDokanProjectId(null)}
          projectId={dokanProjectId}
        />
      )}

      {/* White-Label Reseller Portal Modal */}
      {whiteLabelProjectId && (
        <WhiteLabelPortalModal
          isOpen={Boolean(whiteLabelProjectId)}
          onClose={() => setWhiteLabelProjectId(null)}
          projectId={whiteLabelProjectId}
        />
      )}

      {/* AI App Generator Modal */}
      <AiAppGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onProjectCreated={() => fetchDashboardData()}
      />

      {/* In-App OTA Update Modal */}
      {updateProjectId && (
        <AppUpdateModal
          isOpen={Boolean(updateProjectId)}
          onClose={() => setUpdateProjectId(null)}
          projectId={updateProjectId}
        />
      )}

      {/* App Analytics & Heatmap Modal */}
      {analyticsProjectId && (
        <AppAnalyticsModal
          isOpen={Boolean(analyticsProjectId)}
          onClose={() => setAnalyticsProjectId(null)}
          projectId={analyticsProjectId}
        />
      )}

      {/* Official Tax Invoice & Financial Receipts Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />

      {/* Store Release & Compatibility Modal */}
      {releaseModalProject && (
        <StoreReleaseModal
          isOpen={Boolean(releaseModalProject)}
          onClose={() => setReleaseModalProject(null)}
          projectId={releaseModalProject.id}
          appName={releaseModalProject.name}
          packageName={releaseModalProject.packageName}
        />
      )}

      {/* Live Health & Telemetry Modal */}
      <LiveHealthMonitoringModal
        isOpen={showMonitoringModal}
        onClose={() => setShowMonitoringModal(false)}
      />

      {/* 24/7 Support Desk Modal */}
      <SupportDeskModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      {/* 3-Step Migration Wizard Modal */}
      <MigrationWizardModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        onMigrationComplete={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
}
