"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  Lock,
  Layers,
  ShoppingBag,
  CreditCard,
  Bell,
  Download,
  Terminal,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Gift,
  Star,
  Check,
  RefreshCw,
  LayoutGrid,
  Users,
  Percent,
} from "lucide-react";

export default function LandingPage() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authStep, setAuthStep] = useState<"PHONE" | "CODE">("PHONE");
  const [authPhone, setAuthPhone] = useState("09121234567");
  const [authName, setAuthName] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSimulatedMsg, setAuthSimulatedMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // FAQ open item
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Check existing session
  useEffect(() => {
    checkAuthSession();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const checkAuthSession = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("appmaker_token") : null;
      if (token) {
        const res = await fetch("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      }
    } catch (_) {}
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    setAuthSimulatedMsg(null);

    try {
      const res = await fetch("http://localhost:4000/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: authPhone.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthStep("CODE");
        setCooldown(60);
        if (data.simulated) {
          setAuthSimulatedMsg("کد پیامکی تست: ۱۲۳۴۵ (یا کد ۵ رقمی لاگ کنسول)");
        }
      } else {
        setAuthError(data.error || "خطا در ارسال پیامک.");
      }
    } catch (err) {
      setAuthError("خطا در اتصال به سرور احراز هویت.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: authPhone.trim(),
          code: authCode.trim(),
          name: authName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("appmaker_token", data.token);
        setCurrentUser(data.user);
        setAuthStep("PHONE");
        setAuthCode("");
      } else {
        setAuthError(data.error || "کد تایید وارد شده نامعتبر است.");
      }
    } catch (err) {
      setAuthError("خطا در تایید کد پیامک.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("appmaker_token");
    setCurrentUser(null);
    setAuthStep("PHONE");
    setAuthCode("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white" dir="rtl">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>نسخه ۲.۰ فعال شد: قابلیت خرید اقساطی اسنپ‌پی، گردونه شانس و پیش‌نمایش آنی با QR کد اضافه گردید!</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform text-lg">
                AM
              </div>
              <div>
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent block leading-none">
                  App Maker SaaS
                </span>
                <span className="text-[10px] text-rose-400 font-bold block mt-1">
                  پلتفرم ساخت اپلیکیشن فروشگاهی
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#features" className="hover:text-white transition">ویژگی‌ها</a>
            <a href="#templates" className="hover:text-white transition">قالب‌های آماده</a>
            <a href="#how-it-works" className="hover:text-white transition">نحوه کارکرد</a>
            <a href="#pricing" className="hover:text-white transition">تعرفه‌ها و پلن‌ها</a>
            <a href="#faq" className="hover:text-white transition">سوالات متداول</a>
          </nav>

          {/* User Status / Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs px-2.5 py-1.5 rounded-xl border border-rose-800/40 transition"
              title="پنل مدیریت کلان پلتفرم"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>سوپرادمین</span>
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                  <span>داشبورد من</span>
                </Link>

                <Link
                  href="/builder"
                  className="bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>ورود به استودیو</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/80 flex items-center justify-center text-xs transition"
                  title="خروج از حساب"
                >
                  ✕
                </button>
              </div>
            ) : (
              <a
                href="#auth-box"
                className="bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center gap-1.5"
              >
                <span>ورود و ثبت‌نام با پیامک</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH EMBEDDED AUTH CARD */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 right-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Right: Value Proposition (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-rose-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>اولین سازنده اپلیکیشن سرور-دریون ووکامرس در ایران</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                سایت ووکامرس خود را در کمتر از{" "}
                <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 bg-clip-text text-transparent">
                  ۵ دقیقه
                </span>{" "}
                به اپلیکیشن حرفه‌ای تبدیل کنید
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                بدون نیاز به یک خط کدنویسی! با طراحی ویترین درگ‌اند‌دراپ، درگاه‌های پرداخت شتاب، خرید اقساطی اسنپ‌پی، گردونه شانس، چت زنده، و خروجی مستقیم فایل نصبی APK و باندل AAB آماده برای کافه‌بازار، مایکت و گوگل‌پلی.
              </p>

              {/* Trust Checkmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-bold">بدون نیاز به آپدیت در بازار</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-bold">امضای رسمی RSA-2048</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-bold">تست رایگان بدون کارت بانکی</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  href="/builder"
                  className="bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-rose-600/25 transition-all flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>ورود فوری به استودیو سازنده</span>
                </Link>

                <a
                  href="http://localhost:5000/simulator.html"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs px-5 py-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>اجرای شبیه‌ساز موبایل</span>
                </a>
              </div>
            </div>

            {/* Left: Interactive Login & Register Card (5 cols) */}
            <div id="auth-box" className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/30 to-indigo-500/30 rounded-3xl blur-md opacity-40 group-hover:opacity-100 transition duration-500 -z-10" />

                {currentUser ? (
                  /* Logged-In Welcome Card */
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto text-white text-2xl shadow-lg shadow-emerald-500/20 font-black">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs text-emerald-400 font-bold block mb-1">وارد شده‌اید</span>
                      <h3 className="text-lg font-black text-white">{currentUser.name || "کاربر گرامی"}</h3>
                      <span className="text-xs text-slate-400 font-mono block mt-1" dir="ltr">
                        {currentUser.phone}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 text-right space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">نقش سازمانی:</span>
                        <span className="font-bold text-white">
                          {currentUser.role === "ADMIN" ? "مدیر ارشد پلتفرم" : "کاربر تجاری"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">وضعیت دسترسی:</span>
                        <span className="font-bold text-emerald-400">فعال (آماده طراحی و بیلد)</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link
                        href="/dashboard"
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span>مشاهده داشبورد پروژه‌ها</span>
                      </Link>

                      <Link
                        href="/builder"
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>باز کردن استودیو اپ‌ساز</span>
                      </Link>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-xs text-slate-500 hover:text-rose-400 transition underline pt-2"
                    >
                      خروج از این حساب
                    </button>
                  </div>
                ) : authStep === "PHONE" ? (
                  /* Step 1: Phone Request Form */
                  <div>
                    <div className="mb-6">
                      <span className="text-rose-400 text-xs font-bold block mb-1">ورود یا ثبت‌نام یکپارچه</span>
                      <h3 className="text-xl font-black text-white">شماره موبایل خود را وارد کنید</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        یک کد تایید ۵ رقمی از طریق پیامک برای شما ارسال خواهد شد.
                      </p>
                    </div>

                    {authError && (
                      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl mb-4 font-bold">
                        {authError}
                      </div>
                    )}

                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          شماره همراه (برای پیامک رمز یکبارمصرف):
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            dir="ltr"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                            required
                          />
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          نام یا نام فروشگاه (اختیاری):
                        </label>
                        <input
                          type="text"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="مثلاً: فروشگاه شیائومی اسمارت"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {authLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>ارسال کد تایید رایگان</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
                      ثبت‌نام شما به منزله پذیرش قوانین و حریم خصوصی پلتفرم است.
                    </div>
                  </div>
                ) : (
                  /* Step 2: Code Verification Form */
                  <div>
                    <div className="mb-6">
                      <span className="text-emerald-400 text-xs font-bold block mb-1">کد تایید ارسال شد</span>
                      <h3 className="text-xl font-black text-white">کد ۵ رقمی را وارد نمایید</h3>
                      <p className="text-xs text-slate-400 mt-1 font-mono" dir="ltr">
                        کد پیامک‌شده به: {authPhone}
                      </p>
                    </div>

                    {authSimulatedMsg && (
                      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3 rounded-xl mb-4 font-bold">
                        {authSimulatedMsg}
                      </div>
                    )}

                    {authError && (
                      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl mb-4 font-bold">
                        {authError}
                      </div>
                    )}

                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1.5">
                          کد ۵ رقمی پیامک:
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                            placeholder="12345"
                            dir="ltr"
                            maxLength={5}
                            autoFocus
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition"
                            required
                          />
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {authLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>تایید و ورود به اپ‌ساز</span>
                            <Check className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthStep("PHONE");
                          setAuthError(null);
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        ویرایش شماره
                      </button>

                      {cooldown > 0 ? (
                        <span className="text-slate-500">ارسال مجدد ({cooldown} ثانیه)</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRequestOtp}
                          className="text-rose-400 hover:text-rose-300 font-bold"
                        >
                          ارسال دوباره کد
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS & NUMBERS SECTION */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-black text-white mb-1">۲,۵۰۰+</div>
              <div className="text-xs text-slate-400 font-bold">اپلیکیشن فروشگاهی فعال</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-rose-400 mb-1">کمتر از ۵ دقیقه</div>
              <div className="text-xs text-slate-400 font-bold">زمان تبدیل سایت به اپلیکیشن</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-emerald-400 mb-1">۹۹.۹٪</div>
              <div className="text-xs text-slate-400 font-bold">پایداری و رضایت مشتریان</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-black text-indigo-400 mb-1">RSA-2048</div>
              <div className="text-xs text-slate-400 font-bold">امنیت امضای دیجیتال خروجی</div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              ویژگی‌های پلتفرم
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              هر آنچه برای یک اپلیکیشن فروشگاهی موفق نیاز دارید
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              تجهیز شده به بروزترین قابلیت‌های تجارت الکترونیک بدون نیاز به پرداخت هزینه‌های گزاف برنامه‌نویسی اختصاصی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">ویترین سرور-دریون (Server-Driven)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                هر تغییری در بنرها، اسلایدرها و ترتیب بلوک‌ها در استودیو ایجاد کنید، فوراً و بدون نیاز به انتشار نسخه جدید در بازار، روی گوشی کاربران اعمال می‌شود.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">خرید اقساطی اسنپ‌پی (BNPL)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                فروش خود را چند برابر کنید! امکان پرداخت در ۴ قسط بدون سود و کارمزد برای مشتریان، با تفکیک هوشمند اقساط و نشانگر اختصاصی در صفحه کالا.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">گردونه شانس و جوایز روزانه</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                قابلیت گیمیفیکیشن شگفت‌انگیز برای جذب و بازگشت کاربران با انیمیشن روان، جوایز تخفیفی، ارسال رایگان و تایمر خنک‌کننده ۲۴ ساعته.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">ارسال نوتیفیکیشن همگانی</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ارسال تخفیف‌های ویژه، شگفت‌انگیز و اخبار فروشگاه به صورت نوتیفیکیشن مستقیم روی صفحه گوشی تمام خریداران با نرخ باز شدن بالا.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">اتصال مستقیم به ووکامرس</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                هماهنگی ۲۴ ساعته با هسته وردپرس شما: محصولات، قیمت‌ها، موجودی انبار، سفارش‌ها و کدهای تخفیف به طور خودکار همگام هستند.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">خروجی APK و AAB استاندارد</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تولید اتوماتیک باندل رسمی گوگل‌پلی و فایل نصبی کافه‌بازار و مایکت همراه با کلید امنیتی RSA برای انتشار قانونی و بی‌دردسر.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ساده و سریع
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              تنها در ۳ مرحله اپلیکیشن خود را تحویل بگیرید
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative">
            {/* Step 1 */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
                ۱
              </div>
              <h3 className="text-base font-bold text-white">ثبت‌نام و اتصال سایت</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                با شماره همراه وارد شوید و آدرس سایت ووکامرس خود را وارد نمایید تا کلیه محصولات بارگذاری شوند.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                ۲
              </div>
              <h3 className="text-base font-bold text-white">طراحی ویترین دلخواه</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                بنرها، استوری‌ها، گردونه شانس، نمادهای اعتماد و دسته‌بندی‌ها را مطابق سلیقه و برند خود بچینید.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                ۳
              </div>
              <h3 className="text-base font-bold text-white">دریافت فایل APK و انتشار</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                روی دکمه خروجی کلیک کنید؛ فایل‌های امضاشده APK و AAB بلافاصله آماده دانلود و انتشار خواهند بود.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section id="pricing" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              پلن‌های شفاف
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              پلن مناسب کسب‌وکار خود را انتخاب کنید
            </h2>
            <p className="text-xs text-slate-400">بدون هزینه‌های پنهان و با پشتیبانی کامل تیم فنی</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">پلن استارتر (برنزی)</span>
                <div className="text-2xl font-black text-white mb-2">۱,۵۰۰,۰۰۰ <span className="text-xs font-normal text-slate-400">تومان / ماهانه</span></div>
                <p className="text-xs text-slate-400 pb-4 border-b border-slate-800">مناسب فروشگاه‌های نوپا و تازه‌تاسیس</p>

                <ul className="space-y-2.5 py-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ ۱ اپلیکیشن اختصاصی</li>
                  <li className="flex items-center gap-2">✓ ۵ بیلد خروجی در ماه</li>
                  <li className="flex items-center gap-2">✓ اتصال کامل به ووکامرس</li>
                  <li className="flex items-center gap-2">✓ درگاه‌های پرداخت شتاب</li>
                  <li className="flex items-center gap-2 text-slate-500">✕ خرید اقساطی اسنپ‌پی</li>
                  <li className="flex items-center gap-2 text-slate-500">✕ گردونه شانس و جوایز</li>
                </ul>
              </div>

              <Link
                href="/builder"
                className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl transition"
              >
                شروع با این پلن
              </Link>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-rose-500 rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-rose-600/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                محبوب‌ترین و اقتصادی
              </div>

              <div>
                <span className="text-xs font-bold text-rose-400 block mb-1">پلن حرفه‌ای (نقره‌ای)</span>
                <div className="text-2xl font-black text-white mb-2">۴,۵۰۰,۰۰۰ <span className="text-xs font-normal text-slate-400">تومان / سالیانه</span></div>
                <p className="text-xs text-slate-400 pb-4 border-b border-slate-800">برای فروشگاه‌های فعال با تراکنش روزمره</p>

                <ul className="space-y-2.5 py-4 text-xs text-slate-200">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">✓ ۳ اپلیکیشن اختصاصی</li>
                  <li className="flex items-center gap-2 font-bold text-emerald-400">✓ ۳۰ بیلد خروجی ابری</li>
                  <li className="flex items-center gap-2">✓ اتصال ووکامرس دوطرفه</li>
                  <li className="flex items-center gap-2">✓ درگاه شتاب + اسنپ‌پی BNPL</li>
                  <li className="flex items-center gap-2">✓ گردونه جوایز و کوپن تخفیف</li>
                  <li className="flex items-center gap-2">✓ ارسال پوش‌نوتیفیکیشن همگانی</li>
                  <li className="flex items-center gap-2">✓ امضای امنیتی RSA-2048</li>
                </ul>
              </div>

              <Link
                href="/builder"
                className="w-full text-center bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-rose-600/30 transition"
              >
                انتخاب پلن حرفه‌ای
              </Link>
            </div>

            {/* Lifetime Enterprise Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-1">پلن نامحدود سازمانی (طلایی)</span>
                <div className="text-2xl font-black text-white mb-2">۲۱,۹۰۰,۰۰۰ <span className="text-xs font-normal text-slate-400">تومان / مادام‌العمر</span></div>
                <p className="text-xs text-slate-400 pb-4 border-b border-slate-800">یکبار پرداخت برای همیشه، بدون نیاز به تمدید</p>

                <ul className="space-y-2.5 py-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ نامحدود پروژه و اپلیکیشن</li>
                  <li className="flex items-center gap-2">✓ نامحدود بیلد خروجی بدون صف</li>
                  <li className="flex items-center gap-2">✓ تمام ماژول‌ها و پلاگین‌های اپتو</li>
                  <li className="flex items-center gap-2">✓ اسنپ‌پی، چت آنلاین و گردونه شانس</li>
                  <li className="flex items-center gap-2">✓ دریافت سورس‌کد اختصاصی فلاتر</li>
                  <li className="flex items-center gap-2">✓ پشتیبانی ویژه تلفنی و واتساپ</li>
                </ul>
              </div>

              <Link
                href="/builder"
                className="w-full text-center bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl transition"
              >
                خرید لایسنس طلایی
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              پاسخ به سوالات
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">پرسش‌های متداول مشتریان</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "آیا برای راه‌اندازی اپلیکیشن به هاست جداگانه نیاز دارم؟",
                a: "خیر، اپلیکیشن مستقیماً به سایت وردپرس و ووکامرس شما متصل می‌شود و از سرور خود شما اطلاعات را واکشی می‌کند. هیچ هاست یا سرور مجزایی نیاز نیست.",
              },
              {
                q: "آیا برای اعمال تغییرات در ظاهر اپ باید آپدیت جدید در بازار منتشر کنم؟",
                a: "خیر، به دلیل معماری فوق‌پیشرفته Server-Driven UI، هر زمان بنرها، اسلایدرها یا گردونه شانس را در پنل وب تغییر دهید، به طور آنی در گوشی تمام کاربران تغییر می‌کند.",
              },
              {
                q: "چگونه فایل APK و AAB را در کافه‌بازار و مایکت منتشر کنم؟",
                a: "سیستم خروجی‌ها را با کلید معتبر RSA-2048 امضا می‌کند و فایل AAB دقیقاً مطابق با آخرین استانداردهای گوگل‌پلی و کافه‌بازار تولید می‌شود و آماده تایید است.",
              },
              {
                q: "آیا خرید اقساطی اسنپ‌پی واقعاً بدون ضامن کار می‌کند؟",
                a: "بله، درگاه اسنپ‌پی به صورت خودکار اعتبار کاربر را بررسی کرده و مبلغ را در ۴ قسط ماهانه تسویه می‌کند بدون اینکه ریسکی متوجه شما باشد.",
              },
              {
                q: "آیا می‌توانم ظاهر و رنگ‌بندی اپلیکیشن را کاملاً شخصی‌سازی کنم؟",
                a: "بله، پالت رنگ سازمانی، گردی کارت‌ها، استایل نوار جستجو، لوگوی اختصاصی و آیکون اپ همگی در استودیو قابل تغییر هستند.",
              },
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-right flex items-center justify-between text-xs font-bold text-white hover:text-rose-400 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180 text-rose-500" : "text-slate-500"}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-right">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-black text-white text-sm">
                  AM
                </div>
                <span className="font-black text-base text-white">App Maker SaaS</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                سامانه هوشمند ساخت اپلیکیشن‌های موبایل فروشگاهی فلاتر متصل به ووکامرس با قابلیت سرور-دریون و تسویه شاپرک.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-bold text-white mb-3">دسترسی‌های سریع</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link href="/builder" className="hover:text-white transition">استودیو طراحی اپلیکیشن</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">داشبورد مدیریت پروژه‌ها</Link></li>
                <li><Link href="/admin" className="hover:text-white transition">پنل سوپرادمین سامانه</Link></li>
                <li><a href="http://localhost:5000/simulator.html" target="_blank" rel="noreferrer" className="hover:text-white transition">شبیه‌ساز زنده موبایل</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-bold text-white mb-3">پشتیبانی و ارتباط</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>تلفن تماس: ۰۲۱-۹۱۰۰۰۰۰۰</li>
                <li>پشتیبانی آنلاین: ۲۴ ساعته در چت استودیو</li>
                <li>پست الکترونیک: support@appmaker.ir</li>
                <li>آدرس: تهران، خیابان ولیعصر، برج فناوری</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-bold text-white mb-3">امنیت و استانداردهای توسعه</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                تمامی فایل‌های خروجی دارای امضای اختصاصی RSA-2048 بوده و سازگار با قوانین انتشار کافه‌بازار و مایکت هستند.
              </p>
              <div className="inline-block bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-[10px] text-emerald-400 font-bold">
                ✓ متصل به درگاه امن شاپرک و زرین‌پال
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>© تمامی حقوق برای پلتفرم اپ‌ساز App Maker محفوظ است.</span>
            <span>طراحی شده با Next.js 14 و Flutter Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
