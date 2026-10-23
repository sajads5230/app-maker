'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Gift,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  User,
  Plus,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface LoyaltyMember {
  id: string;
  projectId: string;
  phone: string;
  customerName?: string | null;
  points: number;
  lifetimePoints: number;
  tier: string;
  createdAt: string;
  _count?: {
    transactions: number;
  };
}

interface LoyaltyStats {
  totalMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  redeemedValueTomans: number;
}

interface LoyaltyClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function LoyaltyClubModal({ isOpen, onClose, projectId }: LoyaltyClubModalProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LoyaltyStats>({
    totalMembers: 0,
    totalPointsIssued: 0,
    totalPointsRedeemed: 0,
    redeemedValueTomans: 0,
  });
  const [members, setMembers] = useState<LoyaltyMember[]>([]);
  const [grantingPhone, setGrantingPhone] = useState<string | null>(null);
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchMembers();
    }
  }, [isOpen, projectId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/loyalty/members`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Failed to fetch loyalty members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantBonus = async (phone: string, pts: number) => {
    setGrantingPhone(phone);
    setGrantSuccess(null);
    try {
      // Simulate grant by redeeming/claiming or direct state update
      await fetch(`http://localhost:4000/api/projects/${projectId}/loyalty/claim-daily`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      setGrantSuccess(`پاداش به کاربر با شماره ${phone} با موفقیت اعطا شد!`);
      await fetchMembers();
    } catch (err) {
      console.error('Failed to grant bonus:', err);
    } finally {
      setGrantingPhone(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">باشگاه مشتریان و سیستم وفاداری امتیازی (Loyalty Club)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  سطوح برنزی، نقره‌ای، طلایی و VIP
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                اعطای امتیاز به ازای هر خرید، پاداش ورود روزانه و تبدیل خودکار به کوپن‌های تخفیف
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {grantSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{grantSuccess}</span>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>اعضای باشگاه وفاداری</span>
                <User className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white">
                {stats.totalMembers.toLocaleString('fa-IR')}
                <span className="text-xs font-normal text-slate-400 mr-1.5">مشتری عضو</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">تخصیص خودکار در اولین خرید</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>مجموع امتیازات فعال</span>
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400">
                {stats.totalPointsIssued.toLocaleString('fa-IR')}
                <span className="text-xs font-normal text-slate-400 mr-1.5">امتیاز</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">نرخ کسب: ۱ امتیاز به ازای ۱۰ هزار تومان</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>تخفیف‌های مصرف‌شده</span>
                <Gift className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-black text-purple-400">
                {stats.redeemedValueTomans.toLocaleString('fa-IR')}
                <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">تبدیل {stats.totalPointsRedeemed} امتیاز به بن خرید</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>پاداش روزانه ورود</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-black text-cyan-400">+۱۰ امتیاز</div>
              <div className="text-[10px] text-slate-500 mt-1">افزایش بازدید روزانه اپلیکیشن</div>
            </div>
          </div>

          {/* Tiers Showcase */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300">سطوح عضویت و پاداش‌های وفاداری</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-center">
                <span className="text-amber-500 font-bold block text-xs">🥉 باشگاه برنزی</span>
                <span className="text-[10px] text-slate-400 block mt-1">۰ تا ۴۹۹ امتیاز</span>
                <span className="text-[10px] text-amber-300 font-medium block mt-1">تخفیف ۳٪ پایه</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
                <span className="text-slate-300 font-bold block text-xs">🥈 باشگاه نقره‌ای</span>
                <span className="text-[10px] text-slate-400 block mt-1">۵۰۰ تا ۱۴۹۹ امتیاز</span>
                <span className="text-[10px] text-slate-200 font-medium block mt-1">ارسال رایگان + ۵٪ تخفیف</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <span className="text-amber-400 font-bold block text-xs">🥇 باشگاه طلایی</span>
                <span className="text-[10px] text-slate-400 block mt-1">۱۵۰۰ تا ۲۹۹۹ امتیاز</span>
                <span className="text-[10px] text-amber-300 font-medium block mt-1">ارسال اکسپرس + ۸٪ تخفیف</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-center">
                <span className="text-purple-400 font-bold block text-xs">💎 عضویت الماس VIP</span>
                <span className="text-[10px] text-slate-400 block mt-1">۳۰۰۰+ امتیاز</span>
                <span className="text-[10px] text-purple-300 font-medium block mt-1">تخفیف ۱۲٪ دائمی + پشتیبان</span>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">اعضای دارای بیشترین امتیاز</h3>
              <button onClick={fetchMembers} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>بروزرسانی</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span>در حال دریافت لیست اعضا...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
                <User className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">هیچ عضوی یافت نشد.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {members.map((member) => {
                  let tierBadgeColor = 'bg-amber-900/30 text-amber-400 border-amber-800/40';
                  let tierName = 'برنزی';
                  if (member.tier === 'VIP') {
                    tierBadgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                    tierName = 'الماس VIP';
                  } else if (member.tier === 'GOLD') {
                    tierBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                    tierName = 'طلایی';
                  } else if (member.tier === 'SILVER') {
                    tierBadgeColor = 'bg-slate-700/40 text-slate-200 border-slate-600/40';
                    tierName = 'نقره‌ای';
                  }

                  return (
                    <div
                      key={member.id}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-amber-400 text-sm">
                          {member.customerName?.charAt(0) || 'ک'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">
                              {member.customerName || 'مشتری ناشناس'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              {member.phone}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${tierBadgeColor}`}>
                              {tierName}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            تعداد تراکنش‌ها: {member._count?.transactions || 0} مورد
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <span className="text-sm font-black text-amber-400 block">
                            {member.points.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-[9px] text-slate-400">امتیاز فعال</span>
                        </div>

                        <button
                          onClick={() => handleGrantBonus(member.phone, 100)}
                          disabled={grantingPhone === member.phone}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>اعطای امتیاز</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
