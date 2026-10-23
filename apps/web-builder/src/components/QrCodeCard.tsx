"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode as QrIcon, Smartphone, Globe, Copy, Check, ExternalLink } from "lucide-react";

interface QrCodeCardProps {
  apkUrl?: string;
  pwaUrl?: string;
  appName?: string;
}

export function QrCodeCard({ apkUrl, pwaUrl, appName }: QrCodeCardProps) {
  const [activeMode, setActiveMode] = useState<"apk" | "pwa">("apk");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Determine current active URL to encode into QR code
  const currentUrl = activeMode === "apk" ? apkUrl : pwaUrl;

  useEffect(() => {
    if (!currentUrl) {
      setQrDataUrl("");
      return;
    }

    QRCode.toDataURL(currentUrl, {
      width: 200,
      margin: 1.5,
      color: {
        dark: "#0f172a", // slate-900
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Error generating QR Code:", err));
  }, [currentUrl, activeMode]);

  const copyLink = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!apkUrl && !pwaUrl) return null;

  return (
    <div className="p-3.5 bg-slate-900/90 border border-emerald-500/30 rounded-2xl space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <QrIcon className="w-4 h-4 text-emerald-400" />
          <span>اسکن و نصب مستقیم روی گوشی</span>
        </div>
        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
          QR Code هوشمند
        </span>
      </div>

      {/* Mode Switcher: APK vs PWA */}
      {apkUrl && pwaUrl && (
        <div className="flex rounded-lg bg-slate-800 p-0.5 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveMode("apk")}
            className={`flex-1 py-1 rounded-md transition flex items-center justify-center gap-1 cursor-pointer ${
              activeMode === "apk"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>نصب فایل نصبی (APK)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("pwa")}
            className={`flex-1 py-1 rounded-md transition flex items-center justify-center gap-1 cursor-pointer ${
              activeMode === "pwa"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>نسخه وب PWA (آیفون)</span>
          </button>
        </div>
      )}

      {/* QR Code and Instructions */}
      <div className="flex items-center gap-3">
        {/* QR Image Box */}
        <div className="p-1.5 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="w-28 h-28 object-contain rounded-lg"
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 text-[10px]">
              در حال تولید QR...
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="flex-1 space-y-1.5 text-right">
          <p className="text-[11px] font-bold text-slate-100 leading-tight">
            {activeMode === "apk" ? "دانلود آنی APK روی گوشی" : "اجرای نسخه PWA در آیفون"}
          </p>
          <p className="text-[9.5px] text-slate-400 leading-relaxed">
            {activeMode === "apk"
              ? "دوربین موبایل اندروید خود را مقابل بارکد بگیرید تا فایل APK مستقیماً دانلود و آماده نصب شود."
              : "با دوربین گوشی آیفون اسکن کنید تا در مرورگر سافاری باز شده و با Add to Home Screen نصب شود."}
          </p>

          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="text-[9.5px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded-md border border-slate-700 transition flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>کپی لینک</span>
                </>
              )}
            </button>
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[9.5px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition"
            >
              <span>باز کردن</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
