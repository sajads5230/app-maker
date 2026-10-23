'use client';

import React, { useState } from 'react';
import {
  X,
  Code2,
  Download,
  CheckCircle2,
  Sparkles,
  Terminal,
  ShieldCheck,
  FileArchive,
  Loader2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface SourceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  packageName: string;
}

export function SourceExportModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  packageName,
}: SourceExportModalProps) {
  const [loading, setLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{
    fileName: string;
    downloadUrl: string;
    sizeBytes: number;
  } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/export-source`);
      const data = await res.json();
      if (data.success) {
        setDownloadInfo({
          fileName: data.fileName,
          downloadUrl: `http://localhost:4000${data.downloadUrl}`,
          sizeBytes: data.sizeBytes,
        });

        // Trigger immediate browser download
        const a = document.createElement('a');
        a.href = `http://localhost:4000${data.downloadUrl}`;
        a.download = data.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setError(data.error || 'خطا در خروجی سورس‌کد فلاتر.');
      }
    } catch (err: any) {
      setError(err.message || 'عدم برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">خروجی سورس‌کد کامل فلاتر (Flutter Source)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  مشابه FlutterFlow Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                سورس‌کد نیتیو، کاملاً تمیز و بدون هیچ قفل یا وابستگی انحصاری (Zero Vendor Lock-in)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="block text-xs font-bold text-white">مالکیت ۱۰۰٪ کد</span>
              <span className="text-[10px] text-slate-400">قابل توسعه با هر IDE</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <Terminal className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <span className="block text-xs font-bold text-white">Flutter 3.24+</span>
              <span className="text-[10px] text-slate-400">Dart 3.5 & Null-Safety</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
              <FileArchive className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <span className="block text-xs font-bold text-white">آرشیو ZIP تمیز</span>
              <span className="text-[10px] text-slate-400">فایل‌های چیدمان + نیتیو</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span>نام اپلیکیشن:</span>
              <strong className="text-white">{projectName}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>شناسه پکیج (Application ID):</span>
              <code className="text-cyan-300 font-mono" dir="ltr">{packageName}</code>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>موتور رندرینگ:</span>
              <span className="text-emerald-400 font-bold">Server-Driven UI + Offline Cache</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Success Download Card */}
          {downloadInfo ? (
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 animate-scaleUp">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>سورس‌کد با موفقیت بسته‌بندی شد و آماده استفاده است!</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                  {(downloadInfo.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>

              <a
                href={downloadInfo.downloadUrl}
                download={downloadInfo.fileName}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>دانلود مجدد فایل {downloadInfo.fileName}</span>
              </a>

              {/* Developer Quick-Start Instructions */}
              <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">
                  دستورات اجرای فوری در ترمینال:
                </span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between" dir="ltr">
                  <span>flutter pub get && flutter run</span>
                  <button
                    onClick={() => copyToClipboard('flutter pub get && flutter run', 'run')}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedCmd === 'run' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-2xl text-xs font-black shadow-xl shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال بسته‌بندی سورس‌کد و متادیتا...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تولید و دانلود سورس‌کد کامل پروژه (ZIP)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
