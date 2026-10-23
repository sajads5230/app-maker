"use client";

import React, { useState } from "react";
import { QrCode, X, Copy, ExternalLink, Check, Smartphone, Wifi, Globe, Monitor } from "lucide-react";

interface LiveQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
}

export function LiveQrModal({ isOpen, onClose, appName = "شیائومی اسمارت" }: LiveQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<"simulator" | "builder" | "custom">("simulator");
  const [customIp, setCustomIp] = useState("192.168.100.88");

  if (!isOpen) return null;

  const targetUrls = {
    simulator: `http://${customIp}:5000/simulator.html`,
    builder: `http://${customIp}:3000`,
    custom: `http://${customIp}:5000/simulator.html`,
  };

  const activeUrl = targetUrls[selectedTarget];
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    activeUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">پیش‌نمایش زنده اپلیکیشن با QR</h3>
              <p className="text-[10px] text-slate-400">تست بلادرنگ روی دستگاه موبایل فیزیکی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col items-center">
          {/* Target Selector Tabs */}
          <div className="w-full flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4 text-[11px]">
            <button
              onClick={() => setSelectedTarget("simulator")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                selectedTarget === "simulator"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>شبیه‌ساز موبایل</span>
            </button>
            <button
              onClick={() => setSelectedTarget("builder")}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                selectedTarget === "builder"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>استودیو وب</span>
            </button>
          </div>

          {/* Network IP Input */}
          <div className="w-full mb-4">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400" />
                آدرس IP شبکه محلی (Wi-Fi):
              </span>
              <span className="text-[10px] text-slate-400 font-mono">192.168.100.88</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customIp}
                onChange={(e) => setCustomIp(e.target.value)}
                dir="ltr"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                placeholder="192.168.1.x"
              />
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-white rounded-2xl shadow-xl shadow-rose-950/20 border-4 border-slate-800 relative group">
            <img
              src={qrApiUrl}
              alt="QR Code"
              className="w-52 h-52 object-contain rounded-lg"
            />
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs font-bold text-white block">{appName}</span>
            <span className="text-[10px] text-slate-400 block font-mono mt-0.5" dir="ltr">
              {activeUrl}
            </span>
          </div>

          {/* URL Actions */}
          <div className="w-full flex items-center gap-2 mt-4">
            <button
              onClick={handleCopy}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "کپی شد!" : "کپی لینک مستقیم"}</span>
            </button>
            <a
              href={activeUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              title="باز کردن در مرورگر جدید"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>تست در مرورگر</span>
            </a>
          </div>

          {/* Step Instructions */}
          <div className="w-full mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[9px]">
                ۱
              </span>
              <span>گوشی و کامپیوتر را به یک شبکه وای‌فای (مودم یا هات‌اسپات) وصل کنید.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[9px]">
                ۲
              </span>
              <span>دوربین گوشی را مقابل این QR کد بگیرید تا لینک شناسایی شود.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[9px]">
                ۳
              </span>
              <span>تغییرات شما در استودیو فوراً روی گوشی هوشمندتان اعمال می‌شود!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
