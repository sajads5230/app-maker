import 'package:flutter/material.dart';
import '../../widgets/blocks/banner_slider_widget.dart';
import '../../widgets/blocks/category_grid_widget.dart';
import '../../widgets/blocks/product_carousel_widget.dart';
import '../../widgets/blocks/promo_banner_widget.dart';
import '../../widgets/blocks/product_grid_widget.dart';
import '../../widgets/blocks/blog_list_widget.dart';
import '../../widgets/blocks/notice_box_widget.dart';
import '../../widgets/blocks/story_circles_widget.dart';
import '../../widgets/blocks/trust_badges_widget.dart';
import '../../widgets/blocks/countdown_banner_widget.dart';
import '../../widgets/blocks/brand_grid_widget.dart';
import '../../widgets/blocks/coupon_card_widget.dart';
import '../../widgets/blocks/faq_accordion_widget.dart';
import '../../widgets/blocks/recently_viewed_widget.dart';
import '../../widgets/blocks/lucky_wheel_banner_widget.dart';
import '../../widgets/blocks/booking_reservation_widget.dart';
import '../../widgets/blocks/b2b_inquiry_widget.dart';
import '../../widgets/blocks/course_curriculum_widget.dart';
import '../../widgets/blocks/ad_banner_widget.dart';
import '../../widgets/blocks/custom_form_widget.dart';
import '../../widgets/blocks/loyalty_card_widget.dart';
import '../../widgets/blocks/featured_vendors_widget.dart';

class BlockRenderer {
  static Widget render(dynamic blockJson) {
    if (blockJson is! Map<String, dynamic>) {
      return const SizedBox.shrink();
    }

    final type = blockJson['type'] as String?;

    switch (type) {
      case 'banner_slider':
      case 'carousel':
        return BannerSliderWidget(data: blockJson);
      case 'categories':
      case 'category_grid':
        return CategoryGridWidget(data: blockJson);
      case 'product_carousel':
      case 'slider':
        return ProductCarouselWidget(data: blockJson);
      case 'promo_banners':
      case 'banner':
        return PromoBannerWidget(data: blockJson);
      case 'product_grid':
        return ProductGridWidget(data: blockJson);
      case 'blog_list':
        return BlogListWidget(data: blockJson);
      case 'notice_box':
        return NoticeBoxWidget(data: blockJson);
      case 'story_circles':
      case 'stories':
        return StoryCirclesWidget(data: blockJson);
      case 'trust_badges':
      case 'guarantees':
        return TrustBadgesWidget(data: blockJson);
      case 'countdown_timer':
      case 'flash_deal':
        return CountdownBannerWidget(data: blockJson);
      case 'brand_grid':
      case 'brands':
        return BrandGridWidget(data: blockJson);
      case 'coupon_card':
      case 'voucher':
        return CouponCardWidget(data: blockJson);
      case 'faq_accordion':
      case 'faq':
        return FaqAccordionWidget(data: blockJson);
      case 'recently_viewed':
      case 'recent_products':
        return RecentlyViewedWidget(data: blockJson);
      case 'lucky_wheel_banner':
      case 'lucky_wheel':
      case 'spin_wheel':
        return LuckyWheelBannerWidget(data: blockJson);
      case 'booking_reservation':
      case 'booking':
      case 'appointment':
        return BookingReservationWidget(data: blockJson);
      case 'b2b_inquiry':
      case 'rfq':
      case 'industrial_catalog':
        return B2BInquiryWidget(data: blockJson);
      case 'course_curriculum':
      case 'courses':
      case 'lms':
        return CourseCurriculumWidget(data: blockJson);
      case 'ad_banner':
      case 'tapsell_banner':
      case 'advertisement':
      case 'ads':
        return AdBannerWidget(data: blockJson);
      case 'custom_form':
      case 'form':
        return CustomFormWidget(data: blockJson);
      case 'loyalty_card':
      case 'loyalty':
      case 'vip_club':
        return LoyaltyCardWidget(data: blockJson);
      case 'featured_vendors':
      case 'dokan_vendors':
      case 'vendors':
        return FeaturedVendorsWidget(data: blockJson);
      case 'spacer':
        final height = (blockJson['height'] as num?)?.toDouble() ?? 12.0;
        return SizedBox(height: height);
      default:
        return const SizedBox.shrink();
    }
  }
}
