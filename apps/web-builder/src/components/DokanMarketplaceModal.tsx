'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Store,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Loader2,
  DollarSign,
  Star,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react';

interface DokanVendor {
  id: string;
  projectId: string;
  storeName: string;
  ownerName: string;
  phone: string;
  email?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  rating: number;
  isVerified: boolean;
  commissionRate: number;
  totalSales: number;
  address?: string | null;
  productsCount?: number;
}

interface DokanMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function DokanMarketplaceModal({ isOpen, onClose, projectId }: DokanMarketplaceModalProps) {
  const [vendors, setVendors] = useState<DokanVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Vendor Form
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCommission, setNewCommission] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchVendors();
    }
  }, [isOpen, projectId]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/vendors`);
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors || []);
      }
    } catch (err) {
      console.error('Failed to fetch dokan vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerified = async (vendorId: string) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/projects/${projectId}/vendors/${vendorId}/toggle-verified`,
        { method: 'PUT' }
      );
      const data = await res.json();
      if (data.success) {
        setActionSuccess(data.message);
        await fetchVendors();
      }
    } catch (err) {
      console.error('Failed to toggle verified:', err);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newPhone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: newStoreName,
          ownerName: newOwnerName,
          phone: newPhone,
          commissionRate: newCommission,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('غرفه جدید با موفقیت اضافه شد!');
        setShowAddModal(false);
        setNewStoreName('');
        setNewOwnerName('');
        setNewPhone('');
        await fetchVendors();
      }
    } catch (err) {
      console.error('Failed to create vendor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totalSales = vendors.reduce((acc, v) => acc + (v.totalSales || 0), 0);
  const verifiedCount = vendors.filter((v) => v.isVerified).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">مارکت‌پلیس چندفروشندگی دکان (Dokan Multi-Vendor)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  سازگار با ووکامرس دکان
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مدیریت غرفه‌داران، پورسانت فروش، تایید اصالت و نمایش اختصاصی در اپلیکیشن
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/20 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت غرفه جدید</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {actionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>تعداد کل غرفه‌داران</span>
                <Store className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-xl font-black text-white">
                {vendors.length}
                <span className="text-xs font-normal text-slate-400 mr-1.5">فروشگاه فعال</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{verifiedCount} غرفه تاییدشده رسمی</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>فروش کل مارکت‌پلیس</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400">
                {(totalSales / 1000000).toLocaleString('fa-IR')}
                <span className="text-xs font-normal text-slate-400 mr-1.5">میلیون تومان</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">تراکنش‌های نهایی‌شده با تسویه حساب</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>میانگین پورسانت پلتفرم</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-amber-400">۹.۰٪</div>
              <div className="text-[10px] text-slate-500 mt-1">درآمد ناخالص مارکت‌پلیس از هر سفارش</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>وضعیت همگام‌سازی دکان</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-black text-cyan-400">آنلاین</div>
              <div className="text-[10px] text-slate-500 mt-1">اتصال دوطرفه با REST API وردپرس</div>
            </div>
          </div>

          {/* Vendors List Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">لیست غرفه‌داران و واردکنندگان</h3>
              <button onClick={fetchVendors} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>بروزرسانی</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span>در حال دریافت لیست غرفه‌ها...</span>
              </div>
            ) : vendors.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                <Store className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">هیچ غرفه‌ای ثبت نشده است.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {vendor.logoUrl ? (
                        <img
                          src={vendor.logoUrl}
                          alt={vendor.storeName}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 font-bold">
                          {vendor.storeName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{vendor.storeName}</span>
                          {vendor.isVerified && (
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-500/30 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              غرفه‌دار برگزیده
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>مدیر: {vendor.ownerName}</span>
                          <span>تماس: {vendor.phone}</span>
                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {vendor.rating}
                          </span>
                          <span className="text-emerald-400">
                            فروش: {(vendor.totalSales / 1000000).toLocaleString('fa-IR')} م.ت
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        کارمزد: {vendor.commissionRate}٪
                      </span>
                      <button
                        onClick={() => handleToggleVerified(vendor.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          vendor.isVerified
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {vendor.isVerified ? 'حذف تیک آبی' : 'اعطای نشان اصالت'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Vendor Sub-Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-scaleUp">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="text-xs font-bold text-white">ثبت غرفه جدید در مارکت‌پلیس</h4>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateVendor} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">نام فروشگاه / برند غرفه:</label>
                  <input
                    type="text"
                    required
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="مثال: نمایندگی شیائومی شیراز"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">نام و نام خانوادگی مدیر:</label>
                  <input
                    type="text"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    placeholder="مثال: بهرام راد"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">شماره تماس غرفه:</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      placeholder="09123456789"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">درصد کارمزد پلتفرم:</label>
                    <input
                      type="number"
                      value={newCommission}
                      onChange={(e) => setNewCommission(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      min={1}
                      max={50}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold"
                  >
                    {isSubmitting ? 'در حال ثبت...' : 'افزودن غرفه'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
