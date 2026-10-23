"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CreditCard,
  LayoutGrid,
  Terminal,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Download,
  Search,
  Phone,
  BarChart3,
  Database,
  Smartphone,
  ChevronLeft,
  X,
  Copy,
  Check,
  Radio,
  Sliders,
  DollarSign,
  Clock,
  Sparkles,
  ArrowUpRight,
  Bell,
  Store,
  Briefcase,
  LogIn,
} from "lucide-react";
import BroadcastNotificationModal from "@/components/BroadcastNotificationModal";
import { AbandonedCartModal } from "@/components/AbandonedCartModal";
import { SourceExportModal } from "@/components/SourceExportModal";
import { CustomFormManagerModal } from "@/components/CustomFormManagerModal";
import { LoyaltyClubModal } from "@/components/LoyaltyClubModal";
import { DokanMarketplaceModal } from "@/components/DokanMarketplaceModal";
import { WhiteLabelPortalModal } from "@/components/WhiteLabelPortalModal";
import { AiAppGeneratorModal } from "@/components/AiAppGeneratorModal";
import { AppUpdateModal } from "@/components/AppUpdateModal";
import { AppAnalyticsModal } from "@/components/AppAnalyticsModal";

interface OverviewMetrics {
  totalUsers: number;
  totalProjects: number;
  totalBuilds: number;
  successfulBuilds: number;
  activeSubscriptions: number;
  mrr: number;
  totalRevenue: number;
}

interface SystemHealth {
  database: string;
  storage: string;
  worker: string;
  maintenanceMode: boolean;
}

interface UserItem {
  id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  projectsCount: number;
  totalBuilds: number;
  activePlan: string;
  planPrice: number;
  daysRemaining: number;
  expiresAt: string | null;
}

interface SubscriptionItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  planId: string;
  planName: string;
  price: number;
  status: string;
  createdAt: string;
  expiresAt: string;
  daysRemaining: number;
}

interface ProjectItem {
  id: string;
  userId?: string;
  name: string;
  packageName: string;
  version: string;
  userName: string;
  userPhone: string;
  totalBuilds: number;
  blockCount: number;
  isWooConnected: boolean;
  updatedAt: string;
}

interface BuildItem {
  id: string;
  projectId: string;
  projectName: string;
  packageName: string;
  userName: string;
  userPhone: string;
  platform: string;
  status: string;
  downloadUrl?: string;
  aabUrl?: string;
  keystoreUrl?: string;
  logs?: string;
  createdAt: string;
  completedAt?: string;
}

interface SystemSettings {
  maintenanceMode: boolean;
  announcementText: string;
  smsProvider: "kavenegar" | "farazsms" | "ghasedak" | "simulated";
  smsApiKey: string;
  smsSenderLine: string;
  paymentGateway: "zarinpal" | "saman" | "nextpay" | "simulated";
  zarinpalMerchantId: string;
  defaultFreeQuota: number;
  supportPhone: string;
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "subscriptions" | "projects" | "builds" | "settings"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentBuilds, setRecentBuilds] = useState<any[]>([]);

  // Users State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [subStatusFilter, setSubStatusFilter] = useState("ALL");

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedCartProject, setSelectedCartProject] = useState<string | null>(null);
  const [selectedExportProject, setSelectedExportProject] = useState<ProjectItem | null>(null);
  const [selectedFormProject, setSelectedFormProject] = useState<string | null>(null);
  const [selectedLoyaltyProject, setSelectedLoyaltyProject] = useState<string | null>(null);
  const [selectedDokanProject, setSelectedDokanProject] = useState<string | null>(null);
  const [selectedWhiteLabelProject, setSelectedWhiteLabelProject] = useState<string | null>(null);
  const [selectedUpdateProject, setSelectedUpdateProject] = useState<string | null>(null);
  const [selectedAnalyticsProject, setSelectedAnalyticsProject] = useState<string | null>(null);
  const [showAiWizardAdmin, setShowAiWizardAdmin] = useState(false);

  // Builds State
  const [builds, setBuilds] = useState<BuildItem[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<{ id: string; logs: string } | null>(null);

  // Settings State
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    announcementText: "",
    smsProvider: "kavenegar",
    smsApiKey: "",
    smsSenderLine: "",
    paymentGateway: "zarinpal",
    zarinpalMerchantId: "",
    defaultFreeQuota: 5,
    supportPhone: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Modals State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState("USER");
  const [newUserPlan, setNewUserPlan] = useState("FREE");

  const [showGrantSubModal, setShowGrantSubModal] = useState(false);
  const [grantUserId, setGrantUserId] = useState("");
  const [grantPlanId, setGrantPlanId] = useState("plan_pro");
  const [grantDuration, setGrantDuration] = useState(30);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchAllAdminData();
  }, [activeTab]);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const res = await fetch("http://localhost:4000/api/admin/overview");
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
          setHealth(data.health);
          setRecentUsers(data.recentUsers || []);
          setRecentBuilds(data.recentBuilds || []);
        }
      } else if (activeTab === "users") {
        const query = new URLSearchParams();
        if (userSearch) query.append("search", userSearch);
        if (userRoleFilter !== "ALL") query.append("role", userRoleFilter);
        const res = await fetch(`http://localhost:4000/api/admin/users?${query.toString()}`);
        const data = await res.json();
        if (data.success) setUsers(data.users || []);
      } else if (activeTab === "subscriptions") {
        const query = new URLSearchParams();
        if (subStatusFilter !== "ALL") query.append("status", subStatusFilter);
        const res = await fetch(`http://localhost:4000/api/admin/subscriptions?${query.toString()}`);
        const data = await res.json();
        if (data.success) setSubscriptions(data.subscriptions || []);
      } else if (activeTab === "projects") {
        const res = await fetch("http://localhost:4000/api/admin/projects");
        const data = await res.json();
        if (data.success) setProjects(data.projects || []);
      } else if (activeTab === "builds") {
        const res = await fetch("http://localhost:4000/api/admin/builds");
        const data = await res.json();
        if (data.success) setBuilds(data.builds || []);
      } else if (activeTab === "settings") {
        const res = await fetch("http://localhost:4000/api/admin/settings");
        const data = await res.json();
        if (data.success) setSettings(data.settings);
      }
    } catch (e: any) {
      console.error("Error loading admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserPhone) {
      alert("شماره موبایل الزامی است");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: newUserPhone,
          name: newUserName,
          role: newUserRole,
          initialPlan: newUserPlan,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("کاربر جدید با موفقیت ایجاد شد");
        setShowAddUserModal(false);
        setNewUserName("");
        setNewUserPhone("");
        fetchAllAdminData();
      } else {
        alert(data.error || "خطا در ایجاد کاربر");
      }
    } catch (_) {
      alert("خطا در برقراری ارتباط با سرور");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingUser.name,
          phone: editingUser.phone,
          role: editingUser.role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("مشخصات کاربر ذخیره شد");
        setShowEditUserModal(false);
        setEditingUser(null);
        fetchAllAdminData();
      }
    } catch (_) {
      alert("خطا در به‌روزرسانی مشخصات");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`آیا از حذف کامل کاربر «${userName}» و تمام پروژه‌های آن اطمینان دارید؟`)) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("کاربر با موفقیت حذف شد");
        fetchAllAdminData();
      }
    } catch (_) {
      alert("خطا در حذف کاربر");
    }
  };

  const handleImpersonateUser = async (userId: string, userName: string) => {
    if (!confirm(`آیا می‌خواهید به عنوان «${userName}» وارد پنل مشتری شوید؟`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/admin/impersonate/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = await res.json();
      if (data.success && data.token) {
        const currentToken = localStorage.getItem("appmaker_token");
        if (currentToken) {
          localStorage.setItem("admin_backup_token", currentToken);
        }
        localStorage.setItem("appmaker_token", data.token);
        localStorage.setItem("impersonated_user_name", userName);
        showToast(`با موفقیت وارد حساب «${userName}» شدید. در حال انتقال به داشبورد...`);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } else {
        alert(data.error || "خطا در ورود به حساب مشتری");
      }
    } catch (_) {
      alert("خطا در برقراری ارتباط با سرور");
    }
  };

  const handleGrantSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantUserId) {
      alert("لطفاً کاربر را انتخاب کنید");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/admin/subscriptions/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: grantUserId,
          planId: grantPlanId,
          durationDays: grantDuration,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("اشتراک با موفقیت فعال و تمدید شد");
        setShowGrantSubModal(false);
        fetchAllAdminData();
      }
    } catch (_) {
      alert("خطا در اعطای اشتراک");
    }
  };

  const handleCancelSubscription = async (subId: string) => {
    if (!confirm("آیا از لغو این اشتراک اطمینان دارید؟")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/subscriptions/${subId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast("اشتراک لغو شد");
        fetchAllAdminData();
      }
    } catch (_) {
      alert("خطا در لغو اشتراک");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("http://localhost:4000/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("تنظیمات سراسری پلتفرم با موفقیت ذخیره شد");
      }
    } catch (_) {
      alert("خطا در ذخیره تنظیمات");
    } finally {
      setSavingSettings(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const formatCurrency = (amount: number) => {
    return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-emerald-400/40 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top SuperAdmin Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 font-black text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-tight">پنل مدیریت کلان App Maker</h1>
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">سامانه نظارت بر کاربران، اشتراک‌ها، صف بیلد و تنظیمات هسته SaaS</p>
          </div>
        </div>

        {/* Live System Status Badges */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px]">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">دیتابیس:</span>
            <span className="font-bold text-emerald-400">فعال (SQLite)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">ورکر بیلد:</span>
            <span className="font-bold text-cyan-400">در حال گوش دادن</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-[11px]">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="text-slate-400">پورت API:</span>
            <span className="font-mono font-bold text-white">4000</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-lg shadow-rose-600/25 transition cursor-pointer"
            title="ارسال پوش‌نوتیفیکیشن سراسری به تمام کاربران"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>ارسال پیام همگانی</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
            title="صفحه اصلی سایت"
          >
            <span>صفحه اصلی</span>
          </Link>

          <Link
            href="/builder"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
            title="مشاهده استودیو طراحی اپلیکیشن"
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            <span>استودیو سازنده</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
            title="مشاهده داشبورد مدیریت پروژه‌ها"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
            <span>داشبورد پروژه‌ها</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Navigation Sidebar (Right in RTL) */}
        <aside className="w-64 bg-slate-900/70 border-l border-slate-800 p-4 flex flex-col gap-1 shrink-0 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">بخش‌های مدیریتی</div>

          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === "overview"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>داشبورد و آمار کلان</span>
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === "users"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>مدیریت کاربران و مشتریان</span>
          </button>

          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === "subscriptions"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>مدیریت اشتراک‌ها و پلن‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === "projects"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>اپلیکیشن‌ها و فروشگاه‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab("builds")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === "builds"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Terminal className="w-4 h-4 shrink-0" />
            <span>صف بیلد و فایل‌های خروجی</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-right ${
              activeTab === "settings"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>تنظیمات کلان سامانه</span>
          </button>

          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400 block mb-1">نسخه موتور:</span>
              <span className="font-mono font-bold text-white block">v1.0.0-PROD (Enterprise)</span>
              <span className="text-[10px] text-emerald-400 block mt-1">● اتصال مستقیم به شاپرک و پیامک</span>
            </div>
          </div>
        </aside>

        {/* Admin Tab Content View */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Page Title & Refresh */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">داشبورد و وضعیت کلان سیستم</h2>
                  <p className="text-xs text-slate-400">خلاصه آماری عملکرد پلتفرم SaaS، تراکنش‌های مالی و وضعیت زیرساخت</p>
                </div>
                <button
                  onClick={fetchAllAdminData}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-rose-400" : ""}`} />
                  <span>به‌روزرسانی داده‌ها</span>
                </button>
              </div>

              {/* 4 Big KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">کل کاربران پلتفرم</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">
                    {metrics ? formatNumber(metrics.totalUsers) : "---"}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                    <span>↑ رشد مداوم ثبت‌نام‌ها</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">اشتراک‌های فعال ماهانه</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">
                    {metrics ? formatNumber(metrics.activeSubscriptions) : "---"}
                  </div>
                  <div className="text-[10px] text-slate-400">پلن‌های پریمیوم و سازمانی فعال</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">درآمد ماهانه جاری (MRR)</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl font-black text-amber-400 mb-1">
                    {metrics ? formatCurrency(metrics.mrr) : "---"}
                  </div>
                  <div className="text-[10px] text-slate-400">درآمد حاصل از فروش پلن‌ها و تمدیدها</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">بیلدهای موفق خروجی (APK)</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <Terminal className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white mb-1">
                    {metrics ? formatNumber(metrics.successfulBuilds) : "---"}
                  </div>
                  <div className="text-[10px] text-emerald-400">۱۰۰٪ بیلدها موفق و بدون خطا</div>
                </div>
              </div>

              {/* Recent Users & Recent Builds Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>آخرین کاربران ثبت‌نامی</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                    >
                      <span>مشاهده همه</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {recentUsers.length === 0 ? (
                      <div className="text-xs text-slate-500 text-center py-6">کاربری یافت نشد</div>
                    ) : (
                      recentUsers.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{u.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block" dir="ltr">
                              {u.phone}
                            </span>
                          </div>
                          <div className="text-left">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                u.role === "ADMIN"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {u.role === "ADMIN" ? "مدیر ارشد" : "کاربر عادی"}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {u.projectsCount} اپلیکیشن
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Builds */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>آخرین خروجی‌های کامپایل‌شده (APK/AAB)</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("builds")}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                    >
                      <span>مشاهده صف بیلد</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {recentBuilds.length === 0 ? (
                      <div className="text-xs text-slate-500 text-center py-6">بیلدی ثبت نشده است</div>
                    ) : (
                      recentBuilds.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{b.projectName}</span>
                            <span className="text-[10px] text-slate-400 font-mono block" dir="ltr">
                              {b.packageName}
                            </span>
                          </div>
                          <div className="text-left">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full inline-block">
                              {b.status}
                            </span>
                            <span className="text-[9px] text-slate-500 block font-mono mt-1">
                              {b.platform}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">مدیریت کاربران و مشتریان SaaS</h2>
                  <p className="text-xs text-slate-400">مشاهده، ویرایش، افزودن کاربر دستی، و اعطای اشتراک و دسترسی‌ها</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-lg shadow-rose-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن کاربر جدید</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchAllAdminData()}
                    placeholder="جستجو با نام کاربر یا شماره تلفن..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => {
                      setUserRoleFilter(e.target.value);
                      setTimeout(fetchAllAdminData, 50);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
                  >
                    <option value="ALL">همه نقش‌ها</option>
                    <option value="USER">کاربران عادی</option>
                    <option value="ADMIN">مدیران ارشد</option>
                  </select>
                  <button
                    onClick={fetchAllAdminData}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition"
                  >
                    اعمال فیلتر
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="py-3 px-4 font-bold">نام کاربر</th>
                        <th className="py-3 px-4 font-bold">شماره همراه</th>
                        <th className="py-3 px-4 font-bold">نقش سازمانی</th>
                        <th className="py-3 px-4 font-bold">تعداد اپ‌ها</th>
                        <th className="py-3 px-4 font-bold">پلن اشتراک</th>
                        <th className="py-3 px-4 font-bold">اعتبار باقیمانده</th>
                        <th className="py-3 px-4 font-bold text-center">عملیات مدیریت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            کاربری با این مشخصات یافت نشد
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                            <td className="py-3 px-4 font-mono text-slate-300" dir="ltr">
                              {u.phone}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                  u.role === "ADMIN"
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    : "bg-slate-800 text-slate-300 border border-slate-700"
                                }`}
                              >
                                {u.role === "ADMIN" ? "مدیر ارشد" : "کاربر عادی"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-200">
                              {u.projectsCount} اپلیکیشن
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                                {u.activePlan}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {u.daysRemaining > 0 ? (
                                <span className="text-emerald-400 font-bold">
                                  {u.daysRemaining} روز
                                </span>
                              ) : (
                                <span className="text-slate-500">فاقد اشتراک</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleImpersonateUser(u.id, u.name || u.phone)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold transition cursor-pointer text-[10.5px]"
                                  title="ورود مستقیم به پنل داشبورد این مشتری (Login as Client)"
                                >
                                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>ورود به پنل مشتری</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setGrantUserId(u.id);
                                    setShowGrantSubModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                                  title="اعطای اشتراک و تمدید دستی"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingUser(u);
                                    setShowEditUserModal(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                                  title="ویرایش مشخصات کاربر"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                                  title="حذف کاربر"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIPTIONS MANAGEMENT */}
          {activeTab === "subscriptions" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">مدیریت اشتراک‌ها و پلن‌های تجاری</h2>
                  <p className="text-xs text-slate-400">نظارت بر تمدیدهای مالی، پلن‌های فعال و اعطای اشتراک دستی به مشتریان</p>
                </div>
                <button
                  onClick={() => {
                    setGrantUserId("");
                    setShowGrantSubModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-2 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>اعطای اشتراک ویژه دستی</span>
                </button>
              </div>

              {/* Subscriptions Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="py-3 px-4 font-bold">نام و شماره مشتری</th>
                        <th className="py-3 px-4 font-bold">پلن خریداری‌شده</th>
                        <th className="py-3 px-4 font-bold">مبلغ اشتراک</th>
                        <th className="py-3 px-4 font-bold">وضعیت حساب</th>
                        <th className="py-3 px-4 font-bold">روزهای باقیمانده</th>
                        <th className="py-3 px-4 font-bold">تاریخ پایان اعتبار</th>
                        <th className="py-3 px-4 font-bold text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            اشتراکی ثبت نشده است
                          </td>
                        </tr>
                      ) : (
                        subscriptions.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4">
                              <span className="font-bold text-white block">{s.userName}</span>
                              <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                                {s.userPhone}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-xs font-bold text-indigo-300">{s.planName}</span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-200">
                              {formatCurrency(s.price)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                  s.status === "ACTIVE"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {s.status === "ACTIVE" ? "فعال" : "منقضی یا لغو"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold">
                              {s.daysRemaining > 0 ? (
                                <span className="text-emerald-400">{s.daysRemaining} روز</span>
                              ) : (
                                <span className="text-rose-400">به اتمام رسیده</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                              {new Date(s.expiresAt).toLocaleDateString("fa-IR")}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {s.status === "ACTIVE" && (
                                <button
                                  onClick={() => handleCancelSubscription(s.id)}
                                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded-lg border border-rose-500/30 transition"
                                >
                                  لغو اشتراک
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS OVERVIEW */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">اپلیکیشن‌ها و پروژه‌های ساخته شده</h2>
                  <p className="text-xs text-slate-400">تمام اپلیکیشن‌های طراحی شده توسط مشتریان در سرور</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-white">{p.name}</h3>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5" dir="ltr">
                            {p.packageName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                          v{p.version}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 my-3 text-[11px]">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            p.isWooConnected
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {p.isWooConnected ? "متصل به ووکامرس" : "آفلاین / دمو"}
                        </span>
                        <span className="text-slate-400">{p.totalBuilds} بار بیلد شده</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2 text-[10px]">
                      <button
                        onClick={() => setSelectedCartProject(p.id)}
                        className="py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🛍️</span>
                        <span>سبد رها شده</span>
                      </button>
                      <button
                        onClick={() => setSelectedExportProject(p)}
                        className="py-1 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>⚡</span>
                        <span>سورس Flutter</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2 text-[10px]">
                      <button
                        onClick={() => setSelectedFormProject(p.id)}
                        className="py-1 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>📝</span>
                        <span>فرم‌ها</span>
                      </button>
                      <button
                        onClick={() => setSelectedLoyaltyProject(p.id)}
                        className="py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>👑</span>
                        <span>باشگاه</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2 text-[10px]">
                      <button
                        onClick={() => setSelectedDokanProject(p.id)}
                        className="py-1 px-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🏪</span>
                        <span>مارکت‌پلیس دکان</span>
                      </button>
                      <button
                        onClick={() => setSelectedWhiteLabelProject(p.id)}
                        className="py-1 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🏢</span>
                        <span>وایت‌لیبل</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2 text-[10px]">
                      <button
                        onClick={() => setSelectedUpdateProject(p.id)}
                        className="py-1 px-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🚀</span>
                        <span>آپدیت OTA</span>
                      </button>
                      <button
                        onClick={() => setSelectedAnalyticsProject(p.id)}
                        className="py-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>📊</span>
                        <span>آمار و هیت‌مپ</span>
                      </button>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">مالک پروژه:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-300">{p.userName}</span>
                          {p.userId && (
                            <button
                              onClick={() => handleImpersonateUser(p.userId!, p.userName)}
                              className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                              title="ورود به پنل داشبورد این مشتری"
                            >
                              (ورود به پنل)
                            </button>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/builder?projectId=${p.id}`}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1"
                      >
                        <span>ویرایش در استودیو</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BUILD QUEUE & ARTIFACTS */}
          {activeTab === "builds" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">صف بیلد و فایل‌های کامپایل‌شده (APK / AAB)</h2>
                  <p className="text-xs text-slate-400">تاریخچه کامل کارهای کامپایل ورکر و دریافت خروجی‌های معتبر و کلیدها</p>
                </div>
                <button
                  onClick={fetchAllAdminData}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تازه‌سازی صف</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px]">
                        <th className="py-3 px-4 font-bold">شناسه بیلد</th>
                        <th className="py-3 px-4 font-bold">نام اپلیکیشن</th>
                        <th className="py-3 px-4 font-bold">کاربر سفارش‌دهنده</th>
                        <th className="py-3 px-4 font-bold">پلتفرم</th>
                        <th className="py-3 px-4 font-bold">وضعیت</th>
                        <th className="py-3 px-4 font-bold">فایل‌های خروجی</th>
                        <th className="py-3 px-4 font-bold text-center">لاگ ترمینال</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {builds.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            بیلدی در صف وجود ندارد
                          </td>
                        </tr>
                      ) : (
                        builds.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                              {b.id.substring(0, 8)}...
                            </td>
                            <td className="py-3 px-4 font-bold text-white">{b.projectName}</td>
                            <td className="py-3 px-4 text-slate-300">{b.userName}</td>
                            <td className="py-3 px-4 font-mono text-[11px] text-indigo-400">{b.platform}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                  b.status === "SUCCESS"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : b.status === "BUILDING"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                {b.downloadUrl && (
                                  <a
                                    href={`http://localhost:4000${b.downloadUrl}`}
                                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
                                    download
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>APK</span>
                                  </a>
                                )}
                                {b.aabUrl && (
                                  <a
                                    href={`http://localhost:4000${b.aabUrl}`}
                                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1"
                                    download
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>AAB</span>
                                  </a>
                                )}
                                {b.keystoreUrl && (
                                  <a
                                    href={`http://localhost:4000${b.keystoreUrl}`}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1"
                                    download
                                    title="دانلود کلید امضا"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>JKS</span>
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {b.logs ? (
                                <button
                                  onClick={() => setSelectedLogs({ id: b.id, logs: b.logs || "" })}
                                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30 transition cursor-pointer"
                                >
                                  نمایش لاگ
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-600">---</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-black text-white">تنظیمات کلان و پیکربندی پلتفرم SaaS</h2>
                <p className="text-xs text-slate-400">تنظیم درگاه‌های پیامک، پرداخت شاپرک، حالت تعمیرات و پیام همگانی</p>
              </div>

              {/* Maintenance Mode & Announcement */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-rose-400" />
                  <span>اطلاعیه و دسترسی سراسری پلتفرم</span>
                </h3>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="font-bold text-xs text-white block">حالت تعمیر و نگهداری (Maintenance Mode)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      در صورت فعال‌سازی، دسترسی به استودیو موقتاً مسدود و پیام تعمیرات نمایش داده می‌شود.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    متن پیام اعلان سراسری به کاربران استودیو:
                  </label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    placeholder="مثلاً: به‌روزرسانی مهم پلتفرم امشب انجام خواهد شد..."
                  />
                </div>
              </div>

              {/* SMS Gateway Settings */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>پیکربندی درگاه پیامک اعتبارسنجی و کد تایید (SMS OTP)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">سرویس‌دهنده پیامک:</label>
                    <select
                      value={settings.smsProvider}
                      onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="kavenegar">سامانه کاوه‌نگار (Kavenegar)</option>
                      <option value="farazsms">فراز اس‌ام‌اس (FarazSMS)</option>
                      <option value="ghasedak">قاصدک پیامک (Ghasedak)</option>
                      <option value="simulated">حالت شبیه‌ساز توسعه (Simulated Sandbox)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">شماره خط فرستنده:</label>
                    <input
                      type="text"
                      value={settings.smsSenderLine}
                      onChange={(e) => setSettings({ ...settings, smsSenderLine: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">کلید دسترسی پیامک (API Key):</label>
                  <input
                    type="password"
                    value={settings.smsApiKey}
                    onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Payment Gateway Settings */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>درگاه بانکی خرید اشتراک‌ها (شاپرک)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">درگاه پیش‌فرض:</label>
                    <select
                      value={settings.paymentGateway}
                      onChange={(e) => setSettings({ ...settings, paymentGateway: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="zarinpal">زرین‌پال (شاپرک)</option>
                      <option value="saman">بانک سامان (سپ)</option>
                      <option value="nextpay">نکست‌پی (NextPay)</option>
                      <option value="simulated">شبیه‌ساز بانکی شاپرک (Sandbox)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">کد مرچنت درگاه (Merchant ID):</label>
                    <input
                      type="text"
                      value={settings.zarinpalMerchantId}
                      onChange={(e) => setSettings({ ...settings, zarinpalMerchantId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 transition cursor-pointer flex items-center gap-2"
              >
                {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>ذخیره کلیه تنظیمات کلان</span>
              </button>
            </form>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD NEW USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-500" />
                <span>افزودن کاربر جدید به پلتفرم</span>
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="مثلاً: علی موسوی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">شماره همراه (ورود با پیامک):</label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">نقش سازمانی:</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="USER">کاربر عادی</option>
                    <option value="ADMIN">مدیر ارشد (Super Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">پلن اولیه:</label>
                  <select
                    value={newUserPlan}
                    onChange={(e) => setNewUserPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="FREE">پلن رایگان (Free)</option>
                    <option value="plan_starter">پلن استارتر (۳۰ روزه)</option>
                    <option value="plan_pro">پلن حرفه‌ای (سالیانه)</option>
                    <option value="plan_lifetime">پلن نامحدود (Lifetime)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer"
                >
                  ثبت و ایجاد حساب
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GRANT SUBSCRIPTION */}
      {showGrantSubModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>اعطای اشتراک و تمدید دستی</span>
              </h3>
              <button onClick={() => setShowGrantSubModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGrantSubscription} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">انتخاب کاربر:</label>
                <select
                  value={grantUserId}
                  onChange={(e) => setGrantUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                >
                  <option value="">-- انتخاب کاربر --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">نوع پلن اشتراک:</label>
                <select
                  value={grantPlanId}
                  onChange={(e) => setGrantPlanId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="plan_starter">پلن استارتر (۱ اپلیکیشن، ۵ بیلد)</option>
                  <option value="plan_pro">پلن کسب‌وکار حرفه‌ای (۳ اپلیکیشن، ۳۰ بیلد)</option>
                  <option value="plan_lifetime">پلن نامحدود سازمانی (نامحدود)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">مدت زمان اعتبار (روز):</label>
                <input
                  type="number"
                  value={grantDuration}
                  onChange={(e) => setGrantDuration(parseInt(e.target.value) || 30)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  min="1"
                  max="3650"
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer"
                >
                  فعال‌سازی فوری اشتراک
                </button>
                <button
                  type="button"
                  onClick={() => setShowGrantSubModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT USER */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>ویرایش مشخصات کاربر</span>
              </h3>
              <button onClick={() => setShowEditUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">شماره تلفن همراه:</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">نقش سازمانی:</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="USER">کاربر عادی</option>
                  <option value="ADMIN">مدیر ارشد (Super Admin)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer"
                >
                  ذخیره تغییرات
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-xl transition"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: VIEW BUILD LOGS */}
      {selectedLogs && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl h-[70vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">لاگ خروجی کامپایلر بیلد ({selectedLogs.id})</span>
              </div>
              <button
                onClick={() => setSelectedLogs(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-black font-mono text-[11px] text-emerald-400/90 whitespace-pre-wrap leading-relaxed" dir="ltr">
              {selectedLogs.logs}
            </div>
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedLogs.logs);
                  showToast("لاگ‌ها در کلیپ‌بورد کپی شد");
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>کپی متن لاگ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SuperAdmin Broadcast Push Notification Modal */}
      <BroadcastNotificationModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        projectId="app-demo-techmarket"
        onNotificationSent={(title) => {
          showToast(`اعلان «${title}» با موفقیت برای تمامی کاربران ارسال شد.`);
        }}
      />

      {/* Abandoned Cart Modal */}
      {selectedCartProject && (
        <AbandonedCartModal
          isOpen={Boolean(selectedCartProject)}
          onClose={() => setSelectedCartProject(null)}
          projectId={selectedCartProject}
        />
      )}

      {/* Flutter Source Export Modal */}
      {selectedExportProject && (
        <SourceExportModal
          isOpen={Boolean(selectedExportProject)}
          onClose={() => setSelectedExportProject(null)}
          projectId={selectedExportProject.id}
          projectName={selectedExportProject.name}
          packageName={selectedExportProject.packageName}
        />
      )}

      {/* Custom Form Manager Modal */}
      {selectedFormProject && (
        <CustomFormManagerModal
          isOpen={Boolean(selectedFormProject)}
          onClose={() => setSelectedFormProject(null)}
          projectId={selectedFormProject}
        />
      )}

      {/* Loyalty Club Modal */}
      {selectedLoyaltyProject && (
        <LoyaltyClubModal
          isOpen={Boolean(selectedLoyaltyProject)}
          onClose={() => setSelectedLoyaltyProject(null)}
          projectId={selectedLoyaltyProject}
        />
      )}

      {/* Dokan Multi-Vendor Modal */}
      {selectedDokanProject && (
        <DokanMarketplaceModal
          isOpen={Boolean(selectedDokanProject)}
          onClose={() => setSelectedDokanProject(null)}
          projectId={selectedDokanProject}
        />
      )}

      {/* White-Label Reseller Portal Modal */}
      {selectedWhiteLabelProject && (
        <WhiteLabelPortalModal
          isOpen={Boolean(selectedWhiteLabelProject)}
          onClose={() => setSelectedWhiteLabelProject(null)}
          projectId={selectedWhiteLabelProject}
        />
      )}

      {/* AI App Generator Modal */}
      <AiAppGeneratorModal
        isOpen={showAiWizardAdmin}
        onClose={() => setShowAiWizardAdmin(false)}
        onProjectCreated={() => fetchAllAdminData()}
      />

      {/* In-App OTA Update Modal */}
      {selectedUpdateProject && (
        <AppUpdateModal
          isOpen={Boolean(selectedUpdateProject)}
          onClose={() => setSelectedUpdateProject(null)}
          projectId={selectedUpdateProject}
        />
      )}

      {/* App Analytics & Heatmap Modal */}
      {selectedAnalyticsProject && (
        <AppAnalyticsModal
          isOpen={Boolean(selectedAnalyticsProject)}
          onClose={() => setSelectedAnalyticsProject(null)}
          projectId={selectedAnalyticsProject}
        />
      )}
    </div>
  );
}
