"use client";

import React, { useState } from "react";
import { X, Check, Loader2, Settings2, RefreshCw, Zap, Activity, CheckCircle2, Copy } from "lucide-react";

interface PluginField {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "boolean" | "select" | "color";
  defaultValue?: any;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
}

export interface PluginItem {
  id: string;
  name: string;
  categoryName: string;
  description: string;
  color: string;
  icon: string;
  fields: PluginField[];
}

interface PluginConfigModalProps {
  plugin: PluginItem | null;
  configValues: Record<string, any>;
  isSaving: boolean;
  onClose: () => void;
  onChangeValue: (key: string, value: any) => void;
  onSave: () => void;
  renderPluginIcon: (iconName: string, className?: string) => React.ReactNode;
  onSyncWooCommerce?: () => void;
  isSyncingWoo?: boolean;
  onTestSimulateWebhook?: (productId: number, price: number, inStock: boolean) => Promise<any>;
  projectId?: string;
}

export function PluginConfigModal({
  plugin,
  configValues,
  isSaving,
  onClose,
  onChangeValue,
  onSave,
  renderPluginIcon,
  onSyncWooCommerce,
  isSyncingWoo,
  onTestSimulateWebhook,
  projectId,
}: PluginConfigModalProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);

  if (!plugin || typeof plugin !== "object" || !Array.isArray(plugin.fields)) return null;

  const handleSimulate = async () => {
    if (!onTestSimulateWebhook || isSimulating) return;
    setIsSimulating(true);
    setSimResult(null);
    try {
      // Toggle price of product 10160 between 17,900,000 and 18,450,000
      const newPrice = Math.random() > 0.5 ? 17900000 : 18450000;
      const res = await onTestSimulateWebhook(10160, newPrice, true);
      if (res?.message) {
        setSimResult(res.message);
      } else {
        setSimResult(`وب‌هوک با موفقیت دریافت و قیمت زنده کالا به ${newPrice.toLocaleString('fa-IR')} تومان تغییر یافت!`);
      }
    } catch (_) {
      setSimResult("خطا در ارسال شبیه‌ساز وب‌هوک");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{
                backgroundColor: `${plugin.color}25`,
                color: plugin.color,
              }}
            >
              {renderPluginIcon(plugin.icon, "w-4 h-4")}
            </div>
            <div>
              <span className="text-sm font-bold text-white block">
                پیکربندی {plugin.name}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {plugin.categoryName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-5 space-y-3.5 max-h-[60vh] overflow-y-auto no-scrollbar">
          <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            {plugin.description}
          </p>

          {(plugin.fields || []).map((field) => {
            const val = configValues[field.key] ?? field.defaultValue ?? "";

            return (
              <div key={field.key} className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  {field.label}:
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => onChangeValue(field.key, e.target.value)}
                    placeholder={field.placeholder || ""}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-mono"
                    dir="ltr"
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    value={val}
                    onChange={(e) =>
                      onChangeValue(field.key, Number(e.target.value))
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-mono"
                    dir="ltr"
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={val}
                    onChange={(e) => onChangeValue(field.key, e.target.value)}
                    placeholder={field.placeholder || ""}
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-indigo-500 leading-relaxed"
                  />
                )}

                {field.type === "boolean" && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={field.key}
                      checked={!!val}
                      onChange={(e) =>
                        onChangeValue(field.key, e.target.checked)
                      }
                      className="w-4 h-4 rounded-md accent-indigo-600 cursor-pointer"
                    />
                    <label
                      htmlFor={field.key}
                      className="text-xs text-slate-300 cursor-pointer"
                    >
                      فعال باشد
                    </label>
                  </div>
                )}

                {field.type === "select" && (
                  <select
                    value={val}
                    onChange={(e) => onChangeValue(field.key, e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                  >
                    {(field.options || []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "color" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={val}
                      onChange={(e) => onChangeValue(field.key, e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => onChangeValue(field.key, e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {plugin.id === "woocommerce" && (
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <button
                type="button"
                onClick={onSyncWooCommerce}
                disabled={isSyncingWoo || !configValues.siteUrl || !configValues.consumerKey || !configValues.consumerSecret}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSyncingWoo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال دریافت محصولات و دسته‌ها از سایت...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>همگام‌سازی دستی اولیه محصولات و دسته‌ها</span>
                  </>
                )}
              </button>

              {/* Two-Way Real-time Webhook Box */}
              <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      همگام‌سازی خودکار و لحظه‌ای وب‌هوک (Two-Way Live Sync)
                    </span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${
                    configValues.siteUrl
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>
                    {configValues.siteUrl ? `متصل به ${configValues.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}` : "⚠️ آدرس سایت تنظیم نشده"}
                  </span>
                </div>

                <p className="text-[10px] text-slate-300 leading-relaxed">
                  با ثبت وب‌هوک رسمی در ووکامرس، هرگونه تغییر قیمت، تخفیف، ناموجود شدن یا سفارش جدید در سایت به‌صورت آنی و خودکار در اپلیکیشن منعکس می‌شود بدون اینکه نیازی به زدن دکمه همگام‌سازی دستی باشد.
                </p>

                <div className="p-2 bg-slate-900 rounded-xl border border-slate-700/80 text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>آدرس شنونده وب‌هوک (Delivery URL):</span>
                    <span className="text-emerald-400 font-bold">POST</span>
                  </div>
                  <div className="font-mono text-[9px] text-indigo-300 break-all select-all dir-ltr text-left">
                    {`http://localhost:4000/api/woocommerce/webhook?projectId=${projectId || "app-demo-techmarket"}`}
                  </div>
                </div>

                {/* Instant Simulator Button */}
                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSimulating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>در حال ارسال سیگنال وب‌هوک به اپلیکیشن...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-3.5 h-3.5 text-emerald-200" />
                        <span>ارسال وب‌هوک تستی (تغییر آنی قیمت ماشین لباسشویی)</span>
                      </>
                    )}
                  </button>

                  {simResult && (
                    <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-[10px] text-emerald-300 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{simResult}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-5 border-t border-slate-800 bg-slate-850 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            انصراف
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>ذخیره تنظیمات</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
