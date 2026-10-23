"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Receipt,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  CreditCard,
  Download,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  expiresAt: string;
  status: string;
  planId: string;
  planName: string;
  period: string;
  baseAmount: number;
  vatAmount: number;
  totalAmount: number;
  trackingCode: string;
  seller: {
    companyName: string;
    economicCode: string;
    nationalId: string;
    regNumber: string;
    phone: string;
    address: string;
  };
  buyer: {
    name: string;
    phone: string;
  };
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInvoiceId?: string | null;
}

export function InvoiceModal({ isOpen, onClose, selectedInvoiceId }: InvoiceModalProps) {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch("http://localhost:4000/api/subscriptions/invoices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.invoices) {
          setInvoices(data.invoices);
          if (selectedInvoiceId) {
            const found = data.invoices.find((i: InvoiceItem) => i.id === selectedInvoiceId);
            setActiveInvoice(found || data.invoices[0] || null);
          } else {
            setActiveInvoice(data.invoices[0] || null);
          }
        }
      })
      .catch((err) => console.error("Error fetching invoices:", err))
      .finally(() => setLoading(false));
  }, [isOpen, selectedInvoiceId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch (_) {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">فاکتورهای رسمی و سوابق مالی</h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  سازگار با سامانه مودیان
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                فاکتور رسمی الکترونیک با شناسه رهگیری شاپرک و محاسبه مالیات بر ارزش افزوده
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeInvoice && (
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>چاپ فاکتور</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Invoices Selector Tabs if multiple */}
          {invoices.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar no-print">
              {invoices.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => setActiveInvoice(inv)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 border cursor-pointer ${
                    activeInvoice?.id === inv.id
                      ? "bg-slate-800 text-white border-emerald-500/50 shadow-sm"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{inv.invoiceNumber}</span>
                  <span className="text-[10px] text-slate-400">({inv.planName})</span>
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs">در حال فراخوانی اطلاعات فاکتور...</div>
          ) : !activeInvoice ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              تراکنش پرداختی ثبت‌شده‌ای یافت نشد.
            </div>
          ) : (
            /* Printable Formal Iranian Invoice Container */
            <div
              id="printable-invoice"
              className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6 text-right"
              dir="rtl"
            >
              {/* Invoice Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-slate-900">صورتحساب الکترونیکی فروش خدمات</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                      پرداخت شده ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    سامانه هوشمند توسعه اپلیکیشن موبایل App Maker SaaS
                  </p>
                </div>

                <div className="text-left space-y-1 text-xs">
                  <div>
                    <span className="text-slate-500">شماره صورتحساب: </span>
                    <span className="font-mono font-bold text-slate-900">{activeInvoice.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">تاریخ صدور: </span>
                    <span className="font-bold text-slate-800">{formatDate(activeInvoice.date)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">شماره پیگیری شاپرک: </span>
                    <span className="font-mono font-bold text-emerald-700">{activeInvoice.trackingCode}</span>
                  </div>
                </div>
              </div>

              {/* Parties Grid (Seller & Buyer) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Seller Info */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>مشخصات فروشنده (ارائه‌دهنده خدمت):</span>
                  </div>
                  <div><span className="text-slate-500">نام شرکت: </span><span className="font-semibold text-slate-800">{activeInvoice.seller.companyName}</span></div>
                  <div><span className="text-slate-500">شناسه ملی: </span><span className="font-mono font-semibold">{activeInvoice.seller.nationalId}</span></div>
                  <div><span className="text-slate-500">کد اقتصادی: </span><span className="font-mono font-semibold">{activeInvoice.seller.economicCode}</span></div>
                  <div><span className="text-slate-500">شماره ثبت: </span><span className="font-mono font-semibold">{activeInvoice.seller.regNumber}</span></div>
                  <div><span className="text-slate-500">نشانی و تلفن: </span><span className="text-slate-700">{activeInvoice.seller.address} | {activeInvoice.seller.phone}</span></div>
                </div>

                {/* Buyer Info */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1">
                    <User className="w-3.5 h-3.5 text-slate-700" />
                    <span>مشخصات خریدار (مشترک):</span>
                  </div>
                  <div><span className="text-slate-500">نام شخص / فروشگاه: </span><span className="font-semibold text-slate-800">{activeInvoice.buyer.name}</span></div>
                  <div><span className="text-slate-500">شماره تماس همراه: </span><span className="font-mono font-semibold">{activeInvoice.buyer.phone}</span></div>
                  <div><span className="text-slate-500">نوع حساب: </span><span className="font-semibold text-slate-800">حساب تجاری معتبر اپ‌ساز</span></div>
                  <div><span className="text-slate-500">روش پرداخت: </span><span className="font-semibold text-slate-800">درگاه اینترنتی پرداخت الکترونیک شاپرک</span></div>
                  <div><span className="text-slate-500">وضعیت گواهی: </span><span className="text-emerald-700 font-bold">تایید و امضای دیجیتال شده</span></div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-right border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-center w-12">ردیف</th>
                      <th className="p-3">شرح خدمت یا اشتراک</th>
                      <th className="p-3 text-center">مدت اعتبار</th>
                      <th className="p-3 text-center">تعداد</th>
                      <th className="p-3 text-left">مبلغ خالص (تومان)</th>
                      <th className="p-3 text-left">مالیات ارزش افزوده (۹٪)</th>
                      <th className="p-3 text-left">مبلغ کل (تومان)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 text-center font-mono">۱</td>
                      <td className="p-3 font-bold text-slate-900">
                        {`حق اشتراک ${activeInvoice.planName} سامانه توسعه اپلیکیشن App Maker`}
                        <div className="text-[10px] text-slate-500 font-normal">
                          بیلد ابری فلاتر، خروجی APK و AAB، ماژول‌های بازارچه و کلید Keystore
                        </div>
                      </td>
                      <td className="p-3 text-center">{activeInvoice.period}</td>
                      <td className="p-3 text-center font-mono">۱</td>
                      <td className="p-3 text-left font-mono">{activeInvoice.baseAmount.toLocaleString("fa-IR")}</td>
                      <td className="p-3 text-left font-mono">{activeInvoice.vatAmount.toLocaleString("fa-IR")}</td>
                      <td className="p-3 text-left font-bold font-mono text-emerald-800">
                        {activeInvoice.totalAmount.toLocaleString("fa-IR")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Calculation & Stamp Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
                {/* Official Stamp & Sign Box */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center space-y-1">
                  <div className="text-[11px] font-bold text-slate-700">مهر و امضای دیجیتال صادرکننده صورتحساب</div>
                  <div className="inline-block border-2 border-emerald-600 rounded-lg p-2 text-emerald-700 text-[10px] font-bold transform -rotate-2 my-1">
                    ✓ پلتفرم فناوری اپ‌ساز - ثبت شده در شاپرک
                  </div>
                  <div className="text-[9.5px] text-slate-400">
                    این سند الکترونیکی معتبر بوده و طبق ماده ۶ قانون تجارت الکترونیک دارای وجاهت قانونی است.
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>جمع کل مبلغ خالص:</span>
                    <span className="font-mono font-semibold">{activeInvoice.baseAmount.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>مالیات بر ارزش افزوده (۹٪):</span>
                    <span className="font-mono font-semibold">{activeInvoice.vatAmount.toLocaleString("fa-IR")} تومان</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                    <span>مبلغ نهایی پرداخت شده:</span>
                    <span className="font-mono text-emerald-700">{activeInvoice.totalAmount.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 no-print">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>پشتیبانی مالی و حسابداری: ۰۲۱-۹۱۰۰۸۸۷۷</span>
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
