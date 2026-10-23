'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  Wand2,
  Layers,
  Palette,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  ArrowLeft,
  Crown,
  HeartHandshake,
  Utensils,
  Gem,
  Dumbbell,
  ShoppingBag,
  Stethoscope,
  Smile,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AiAppGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (newProject: any) => void;
}

const PRESET_NICHES = [
  {
    id: 'perfume',
    name: 'عطر و ادکلن نیش',
    icon: '✨',
    defaultName: 'عطر و ادکلن رویال پرفیوم',
    defaultPrompt: 'فروشگاه تخصصی انواع عطرهای اورجینال، دکانت و ادوپرفیوم‌های نیش با مشاوره بویایی آنلاین',
    suggestedStyle: 'modern_dark',
  },
  {
    id: 'food',
    name: 'رستوران و کافه',
    icon: '🍕',
    defaultName: 'کافه رستوران سنتی ترنج',
    defaultPrompt: 'سفارش آنلاین انواع غذاهای ایرانی و فرنگی، قهوه و نوشیدنی با قابلیت رزرو میز و تحویل اکسپرس',
    suggestedStyle: 'vibrant_warm',
  },
  {
    id: 'fashion',
    name: 'مد و پوشاک لوکس',
    icon: '👗',
    defaultName: 'بوتیک مد و استایل زارا پلاس',
    defaultPrompt: 'انواع پوشاک زنانه، مردانه، اکسسوری و کیف و کفش با جدول راهنمای سایز و ارسال رایگان',
    suggestedStyle: 'luxury_gold',
  },
  {
    id: 'clinic',
    name: 'کلینیک و سلامت',
    icon: '🩺',
    defaultName: 'کلینیک تخصصی پوست و زیبایی نوین',
    defaultPrompt: 'نوبت‌دهی آنلاین ویزیت، خدمات پوست و مو، مشاوره آنلاین و فروش محصولات مراقبتی اورجینال',
    suggestedStyle: 'clean_minimal',
  },
  {
    id: 'jewelry',
    name: 'طلا و جواهرات',
    icon: '💎',
    defaultName: 'گالری طلای کیمیا',
    defaultPrompt: 'فروشگاه آنلاین انواع طلا، سکه، سرویس و انگشتر با محاسبه آنلاین مظنه لحظه‌ای و فاکتور رسمی',
    suggestedStyle: 'luxury_gold',
  },
  {
    id: 'gym',
    name: 'ورزش و مکمل',
    icon: '⚡',
    defaultName: 'پاورفیت اسپرت و مکمل',
    defaultPrompt: 'فروشگاه مکمل‌های ورزشی، تجهیزات بدنسازی و ارائه برنامه‌های تمرینی و تغذیه اختصاصی',
    suggestedStyle: 'modern_dark',
  },
  {
    id: 'petshop',
    name: 'پت‌شاپ و حیوانات',
    icon: '🐾',
    defaultName: 'پت‌شاپ تخصصی هاپ و میو',
    defaultPrompt: 'غذای خشک، تشویقی، خاک گربه، قلاده و خدمات بهداشتی حیوانات خانگی با ارسال سریع',
    suggestedStyle: 'clean_minimal',
  },
  {
    id: 'supermarket',
    name: 'سوپرمارکت و میوه',
    icon: '🛒',
    defaultName: 'هایپرمارکت آنلاین فِرِش',
    defaultPrompt: 'تأمین روزانه میوه تازه، کالاهای اساسی، لبنیات و پروتئینی با ارسال کمتر از ۳۰ دقیقه',
    suggestedStyle: 'vibrant_warm',
  },
];

const STYLES = [
  {
    id: 'modern_dark',
    name: 'مدرن و نئونی (Dark)',
    desc: 'پس‌زمینه تیره با هایلایت‌های بنفش و ارغوانی، ایده‌آل برای برندهای خاص و دیجیتال',
    colorPreview: ['#0F172A', '#8B5CF6', '#C4B5FD'],
  },
  {
    id: 'luxury_gold',
    name: 'لوکس و طلایی (Gold)',
    desc: 'ترکیب مجلل طلایی، کهربایی و تیره، برازنده طلا، عطر و پوشاک پریمیوم',
    colorPreview: ['#18181B', '#D97706', '#FDE68A'],
  },
  {
    id: 'clean_minimal',
    name: 'مینیمال و پاک (Clean Blue)',
    desc: 'پس‌زمینه تمیز و هایلایت‌های آبی/سبز متین، مناسب کلینیک، پت‌شاپ و شرکتی',
    colorPreview: ['#0F172A', '#0284C7', '#BAE6FD'],
  },
  {
    id: 'vibrant_warm',
    name: 'گرم و پرانرژی (Warm Orange)',
    desc: 'رنگ‌های گرم نارنجی و قرمز اشتهاآور و پرانرژی، عالی برای غذا، هایپر و فست‌فود',
    colorPreview: ['#0F172A', '#EA580C', '#FED7AA'],
  },
];

const FEATURES = [
  { id: 'marketplace', label: 'چندفروشندگی دکان (Dokan)', desc: 'امکان تعریف غرفه‌داران و تفکیک فروشندگان' },
  { id: 'loyalty_rewards', label: 'باشگاه مشتریان و امتیاز هدیه', desc: 'سطوح کاربری برنز تا الماس و تخفیف نقدی' },
  { id: 'booking_form', label: 'فرم اختصاصی رزرو و مشاوره', desc: 'دریافت مشخصات و صدور شماره پیگیری آنلاین' },
  { id: 'story_circles', label: 'استوری‌های متحرک اینستاگرامی', desc: 'معرفی جشنواره‌ها و تخفیف‌های داغ در هدر' },
];

export function AiAppGeneratorModal({ isOpen, onClose, onProjectCreated }: AiAppGeneratorModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedNiche, setSelectedNiche] = useState('perfume');
  const [businessName, setBusinessName] = useState('عطر و ادکلن رویال پرفیوم');
  const [description, setDescription] = useState('فروشگاه تخصصی انواع عطرهای اورجینال، دکانت و ادوپرفیوم‌های نیش با مشاوره بویایی آنلاین');
  const [selectedStyle, setSelectedStyle] = useState('modern_dark');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'marketplace',
    'loyalty_rewards',
    'booking_form',
    'story_circles',
  ]);

  // Generation Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const PROGRESS_MESSAGES = [
    '🔍 در حال تحلیل و پردازش مدل کسب‌وکار...',
    '🎨 استخراج هارمونی هوشمند رنگ‌ها و تایپوگرافی نیتیو...',
    '🧩 چیدمان بلوک‌های اختصاصی در معماری Server-Driven UI...',
    '🖼️ بارگذاری و چیدمان بنرهای هدر و کاتالوگ کالاهای متناسب با صنف...',
    '⚡ ساخت فرم اختصاصی، اتصال دکان و باشگاه مشتریان...',
    '🚀 نهایی‌سازی پایگاه داده و ذخیره پروژه در حساب کاربری شما...',
  ];

  if (!isOpen) return null;

  const handleSelectNiche = (niche: typeof PRESET_NICHES[0]) => {
    setSelectedNiche(niche.id);
    setBusinessName(niche.defaultName);
    setDescription(niche.defaultPrompt);
    setSelectedStyle(niche.suggestedStyle);
  };

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('appmaker_token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:4000/api/projects/ai-generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          businessName,
          niche: selectedNiche,
          description,
          style: selectedStyle,
          features: selectedFeatures,
        }),
      });

      clearInterval(stepInterval);
      const data = await res.json();

      if (data.success && data.project) {
        setProgressStep(PROGRESS_MESSAGES.length - 1);
        setTimeout(() => {
          setIsGenerating(false);
          if (onProjectCreated) {
            onProjectCreated(data.project);
          }
          onClose();
          router.push(`/builder?projectId=${data.project.id}`);
        }, 800);
      } else {
        setIsGenerating(false);
        setErrorMsg(data.error || 'خطا در تولید هوشمند اپلیکیشن');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setErrorMsg('خطا در برقراری ارتباط با سرویس هوش مصنوعی');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
                <Wand2 className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">سازنده هوشمند اپ با یک کلیک (AI Studio Wizard)</h2>
                <span className="text-xs bg-gradient-to-r from-indigo-500/20 to-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  نسل جدید AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تنها نام یا صنف کسب‌وکار خود را وارد کنید؛ هوش مصنوعی کل ساختار، رنگ‌ها، بلوک‌ها و فرم‌ها را برایتان می‌چیند!
              </p>
            </div>
          </div>

          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isGenerating ? (
            /* Generating Screen */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-600 animate-spin flex items-center justify-center shadow-xl shadow-indigo-500/30 p-1">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-rose-400 animate-bounce" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-white">هوش مصنوعی در حال خلق اپلیکیشن شماست...</h3>
                <p className="text-xs text-indigo-400 font-medium transition-all duration-300 min-h-[20px]">
                  {PROGRESS_MESSAGES[progressStep]}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${((progressStep + 1) / PROGRESS_MESSAGES.length) * 100}%` }}
                />
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                معماری Server-Driven UI • آماده‌سازی خروجی نیتیو فلاتر
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    step === 1 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>۱. انتخاب صنف و نام</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    step === 2 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>۲. سبک بصری و رنگ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    step === 3 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>۳. ماژول‌های فعال</span>
                </button>
              </div>

              {/* STEP 1: NICHE & NAME */}
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      دسته‌بندی و حوزه فعالیت را انتخاب کنید:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {PRESET_NICHES.map((niche) => {
                        const isSelected = selectedNiche === niche.id;
                        return (
                          <div
                            key={niche.id}
                            onClick={() => handleSelectNiche(niche)}
                            className={`p-3.5 rounded-2xl border text-right cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/15'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-300'
                            }`}
                          >
                            <div className="text-2xl mb-1.5">{niche.icon}</div>
                            <div className="text-xs font-bold">{niche.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        نام برند یا فروشگاه شما:
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="مثال: رویال پرفیوم"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        توضیحات کوتاه یا شعار کسب‌وکار (جهت تولید متون هوش مصنوعی):
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="مثال: فروش آنلاین ادکلن اورجینال با ارسال فوری"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: STYLES */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-xs text-slate-300 font-bold mb-2">
                    سبک و حال‌وهوای بصری دلخواه خود را مشخص کنید:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {STYLES.map((st) => {
                      const isSelected = selectedStyle === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => setSelectedStyle(st.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md shadow-indigo-600/15'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-white">{st.name}</span>
                            <div className="flex items-center gap-1.5">
                              {st.colorPreview.map((c, i) => (
                                <span
                                  key={i}
                                  className="w-4 h-4 rounded-full border border-white/20"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: FEATURES */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-xs text-slate-300 font-bold mb-2">
                    امکانات اختصاصی که می‌خواهید هوش مصنوعی در اپلیکیشن تعبیه کند:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FEATURES.map((feat) => {
                      const isChecked = selectedFeatures.includes(feat.id);
                      return (
                        <div
                          key={feat.id}
                          onClick={() => toggleFeature(feat.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                            isChecked
                              ? 'bg-indigo-950/30 border-indigo-500/60 text-white'
                              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 ${
                              isChecked
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{feat.label}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{feat.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isGenerating && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  <span>مرحله قبل</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
                >
                  انصراف
                </button>
              )}
            </div>

            <div>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as any)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>مرحله بعد</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>شروع تولید هوشمند اپلیکیشن (AI Build)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
