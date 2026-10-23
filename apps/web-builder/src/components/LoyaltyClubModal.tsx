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
  Flame,
  Percent,
  Play,
  Settings2,
  Zap,
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

const DEFAULT_SLICES = [
  { id: 0, label: '۵۰ امتیاز باشگاه', type: 'points', value: '50 Pts', color: '#f59e0b', probability: '۲۵٪' },
  { id: 1, label: '۱۰٪ تخفیف خرید', type: 'discount', value: '10%', color: '#ef4444', probability: '۲۰٪' },
  { id: 2, label: 'ارسال رایگان', type: 'shipping', value: 'Free', color: '#10b981', probability: '۱۵٪' },
  { id: 3, label: '۱۰۰ امتیاز طلایی', type: 'points', value: '100 Pts', color: '#8b5cf6', probability: '۱۰٪' },
  { id: 4, label: '۲۰٪ تخفیف شگفت‌انگیز', type: 'discount', value: '20%', color: '#ec4899', probability: '۵٪' },
  { id: 5, label: 'فردا دوباره شانس داری!', type: 'empty', value: 'Try Again', color: '#64748b', probability: '۱۵٪' },
  { id: 6, label: '۵۰ هزار تومان بن هدیه', type: 'gift', value: '50k T', color: '#06b6d4', probability: '۵٪' },
  { id: 7, label: '۲۰ امتیاز نقره‌ای', type: 'points', value: '20 Pts', color: '#3b82f6', probability: '۵٪' },
];

export function LoyaltyClubModal({ isOpen, onClose, projectId }: LoyaltyClubModalProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'wheel'>('members');
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

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<{ label: string; couponCode?: string | null } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen, projectId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
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

  const handleSpinWheel = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/loyalty/wheel/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '09121234567' }),
      });
      const data = await res.json();

      const prizeIndex = data.prizeIndex ?? Math.floor(Math.random() * 8);
      // Calculate rotation: 8 slices = 45 deg per slice. Spin at least 5 full rounds (1800 deg)
      const sliceDeg = 360 / 8;
      const targetDeg = 1800 + (8 - prizeIndex) * sliceDeg - sliceDeg / 2;
      setWheelRotation((prev) => prev + targetDeg);

      setTimeout(() => {
        setIsSpinning(false);
        setWonPrize({
          label: data.prize?.label || DEFAULT_SLICES[prizeIndex].label,
          couponCode: data.couponCode,
        });
      }, 3500);
    } catch (_) {
      setIsSpinning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp font-sans text-right" dir="rtl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">باشگاه مشتریان و گیمیفیکیشن (Loyalty & Gamification)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  گردونه شانس + تراز امتیازات
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                افزایش نرخ بازگشت کاربران با اعطای امتیاز، پاداش ورود و گردونه شانس ۲۴ ساعته
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setActiveTab('members')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'members'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                اعضای باشگاه
              </button>
              <button
                onClick={() => setActiveTab('wheel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'wheel'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                گردونه شانس روزانه
              </button>
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'members' ? (
            <>
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
                  <div className="text-[10px] text-slate-500 mt-1">ارزش هر ۱۰ امتیاز = ۱,۰۰۰ تومان</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>امتیاز مصرف شده</span>
                    <Gift className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-black text-purple-400">
                    {stats.totalPointsRedeemed.toLocaleString('fa-IR')}
                    <span className="text-xs font-normal text-slate-400 mr-1.5">تبدیل به کوپن</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">در قالب کدهای تخفیف خودکار</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>ارزش ریالی تخفیف‌ها</span>
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-black text-blue-400">
                    {stats.redeemedValueTomans.toLocaleString('fa-IR')}
                    <span className="text-xs font-normal text-slate-400 mr-1.5">تومان</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">تزریق شده به فروش کل</div>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>مشتریان و تراز امتیازات وفاداری</span>
                  </h3>
                  <button
                    onClick={fetchMembers}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin mb-2 text-amber-400" />
                    در حال فراخوانی حساب‌های کاربری باشگاه...
                  </div>
                ) : members.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-slate-500 text-xs">
                    هنوز حسابی عضو باشگاه نشده است.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {members.map((member) => {
                      let tierBadgeColor = 'bg-amber-700/20 text-amber-400 border-amber-600/30';
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
            </>
          ) : (
            /* TAB 2: SPIN & WIN LUCKY WHEEL */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Wheel Graphic Column (6 cols) */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-950/60 border border-slate-800/80 rounded-3xl relative overflow-hidden">
                {/* Pointer / Arrow */}
                <div className="z-20 -mb-4 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-md" />
                </div>

                {/* Spinning Wheel Container */}
                <div
                  className="relative w-64 h-64 rounded-full border-4 border-amber-400/80 shadow-2xl overflow-hidden transition-transform ease-out"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transitionDuration: isSpinning ? '3.5s' : '0s',
                  }}
                >
                  {/* Slices rendered with conic-gradient or SVG */}
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(
                        #f59e0b 0deg 45deg,
                        #ef4444 45deg 90deg,
                        #10b981 90deg 135deg,
                        #8b5cf6 135deg 180deg,
                        #ec4899 180deg 225deg,
                        #64748b 225deg 270deg,
                        #06b6d4 270deg 315deg,
                        #3b82f6 315deg 360deg
                      )`,
                    }}
                  />
                  {/* Wheel Center Cap */}
                  <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-400 shadow-xl flex items-center justify-center text-amber-400 font-black text-xs">
                    شانس
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  type="button"
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-90 disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isSpinning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {isSpinning ? 'در حال چرخش هیجان‌انگیز...' : 'تست چرخش گردونه شانس!'}
                </button>

                {/* Celebration Announcement */}
                {wonPrize && (
                  <div className="mt-4 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center animate-bounce">
                    <div className="text-xs font-bold text-amber-300">🎉 تبریک! شما برنده شدید:</div>
                    <div className="text-sm font-black text-white mt-0.5">{wonPrize.label}</div>
                    {wonPrize.couponCode && (
                      <div className="text-xs font-mono text-emerald-400 bg-slate-900 px-3 py-1 rounded-lg border border-emerald-500/30 mt-1 inline-block" dir="ltr">
                        کد تخفیف: {wonPrize.couponCode}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Slices Settings Column (6 cols) */}
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-amber-400" />
                    تنظیمات جوایز و احتمالات گردونه (۸ اسلایس)
                  </h3>
                  <span className="text-[11px] text-slate-400">توزیع شانس هوشمند</span>
                </div>

                <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                  {DEFAULT_SLICES.map((slice) => (
                    <div
                      key={slice.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: slice.color }} />
                        <span className="font-bold text-white">{slice.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          احتمال: {slice.probability}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                          فعال
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>محدودیت چرخش: هر کاربر حداکثر ۱ بار در هر ۲۴ ساعت امکان استفاده دارد.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
