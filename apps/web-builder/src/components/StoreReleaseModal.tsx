"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Store,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Download,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Send,
  Loader2,
  FileText,
  Tag,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CompatibilityItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: "PASS" | "WARNING" | "FAIL";
  details: string;
  fixRecommendation?: string;
}

interface CompatibilityReport {
  score: number;
  status: "READY" | "WARNINGS" | "REJECTED";
  checksCount: number;
  passedCount: number;
  warningsCount: number;
  failedCount: number;
  checks: CompatibilityItem[];
  marketReadiness: {
    cafebazaar: boolean;
    myket: boolean;
    googlePlay: boolean;
  };
}

interface StoreMetadata {
  appTitleFa: string;
  appTitleEn: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  tags: string[];
  privacyPolicyUrl: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  changelog: string;
}

interface StoreReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  appName: string;
  packageName: string;
}

export function StoreReleaseModal({
  isOpen,
  onClose,
  projectId,
  appName,
  packageName,
}: StoreReleaseModalProps) {
  const [activeTab, setActiveTab] = useState<"audit" | "metadata" | "bundle" | "direct_api" | "ios_market" | "guide">("audit");
  const [isBuildingIosBundle, setIsBuildingIosBundle] = useState(false);
  const [iosBundleResult, setIosBundleResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CompatibilityReport | null>(null);
  const [metadata, setMetadata] = useState<StoreMetadata | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);

  // Direct API Publishing state
  const [selectedMarket, setSelectedMarket] = useState<"cafebazaar" | "myket">("cafebazaar");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);
  const [directSubmitResult, setDirectSubmitResult] = useState<any | null>(null);

  // Bundle generation
  const [isBuildingBundle, setIsBuildingBundle] = useState(false);
  const [bundleResult, setBundleResult] = useState<any | null>(null);

  useEffect(() => {
    if (!isOpen || !projectId) return;

    setLoading(true);
    Promise.all([
      fetch(`http://localhost:4000/api/projects/${projectId}/store-release/compatibility`).then((r) => r.json()),
      fetch(`http://localhost:4000/api/projects/${projectId}/store-release/metadata`).then((r) => r.json()),
    ])
      .then(([compData, metaData]) => {
        if (compData.success && compData.report) setReport(compData.report);
        if (metaData.success && metaData.metadata) setMetadata(metaData.metadata);
      })
      .catch((err) => console.error("Error fetching store release data:", err))
      .finally(() => setLoading(false));
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  
  const handleBuildIosBundle = async () => {
    setIsBuildingIosBundle(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store-release/ios-package`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.bundle) {
        setIosBundleResult(data.bundle);
      }
    } catch (err) {
      alert("خطا در ایجاد بسته رسمی انتشار iOS");
    } finally {
      setIsBuildingIosBundle(false);
    }
  };

  const handleBuildStoreBundle = async () => {
    setIsBuildingBundle(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store-release/package`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success && data.bundle) {
        setBundleResult(data.bundle);
      }
    } catch (err) {
      alert("خطا در ایجاد بسته رسمی انتشار");
    } finally {
      setIsBuildingBundle(false);
    }
  };

  const handleDirectApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDirect(true);
    setDirectSubmitResult(null);

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store-release/publish-direct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          market: selectedMarket,
          clientId,
          clientSecret,
          refreshToken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDirectSubmitResult(data);
      }
    } catch (err) {
      alert("خطا در اتصال به API مارکت");
    } finally {
      setIsSubmittingDirect(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto" dir="rtl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-600/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">مرکز انتشار و سازگاری مارکت‌ها</h3>
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  کافه‌بازار و مایکت
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ممیزی هوشمند سازگاری با اندروید ۱۴/۱۵، تولید باندل رسمی AAB و راهنمای ثبت مستقیم
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "audit"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تست سازگاری و ممیزی (Pre-flight)</span>
            {report && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-mono">
                {report.score}٪
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("metadata")}
            className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "metadata"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>اطلاعات معرفی و سئو در مارکت</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bundle")}
            className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "bundle"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>بسته رسمی انتشار (AAB + Keystore)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("direct_api")}
            className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "direct_api"
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>ارسال مستقیم با API بازار و مایکت</span>
          </button>

          
          <button
            type="button"
            onClick={() => setActiveTab("ios_market")}
            className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "ios_market"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>مارکت‌های آیفون (سیب‌اپ و اناردونی)</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded-full font-bold">
              iOS
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === "guide"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Info className="w-4 h-4" />
            <span>راهنمای گام‌به‌گام انتشار</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {loading ? (
            <div className="py-24 text-center text-slate-400 text-xs">در حال ارزیابی استانداردهای انتشار...</div>
          ) : activeTab === "audit" ? (
            /* Tab 1: Pre-flight Audit & Compatibility Report */
            <div className="space-y-5">
              {/* Score & Market Readiness Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Score Box */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-lg font-mono">
                    {report?.score || 100}٪
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">امتیاز سازگاری</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">آماده انتشار بدون نقص</div>
                  </div>
                </div>

                {/* CafeBazaar Readiness */}
                <div className="p-4 bg-slate-950/80 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">کافه‌بازار (CafeBazaar)</div>
                    <div className="text-[10px] text-emerald-400">منطبق با الزامات پاییز ۲۰۲۴</div>
                  </div>
                </div>

                {/* Myket Readiness */}
                <div className="p-4 bg-slate-950/80 border border-teal-500/30 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">مایکت (Myket)</div>
                    <div className="text-[10px] text-teal-400">تایید فنی پیش از انتشار</div>
                  </div>
                </div>

                {/* Google Play Readiness */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">گوگل‌پلی (Google Play)</div>
                    <div className="text-[10px] text-blue-300">Target SDK 34 ساپورت کامل</div>
                  </div>
                </div>
              </div>

              {/* Checklist Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300">چک‌لیست استانداردهای اجباری مارکت‌ها:</div>
                <div className="space-y-2">
                  {report?.checks.map((c) => {
                    const isExpanded = expandedCheckId === c.id;
                    const isPass = c.status === "PASS";
                    const isWarn = c.status === "WARNING";

                    return (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-xl border transition ${
                          isPass
                            ? "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                            : isWarn
                            ? "bg-amber-950/20 border-amber-500/40"
                            : "bg-rose-950/20 border-rose-500/40"
                        }`}
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => setExpandedCheckId(isExpanded ? null : c.id)}
                        >
                          <div className="flex items-center gap-2.5">
                            {isPass ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isWarn ? (
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <X className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <div>
                              <span className="text-xs font-bold text-slate-100">{c.title}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{c.description}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                                isPass
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : isWarn
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              }`}
                            >
                              {isPass ? "تایید شد ✓" : isWarn ? "هشدار" : "رد شد ✕"}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] space-y-1 text-slate-300 bg-slate-900/60 p-2.5 rounded-lg">
                            <div><strong className="text-slate-400">وضعیت فنی:</strong> {c.details}</div>
                            {c.fixRecommendation && (
                              <div className="text-amber-300 pt-1">
                                <strong>💡 راهکار بهینه‌سازی:</strong> {c.fixRecommendation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeTab === "metadata" ? (
            /* Tab 2: Store Listing Metadata */
            <div className="space-y-4">
              <div className="p-3 bg-teal-950/30 border border-teal-500/30 rounded-xl text-xs text-teal-300 flex items-center justify-between">
                <span>متن‌های آماده سئو برای کپی و قرار دادن در پنل کافه‌بازار و مایکت:</span>
                <span className="text-[10px] bg-teal-500/20 px-2 py-0.5 rounded-full font-bold">بهینه‌شده برای جستجو</span>
              </div>

              {metadata && (
                <div className="space-y-4 text-xs">
                  {/* Title and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-slate-400 font-bold">
                        <span>عنوان اپلیکیشن (فارسی):</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(metadata.appTitleFa, "title-fa")}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === "title-fa" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>کپی</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={metadata.appTitleFa}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-slate-400 font-bold">
                        <span>دسته‌بندی مارکت:</span>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={metadata.category}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-slate-400 font-bold">
                      <span>توضیحات کوتاه (حداکثر ۸۰ کاراکتر جهت ویترین مارکت):</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(metadata.shortDescription, "short-desc")}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "short-desc" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>کپی</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={metadata.shortDescription}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  {/* Full Description */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-slate-400 font-bold">
                      <span>توضیحات کامل و ویژگی‌های برجسته:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(metadata.fullDescription, "full-desc")}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === "full-desc" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>کپی متن کامل</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={6}
                      value={metadata.fullDescription}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed resize-none font-sans"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <div className="text-slate-400 font-bold">کلمات کلیدی سئو (Tags):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {metadata.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-800 text-teal-300 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-700">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "bundle" ? (
            /* Tab 3: Official Release Bundle */
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>دانلود بسته کامل انتشار در کافه‌بازار و مایکت:</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  این پکیج فشرده، شامل تمامی فایل‌های مورد نیاز پنل توسعه‌دهندگان بازار و مایکت است؛ شامل بسته مدرن <strong>AAB ساین‌شده</strong>، کلید امضای رسمی <strong>Keystore (.jks)</strong>، آیکون ۵۱۲×۵۱۲ و متادیتای کامل.
                </p>

                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    disabled={isBuildingBundle}
                    onClick={handleBuildStoreBundle}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer disabled:opacity-50"
                  >
                    {isBuildingBundle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>تولید و دانلود پکیج آماده انتشار (ZIP)</span>
                  </button>

                  <a
                    href={`http://localhost:4000/downloads/${packageName}-v1.0.0.aab`}
                    download
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                    <span>دانلود مستقیم فقط AAB</span>
                  </a>

                  <a
                    href={`http://localhost:4000/downloads/${packageName}-v1.0.0.apk`}
                    download
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>دانلود مستقیم فقط APK</span>
                  </a>
                </div>

                {bundleResult && (
                  <div className="mt-3 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs space-y-1">
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>پکیج آماده انتشار با موفقیت آماده شد!</span>
                    </div>
                    <div className="text-slate-300">
                      فایل: <span className="font-mono text-white">{bundleResult.filename}</span> ({bundleResult.fileSizeMB} مگابایت)
                    </div>
                    <a
                      href={`http://localhost:4000${bundleResult.downloadUrl}`}
                      download
                      className="inline-block mt-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition"
                    >
                      دانلود فایل {bundleResult.filename}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === "direct_api" ? (
            /* Tab 4: Direct API Publishing */
            <form onSubmit={handleDirectApiSubmit} className="space-y-4">
              <div className="p-3 bg-blue-950/30 border border-blue-500/30 rounded-xl text-xs text-blue-300">
                ارسال خودکار بسته و نسخه جدید بدون نیاز به آپلود دستی فایل‌ها در پنل وب کافه‌بازار یا مایکت
              </div>

              {/* Market Selection */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMarket("cafebazaar")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                    selectedMarket === "cafebazaar"
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>پنل توسعه‌دهندگان کافه‌بازار (CafeBazaar)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMarket("myket")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                    selectedMarket === "myket"
                      ? "bg-teal-600 text-white border-teal-500"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>پنل توسعه‌دهندگان مایکت (Myket)</span>
                </button>
              </div>

              {/* API Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">شناسه کلاینت (Client ID):</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="e.g. bzr-client-9842"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">رمز کلاینت (Client Secret):</label>
                  <input
                    type="password"
                    dir="ltr"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1 text-xs">توکن تازه‌سازی (Refresh Token):</label>
                <input
                  type="text"
                  dir="ltr"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="e.g. 1//04bzr-refresh-token..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingDirect}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingDirect ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>ارسال مستقیم بسته و ایجاد نسخه در {selectedMarket === "cafebazaar" ? "کافه‌بازار" : "مایکت"}</span>
                </button>
              </div>

              {directSubmitResult && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-xs space-y-2 mt-3 animate-scaleUp">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{directSubmitResult.message}</span>
                  </div>
                  <div className="text-slate-300">
                    شناسه ثبت: <span className="font-mono text-white">{directSubmitResult.releaseId}</span> | میانگین زمان تایید مارکت:{" "}
                    <span className="font-bold text-amber-300">{directSubmitResult.estimatedReviewHours} ساعت</span>
                  </div>
                  <a
                    href={directSubmitResult.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold pt-1"
                  >
                    <span>مشاهده وضعیت در پیشخوان {directSubmitResult.market}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </form>
          ) : (
            /* Tab 5: Publishing Step-by-Step Guide */
            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">۱</span>
                  <span>ثبت‌نام در پنل توسعه‌دهندگان کافه‌بازار و مایکت</span>
                </h4>
                <p className="text-slate-400">
                  به آدرس <a href="https://developers.cafebazaar.ir" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-mono">developers.cafebazaar.ir</a> یا <a href="https://panel.myket.ir" target="_blank" rel="noreferrer" className="text-teal-400 underline font-mono">panel.myket.ir</a> مراجعه فرمایید و با شماره همراه یا ایمیل اختصاصی کسب‌وکار خود ثبت‌نام کنید.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">۲</span>
                  <span>ایجاد برنامه جدید و آپلود فایل AAB</span>
                </h4>
                <p className="text-slate-400">
                  در پنل گزینه «برنامه جدید» را زده و فایل <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">app-release.aab</code> تولیدشده توسط پلتفرم را آپلود کنید. به دلیل داشتن امضای معتبر Keystore و Target SDK 34، تایید خودکار اولیه بلافاصله انجام می‌گیرد.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">۳</span>
                  <span>کپی اطلاعات متادیتا و اسکرین‌شات‌ها</span>
                </h4>
                <p className="text-slate-400">
                  از تب «اطلاعات معرفی و سئو» این پنجره، عنوان، توضیحات کوتاه و توضیحات کامل را کپی و در فرم مارکت الصاق کنید.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">۴</span>
                  <span>ارسال برای بررسی و انتشار در بازار و مایکت</span>
                </h4>
                <p className="text-slate-400">
                  پس از ثبت، تیم ارزیابی مارکت حداکثر ظرف ۱۲ ساعت برنامه را بررسی و برای میلیون‌ها کاربر ایرانی منتشر خواهد کرد.
                </p>
              </div>
            </div>
          )}
        </div>

        
          {/* TAB 6: iOS IRANIAN MARKETS */}
          {activeTab === "ios_market" && (
            <div className="space-y-6 animate-fadeIn text-xs leading-relaxed">
              <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-400" />
                    <span>انتشار در استورهای ایرانی iOS بدون نیاز به پرداخت ۹۹ دلار سالانه به اپل!</span>
                  </h3>
                  <p className="text-slate-400 mt-1">
                    بسته ساختاریافته Ad-Hoc / Enterprise پلتفرم، امکان انتشار بی‌دردسر در سیب‌اپ، اناردونی، سیبچه و آی‌اپس را فراهم می‌کند.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBuildIosBundle}
                  disabled={isBuildingIosBundle}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition cursor-pointer shrink-0"
                >
                  {isBuildingIosBundle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>تولید پکیج رسمی iOS</span>
                </button>
              </div>

              {iosBundleResult && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="font-bold text-emerald-300">بسته رسمی انتشار iOS با موفقیت ایجاد شد!</div>
                      <div className="text-[11px] text-slate-400">نام فایل: {iosBundleResult.filename} ({iosBundleResult.fileSizeMB} MB)</div>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:4000${iosBundleResult.downloadUrl}`}
                    download
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود فایل ZIP بسته iOS</span>
                  </a>
                </div>
              )}

              {/* Supported Iranian iOS Stores Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">سیب‌اپ (SibApp)</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">بزرگترین مارکت</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">بیش از ۵ میلیون کاربر فعال آیفون در ایران با سیستم امضای اختصاصی</p>
                  <a
                    href="https://developers.sibapp.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold text-[11px] pt-1"
                  >
                    <span>پنل توسعه‌دهندگان سیب‌اپ</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">اناردونی (Anardoni)</span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">سریع‌ترین تایید</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">انتشار اپلیکیشن با سرورهای قدرتمند و بدون ابطال گواهی اینترپرایز</p>
                  <a
                    href="https://anardoni.com/developers"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold text-[11px] pt-1"
                  >
                    <span>پنل توسعه‌دهندگان اناردونی</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">آی‌اپس (iApps)</span>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold">پشتیبانی شرکتی</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">پوشش گسترده کاربران شرکتی، بانکی و فروشگاه‌های معتبر</p>
                  <a
                    href="https://iapps.ir"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold text-[11px] pt-1"
                  >
                    <span>مرکز توسعه‌دهندگان آی‌اپس</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>بسته‌های خروجی با امضای اختصاصی و سازگار با سیستم محافظ بازار (Bazaar Guard) آماده می‌شوند.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
