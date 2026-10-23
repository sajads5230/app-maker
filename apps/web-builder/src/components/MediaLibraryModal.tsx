"use client";

import React from "react";
import { X, Image as ImageIcon } from "lucide-react";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size?: number;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: MediaItem[];
  onSelectMedia: (url: string) => void;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  mediaList,
  onSelectMedia,
}: MediaLibraryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            کتابخانه رسانه و مدیا
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {mediaList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              هیچ تصویری در رسانه‌دان موجود نیست. از تب مدیا در پنل راست تصویر
              آپلود کنید.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMedia(`http://localhost:4000${m.url}`)}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition group"
                >
                  <img
                    src={`http://localhost:4000${m.url}`}
                    className="w-full h-24 object-cover rounded-lg mb-1 group-hover:scale-[1.02] transition"
                    alt={m.filename}
                  />
                  <span className="text-[10px] font-bold block truncate text-slate-300">
                    {m.filename}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
