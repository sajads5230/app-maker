"use client";

import React from "react";
import { Puzzle, X, Search, Settings2 } from "lucide-react";
import { PluginItem } from "./PluginConfigModal";

interface AppetoMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  pluginCatalog: any[];
  projectPlugins: Record<string, any>;
  categoryFilter: string;
  onChangeCategory: (cat: string) => void;
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  onTogglePlugin: (id: string, currentlyEnabled: boolean) => void;
  onOpenConfig: (plugin: any) => void;
  renderPluginIcon: (iconName: string, className?: string) => React.ReactNode;
}

const CATEGORIES = [
  { id: "all", title: "همه ماژول‌ها" },
  { id: "commerce", title: "🛍️ فروشگاهی و مالی" },
  { id: "communication", title: "💬 ارتباط و پشتیبانی" },
  { id: "media", title: "🎬 رسانه و محتوا" },
  { id: "utility", title: "🛠️ ابزارها و تعامل" },
  { id: "growth", title: "🤖 هوش مصنوعی و رشد" },
];

export function AppetoMarketModal({
  isOpen,
  onClose,
  pluginCatalog,
  projectPlugins,
  categoryFilter,
  onChangeCategory,
  searchQuery,
  onChangeSearch,
  onTogglePlugin,
  onOpenConfig,
  renderPluginIcon,
}: AppetoMarketModalProps) {
  if (!isOpen) return null;

  const filteredPlugins = pluginCatalog.filter((p) => {
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.includes(searchQuery) ||
      p.description.includes(searchQuery) ||
      p.categoryName.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">
                  مرکز ماژول‌ها و افزونه‌های اپتو (Appeto Plugins)
                </span>
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  {pluginCatalog.length} ماژول آماده
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-0.5">
                فعال‌سازی با یک کلیک و اتصال بی‌درنگ به هسته اپلیکیشن اندروید و
                فلاتر
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3.5 px-6 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onChangeCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              placeholder="جستجوی ماژول..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Plugin Grid Content */}
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-slate-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlugins.map((plugin) => {
              const isEnabled = !!projectPlugins[plugin.id]?.enabled;
              return (
                <div
                  key={plugin.id}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                    isEnabled
                      ? "bg-slate-850/90 border-indigo-500/50 shadow-lg shadow-indigo-500/5"
                      : "bg-slate-800/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    {/* Card Top Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{
                            backgroundColor: `${plugin.color}20`,
                            color: plugin.color,
                          }}
                        >
                          {renderPluginIcon(plugin.icon, "w-5 h-5")}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white block truncate">
                              {plugin.name}
                            </span>
                            {plugin.badge && (
                              <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
                                {plugin.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {plugin.categoryName}
                          </span>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => onTogglePlugin(plugin.id, isEnabled)}
                        className={`w-9 h-5 rounded-full relative transition flex items-center px-0.5 cursor-pointer shrink-0 ${
                          isEnabled ? "bg-emerald-600" : "bg-slate-700"
                        }`}
                        title={
                          isEnabled
                            ? "کلیک برای غیرفعال‌سازی"
                            : "کلیک برای فعال‌سازی"
                        }
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full transition-all shadow-md ${
                            isEnabled ? "mr-auto" : "ml-auto"
                          }`}
                        ></div>
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-300/90 leading-relaxed mb-4">
                      {plugin.description}
                    </p>
                  </div>

                  {/* Card Bottom Row */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                    <span
                      className={`text-[10px] font-bold flex items-center gap-1 ${
                        isEnabled ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isEnabled
                            ? "bg-emerald-400 animate-ping"
                            : "bg-slate-600"
                        }`}
                      ></span>
                      <span>{isEnabled ? "فعال و متصل به اپ" : "غیرفعال"}</span>
                    </span>

                    <button
                      onClick={() => onOpenConfig(plugin)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Settings2 className="w-3 h-3 text-slate-400" />
                      <span>تنظیمات</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
