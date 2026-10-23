"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Package,
  ShoppingBag,
  Tags,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Truck,
  Clock,
  Check,
  RefreshCw,
  Sliders,
  DollarSign,
  Layers,
  Phone,
  MapPin,
  Flame,
  Star,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  discount_percent?: number;
  stock_quantity: number;
  stock_status: string;
  featured: boolean;
  is_special_offer: boolean;
  description: string;
  short_description?: string;
  images: { id: number; src: string }[];
  categories: { id: string; name: string }[];
}

interface OrderItem {
  id: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingCode?: string;
  createdAt: string;
  items: OrderItem[];
}

interface StoreOverview {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  outOfStockCount: number;
  totalRevenue: number;
}

interface StoreCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  storeMode: "standalone" | "woocommerce";
  setStoreMode: (mode: "standalone" | "woocommerce") => void;
  onProductUpdated?: () => void;
}

export function StoreCatalogModal({
  isOpen,
  onClose,
  projectId = "app-demo-techmarket",
  storeMode,
  setStoreMode,
  onProductUpdated,
}: StoreCatalogModalProps) {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders" | "settings">("products");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [overview, setOverview] = useState<StoreOverview | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modals for editing/creating
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOverview = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/overview`);
      const data = await res.json();
      if (data.success) {
        setOverview(data.overview);
      }
    } catch (e) {
      console.error("Overview error", e);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/products`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (e) {
      console.error("Fetch products error", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error("Fetch categories error", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/orders`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Fetch orders error", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOverview();
      fetchProducts();
      fetchCategories();
      fetchOrders();
    }
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  // Handle Seeding Demo
  const handleSeedDemo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/seed-demo`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        showToast("فروشگاه با محصولات نمونه شیائومی مقداردهی شد!");
        fetchProducts();
        fetchCategories();
        fetchOverview();
        onProductUpdated?.();
      }
    } catch (e) {
      showToast("خطا در ایجاد محصولات نمونه");
    } finally {
      setLoading(false);
    }
  };

  // Handle Save Product (Create / Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      showToast("لطفاً نام و قیمت محصول را وارد کنید.");
      return;
    }

    try {
      setLoading(true);
      const isEdit = Boolean(editingProduct.id);
      const url = isEdit
        ? `http://localhost:4000/api/projects/${projectId}/store/products/${editingProduct.id}`
        : `http://localhost:4000/api/projects/${projectId}/store/products`;

      const payload = {
        name: editingProduct.name,
        price: parseInt(editingProduct.price.toString().replace(/,/g, ""), 10),
        regularPrice: editingProduct.regular_price
          ? parseInt(editingProduct.regular_price.toString().replace(/,/g, ""), 10)
          : parseInt(editingProduct.price.toString().replace(/,/g, ""), 10),
        stockQuantity: editingProduct.stock_quantity ?? 10,
        featuredImage: editingProduct.images?.[0]?.src || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
        description: editingProduct.description || "",
        shortDesc: editingProduct.short_description || "",
        categoryId: editingProduct.categories?.[0]?.id || null,
        isFeatured: Boolean(editingProduct.featured),
        isSpecialOffer: Boolean(editingProduct.is_special_offer),
      };

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "محصول با موفقیت ویرایش شد." : "محصول جدید اضافه شد.");
        setIsProductModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
        fetchOverview();
        onProductUpdated?.();
      }
    } catch (e) {
      showToast("خطا در ذخیره محصول");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("محصول حذف شد.");
        fetchProducts();
        fetchOverview();
        onProductUpdated?.();
      }
    } catch (e) {
      showToast("خطا در حذف محصول");
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("دسته‌بندی جدید ثبت شد.");
        setNewCatName("");
        setIsCategoryModalOpen(false);
        fetchCategories();
        fetchOverview();
      }
    } catch (e) {
      showToast("خطا در ایجاد دسته‌بندی");
    }
  };

  // Handle Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingCode?: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/projects/${projectId}/store/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingCode }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("وضعیت سفارش با موفقیت تغییر کرد.");
        fetchOrders();
        if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
          setSelectedOrderDetails({ ...selectedOrderDetails, status, trackingCode: trackingCode ?? selectedOrderDetails.trackingCode });
        }
      }
    } catch (e) {
      showToast("خطا در تغییر وضعیت سفارش");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "all" ||
      p.categories.some((c) => c.id === selectedCategory || c.name === selectedCategory);
    return matchSearch && matchCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">مدیریت فروشگاه مستقل و کاتالوگ</h3>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  بی‌نیاز از وردپرس
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تعریف محصولات، دسته‌ها، سفارش‌ها و انبار با اتصال مستقیم به اپلیکیشن موبایل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchOverview();
                fetchProducts();
                fetchCategories();
                fetchOrders();
                showToast("اطلاعات فروشگاه به‌روزرسانی شد.");
              }}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="بارگذاری مجدد"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mini KPI Bar */}
        {overview && (
          <div className="grid grid-cols-4 gap-3 px-6 py-3 bg-slate-950/60 border-b border-slate-800 text-xs shrink-0">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">تعداد محصولات</span>
                <span className="font-bold text-slate-100">{overview.totalProducts} کالا</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Tags className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">دسته‌بندی‌ها</span>
                <span className="font-bold text-slate-100">{overview.totalCategories} دسته</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">سفارش‌های دریافتی</span>
                <span className="font-bold text-slate-100">{overview.totalOrders} سفارش</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">مجموع فروش</span>
                <span className="font-bold text-slate-100">{overview.totalRevenue.toLocaleString("fa-IR")} تومان</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-6 gap-2 bg-slate-900/60 shrink-0">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === "products"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>محصولات ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === "categories"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Tags className="w-4 h-4" />
            <span>دسته‌بندی‌ها ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === "orders"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>سفارش‌ها و تسویه‌ها ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === "settings"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>منبع داده اپ (ووکامرس / مستقل)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="جستجوی محصول با نام..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="all">همه دسته‌ها</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {products.length === 0 && (
                    <button
                      onClick={handleSeedDemo}
                      disabled={loading}
                      className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تولید محصولات نمونه</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingProduct({
                        name: "",
                        price: "",
                        regular_price: "",
                        stock_quantity: 10,
                        featured: true,
                        is_special_offer: false,
                        description: "",
                        images: [{ id: 1, src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80" }],
                        categories: categories.length > 0 ? [{ id: categories[0].id, name: categories[0].name }] : [],
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن محصول جدید</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              {loading && products.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">در حال بارگذاری کاتالوگ...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">هیچ محصولی یافت نشد.</p>
                  <button
                    onClick={handleSeedDemo}
                    className="mt-3 text-emerald-400 hover:text-emerald-300 text-xs font-bold underline"
                  >
                    کلیک برای ایجاد خودکار محصولات نمونه شیائومی
                  </button>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">تصویر</th>
                        <th className="py-2.5 px-3">عنوان کالا</th>
                        <th className="py-2.5 px-3">دسته‌بندی</th>
                        <th className="py-2.5 px-3">قیمت فعلی</th>
                        <th className="py-2.5 px-3">موجودی</th>
                        <th className="py-2.5 px-3">ویژگی‌ها</th>
                        <th className="py-2.5 px-3 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.map((p) => {
                        const img = p.images?.[0]?.src || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80";
                        const priceNum = parseInt(p.price || "0", 10);
                        const regNum = parseInt(p.regular_price || p.price || "0", 10);

                        return (
                          <tr key={p.id} className="hover:bg-slate-800/30 transition">
                            <td className="py-2.5 px-3">
                              <img
                                src={img}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                              />
                            </td>
                            <td className="py-2.5 px-3 font-bold text-white max-w-xs truncate">
                              {p.name}
                              {p.short_description && (
                                <span className="block text-[10px] font-normal text-slate-400 truncate">
                                  {p.short_description}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {p.categories?.map((c) => c.name).join(", ") || "-"}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-emerald-400">
                                {priceNum.toLocaleString("fa-IR")} ت
                              </div>
                              {regNum > priceNum && (
                                <div className="text-[10px] text-slate-500 line-through">
                                  {regNum.toLocaleString("fa-IR")} ت
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {p.stock_quantity > 0 ? (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                                  {p.stock_quantity} عدد در انبار
                                </span>
                              ) : (
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px]">
                                  ناموجود
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                {p.is_special_offer && (
                                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <Flame className="w-2.5 h-2.5 text-rose-400" /> شگفت‌انگیز
                                  </span>
                                )}
                                {p.featured && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 text-amber-400" /> برگزیده
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition"
                                  title="ویرایش محصول"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                                  title="حذف محصول"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">دسته‌بندی‌های کاتالوگ</h4>
                  <p className="text-[11px] text-slate-400">
                    دسته‌بندی‌های فعال جهت نمایش در نوار بالای اپلیکیشن و فیلترهای محصولات
                  </p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>دسته‌بندی جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <Tags className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-500">{c.count ?? 0} کالا در این دسته</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">سفارش‌های ثبت‌شده از اپلیکیشن</h4>
                  <p className="text-[11px] text-slate-400">
                    رهگیری، تغییر وضعیت به ارسال شده و صدور کد رهگیری پستی
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
                  <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">هنوز سفارشی از اپلیکیشن ثبت نشده است.</p>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">شماره سفارش</th>
                        <th className="py-2.5 px-3">خریدار</th>
                        <th className="py-2.5 px-3">شماره تماس</th>
                        <th className="py-2.5 px-3">مبلغ کل</th>
                        <th className="py-2.5 px-3">وضعیت سفارش</th>
                        <th className="py-2.5 px-3">کد رهگیری</th>
                        <th className="py-2.5 px-3 text-center">جزئیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-white">{o.orderNumber}</td>
                          <td className="py-2.5 px-3 text-slate-200">{o.customerName}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-400" dir="ltr">
                            {o.customerPhone}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">
                            {o.totalAmount.toLocaleString("fa-IR")} تومان
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                o.status === "DELIVERED"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : o.status === "SHIPPED"
                                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                  : o.status === "PROCESSING"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {o.status === "DELIVERED"
                                ? "تحویل شده"
                                : o.status === "SHIPPED"
                                ? "ارسال شد"
                                : o.status === "PROCESSING"
                                ? "در حال پردازش"
                                : o.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                            {o.trackingCode || "-"}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => setSelectedOrderDetails(o)}
                              className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2.5 py-1 rounded transition"
                            >
                              مشاهده
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DATA SOURCE & SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-sm font-bold text-white">انتخاب منبع داده کاتالوگ اپلیکیشن</h4>
                <p className="text-xs text-slate-400 mt-1">
                  مشخص کنید اپلیکیشن موبایل محصولات و تسویه‌حساب را از فروشگاه داخلی App Maker بخواند یا مستقیماً به
                  سایت وردپرس/ووکامرس شما متصل شود.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    setStoreMode("standalone");
                    showToast("حالت اپلیکیشن به فروشگاه مستقل تغییر یافت.");
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition relative ${
                    storeMode === "standalone"
                      ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    {storeMode === "standalone" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-white">فروشگاه مستقل درون‌پلتفرمی (پیش‌فرض)</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    بدون نیاز به سایت وردپرسی یا هاست. محصولات، تصاویر و سفارش‌ها مستقیماً داخل پنل مدیریت می‌شوند.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setStoreMode("woocommerce");
                    showToast("حالت اپلیکیشن به ووکامرس تغییر یافت.");
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition relative ${
                    storeMode === "woocommerce"
                      ? "bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    {storeMode === "woocommerce" && (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-white">اتصال به ووکامرس (WooCommerce API)</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    همگام‌سازی خودکار و دوطرفه با سایت وردپرس با کلید و رمز مصرف‌کننده ووکامرس.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-900/90 text-xs shrink-0">
          <span className="text-slate-400">
            منبع داده فعال:{" "}
            <strong className="text-emerald-400">
              {storeMode === "standalone" ? "فروشگاه مستقل درون‌پلتفرمی" : "سایت ووکامرس"}
            </strong>
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-lg font-bold transition"
          >
            بستن پنجره
          </button>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveProduct}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                {editingProduct?.id ? "ویرایش محصول" : "افزودن محصول جدید"}
              </h4>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">نام محصول:</label>
              <input
                type="text"
                required
                value={editingProduct?.name || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                placeholder="مثال: گوشی شیائومی Redmi Note 13"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">قیمت نهایی (تومان):</label>
                <input
                  type="number"
                  required
                  value={editingProduct?.price || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  placeholder="18500000"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">قیمت اصلی قبل تخفیف (تومان):</label>
                <input
                  type="number"
                  value={editingProduct?.regular_price || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, regular_price: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                  placeholder="20000000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">تعداد موجودی انبار:</label>
                <input
                  type="number"
                  value={editingProduct?.stock_quantity ?? 10}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value, 10) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">دسته‌بندی:</label>
                <select
                  value={editingProduct?.categories?.[0]?.id || ""}
                  onChange={(e) => {
                    const selectedCat = categories.find((c) => c.id === e.target.value);
                    if (selectedCat) {
                      setEditingProduct({
                        ...editingProduct,
                        categories: [{ id: selectedCat.id, name: selectedCat.name }],
                      });
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="">بدون دسته</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">آدرس عکس شاخص (URL):</label>
              <input
                type="url"
                value={editingProduct?.images?.[0]?.src || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    images: [{ id: 1, src: e.target.value }],
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                placeholder="https://..."
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">توضیحات کوتاه / مشخصات:</label>
              <input
                type="text"
                value={editingProduct?.short_description || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                placeholder="رم ۱۲، حافظه ۲۵۶، شارژر ۶۷ وات..."
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(editingProduct?.is_special_offer)}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, is_special_offer: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-rose-500"
                />
                <span className="flex items-center gap-1 text-rose-300 font-bold">
                  <Flame className="w-3.5 h-3.5" /> پیشنهاد شگفت‌انگیز
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(editingProduct?.featured)}
                  onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5" /> نمایش در کالاهای برگزیده
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20"
              >
                {loading ? "در حال ذخیره..." : "ذخیره محصول"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateCategory}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Tags className="w-4 h-4 text-cyan-400" />
                افزودن دسته‌بندی جدید
              </h4>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">نام دسته‌بندی:</label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500"
                placeholder="مثال: تبلت و کتابخوان"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                افزودن دسته
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">جزئیات سفارش {selectedOrderDetails.orderNumber}</h4>
                <span className="text-[10px] text-slate-400">
                  ثبت شده در {new Date(selectedOrderDetails.createdAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">نام تحویل‌گیرنده:</span>
                <span className="font-bold text-white">{selectedOrderDetails.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">شماره موبایل:</span>
                <span className="font-mono text-cyan-400" dir="ltr">{selectedOrderDetails.customerPhone}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-400">آدرس تحویل:</span>
                <span className="text-slate-200 text-left max-w-xs">{selectedOrderDetails.customerAddress}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-2">اقلام سفارش:</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedOrderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-lg text-xs">
                    <span className="text-slate-200 font-bold">{item.productName} × {item.quantity}</span>
                    <span className="text-emerald-400 font-bold">{item.totalPrice.toLocaleString("fa-IR")} تومان</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <label className="text-[11px] font-bold text-slate-300 block mb-1">تغییر وضعیت ارسال:</label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.id, e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white flex-1"
                >
                  <option value="PROCESSING">در حال پردازش در انبار</option>
                  <option value="SHIPPED">تحویل به پست / پیک (ارسال شد)</option>
                  <option value="DELIVERED">تحویل نهایی به مشتری</option>
                  <option value="CANCELLED">لغو شده</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <div>
                <span className="text-[10px] text-slate-400 block">مبلغ قابل پرداخت</span>
                <span className="text-base font-bold text-emerald-400">
                  {selectedOrderDetails.totalAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-70 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
