"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { StoryViewerModal } from "@/components/StoryViewerModal";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Smartphone,
  Globe,
  ShoppingCart,
  Home,
  Grid,
  Search,
  User,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  Share2,
  Download,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  Phone,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  Info,
  Filter,
  Layers,
  CreditCard,
  Clock,
  Eye,
  AlertCircle,
  Truck,
  RotateCcw,
  CheckCircle2,
  CheckCircle,
  Sliders,
  Copy,
  QrCode,
  Maximize2,
  Minimize2,
  BookOpen,
  Send,
  Zap,
  Bell,
  Menu,
  Wallet,
  Calendar,
  GraduationCap,
  Tv,
  Gift,
  History,
  Flame,
  FileText,
  LifeBuoy,
  FolderOpen,
} from "lucide-react";

interface ProjectSummary {
  id: string;
  name: string;
  packageName: string;
  updatedAt?: string;
}

function PwaBannerSlider({
  block,
  radiusStyle,
  cardClasses,
  onNavigate,
}: {
  block: any;
  radiusStyle: any;
  cardClasses: string;
  onNavigate: (link?: string, title?: string, openInNewTab?: boolean) => void;
}) {
  const items = block.items || [];
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (items.length <= 1 || block.autoPlay === false) return;
    const intervalTime = (block.interval ? block.interval : 4.5) * 1000;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % items.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [items.length, block.interval, block.autoPlay]);

  if (items.length === 0) return null;
  const currentBanner = items[currentIdx] || items[0] || {};

  return (
    <div style={radiusStyle} className={`${cardClasses} relative group overflow-hidden select-none`}>
      <div
        onClick={() => onNavigate(currentBanner.link, currentBanner.title, currentBanner.openInNewTab)}
        className="relative w-full aspect-[21/9] sm:aspect-[24/9] bg-slate-900 cursor-pointer overflow-hidden"
      >
        {currentBanner.imageUrl ? (
          <img
            src={currentBanner.imageUrl}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            alt={currentBanner.title || "Banner"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
            اسلایدر بنر
          </div>
        )}
        {currentBanner.title && (
          <div className="absolute bottom-2 right-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-lg line-clamp-1 font-bold flex items-center justify-between">
            <span className="truncate">{currentBanner.title}</span>
            {currentBanner.link && (
              <span className="text-[9px] text-rose-300 font-normal shrink-0 flex items-center gap-0.5 mr-2">
                <span>مشاهده</span>
                <ChevronLeft className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
        )}
      </div>

      {items.length > 1 && (
        <>
          <div className="absolute bottom-3 left-3 flex gap-1 z-10">
            {items.map((_: any, i: number) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx(i);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentIdx ? "bg-white w-4" : "bg-white/50 w-1.5"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIdx((prev) => (prev - 1 + items.length) % items.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIdx((prev) => (prev + 1) % items.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

function PwaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryProjectId = searchParams.get("id") || searchParams.get("project");

  // Determine active project ID with smart fallbacks
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    if (queryProjectId && queryProjectId.trim()) {
      return queryProjectId.trim();
    }
    if (typeof window !== "undefined") {
      const storedLast = localStorage.getItem("appmaker_last_active_project_id");
      if (storedLast && storedLast.trim()) {
        return storedLast.trim();
      }
    }
    return "b17015f7-4842-461b-a7bc-f05e00b11a3d"; // Default to Mi Best if none specified
  });

  // Projects List for Switching
  const [allProjects, setAllProjects] = useState<ProjectSummary[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // App & Theme State synchronized with Active Project
  const [appName, setAppName] = useState<string>("در حال بارگذاری پروژه...");
  const [packageName, setPackageName] = useState<string>("");
  const [appIconUrl, setAppIconUrl] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("#ef394e");
  const [secondaryColor, setSecondaryColor] = useState<string>("#008eb9");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(14);
  const [cardStyle, setCardStyle] = useState<"bordered" | "elevated" | "flat">("bordered");
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>("جستجو در بین کالاها...");
  const [searchBarStyle, setSearchBarStyle] = useState<"capsule" | "rounded">("capsule");
  const [bottomNavTabs, setBottomNavTabs] = useState<any[]>([
    { id: "tab_home", label: "خانه", icon: "home", targetPage: "home" },
    { id: "tab_categories", label: "دسته‌ها", icon: "grid", targetPage: "categories" },
    { id: "tab_search", label: "جستجو", icon: "search", targetPage: "search" },
    { id: "tab_cart", label: "سبد خرید", icon: "cart", targetPage: "cart" },
    { id: "tab_profile", label: "پروفایل", icon: "user", targetPage: "profile" },
  ]);

  // Modular Page Blocks (home, categories, search, product, cart, profile)
  const [pageBlocks, setPageBlocks] = useState<Record<string, any[]>>({
    home: [],
    categories: [],
    search: [],
    product: [],
    cart: [],
    profile: [],
  });

  // Navigation & Viewport State
  const initialPageParam = searchParams.get("page") || "home";
  const [activeTab, setActiveTab] = useState<"home" | "categories" | "search" | "product" | "cart" | "profile">(
    (initialPageParam as any) || "home"
  );
  const [desktopFrame, setDesktopFrame] = useState<"phone" | "full">("phone");
  const [lastSyncTime, setLastSyncTime] = useState<string>("همین حالا");

  // Cart & Commerce State
  const [cartItems, setCartItems] = useState<{ product: any; count: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [walletBalance, setWalletBalance] = useState(250000);
  const [activeStoryModal, setActiveStoryModal] = useState<any | null>(null);
  const [faqExpanded, setFaqExpanded] = useState<Record<string, boolean>>({});

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // 1. Fetch List of All Projects in System
  useEffect(() => {
    async function fetchProjectList() {
      try {
        setIsLoadingProjects(true);
        const res = await fetch("http://localhost:4000/api/projects");
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.projects)) {
            setAllProjects(json.projects);
          }
        }
      } catch (e) {
        console.warn("Could not fetch projects list:", e);
      } finally {
        setIsLoadingProjects(false);
      }
    }
    fetchProjectList();
  }, []);

  // Update URL and Active Project when query param changes
  useEffect(() => {
    if (queryProjectId && queryProjectId.trim() && queryProjectId.trim() !== activeProjectId) {
      setActiveProjectId(queryProjectId.trim());
      if (typeof window !== "undefined") {
        localStorage.setItem("appmaker_last_active_project_id", queryProjectId.trim());
      }
    }
  }, [queryProjectId]);

  // Apply Sync Payload to State
  const applySyncData = (data: any) => {
    if (!data) return;
    if (data.name) setAppName(data.name);
    if (data.packageName) setPackageName(data.packageName);
    if (data.primaryColor) setPrimaryColor(data.primaryColor);
    if (data.secondaryColor) setSecondaryColor(data.secondaryColor);
    if (data.cardBorderRadius !== undefined) setCardBorderRadius(data.cardBorderRadius);
    if (data.cardStyle) setCardStyle(data.cardStyle);
    if (data.appIconUrl) setAppIconUrl(data.appIconUrl);
    if (data.searchPlaceholder) setSearchPlaceholder(data.searchPlaceholder);
    if (data.searchBarStyle) setSearchBarStyle(data.searchBarStyle);
    if (data.bottomNavTabs && Array.isArray(data.bottomNavTabs)) setBottomNavTabs(data.bottomNavTabs);

    if (data.pageBlocks && typeof data.pageBlocks === "object") {
      setPageBlocks({
        home: data.pageBlocks.home || data.blocks || [],
        categories: data.pageBlocks.categories || [],
        search: data.pageBlocks.search || [],
        product: data.pageBlocks.product || [],
        cart: data.pageBlocks.cart || [],
        profile: data.pageBlocks.profile || [],
      });
    } else if (data.blocks && Array.isArray(data.blocks)) {
      setPageBlocks({
        home: data.blocks,
        categories: [],
        search: [],
        product: [],
        cart: [],
        profile: [],
      });
    }

    setLastSyncTime(new Date().toLocaleTimeString("fa-IR"));
  };

  // 2. Load Project Data specifically for activeProjectId
  const loadProjectData = async (targetId: string) => {
    try {
      setIsLoadingData(true);

      // Check project-specific local sync first (instant reflection from studio)
      if (typeof window !== "undefined") {
        const localSync = localStorage.getItem(`appmaker_studio_sync_${targetId}`);
        if (localSync) {
          try {
            const parsed = JSON.parse(localSync);
            if (parsed && (parsed.projectId === targetId || !parsed.projectId)) {
              applySyncData(parsed);
            }
          } catch (_) {}
        }
      }

      // Fetch official saved project config from Fastify API
      const res = await fetch(`http://localhost:4000/api/projects/${targetId}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.project) {
          const p = json.project;
          const c = p.config || {};
          applySyncData({
            projectId: p.id,
            name: p.name,
            packageName: p.packageName,
            primaryColor: c.theme?.primaryColor || "#ef394e",
            secondaryColor: c.theme?.secondaryColor || "#008eb9",
            cardBorderRadius: c.theme?.cardBorderRadius ?? 14,
            cardStyle: c.theme?.cardStyle || "bordered",
            appIconUrl: c.metadata?.iconUrl || c.metadata?.splashUrl || "http://localhost:4000/uploads/app-icon-techmarket.png",
            searchPlaceholder: c.navigation?.appBar?.searchPlaceholder || "جستجو در بین کالاها...",
            searchBarStyle: c.navigation?.appBar?.searchBarStyle || "capsule",
            bottomNavTabs: c.navigation?.bottomNav?.tabs,
            pageBlocks: c.pageBlocks || { home: c.blocks || [], categories: [], search: [], product: [], cart: [], profile: [] },
            blocks: c.blocks || [],
          });
        }
      }
    } catch (err) {
      console.warn("Failed to load project in PWA:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Re-load when activeProjectId changes
  useEffect(() => {
    if (activeProjectId) {
      loadProjectData(activeProjectId);
      if (typeof window !== "undefined") {
        localStorage.setItem("appmaker_last_active_project_id", activeProjectId);
      }
    }
  }, [activeProjectId]);

  // Update Document Title
  useEffect(() => {
    if (appName && appName !== "در حال بارگذاری پروژه...") {
      document.title = `${appName} | نسخه وب PWA`;
    }
  }, [appName]);

  // Project Switcher Handler
  const handleProjectSwitch = (newId: string) => {
    if (!newId || newId === activeProjectId) return;
    setActiveProjectId(newId);
    if (typeof window !== "undefined") {
      localStorage.setItem("appmaker_last_active_project_id", newId);
      const url = new URL(window.location.href);
      url.searchParams.set("id", newId);
      window.history.pushState({}, "", url.toString());
    }
    showToast(`🔄 در حال بارگذاری نسخه وب پروژه: ${allProjects.find((p) => p.id === newId)?.name || newId}`);
  };

  // Setup Live Broadcast Channel for cross-tab studio updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("appmaker_studio_sync");
      bc.onmessage = (event) => {
        if (event.data && event.data.data) {
          const msgProjectId = event.data.projectId || event.data.data.projectId;
          // ONLY apply if it matches current active project!
          if (!msgProjectId || msgProjectId === activeProjectId) {
            applySyncData(event.data.data);
            showToast(`⚡ تغییرات استودیو برای «${event.data.data.name || appName}» فوراً همگام شد!`);
          }
        }
      };
    } catch (_) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `appmaker_studio_sync_${activeProjectId}` && e.newValue) {
        try {
          applySyncData(JSON.parse(e.newValue));
        } catch (_) {}
      }
    };
    window.addEventListener("storage", handleStorage);

    // PWA detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, [activeProjectId, appName]);

  // Cart operations & persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`appmaker_pwa_cart_${activeProjectId}`);
      if (saved) setCartItems(JSON.parse(saved));
      else setCartItems([]);
    } catch (_) {}
  }, [activeProjectId]);

  useEffect(() => {
    try {
      if (activeProjectId) {
        localStorage.setItem(`appmaker_pwa_cart_${activeProjectId}`, JSON.stringify(cartItems));
      }
    } catch (_) {}
  }, [cartItems, activeProjectId]);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.product.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prev, { product, count: 1 }];
    });
    showToast(`🛒 «${(product.title || product.name || "کالا").slice(0, 24)}...» به سبد اضافه شد!`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("کالا از سبد حذف شد.");
  };

  const updateCartCount = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const next = item.count + delta;
            return next > 0 ? { ...item, count: next } : null;
          }
          return item;
        })
        .filter(Boolean) as any[]
    );
  };

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, i) => acc + i.count, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, i) => acc + (i.product.price || 0) * i.count, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return Math.round((cartSubtotal * discountPercent) / 100);
  }, [cartSubtotal, discountPercent]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount);
  }, [cartSubtotal, discountAmount]);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "TECH20" || code === "MIBEST" || code === "XIAOMI" || code === "OFF") {
      setDiscountPercent(20);
      showToast("🎉 کد تخفیف ۲۰٪ با موفقیت اعمال شد!");
    } else if (code === "WELCOME") {
      setDiscountPercent(15);
      showToast("🎉 کد تخفیف ۱۵٪ با موفقیت اعمال شد!");
    } else {
      showToast("❌ کد تخفیف نامعتبر است.");
    }
  };

  // PWA Install Prompt
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        showToast("✅ اپلیکیشن با موفقیت روی گوشی شما نصب شد!");
      }
      setDeferredPrompt(null);
    } else {
      setShowIosModal(true);
    }
  };

  // Extract all real products from the active project's blocks
  const allAvailableProducts = useMemo(() => {
    const prods: any[] = [];
    const allBlocks = [
      ...(pageBlocks.home || []),
      ...(pageBlocks.categories || []),
      ...(pageBlocks.search || []),
      ...(pageBlocks.product || []),
      ...(pageBlocks.cart || []),
    ];
    allBlocks.forEach((b) => {
      if ((b.type === "product_carousel" || b.type === "product_grid") && Array.isArray(b.items)) {
        b.items.forEach((p: any) => {
          if (!prods.some((x) => x.id === p.id || x.title === p.title)) {
            prods.push(p);
          }
        });
      }
    });
    return prods;
  }, [pageBlocks]);

  // Extract all categories from the active project's blocks
  const allCategories = useMemo(() => {
    const catBlock =
      pageBlocks.home?.find((b) => b.type === "categories") ||
      pageBlocks.categories?.find((b) => b.type === "categories");
    if (catBlock && Array.isArray(catBlock.items) && catBlock.items.length > 0) {
      return catBlock.items;
    }
    return [];
  }, [pageBlocks]);

  // Filtered products for Search Page
  const filteredSearchProducts = useMemo(() => {
    return allAvailableProducts.filter((p: any) => {
      const matchQuery =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat =
        !selectedCategoryFilter ||
        (p.category && p.category.includes(selectedCategoryFilter));
      return matchQuery && matchCat;
    });
  }, [allAvailableProducts, searchQuery, selectedCategoryFilter]);

  // Active blocks for currently displayed tab
  const activeBlocks = pageBlocks[activeTab] || [];

  // Card container style classes based on studio cardStyle
  const getCardClasses = () => {
    const base = "transition overflow-hidden";
    if (cardStyle === "elevated") return `${base} bg-white shadow-md border-0`;
    if (cardStyle === "bordered") return `${base} bg-white border border-slate-200/90 shadow-2xs`;
    return `${base} bg-white border-0 shadow-none`;
  };

  // Unified Destination Link Handler
  const handleNavigateLink = (link?: string, title?: string, openInNewTab: boolean = true) => {
    if (!link || link.trim() === "") return;
    const trimmed = link.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      if (openInNewTab) {
        window.open(trimmed, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = trimmed;
      }
      return;
    }
    if (trimmed.startsWith("tel:") || trimmed.startsWith("mailto:") || trimmed.startsWith("https://wa.me/")) {
      window.location.href = trimmed;
      return;
    }
    const clean = trimmed.toLowerCase();
    if (clean.includes("categories")) {
      setActiveTab("categories");
    } else if (clean.includes("cart")) {
      setActiveTab("cart");
    } else if (clean.includes("profile")) {
      setActiveTab("profile");
    } else if (clean.includes("search")) {
      const qMatch = trimmed.match(/[?&]q=([^&]+)/);
      if (qMatch) {
        setSearchQuery(decodeURIComponent(qMatch[1]));
      }
      setActiveTab("search");
    } else if (clean.includes("product")) {
      const pMatch = trimmed.match(/product\/([^/?]+)/);
      if (pMatch) {
        const found = allAvailableProducts.find((p: any) => p.id === pMatch[1]);
        if (found) {
          setSelectedProduct(found);
          setActiveTab("product");
          return;
        }
      }
      setActiveTab("search");
    } else {
      showToast(`انتقال به: ${trimmed}`);
    }
  };

  // RENDER SDUI BLOCK ITEM
  const renderStudioBlock = (block: any, index: number) => {
    const radiusStyle = { borderRadius: `${cardBorderRadius}px` };

    // 1. Notice Box
    if (block.type === "notice_box") {
      const isSuccess = block.variant === "success";
      return (
        <div
          key={block.id || index}
          style={radiusStyle}
          className={`p-2.5 text-[11px] font-bold flex items-center justify-between gap-2 shadow-2xs ${
            isSuccess
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-amber-50 text-amber-900 border border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Bell className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="line-clamp-1">{block.message}</span>
          </div>
          {block.link && (
            <button
              onClick={() => handleNavigateLink(block.link, block.buttonText || "مشاهده")}
              className="text-[9.5px] bg-amber-200/80 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded cursor-pointer shrink-0 font-bold transition"
            >
              {block.buttonText || "مشاهده"}
            </button>
          )}
        </div>
      );
    }

    // 2. Banner Slider
    if (block.type === "banner_slider") {
      return (
        <PwaBannerSlider
          key={block.id || index}
          block={block}
          radiusStyle={radiusStyle}
          cardClasses={getCardClasses()}
          onNavigate={handleNavigateLink}
        />
      );
    }

    // 3. Categories Circular / Grid
    if (block.type === "categories") {
      const items = block.items || [];
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">{block.title || "دسته‌بندی‌های کالا"}</span>
            <button
              onClick={() => setActiveTab("categories")}
              className="text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
              style={{ color: primaryColor }}
            >
              <span>مشاهده همه</span>
              <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {items.map((c: any) => (
              <div
                key={c.id || c.title}
                onClick={() => {
                  if (c.link) {
                    handleNavigateLink(c.link, c.title);
                  } else {
                    setSelectedCategoryFilter(c.title);
                    setActiveTab("search");
                  }
                }}
                className="flex flex-col items-center hover:opacity-85 transition cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full p-0.5 border border-slate-200/90 shadow-2xs group-hover:scale-105 transition bg-slate-50 flex items-center justify-center overflow-hidden">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} className="w-full h-full rounded-full object-cover" alt="" />
                  ) : (
                    <span className="text-lg">📁</span>
                  )}
                </div>
                <span className="text-[10px] mt-1.5 font-bold text-slate-800 truncate max-w-[70px] leading-tight">
                  {c.title}
                </span>
                {c.count && (
                  <span className="text-[8.5px] text-slate-400 font-mono mt-0.5">
                    {c.count} کالا
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4. Product Carousel (Special Offers with Timer)
    if (block.type === "product_carousel") {
      const items = block.items || [];
      const themeBg = block.themeColor || primaryColor;
      return (
        <div
          key={block.id || index}
          style={{ ...radiusStyle, backgroundColor: themeBg }}
          className="p-3 text-white shadow-md relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <div>
              <span className="text-xs font-black block leading-tight">{block.title}</span>
              <span className="text-[9.5px] opacity-90 block">{block.subtitle}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>02:14:55</span>
            </div>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
            {items.map((p: any) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setActiveTab("product");
                }}
                className="w-28 shrink-0 bg-white text-slate-900 rounded-xl p-2 shadow-sm cursor-pointer flex flex-col justify-between hover:scale-[1.02] transition"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-50 mb-1.5">
                  <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                  {p.discount && (
                    <span className="absolute top-1 right-1 text-[8px] bg-rose-600 text-white px-1 py-0.2 rounded font-black">
                      {p.discount}٪
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] font-bold line-clamp-2 leading-snug mb-1 text-slate-800">
                  {p.title}
                </span>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-rose-600 font-mono block">
                      {p.price ? `${p.price.toLocaleString("fa-IR")} ت` : "تماس"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="w-5 h-5 rounded-md bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition shadow-2xs"
                    title="افزودن به سبد"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 5. Promo Banners (Dual)
    if (block.type === "promo_banners") {
      const banners = block.banners || [];
      return (
        <div key={block.id || index} className="grid grid-cols-2 gap-2">
          {banners.map((b: any, bIdx: number) => (
            <div
              key={b.id || bIdx}
              style={radiusStyle}
              onClick={() => {
                if (b.link) {
                  handleNavigateLink(b.link, b.title, b.openInNewTab);
                } else {
                  setSelectedCategoryFilter(b.title);
                  setActiveTab("search");
                }
              }}
              className={`${getCardClasses()} relative aspect-[16/10] bg-slate-900 cursor-pointer group`}
            >
              <img
                src={b.imageUrl}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                alt=""
              />
              <span className="absolute bottom-1.5 right-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] p-1 rounded-md font-bold line-clamp-1 text-center flex items-center justify-center gap-1">
                <span>{b.title}</span>
                {b.link && <ChevronLeft className="w-2.5 h-2.5 text-rose-300" />}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // 6. Product Grid (2 columns)
    if (block.type === "product_grid") {
      const items = block.items || [];
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2.5`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">{block.title || "جدیدترین محصولات"}</span>
            <span className="text-[10px] text-slate-400 font-mono">({items.length} کالا)</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {items.map((p: any) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setActiveTab("product");
                }}
                className="border border-slate-200/80 rounded-xl p-2 cursor-pointer hover:border-rose-400 transition flex flex-col justify-between bg-slate-50/50"
              >
                <div>
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white mb-2">
                    <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                    {p.discount && (
                      <span className="absolute top-1.5 right-1.5 text-[8.5px] bg-rose-600 text-white px-1.5 py-0.5 rounded-md font-bold">
                        {p.discount}٪
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold line-clamp-2 leading-snug text-slate-900 mb-1">
                    {p.title}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    {p.regularPrice > p.price && (
                      <span className="text-[9px] text-slate-400 line-through block font-mono">
                        {p.regularPrice.toLocaleString("fa-IR")}
                      </span>
                    )}
                    <span className="text-[11px] font-black text-rose-600 font-mono block">
                      {p.price ? `${p.price.toLocaleString("fa-IR")} تومان` : "تماس"}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="w-7 h-7 rounded-lg text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                    style={{ backgroundColor: primaryColor }}
                    title="افزودن به سبد خرید"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 7. Story Circles
    if (block.type === "story_circles") {
      const items = block.items || [];
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-2.5 overflow-x-auto no-scrollbar`}>
          <div className="flex gap-3">
            {items.map((st: any) => (
              <div
                key={st.id}
                onClick={() => {
                  setActiveStoryModal(st);
                  showToast(`استوری: ${st.title}`);
                }}
                className="flex flex-col items-center shrink-0 w-14 text-center cursor-pointer group"
              >
                <div className="w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 via-amber-500 to-pink-500 group-hover:scale-105 transition">
                  <div className="w-full h-full rounded-full p-0.5 bg-white">
                    <img src={st.imageUrl} className="w-full h-full rounded-full object-cover" alt="" />
                  </div>
                </div>
                <span className="text-[9px] font-bold mt-1 text-slate-800 truncate w-full">{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 8. Countdown Timer Flash Sale
    if (block.type === "countdown_timer") {
      return (
        <div
          key={block.id || index}
          style={radiusStyle}
          className="p-3 bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-sm space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black">⚡ {block.title}</span>
            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              {block.discountTag || "تخفیف شگفت‌انگیز"}
            </span>
          </div>
          <p className="text-[10px] text-white/90">{block.subtitle}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono bg-black/30 px-2 py-0.5 rounded font-bold">07:54:12</span>
            <div className="flex items-center gap-1.5">
              {block.ctaLink && (
                <button
                  onClick={() => handleNavigateLink(block.ctaLink, block.ctaText || "مشاهده پیشنهادها")}
                  className="text-[9px] bg-white/25 hover:bg-white/35 text-white px-2.5 py-1 rounded-lg font-bold cursor-pointer transition flex items-center gap-0.5"
                >
                  <span>{block.ctaText || "مشاهده تخفیف‌ها"}</span>
                  <ChevronLeft className="w-2.5 h-2.5" />
                </button>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(block.promoCode || "OFF");
                  showToast(`کد تخفیف ${block.promoCode || "OFF"} کپی شد!`);
                }}
                className="text-[9px] bg-white text-rose-600 px-2.5 py-1 rounded-lg font-bold cursor-pointer hover:bg-slate-100 transition shadow-2xs"
              >
                کپی کد: {block.promoCode || "OFF"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 9. Trust Badges
    if (block.type === "trust_badges") {
      const items = block.items || [
        { title: "گارانتی معتبر" },
        { title: "ضمانت ۷ روزه بازگشت" },
        { title: "ارسال سریع به سراسر کشور" },
        { title: "تضمین اصالت فیزیکی کالا" },
      ];
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2`}>
          <span className="text-[10px] font-bold text-slate-500 block">{block.title || "ضمانت‌های رسمی"}</span>
          <div className="grid grid-cols-2 gap-2">
            {items.map((t: any, i: number) => (
              <div key={i} className="bg-slate-50 border border-slate-200/70 rounded-xl p-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[9.5px] font-bold text-slate-800 truncate">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 10. Brand Grid
    if (block.type === "brand_grid") {
      const items = block.items || [];
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2`}>
          <span className="text-xs font-bold text-slate-900 block">{block.title || "برندهای معتبر"}</span>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
            {items.map((b: any, i: number) => (
              <div
                key={i}
                onClick={() => {
                  if (b.link) {
                    handleNavigateLink(b.link, b.name);
                  } else {
                    setSearchQuery(b.name);
                    setActiveTab("search");
                  }
                }}
                className="shrink-0 bg-slate-50 border border-slate-200/80 rounded-xl p-2 w-20 text-center cursor-pointer hover:border-rose-400 transition"
              >
                <img src={b.logo} className="w-8 h-8 object-contain mx-auto rounded" alt="" />
                <span className="text-[9px] font-bold block mt-1 text-slate-700 truncate">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 11. Coupon Card
    if (block.type === "coupon_card") {
      return (
        <div
          key={block.id || index}
          style={radiusStyle}
          className="p-3 bg-amber-50 border border-amber-300 text-amber-950 shadow-2xs space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">🎟️ {block.title}</span>
            <span className="text-[9.5px] font-black bg-amber-200 px-2 py-0.5 rounded text-amber-900">
              {block.discount}
            </span>
          </div>
          <p className="text-[9px] text-amber-800 line-clamp-1">{block.desc}</p>
          <div className="pt-1 flex items-center justify-between">
            <span className="text-[8.5px] text-amber-700">{block.expiry}</span>
            <div className="flex items-center gap-1.5">
              {block.ctaLink && (
                <button
                  onClick={() => handleNavigateLink(block.ctaLink, block.ctaText || "خرید با کوپن")}
                  className="text-[9px] bg-amber-200/80 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-0.5"
                >
                  <span>{block.ctaText || "استفاده"}</span>
                  <ChevronLeft className="w-2.5 h-2.5" />
                </button>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(block.code || "OFF");
                  showToast(`کد ${block.code} کپی شد!`);
                }}
                className="text-[9.5px] font-mono bg-white px-2.5 py-1 rounded-md border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 transition cursor-pointer"
              >
                کپی: {block.code}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 12. FAQ Accordion
    if (block.type === "faq_accordion") {
      const items = block.items || [];
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2`}>
          <span className="text-xs font-bold text-slate-900 block">{block.title || "پرسش‌های متداول"}</span>
          <div className="space-y-1.5">
            {items.map((faq: any, i: number) => {
              const isOpen = faqExpanded[i] || false;
              return (
                <div key={i} className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[10px]">
                  <div
                    onClick={() => setFaqExpanded((prev) => ({ ...prev, [i]: !isOpen }))}
                    className="flex items-center justify-between font-bold text-slate-800 cursor-pointer"
                  >
                    <span>❓ {faq.q}</span>
                    <span className="text-slate-400 font-mono">{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {isOpen && <p className="text-slate-600 mt-1.5 pt-1.5 border-t border-slate-200/60 leading-relaxed">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 13. Lucky Wheel Banner
    if (block.type === "lucky_wheel_banner") {
      return (
        <div
          key={block.id || index}
          style={radiusStyle}
          className="bg-gradient-to-r from-indigo-900 to-purple-900 p-3 text-white flex items-center justify-between border border-indigo-700/50 shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-lg shrink-0 shadow-xs animate-bounce">
              🎁
            </div>
            <div>
              <span className="text-xs font-bold block">{block.title || "گردونه شانس و جوایز"}</span>
              <span className="text-[9px] text-indigo-200 block line-clamp-1">{block.subtitle}</span>
            </div>
          </div>
          <button
            onClick={() => showToast("🎉 تبریک! کد تخفیف ۱۰٪ دریافت کردید: LUCKY10")}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-xl shrink-0 transition cursor-pointer shadow-sm"
          >
            {block.buttonText || "بچرخان!"}
          </button>
        </div>
      );
    }

    // 14. Recently Viewed
    if (block.type === "recently_viewed") {
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-rose-600" />
              <span>{block.title || "محصولات اخیراً مشاهده شده"}</span>
            </span>
            <span className="text-[9px] text-slate-400">پاک کردن</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {allAvailableProducts.slice(0, 4).map((p: any) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setActiveTab("product");
                }}
                className="w-20 bg-slate-50 border border-slate-200/80 rounded-xl p-1.5 shrink-0 text-center cursor-pointer hover:border-rose-400 transition"
              >
                <img src={p.imageUrl} className="w-full h-14 object-cover rounded-md mb-1" alt="" />
                <span className="text-[8.5px] font-bold block truncate text-slate-800">{p.title}</span>
                <span className="text-[9px] font-mono text-rose-600 font-black block mt-0.5">
                  {p.price ? `${p.price.toLocaleString("fa-IR")} ت` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 15. Blog List (WordPress)
    if (block.type === "blog_list") {
      const items = block.items || [];
      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-bold text-slate-900">{block.title || "وبلاگ و آخرین مقالات"}</span>
            </div>
            <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              وردپرس زنده
            </span>
          </div>
          <div className="space-y-2">
            {items.map((art: any) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 flex items-center gap-2.5 transition cursor-pointer"
              >
                <img src={art.imageUrl} className="w-14 h-14 rounded-lg object-cover shrink-0" alt="" />
                <div className="truncate flex-1">
                  <h4 className="text-[10.5px] font-bold text-slate-900 line-clamp-2 leading-tight">
                    {art.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[8.5px] text-slate-400 mt-1">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span className="text-rose-600 font-bold">مطالعه کامل ←</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 16. Booking & Reservation Block
    if (block.type === "booking_reservation") {
      const services = block.services || [
        { id: "s1", name: "مشاوره تخصصی آنلاین", price: "۲۵۰,۰۰۰ تومان", duration: "۳۰ دقیقه" },
        { id: "s2", name: "ویزیت و بررسی حضوری", price: "۴۵۰,۰۰۰ تومان", duration: "۴۵ دقیقه" }
      ];

      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2.5 border border-blue-100 shadow-xs`}>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="text-xs font-black text-slate-800">{block.title || "سامانه نوبت‌دهی آنلاین"}</h3>
                <p className="text-[9px] text-slate-400">{block.subtitle || "تعیین وقت مشاوره و خدمات تخصصی"}</p>
              </div>
            </div>
            {block.hours && (
              <span className="text-[8.5px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                {block.hours}
              </span>
            )}
          </div>

          {/* Services Selection */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-bold text-slate-600 block">انتخاب نوع خدمت:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {services.map((srv: any, sIdx: number) => (
                <div
                  key={srv.id || sIdx}
                  onClick={() => showToast(`خدمت "${srv.name}" انتخاب شد`)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 hover:border-blue-400 transition cursor-pointer text-right group"
                >
                  <div className="text-[10px] font-bold text-slate-800 group-hover:text-blue-600 transition truncate">{srv.name}</div>
                  <div className="flex items-center justify-between mt-1 text-[8.5px]">
                    <span className="text-emerald-600 font-bold">{srv.price}</span>
                    <span className="text-slate-400">{srv.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time & Action Button */}
          <div className="flex items-center gap-2 pt-1">
            {block.phone && (
              <a
                href={`tel:${block.phone}`}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold flex items-center gap-1 transition"
              >
                <Phone className="w-3 h-3 text-blue-600" />
                <span>تماس</span>
              </a>
            )}
            <button
              onClick={() => showToast("درخواست رزرو نوبت شما با موفقیت ثبت شد!")}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10.5px] font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              ثبت و نهایی‌سازی رزرو نوبت
            </button>
          </div>
        </div>
      );
    }

    // 17. B2B Inquiry & Industrial Wholesale Block
    if (block.type === "b2b_inquiry") {
      return (
        <div
          key={block.id || index}
          style={radiusStyle}
          className="p-3.5 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-800 text-white shadow-md border border-slate-700/80 space-y-2.5"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black">{block.title || "استعلام قیمت B2B و صنعتی"}</h3>
              <p className="text-[9px] text-slate-300">{block.subtitle || "صدور پیش‌فاکتور رسمی با کد اقتصادی"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => showToast("درخواست پیش‌فاکتور شما ثبت شد. کارشناسان ما به زودی تماس می‌گیرند.")}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-[10px] font-bold shadow-md shadow-orange-500/20 transition cursor-pointer text-center"
            >
              {block.inquiryButtonText || "درخواست پیش‌فاکتور رسمی"}
            </button>

            {block.catalogUrl ? (
              <a
                href={block.catalogUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl text-[10px] font-bold transition flex items-center gap-1"
              >
                <Download className="w-3 h-3 text-orange-400" />
                <span>{block.catalogButtonText || "کاتالوگ PDF"}</span>
              </a>
            ) : (
              block.phone && (
                <a
                  href={`tel:${block.phone}`}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl text-[10px] font-bold transition flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-orange-400" />
                  <span>واحد فروش</span>
                </a>
              )
            )}
          </div>
        </div>
      );
    }

    // 18. Course Curriculum & LMS Block
    if (block.type === "course_curriculum") {
      const lessons = block.lessons || [
        { id: "l1", title: "جلسه ۱: مبانی و آشنایی مقدماتی", duration: "۲۰ دقیقه", isFreePreview: true },
        { id: "l2", title: "جلسه ۲: نصب و راه‌اندازی محیط کار", duration: "۳۵ دقیقه", isFreePreview: false }
      ];

      return (
        <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 space-y-2.5 border border-purple-100 shadow-xs`}>
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800">{block.title || "سرفصل‌ها و دوره آموزشی"}</h3>
                <p className="text-[9px] text-slate-400">{block.subtitle || "سرفصل‌های کاربردی و پروژه‌محور"}</p>
              </div>
            </div>
            {block.instructor && (
              <span className="text-[8.5px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                {block.instructor}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {lessons.map((ls: any, lIdx: number) => (
              <div
                key={ls.id || lIdx}
                onClick={() => {
                  if (ls.isFreePreview) {
                    showToast(`در حال پخش پیش‌نمایش رایگان: ${ls.title}`);
                  } else {
                    showToast(`جهت دسترسی به "${ls.title}" باید در دوره ثبت‌نام کنید.`);
                  }
                }}
                className={`p-2 rounded-xl flex items-center justify-between transition cursor-pointer border ${
                  ls.isFreePreview
                    ? "bg-purple-50/40 hover:bg-purple-50 border-purple-200"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                    {(lIdx + 1).toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-800">{ls.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[8.5px] text-slate-400">{ls.duration}</span>
                  {ls.isFreePreview ? (
                    <span className="text-[8.5px] bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold px-1.5 py-0.5 rounded">
                      پیش‌نمایش رایگان ▶
                    </span>
                  ) : (
                    <span className="text-[8.5px] text-slate-400 font-bold">🔒 قفل</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Fallback block
    return (
      <div key={block.id || index} style={radiusStyle} className={`${getCardClasses()} p-3 text-xs text-slate-700`}>
        <div className="font-bold mb-1">{block.title || block.type}</div>
        <div className="text-[10px] text-slate-400">{block.subtitle || block.desc || "بلوک اختصاصی پروژه"}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none" dir="rtl">
      {/* Top Banner on Desktop */}
      <header className="hidden lg:flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-xs z-30">
        <div className="flex items-center gap-3">
          {appIconUrl ? (
            <img src={appIconUrl} className="w-8 h-8 rounded-xl object-cover border border-slate-700 shadow-md" alt="" />
          ) : (
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              AM
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-sm">{appName}</h1>
              {packageName && (
                <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-md" dir="ltr">
                  {packageName}
                </span>
              )}
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>همگام با استودیو ({lastSyncTime})</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              نسخه وب مستقل (PWA) اختصاصی این پروژه با همگام‌سازی بلادرنگ
            </p>
          </div>
        </div>

        {/* Desktop Controls & Project Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Project Switcher Dropdown */}
          {allProjects.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-xl">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-slate-400">پروژه:</span>
              <select
                value={activeProjectId}
                onChange={(e) => handleProjectSwitch(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                {allProjects.map((proj) => (
                  <option key={proj.id} value={proj.id} className="bg-slate-900 text-white">
                    {proj.name} ({proj.packageName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh From Studio Button */}
          <button
            onClick={() => {
              loadProjectData(activeProjectId);
              showToast("🔄 اطلاعات این پروژه از سرور و استودیو مجدداً بارگذاری شد!");
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="همگام‌سازی مجدد با استودیو"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>همگام‌سازی</span>
          </button>

          {/* Toggle Device Frame */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setDesktopFrame("phone")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                desktopFrame === "phone" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>قاب آیفون</span>
            </button>
            <button
              onClick={() => setDesktopFrame("full")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                desktopFrame === "full" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>صفحه عریض وب</span>
            </button>
          </div>

          {/* Copy Web Link */}
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                const fullUrl = `${window.location.origin}/pwa?id=${activeProjectId}`;
                navigator.clipboard.writeText(fullUrl);
                showToast(`🔗 لینک نسخه وب اختصاصی «${appName}» کپی شد!`);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>کپی لینک</span>
          </button>

          {/* Install Button */}
          <button
            onClick={handleInstallClick}
            className="px-4 py-1.5 rounded-xl text-white font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>نصب PWA</span>
          </button>

          {/* Back to Studio with specific project */}
          <Link
            href={`/builder?project=${activeProjectId}`}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 font-bold flex items-center gap-1 transition"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>استودیو</span>
          </Link>
        </div>
      </header>

      {/* Main App Container */}
      <main className="flex-1 flex items-center justify-center p-0 lg:p-6 overflow-hidden">
        {/* Mobile Phone Mockup or Responsive Full Frame */}
        <div
          className={`w-full transition-all duration-300 flex flex-col ${
            desktopFrame === "phone"
              ? "max-w-[420px] h-[100dvh] lg:h-[860px] lg:rounded-[44px] lg:border-[6px] lg:border-slate-800 lg:shadow-2xl lg:shadow-indigo-950/50 relative overflow-hidden bg-[#f8f9fa] text-slate-800"
              : "max-w-4xl h-[100dvh] lg:h-[90vh] lg:rounded-3xl lg:border border-slate-800 bg-[#f8f9fa] text-slate-800 overflow-hidden relative"
          }`}
        >
          {/* Simulated Mobile Status Bar */}
          <div className="w-full bg-slate-900/90 backdrop-blur-md px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] text-slate-300 z-30 shrink-0 select-none">
            <span className="font-bold text-white">14:30</span>
            {/* Dynamic Island Notch */}
            <div className="w-22 h-4 bg-black rounded-full flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-slate-400 font-mono">PWA</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* STUDIO HEADER: Exact match with builder canvas */}
          <div
            style={{ backgroundColor: primaryColor }}
            className="pt-3 px-3.5 pb-2.5 flex flex-col text-white shrink-0 shadow-sm z-20"
          >
            <div className="h-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 cursor-pointer" />
                <div className="flex items-center gap-1.5">
                  {appIconUrl ? (
                    <img
                      src={appIconUrl}
                      className="w-5.5 h-5.5 rounded-md object-cover border border-white/40 shadow-2xs"
                      alt="Logo"
                    />
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-md bg-white/20 flex items-center justify-center font-bold text-[10px]">
                      {appName.slice(0, 1)}
                    </div>
                  )}
                  <span className="text-xs font-black tracking-wide truncate max-w-[170px]">{appName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Active Wallet Badge */}
                <div
                  onClick={() => showToast(`موجودی کیف پول: ${walletBalance.toLocaleString("fa-IR")} تومان`)}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[9px] font-bold cursor-pointer transition shadow-2xs"
                  title="کیف پول"
                >
                  <Wallet className="w-3 h-3 text-emerald-300" />
                  <span>{walletBalance.toLocaleString("fa-IR")} ت</span>
                </div>

                <Search
                  className="w-4 h-4 cursor-pointer hover:opacity-80 transition"
                  onClick={() => setActiveTab("search")}
                />

                <div
                  className="relative cursor-pointer hover:opacity-80 transition"
                  onClick={() => showToast("پیام جدید: تخفیف ۲۰٪ ویژه فعال شد!")}
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-1 ring-white animate-pulse" />
                </div>

                <div
                  className="relative cursor-pointer hover:opacity-80 transition"
                  onClick={() => setActiveTab("cart")}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-white text-rose-600 text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-xs">
                      {totalCartCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* In-Header Search Bar */}
            <div
              onClick={() => setActiveTab("search")}
              className={`mt-1.5 h-8 bg-white/95 text-slate-500 px-3 flex items-center justify-between cursor-pointer transition shadow-2xs ${
                searchBarStyle === "capsule" ? "rounded-full" : "rounded-lg"
              }`}
            >
              <div className="flex items-center gap-2 flex-1 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[10px] truncate text-slate-600">{searchPlaceholder}</span>
              </div>
              <QrCode
                onClick={(e) => {
                  e.stopPropagation();
                  showToast("📷 دوربین جهت اسکن بارکد کالا فعال است.");
                }}
                className="w-3.5 h-3.5 text-rose-600 shrink-0 hover:scale-110 transition"
              />
            </div>
          </div>

          {/* Scrollable Viewport Content */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-3 no-scrollbar pb-18 bg-[#f8f9fa] text-slate-800">
            {isLoadingData ? (
              <div className="py-20 text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mx-auto" />
                <span className="text-xs text-slate-500 font-bold block">در حال بارگذاری اطلاعات پروژه...</span>
              </div>
            ) : (
              <>
                {/* 1. HOME TAB */}
                {activeTab === "home" && (
                  <div className="space-y-3 animate-fadeIn">
                    {activeBlocks.map((block, index) => renderStudioBlock(block, index))}
                    {activeBlocks.length === 0 && (
                      <div className="py-16 text-center text-slate-400 text-xs space-y-1">
                        <span className="font-bold block">هنوز بلوکی در صفحه اصلی چیده نشده است.</span>
                        <span className="text-[10px] text-slate-400 block">در استودیو بلوک‌های دلخواه را اضافه کنید.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CATEGORIES TAB */}
                {activeTab === "categories" && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Custom Blocks for Categories */}
                    {activeBlocks.map((block, index) => renderStudioBlock(block, index))}

                    {/* Categories Grid */}
                    {allCategories.length > 0 && (
                      <div style={{ borderRadius: `${cardBorderRadius}px` }} className={`${getCardClasses()} p-3 space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">دسته‌بندی‌های کالا</span>
                          <span className="text-[10px] text-slate-400 font-mono">({allCategories.length} شاخه اصلی)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {allCategories.map((c: any) => (
                            <div
                              key={c.id || c.title}
                              onClick={() => {
                                setSelectedCategoryFilter(c.title);
                                setActiveTab("search");
                              }}
                              className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 text-center shadow-2xs cursor-pointer hover:border-rose-400 transition group"
                            >
                              {c.imageUrl ? (
                                <img
                                  src={c.imageUrl}
                                  className="w-14 h-14 rounded-full mx-auto object-cover mb-2 border border-slate-200 shadow-2xs group-hover:scale-105 transition"
                                  alt=""
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-full mx-auto bg-slate-200 flex items-center justify-center text-xl mb-2">
                                  📁
                                </div>
                              )}
                              <span className="text-xs font-bold block text-slate-900 truncate">{c.title}</span>
                              <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                                {c.count ? `${c.count} کالا` : "موجود در انبار"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SEARCH TAB */}
                {activeTab === "search" && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Active Custom Blocks for Search */}
                    {activeBlocks.map((block, index) => renderStudioBlock(block, index))}

                    {/* Search Input Box */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="جستجوی نام کالا یا دسته‌بندی..."
                        className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-9 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-2xs"
                        autoFocus
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="absolute left-3 top-3 text-slate-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Selected Category Pill */}
                    {selectedCategoryFilter && (
                      <div className="flex items-center justify-between bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs text-rose-700 font-bold">
                        <span>فیلتر شاخه: {selectedCategoryFilter}</span>
                        <button
                          onClick={() => setSelectedCategoryFilter(null)}
                          className="text-rose-500 hover:text-rose-700 text-[10px]"
                        >
                          حذف فیلتر ×
                        </button>
                      </div>
                    )}

                    {/* Results Header */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>نتایج ({filteredSearchProducts.length} کالا)</span>
                      <span className="text-[10px] text-rose-600">جدیدترین محصولات</span>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {filteredSearchProducts.map((p: any) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setActiveTab("product");
                          }}
                          className="bg-white p-2.5 rounded-xl border border-slate-200/80 cursor-pointer hover:border-rose-400 transition flex flex-col justify-between shadow-2xs"
                        >
                          <div>
                            <img src={p.imageUrl} className="w-full h-24 object-cover rounded-lg mb-1.5" alt="" />
                            <span className="text-[10px] font-bold block truncate text-slate-900">{p.title}</span>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-1">
                            <span className="text-[11px] font-black text-rose-600 font-mono">
                              {p.price ? `${p.price.toLocaleString("fa-IR")} ت` : "تماس"}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(p);
                              }}
                              className="w-6 h-6 rounded-md text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PRODUCT DETAIL (PDP) */}
                {activeTab === "product" && (() => {
                  const activeProd = selectedProduct || allAvailableProducts[0] || {
                    title: appName,
                    price: 0,
                    imageUrl: appIconUrl,
                  };

                  return (
                    <div className="space-y-3 animate-fadeIn">
                      {/* Back button */}
                      <button
                        onClick={() => setActiveTab("home")}
                        className="text-[11px] text-slate-600 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>← بازگشت به صفحه اصلی</span>
                      </button>

                      {/* Product Image */}
                      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
                        <img src={activeProd.imageUrl} className="w-full h-48 object-contain rounded-lg" alt="" />
                      </div>

                      {/* Title & Ratings */}
                      <div style={{ borderRadius: `${cardBorderRadius}px` }} className={`${getCardClasses()} p-3 space-y-2`}>
                        <span className="text-xs font-black block leading-relaxed text-slate-900">
                          {activeProd.title}
                        </span>
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span>۵.۰ (تضمین کیفیت و اصالت)</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-bold">
                            موجود و آماده ارسال فوری
                          </span>
                        </div>
                      </div>

                      {/* Price & Add to Cart Card */}
                      <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                        <div>
                          <span className="text-[10px] text-slate-400 block">مبلغ پرداختی:</span>
                          <strong className="text-rose-600 font-black text-sm font-mono">
                            {activeProd.price ? `${activeProd.price.toLocaleString("fa-IR")} تومان` : "تماس بگیرید"}
                          </strong>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(activeProd);
                            setActiveTab("cart");
                          }}
                          className="px-4 py-2 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>افزودن به سبد</span>
                        </button>
                      </div>

                      {/* Custom Blocks for Product PDP */}
                      {activeBlocks.map((block, index) => renderStudioBlock(block, index))}
                    </div>
                  );
                })()}

                {/* 5. CART TAB */}
                {activeTab === "cart" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>سبد خرید شما آماده ثبت سفارش است! 🎉</span>
                    </div>

                    {cartItems.length > 0 ? (
                      <div className="space-y-3">
                        {cartItems.map(({ product, count }) => (
                          <div
                            key={product.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <img src={product.imageUrl} className="w-14 h-14 rounded-lg object-contain border border-slate-100" alt="" />
                            <div className="flex-1 truncate">
                              <h4 className="text-[11px] font-bold text-slate-900 truncate">{product.title}</h4>
                              <span className="text-[11px] text-rose-600 font-mono font-bold mt-1 block">
                                {((product.price || 0) * count).toLocaleString("fa-IR")} تومان
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                              <button onClick={() => updateCartCount(product.id, 1)} className="text-slate-600 hover:text-black">
                                <Plus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-slate-900 font-mono px-1">{count}</span>
                              <button onClick={() => updateCartCount(product.id, -1)} className="text-slate-600 hover:text-black">
                                <Minus className="w-3 h-3" />
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(product.id)} className="text-slate-400 hover:text-rose-600 p-1">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Coupon Box */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                          <span className="text-xs font-bold text-slate-700 block">کد تخفیف:</span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              placeholder="مثلاً MIBEST یا TECH20"
                              dir="ltr"
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                            />
                            <button
                              onClick={handleApplyCoupon}
                              className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                            >
                              اعمال
                            </button>
                          </div>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>جمع کل کالاها:</span>
                            <span className="font-mono font-bold">{cartSubtotal.toLocaleString("fa-IR")} ت</span>
                          </div>
                          {discountAmount > 0 && (
                            <div className="flex justify-between text-rose-600 font-bold">
                              <span>تخفیف:</span>
                              <span className="font-mono">- {discountAmount.toLocaleString("fa-IR")} ت</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-600">
                            <span>هزینه ارسال:</span>
                            <span className="text-emerald-600 font-bold">رایگان</span>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                            <span>مبلغ قابل پرداخت:</span>
                            <span className="font-mono text-rose-600">{finalTotal.toLocaleString("fa-IR")} تومان</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setCheckoutSuccess(true);
                            setCartItems([]);
                          }}
                          className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>تکمیل سفارش و پرداخت آنلاین</span>
                        </button>
                      </div>
                    ) : (
                      <div className="py-12 text-center space-y-2">
                        <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
                        <span className="text-xs font-bold text-slate-600 block">سبد خرید شما خالی است</span>
                        <button
                          onClick={() => setActiveTab("home")}
                          className="mt-2 py-1.5 px-4 text-xs font-bold text-white rounded-xl"
                          style={{ backgroundColor: primaryColor }}
                        >
                          مشاهده محصولات
                        </button>
                      </div>
                    )}

                    {/* Custom Blocks for Cart */}
                    {activeBlocks.map((block, index) => renderStudioBlock(block, index))}
                  </div>
                )}

                {/* 6. PROFILE TAB */}
                {activeTab === "profile" && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Profile Header */}
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base shadow-sm"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900">کاربر گرامی {appName}</h3>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5" dir="ltr">
                            0912 ••• ••80
                          </span>
                          <span className="inline-block mt-1 bg-amber-50 text-amber-700 border border-amber-200 text-[8.5px] px-2 py-0.2 rounded-full font-bold">
                            باشگاه مشتریان طلایی
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">سفارش‌ها</span>
                        <strong className="text-slate-900 font-mono mt-0.5 block">۳ عدد</strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">کیف پول</span>
                        <strong className="text-emerald-600 font-mono mt-0.5 block font-bold">
                          ۲۵۰,۰۰۰ ت
                        </strong>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">امتیاز کلوپ</span>
                        <strong className="text-amber-600 font-mono mt-0.5 block font-bold">
                          ۴۸۰
                        </strong>
                      </div>
                    </div>

                    {/* Profile Links */}
                    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs shadow-2xs">
                      {[
                        { title: "سفارش‌های من و پیگیری مرسوله", icon: Truck },
                        { title: "آدرس‌های منتخب برای تحویل", icon: Grid },
                        { title: "کارت‌های هدیه و بن‌های تخفیف", icon: Tag },
                        { title: "پیام‌ها و اطلاعیه‌ها", icon: Bell },
                        { title: "پشتیبانی آنلاین و چت ۲۴ ساعته", icon: Phone },
                        { title: "درباره فروشگاه و قوانین ضمانت", icon: ShieldCheck },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={idx}
                            onClick={() => showToast(`بخش «${item.title}»`)}
                            className="w-full p-3 flex items-center justify-between text-slate-700 hover:text-black hover:bg-slate-50 transition cursor-pointer text-right"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-slate-400" />
                              <span className="text-xs font-medium">{item.title}</span>
                            </div>
                            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Blocks for Profile */}
                    {activeBlocks.map((block, index) => renderStudioBlock(block, index))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* STUDIO BOTTOM NAV: Exact match with builder canvas */}
          <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1 flex justify-around text-slate-500 text-[9px] font-bold z-30 select-none shadow-sm">
            {bottomNavTabs.map((tab: any) => {
              const isSelected = activeTab === tab.targetPage;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.targetPage)}
                  className={`flex flex-col items-center py-0.5 transition cursor-pointer ${
                    isSelected ? "font-black" : "text-slate-400 hover:text-slate-600"
                  }`}
                  style={{ color: isSelected ? primaryColor : undefined }}
                >
                  <span className="text-[11px] leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </main>

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-lg p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-rose-600">مجله و وبلاگ رسمی</span>
              <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={selectedArticle.imageUrl} className="w-full h-44 object-cover rounded-xl" alt="" />
            <h3 className="text-sm font-black text-slate-900 leading-snug">{selectedArticle.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
              {selectedArticle.content || selectedArticle.excerpt}
            </p>
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Installation Guide Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 text-center border border-slate-700">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold">راهنمای نصب وب‌اپلیکیشن در آیفون (Safari)</h3>
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-right space-y-2 text-xs text-slate-300">
              <div>۱. دکمه اشتراک‌گذاری (Share) در پایین سافاری را لمس کنید.</div>
              <div>۲. گزینه «Add to Home Screen» (افزودن به صفحه اصلی) را انتخاب کنید.</div>
              <div>۳. در بالا سمت راست «Add» را بزنید تا آیکون روی صفحه ظاهر شود.</div>
            </div>
            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-base font-black">سفارش تستی شما ثبت شد! 🎉</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              شماره پیگیری: <span className="font-mono text-emerald-600 font-bold">MB-8821</span>
              <br />
              درگاه شتابی زرین‌پال / سامان آماده اتصال نهایی است.
            </p>
            <button
              onClick={() => {
                setCheckoutSuccess(false);
                setActiveTab("home");
              }}
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      <StoryViewerModal
        isOpen={!!activeStoryModal}
        onClose={() => setActiveStoryModal(null)}
        story={activeStoryModal}
        allStories={(pageBlocks.home || []).find((b: any) => b.type === "story_circles")?.items || []}
        onSelectStory={(st) => setActiveStoryModal(st)}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-slate-700 text-white px-4 py-2 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md animate-slideDown">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function PwaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-xs">
          در حال بارگذاری نسخه وب PWA...
        </div>
      }
    >
      <PwaContent />
    </Suspense>
  );
}
