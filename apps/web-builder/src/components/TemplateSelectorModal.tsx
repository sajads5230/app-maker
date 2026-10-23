"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, X, Search, Palette, Layers, CheckCircle2, Sliders, Tag } from "lucide-react";
import { STORE_TEMPLATES, StoreTemplate } from "../lib/templates";

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: StoreTemplate) => void;
}

const CATEGORY_GROUPS = [
  { id: "all", label: "همه اصناف (۱۴)", icon: "✨" },
  { id: "digital", label: "دیجیتال و فناوری", icon: "💻" },
  { id: "fashion_beauty", label: "مد، زیبایی و طلا", icon: "👗" },
  { id: "food_retail", label: "خوراکی، سوپر و سلامت", icon: "🛒" },
  { id: "industry_b2b", label: "صنعتی، خودرو و آموزش", icon: "🔧" },
  { id: "lifestyle_culture", label: "دکوراسیون، کتاب و هدیه", icon: "🛋️" },
];

export function TemplateSelectorModal({
  isOpen,
  onClose,
  onSelectTemplate,
}: TemplateSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");

  const filteredTemplates = useMemo(() => {
    return STORE_TEMPLATES.filter((tmpl) => {
      // Group filter
      if (selectedGroup !== "all") {
        if (selectedGroup === "digital" && tmpl.categoryGroup !== "digital") return false;
        if (selectedGroup === "fashion_beauty" && tmpl.categoryGroup !== "fashion_beauty") return false;
        if (selectedGroup === "food_retail" && tmpl.categoryGroup !== "food_retail") return false;
        if (selectedGroup === "industry_b2b" && tmpl.categoryGroup !== "industry_b2b") return false;
        if (selectedGroup === "lifestyle_culture" && tmpl.categoryGroup !== "lifestyle_culture") return false;
      }

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = tmpl.name.toLowerCase().includes(q);
      const matchCat = tmpl.category.toLowerCase().includes(q);
      const matchDesc = tmpl.description.toLowerCase().includes(q);
      const matchTags = tmpl.tags?.some((t) => t.toLowerCase().includes(q));

      return matchName || matchCat || matchDesc || matchTags;
    });
  }, [searchQuery, selectedGroup]);

  if (!isOpen) return null;

  const getCardStyleLabel = (style?: string) => {
    switch (style) {
      case "elevated":
        return "سایه‌دار (Elevated)";
      case "flat":
        return "تخت (Flat)";
      case "bordered":
      default:
        return "حاشیه‌دار (Bordered)";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                کتابخانه ۱۴ قالب آماده تجاری اصناف
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  تنوع طراحی UI/UX
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              قالب کسب‌وکار خود را انتخاب کنید تا چیدمان بلوک‌ها، رنگ‌بندی، انحنای المان‌ها و اطلاعات اولیه به سرعت روی بوم اعمال شود.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="جستجو در نام صنف، قالب، یا امکانات (مثلاً: طلا، مبل، داروخانه، رزرو، B2B، استوری)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-white text-xs"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Category Group Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {CATEGORY_GROUPS.map((grp) => (
              <button
                key={grp.id}
                onClick={() => setSelectedGroup(grp.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 text-xs ${
                  selectedGroup === grp.id
                    ? "bg-rose-600 text-white font-bold shadow-xs shadow-rose-900/50"
                    : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span>{grp.icon}</span>
                <span>{grp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="font-bold text-sm text-slate-300">هیچ قالبی با این عبارت پیدا نشد</p>
              <p className="text-xs text-slate-500">کلمات جستجو را تغییر دهید یا فیلتر دسته‌بندی را روی «همه اصناف» بگذارید.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGroup("all");
                }}
                className="mt-3 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 transition"
              >
                نمایش همه ۱۴ قالب
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => onSelectTemplate(tmpl)}
                  className="p-4 bg-slate-950/80 border border-slate-800 hover:border-rose-500/60 rounded-xl cursor-pointer transition-all hover:scale-[1.01] hover:bg-slate-900/40 flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-2.5">
                    {/* Header: Icon, Name, Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-white/10 shadow-xs"
                          style={{
                            backgroundColor: `${tmpl.theme.primaryColor}18`,
                          }}
                        >
                          {tmpl.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-rose-400 transition-colors">
                              {tmpl.name}
                            </h4>
                          </div>
                          <span className="text-[10px] text-slate-400 inline-block mt-0.5">
                            {tmpl.category}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-[9.5px] px-2 py-0.5 rounded-full font-bold border shrink-0"
                        style={{
                          borderColor: `${tmpl.theme.primaryColor}40`,
                          color: tmpl.theme.primaryColor,
                          backgroundColor: `${tmpl.theme.primaryColor}15`,
                        }}
                      >
                        {tmpl.sampleBlocksCount} بلوک دیزاین
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>

                    {/* Feature tags */}
                    {tmpl.tags && tmpl.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {tmpl.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer: UI Specs & Action Button */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2.5">
                      {/* Color dots */}
                      <div className="flex items-center gap-1.5" title="پالت رنگ‌های اصلی قالب">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shadow-2xs"
                          style={{ backgroundColor: tmpl.theme.primaryColor }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shadow-2xs"
                          style={{ backgroundColor: tmpl.theme.secondaryColor }}
                        />
                      </div>

                      {/* Card style & radius pill */}
                      <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {getCardStyleLabel(tmpl.theme.cardStyle)}
                      </span>
                      <span className="text-slate-500 font-mono hidden sm:inline">
                        {tmpl.theme.borderRadius}px
                      </span>
                    </div>

                    <button className="px-3 py-1.5 bg-rose-600/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold group-hover:bg-rose-600 group-hover:text-white transition-all shadow-xs flex items-center gap-1">
                      <span>بارگذاری روی استودیو</span>
                      <span>←</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>انتخاب قالب فوراً رنگ‌بندی، فونت و ساختار بلوک‌های بوم را دگرگون می‌کند.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition text-xs"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
