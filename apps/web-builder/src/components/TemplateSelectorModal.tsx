"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";
import { STORE_TEMPLATES, StoreTemplate } from "../lib/templates";

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: StoreTemplate) => void;
}

export function TemplateSelectorModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplateSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              کتابخانه ۵ قالب آماده فروشگاهی و شرکتی
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              اعمال فوری قالب متناسب با صنف کسب‌وکار روی بوم طراحی استودیو
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto space-y-3">
          {STORE_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-xl cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">{tmpl.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-rose-400 transition-colors">
                    {tmpl.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {tmpl.description}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-850 text-slate-300 font-mono">
                      رنگ اصلی: {tmpl.theme.primaryColor}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-850 text-slate-400">
                      {tmpl.sampleBlocksCount} بلوک دیزاین
                    </span>
                  </div>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-all">
                بارگذاری روی بوم ←
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
