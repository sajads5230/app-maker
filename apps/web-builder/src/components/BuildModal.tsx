"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCodeCard } from "./QrCodeCard";
import {
  X,
  Hammer,
  Loader2,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  PackageCheck,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu,
  Code2,
  Globe,
  ExternalLink,
  Crown,
  Store,
} from "lucide-react";

interface BuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  packageName: string;
  projectId?: string;
  isBuilding: boolean;
  currentJob: any | null;
  buildLogs: string;
  onStartBuild: (platform?: "ALL" | "APK" | "AAB" | "PWA") => void;
  targetPlatform: "ALL" | "APK" | "AAB" | "PWA";
  setTargetPlatform: (platform: "ALL" | "APK" | "AAB" | "PWA") => void;
  onOpenSubscriptionModal?: () => void;
  onOpenStoreRelease?: () => void;
}

export function BuildModal({
  isOpen,
  onClose,
  appName,
  packageName,
  projectId,
  isBuilding,
  currentJob,
  buildLogs,
  onStartBuild,
  targetPlatform,
  setTargetPlatform,
  onOpenSubscriptionModal,
  onOpenStoreRelease,
}: BuildModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (isBuilding && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [buildLogs, isBuilding]);

  if (!isOpen) return null;

  // Calculate Progress Percentage and Active Step
  const isSuccess = currentJob?.status === "SUCCESS";
  const isFailed = currentJob?.status === "FAILED";

  let percent = 0;
  let activeStep = 0;
  let stageLabel = "آماده‌سازی برای بیلد";

  if (isSuccess) {
    percent = 100;
    activeStep = 5;
    stageLabel = "کامپایل و آماده‌سازی بسته‌ها با موفقیت انجام شد! 🎉";
  } else if (isFailed) {
    percent = 100;
    activeStep = 0;
    stageLabel = "خطا در عملیات کامپایل";
  } else if (isBuilding) {
    percent = 15;
    activeStep = 1;
    stageLabel = "در حال تخصیص محیط ایزوله سندباکس...";

    if (buildLogs.includes("اعتبارسنجی و صدور گواهی")) {
      percent = 30;
      activeStep = 2;
      stageLabel = "تولید و اعتبارسنجی کلید امضای اختصاصی (Keystore RSA)...";
    }
    if (buildLogs.includes("تزریق متادیتا")) {
      percent = 50;
      activeStep = 3;
      stageLabel = "تزریق هویت اپلیکیشن، استایل‌ها و فونت کلمه FaNum...";
    }
    if (buildLogs.includes("کامپایل پکیج APK با موتور فلاتر")) {
      percent = 75;
      activeStep = 4;
      stageLabel = "کامپایل کدهای بومی فلاتر و پکیج ریلیز (AOT Engine)...";
    }
    if (buildLogs.includes("کامپایل بسته رسمی Android App Bundle")) {
      percent = 90;
      activeStep = 5;
      stageLabel = "تولید بسته رسمی کافه‌بازار و مایکت (AAB)...";
    }
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const steps = [
    { id: 1, title: "ایزوله‌سازی سندباکس", desc: "تخصیص دایرکتوری موقت" },
    { id: 2, title: "کلید امضای Keystore", desc: "تولید کلید رسمی ۲۵۶ بیتی" },
    { id: 3, title: "تزریق هویت و فونت", desc: "تنظیمات SDUI و کلمه FaNum" },
    { id: 4, title: "کامپایل Native فلاتر", desc: "تولید فایل‌های باینری ARM" },
    { id: 5, title: "انتشار پکیج‌های نهایی", desc: "آماده‌سازی APK و AAB" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Hammer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">
                  مرکز بیلد و خروجی رسمی اندروید (Build Studio)
                </span>
                {isBuilding && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>در حال ساخت ({percent}٪)</span>
                  </span>
                )}
                {isSuccess && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>آماده دانلود (۱۰۰٪)</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                کامپایل مستقیم با موتور رسمی Flutter و کیت ابزارهای Android SDK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSubscriptionModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSubscriptionModal();
                }}
                className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="مشاهده پلن‌های اشتراک تجاری و ارتقا"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>پلن‌های تجاری</span>
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
          {/* App Specifications Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">نام اپلیکیشن:</span>
              <strong className="text-white text-xs block truncate mt-0.5">{appName}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">شناسه پکیج:</span>
              <code className="text-emerald-400 text-[11px] font-mono block truncate mt-0.5" dir="ltr">
                {packageName}
              </code>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">فونت بومی:</span>
              <span className="text-slate-200 text-xs block truncate mt-0.5">کلمه فارسی (FaNum)</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">نوع معماری:</span>
              <span className="text-teal-400 text-xs font-bold block truncate mt-0.5">Release ARM64/v7</span>
            </div>
          </div>

          {/* Progress Bar & Percentage Indicator */}
          <div className="space-y-2 p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>{stageLabel}</span>
              </span>
              <span className="text-emerald-400 font-mono text-sm">{percent}٪</span>
            </div>

            {/* Glowing Animated Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isSuccess
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/40"
                    : isFailed
                    ? "bg-rose-500"
                    : "bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 animate-pulse shadow-md shadow-emerald-500/30"
                }`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>

            {/* Stage Indicators */}
            <div className="grid grid-cols-5 gap-1 pt-2">
              {steps.map((st) => {
                const isPassed = isSuccess || activeStep > st.id;
                const isCurrent = isBuilding && activeStep === st.id;

                return (
                  <div key={st.id} className="text-center">
                    <div
                      className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all ${
                        isPassed
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-amber-500 text-slate-950 animate-bounce"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : st.id}
                    </div>
                    <span
                      className={`text-[9px] block leading-tight font-medium truncate ${
                        isPassed || isCurrent ? "text-slate-200" : "text-slate-500"
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUCCESS State: Downloads Center */}
          {isSuccess && currentJob && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-3 animate-scaleUp">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>پکیج‌های نهایی با موفقیت کامپایل شدند و آماده نصب و انتشار هستند:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Real APK Download Button */}
                {currentJob.downloadUrl && (
                  <a
                    href={`http://localhost:4000${currentJob.downloadUrl}?v=${currentJob.id}`}
                    download
                    className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <div className="text-right">
                        <span className="block font-black">دانلود فایل نصبی (APK)</span>
                        <span className="text-[10px] text-emerald-200 font-normal">حجم واقعی: ~۵۶.۵ مگابایت</span>
                      </div>
                    </div>
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
                  </a>
                )}

                {/* Real AAB Download Button */}
                {currentJob.aabUrl && (
                  <a
                    href={`http://localhost:4000${currentJob.aabUrl}?v=${currentJob.id}`}
                    download
                    className="p-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/30 flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2">
                      <PackageCheck className="w-4 h-4" />
                      <div className="text-right">
                        <span className="block font-black">بسته رسمی مارکت‌ها (AAB)</span>
                        <span className="text-[10px] text-teal-200 font-normal">کافه‌بازار و مایکت: ~۵۴.۵ مگابایت</span>
                      </div>
                    </div>
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
                  </a>
                )}
              </div>

              {/* Full Flutter Source Code Download (Unlocked ZIP) */}
              <div className="pt-1">
                <a
                  href={`http://localhost:4000/downloads/${packageName}-flutter-source.zip`}
                  download
                  onClick={async () => {
                    try {
                      await fetch(`http://localhost:4000/api/projects/${projectId || 'app-demo-techmarket'}/export-source`);
                    } catch (_) {}
                  }}
                  className="p-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-300" />
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="block font-black">دانلود سورس‌کد کامل فلاتر (ZIP)</span>
                        <span className="text-[9px] bg-cyan-400/20 text-cyan-200 px-1.5 py-0.2 rounded font-medium">سورس آزاد بدون قفل</span>
                      </div>
                      <span className="text-[10px] text-cyan-200 font-normal">دارت ۳.۵، متادیتا، کانفیگ نیتیو، قابل کامپایل آفلاین</span>
                    </div>
                  </div>
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
                </a>
              </div>

              {/* Direct PWA Web App Button */}
              <div className="pt-1">
                <a
                  href={`/pwa?id=${projectId || ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-300" />
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="block font-black">اجرای نسخه وب و PWA (مخصوص کاربران آیفون)</span>
                        <span className="text-[9px] bg-blue-400/20 text-blue-200 px-1.5 py-0.2 rounded font-medium">اجرا بدون نصب</span>
                      </div>
                      <span className="text-[10px] text-blue-200 font-normal">دسترسی آنلاین به فروشگاه در مرورگر و امکان نصب به عنوان Web App</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </a>
              </div>

              {/* Direct Market Release Hub Button */}
              {onOpenStoreRelease && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenStoreRelease();
                    }}
                    className="w-full p-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/25 flex items-center justify-between transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-300" />
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="block font-black">مرکز انتشار در کافه‌بازار و مایکت</span>
                          <span className="text-[9px] bg-emerald-400/25 text-emerald-200 px-1.5 py-0.2 rounded font-medium">تست سازگاری ۱۰۰٪</span>
                        </div>
                        <span className="text-[10px] text-teal-100 font-normal">متادیتای سئو، چک‌لیست تایید و ارسال با API</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              )}

              {/* Keystore and Copy Link Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-500/20 text-[11px]">
                {currentJob.keystoreUrl && (
                  <a
                    href={`http://localhost:4000${currentJob.keystoreUrl}`}
                    download
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>دانلود کلید امضای اختصاصی (.jks)</span>
                  </a>
                )}

                {currentJob.downloadUrl && (
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `http://localhost:4000${currentJob.downloadUrl}`,
                        "apk-url"
                      )
                    }
                    className="text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedKey === "apk-url" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">لینک دانلود کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی لینک مستقیم دانلود</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Direct QR Code Scanner */}
              <div className="pt-2">
                <QrCodeCard
                  apkUrl={currentJob.downloadUrl ? `http://localhost:4000${currentJob.downloadUrl}` : undefined}
                  pwaUrl={typeof window !== "undefined" ? `${window.location.origin}/pwa?id=${projectId || ""}` : undefined}
                  appName={appName}
                />
              </div>
            </div>
          )}

          {/* Live Terminal Console */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>کنسول خروجی و لاگ‌های سرور بیلد (Live Terminal):</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Fastify & Build Worker</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 h-40 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed no-scrollbar select-text">
              {buildLogs ? (
                <div className="space-y-1">
                  {buildLogs.split("\n").map((line, idx) => (
                    <div
                      key={idx}
                      className={
                        line.includes("خطا")
                          ? "text-rose-400 font-bold"
                          : line.includes("آماده شد") || line.includes("موفقیت")
                          ? "text-emerald-400 font-bold"
                          : line.includes("کامپایل")
                          ? "text-amber-300"
                          : "text-slate-300"
                      }
                    >
                      {line}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              ) : (
                <div className="text-slate-600 h-full flex items-center justify-center text-xs">
                  در انتظار آغاز فرآیند ساخت و ارسال دستور کامپایل...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>نوع خروجی:</span>
            <div className="flex gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              {(["ALL", "APK", "AAB"] as const).map((plat) => (
                <button
                  key={plat}
                  onClick={() => setTargetPlatform(plat)}
                  disabled={isBuilding}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    targetPlatform === plat
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {plat === "ALL" ? "هر دو (APK + AAB)" : plat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSuccess && (
              <button
                onClick={() => onStartBuild(targetPlatform)}
                disabled={isBuilding}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>کامپایل مجدد</span>
              </button>
            )}

            {!isSuccess && (
              <button
                onClick={() => onStartBuild(targetPlatform)}
                disabled={isBuilding}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isBuilding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ساخت در سندباکس ابری ({percent}٪)...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>شروع کامپایل رسمی فلاتر</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
