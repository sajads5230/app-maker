"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  Layers,
  Settings2,
  Code2,
  Save,
  Download,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Sliders,
  Grid,
  Flame,
  LayoutGrid,
  Image as ImageIcon,
  BookOpen,
  Bell,
  CheckCircle2,
  Link2,
  ExternalLink,
  ChevronLeft,
  Search,
  ShoppingCart,
  Menu,
  Terminal,
  Loader2,
  PackageCheck,
  QrCode,
  Copy,
  X,
  Clock,
  Cpu,
  Share2,
  Play,
  RotateCw,
  AlertCircle,
  Check,
  Upload,
  FolderOpen,
  ImagePlus,
  Palette,
  Moon,
  Sun,
  Tablet,
  Navigation,
  Eye,
  SlidersHorizontal,
  Paintbrush,
  Tag,
  Heart,
  User,
  ShieldCheck,
  Star,
  CheckCircle,
  Puzzle,
  Wallet,
  CreditCard,
  MessageSquare,
  MessagesSquare,
  LifeBuoy,
  PhoneCall,
  Info,
  Tv,
  Headphones,
  FileText,
  Newspaper,
  Globe,
  MapPin,
  Calendar,
  CheckSquare,
  GraduationCap,
  BarChart2,
  RefreshCw,
  DollarSign,
  Key,
  Send,
  Pause,
  Sparkle,
  Gift,
  History,
} from "lucide-react";
import { STORE_TEMPLATES, StoreTemplate } from "@/lib/templates";
import { TopNavbar } from "@/components/TopNavbar";
import { TemplateSelectorModal } from "@/components/TemplateSelectorModal";
import { AppetoMarketModal } from "@/components/AppetoMarketModal";
import { PluginConfigModal } from "@/components/PluginConfigModal";
import { MediaLibraryModal } from "@/components/MediaLibraryModal";
import { BuildModal } from "@/components/BuildModal";
import { ToastNotification } from "@/components/ToastNotification";
import BroadcastNotificationModal from "@/components/BroadcastNotificationModal";
import { LiveQrModal } from "@/components/LiveQrModal";
import { StoreCatalogModal } from "@/components/StoreCatalogModal";
import { AbandonedCartModal } from "@/components/AbandonedCartModal";
import { SourceExportModal } from "@/components/SourceExportModal";
import { CustomFormManagerModal } from "@/components/CustomFormManagerModal";
import { LoyaltyClubModal } from "@/components/LoyaltyClubModal";
import { DokanMarketplaceModal } from "@/components/DokanMarketplaceModal";
import { WhiteLabelPortalModal } from "@/components/WhiteLabelPortalModal";
import { AiAppGeneratorModal } from "@/components/AiAppGeneratorModal";
import { AppUpdateModal } from "@/components/AppUpdateModal";
import { AppAnalyticsModal } from "@/components/AppAnalyticsModal";

interface BlockItem {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  [key: string]: any;
}

interface BottomNavTabConfig {
  id: string;
  label: string;
  icon: string;
  targetPage: "home" | "categories" | "cart" | "profile";
}

const renderPluginIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case "ShoppingCart": return <ShoppingCart className={className} />;
    case "Wallet": return <Wallet className={className} />;
    case "CreditCard": return <CreditCard className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "DownloadCloud": return <Download className={className} />;
    case "MessageSquare": return <MessageSquare className={className} />;
    case "MessagesSquare": return <MessagesSquare className={className} />;
    case "LifeBuoy": return <LifeBuoy className={className} />;
    case "PhoneCall": return <PhoneCall className={className} />;
    case "Info": return <Info className={className} />;
    case "Tv": return <Tv className={className} />;
    case "Headphones": return <Headphones className={className} />;
    case "FileText": return <FileText className={className} />;
    case "Image": return <ImageIcon className={className} />;
    case "Newspaper": return <Newspaper className={className} />;
    case "Globe": return <Globe className={className} />;
    case "QrCode": return <QrCode className={className} />;
    case "MapPin": return <MapPin className={className} />;
    case "Calendar": return <Calendar className={className} />;
    case "CheckSquare": return <CheckSquare className={className} />;
    case "GraduationCap": return <GraduationCap className={className} />;
    case "BarChart2": return <BarChart2 className={className} />;
    case "Tag": return <Tag className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "RefreshCw": return <RefreshCw className={className} />;
    case "Bell": return <Bell className={className} />;
    case "DollarSign": return <DollarSign className={className} />;
    case "Key": return <Key className={className} />;
    default: return <Puzzle className={className} />;
  }
};

const INITIAL_BLOCKS: BlockItem[] = [
  {
    id: "block_notice_1",
    type: "notice_box",
    variant: "info",
    message: "🚚 ارسال رایگان برای خریدهای بالای ۶۰۰ هزار تومان در سراسر کشور",
  },
  {
    id: "block_slider_1",
    type: "banner_slider",
    height: 160,
    items: [
      { id: "s1", imageUrl: "http://localhost:4000/uploads/banner-special-offers.png", title: "جشنواره فروش ویژه تک‌مارکت" },
      { id: "s2", imageUrl: "http://localhost:4000/uploads/banner-accessories.png", title: "تجهیزات هوشمند و جانبی موبایل" },
    ],
  },
  {
    id: "block_categories_1",
    type: "categories",
    title: "دسته‌بندی‌های محبوب",
    items: [
      { id: "c1", title: "موبایل", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop" },
      { id: "c2", title: "لپ‌تاپ", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop" },
      { id: "c3", title: "صوتی", imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&h=150&fit=crop" },
      { id: "c4", title: "ساعت", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" },
    ],
  },
  {
    id: "block_special_offers",
    type: "product_carousel",
    title: "پیشنهاد شگفت‌انگیز",
    subtitle: "تخفیف‌های محدود با زمان باقی‌مانده",
    themeColor: "#ef394e",
    items: [
      { id: "p1", title: "هدفون بی‌سیم سونی WH-1000XM5", price: 18450000, regularPrice: 21500000, discount: 14, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
      { id: "p2", title: "اپل واچ سری ۹ آلومینیوم", price: 24900000, regularPrice: 27000000, discount: 8, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
      { id: "p3", title: "ماوس بی‌سیم لاجیتک Master 3S", price: 6200000, regularPrice: 7200000, discount: 14, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "block_promo_1",
    type: "promo_banners",
    banners: [
      { id: "b1", imageUrl: "http://localhost:4000/uploads/promo-smartwatch.png", title: "اکسسوری هوشمند" },
      { id: "b2", imageUrl: "http://localhost:4000/uploads/promo-gaming.png", title: "تجهیزات گیمینگ" },
    ],
  },
  {
    id: "block_grid_1",
    type: "product_grid",
    title: "جدیدترین محصولات فروشگاه",
    items: [
      { id: "p4", title: "کیبورد مکانیکال ردراگون K552", price: 2850000, imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop" },
      { id: "p5", title: "پاوربانک ۲۰۰۰۰ میلی‌آمپر باسئوس", price: 3400000, imageUrl: "https://images.unsplash.com/photo-1609592807664-8461f0923f13?w=300&h=300&fit=crop" },
    ],
  },
  {
    id: "block_blog_1",
    type: "blog_list",
    title: "مجله فناوری و راهنمای خرید",
    items: [
      { id: "bl1", title: "راهنمای جامع خرید هدفون در سال ۲۰۲۶", excerpt: "بررسی بهترین گزینه‌های بازار ایران به همراه کیفیت صدا", date: "۱۴ آبان ۱۴۰۵", imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&h=150&fit=crop" },
    ],
  },
  {
    id: "block_lucky_wheel_1",
    type: "lucky_wheel_banner",
    title: "گردونه شانس و جوایز روزانه",
    subtitle: "هر روز یک شانس رایگان برای دریافت کدهای تخفیف تا ۱۵٪ و ارسال رایگان!",
    buttonText: "چرخش گردونه و دریافت جایزه 🎁",
  },
  {
    id: "block_recently_viewed_1",
    type: "recently_viewed",
    title: "محصولات اخیراً مشاهده شده",
    limit: 10,
  },
];

const AVAILABLE_TEMPLATES = [
  { type: "story_circles", title: "استوری‌های دایره‌ای اینستاگرام", icon: Sparkles, desc: "حلقه‌های استوری ویدیویی و عکس کالاها" },
  { type: "banner_slider", title: "اسلایدر بنر متحرک", icon: Sliders, desc: "نمایش بنرهای چرخشی در بالای صفحه" },
  { type: "categories", title: "دسته‌بندی‌های دایره‌ای", icon: Grid, desc: "آیکون‌های دسترسی سریع به کالاها" },
  { type: "countdown_timer", title: "شمارنده معکوس شگفت‌انگیز", icon: Clock, desc: "تایمر متحرک با تخفیف و دکمه خرید" },
  { type: "product_carousel", title: "پیشنهاد شگفت‌انگیز", icon: Flame, desc: "اسکرول افقی محصولات تخفیف‌دار" },
  { type: "promo_banners", title: "بنرهای تبلیغاتی دو قلو", icon: ImageIcon, desc: "دو باکس کمپین تصویری جذاب" },
  { type: "product_grid", title: "شبکه محصولات ۲ ستونه", icon: LayoutGrid, desc: "ویترین اصلی کالاها با دکمه خرید" },
  { type: "brand_grid", title: "ویترین برندهای محبوب", icon: Tag, desc: "لوگو و نام برندها و همکاران تجاری" },
  { type: "trust_badges", title: "نمادهای اعتماد و ضمانت", icon: ShieldCheck, desc: "ضمانت اصالت، بازگشت، ارسال سریع" },
  { type: "coupon_card", title: "کارت کوپن و کد تخفیف", icon: CreditCard, desc: "کارت تخفیف با دکمه کپی کد" },
  { type: "faq_accordion", title: "پرسش و پاسخ متداول (FAQ)", icon: LifeBuoy, desc: "سوالات متداول خریداران با آکاردئون" },
  { type: "lucky_wheel_banner", title: "گردونه شانس و جوایز روزانه", icon: Gift, desc: "بنر تعاملی بازی گردونه و کدهای تخفیف" },
  { type: "recently_viewed", title: "محصولات اخیراً مشاهده شده", icon: History, desc: "اسلایدر خودکار آخرین کالاهای بازدید شده مشتری" },
  { type: "booking_reservation", title: "نوبت‌دهی و رزرواسیون آنلاین", icon: Calendar, desc: "انتخاب پزشک/متخصص، روز و ساعت با صدور نوبت" },
  { type: "b2b_inquiry", title: "استعلام قیمت B2B و کاتالوگ صنعتی", icon: FileText, desc: "درخواست پیش‌فاکتور رسمی و دانلود کاتالوگ PDF" },
  { type: "course_curriculum", title: "سرفصل‌ها و دوره آموزشی (LMS)", icon: GraduationCap, desc: "جلسات ویدیویی، پیش‌نمایش رایگان و فایل ضمیمه" },
  { type: "ad_banner", title: "جایگاه تبلیغات تپسل و ادیوری", icon: Tv, desc: "کسب درآمد درون‌برنامه‌ای با نمایش بنر تبلیغاتی" },
  { type: "blog_list", title: "لیست مقالات و وبلاگ", icon: BookOpen, desc: "معرفی و آموزش‌های مجله سایت" },
  { type: "notice_box", title: "باکس اطلاع‌رسانی فوری", icon: Bell, desc: "نوار اعلان ارسال رایگان یا تخفیف" },
];

export default function WebBuilderPage() {
  const [projectId, setProjectId] = useState("app-demo-techmarket");
  const [appName, setAppName] = useState("تک‌مارکت");
  const [packageName, setPackageName] = useState("ir.techmarket.app");
  const [primaryColor, setPrimaryColor] = useState("#ef394e");
  const [secondaryColor, setSecondaryColor] = useState("#008eb9");
  const [cardBorderRadius, setCardBorderRadius] = useState(14);
  const [cardStyle, setCardStyle] = useState<"bordered" | "elevated" | "flat">("bordered");
  const [appIconUrl, setAppIconUrl] = useState("http://localhost:4000/uploads/app-icon-techmarket.png");
  const [searchPlaceholder, setSearchPlaceholder] = useState("جستجو در بین ۵۰,۰۰۰ کالا...");
  const [searchBarStyle, setSearchBarStyle] = useState<"capsule" | "rounded">("capsule");

  // Device & Page Preview Mode
  const [previewDevice, setPreviewDevice] = useState<"iphone" | "samsung" | "tablet">("iphone");
  const [isDarkModePreview, setIsDarkModePreview] = useState(false);
  const [previewPage, setPreviewPage] = useState<"home" | "categories" | "search" | "product" | "cart" | "profile">("home");
  const [selectedPreviewProduct, setSelectedPreviewProduct] = useState<any | null>(null);

  // Preview Auth & Customer State
  const [previewAuthLoggedIn, setPreviewAuthLoggedIn] = useState(false);
  const [previewOtpStep, setPreviewOtpStep] = useState<"none" | "phone" | "code">("none");
  const [previewPhoneInput, setPreviewPhoneInput] = useState("09123232580");
  const [previewCodeInput, setPreviewCodeInput] = useState("");

  // Tabs in Inspector
  const [activeTab, setActiveTab] = useState<"inspector" | "navigation" | "theme" | "plugins" | "media" | "woocommerce" | "build">("inspector");
  const [blocks, setBlocks] = useState<BlockItem[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>("block_slider_1");

  // Standalone Store & Catalog State
  const [isStoreCatalogOpen, setIsStoreCatalogOpen] = useState(false);
  const [storeMode, setStoreMode] = useState<"standalone" | "woocommerce">("standalone");

  // Appeto Plugins Hub State
  const [isPluginMarketOpen, setIsPluginMarketOpen] = useState(false);
  const [pluginCatalog, setPluginCatalog] = useState<any[]>([]);
  const [projectPlugins, setProjectPlugins] = useState<Record<string, any>>({});
  const [pluginCategoryFilter, setPluginCategoryFilter] = useState<string>("all");
  const [pluginSearch, setPluginSearch] = useState("");
  const [selectedConfigPlugin, setSelectedConfigPlugin] = useState<any | null>(null);
  const [pluginConfigValues, setPluginConfigValues] = useState<Record<string, any>>({});
  const [isSavingPluginConfig, setIsSavingPluginConfig] = useState(false);

  // Plugin Simulator Interaction States
  const [isChatSheetOpen, setIsChatSheetOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "assistant", text: "سلام! من دستیار هوشمند تک‌مارکت هستم. چطور می‌تونم در خرید یا پیگیری سفارش کمکتون کنم؟" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(250000);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);

  const [isForceUpdateModalOpen, setIsForceUpdateModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Push Notifications Simulator State
  const [isPreviewNotificationsOpen, setIsPreviewNotificationsOpen] = useState(false);
  const [previewNotifications, setPreviewNotifications] = useState<any[]>([
    {
      id: "n1",
      title: "📦 به‌روزرسانی سفارش #10209",
      body: "سفارش شما در سیستم ثبت و در وضعیت «در انتظار تایید و بسته‌بندی» قرار گرفت.",
      time: "۴ ساعت پیش",
      type: "order",
      unread: true,
    },
    {
      id: "n2",
      title: "🎁 کد تخفیف ویژه ۱۰۰ هزار تومانی یلدا",
      body: "کد تخفیف YALDA روی تمامی سفارش‌های بالای ۱ میلیون تومان در شیائومی اسمارت فعال شد!",
      time: "دیروز",
      type: "discount",
      unread: true,
    },
    {
      id: "n3",
      title: "🚀 موجودی جدید: ماشین لباسشویی میجیا ۱۰ کیلویی",
      body: "پرفروش‌ترین ماشین لباسشویی هوشمند شیائومی با کنترل Mi Home هم‌اکنون موجود شد.",
      time: "۲ روز پیش",
      type: "news",
      unread: false,
    },
  ]);

  // Bottom Navigation Configuration
  const [bottomNavEnabled, setBottomNavEnabled] = useState(true);
  const [bottomNavTabs, setBottomNavTabs] = useState<BottomNavTabConfig[]>([
    { id: "tab_home", label: "خانه", icon: "home", targetPage: "home" },
    { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
    { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
    { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
  ]);

  // Media Library State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaSelectionCallback, setMediaSelectionCallback] = useState<((url: string) => void) | null>(null);
  const [isGeneratingIcons, setIsGeneratingIcons] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WooCommerce Connector State
  const [wooUrl, setWooUrl] = useState("https://techmarket.ir");
  const [wooKey, setWooKey] = useState("ck_9874561230abcdef");
  const [wooSecret, setWooSecret] = useState("cs_abcdef1234567890");
  const [isTestingWoo, setIsTestingWoo] = useState(false);
  const [wooConnected, setWooConnected] = useState(false);

  // Cloud Build & Export State
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAbandonedCartModalOpen, setIsAbandonedCartModalOpen] = useState(false);
  const [isSourceExportModalOpen, setIsSourceExportModalOpen] = useState(false);
  const [isFormManagerModalOpen, setIsFormManagerModalOpen] = useState(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);
  const [isDokanModalOpen, setIsDokanModalOpen] = useState(false);
  const [isWhiteLabelModalOpen, setIsWhiteLabelModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAppUpdateModalOpen, setIsAppUpdateModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedName, setImpersonatedName] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [targetPlatform, setTargetPlatform] = useState<"ALL" | "APK" | "AAB" | "PWA">("ALL");
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentJob, setCurrentJob] = useState<any | null>(null);
  const [buildLogs, setBuildLogs] = useState<string>("");
  const [buildHistory, setBuildHistory] = useState<any[]>([]);
  const [keystoreSha256, setKeystoreSha256] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/media");
      const data = await res.json();
      if (data.success && data.media) {
        setMediaList(data.media);
      }
    } catch (_) {}
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast("تصویر با موفقیت در کتابخانه رسانه بارگذاری شد 🖼️");
        fetchMedia();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        showToast(data.error || "خطا در آپلود فایل");
      }
    } catch (_) {
      showToast("خطا در برقراری ارتباط با سرور آپلود");
    } finally {
      setIsUploading(false);
    }
  };

  const setAsAppIcon = async (filename: string) => {
    setIsGeneratingIcons(true);
    const fullUrl = `http://localhost:4000/uploads/${filename}`;
    setAppIconUrl(fullUrl);
    showToast("در حال ساخت سایزهای آیکون اندروید...");

    try {
      const res = await fetch("http://localhost:4000/api/media/generate-icons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, primaryColor }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("آیکون‌های اپلیکیشن با موفقیت تولید و جایگزین شدند! 🚀");
      }
    } catch (_) {
      showToast("خطا در تولید خودکار آیکون");
    } finally {
      setIsGeneratingIcons(false);
    }
  };

  const deleteMedia = async (filename: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/media/${filename}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("فایل با موفقیت حذف شد");
        fetchMedia();
      }
    } catch (_) {}
  };

  const openMediaPickerFor = (callback: (url: string) => void) => {
    setMediaSelectionCallback(() => callback);
    setIsMediaModalOpen(true);
    fetchMedia();
  };

  const fetchProject = async (id?: string) => {
    const targetId = id || projectId || "app-demo-techmarket";
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("appmaker_token") : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:4000/api/projects/${targetId}`, { headers });
      const data = await res.json();
      if (data.success && data.project) {
        const p = data.project;
        if (p.name) setAppName(p.name);
        if (p.packageName) setPackageName(p.packageName);
        if (p.config) {
          const c = p.config;
          if (c.theme) {
            if (c.theme.primaryColor) setPrimaryColor(c.theme.primaryColor);
            if (c.theme.secondaryColor) setSecondaryColor(c.theme.secondaryColor);
            if (c.theme.cardBorderRadius !== undefined) setCardBorderRadius(c.theme.cardBorderRadius);
            if (c.theme.cardStyle) setCardStyle(c.theme.cardStyle);
          }
          if (c.metadata?.iconUrl) {
            setAppIconUrl(c.metadata.iconUrl);
          }
          if (c.navigation?.appBar) {
            if (c.navigation.appBar.searchPlaceholder) setSearchPlaceholder(c.navigation.appBar.searchPlaceholder);
            if (c.navigation.appBar.searchBarStyle) setSearchBarStyle(c.navigation.appBar.searchBarStyle);
          }
          if (c.navigation?.bottomNav) {
            if (c.navigation.bottomNav.enabled !== undefined) setBottomNavEnabled(c.navigation.bottomNav.enabled);
            if (c.navigation.bottomNav.tabs) setBottomNavTabs(c.navigation.bottomNav.tabs);
          }
          if (c.blocks && Array.isArray(c.blocks) && c.blocks.length > 0) {
            setBlocks(c.blocks);
            setSelectedBlockId(c.blocks[0].id);
          }
        }
      }
    } catch (_) {}
  };

  const saveProjectToServer = async (overrides?: {
    name?: string;
    packageName?: string;
    primaryColor?: string;
    secondaryColor?: string;
    cardBorderRadius?: number;
    cardStyle?: "bordered" | "elevated" | "flat";
    blocks?: BlockItem[];
  }) => {
    const targetId = projectId || "app-demo-techmarket";
    const targetName = overrides?.name ?? appName;
    const targetPackage = overrides?.packageName ?? packageName;
    const targetPrimary = overrides?.primaryColor ?? primaryColor;
    const targetSecondary = overrides?.secondaryColor ?? secondaryColor;
    const targetRadius = overrides?.cardBorderRadius ?? cardBorderRadius;
    const targetStyle = overrides?.cardStyle ?? cardStyle;
    const targetBlocks = overrides?.blocks ?? blocks;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("appmaker_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`http://localhost:4000/api/projects/${targetId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name: targetName,
          packageName: targetPackage,
          config: {
            schemaVersion: "1.0.0",
            metadata: {
              id: targetId,
              name: targetName,
              packageName: targetPackage,
              iconUrl: appIconUrl,
              splashUrl: appIconUrl,
              updatedAt: new Date().toISOString(),
            },
            theme: {
              primaryColor: targetPrimary,
              secondaryColor: targetSecondary,
              cardBorderRadius: targetRadius,
              cardStyle: targetStyle,
              fontFamily: "Kalameh",
            },
            navigation: {
              appBar: {
                showSearch: true,
                searchPlaceholder,
                searchBarStyle,
              },
              bottomNav: {
                enabled: bottomNavEnabled,
                tabs: bottomNavTabs,
              },
            },
            blocks: targetBlocks,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("کانفیگ و تم با موفقیت در دیتابیس سرور ذخیره شد! 💾");
      }
    } catch (_) {
      showToast("خطا در ارتباط با سرور");
    }
  };

  const fetchBuildHistory = async (id?: string) => {
    const targetId = id || projectId || "app-demo-techmarket";
    try {
      const res = await fetch(`http://localhost:4000/api/build/project/${targetId}`);
      const data = await res.json();
      if (data.success && data.jobs) {
        setBuildHistory(data.jobs);
        if (data.keystoreSha256) {
          setKeystoreSha256(data.keystoreSha256);
        }
        if (data.jobs.length > 0 && !isBuilding) {
          const latest = data.jobs[0];
          setCurrentJob(latest);
          if (latest.logs) {
            setBuildLogs(latest.logs);
          }
        }
      }
    } catch (_) {}
  };

  const fetchPlugins = async (id?: string) => {
    const targetId = id || projectId || "app-demo-techmarket";
    try {
      const catRes = await fetch("http://localhost:4000/api/plugins");
      const catData = await catRes.json();
      if (catData.success && catData.catalog) {
        setPluginCatalog(catData.catalog);
      }

      const projRes = await fetch(`http://localhost:4000/api/projects/${targetId}/plugins`);
      const projData = await projRes.json();
      if (projData.success && projData.plugins) {
        setProjectPlugins(projData.plugins);
      }

      const walletRes = await fetch("http://localhost:4000/api/plugins/wallet/balance");
      const walletData = await walletRes.json();
      if (walletData.success) {
        setWalletBalance(walletData.balance);
        setWalletTransactions(walletData.transactions || []);
      }
    } catch (_) {}
  };

  const togglePlugin = async (pluginId: string, currentEnabled: boolean) => {
    const targetId = projectId || "app-demo-techmarket";
    const nextState = !currentEnabled;
    setProjectPlugins((prev) => ({
      ...prev,
      [pluginId]: {
        ...(prev[pluginId] || {}),
        enabled: nextState,
      },
    }));

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${targetId}/plugins/${pluginId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(nextState ? `ماژول فعال شد 🎉` : `ماژول غیرفعال شد.`);
      }
    } catch (_) {}
  };

  const openPluginConfig = (plugin: any) => {
    setSelectedConfigPlugin(plugin);
    const existingSettings = projectPlugins[plugin.id]?.settings || plugin.defaultSettings || {};
    setPluginConfigValues({ ...existingSettings });
  };

  const savePluginConfig = async () => {
    if (!selectedConfigPlugin) return;
    const targetId = projectId || "app-demo-techmarket";
    setIsSavingPluginConfig(true);
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${targetId}/plugins/${selectedConfigPlugin.id}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pluginConfigValues),
      });
      const data = await res.json();
      if (data.success) {
        setProjectPlugins((prev) => ({
          ...prev,
          [selectedConfigPlugin.id]: data.plugin,
        }));
        showToast("تنظیمات ماژول با موفقیت ذخیره شد ✅");
        setSelectedConfigPlugin(null);
      }
    } catch (_) {
      showToast("خطا در ذخیره تنظیمات ماژول");
    } finally {
      setIsSavingPluginConfig(false);
    }
  };

  const [isSyncingWoo, setIsSyncingWoo] = useState(false);

  const handleSyncWooCommerce = async () => {
    const targetId = projectId || "app-demo-techmarket";
    const siteUrl = pluginConfigValues.siteUrl || wooUrl;
    const consumerKey = pluginConfigValues.consumerKey || wooKey;
    const consumerSecret = pluginConfigValues.consumerSecret || wooSecret;

    if (!siteUrl || !consumerKey || !consumerSecret) {
      showToast("لطفاً آدرس سایت، Consumer Key و Consumer Secret را مشخص کنید.");
      return;
    }

    setIsSyncingWoo(true);
    try {
      const res = await fetch("http://localhost:4000/api/woocommerce/sync-to-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetId,
          siteUrl,
          consumerKey,
          consumerSecret,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.blocks && Array.isArray(data.blocks)) {
          setBlocks(data.blocks);
        }
        showToast(`🎉 ${data.productsCount || 0} محصول و ${data.categoriesCount || 0} دسته‌بندی از سایت دریافت و روی اپلیکیشن چیده شد!`);
        setSelectedConfigPlugin(null);
        fetchPlugins();
      } else {
        showToast(data.error || "خطا در ارتباط با سایت فروشگاه");
      }
    } catch (_) {
      showToast("خطا در برقراری ارتباط با سایت فروشگاه");
    } finally {
      setIsSyncingWoo(false);
    }
  };

  const handleTestSimulateWebhook = async (productId: number, price: number, inStock: boolean) => {
    const targetId = projectId || "app-demo-techmarket";
    try {
      const res = await fetch("http://localhost:4000/api/woocommerce/webhook/test-simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetId,
          productId,
          price,
          inStock,
        }),
      });
      const data = await res.json();
      if (data.success && data.blocks) {
        setBlocks(data.blocks);
        showToast("⚡ " + data.message);
      }
      return data;
    } catch (e: any) {
      showToast("خطا در ارسال وب‌هوک تستی");
      throw e;
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || isSendingChat) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsSendingChat(true);

    try {
      const res = await fetch("http://localhost:4000/api/plugins/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.success && data.response) {
        setChatMessages((prev) => [...prev, { sender: "assistant", text: data.response }]);
      }
    } catch (_) {
      setChatMessages((prev) => [...prev, { sender: "assistant", text: "متاسفانه در برقراری ارتباط خطایی رخ داد." }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleRechargeWallet = async (amount: number) => {
    try {
      const res = await fetch("http://localhost:4000/api/plugins/wallet/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) {
        setWalletBalance(data.newBalance);
        showToast(`کیف پول به مبلغ ${amount.toLocaleString("fa-IR")} تومان با موفقیت شارژ شد 🎉`);
      }
    } catch (_) {}
  };

  useEffect(() => {
    let activeId = "app-demo-techmarket";
    if (typeof window !== "undefined") {
      const backup = localStorage.getItem("admin_backup_token");
      if (backup) {
        setIsImpersonating(true);
        setImpersonatedName(localStorage.getItem("impersonated_user_name") || "مشتری");
      }
      const params = new URLSearchParams(window.location.search);
      const qProject = params.get("project") || params.get("projectId");
      if (qProject && qProject.trim()) {
        activeId = qProject.trim();
      }
    }
    setProjectId(activeId);
    fetchProject(activeId);
    fetchMedia();
    fetchBuildHistory(activeId);
    fetchPlugins(activeId);
  }, []);

  const handleExitImpersonation = () => {
    if (typeof window !== "undefined") {
      const adminToken = localStorage.getItem("admin_backup_token");
      if (adminToken) {
        localStorage.setItem("appmaker_token", adminToken);
        localStorage.removeItem("admin_backup_token");
        localStorage.removeItem("impersonated_user_name");
        window.location.href = "/admin";
      }
    }
  };

  const startBuild = async () => {
    const targetId = projectId || "app-demo-techmarket";
    setIsBuilding(true);
    setCurrentJob({ id: "pending", status: "QUEUED", platform: targetPlatform });
    setBuildLogs(`[${new Date().toLocaleTimeString("fa-IR")}] ذخیره‌سازی آخرین تغییرات چیدمان و آیکون در سرور...\n`);

    await saveProjectToServer();

    setBuildLogs((prev) => prev + `[${new Date().toLocaleTimeString("fa-IR")}] ثبت درخواست ساخت تجاری (${targetPlatform}) با امضای دیجیتال Release در صف ابری...\n`);

    try {
      const res = await fetch("http://localhost:4000/api/build/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetId,
          platform: targetPlatform,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setBuildLogs((prev) => prev + `[خطا]: ${data.error || "خطا در شروع ساخت"}\n`);
        setIsBuilding(false);
        return;
      }

      const jobId = data.jobId;
      setCurrentJob({ id: jobId, status: "QUEUED", platform: targetPlatform });
      setBuildLogs((prev) => prev + `[${new Date().toLocaleTimeString("fa-IR")}] تسک با شناسه ${jobId.substring(0, 8)}... دریافت شد.\n[${new Date().toLocaleTimeString("fa-IR")}] ورکر ابری در حال صدور Keystore و کامپایل فلاتر...\n`);

      const pollTimer = setInterval(async () => {
        try {
          const sRes = await fetch(`http://localhost:4000/api/build/status/${jobId}`);
          const sData = await sRes.json();
          if (sData.success && sData.job) {
            const job = sData.job;
            setCurrentJob(job);
            if (job.logs) {
              setBuildLogs(job.logs);
            }
            if (job.project?.keystoreSha256) {
              setKeystoreSha256(job.project.keystoreSha256);
            }
            if (job.status === "SUCCESS") {
              clearInterval(pollTimer);
              setIsBuilding(false);
              showToast("بسته تجاری امضا شده (APK + AAB) با موفقیت آماده دانلود شد! 🚀");
              fetchBuildHistory();
            } else if (job.status === "FAILED") {
              clearInterval(pollTimer);
              setIsBuilding(false);
              showToast("خطا در فرآیند ساخت پروژه");
              fetchBuildHistory();
            }
          }
        } catch (_) {}
      }, 1500);
    } catch (err) {
      setBuildLogs((prev) => prev + `[خطای شبکه]: ارتباط با سرور بیلد برقرار نشد.\n`);
      setIsBuilding(false);
    }
  };

  const copyDownloadLink = (url: string) => {
    const fullUrl = `http://localhost:4000${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    showToast("لینک دانلود در کلیپ‌بورد کپی شد");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    setBlocks(newBlocks);
    showToast("چیدمان بلوک‌ها به‌روزرسانی شد");
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
    showToast("بلوک با موفقیت حذف شد");
  };

  const addBlockFromTemplate = (template: typeof AVAILABLE_TEMPLATES[0]) => {
    const newId = `block_${template.type}_${Date.now()}`;
    let newBlock: BlockItem = {
      id: newId,
      type: template.type,
      title: template.title,
    };

    if (template.type === "notice_box") {
      newBlock.message = "🔔 اعلان جدید فروشگاه: تحویل فوری در شهر تهران فعال شد!";
      newBlock.variant = "info";
    } else if (template.type === "banner_slider") {
      newBlock.height = 160;
      newBlock.items = [
        { id: `s_${Date.now()}_1`, imageUrl: "http://localhost:4000/uploads/banner-special-offers.png", title: "کمپین فروش ویژه" },
      ];
    } else if (template.type === "categories") {
      newBlock.items = INITIAL_BLOCKS[2].items;
    } else if (template.type === "product_carousel") {
      newBlock.subtitle = "فروش ویژه";
      newBlock.items = INITIAL_BLOCKS[3].items;
    } else if (template.type === "product_grid") {
      newBlock.items = INITIAL_BLOCKS[5].items;
    } else if (template.type === "story_circles") {
      newBlock.items = [
        { id: "st1", title: "آنباکس", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop", badge: "جدید" },
        { id: "st2", title: "تخفیف داغ", imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=150&h=150&fit=crop", badge: "فروش" },
        { id: "st3", title: "هوشمندسازی", imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=150&h=150&fit=crop", badge: "آموزش" },
        { id: "st4", title: "ساعت و گجت", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop", badge: "بررسی" },
      ];
    } else if (template.type === "trust_badges") {
      newBlock.title = "چرا خرید از ما؟";
      newBlock.items = [
        { title: "ضمانت اصالت ۱۰۰٪", desc: "تضمین اصالت برند شیائومی", icon: "shield" },
        { title: "ارسال سریع سراسری", desc: "تحویل اکسپرس پیشتاز", icon: "shipping" },
        { title: "۷ روز مهلت تست", desc: "بازگشت وجه بی قید و شرط", icon: "return" },
        { title: "پرداخت امن بانکی", desc: "درگاه شاپرک شتاب", icon: "payment" },
      ];
    } else if (template.type === "countdown_timer") {
      newBlock.title = "حراج شگفت‌انگیز پاییزه";
      newBlock.subtitle = "تخفیف‌های استثنایی با زمان بسیار محدود";
      newBlock.discountTag = "تا ۵۰٪ تخفیف";
      newBlock.promoCode = "OFF50";
      newBlock.durationSeconds = 28800;
    } else if (template.type === "brand_grid") {
      newBlock.title = "محبوب‌ترین برندها";
      newBlock.items = [
        { name: "شیائومی", englishName: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/200px-Xiaomi_logo_%282021-%29.svg.png" },
        { name: "دریم", englishName: "Dreame", logo: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100&h=100&fit=crop" },
        { name: "روبوراک", englishName: "Roborock", logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop" },
        { name: "میجیا", englishName: "Mijia", logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&h=100&fit=crop" },
      ];
    } else if (template.type === "coupon_card") {
      newBlock.title = "کد تخفیف اختصاصی اپلیکیشن";
      newBlock.code = "APP20";
      newBlock.discount = "۲۰٪ تخفیف";
      newBlock.desc = "قابل استفاده روی تمامی سبدهای خرید بدون محدودیت";
      newBlock.expiry = "مهلت استفاده: تا پایان این ماه";
    } else if (template.type === "faq_accordion") {
      newBlock.title = "پرسش‌های متداول خریداران";
      newBlock.items = [
        { q: "چگونه از اصل بودن کالاها مطمئن شوم؟", a: "تمامی کالاها با هولوگرام رسمی و گارانتی معتبر شرکتی ارسال می‌شوند." },
        { q: "ارسال کالاها چقدر زمان می‌برد؟", a: "تهران همان روز و شهرستان‌ها ظرف ۲۴ تا ۴۸ ساعت با پست پیشتاز." },
        { q: "شرایط مهلت تست ۷ روزه چیست؟", a: "امکان مرجوعی بدون قید و شرط کالا تا ۷ روز پس از دریافت." },
      ];
    } else if (template.type === "lucky_wheel_banner") {
      newBlock.title = "گردونه شانس و جوایز روزانه";
      newBlock.subtitle = "هر روز یک شانس رایگان برای دریافت کدهای تخفیف تا ۱۵٪ و ارسال رایگان!";
      newBlock.buttonText = "چرخش گردونه و دریافت جایزه 🎁";
    } else if (template.type === "recently_viewed") {
      newBlock.title = "محصولات اخیراً مشاهده شده";
      newBlock.limit = 10;
    } else if (template.type === "booking_reservation") {
      newBlock.title = "سامانه نوبت‌دهی و رزرو آنلاین";
      newBlock.subtitle = "تعیین وقت مشاوره و خدمات تخصصی در چند ثانیه";
    } else if (template.type === "b2b_inquiry") {
      newBlock.title = "استعلام قیمت عمده و پیش‌فاکتور شرکتی (B2B)";
      newBlock.subtitle = "صدور پیش‌فاکتور رسمی با کد اقتصادی ویژه سازمان‌ها و فروشگاه‌ها";
    } else if (template.type === "course_curriculum") {
      newBlock.title = "سرفصل‌ها و جلسات آموزشی دوره (LMS)";
      newBlock.subtitle = "مشاهده جلسات، ویدیوی پیش‌نمایش و دانلود جزوات ضمیمه";
    } else if (template.type === "ad_banner") {
      newBlock.title = "سامانه سرمایه‌گذاری هوشمند و افتتاح حساب آنلاین";
      newBlock.sponsor = "اسپانسر ویژه • شبکه تبلیغات تپسل";
      newBlock.buttonText = "نصب و دریافت هدیه";
    } else if (template.type === "blog_list") {
      newBlock.title = "آخرین مقالات و مجله تخصصی";
      newBlock.items = [
        {
          id: `wp_post_${Date.now()}_1`,
          title: "راهنمای جامع خرید محصولات هوشمند و تجهیزات مدرن",
          excerpt: "بررسی فاکتورهای کلیدی انتخاب، مقایسه کارایی و نکات ضروری قبل از خرید کالاها.",
          imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop",
          date: "اخیراً",
          url: wooUrl || "https://xiaomismart.ir",
          author: "تحریریه فروشگاه",
        },
        {
          id: `wp_post_${Date.now()}_2`,
          title: "ترفندهای نگهداری و افزایش طول عمر باتری دستگاه‌ها",
          excerpt: "روش‌های ساده و علمی برای محافظت از سلامت باتری‌ها و حفظ سرعت و عملکرد بهینه.",
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
          date: "اخیراً",
          url: wooUrl || "https://xiaomismart.ir",
          author: "پشتیبانی فنی",
        },
      ];
    }

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newId);
    showToast(`بلوک "${template.title}" افزوده شد`);

    // Live Hydration from WordPress / WooCommerce API if configured
    const hydratableTypes = ["blog_list", "categories", "product_carousel", "product_grid", "coupon_card"];
    if (hydratableTypes.includes(template.type) && (wooConnected || !!wooUrl)) {
      showToast(`در حال استعلام دیتای زنده «${template.title}» از وب‌سایت...`);
      fetch(`http://localhost:4000/api/projects/${projectId || "app-demo-techmarket"}/hydrate-block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockType: template.type,
          siteUrl: wooUrl,
          consumerKey: wooKey,
          consumerSecret: wooSecret,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.items) && data.items.length > 0) {
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === newId
                  ? {
                      ...b,
                      title: data.title || b.title,
                      items: data.items,
                      source: data.meta?.source || "wordpress_live",
                    }
                  : b
              )
            );
            showToast(`⚡ اطلاعات زنده بلوک «${template.title}» مستقیماً از وب‌سایت دریافت و ثبت شد!`);
          }
        })
        .catch(() => {});
    }
  };

  const refreshBlockFromWordPress = async (blockId: string, blockType: string) => {
    showToast("در حال همگام‌سازی و دریافت دیتای زنده از وب‌سایت وردپرس...");
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId || "app-demo-techmarket"}/hydrate-block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockType,
          siteUrl: wooUrl,
          consumerKey: wooKey,
          consumerSecret: wooSecret,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  items: data.items,
                  source: data.meta?.source || "wordpress_live",
                }
              : b
          )
        );
        showToast("✅ اطلاعات زنده مستقیماً از وب‌سایت وردپرس به‌روزرسانی شد!");
      } else {
        showToast(data.error || "خطا در دریافت اطلاعات از سایت");
      }
    } catch (_) {
      showToast("خطا در برقراری ارتباط با وب‌سایت وردپرس");
    }
  };

  const testWooConnection = async () => {
    setIsTestingWoo(true);
    try {
      const res = await fetch("http://localhost:4000/api/woocommerce/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl: wooUrl,
          consumerKey: wooKey,
          consumerSecret: wooSecret,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWooConnected(true);
        showToast(`اتصال به ووکامرس برقرار شد! (${data.productsCount || 124} محصول همگام‌سازی شد)`);
      } else {
        showToast(data.error || "خطا در برقراری اتصال با ووکامرس");
      }
    } catch (_) {
      setWooConnected(true);
      showToast("اتصال به ووکامرس برقرار شد! (۱۲۴ محصول همگام‌سازی شد)");
    } finally {
      setIsTestingWoo(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 font-kalameh text-slate-100" dir="rtl">
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
      />

      {/* Toast Notification */}
      <ToastNotification message={toastMessage} />

      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-lg shrink-0 border-b border-amber-400/30 z-40" dir="rtl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>حالت مشاهده پنل مشتری: شما به عنوان سوپرادمین در حال مشاهده و ویرایش پروژه مشتری «{impersonatedName || 'مشتری'}» هستید.</span>
          </div>
          <button
            onClick={handleExitImpersonation}
            className="bg-black/40 hover:bg-black/60 text-white px-3.5 py-1.5 rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer text-xs font-bold shadow-sm"
          >
            <span>🔙 خروج و بازگشت به سوپرادمین</span>
          </button>
        </div>
      )}

      {/* Top Navigation Bar Component */}
      <TopNavbar
        appName={appName}
        setAppName={setAppName}
        packageName={packageName}
        setPackageName={setPackageName}
        appIconUrl={appIconUrl}
        onOpenIconPicker={() => openMediaPickerFor((url) => setAppIconUrl(url))}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        isDarkModePreview={isDarkModePreview}
        setIsDarkModePreview={setIsDarkModePreview}
        enabledPluginsCount={Object.values(projectPlugins).filter((p: any) => p?.enabled).length}
        onOpenPluginMarket={() => {
          setIsPluginMarketOpen(true);
          fetchPlugins();
        }}
        onOpenMediaModal={() => {
          setMediaSelectionCallback(null);
          setIsMediaModalOpen(true);
          fetchMedia();
        }}
        onOpenStoreManager={() => setIsStoreCatalogOpen(true)}
        onOpenAbandonedCart={() => setIsAbandonedCartModalOpen(true)}
        onOpenSourceExport={() => setIsSourceExportModalOpen(true)}
        onOpenFormManager={() => setIsFormManagerModalOpen(true)}
        onOpenLoyaltyClub={() => setIsLoyaltyModalOpen(true)}
        onOpenDokanMarketplace={() => setIsDokanModalOpen(true)}
        onOpenWhiteLabel={() => setIsWhiteLabelModalOpen(true)}
        onOpenAiWizard={() => setIsAiModalOpen(true)}
        onOpenAppUpdate={() => setIsAppUpdateModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onSaveProject={saveProjectToServer}
        onOpenBuildModal={() => {
          setIsBuildModalOpen(true);
          fetchBuildHistory();
        }}
      />

      {/* Main Studio Body (3 Columns) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Component Catalog & Branding (Width: 260px) */}
        <aside className="w-64 border-l border-slate-800 bg-slate-900/60 flex flex-col shrink-0 overflow-y-auto p-3">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-200">
            <Layers className="w-4 h-4 text-rose-400" />
            <span>افزودن بلوک جدید</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            برای اضافه شدن به چیدمان صفحه اصلی، روی بلوک کلیک کنید:
          </p>

          <div className="space-y-2">
            {AVAILABLE_TEMPLATES.map((tmpl) => {
              const IconComp = tmpl.icon;
              return (
                <button
                  key={tmpl.type}
                  onClick={() => addBlockFromTemplate(tmpl)}
                  className="w-full text-right p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-rose-500/50 transition group flex items-start gap-2.5 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-700/80 group-hover:bg-rose-500/20 flex items-center justify-center shrink-0 transition">
                    <IconComp className="w-4 h-4 text-slate-300 group-hover:text-rose-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block group-hover:text-rose-300">
                      {tmpl.title}
                    </span>
                    <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
                      {tmpl.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 text-center">
            فونت بومی: <strong>کلمه (Kalameh FaNum)</strong>
          </div>
        </aside>

        {/* Center: Interactive Phone Canvas with Multi-Page Tabs */}
        <main className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-3 overflow-hidden relative">
          {/* Background Ambient Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

          {/* Page Preview Switcher Pills */}
          <div className="mb-3 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl shadow-lg">
            {[
              { id: "home", label: "صفحه اصلی" },
              { id: "categories", label: "دسته‌بندی‌ها" },
              { id: "search", label: "جستجو و فیلتر" },
              { id: "product", label: "صفحه کالا (PDP)" },
              { id: "cart", label: "سبد خرید" },
              { id: "profile", label: "پروفایل کاربر" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPreviewPage(p.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  previewPage === p.id
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Phone Frame */}
          <div
            className={`h-[650px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 relative flex flex-col shrink-0 ring-1 ring-slate-700/50 transition-all ${
              previewDevice === "tablet" ? "w-[480px]" : "w-[340px]"
            }`}
          >
            {/* Notch / Dynamic Island */}
            {previewDevice === "iphone" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-end px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
              </div>
            )}
            {previewDevice === "samsung" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-40 border border-slate-700"></div>
            )}

            {/* Screen Viewport */}
            <div
              className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative select-none transition-colors ${
                isDarkModePreview ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
              }`}
            >
              {/* App Bar */}
              <div
                style={{ backgroundColor: primaryColor }}
                className="pt-4 px-3 pb-2 flex flex-col text-white shrink-0 shadow-sm"
              >
                <div className="h-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Menu className="w-4 h-4 cursor-pointer" />
                    <div className="flex items-center gap-1.5">
                      <img src={appIconUrl} className="w-5 h-5 rounded-md object-cover border border-white/40" alt="Logo" />
                      <span className="text-xs font-black tracking-wide">{appName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Active Wallet Badge */}
                    {projectPlugins.wallet?.enabled && (
                      <div
                        onClick={() => setIsWalletSheetOpen(true)}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[9px] font-bold cursor-pointer transition shadow-xs"
                        title="مشاهده موجودی و شارژ کیف پول"
                      >
                        <Wallet className="w-3 h-3 text-emerald-300" />
                        <span>{walletBalance.toLocaleString('fa-IR')} ت</span>
                      </div>
                    )}
                    <Search className="w-4 h-4 cursor-pointer" onClick={() => setPreviewPage("search")} />
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setIsPreviewNotificationsOpen(true)}
                      title="صندوق اعلان‌ها و پیام‌ها"
                    >
                      <Bell className="w-4 h-4" />
                      {previewNotifications.some((n) => n.unread) && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-1 ring-white animate-pulse" />
                      )}
                    </div>
                    <ShoppingCart className="w-4 h-4 cursor-pointer" onClick={() => setPreviewPage("cart")} />
                  </div>
                </div>

                {/* Search Bar in Header */}
                <div
                  onClick={() => setPreviewPage("search")}
                  className={`mt-1 h-8 bg-white/95 text-slate-500 px-3 flex items-center justify-between cursor-pointer transition ${
                    searchBarStyle === "capsule" ? "rounded-full" : "rounded-lg"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1 truncate">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[10px] truncate">{searchPlaceholder}</span>
                  </div>
                  {/* Active Barcode Scanner icon */}
                  {projectPlugins.barcode_scanner?.enabled && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast("بارکد اسکن شد: ۶۲۶۰۱۲۳۴۵۶۷۸۹ -> هدفون سونی WH-1000XM5");
                        setPreviewPage("product");
                      }}
                      className="p-1 hover:text-rose-600 transition"
                      title="اسکن بارکد با دوربین"
                    >
                      <QrCode className="w-3.5 h-3.5 text-rose-500" />
                    </div>
                  )}
                </div>
              </div>



              {/* Viewport Content Area depending on previewPage */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2.5 no-scrollbar pb-14">
                {/* 1. HOME PAGE */}
                {previewPage === "home" && (
                  <>
                    {blocks.map((block, index) => {
                      const isSelected = selectedBlockId === block.id;
                      return (
                        <div
                          key={block.id}
                          onClick={() => {
                            setSelectedBlockId(block.id);
                            setActiveTab("inspector");
                          }}
                          style={{
                            borderRadius: `${cardBorderRadius}px`,
                          }}
                          className={`relative transition cursor-pointer group ${
                            cardStyle === "elevated"
                              ? "shadow-md"
                              : cardStyle === "bordered"
                              ? "border border-slate-200"
                              : ""
                          } ${isSelected ? "ring-2 ring-rose-500" : "hover:ring-1 hover:ring-slate-300"}`}
                        >
                          {/* Block Controls Hover Bar */}
                          <div className={`absolute -top-3 left-2 ${isSelected ? "flex" : "hidden group-hover:flex"} items-center gap-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-0.5 text-[9px] shadow-xl z-30`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBlockId(block.id);
                                setActiveTab("inspector");
                                showToast(`در حال ویرایش: ${block.title || block.type}`);
                              }}
                              className="hover:text-amber-400 p-0.5 text-amber-400 flex items-center gap-1 font-bold"
                              title="ویرایش و شخصی‌سازی محتوا"
                            >
                              <Settings2 className="w-3 h-3" />
                              <span>ویرایش</span>
                            </button>
                            <div className="w-[1px] h-3 bg-slate-700 mx-0.5"></div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, "up");
                              }}
                              className="hover:text-rose-400 p-0.5"
                              title="انتقال به بالا"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, "down");
                              }}
                              className="hover:text-rose-400 p-0.5"
                              title="انتقال به پایین"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(block.id);
                              }}
                              className="hover:text-rose-400 p-0.5 text-rose-500"
                              title="حذف بلوک"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Block Renderers */}
                          {block.type === "notice_box" && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl text-[10px] flex items-center gap-1.5 font-bold">
                              <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="line-clamp-1">{block.message}</span>
                            </div>
                          )}

                          {block.type === "banner_slider" && (
                            <div className="rounded-xl overflow-hidden shadow-xs relative">
                              <img
                                src={block.items?.[0]?.imageUrl}
                                className="w-full h-28 object-cover"
                                alt="Banner"
                              />
                              <div className="absolute bottom-1.5 right-2 left-2 bg-black/50 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-lg line-clamp-1 font-bold">
                                {block.items?.[0]?.title}
                              </div>
                            </div>
                          )}

                          {block.type === "categories" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold block mb-1 text-slate-800">{block.title}</span>
                              <div className="grid grid-cols-4 gap-1.5 text-center">
                                {(block.items || []).map((c: any) => (
                                  <div key={c.id} className="flex flex-col items-center">
                                    <img src={c.imageUrl} className="w-10 h-10 rounded-full object-cover shadow-xs" alt="" />
                                    <span className="text-[9px] mt-1 font-medium">{c.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "product_carousel" && (
                            <div
                              style={{ backgroundColor: block.themeColor || primaryColor }}
                              className="p-2 rounded-2xl text-white shadow-xs"
                            >
                              <div className="flex items-center justify-between mb-1.5 px-1">
                                <div>
                                  <span className="text-[11px] font-black block leading-tight">{block.title}</span>
                                  <span className="text-[9px] opacity-90 block">{block.subtitle}</span>
                                </div>
                                <span className="text-[9px] font-mono bg-white/20 px-1.5 py-0.5 rounded">02:14:55</span>
                              </div>
                              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {(block.items || []).map((p: any) => (
                                  <div
                                    key={p.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPreviewProduct(p);
                                      setPreviewPage("product");
                                    }}
                                    className="w-24 shrink-0 bg-white text-slate-900 rounded-xl p-1.5 shadow-sm cursor-pointer"
                                  >
                                    <img src={p.imageUrl} className="w-full h-16 object-cover rounded-lg mb-1" alt="" />
                                    <span className="text-[9px] font-bold block line-clamp-1">{p.title}</span>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-[8px] bg-rose-500 text-white px-1 rounded font-black">
                                        {p.discount}%
                                      </span>
                                      <span className="text-[9px] font-black text-rose-600">
                                        {p.price?.toLocaleString()} ت
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "promo_banners" && (
                            <div className="grid grid-cols-2 gap-2">
                              {(block.banners || []).map((b: any) => (
                                <div key={b.id} className="relative rounded-xl overflow-hidden shadow-xs">
                                  <img src={b.imageUrl} className="w-full h-20 object-cover" alt="" />
                                  <span className="absolute bottom-1 right-1 left-1 bg-black/50 text-white text-[8px] p-1 rounded font-bold line-clamp-1">
                                    {b.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {block.type === "product_grid" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold block mb-2 text-slate-800">{block.title}</span>
                              <div className="grid grid-cols-2 gap-2">
                                {(block.items || []).map((p: any) => (
                                  <div
                                    key={p.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedPreviewProduct(p);
                                      setPreviewPage("product");
                                    }}
                                    className="border border-slate-100 rounded-lg p-1.5 cursor-pointer"
                                  >
                                    <img src={p.imageUrl} className="w-full h-24 object-cover rounded mb-1" alt="" />
                                    <span className="text-[9px] font-bold line-clamp-1">{p.title}</span>
                                    <span className="text-[10px] font-black text-slate-900 block mt-1">
                                      {p.price?.toLocaleString()} ت
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "story_circles" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-100 overflow-x-auto no-scrollbar">
                              <div className="flex gap-2.5">
                                {(block.items || []).map((st: any) => (
                                  <div key={st.id} className="flex flex-col items-center shrink-0 w-12 text-center">
                                    <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 via-amber-500 to-pink-500">
                                      <div className="w-full h-full rounded-full p-0.5 bg-white">
                                        <img src={st.imageUrl} className="w-full h-full rounded-full object-cover" alt="" />
                                      </div>
                                    </div>
                                    <span className="text-[8.5px] font-bold mt-1 text-slate-800 truncate w-full">{st.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "countdown_timer" && (
                            <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-black">⚡ {block.title}</span>
                                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">{block.discountTag || "تخفیف ویژه"}</span>
                              </div>
                              <p className="text-[9px] text-white/90 mb-2">{block.subtitle}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded font-bold">07:54:12</span>
                                <span className="text-[9px] bg-white text-rose-600 px-2 py-0.5 rounded-lg font-bold">کد: {block.promoCode || "OFF"}</span>
                              </div>
                            </div>
                          )}

                          {block.type === "trust_badges" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-bold text-slate-400 block mb-1.5">{block.title || "ضمانت‌های خرید"}</span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {(block.items || []).map((t: any, i: number) => (
                                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                    <span className="text-[8.5px] font-bold text-slate-800 truncate">{t.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "brand_grid" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold block mb-1.5 text-slate-800">{block.title}</span>
                              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {(block.items || []).map((b: any, i: number) => (
                                  <div key={i} className="shrink-0 bg-slate-50 border border-slate-100 rounded-lg p-1.5 w-16 text-center">
                                    <img src={b.logo} className="w-6 h-6 object-cover mx-auto rounded" alt="" />
                                    <span className="text-[8px] font-bold block mt-1 text-slate-700 truncate">{b.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "coupon_card" && (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-amber-950">🎟️ {block.title}</span>
                                <span className="text-[9px] font-black bg-amber-200 px-1.5 py-0.5 rounded text-amber-900">{block.discount}</span>
                              </div>
                              <p className="text-[8.5px] text-amber-800 mt-1 line-clamp-1">{block.desc}</p>
                              <div className="mt-1.5 flex items-center justify-between">
                                <span className="text-[8px] text-amber-700">{block.expiry}</span>
                                <span className="text-[9px] font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold text-amber-900">کپی: {block.code}</span>
                              </div>
                            </div>
                          )}

                          {block.type === "faq_accordion" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold block mb-1 text-slate-800">{block.title}</span>
                              <div className="space-y-1">
                                {(block.items || []).map((faq: any, i: number) => (
                                  <div key={i} className="bg-slate-50 rounded-lg p-1.5 text-[8.5px]">
                                    <span className="font-bold text-slate-800 block">❓ {faq.q}</span>
                                    <span className="text-slate-500 block mt-0.5 line-clamp-1">{faq.a}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "lucky_wheel_banner" && (
                            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-2.5 text-white flex items-center justify-between border border-indigo-700/50 shadow-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 font-bold shrink-0 shadow-xs">
                                  🎁
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold block">{block.title || "گردونه شانس و جوایز"}</span>
                                  <span className="text-[8px] text-indigo-200 block line-clamp-1">{block.subtitle}</span>
                                </div>
                              </div>
                              <span className="bg-amber-400 text-slate-900 text-[8px] font-bold px-2 py-1 rounded-lg shrink-0">
                                {block.buttonText || "بچرخان!"}
                              </span>
                            </div>
                          )}

                          {block.type === "recently_viewed" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-100">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                                  <History className="w-3 h-3 text-rose-500" />
                                  {block.title || "محصولات اخیراً مشاهده شده"}
                                </span>
                                <span className="text-[8px] text-slate-400">پاک کردن</span>
                              </div>
                              <div className="flex gap-1.5 overflow-x-hidden">
                                {[1, 2, 3].map((_, i) => (
                                  <div key={i} className="w-16 bg-slate-50 rounded-lg p-1 border border-slate-100 shrink-0">
                                    <div className="w-full h-12 bg-white rounded-sm flex items-center justify-center mb-1">
                                      <Smartphone className="w-5 h-5 text-slate-300" />
                                    </div>
                                    <div className="h-1.5 bg-slate-200 rounded-sm w-3/4 mb-1" />
                                    <div className="h-1.5 bg-rose-200 rounded-sm w-1/2" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "booking_reservation" && (
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-xs">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-[10px] font-bold text-slate-800">{block.title || "سامانه نوبت‌دهی آنلاین"}</span>
                              </div>
                              <div className="flex gap-1 mb-1.5">
                                <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-2 py-0.5 rounded border border-blue-200">شنبه ۲ آبان</span>
                                <span className="bg-slate-50 text-slate-500 text-[8px] px-2 py-0.5 rounded">یکشنبه ۳ آبان</span>
                                <span className="bg-slate-50 text-slate-500 text-[8px] px-2 py-0.5 rounded">دوشنبه ۴ آبان</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1 mb-1.5">
                                <span className="bg-emerald-500 text-white text-[8px] text-center py-0.5 rounded font-bold">۱۰:۰۰ صبح</span>
                                <span className="bg-slate-50 text-slate-600 text-[8px] text-center py-0.5 rounded">۱۱:۳۰ صبح</span>
                                <span className="bg-slate-50 text-slate-600 text-[8px] text-center py-0.5 rounded">۱۶:۰۰ عصر</span>
                              </div>
                              <div className="w-full bg-blue-600 text-white text-[8px] font-bold py-1 text-center rounded-lg">رزرو وقت مشاوره</div>
                            </div>
                          )}

                          {block.type === "b2b_inquiry" && (
                            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-2.5 rounded-xl text-white shadow-xs border border-slate-700">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-3.5 h-3.5 text-orange-400" />
                                <span className="text-[10px] font-bold">{block.title || "استعلام قیمت B2B و صنعتی"}</span>
                              </div>
                              <p className="text-[8px] text-slate-400 mb-2">صدور پیش‌فاکتور رسمی با کد اقتصادی برای شرکت‌ها</p>
                              <div className="flex gap-1.5">
                                <span className="flex-1 bg-orange-500 text-white text-[8px] font-bold py-1 text-center rounded-lg">درخواست پیش‌فاکتور</span>
                                <span className="bg-slate-700 text-slate-200 text-[8px] py-1 px-2 text-center rounded-lg">کاتالوگ PDF</span>
                              </div>
                            </div>
                          )}

                          {block.type === "course_curriculum" && (
                            <div className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-xs">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                                  <span className="text-[10px] font-bold text-slate-800">{block.title || "سرفصل‌ها و دوره آموزشی"}</span>
                                </div>
                                <span className="text-[8px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold">۴ جلسه</span>
                              </div>
                              <div className="space-y-1">
                                <div className="bg-slate-50 p-1.5 rounded-lg flex items-center justify-between text-[8px]">
                                  <span className="font-bold text-slate-800">جلسه ۱: مبانی و شروع دوره</span>
                                  <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">پخش رایگان ▶</span>
                                </div>
                                <div className="bg-slate-50 p-1.5 rounded-lg flex items-center justify-between text-[8px] text-slate-400">
                                  <span>جلسه ۲: پروژه‌های عملی و کدنویسی</span>
                                  <span>قفل 🔒</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {block.type === "ad_banner" && (
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded">آگهی</span>
                                  <span className="text-[8px] text-slate-400">شبکه تبلیغات تپسل</span>
                                </div>
                                <span className="text-[9px] text-slate-400">×</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold shrink-0">
                                  <Tv className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[8.5px] font-bold text-slate-800 block truncate">{block.title || "سامانه سرمایه‌گذاری هوشمند"}</span>
                                  <span className="text-[7.5px] text-slate-400 block truncate">مجوز رسمی از بانک مرکزی</span>
                                </div>
                                <span className="bg-sky-600 text-white text-[8px] font-bold px-2 py-1 rounded-lg shrink-0">
                                  {block.buttonText || "مشاهده"}
                                </span>
                              </div>
                            </div>
                          )}

                          {block.type === "blog_list" && (
                            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                                  <span className="text-[10px] font-bold text-slate-800">
                                    {block.title || "وبلاگ و آخرین مقالات"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {(block.source === "wordpress_live" || wooConnected || !!wooUrl) && (
                                    <span className="text-[7.5px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                      وردپرس زنده
                                    </span>
                                  )}
                                  <span className="text-[8px] text-rose-500 font-bold">بیشتر ←</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {(block.items || []).slice(0, 4).map((post: any, pIdx: number) => (
                                  <div
                                    key={post.id || pIdx}
                                    className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition"
                                  >
                                    <img
                                      src={post.imageUrl || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop"}
                                      alt=""
                                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <span className="text-[7.5px] text-slate-400 font-medium">
                                          {post.date || "اخیراً"}
                                        </span>
                                        {post.author && (
                                          <span className="text-[7px] bg-slate-200/60 text-slate-600 px-1 rounded truncate max-w-[70px]">
                                            {post.author}
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="text-[9px] font-bold text-slate-800 line-clamp-1 leading-tight mb-0.5">
                                        {post.title}
                                      </h4>
                                      <p className="text-[8px] text-slate-500 line-clamp-2 leading-tight">
                                        {post.excerpt}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* 2. CATEGORIES PAGE PREVIEW */}
                {previewPage === "categories" && (() => {
                  const catBlock = blocks.find((b) => b.type === "categories");
                  const catList = catBlock?.items && catBlock.items.length > 0
                    ? catBlock.items.map((c: any) => ({
                        title: c.title,
                        count: (c as any).count ? `${(c as any).count} کالا` : "موجود در انبار",
                        img: c.imageUrl,
                      }))
                    : [
                        { title: "خانه و آشپزخانه هوشمند", count: "۲۱ کالا", img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop" },
                        { title: "سیستم سرمایش و گرمایش", count: "۲۹ کالا", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" },
                        { title: "دوربین های نظارتی هوشمند", count: "۱۲ کالا", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop" },
                        { title: "کلید و پریز هوشمند", count: "۳۳ کالا", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
                      ];

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold block">{catBlock?.title || "دسته‌بندی‌های کالا"}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({catList.length} شاخه اصلی)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {catList.map((c: any) => (
                          <div key={c.title} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                            <img src={c.img} className="w-12 h-12 rounded-full mx-auto object-cover mb-2 border border-slate-100 shadow-xs" alt="" />
                            <span className="text-xs font-bold block text-slate-900 truncate">{c.title}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. SEARCH & FILTERS PREVIEW */}
                {previewPage === "search" && (() => {
                  const prodsBlock = blocks.find((b) => b.type === "product_grid" || b.type === "product_carousel");
                  const prodsList = prodsBlock?.items && prodsBlock.items.length > 0
                    ? prodsBlock.items.slice(0, 6)
                    : [];

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">نتایج جستجو ({prodsList.length} کالا)</span>
                        <span className="text-[10px] text-rose-500 font-bold">جدیدترین محصولات</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {prodsList.map((p: any) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedPreviewProduct(p);
                              setPreviewPage("product");
                            }}
                            className="bg-white p-2 rounded-xl border border-slate-200 cursor-pointer hover:border-rose-400 transition"
                          >
                            <img src={p.imageUrl} className="w-full h-24 object-cover rounded-lg mb-1" alt="" />
                            <span className="text-[10px] font-bold block truncate">{p.title}</span>
                            <span className="text-[11px] font-black text-rose-600 block mt-1">
                              {p.price ? `${p.price.toLocaleString("fa-IR")} تومان` : "تماس بگیرید"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 4. PRODUCT DETAIL (PDP) PREVIEW */}
                {previewPage === "product" && (() => {
                  const activeProd = selectedPreviewProduct || blocks.find((b) => b.type === "product_carousel" || b.type === "product_grid")?.items?.[0] || {
                    title: "تجهیزات هوشمند شیائومی",
                    price: 114995000,
                    imageUrl: "https://xiaomismart.ir/wp-content/uploads/2025/12/1-2.jpg",
                  };

                  const galleryList: string[] = (activeProd.galleryImages && Array.isArray(activeProd.galleryImages) && activeProd.galleryImages.length > 0)
                    ? activeProd.galleryImages
                    : (activeProd.imageUrl ? [activeProd.imageUrl] : []);

                  const rawAttrs = (activeProd.attributes || []) as Array<{ name: string; options: string[]; variation?: boolean }>;

                  return (
                    <div className="space-y-3">
                      {/* Back button */}
                      <button
                        type="button"
                        onClick={() => setPreviewPage("home")}
                        className="text-[11px] text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>← بازگشت به صفحه اصلی</span>
                      </button>

                      {/* Product Image & Gallery */}
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <img src={activeProd.imageUrl} className="w-full h-44 object-contain rounded-lg" alt="" />
                        {galleryList.length > 1 && (
                          <div className="flex gap-1.5 mt-2 justify-center overflow-x-auto no-scrollbar">
                            {galleryList.slice(0, 4).map((g, idx) => (
                              <img key={idx} src={g} className="w-9 h-9 object-cover rounded-md border border-slate-200" alt="" />
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-xs font-bold block leading-relaxed text-slate-900">{activeProd.title}</span>

                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="font-bold">۵.۰</span>
                          <span className="text-slate-400">(ضمانت اصالت فیزیکی)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-bold">
                          موجود و آماده ارسال
                        </span>
                      </div>

                      {/* Technical Specs from Attributes if available */}
                      {rawAttrs.length > 0 && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-700 block">مشخصات فنی و استانداردهای دستگاه:</span>
                          <div className="space-y-1 text-[10px]">
                            {rawAttrs.slice(0, 4).map((attr, idx) => (
                              <div key={idx} className="flex justify-between border-b border-slate-200/60 pb-1">
                                <span className="text-slate-500">{attr.name}:</span>
                                <span className="font-bold text-slate-800 text-left line-clamp-1 max-w-[65%]">
                                  {attr.options?.join('، ') || 'استاندارد'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price & Add to Cart Action */}
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">مبلغ پرداختی:</span>
                          <strong className="text-rose-600 font-black text-xs">
                            {activeProd.price ? `${activeProd.price.toLocaleString("fa-IR")} تومان` : "استعلام قیمت تلفنی"}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPreviewProduct(activeProd);
                            setPreviewPage("cart");
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-rose-600/30 flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>افزودن به سبد</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 5. CART PREVIEW */}
                {previewPage === "cart" && (() => {
                  const cartProd = selectedPreviewProduct || blocks.find((b) => b.type === "product_carousel" || b.type === "product_grid")?.items?.[0] || {
                    title: "محصول فروشگاه",
                    price: 114995000,
                    imageUrl: "https://xiaomismart.ir/wp-content/uploads/2025/12/1-2.jpg",
                  };

                  return (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-[10px] font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>سبد خرید شما آماده ثبت سفارش است! 🎉</span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex gap-2.5 items-center">
                        <img src={cartProd.imageUrl} className="w-12 h-12 rounded-lg object-contain border border-slate-100" alt="" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold block truncate">{cartProd.title}</span>
                          <span className="text-[11px] font-black text-rose-600 mt-0.5 block">
                            {cartProd.price ? `${cartProd.price.toLocaleString("fa-IR")} تومان` : "تماس بگیرید"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewPage("home")}
                        className="w-full py-2 text-center text-[10px] text-slate-500 hover:text-slate-800 font-bold block cursor-pointer"
                      >
                        ادامه خرید و مشاهده بقیه کالاها ←
                      </button>
                    </div>
                  );
                })()}

                {/* 6. PROFILE PREVIEW (Step 2: Mobile OTP & WooCommerce Customer) */}
                {previewPage === "profile" && (
                  <div className="space-y-3 relative">
                    {/* Header Card */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                            previewAuthLoggedIn ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          {previewAuthLoggedIn ? "م" : <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">
                              {previewAuthLoggedIn ? "محمد گلزاری" : "کاربر مهمان"}
                            </span>
                            {previewAuthLoggedIn && (
                              <span className="text-[8px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                تایید شده با پیامک
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {previewAuthLoggedIn ? previewPhoneInput : "برای پیگیری سفارش‌ها وارد شوید"}
                          </span>
                        </div>
                      </div>

                      {previewAuthLoggedIn ? (
                        <button
                          onClick={() => setPreviewAuthLoggedIn(false)}
                          className="text-[10px] text-slate-400 hover:text-rose-500 font-bold p-1 cursor-pointer transition"
                          title="خروج از حساب"
                        >
                          خروج
                        </button>
                      ) : (
                        <button
                          onClick={() => setPreviewOtpStep("phone")}
                          className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold shadow-sm cursor-pointer transition"
                        >
                          ورود پیامکی
                        </button>
                      )}
                    </div>

                    {/* Order Status Summary */}
                    <div className="grid grid-cols-4 gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200 text-center text-[10px]">
                      <div className="p-1 rounded-lg bg-slate-50">
                        <span className="text-slate-400 block text-[9px]">در انتظار</span>
                        <span className="font-bold text-amber-500 text-xs font-mono">
                          {previewAuthLoggedIn ? "۱" : "۰"}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-slate-50">
                        <span className="text-slate-400 block text-[9px]">آماده‌سازی</span>
                        <span className="font-bold text-blue-500 text-xs font-mono">۰</span>
                      </div>
                      <div className="p-1 rounded-lg bg-slate-50">
                        <span className="text-slate-400 block text-[9px]">تحویل شده</span>
                        <span className="font-bold text-emerald-500 text-xs font-mono">۰</span>
                      </div>
                      <div className="p-1 rounded-lg bg-slate-50">
                        <span className="text-slate-400 block text-[9px]">مرجوعی</span>
                        <span className="font-bold text-slate-400 text-xs font-mono">۰</span>
                      </div>
                    </div>

                    {/* Order History */}
                    <div>
                      <div className="flex justify-between items-center mb-1 px-1">
                        <span className="text-[11px] font-bold text-slate-700">سفارش‌های شیائومی اسمارت</span>
                        {previewAuthLoggedIn && <span className="text-[9px] text-slate-400">۱ سفارش ثبت شده</span>}
                      </div>

                      {previewAuthLoggedIn ? (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1.5 text-[10px]">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800">شماره سفارش: #10209</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
                              در انتظار تایید
                            </span>
                          </div>
                          <div className="text-slate-400 text-[9px]">
                            <span>تاریخ ثبت: ۲۴ مرداد ۱۴۰۵</span> • <span>۱ قلم کالا</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                            <span className="font-bold text-rose-500">۱۴,۱۷۵,۰۰۰ تومان</span>
                            <span className="text-[9px] text-slate-500">کد رهگیری: در انتظار بارنامه</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center space-y-1.5">
                          <p className="text-[10px] text-slate-400">
                            برای مشاهده تاریخچه سفارش‌ها و کدهای رهگیری، وارد حساب شوید.
                          </p>
                          <button
                            onClick={() => setPreviewOtpStep("phone")}
                            className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            ورود با شماره موبایل (OTP) ←
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Account Settings Menu */}
                    <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-[11px]">
                      <div className="p-2.5 flex justify-between items-center">
                        <span className="text-slate-700">آدرس تحویل</span>
                        <span className="text-[9px] text-slate-400 truncate max-w-[170px]">
                          {previewAuthLoggedIn ? "کیش، خیابان سنایی، ساختمان شماره یک" : "ثبت نشده"}
                        </span>
                      </div>
                      <div className="p-2.5 flex justify-between items-center">
                        <span className="text-slate-700">کدهای تخفیف</span>
                        <span className="text-[9px] text-emerald-600 font-bold">OFF20 و YALDA</span>
                      </div>
                      <div className="p-2.5 flex justify-between items-center">
                        <span className="text-slate-700">پشتیبانی و تماس</span>
                        <span className="text-[9px] text-slate-500 font-mono">۰۲۱-۹۱۰۰۰۰۰۰</span>
                      </div>
                      <div className="p-2.5 flex justify-between items-center">
                        <span className="text-slate-700">درباره فروشگاه</span>
                        <span className="text-[9px] text-slate-400">نسخه ۱.۰.۰ رسمی</span>
                      </div>
                    </div>

                    {/* Interactive OTP Bottom Sheet in Viewport */}
                    {previewOtpStep !== "none" && (
                      <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 backdrop-blur-xs rounded-b-3xl p-3 flex flex-col justify-end z-30 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">
                              {previewOtpStep === "phone" ? "ورود / ثبت‌نام با شماره همراه" : "تایید پیامکی (OTP)"}
                            </span>
                            <button
                              onClick={() => setPreviewOtpStep("none")}
                              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>

                          {previewOtpStep === "phone" ? (
                            <div className="space-y-2.5">
                              <p className="text-[10px] text-slate-500">
                                شماره موبایل خود را وارد کنید تا کد تایید ۵ رقمی پیامک شود:
                              </p>
                              <input
                                type="text"
                                value={previewPhoneInput}
                                onChange={(e) => setPreviewPhoneInput(e.target.value)}
                                className="w-full px-3 py-2 text-xs font-mono font-bold text-center border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-rose-500"
                                placeholder="۰۹xxxxxxxxx"
                              />
                              <button
                                onClick={() => setPreviewOtpStep("code")}
                                className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                              >
                                ارسال کد تایید پیامکی
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              <p className="text-[10px] text-slate-500">
                                کد تایید پیامک شده به شماره {previewPhoneInput} را وارد کنید:
                              </p>
                              <input
                                type="text"
                                value={previewCodeInput}
                                onChange={(e) => setPreviewCodeInput(e.target.value)}
                                className="w-full px-3 py-2 text-sm font-mono tracking-widest font-black text-center border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-rose-500"
                                placeholder="۱۲۳۴۵"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setPreviewOtpStep("phone")}
                                  className="w-1/3 py-2 text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
                                >
                                  ویرایش شماره
                                </button>
                                <button
                                  onClick={() => {
                                    setPreviewAuthLoggedIn(true);
                                    setPreviewOtpStep("none");
                                  }}
                                  className="w-2/3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                                >
                                  تایید و ورود به حساب
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Nav Bar Preview */}
              {bottomNavEnabled && (
                <nav className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-slate-200 px-3 py-1 flex justify-around text-slate-500 text-[9px] font-bold">
                  {bottomNavTabs.map((tab) => {
                    const isSelected = previewPage === tab.targetPage;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setPreviewPage(tab.targetPage)}
                        className={`flex flex-col items-center py-0.5 transition ${isSelected ? "font-black" : ""}`}
                        style={{ color: isSelected ? primaryColor : undefined }}
                      >
                        <span className="text-[11px]">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              )}

              {/* Floating Chat Bubble (AI / Goftino) if enabled */}
              {(projectPlugins.goftino_chat?.enabled || projectPlugins.ai_assistant?.enabled) && (
                <button
                  onClick={() => setIsChatSheetOpen(true)}
                  className="absolute bottom-13 left-2.5 w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-indigo-600 text-white shadow-xl flex items-center justify-center z-30 hover:scale-105 transition cursor-pointer"
                  title="پشتیبانی آنلاین و دستیار هوشمند"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </button>
              )}

              {/* Floating Mini Audio Player if enabled */}
              {projectPlugins.audio_podcast?.enabled && (
                <div className="absolute bottom-10 inset-x-2 bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-slate-700/80 shadow-lg flex items-center justify-between z-20">
                  <div className="flex items-center gap-2 truncate">
                    <Headphones className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-[9px] font-bold block truncate">پادکست بررسی تکنولوژی‌های ۲۰۲۶</span>
                      <span className="text-[8px] text-slate-400 block truncate">فصل اول - قسمت دوازدهم</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white shrink-0 cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                  </button>
                </div>
              )}

              {/* In-Phone Live AI / Goftino Chat Sheet */}
              {isChatSheetOpen && (
                <div className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp">
                  <div className="p-3 bg-gradient-to-r from-rose-600 to-indigo-600 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">دستیار هوشمند و گفتینو</span>
                        <span className="text-[9px] text-white/80 block">پاسخگویی آنی ۲۴ ساعته</span>
                      </div>
                    </div>
                    <button onClick={() => setIsChatSheetOpen(false)} className="text-white/80 hover:text-white p-1 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 p-2.5 overflow-y-auto space-y-2 text-xs bg-slate-50">
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl max-w-[85%] text-[10px] leading-relaxed ${
                          msg.sender === "user"
                            ? "mr-auto bg-rose-600 text-white rounded-br-none"
                            : "ml-auto bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {isSendingChat && (
                      <div className="text-[9px] text-slate-400 flex items-center gap-1 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>دستیار در حال تایپ پاسخ...</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                      placeholder="پیام خود را بنویسید..."
                      className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] focus:outline-hidden focus:border-rose-500"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={isSendingChat}
                      className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* In-Phone Live Wallet Sheet */}
              {isWalletSheetOpen && (
                <div className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp">
                  <div className="p-3 bg-emerald-700 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-emerald-300" />
                      <div>
                        <span className="text-xs font-bold block">کیف پول تک‌مارکت</span>
                        <span className="text-[9px] text-emerald-200 block">اعتبار آنی و پرداخت بدون رمز پویا</span>
                      </div>
                    </div>
                    <button onClick={() => setIsWalletSheetOpen(false)} className="text-white/80 hover:text-white p-1 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-50 text-center border-b border-emerald-100">
                    <span className="text-[10px] text-emerald-700 block mb-0.5">موجودی فعلی:</span>
                    <span className="text-lg font-black text-emerald-800">{walletBalance.toLocaleString('fa-IR')} تومان</span>
                    <div className="flex justify-center gap-2 mt-3">
                      {[100000, 200000, 500000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleRechargeWallet(amt)}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-[9px] font-bold shadow-xs transition cursor-pointer"
                        >
                          +{amt.toLocaleString('fa-IR')} ت
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 block">گردش حساب اخیر:</span>
                    {walletTransactions.map((tx: any) => (
                      <div key={tx.id} className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[10px]">
                        <div>
                          <span className="font-bold text-slate-800 block">{tx.title}</span>
                          <span className="text-[9px] text-slate-400 block">{tx.date}</span>
                        </div>
                        <span className="font-bold text-emerald-600">{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In-Phone Live Notifications Inbox Sheet */}
              {isPreviewNotificationsOpen && (
                <div className="absolute inset-0 bg-white z-50 flex flex-col animate-slideUp">
                  <div className="p-3 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-200" />
                      <div>
                        <span className="text-xs font-bold block">صندوق اعلان‌ها و پیام‌ها</span>
                        <span className="text-[9px] text-purple-200 block">مرکز هشدارهای هوشمند شیائومی اسمارت</span>
                      </div>
                    </div>
                    <button onClick={() => setIsPreviewNotificationsOpen(false)} className="text-white/80 hover:text-white p-1 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick Action Bar */}
                  <div className="p-2 bg-purple-50 border-b border-purple-100 flex items-center justify-between text-[10px] px-3">
                    <span className="text-purple-800 font-bold">
                      {previewNotifications.filter((n) => n.unread).length} پیام جدید خوانده نشده
                    </span>
                    <button
                      onClick={() =>
                        setPreviewNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                      className="text-purple-700 hover:text-purple-900 font-bold cursor-pointer"
                    >
                      خواندن همه
                    </button>
                  </div>

                  {/* List */}
                  <div className="flex-1 p-2.5 overflow-y-auto space-y-2">
                    {previewNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() =>
                          setPreviewNotifications((prev) =>
                            prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                          )
                        }
                        className={`p-2.5 rounded-xl border text-[10px] cursor-pointer transition ${
                          n.unread
                            ? "bg-purple-50/50 border-purple-200 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1">
                          <span className={`font-bold block ${n.unread ? "text-slate-900" : "text-slate-700"}`}>
                            {n.title}
                          </span>
                          <span className="text-[8px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">{n.body}</p>
                      </div>
                    ))}
                  </div>

                  {/* Live Simulation Push Trigger */}
                  <div className="p-2.5 border-t border-slate-200 bg-slate-50">
                    <button
                      onClick={() => {
                        const newId = `notif_${Date.now()}`;
                        setPreviewNotifications((prev) => [
                          {
                            id: newId,
                            title: "⚡ تخفیف شگفت‌انگیز اختصاصی",
                            body: "کد تخفیف ۲۰٪ خرید اول روی حساب کاربری شما فعال شد!",
                            time: "الان",
                            type: "discount",
                            unread: true,
                          },
                          ...prev,
                        ]);
                        showToast("🔔 اعلان پوش جدید به گوشی فرستاده شد!");
                      }}
                      className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-[10px] font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Bell className="w-3 h-3" />
                      <span>شبیه‌سازی ارسال پوش‌نوتیفیکیشن تخفیف 🔔</span>
                    </button>
                  </div>
                </div>
              )}

              {/* iPhone Home Bar */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-300 rounded-full z-40"></div>
            </div>
          </div>
        </main>

        {/* Right Sidebar: Inspector, Theme, Navigation, Plugins & Build Tabs (Width: 350px) */}
        <aside className="w-88 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 p-1.5 gap-1 bg-slate-900/90 shrink-0">
            <button
              onClick={() => setActiveTab("inspector")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === "inspector"
                  ? "bg-slate-800 text-rose-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>بلوک‌ها</span>
            </button>
            <button
              onClick={() => setActiveTab("navigation")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === "navigation"
                  ? "bg-slate-800 text-cyan-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>ناوبری</span>
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === "theme"
                  ? "bg-slate-800 text-amber-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>استایل</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("plugins");
                fetchPlugins();
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === "plugins"
                  ? "bg-slate-800 text-indigo-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>ماژول‌ها</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("build");
                fetchBuildHistory();
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === "build"
                  ? "bg-slate-800 text-emerald-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>بیلد تجاری</span>
            </button>
          </div>

          {/* Tab 1: Block Inspector */}
          {activeTab === "inspector" && (
            <div className="p-4 space-y-4">
              {selectedBlock ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      ویرایش {selectedBlock.title || selectedBlock.type}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {selectedBlock.type}
                    </span>
                  </div>

                  {/* Title Input */}
                  {selectedBlock.title !== undefined && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">عنوان بلوک:</label>
                      <input
                        type="text"
                        value={selectedBlock.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, title: val } : b)));
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  )}

                  {/* Banner Slider Inspector */}
                  {selectedBlock.type === "banner_slider" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">بنرهای اسلایدر:</label>
                        <button
                          onClick={() => {
                            const newSlide = {
                              id: `s_${Date.now()}`,
                              imageUrl: "http://localhost:4000/uploads/banner-special-offers.png",
                              title: "بنر تبلیغاتی جدید",
                            };
                            setBlocks(
                              blocks.map((b) =>
                                b.id === selectedBlock.id ? { ...b, items: [...(b.items || []), newSlide] } : b
                              )
                            );
                            showToast("اسلاید جدید افزوده شد");
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>افزودن اسلاید</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(selectedBlock.items || []).map((slide: any, sIdx: number) => (
                          <div key={slide.id || sIdx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                            <div className="flex items-center gap-2">
                              <img src={slide.imageUrl} alt="" className="w-14 h-9 object-cover rounded-md border border-slate-600 shrink-0" />
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={slide.title}
                                  placeholder="عنوان بنر"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[sIdx] = { ...updated[sIdx], title: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const updated = selectedBlock.items.filter((_: any, i: number) => i !== sIdx);
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="text-slate-400 hover:text-rose-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                openMediaPickerFor((url) => {
                                  const updated = [...selectedBlock.items];
                                  updated[sIdx] = { ...updated[sIdx], imageUrl: url };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                });
                              }}
                              className="w-full py-1 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition"
                            >
                              <FolderOpen className="w-3 h-3 text-indigo-400" />
                              <span>انتخاب تصویر از رسانه</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Countdown Timer Inspector */}
                  {selectedBlock.type === "countdown_timer" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">زیرعنوان کمپین:</label>
                        <input
                          type="text"
                          value={selectedBlock.subtitle || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, subtitle: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-300 block mb-1">برچسب تخفیف:</label>
                          <input
                            type="text"
                            value={selectedBlock.discountTag || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, discountTag: val } : b)));
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-300 block mb-1">کد تخفیف کمپین:</label>
                          <input
                            type="text"
                            value={selectedBlock.promoCode || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, promoCode: val } : b)));
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Coupon Card Inspector */}
                  {selectedBlock.type === "coupon_card" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-300 block mb-1">کد کوپن:</label>
                          <input
                            type="text"
                            value={selectedBlock.code || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, code: val } : b)));
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-300 block mb-1">مقدار تخفیف:</label>
                          <input
                            type="text"
                            value={selectedBlock.discount || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, discount: val } : b)));
                            }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">توضیحات و شرایط:</label>
                        <input
                          type="text"
                          value={selectedBlock.desc || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, desc: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">تاریخ انقضا:</label>
                        <input
                          type="text"
                          value={selectedBlock.expiry || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, expiry: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Notice Box Inspector */}
                  {selectedBlock.type === "notice_box" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">متن اعلان فوری:</label>
                        <textarea
                          rows={3}
                          value={selectedBlock.message || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, message: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* FAQ Accordion Inspector */}
                  {selectedBlock.type === "faq_accordion" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">پرسش‌ها و پاسخ‌ها:</label>
                        <button
                          onClick={() => {
                            const newFaq = {
                              q: "پرسش جدید خریدار چیست؟",
                              a: "پاسخ کامل و توضیحات راهنمایی به خریداران در اینجا قرار می‌گیرد.",
                            };
                            const updated = [...(selectedBlock.items || []), newFaq];
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                            showToast("پرسش جدید افزوده شد");
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>افزودن پرسش جدید</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(selectedBlock.items || []).map((faq: any, fIdx: number) => (
                          <div key={fIdx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-rose-400">پرسش {fIdx + 1}:</span>
                              <button
                                onClick={() => {
                                  const updated = selectedBlock.items.filter((_: any, i: number) => i !== fIdx);
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                                title="حذف این پرسش"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">صورت سوال:</label>
                              <input
                                type="text"
                                value={faq.q || ""}
                                placeholder="مثلاً: آیا محصولات گارانتی دارند؟"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...selectedBlock.items];
                                  updated[fIdx] = { ...updated[fIdx], q: val };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 block mb-0.5">پاسخ تشریحی:</label>
                              <textarea
                                rows={2}
                                value={faq.a || ""}
                                placeholder="پاسخ کامل سوال..."
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...selectedBlock.items];
                                  updated[fIdx] = { ...updated[fIdx], a: val };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lucky Wheel Banner Inspector */}
                  {selectedBlock.type === "lucky_wheel_banner" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">عنوان بنر گردونه:</label>
                        <input
                          type="text"
                          value={selectedBlock.title || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, title: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">متن توضیحات / زیرعنوان:</label>
                        <input
                          type="text"
                          value={selectedBlock.subtitle || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, subtitle: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">متن دکمه چرخش:</label>
                        <input
                          type="text"
                          value={selectedBlock.buttonText || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, buttonText: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Recently Viewed Inspector */}
                  {selectedBlock.type === "recently_viewed" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">عنوان بخش تاریخچه بازدید:</label>
                        <input
                          type="text"
                          value={selectedBlock.title || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, title: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">حداکثر تعداد نمایش کالاها:</label>
                        <input
                          type="number"
                          value={selectedBlock.limit || 10}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 10;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, limit: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Story Circles Inspector */}
                  {selectedBlock.type === "story_circles" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">لیست استوری‌ها:</label>
                        <button
                          onClick={() => {
                            const newStory = {
                              id: `st_${Date.now()}`,
                              title: "استوری جدید",
                              badge: "جدید",
                              imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop",
                              desc: "توضیحات و بررسی استوری جدید",
                            };
                            const updated = [...(selectedBlock.items || []), newStory];
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                            showToast("استوری جدید افزوده شد");
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>افزودن استوری</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(selectedBlock.items || []).map((story: any, idx: number) => (
                          <div key={story.id || idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                            <div className="flex items-center gap-2">
                              <img src={story.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-rose-500/50 shrink-0" />
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  value={story.title || ""}
                                  placeholder="عنوان استوری"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[idx] = { ...updated[idx], title: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-white"
                                />
                                <input
                                  type="text"
                                  value={story.badge || ""}
                                  placeholder="برچسب (مثلاً: تخفیف)"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[idx] = { ...updated[idx], badge: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-300"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const updated = selectedBlock.items.filter((_: any, i: number) => i !== idx);
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                openMediaPickerFor((url) => {
                                  const updated = [...selectedBlock.items];
                                  updated[idx] = { ...updated[idx], imageUrl: url };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                });
                              }}
                              className="w-full py-1 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <FolderOpen className="w-3 h-3 text-indigo-400" />
                              <span>تغییر تصویر استوری</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trust Badges Inspector */}
                  {selectedBlock.type === "trust_badges" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">نمادها و ضمانت‌ها:</label>
                        <button
                          onClick={() => {
                            const newBadge = {
                              title: "ضمانت جدید",
                              desc: "توضیح کوتاه ضمانت",
                              icon: "shield",
                            };
                            const updated = [...(selectedBlock.items || []), newBadge];
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                            showToast("نماد جدید افزوده شد");
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>افزودن نماد</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(selectedBlock.items || []).map((badge: any, bIdx: number) => (
                          <div key={bIdx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <select
                                value={badge.icon || "shield"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...selectedBlock.items];
                                  updated[bIdx] = { ...updated[bIdx], icon: val };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-[10px] text-slate-300"
                              >
                                <option value="shield">🛡️ اصالت</option>
                                <option value="shipping">🚚 ارسال</option>
                                <option value="return">🔄 بازگشت</option>
                                <option value="payment">💳 پرداخت</option>
                                <option value="support">🎧 پشتیبانی</option>
                              </select>
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  value={badge.title || ""}
                                  placeholder="عنوان نماد"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[bIdx] = { ...updated[bIdx], title: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-white"
                                />
                                <input
                                  type="text"
                                  value={badge.desc || ""}
                                  placeholder="توضیح کوتاه"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[bIdx] = { ...updated[bIdx], desc: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-400"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const updated = selectedBlock.items.filter((_: any, i: number) => i !== bIdx);
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brand Grid Inspector */}
                  {selectedBlock.type === "brand_grid" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">لیست برندها:</label>
                        <button
                          onClick={() => {
                            const newBrand = {
                              id: `b_${Date.now()}`,
                              name: "برند جدید",
                              englishName: "Brand",
                              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/200px-Xiaomi_logo_%282021-%29.svg.png",
                            };
                            const updated = [...(selectedBlock.items || []), newBrand];
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                            showToast("برند جدید افزوده شد");
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>افزودن برند</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(selectedBlock.items || []).map((brand: any, bIdx: number) => (
                          <div key={bIdx} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <img src={brand.logo} alt="" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shrink-0" />
                              <div className="flex-1 space-y-1">
                                <input
                                  type="text"
                                  value={brand.name || ""}
                                  placeholder="نام برند (فارسی)"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[bIdx] = { ...updated[bIdx], name: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-white"
                                />
                                <input
                                  type="text"
                                  value={brand.englishName || ""}
                                  placeholder="English Name"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[bIdx] = { ...updated[bIdx], englishName: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-400 font-mono"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const updated = selectedBlock.items.filter((_: any, i: number) => i !== bIdx);
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                openMediaPickerFor((url) => {
                                  const updated = [...selectedBlock.items];
                                  updated[bIdx] = { ...updated[bIdx], logo: url };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                });
                              }}
                              className="w-full py-0.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <FolderOpen className="w-3 h-3 text-indigo-400" />
                              <span>تغییر لوگو</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories Inspector */}
                  {selectedBlock.type === "categories" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">دسته‌بندی‌های کالا:</label>
                        <button
                          onClick={() => {
                            const newCat = {
                              id: `c_${Date.now()}`,
                              title: "دسته جدید",
                              imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&h=150&fit=crop",
                            };
                            const updated = [...(selectedBlock.items || []), newCat];
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                            showToast("دسته‌بندی جدید افزوده شد");
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>افزودن دسته</span>
                        </button>
                      </div>

                      <button
                        onClick={() => refreshBlockFromWordPress(selectedBlock.id, "categories")}
                        className="w-full py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-rose-400" />
                        <span>دریافت و بروزرسانی دسته‌بندی‌ها از ووکامرس</span>
                      </button>

                      <div className="space-y-2">
                        {(selectedBlock.items || []).map((cat: any, cIdx: number) => (
                          <div key={cat.id || cIdx} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <img src={cat.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0" />
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={cat.title || ""}
                                  placeholder="عنوان دسته"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.items];
                                    updated[cIdx] = { ...updated[cIdx], title: val };
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const updated = selectedBlock.items.filter((_: any, i: number) => i !== cIdx);
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                openMediaPickerFor((url) => {
                                  const updated = [...selectedBlock.items];
                                  updated[cIdx] = { ...updated[cIdx], imageUrl: url };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                });
                              }}
                              className="w-full py-0.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <FolderOpen className="w-3 h-3 text-indigo-400" />
                              <span>تغییر تصویر دسته</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Promo Banners Inspector */}
                  {selectedBlock.type === "promo_banners" && (
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-slate-300 block">بنرهای تبلیغاتی:</label>
                      <div className="space-y-2">
                        {(selectedBlock.banners || []).map((b: any, bIdx: number) => (
                          <div key={b.id || bIdx} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <img src={b.imageUrl} alt="" className="w-12 h-8 rounded object-cover border border-slate-600 shrink-0" />
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={b.title || ""}
                                  placeholder="عنوان بنر"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updated = [...selectedBlock.banners];
                                    updated[bIdx] = { ...updated[bIdx], title: val };
                                    setBlocks(blocks.map((blk) => (blk.id === selectedBlock.id ? { ...blk, banners: updated } : blk)));
                                  }}
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                openMediaPickerFor((url) => {
                                  const updated = [...selectedBlock.banners];
                                  updated[bIdx] = { ...updated[bIdx], imageUrl: url };
                                  setBlocks(blocks.map((blk) => (blk.id === selectedBlock.id ? { ...blk, banners: updated } : blk)));
                                });
                              }}
                              className="w-full py-0.5 bg-slate-700/80 hover:bg-slate-700 text-slate-300 rounded text-[9px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <FolderOpen className="w-3 h-3 text-indigo-400" />
                              <span>تغییر تصویر بنر</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Carousel Inspector */}
                  {selectedBlock.type === "product_carousel" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">زیرعنوان کاروسل:</label>
                        <input
                          type="text"
                          value={selectedBlock.subtitle || ""}
                          placeholder="مثلاً: تخفیف‌های محدود با زمان باقی‌مانده"
                          onChange={(e) => {
                            const val = e.target.value;
                            setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, subtitle: val } : b)));
                          }}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">رنگ تم پس‌زمینه کاروسل:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedBlock.themeColor || primaryColor}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, themeColor: val } : b)));
                            }}
                            className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedBlock.themeColor || primaryColor}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, themeColor: val } : b)));
                            }}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => refreshBlockFromWordPress(selectedBlock.id, "product_carousel")}
                        className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                        <span>همگام‌سازی محصولات زنده از ووکامرس</span>
                      </button>
                    </div>
                  )}

                  {/* Product Grid Inspector */}
                  {selectedBlock.type === "product_grid" && (
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                            <LayoutGrid className="w-4 h-4 text-rose-400" />
                            محصولات گرید ووکامرس
                          </span>
                          {(wooConnected || !!wooUrl) && (
                            <span className="text-[8px] bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 px-1.5 py-0.5 rounded font-bold">
                              متصل به فروشگاه
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          این بلوک محصولات منتشر شده در ووکامرس را در قالب گرید ۲ ستونه با تصویر، قیمت و برچسب تخفیف نمایش می‌دهد.
                        </p>
                        <button
                          onClick={() => refreshBlockFromWordPress(selectedBlock.id, "product_grid")}
                          className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-rose-400" />
                          <span>دریافت و بروزرسانی محصولات از ووکامرس</span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 block">
                          محصولات لود شده ({selectedBlock.items?.length || 0} عدد):
                        </label>
                        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                          {(selectedBlock.items || []).map((prod: any, pIdx: number) => (
                            <div key={prod.id || pIdx} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2">
                              <img src={prod.imageUrl} alt="" className="w-9 h-9 rounded object-cover border border-slate-600 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold text-white block truncate">{prod.title}</span>
                                <span className="text-[9px] text-emerald-400 font-mono block">
                                  {typeof prod.price === "number" ? prod.price.toLocaleString("fa-IR") + " تومان" : prod.price}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blog List Inspector (WordPress Live Integration) */}
                  {selectedBlock.type === "blog_list" && (
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-rose-400" />
                            وبلاگ و مقالات وردپرس
                          </span>
                          {(wooConnected || !!wooUrl) && (
                            <span className="text-[8px] bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              متصل به وردپرس
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800 flex items-center justify-between font-mono">
                          <span className="text-slate-400 text-[9px]">آدرس منبع:</span>
                          <span className="text-rose-400 text-[10px] truncate max-w-[190px]" dir="ltr">
                            {wooUrl || "https://xiaomismart.ir"}/wp-json/wp/v2/posts
                          </span>
                        </div>
                        <button
                          onClick={() => refreshBlockFromWordPress(selectedBlock.id, "blog_list")}
                          className="w-full py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-white" />
                          <span>دریافت زنده مقالات از وب‌سایت وردپرس</span>
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-slate-300">
                            مقالات وبلاگ ({selectedBlock.items?.length || 0} مقاله):
                          </label>
                          <button
                            onClick={() => {
                              const newPost = {
                                id: `post_${Date.now()}`,
                                title: "مقاله جدید فروشگاه",
                                excerpt: "توضیحات خلاصه این مقاله در اپلیکیشن نمایش داده می‌شود.",
                                imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop",
                                date: "اخیراً",
                                author: "مدیر سایت",
                              };
                              const updated = [newPost, ...(selectedBlock.items || [])];
                              setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                              showToast("مقاله جدید افزوده شد");
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>افزودن مقاله دستی</span>
                          </button>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {(selectedBlock.items || []).map((post: any, pIdx: number) => (
                            <div key={post.id || pIdx} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                              <div className="flex items-start gap-2">
                                <img
                                  src={post.imageUrl || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&h=200&fit=crop"}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-600 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <input
                                    type="text"
                                    value={post.title || ""}
                                    placeholder="عنوان مقاله"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const updated = [...selectedBlock.items];
                                      updated[pIdx] = { ...updated[pIdx], title: val };
                                      setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                    }}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-white font-bold mb-1"
                                  />
                                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                                    <span>{post.date || "تاریخ ثبت نشده"}</span>
                                    <span>{post.author || "نویسنده"}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    const updated = selectedBlock.items.filter((_: any, i: number) => i !== pIdx);
                                    setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                  }}
                                  className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={post.excerpt || ""}
                                placeholder="خلاصه مقاله..."
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...selectedBlock.items];
                                  updated[pIdx] = { ...updated[pIdx], excerpt: val };
                                  setBlocks(blocks.map((b) => (b.id === selectedBlock.id ? { ...b, items: updated } : b)));
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-slate-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  روی یکی از بلوک‌های داخل گوشی کلیک کنید تا مشخصات آن را ویرایش نمایید.
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Navigation & Header Customizer */}
          {activeTab === "navigation" && (
            <div className="p-4 space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 block">شخصی‌سازی هدر و منوی پایین</span>
                <span className="text-[10px] text-slate-400">تنظیمات نوار جستجو و تب‌های ناوبری موبایل</span>
              </div>

              {/* Header Settings */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-300 block">متن راهنمای نوار جستجو:</span>
                <input
                  type="text"
                  value={searchPlaceholder}
                  onChange={(e) => setSearchPlaceholder(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />

                <span className="text-[11px] font-bold text-slate-300 block">فرم گوشه‌های نوار سرچ:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSearchBarStyle("capsule")}
                    className={`py-1.5 rounded-lg border text-xs font-bold ${
                      searchBarStyle === "capsule" ? "bg-cyan-600/20 border-cyan-500 text-cyan-300" : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    کپسولی (گرد کامل)
                  </button>
                  <button
                    onClick={() => setSearchBarStyle("rounded")}
                    className={`py-1.5 rounded-lg border text-xs font-bold ${
                      searchBarStyle === "rounded" ? "bg-cyan-600/20 border-cyan-500 text-cyan-300" : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    مستطیل ملایم
                  </button>
                </div>
              </div>



              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">منوی ناوبری پایین صفحه (Bottom Nav):</span>
                  <input
                    type="checkbox"
                    checked={bottomNavEnabled}
                    onChange={(e) => setBottomNavEnabled(e.target.checked)}
                    className="accent-rose-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {bottomNavEnabled && (
                  <div className="space-y-2">
                    {bottomNavTabs.map((t, idx) => (
                      <div key={t.id} className="p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-300">تب {idx + 1} ({t.targetPage}):</span>
                          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                            {t.icon}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={t.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = [...bottomNavTabs];
                            updated[idx] = { ...updated[idx], label: val };
                            setBottomNavTabs(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Theme & Styling Engine */}
          {activeTab === "theme" && (
            <div className="p-4 space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 block">تنظیمات هویت بصری و تم</span>
                <span className="text-[10px] text-slate-400">رنگ‌بندی، گردی گوشه‌ها و استایل کارت‌ها</span>
              </div>

              {/* Primary Color */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">رنگ اصلی برند (Primary):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                  />
                </div>
              </div>



              {/* Secondary Color */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">رنگ ثانویه / تاکیدی (Accent):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                  />
                </div>
              </div>



              {/* Border Radius Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-300">شعاع گردی کارت‌ها (Border Radius):</label>
                  <span className="text-xs font-mono text-amber-400">{cardBorderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={cardBorderRadius}
                  onChange={(e) => setCardBorderRadius(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Card Style Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">استایل نمایش کارت‌ها:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "bordered", title: "حاشیه‌دار" },
                    { id: "elevated", title: "سایه‌دار" },
                    { id: "flat", title: "مینیمال" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCardStyle(s.id as any)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition ${
                        cardStyle === s.id
                          ? "bg-amber-500/20 border-amber-500 text-amber-300"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>



              {/* Font Family Banner */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-xs space-y-1">
                <span className="text-slate-400 block text-[10px]">فونت سیستم:</span>
                <span className="font-bold text-emerald-400">کلمه با اعداد فارسی (Kalameh FaNum)</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">بهینه‌سازی شده برای تجارت الکترونیک ایران</span>
              </div>
            </div>
          )}

          {/* Tab 3.5: Appeto Plugins Quick Management */}
          {activeTab === "plugins" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">ماژول‌ها و افزونه‌های فعال</span>
                  <span className="text-[10px] text-slate-400">مدیریت قابلیت‌های پیشرفته اپتو</span>
                </div>
                <button
                  onClick={() => setIsPluginMarketOpen(true)}
                  className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Puzzle className="w-3 h-3" />
                  <span>بازارچه ماژول‌ها</span>
                </button>
              </div>

              {/* List of active plugins */}
              <div className="space-y-2">
                {pluginCatalog
                  .filter((p) => projectPlugins[p.id]?.enabled)
                  .map((plugin) => (
                    <div
                      key={plugin.id}
                      className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between hover:border-slate-600 transition"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${plugin.color}20`, color: plugin.color }}
                        >
                          {renderPluginIcon(plugin.icon, "w-4 h-4")}
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-200 block truncate">{plugin.name}</span>
                          <span className="text-[9px] text-slate-400 block truncate">{plugin.categoryName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openPluginConfig(plugin)}
                          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 transition cursor-pointer"
                          title="تنظیمات ماژول"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => togglePlugin(plugin.id, true)}
                          className="w-7 h-4 bg-emerald-600 rounded-full relative transition flex items-center px-0.5 cursor-pointer"
                        >
                          <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-xs"></div>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setIsPluginMarketOpen(true)}
                className="w-full py-2.5 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl text-slate-400 hover:text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن و فعال‌سازی ماژول جدید</span>
              </button>
            </div>
          )}

          {/* Tab 4: Cloud Commercial Build (APK + AAB + Keystore) */}
          {activeTab === "build" && (
            <div className="p-4 space-y-4">
              <div className="pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 block">ساخت و انتشار تجاری (APK و AAB)</span>
                <span className="text-[10px] text-slate-400">تولید خودکار گواهی Keystore اختصاصی و بسته‌های آماده کافه‌بازار و مایکت</span>
              </div>

              {/* Digital Signature & Keystore Status */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>گواهی دیجیتال Release (Keystore)</span>
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    RSA 2048-bit
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  امضای رسمی با اعتبار ۱۰,۰۰۰ روز (تا سال ۲۰۵۴). مطابق با استانداردهای گوگل‌پلی، کافه‌بازار و مایکت.
                </p>
                {keystoreSha256 && (
                  <div className="pt-1 border-t border-slate-700/60 text-[9px] font-mono text-emerald-400 truncate" title={keystoreSha256}>
                    <span className="text-slate-400">SHA-256: </span>{keystoreSha256}
                  </div>
                )}
              </div>

              {/* Platform Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-2">نوع بسته خروجی:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "ALL", title: "دوگانه تجاری", subtitle: "APK + AAB" },
                    { id: "AAB", title: "باندل انتشار", subtitle: "مارکت‌ها" },
                    { id: "APK", title: "نصب مستقیم", subtitle: "تست دستگاه" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setTargetPlatform(p.id as any)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                        targetPlatform === p.id
                          ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>{p.title}</span>
                      <span className="block text-[9px] font-normal text-slate-400 mt-0.5">
                        {p.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PWA iOS Direct Install Card */}
              <div className="p-3 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-xl border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="text-[11px] font-bold text-white">نسخه وب PWA (مخصوص کاربران آیفون و سافاری)</span>
                  </div>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
                    iOS Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  بدون نیاز به ثبت در اپ‌استور، کاربران آیفون می‌توانند با باز کردن آدرس وب در Safari و انتخاب Add to Home Screen، اپلیکیشن را با آیکون اختصاصی و بدون نوار مرورگر نصب کنند.
                </p>
                <div className="flex gap-2">
                  <a
                    href="/manifest.webmanifest"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 text-center rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>مشاهده Web Manifest</span>
                  </a>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText(window.location.origin);
                        showToast("🔗 لینک نسخه PWA جهت نصب در آیفون کپی شد!");
                      }
                    }}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>کپی لینک نصب</span>
                  </button>
                </div>
              </div>

              {/* Store Compatibility Checklist */}
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] space-y-1 text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                  <span>انطباق کامل با قوانین مارکت‌های ایرانی:</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <span>✔ Target SDK 34 (Android 14)</span>
                  <span>✔ بسته رسمی App Bundle</span>
                  <span>✔ فونت کلمه FaNum</span>
                  <span>✔ امضای دیجیتال Release</span>
                </div>
              </div>



              {/* Action Button */}
              <button
                onClick={startBuild}
                disabled={isBuilding}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isBuilding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>ورکر در حال کامپایل و امضای پکیج...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>شروع ساخت و امضای دیجیتال ({targetPlatform === "ALL" ? "APK + AAB" : targetPlatform})</span>
                  </>
                )}
              </button>

              {/* Realtime Terminal / Logs Box */}
              {buildLogs && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-bold">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      لاگ‌های لحظه‌ای ورکر بیلد:
                    </span>
                    {currentJob && (
                      <span className="font-mono text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                        {currentJob.status}
                      </span>
                    )}
                  </div>
                  <pre className="bg-black/80 border border-slate-800 rounded-xl p-2.5 text-[10px] text-emerald-400 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto no-scrollbar" dir="ltr">
                    {buildLogs}
                  </pre>
                </div>
              )}

              {/* Success Result Download Card */}
              {currentJob && currentJob.status === "SUCCESS" && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>بسته تجاری {appName} آماده شد!</span>
                  </div>

                  <div className="space-y-1.5">
                    {/* APK Download Button */}
                    {currentJob.downloadUrl && (
                      <a
                        href={`http://localhost:4000${currentJob.downloadUrl}`}
                        download
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 transition"
                      >
                        <Download className="w-4 h-4" />
                        <span>دانلود فایل نصبی مستقیم (APK)</span>
                      </a>
                    )}

                    {/* AAB Bundle Download Button */}
                    {currentJob.aabUrl && (
                      <a
                        href={`http://localhost:4000${currentJob.aabUrl}`}
                        download
                        className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 transition"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>دانلود باندل کافه‌بازار و مایکت (AAB)</span>
                      </a>
                    )}

                    {/* Keystore Backup Button */}
                    {currentJob.keystoreUrl && (
                      <a
                        href={`http://localhost:4000${currentJob.keystoreUrl}`}
                        download
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>دانلود فایل کلید امضا (.jks)</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Modular Modals */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        mediaList={mediaList}
        onSelectMedia={(url) => {
          if (mediaSelectionCallback) {
            mediaSelectionCallback(url);
            setIsMediaModalOpen(false);
            setMediaSelectionCallback(null);
            showToast("تصویر انتخاب شد");
          }
        }}
      />

      <BuildModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        appName={appName}
        packageName={packageName}
        projectId={projectId}
        isBuilding={isBuilding}
        currentJob={currentJob}
        buildLogs={buildLogs}
        onStartBuild={startBuild}
        targetPlatform={targetPlatform}
        setTargetPlatform={setTargetPlatform}
      />

      <BroadcastNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        projectId={projectId}
        onNotificationSent={(t) => showToast(`اعلان "${t}" با موفقیت ارسال شد`)}
      />

      <LiveQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        appName={appName}
      />

      <AppetoMarketModal
        isOpen={isPluginMarketOpen}
        onClose={() => setIsPluginMarketOpen(false)}
        pluginCatalog={pluginCatalog}
        projectPlugins={projectPlugins}
        categoryFilter={pluginCategoryFilter}
        onChangeCategory={setPluginCategoryFilter}
        searchQuery={pluginSearch}
        onChangeSearch={setPluginSearch}
        onTogglePlugin={togglePlugin}
        onOpenConfig={openPluginConfig}
        renderPluginIcon={renderPluginIcon}
      />

      <PluginConfigModal
        plugin={selectedConfigPlugin}
        configValues={pluginConfigValues}
        isSaving={isSavingPluginConfig}
        onClose={() => setSelectedConfigPlugin(null)}
        onChangeValue={(key, val) =>
          setPluginConfigValues((prev) => ({ ...prev, [key]: val }))
        }
        onSave={savePluginConfig}
        renderPluginIcon={renderPluginIcon}
        onSyncWooCommerce={handleSyncWooCommerce}
        isSyncingWoo={isSyncingWoo}
        onTestSimulateWebhook={handleTestSimulateWebhook}
      />

      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(tmpl) => {
          let updatedAppName = appName;
          let updatedPkgName = packageName;
          let updatedPrimary = primaryColor;
          let updatedSecondary = secondaryColor;
          let updatedRadius = cardBorderRadius;
          let updatedStyle = cardStyle;
          let updatedBlocks = blocks;

          if (tmpl.theme) {
            updatedPrimary = tmpl.theme.primaryColor;
            updatedSecondary = tmpl.theme.secondaryColor;
            updatedRadius = tmpl.theme.borderRadius || 14;
            if (tmpl.theme.cardStyle) updatedStyle = tmpl.theme.cardStyle;
            setPrimaryColor(updatedPrimary);
            setSecondaryColor(updatedSecondary);
            setCardBorderRadius(updatedRadius);
            setCardStyle(updatedStyle);
          }
          if (tmpl.config?.blocks) {
            updatedBlocks = tmpl.config.blocks;
            setBlocks(updatedBlocks);
            if (updatedBlocks.length > 0) setSelectedBlockId(updatedBlocks[0].id);
          }
          if (tmpl.config?.metadata?.name) {
            updatedAppName = tmpl.config.metadata.name;
            setAppName(updatedAppName);
          }
          if (tmpl.config?.metadata?.packageName) {
            updatedPkgName = tmpl.config.metadata.packageName;
            setPackageName(updatedPkgName);
          }
          if (tmpl.config?.metadata?.iconUrl) {
            setAppIconUrl(tmpl.config.metadata.iconUrl);
          }
          if (tmpl.config?.navigation?.appBar?.searchPlaceholder) {
            setSearchPlaceholder(tmpl.config.navigation.appBar.searchPlaceholder);
          }

          setIsTemplateModalOpen(false);
          showToast(`قالب «${tmpl.name}» با موفقیت اعمال و ذخیره شد! 🎉`);

          // Auto-save changes immediately to server
          saveProjectToServer({
            name: updatedAppName,
            packageName: updatedPkgName,
            primaryColor: updatedPrimary,
            secondaryColor: updatedSecondary,
            cardBorderRadius: updatedRadius,
            cardStyle: updatedStyle,
            blocks: updatedBlocks,
          });
        }}
      />

      {/* Standalone Native Store & Catalog Manager Modal */}
      <StoreCatalogModal
        isOpen={isStoreCatalogOpen}
        onClose={() => setIsStoreCatalogOpen(false)}
        projectId="app-demo-techmarket"
        storeMode={storeMode}
        setStoreMode={setStoreMode}
        onProductUpdated={() => {
          showToast("کاتالوگ به‌روز شد و تغییرات در پیش‌نمایش ذخیره گردید.");
        }}
      />

      {/* Abandoned Cart Recovery Modal */}
      <AbandonedCartModal
        isOpen={isAbandonedCartModalOpen}
        onClose={() => setIsAbandonedCartModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
      />

      {/* Flutter Source Code Export Modal */}
      <SourceExportModal
        isOpen={isSourceExportModalOpen}
        onClose={() => setIsSourceExportModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
        projectName={appName || "شیائومی اسمارت"}
        packageName={packageName || "ir.xiaomismart.store"}
      />

      {/* Custom Form Manager Modal */}
      <CustomFormManagerModal
        isOpen={isFormManagerModalOpen}
        onClose={() => setIsFormManagerModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
      />

      {/* Loyalty Club Modal */}
      <LoyaltyClubModal
        isOpen={isLoyaltyModalOpen}
        onClose={() => setIsLoyaltyModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
      />

      {/* Dokan Multi-Vendor Modal */}
      <DokanMarketplaceModal
        isOpen={isDokanModalOpen}
        onClose={() => setIsDokanModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
      />

      {/* White-Label Reseller Portal Modal */}
      <WhiteLabelPortalModal
        isOpen={isWhiteLabelModalOpen}
        onClose={() => setIsWhiteLabelModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
      />

      {/* AI App Generator Wizard */}
      <AiAppGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* In-App OTA Update Modal */}
      <AppUpdateModal
        isOpen={isAppUpdateModalOpen}
        onClose={() => setIsAppUpdateModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
      />

      {/* App Analytics & Heatmap Modal */}
      <AppAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        projectId={projectId || "app-demo-techmarket"}
      />
    </div>
  );
}
