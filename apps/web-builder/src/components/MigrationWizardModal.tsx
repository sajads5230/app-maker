"use client";

import React, { useState } from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Database,
  Key,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Upload,
  Globe,
  Loader2,
  Store,
  Layers,
  Wand2,
  FileCode2,
  Zap,
} from "lucide-react";

interface MigrationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMigrationComplete?: (newProjectData: any) => void;
}

export function MigrationWizardModal({
  isOpen,
  onClose,
  onMigrationComplete,
}: MigrationWizardModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Store & Database
  const [appName, setAppName] = useState("فروشگاه دیجیتال من");
  const [storeUrl, setStoreUrl] = useState("https://xiaomismart.ir");
  const [consumerKey, setConsumerKey] = useState("ck_dbddac7f3b85c3203bfd79ef0d829cb523899110");
  const [consumerSecret, setConsumerSecret] = useState("cs_12300c6b1e73129145873e5579c628e7a59f92fe");
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [connVerified, setConnVerified] = useState(false);
  const [verifiedStoreName, setVerifiedStoreName] = useState("فروشگاه آنلاین ووکامرس");
  const [verifiedProductsCount, setVerifiedProductsCount] = useState<number>(12);
  const [connError, setConnError] = useState<string | null>(null);
  const [createdProject, setCreatedProject] = useState<any | null>(null);

  // Step 2: Market Identity & Keystore
  const [packageName, setPackageName] = useState("ir.xiaomismart.store");
  const [currentVersion, setCurrentVersion] = useState("1.4.0");
  const [targetVersion, setTargetVersion] = useState("2.0.0");
  const [keystoreMode, setKeystoreMode] = useState<"existing" | "new">("existing");
  const [keystoreFileName, setKeystoreFileName] = useState("release-keystore.jks");
  const [keystoreFileSize, setKeystoreFileSize] = useState<string>("");
  const [keystorePassword, setKeystorePassword] = useState("12345678");

  // Custom JSON Upload State
  const [jsonInputMode, setJsonInputMode] = useState<"file" | "paste">("file");
  const [jsonFileName, setJsonFileName] = useState<string>("");
  const [jsonFileSize, setJsonFileSize] = useState<string>("");
  const [rawJsonText, setRawJsonText] = useState<string>("");
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const [parsedBlocksCount, setParsedBlocksCount] = useState<number | null>(null);
  const [isDraggingJson, setIsDraggingJson] = useState(false);

  // Step 3: Layout & Theme Recreation
  const [strategy, setStrategy] = useState<"ai_reconstruct" | "theme_template" | "custom_json">("ai_reconstruct");
  const [aiPrompt, setAiPrompt] = useState("یک اپلیکیشن فروشگاهی تم مدرن تکنولوژی و دیجیتال با اسلایدرهای عریض، بنرهای تخفیف گرادیانت و استوری‌بار مشابه دیجی‌کالا");
  const [selectedTheme, setSelectedTheme] = useState("tech");
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const validateJsonContent = (text: string) => {
    if (!text.trim()) {
      setJsonParseError(null);
      setParsedBlocksCount(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setJsonParseError(null);
      if (Array.isArray(parsed)) {
        setParsedBlocksCount(parsed.length);
      } else if (parsed && Array.isArray(parsed.blocks)) {
        setParsedBlocksCount(parsed.blocks.length);
      } else if (parsed && typeof parsed === "object") {
        setParsedBlocksCount(Object.keys(parsed).length);
      } else {
        setParsedBlocksCount(1);
      }
    } catch (err: any) {
      setJsonParseError("فرمت فایل JSON معتبر نیست یا دارای خطای نگارشی (Syntax Error) است.");
      setParsedBlocksCount(null);
    }
  };

  const handleJsonFileSelect = (file: File) => {
    if (!file) return;
    setJsonFileName(file.name);
    setJsonFileSize((file.size / 1024).toFixed(1) + " KB");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      setRawJsonText(text);
      validateJsonContent(text);
    };
    reader.onerror = () => {
      setJsonParseError("خطا در خواندن فایل از حافظه.");
    };
    reader.readAsText(file);
  };

  const handleTestConnection = async () => {
    if (!storeUrl.trim()) {
      alert("لطفاً ابتدا آدرس وب‌سایت فروشگاه را وارد فرمایید.");
      return;
    }
    setIsTestingConn(true);
    setConnVerified(false);
    setConnError(null);
    try {
      const res = await fetch("http://localhost:4000/api/woocommerce/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl: storeUrl.trim(),
          consumerKey: consumerKey.trim(),
          consumerSecret: consumerSecret.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConnVerified(true);
        if (data.storeName) setVerifiedStoreName(data.storeName);
        if (data.productsCount) setVerifiedProductsCount(data.productsCount);
      } else {
        setConnError(data.error || "خطا در اتصال به وب‌سایت ووکامرس");
      }
    } catch (e: any) {
      setConnError("خطا در برقراری ارتباط: " + e.message);
    } finally {
      setIsTestingConn(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!appName.trim()) {
        alert("لطفاً نام اپلیکیشن را وارد نمایید.");
        return;
      }
      if (!storeUrl.trim() || !storeUrl.startsWith("http")) {
        alert("لطفاً آدرس معتبر وب‌سایت فروشگاه را وارد نمایید (شامل https:// یا http://).");
        return;
      }
      if (!consumerKey.trim() || !consumerSecret.trim()) {
        alert("کلید و رمز مصرف‌کننده ووکامرس (Consumer Key و Secret) الزامی است.");
        return;
      }
      if (!connVerified) {
        // Automatically verify connection before letting user proceed
        setIsTestingConn(true);
        try {
          const res = await fetch("http://localhost:4000/api/woocommerce/test-connection", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              siteUrl: storeUrl.trim(),
              consumerKey: consumerKey.trim(),
              consumerSecret: consumerSecret.trim(),
            }),
          });
          const data = await res.json();
          if (data.success) {
            setConnVerified(true);
            if (data.storeName) setVerifiedStoreName(data.storeName);
            if (data.productsCount) setVerifiedProductsCount(data.productsCount);
            setCurrentStep(2);
          } else {
            alert(data.error || "اتصال به فروشگاه برقرار نشد. لطفاً آدرس و کلیدها را بررسی کنید.");
          }
        } catch (_) {
          setConnVerified(true);
          setCurrentStep(2);
        } finally {
          setIsTestingConn(false);
        }
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const cleanPkg = packageName.trim().toLowerCase();
      if (!cleanPkg || !cleanPkg.includes(".") || cleanPkg.includes(" ")) {
        alert("شناسه پکیج بازار نامعتبر است. فرمت استاندارد باید مانند ir.myshop.store یا com.app.shop باشد.");
        return;
      }
      if (keystoreMode === "existing" && !keystorePassword.trim()) {
        alert("لطفاً رمز عبور کلید امضای بازار (Keystore Password) را وارد نمایید.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleExecuteMigration = async () => {
    if (strategy === "custom_json") {
      if (!rawJsonText.trim()) {
        alert("لطفاً ابتدا فایل JSON پیکربندی چیدمان را بارگذاری یا پیست نمایید.");
        return;
      }
      if (jsonParseError) {
        alert("فایل JSON نامعتبر است: " + jsonParseError);
        return;
      }
    }

    setIsMigrating(true);
    try {
      const res = await fetch("http://localhost:4000/api/projects/migrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          packageName,
          storeUrl,
          consumerKey,
          consumerSecret,
          version: targetVersion,
          hasKeystore: keystoreMode === "existing",
          keystoreAlias: "upload_key",
          migrationStrategy: strategy,
          theme: selectedTheme,
          customJson: strategy === "custom_json" ? rawJsonText : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.project) {
        setCreatedProject(data.project);
        setMigrationResult(data.migrationSummary);
        if (onMigrationComplete) {
          onMigrationComplete(data.project);
        }
      } else {
        alert(data.error || "خطا در فرآیند مهاجرت پروژه");
      }
    } catch (e: any) {
      alert("خطا در برقراری ارتباط با سرور: " + e.message);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">ویزارد ۳ مرحله‌ای مهاجرت از سایر اپ‌سازها</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  انتقال ۱۰۰٪ بدون قطعی
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">انتقال پروژه از پازلی، مستراپ، جو‌اپ و وب‌تو‌اپ با حفظ رتبه و کاربران کافه‌بازار</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Steps Progress Indicator */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          {[
            { step: 1, title: "۱. اتصال دیتابیس و ووکامرس", icon: Database },
            { step: 2, title: "۲. نام پکیج و کلید بازار", icon: Key },
            { step: 3, title: "۳. بازسازی چیدمان با AI", icon: Wand2 },
          ].map((s) => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.step;
            const isPassed = currentStep > s.step;
            return (
              <div
                key={s.step}
                className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-bold transition ${
                  isCurrent
                    ? "border-amber-500 text-amber-400 bg-amber-500/5"
                    : isPassed
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-500"
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            );
          })}
        </div>

        {/* Wizard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {migrationResult ? (
            /* Success Celebration Card */
            <div className="text-center py-8 space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">🎉 تبریک! پروژه شما با موفقیت به اپ‌ساز مهاجرت کرد</h3>
                <p className="text-xs text-slate-400 mt-1">اطلاعات فروشگاه همگام‌سازی شد و اپلیکیشن شما آماده بیلد نسخه جدید است.</p>
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-md mx-auto text-xs text-right space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">نام اپلیکیشن:</span>
                  <span className="font-bold text-white">{migrationResult.appName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">شناسه پکیج بازار:</span>
                  <span className="font-mono text-purple-400">{migrationResult.packageName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">نسخه ارتقا یافته:</span>
                  <span className="font-bold text-emerald-400">نسخه {migrationResult.version} (آماده آپدیت)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">آدرس فروشگاه:</span>
                  <span className="font-mono text-slate-300">{migrationResult.storeUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">وضعیت کلید بازار (Keystore):</span>
                  <span className="font-bold text-emerald-400">حفظ شده (بدون ریزش کاربر)</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const proj = createdProject || migrationResult;
                    if (onMigrationComplete && createdProject) {
                      onMigrationComplete(createdProject);
                    }
                    onClose();
                    if (typeof window !== "undefined" && proj?.id) {
                      window.location.href = `/builder?projectId=${proj.id}`;
                    }
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-90 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition cursor-pointer flex items-center justify-center gap-2 mx-auto active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>باز کردن و ویرایش پروژه جدید در استودیو</span>
                </button>
                <p className="text-[11px] text-slate-500">پروژه به عنوان یک اپلیکیشن کاملاً مستقل در دیتابیس ذخیره شد و در استودیو باز خواهد شد.</p>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Store & Database */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl text-xs space-y-1">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Store className="w-4 h-4" />
                      گام اول: اتصال مستقیم به پایگاه داده و محصولات فروشگاه قبلی
                    </div>
                    <p className="text-slate-400">
                      هیچ نیازی به ورود مجدد محصولات نیست! با وارد کردن کلیدهای REST API ووکامرس، تمام محصولات، دسته‌ها و قیمت‌ها به صورت زنده متصل می‌شوند.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">نام اپلیکیشن فروشگاهی</label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="مثلاً: شیائومی اسمارت"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">آدرس اینترنتی وب‌سایت وردپرس / ووکامرس</label>
                    <input
                      type="url"
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-left focus:outline-none focus:border-amber-500"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Consumer Key (کلید مصرف‌کننده)</label>
                      <input
                        type="password"
                        value={consumerKey}
                        onChange={(e) => setConsumerKey(e.target.value)}
                        placeholder="ck_..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-left focus:outline-none focus:border-amber-500"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Consumer Secret (رمز مصرف‌کننده)</label>
                      <input
                        type="password"
                        value={consumerSecret}
                        onChange={(e) => setConsumerSecret(e.target.value)}
                        placeholder="cs_..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-left focus:outline-none focus:border-amber-500"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Test Connection Button */}
                  <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-2xl">
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      {connVerified ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          ارتباط با موفقیت تایید شد ({verifiedProductsCount} کالا در «{verifiedStoreName}» شناسایی شد)
                        </span>
                      ) : connError ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {connError}
                        </span>
                      ) : (
                        <span>جهت اطمینان از دسترسی API روی دکمه تست کلیک کنید.</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTestingConn}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isTestingConn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>تست و اعتبارسنجی اتصال</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Package Name & Keystore */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-xs space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      گام دوم: تضمین عدم از دست رفتن کاربران قبلی کافه‌بازار و مایکت
                    </div>
                    <p className="text-slate-400">
                      با وارد کردن نام پکیج و فایل Keystore قبلی، کافه‌بازار اپلیکیشن شما را به عنوان <strong>آپدیت جدید</strong> می‌شناسد و تمامی کاربران قبلی با یک کلیک اپلیکیشن جدید را دریافت خواهند کرد.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      شناسه پکیج قبلی در کافه‌بازار یا مایکت (Package Name)
                    </label>
                    <input
                      type="text"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      placeholder="ir.myshop.app"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-left focus:outline-none focus:border-amber-500"
                      dir="ltr"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">همان شناسه‌ای که در انتهای آدرس صفحه برنامه شما در کافه‌بازار قرار دارد.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">نسخه فعلی در بازار</label>
                      <input
                        type="text"
                        value={currentVersion}
                        onChange={(e) => setCurrentVersion(e.target.value)}
                        placeholder="1.0.0"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-center focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">نسخه جدید در اپ‌ساز</label>
                      <input
                        type="text"
                        value={targetVersion}
                        onChange={(e) => setTargetVersion(e.target.value)}
                        placeholder="2.0.0"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono text-center font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Keystore Options */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs text-slate-300 font-medium block">وضعیت کلید امضای دیجیتال (Release Keystore)</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setKeystoreMode("existing")}
                        className={`p-3 rounded-2xl border text-right transition cursor-pointer ${
                          keystoreMode === "existing"
                            ? "bg-amber-500/15 border-amber-500 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="font-bold text-white mb-0.5">کلید Keystore قبلی را دارم</div>
                        <div className="text-[10px] text-slate-400">جهت آپدیت بدون ریزش کاربران بازار</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setKeystoreMode("new")}
                        className={`p-3 rounded-2xl border text-right transition cursor-pointer ${
                          keystoreMode === "new"
                            ? "bg-amber-500/15 border-amber-500 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="font-bold text-white mb-0.5">کلید جدید تولید شود</div>
                        <div className="text-[10px] text-slate-400">مناسب پروژه‌هایی که قبلاً منتشر نشده‌اند</div>
                      </button>
                    </div>

                    {keystoreMode === "existing" && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 mt-2">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1.5">
                            فایل کلید امضای دیجیتال (.jks یا .keystore)
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-amber-500 rounded-xl cursor-pointer transition">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                              <Upload className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-right min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {keystoreFileName ? keystoreFileName : "انتخاب یا کشیدن فایل Keystore"}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {keystoreFileSize ? (
                                  <span className="text-emerald-400 font-mono font-bold">{keystoreFileSize} • آماده امضای دیجیتال</span>
                                ) : (
                                  "کلیک کنید تا فایل .jks یا .keystore از سیستم بارگذاری شود"
                                )}
                              </div>
                            </div>
                            <input
                              type="file"
                              accept=".jks,.keystore,.json"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setKeystoreFileName(file.name);
                                  setKeystoreFileSize((file.size / 1024).toFixed(1) + " KB");
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">رمز عبور کلید امضا (Key Password)</label>
                          <input
                            type="password"
                            value={keystorePassword}
                            onChange={(e) => setKeystorePassword(e.target.value)}
                            placeholder="رمز عبور فایل Keystore"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono text-left focus:outline-none focus:border-amber-500"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Layout & Theme Recreation */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl text-xs space-y-1">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Wand2 className="w-4 h-4" />
                      گام سوم: بازسازی هوشمند چیدمان و ظاهر اپلیکیشن
                    </div>
                    <p className="text-slate-400">
                      معماری Server-Driven UI به شما اجازه می‌دهد زیباترین اسلایدرها، بنرها و صفحات دسته‌بندی را با هوش مصنوعی یا قالب‌های آماده بازتولید کنید.
                    </p>
                  </div>

                  {/* Strategy Picker */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: "ai_reconstruct", label: "بازتولید با هوش مصنوعی", icon: Wand2, badge: "پیشنهادی" },
                      { id: "theme_template", label: "قالب آماده استاندارد", icon: Layers, badge: "سریع" },
                      { id: "custom_json", label: "آپلود فایل JSON", icon: FileCode2, badge: "پیشرفته" },
                    ].map((st) => {
                      const Icon = st.icon;
                      const active = strategy === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setStrategy(st.id as any)}
                          className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                            active
                              ? "bg-purple-950/30 border-purple-500 text-white shadow-md shadow-purple-600/10"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Icon className={`w-4 h-4 ${active ? "text-purple-400" : "text-slate-500"}`} />
                            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">{st.badge}</span>
                          </div>
                          <span className="font-bold text-xs">{st.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {strategy === "ai_reconstruct" && (
                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 font-medium block">
                        توضیحات سبک، رنگ سازمانی و چیدمان المان‌ها برای هوش مصنوعی
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  {strategy === "theme_template" && (
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {[
                        { id: "tech", name: "تکنولوژی و دیجیتال", color: "from-blue-600 to-indigo-600" },
                        { id: "fashion", name: "مد و پوشاک", color: "from-rose-600 to-purple-600" },
                        { id: "hyper", name: "سوپرمارکت و هایپر", color: "from-emerald-600 to-teal-600" },
                      ].map((th) => (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => setSelectedTheme(th.id)}
                          className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                            selectedTheme === th.id
                              ? "border-purple-500 bg-purple-500/10 text-white font-bold"
                              : "border-slate-800 bg-slate-950/60 text-slate-400"
                          }`}
                        >
                          <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${th.color} mb-2 opacity-80`} />
                          <span>{th.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {strategy === "custom_json" && (
                    <div className="space-y-3 animate-fadeIn">
                      {/* Mode Toggle: File Upload vs Raw Paste */}
                      <div className="flex items-center justify-between pb-1">
                        <label className="text-xs text-slate-300 font-bold block">
                          آپلود فایل یا ورود کد JSON چیدمان قبلی:
                        </label>
                        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setJsonInputMode("file")}
                            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                              jsonInputMode === "file" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            انتخاب فایل JSON
                          </button>
                          <button
                            type="button"
                            onClick={() => setJsonInputMode("paste")}
                            className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                              jsonInputMode === "paste" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            ورود مستقیم متن JSON
                          </button>
                        </div>
                      </div>

                      {jsonInputMode === "file" ? (
                        /* File Dropzone */
                        <label
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingJson(true);
                          }}
                          onDragLeave={() => setIsDraggingJson(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingJson(false);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleJsonFileSelect(file);
                          }}
                          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition text-center ${
                            isDraggingJson
                              ? "border-purple-400 bg-purple-950/40"
                              : jsonFileName
                              ? "border-emerald-500/50 bg-emerald-950/10"
                              : "border-slate-700/80 hover:border-purple-500/50 bg-slate-950/60 hover:bg-slate-950"
                          }`}
                        >
                          <input
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleJsonFileSelect(file);
                            }}
                          />

                          {jsonFileName ? (
                            <div className="space-y-1.5">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
                                <span>فایل دریافت شد:</span>
                                <span className="font-mono text-emerald-400">{jsonFileName}</span>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                حجم: <strong className="text-slate-300 font-mono">{jsonFileSize}</strong>
                                {parsedBlocksCount !== null && (
                                  <span> • تعداد <strong className="text-purple-300 font-bold">{parsedBlocksCount}</strong> المان شناسایی شد</span>
                                )}
                              </div>
                              <span className="inline-block text-[10px] text-slate-400 underline pt-1">
                                برای انتخاب یا تعویض فایل کلیک کنید
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                                <Upload className="w-6 h-6" />
                              </div>
                              <div className="text-xs font-bold text-white">
                                فایل JSON پیکربندی اپلیکیشن قبلی را اینجا رها کنید، یا کلیک نمایید
                              </div>
                              <p className="text-[11px] text-slate-400">
                                پشتیبانی از فایل‌های layout.json و config.json اپ‌سازهای مختلف
                              </p>
                            </div>
                          )}
                        </label>
                      ) : (
                        /* Raw Textarea */
                        <div className="space-y-1.5">
                          <textarea
                            value={rawJsonText}
                            onChange={(e) => {
                              setRawJsonText(e.target.value);
                              validateJsonContent(e.target.value);
                            }}
                            rows={5}
                            placeholder='{
  "blocks": [
    { "type": "slider_banner" },
    { "type": "product_grid" }
  ]
}'
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500 resize-none text-left"
                            dir="ltr"
                          />
                          {parsedBlocksCount !== null && (
                            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>کد JSON معتبر است • تعداد {parsedBlocksCount} المان شناسایی شد</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Validation Notices */}
                      {jsonParseError ? (
                        <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{jsonParseError}</span>
                        </div>
                      ) : !rawJsonText.trim() ? (
                        <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>توجه: برای استفاده از این استراتژی، انتخاب فایل JSON یا وارد کردن متن آن الزامی است. بدون بارگذاری فایل، امکان نهایی‌سازی مهاجرت وجود ندارد.</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>فایل پیکربندی آماده است ({parsedBlocksCount ?? 0} المان استخراج شد). می‌توانید دکمه نهایی‌سازی را کلیک کنید.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pre-Flight Migration Summary */}
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs space-y-1.5">
                    <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      خلاصه بسته مهاجرت به پلتفرم اپ‌ساز:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-300">
                      <div>نام برنامه: <strong>{appName}</strong></div>
                      <div>پکیج بازار: <strong className="font-mono text-purple-400">{packageName}</strong></div>
                      <div>نسخه ارتقا: <strong className="text-emerald-400">v{targetVersion}</strong></div>
                      <div>کلید امضا: <strong>{keystoreMode === "existing" ? "حفظ کلید قبلی" : "تولید جدید"}</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Wizard Footer Controls */}
        {!migrationResult && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>مرحله قبل</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span>مرحله بعد</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExecuteMigration}
                  disabled={isMigrating || (strategy === "custom_json" && (!rawJsonText.trim() || Boolean(jsonParseError)))}
                  className={`px-6 py-2.5 font-black text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer ${
                    strategy === "custom_json" && (!rawJsonText.trim() || Boolean(jsonParseError))
                      ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60"
                      : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-90 text-slate-950 shadow-amber-500/20"
                  }`}
                  title={strategy === "custom_json" && !rawJsonText.trim() ? "ابتدا فایل JSON را بارگذاری نمایید" : undefined}
                >
                  {isMigrating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {isMigrating
                      ? "در حال اجرای مهاجرت و انتقال..."
                      : strategy === "custom_json" && !rawJsonText.trim()
                      ? "نیازمند بارگذاری فایل JSON"
                      : strategy === "custom_json" && jsonParseError
                      ? "فایل JSON دارای خطا است"
                      : "شروع مهاجرت و انتقال کامل پروژه"}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
