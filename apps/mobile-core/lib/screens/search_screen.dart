import 'package:flutter/material.dart';
import 'package:intl/intl.dart' hide TextDirection;
import 'package:cached_network_image/cached_network_image.dart';
import '../core/models/app_config_model.dart';
import '../core/services/config_sync_service.dart';
import '../core/state/cart_state.dart';
import 'product_detail_screen.dart';

class SearchScreen extends StatefulWidget {
  final String? initialQuery;
  final String? initialCategory;
  final AppConfigModel? config;
  final List<Map<String, dynamic>>? products;

  const SearchScreen({
    super.key,
    this.initialQuery,
    this.initialCategory,
    this.config,
    this.products,
  });

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final cart = CartState();
  final currencyFormat = NumberFormat('#,###');

  String _searchQuery = '';
  String _selectedCategory = 'همه';
  bool _onlyInStock = false;
  String _sortBy = 'popular'; // popular, cheapest, expensive, newest, discount
  late RangeValues _priceRange;
  double _minPossiblePrice = 0;
  double _maxPossiblePrice = 100000000;

  static const List<Map<String, dynamic>> _fallbackProducts = [
    {
      'id': 'p_fb1',
      'title': 'هدفون بی‌سیم سونی WH-1000XM5',
      'categories': ['صوتی و تصویری'],
      'price': 18450000,
      'regularPrice': 21500000,
      'discountPercent': 14,
      'inStock': true,
      'imageUrl': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'rating': 4.9,
    },
    {
      'id': 'p_fb2',
      'title': 'ساعت هوشمند شیائومی Watch S3',
      'categories': ['ساعت و مچ‌بند'],
      'price': 6900000,
      'regularPrice': 7800000,
      'discountPercent': 11,
      'inStock': true,
      'imageUrl': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      'rating': 4.8,
    },
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialQuery != null && widget.initialQuery!.isNotEmpty) {
      _searchController.text = widget.initialQuery!;
      _searchQuery = widget.initialQuery!;
    }
    if (widget.initialCategory != null && widget.initialCategory!.isNotEmpty) {
      _selectedCategory = widget.initialCategory!;
    }

    _calculatePriceBounds();
    _priceRange = RangeValues(_minPossiblePrice, _maxPossiblePrice);
  }

  void _calculatePriceBounds() {
    final prods = _rawProducts;
    if (prods.isEmpty) return;

    double minP = double.infinity;
    double maxP = 0;

    for (final p in prods) {
      final pVal = (p['price'] as num?)?.toDouble() ?? 0;
      if (pVal < minP && pVal > 0) minP = pVal;
      if (pVal > maxP) maxP = pVal;
    }

    _minPossiblePrice = minP == double.infinity ? 0 : minP;
    _maxPossiblePrice = maxP <= 0 ? 100000000 : maxP;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _rawProducts {
    if (widget.products != null && widget.products!.isNotEmpty) {
      return widget.products!;
    }
    final cfg = widget.config ?? ConfigSyncService.currentConfig;
    if (cfg != null && cfg.allProducts.isNotEmpty) {
      return cfg.allProducts;
    }
    return _fallbackProducts;
  }

  List<String> get _categories {
    final Set<String> set = {'همه'};

    // 1. From Config categories block
    final cfg = widget.config ?? ConfigSyncService.currentConfig;
    if (cfg != null) {
      for (final cat in cfg.allCategories) {
        final title = (cat['title'] ?? cat['name'] ?? '').toString().trim();
        if (title.isNotEmpty) set.add(title);
      }
    }

    // 2. From actual products categories
    for (final p in _rawProducts) {
      final cList = p['categories'];
      if (cList is List) {
        for (final c in cList) {
          final cStr = (c is Map ? c['name'] : c)?.toString().trim() ?? '';
          if (cStr.isNotEmpty) set.add(cStr);
        }
      } else if (p['category'] != null) {
        final cStr = p['category'].toString().trim();
        if (cStr.isNotEmpty) set.add(cStr);
      }
    }

    return set.toList();
  }

  bool _matchesCategory(Map<String, dynamic> p, String selected) {
    if (selected == 'همه') return true;
    final selLower = selected.toLowerCase();

    final cList = p['categories'];
    if (cList is List) {
      for (final c in cList) {
        final cStr = (c is Map ? c['name'] : c)?.toString().toLowerCase() ?? '';
        if (cStr == selLower || cStr.contains(selLower) || selLower.contains(cStr)) {
          return true;
        }
      }
    }
    final single = (p['category'] ?? '').toString().toLowerCase();
    if (single == selLower || single.contains(selLower) || selLower.contains(single)) {
      return true;
    }

    return false;
  }

  List<Map<String, dynamic>> get _filteredProducts {
    return _rawProducts.where((p) {
      // 1. Search Query Match
      if (_searchQuery.trim().isNotEmpty) {
        final query = _searchQuery.trim().toLowerCase();
        final title = (p['title'] ?? p['name'] ?? '').toString().toLowerCase();
        final desc = (p['description'] ?? '').toString().toLowerCase();
        final sku = (p['sku'] ?? '').toString().toLowerCase();

        bool catMatches = false;
        final cList = p['categories'];
        if (cList is List) {
          for (final c in cList) {
            final cStr = (c is Map ? c['name'] : c)?.toString().toLowerCase() ?? '';
            if (cStr.contains(query)) {
              catMatches = true;
              break;
            }
          }
        } else if (p['category'] != null) {
          catMatches = p['category'].toString().toLowerCase().contains(query);
        }

        if (!title.contains(query) && !desc.contains(query) && !sku.contains(query) && !catMatches) {
          return false;
        }
      }

      // 2. Category Filter
      if (!_matchesCategory(p, _selectedCategory)) {
        return false;
      }

      // 3. In-Stock Filter
      if (_onlyInStock) {
        final inStock = p['inStock'] ?? (p['stock_status'] == 'instock') ?? true;
        if (inStock != true) return false;
      }

      // 4. Price Range
      final price = (p['price'] as num?)?.toDouble() ?? 0;
      if (price > 0) {
        if (price < _priceRange.start || price > _priceRange.end) {
          return false;
        }
      }

      return true;
    }).toList()
      ..sort((a, b) {
        final pA = (a['price'] as num?)?.toDouble() ?? 0;
        final pB = (b['price'] as num?)?.toDouble() ?? 0;

        if (_sortBy == 'cheapest') {
          return pA.compareTo(pB);
        } else if (_sortBy == 'expensive') {
          return pB.compareTo(pA);
        } else if (_sortBy == 'discount') {
          final dA = (a['discountPercent'] ?? a['discount'] as num?)?.toDouble() ?? 0;
          final dB = (b['discountPercent'] ?? b['discount'] as num?)?.toDouble() ?? 0;
          return dB.compareTo(dA);
        } else if (_sortBy == 'newest') {
          final idA = a['id']?.toString() ?? '';
          final idB = b['id']?.toString() ?? '';
          return idB.compareTo(idA);
        }
        // default: popular / rating
        final rA = (a['rating'] as num?)?.toDouble() ?? 4.8;
        final rB = (b['rating'] as num?)?.toDouble() ?? 4.8;
        return rB.compareTo(rA);
      });
  }

  void _showFilterModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Directionality(
              textDirection: TextDirection.rtl,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'فیلتر و مرتب‌سازی پیشرفته',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, size: 20),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const Divider(height: 16),

                    // In-Stock Switch
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('فقط کالاهای موجود در انبار', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      value: _onlyInStock,
                      activeTrackColor: const Color(0xFFEF394E),
                      onChanged: (val) {
                        setModalState(() => _onlyInStock = val);
                        setState(() => _onlyInStock = val);
                      },
                    ),

                    const SizedBox(height: 12),
                    // Price Range Slider
                    Text(
                      'محدوده قیمت: ${currencyFormat.format(_priceRange.start)} تا ${currencyFormat.format(_priceRange.end)} تومان',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4B5563)),
                    ),
                    RangeSlider(
                      values: _priceRange,
                      min: _minPossiblePrice,
                      max: _maxPossiblePrice,
                      divisions: 40,
                      activeColor: const Color(0xFFEF394E),
                      onChanged: (values) {
                        setModalState(() => _priceRange = values);
                        setState(() => _priceRange = values);
                      },
                    ),

                    const SizedBox(height: 12),
                    // Sorting Options
                    const Text('مرتب‌سازی بر اساس:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _buildSortChip('popular', 'محبوب‌ترین', setModalState),
                        _buildSortChip('cheapest', 'ارزان‌ترین', setModalState),
                        _buildSortChip('expensive', 'گران‌ترین', setModalState),
                        _buildSortChip('newest', 'جدیدترین', setModalState),
                        _buildSortChip('discount', 'بیشترین تخفیف', setModalState),
                      ],
                    ),

                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () {
                              setModalState(() {
                                _onlyInStock = false;
                                _priceRange = RangeValues(_minPossiblePrice, _maxPossiblePrice);
                                _sortBy = 'popular';
                              });
                              setState(() {
                                _onlyInStock = false;
                                _priceRange = RangeValues(_minPossiblePrice, _maxPossiblePrice);
                                _sortBy = 'popular';
                              });
                              Navigator.pop(context);
                            },
                            child: const Text('تنظیم مجدد', style: TextStyle(fontSize: 12)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFEF394E),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            onPressed: () => Navigator.pop(context),
                            child: const Text('اعمال فیلترها', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildSortChip(String id, String label, StateSetter setModalState) {
    final isSelected = _sortBy == id;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          color: isSelected ? Colors.white : const Color(0xFF1F2937),
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      selectedColor: const Color(0xFFEF394E),
      backgroundColor: const Color(0xFFF3F4F6),
      onSelected: (_) {
        setModalState(() => _sortBy = id);
        setState(() => _sortBy = id);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final products = _filteredProducts;
    final categories = _categories;

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        backgroundColor: const Color(0xFFF9FAFB),
        appBar: AppBar(
          elevation: 0.5,
          backgroundColor: Colors.white,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, size: 18),
            onPressed: () => Navigator.pop(context),
          ),
          title: Container(
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFFF3F4F6),
              borderRadius: BorderRadius.circular(10),
            ),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'جستجوی نام کالا، برند یا دسته‌بندی...',
                hintStyle: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF)),
                prefixIcon: const Icon(Icons.search, size: 18, color: Color(0xFF9CA3AF)),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 16, color: Color(0xFF6B7280)),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
              style: const TextStyle(fontSize: 12),
            ),
          ),
          actions: [
            Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.tune_rounded, color: Color(0xFFEF394E), size: 22),
                  onPressed: _showFilterModal,
                  tooltip: 'فیلترها',
                ),
                if (_onlyInStock || _sortBy != 'popular')
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFFEF394E),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
        body: Column(
          children: [
            // Category Filter Pills Bar
            if (categories.length > 1)
              Container(
                height: 48,
                color: Colors.white,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  scrollDirection: Axis.horizontal,
                  itemCount: categories.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final cat = categories[index];
                    final isSelected = cat == _selectedCategory;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategory = cat),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFFEF394E) : const Color(0xFFF3F4F6),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          cat,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            color: isSelected ? Colors.white : const Color(0xFF4B5563),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),

            // Results Counter & Quick Sort Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${products.length} کالا یافت شد',
                    style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280), fontWeight: FontWeight.bold),
                  ),
                  GestureDetector(
                    onTap: _showFilterModal,
                    child: Row(
                      children: [
                        Text(
                          _sortBy == 'cheapest'
                              ? 'ارزان‌ترین'
                              : _sortBy == 'expensive'
                                  ? 'گران‌ترین'
                                  : _sortBy == 'discount'
                                      ? 'بیشترین تخفیف'
                                      : _sortBy == 'newest'
                                          ? 'جدیدترین'
                                          : 'محبوب‌ترین',
                          style: const TextStyle(fontSize: 11, color: Color(0xFFEF394E), fontWeight: FontWeight.bold),
                        ),
                        const Icon(Icons.keyboard_arrow_down, size: 16, color: Color(0xFFEF394E)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Products Grid or Empty State
            Expanded(
              child: products.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.search_off_rounded, size: 64, color: Colors.grey.shade400),
                          const SizedBox(height: 12),
                          const Text('هیچ کالایی با این مشخصات یافت نشد', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Text(
                            _selectedCategory != 'همه'
                                ? 'در دسته‌بندی "$_selectedCategory" یا فیلترهای انتخابی موردی پیدا نشد.'
                                : 'لطفاً عبارت دیگری را جستجو کنید یا فیلترها را تغییر دهید.',
                            style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 14),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFEF394E),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            ),
                            icon: const Icon(Icons.refresh_rounded, size: 16),
                            label: const Text('نمایش همه کالاها', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {
                                _searchQuery = '';
                                _selectedCategory = 'همه';
                                _onlyInStock = false;
                                _priceRange = RangeValues(_minPossiblePrice, _maxPossiblePrice);
                              });
                            },
                          ),
                        ],
                      ),
                    )
                  : GridView.builder(
                      padding: const EdgeInsets.all(12),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 10,
                        mainAxisSpacing: 10,
                        childAspectRatio: 0.68,
                      ),
                      itemCount: products.length,
                      itemBuilder: (context, index) {
                        final p = products[index];
                        return _buildProductCard(p);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductCard(Map<String, dynamic> p) {
    final title = (p['title'] ?? p['name'] ?? 'محصول فروشگاه').toString();
    final price = (p['price'] as num?)?.toDouble() ?? 0;
    final regularPrice = (p['regularPrice'] as num?)?.toDouble();
    final discount = p['discountPercent'] ?? p['discount'];
    final imageUrl = (p['imageUrl'] ?? (p['images'] is List && (p['images'] as List).isNotEmpty ? p['images'][0]['src'] : '') ?? '').toString();
    final rating = (p['rating'] as num?)?.toDouble() ?? 4.9;
    final inStock = p['inStock'] ?? (p['stock_status'] == 'instock') ?? true;

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => ProductDetailScreen(product: p)),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image & Badges
            Expanded(
              child: Stack(
                children: [
                  Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: imageUrl.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: imageUrl,
                              fit: BoxFit.cover,
                              errorWidget: (_, __, ___) => const Icon(Icons.image, color: Colors.grey),
                            )
                          : const Icon(Icons.image, size: 40, color: Colors.grey),
                    ),
                  ),
                  if (discount != null)
                    Positioned(
                      top: 4,
                      right: 4,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEF394E),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '$discount٪',
                          style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 8),

            // Title
            Text(
              title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, height: 1.3),
            ),
            const SizedBox(height: 6),

            // Rating & Stock
            Row(
              children: [
                const Icon(Icons.star_rounded, color: Color(0xFFFBBF24), size: 14),
                const SizedBox(width: 2),
                Text(rating.toStringAsFixed(1), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                const Spacer(),
                Text(
                  inStock ? 'موجود' : 'ناموجود',
                  style: TextStyle(
                    fontSize: 9,
                    color: inStock ? const Color(0xFF059669) : Colors.grey,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),

            // Price & Add to Cart
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (regularPrice != null && regularPrice > price)
                      Text(
                        currencyFormat.format(regularPrice),
                        style: TextStyle(
                          fontSize: 9,
                          color: Colors.grey.shade400,
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                    Text(
                      '${currencyFormat.format(price)} ت',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFEF394E),
                      ),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () {
                    cart.addItem(
                      id: p['id']?.toString() ?? title,
                      title: title,
                      imageUrl: imageUrl,
                      price: price,
                      regularPrice: regularPrice,
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('کالا به سبد اضافه شد! 🛍️', style: TextStyle(fontFamily: 'Kalameh', fontSize: 12)),
                        backgroundColor: Color(0xFF10B981),
                        duration: Duration(milliseconds: 900),
                      ),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF394E).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.add_shopping_cart, size: 16, color: Color(0xFFEF394E)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
