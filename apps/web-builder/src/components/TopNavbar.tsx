"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  Smartphone,
  Tablet,
  Moon,
  Sun,
  Puzzle,
  FolderOpen,
  LayoutGrid,
  Sparkles,
  Save,
  Download,
  Bell,
  QrCode,
  ShieldCheck,
  Home,
  ShoppingBag,
  ShoppingCart,
  Code2,
  FileText,
  Award,
  Store,
  Briefcase,
  Wand2,
  ArrowUpCircle,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sliders,
  ExternalLink,
  Zap,
  Globe,
  Crown,
  Receipt,
  Activity,
  LifeBuoy,
  MessageSquare,
} from "lucide-react";

interface TopNavbarProps {
  appName: string;
  setAppName: (name: string) => void;
  packageName: string;
  setPackageName?: (pkg: string) => void;
  appIconUrl: string;
  onOpenIconPicker: () => void;
  previewDevice: "iphone" | "samsung" | "tablet";
  setPreviewDevice: (device: "iphone" | "samsung" | "tablet") => void;
  isDarkModePreview: boolean;
  setIsDarkModePreview: (dark: boolean) => void;
  enabledPluginsCount: number;
  onOpenPluginMarket: () => void;
  onOpenMediaModal: () => void;
  onOpenTemplateModal: () => void;
  onOpenStoreManager?: () => void;
  onOpenAbandonedCart?: () => void;
  onOpenSourceExport?: () => void;
  onOpenFormManager?: () => void;
  onOpenLoyaltyClub?: () => void;
  onOpenDokanMarketplace?: () => void;
  onOpenWhiteLabel?: () => void;
  onOpenAiWizard?: () => void;
  onOpenAppUpdate?: () => void;
  onOpenStoreRelease?: () => void;
  onOpenAnalytics?: () => void;
  onOpenNotificationModal?: () => void;
  onOpenQrModal?: () => void;
  onOpenSubscriptionModal?: () => void;
  onOpenInvoiceModal?: () => void;
  onOpenMonitoring?: () => void;
  onOpenSupport?: () => void;
  onOpenSuperAdminSupport?: () => void;
  onOpenMigrationWizard?: () => void;
  onOpenSmsConfig?: () => void;
  onSaveProject: () => void;
  onOpenBuildModal: () => void;
  projectId?: string;
}

export function TopNavbar({
  appName,
  setAppName,
  packageName,
  setPackageName,
  appIconUrl,
  onOpenIconPicker,
  previewDevice,
  setPreviewDevice,
  isDarkModePreview,
  setIsDarkModePreview,
  enabledPluginsCount,
  onOpenPluginMarket,
  onOpenMediaModal,
  onOpenTemplateModal,
  onOpenStoreManager,
  onOpenAbandonedCart,
  onOpenSourceExport,
  onOpenFormManager,
  onOpenLoyaltyClub,
  onOpenDokanMarketplace,
  onOpenWhiteLabel,
  onOpenAiWizard,
  onOpenAppUpdate,
  onOpenStoreRelease,
  onOpenAnalytics,
  onOpenNotificationModal,
  onOpenQrModal,
  onOpenSubscriptionModal,
  onOpenInvoiceModal,
  onOpenMonitoring,
  onOpenSupport,
  onOpenSuperAdminSupport,
  onOpenMigrationWizard,
  onOpenSmsConfig,
  onSaveProject,
  onOpenBuildModal,
  projectId,
}: TopNavbarProps) {
  // Dropdown states
  const [activeMenu, setActiveMenu] = useState<"store" | "tools" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleAction = (callback?: () => void) => {
    setActiveMenu(null);
    if (callback) callback();
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* LEFT SECTION: Identity & Back to Dashboard */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Back Link to Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors shadow-xs"
          title="بازگشت به داشبورد پروژه‌ها"
        >
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="hidden md:inline">داشبورد</span>
        </Link>

        <div className="w-[1px] h-5 bg-slate-800 hidden sm:block" />

        {/* App Logo Avatar */}
        <div
          onClick={onOpenIconPicker}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-rose-500/50 shadow-md shadow-rose-500/20 cursor-pointer relative group shrink-0"
          title="کلیک برای تغییر آیکون اپلیکیشن"
        >
          <img
            src={appIconUrl}
            alt="App Icon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <Upload className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* App Name & Package Badge */}
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs font-bold text-white focus:outline-hidden focus:border-rose-500 w-28 sm:w-36 transition"
            title="نام نمایشی اپلیکیشن (برای ویرایش کلیک کنید)"
          />
          <span
            className="hidden xl:inline text-[10px] font-mono text-slate-400 bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded-lg truncate max-w-[150px]"
            dir="ltr"
            title={packageName}
          >
            {packageName}
          </span>
        </div>
      </div>

      {/* CENTER SECTION: Canvas Viewport & Theme Controls */}
      <div className="hidden md:flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-2xl border border-slate-800 shadow-inner">
        <button
          onClick={() => setPreviewDevice("iphone")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            previewDevice === "iphone"
              ? "bg-slate-800 text-white shadow-xs border border-slate-700/80"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="پیش‌نمایش در ابعاد آیفون"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="text-[11px]">آیفون</span>
        </button>
        <button
          onClick={() => setPreviewDevice("samsung")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            previewDevice === "samsung"
              ? "bg-slate-800 text-white shadow-xs border border-slate-700/80"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="پیش‌نمایش در ابعاد سامسونگ"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="text-[11px]">سامسونگ</span>
        </button>
        <button
          onClick={() => setPreviewDevice("tablet")}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            previewDevice === "tablet"
              ? "bg-slate-800 text-white shadow-xs border border-slate-700/80"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title="پیش‌نمایش در ابعاد تبلت"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="text-[11px]">تبلت</span>
        </button>

        <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />

        <button
          onClick={() => setIsDarkModePreview(!isDarkModePreview)}
          className={`p-1.5 rounded-xl transition ${
            isDarkModePreview
              ? "text-amber-400 bg-slate-800 border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
          title={isDarkModePreview ? "حالت تیره فعال است" : "حالت روشن فعال است"}
        >
          {isDarkModePreview ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* RIGHT SECTION: Dropdowns & Action Buttons */}
      <div className="flex items-center gap-2" ref={menuRef}>
        {/* 1. AI Wizard (Glow Button) */}
        {onOpenAiWizard && (
          <button
            onClick={onOpenAiWizard}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer"
            title="تولید هوشمند کل ساختار اپلیکیشن با هوش مصنوعی"
          >
            <Wand2 className="w-3.5 h-3.5 text-rose-200 animate-pulse" />
            <span className="hidden sm:inline">هوش مصنوعی</span>
          </button>
        )}

        {/* 2. E-Commerce & Store Modules Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === "store" ? null : "store")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              activeMenu === "store"
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/80"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>امکانات فروشگاه</span>
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                activeMenu === "store" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Store Dropdown Menu */}
          {activeMenu === "store" && (
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 space-y-0.5">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                ماژول‌ها و ابزارهای فروشگاهی
              </div>

              {onOpenStoreManager && (
                <button
                  onClick={() => handleAction(onOpenStoreManager)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-emerald-300">کاتالوگ و کالاها</div>
                    <div className="text-[10px] text-slate-400">مدیریت محصولات، قیمت‌ها و موجودی</div>
                  </div>
                </button>
              )}

              {onOpenAbandonedCart && (
                <button
                  onClick={() => handleAction(onOpenAbandonedCart)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-amber-300">سبد خرید رها شده</div>
                    <div className="text-[10px] text-slate-400">ارسال خودکار کوپن و یادآوری خرید</div>
                  </div>
                </button>
              )}

              {onOpenDokanMarketplace && (
                <button
                  onClick={() => handleAction(onOpenDokanMarketplace)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-teal-300">مارکت‌پلیس دکان</div>
                    <div className="text-[10px] text-slate-400">غرفه‌داران، پورسانت و فروشندگان</div>
                  </div>
                </button>
              )}

              {onOpenLoyaltyClub && (
                <button
                  onClick={() => handleAction(onOpenLoyaltyClub)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-amber-300">باشگاه مشتریان</div>
                    <div className="text-[10px] text-slate-400">امتیاز ورود روزانه و پاداش خرید</div>
                  </div>
                </button>
              )}

              {onOpenFormManager && (
                <button
                  onClick={() => handleAction(onOpenFormManager)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-300">فرم‌ساز اختصاصی</div>
                    <div className="text-[10px] text-slate-400">فرم رزرو، گارانتی و پذیرش آنلاین</div>
                  </div>
                </button>
              )}

              <div className="border-t border-slate-800/80 my-1" />

              <button
                onClick={() => handleAction(onOpenPluginMarket)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                    <Puzzle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-purple-300">مرکز پلاگین‌ها</div>
                    <div className="text-[10px] text-slate-400">مدیریت افزونه‌ها و ویژگی‌ها</div>
                  </div>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  {enabledPluginsCount} فعال
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Advanced Tools & Operations Dropdown */}
        <div className="relative">
          <button
            onClick={() => setActiveMenu(activeMenu === "tools" ? null : "tools")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              activeMenu === "tools"
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-md shadow-indigo-500/10"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/80"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>ابزارهای پیشرفته</span>
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                activeMenu === "tools" ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Tools Dropdown Menu */}
          {activeMenu === "tools" && (
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 space-y-0.5">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                عملیات و ابزارهای سازمانی
              </div>

              {onOpenAnalytics && (
                <button
                  onClick={() => handleAction(onOpenAnalytics)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-emerald-300">هوش آماری و هیت‌مپ</div>
                    <div className="text-[10px] text-slate-400">تحلیل رفتار کاربران و نرخ تبدیل</div>
                  </div>
                </button>
              )}

              
              {onOpenSmsConfig && (
                <button
                  onClick={() => handleAction(onOpenSmsConfig)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-indigo-300">درگاه پیامک و OTP</div>
                    <div className="text-[10px] text-slate-400">کاوه‌نگار، فراز و وب‌سرویس پترن</div>
                  </div>
                </button>
              )}

              
              {onOpenMigrationWizard && (
                <button
                  onClick={() => handleAction(onOpenMigrationWizard)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-amber-300">مهاجرت از سایر اپ‌سازها</div>
                    <div className="text-[10px] text-slate-400">انتقال پروژه ۳ مرحله‌ای با حفظ کاربران بازار</div>
                  </div>
                </button>
              )}

              {onOpenSuperAdminSupport && (
                <button
                  onClick={() => handleAction(onOpenSuperAdminSupport)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-purple-300">میز کار سوپرادمین (پشتیبانی کل)</div>
                    <div className="text-[10px] text-slate-400">پاسخگویی به تیکت‌های دریافتی از تمام کاربران</div>
                  </div>
                </button>
              )}

              {onOpenStoreRelease && (
                <button
                  onClick={() => handleAction(onOpenStoreRelease)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/30">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-teal-300">انتشار در بازار و مایکت</div>
                    <div className="text-[10px] text-slate-400">تست سازگاری ۱۰۰٪، سئو و ثبت مستقیم</div>
                  </div>
                </button>
              )}

              {onOpenAppUpdate && (
                <button
                  onClick={() => handleAction(onOpenAppUpdate)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <ArrowUpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-blue-300">آپدیت درون‌برنامه‌ای (OTA)</div>
                    <div className="text-[10px] text-slate-400">مدیریت نسخه جدید و لاگ تغییرات</div>
                  </div>
                </button>
              )}

              {onOpenWhiteLabel && (
                <button
                  onClick={() => handleAction(onOpenWhiteLabel)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-indigo-300">پنل نمایندگی (وایت‌لیبل)</div>
                    <div className="text-[10px] text-slate-400">اتصال دامنه و برند اختصاصی شما</div>
                  </div>
                </button>
              )}

              {onOpenSourceExport && (
                <button
                  onClick={() => handleAction(onOpenSourceExport)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-cyan-300">دانلود سورس فلاتر (ZIP)</div>
                    <div className="text-[10px] text-slate-400">خروجی کامل بدون قفل نرم‌افزاری</div>
                  </div>
                </button>
              )}

              {onOpenNotificationModal && (
                <button
                  onClick={() => handleAction(onOpenNotificationModal)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-right hover:bg-slate-800/70 text-slate-200 hover:text-white transition text-xs group"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-rose-300">ارسال پوش‌نوتیفیکیشن</div>
                    <div className="text-[10px] text-slate-400">پیام سراسری به گوشی کاربران</div>
                  </div>
                </button>
              )}

              <div className="border-t border-slate-800/80 my-1" />

              {/* Media & Templates */}
              <div className="grid grid-cols-2 gap-1 px-1">
                <button
                  onClick={() => handleAction(onOpenMediaModal)}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium transition"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>رسانه‌ها</span>
                </button>
                <button
                  onClick={() => handleAction(onOpenTemplateModal)}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>قالب‌ها</span>
                </button>
              </div>

              {/* PWA Web Link */}
              <a
                href={`/pwa?id=${projectId || ''}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-right hover:bg-blue-950/40 text-blue-300 hover:text-blue-200 transition text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>اجرای نسخه وب (PWA)</span>
                </div>
                <ExternalLink className="w-3 h-3 text-blue-400/60" />
              </a>

              {/* Admin Link */}
              <Link
                href="/admin"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-right hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 transition text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>پنل سوپرادمین</span>
                </div>
                <ExternalLink className="w-3 h-3 text-rose-400/60" />
              </Link>
            </div>
          )}
        </div>

        {/* 3.4. Live Health Telemetry Badge */}
        {onOpenMonitoring && (
          <button
            onClick={onOpenMonitoring}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition cursor-pointer shadow-xs"
            title="مشاهده مانیتورینگ بلادرنگ سلامت سرور، تاخیر دیتابیس و لاگ‌ها"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="hidden xl:inline text-[11px] font-bold">سرور فعال</span>
          </button>
        )}

        {/* 3.5. Direct Web Version (PWA) Button */}
        <a
          href={`/pwa?id=${projectId || ''}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition shadow-xs"
          title="مشاهده و اجرای آنلاین وب‌اپلیکیشن (PWA) در تب جدید"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">نسخه وب</span>
        </a>

        {/* 4. Live QR Preview (Compact Icon Button) */}
        {onOpenQrModal && (
          <button
            onClick={onOpenQrModal}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer"
            title="پیش‌نمایش زنده اپلیکیشن با اسکن QR کد در گوشی"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
          </button>
        )}

                {/* 4.4. Direct Migration Wizard Button */}
        {onOpenMigrationWizard && (
          <button
            onClick={onOpenMigrationWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition shadow-xs cursor-pointer"
            title="ویزارد ۳ مرحله‌ای مهاجرت از سایر اپ‌سازها با حفظ کاربران بازار"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">مهاجرت پروژه</span>
          </button>
        )}

        {/* 4.5. Subscription & Plans Button */}
        {onOpenSubscriptionModal && (
          <button
            onClick={onOpenSubscriptionModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 hover:from-amber-500/25 hover:to-rose-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition shadow-xs cursor-pointer"
            title="مشاهده و ارتقای پلن‌های اشتراک تجاری و فاکتورها"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">پلن تجاری</span>
          </button>
        )}

        {/* 4.6. Online Support Desk Button */}
        {onOpenSupport && (
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition shadow-xs cursor-pointer"
            title="پشتیبانی آنلاین ۲۴ ساعته و گفتگوی زنده با هوش مصنوعی"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline text-xs font-bold">پشتیبانی</span>
          </button>
        )}

        <div className="w-[1px] h-5 bg-slate-800 mx-0.5" />

        {/* 5. Save Button */}
        <button
          onClick={onSaveProject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/80 transition cursor-pointer shadow-xs"
          title="ذخیره تغییرات چیدمان و تنظیمات (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">ذخیره</span>
        </button>

        {/* 6. Primary Action: Build APK / AAB */}
        <button
          onClick={onOpenBuildModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
          title="دریافت خروجی APK مستقیم و باندل AAB بازار و مایکت"
        >
          <Download className="w-3.5 h-3.5" />
          <span>خروجی نهایی</span>
        </button>
      </div>
    </header>
  );
}
