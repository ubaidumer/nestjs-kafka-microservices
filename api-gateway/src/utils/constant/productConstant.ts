// customer type constants and enums
export const customerCategory = ['Guest', 'Authorized'];
export type customerCategoryType = 'Guest' | 'Authorized';

export const taskCategory = ['signUp', 'logIn'];
export const channelCategory = ['sms', 'whatsapp'];

// selection enum use in product DTO and entity variable
export enum selectionEnum {
  DAILY_DEAL = 'daily_deal',
  BEST_SELLER = 'best_seller',
  PERMANENT_DEAL = 'permanent_deal',
  LIMITED_TIME_DEAL = 'limited_time_deal',
  SPECIAL_DAY_DEAL = 'special_day_deal',
  SEASONAL_DEAL = 'seasonal_deal',
  EXCLUSIVE_DEAL = 'exclusive_deal',
  SINGLE_PERSON_DEAL = 'single_person_deal',
  FAMILY_DEAL = 'family_deal',
  HALF_OFF_DEAL = '50%_off_deal',
  NEW_DEAL = 'new_deal',
  REGULAR_DEAL = 'regular_deal',
}
export enum personalizeType {
  ADDONS = 'addons',
  SIDE_ORDER = 'side_order',
  EXTRA_TOPPIG = 'extra_topping',
}

// days enum use in branch timing variable
export enum DaysEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export const productTopicArray = [
  //
  { topic: 'topic-product-branch-createBranch' },
  { topic: 'topic-product-branch-findOneBranch' },
  { topic: 'topic-product-branch-findAllBranchs' },
  { topic: 'topic-product-branch-updateBranch' },
  { topic: 'topic-product-branch-deleteBranch' },
  { topic: 'topic-product-branch-updateBranchTiming' },
  //
  { topic: 'topic-product-category-createCategory' },
  { topic: 'topic-product-category-findOneCategory' },
  { topic: 'topic-product-category-findAllCategorys' },
  { topic: 'topic-product-category-updateCategory' },
  { topic: 'topic-order-category-deleteCategory' },
  { topic: 'topic-product-category-updateMultipleCategories' },
  { topic: 'topic-product-category-deleteMultipleCategories' },
  { topic: 'topic-product-category-removeProductFromCategory' },
  { topic: 'topic-product-category-autoPublishTime' },
  { topic: 'topic-product-category-updateCategoryPriority' },
  //
  { topic: 'topic-product-banner-createBanner' },
  { topic: 'topic-product-banner-findOneBanner' },
  { topic: 'topic-product-banner-findAllBanners' },
  { topic: 'topic-product-banner-updateBanner' },
  { topic: 'topic-product-banner-deleteBanner' },
  { topic: 'topic-product-banner-updateMultipleBanners' },
  { topic: 'topic-product-banner-deleteMultipleBanners' },
  { topic: 'topic-product-banner-updateBannerPriority' },
  //
  { topic: 'topic-product-menu-createMenu' },
  { topic: 'topic-product-menu-findOneMenu' },
  { topic: 'topic-product-menu-findAllMenus' },
  { topic: 'topic-product-menu-updateMenu' },
  { topic: 'topic-product-menu-deleteMenu' },
  //
  { topic: 'topic-product-addons-createAddons' },
  { topic: 'topic-product-addons-findAllAddons' },
  { topic: 'topic-product-addons-findAllAddonsTypes' },
  { topic: 'topic-product-addons-findOneAddons' },
  { topic: 'topic-product-addons-updateAddons' },
  { topic: 'topic-product-addons-deleteAddons' },
  { topic: 'topic-product-addons-findAllAddonsByTpyes' },
  //
  { topic: 'topic-product-voucher-createVoucher' },
  { topic: 'topic-product-voucher-findOneVoucher' },
  { topic: 'topic-product-voucher-findAllVouchers' },
  { topic: 'topic-product-voucher-updateVoucher' },
  { topic: 'topic-product-voucher-deleteVoucher' },
  { topic: 'topic-product-voucher-findAllVouchersByCustomerId' },
  { topic: 'topic-product-voucher-applyForVoucherByCustomer' },
  { topic: 'topic-product-voucher-useVoucherByCustomer' },
  //
  { topic: 'topic-product-createProduct' },
  { topic: 'topic-product-findOneProduct' },
  { topic: 'topic-product-findAllProducts' },
  { topic: 'topic-product-getAllProducts' },
  { topic: 'topic-product-findMultipleProductsByIds' },
  { topic: 'topic-product-updateProduct' },
  { topic: 'topic-product-updateMultipleProducts' },
  { topic: 'topic-product-deleteProduct' },
  { topic: 'topic-product-deleteMultipleProducts' },
  { topic: 'topic-product-findProductByName' },
  { topic: 'topic-product-searchByselectionParams' },
  { topic: 'topic-product-searchByCategory' },
  { topic: 'topic-product-findAllProductsByCoordinates' },
  { topic: 'topic-product-findMenuBylocation' },
  { topic: 'topic-product-autoPublishTime' },
];
