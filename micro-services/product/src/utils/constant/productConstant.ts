// customer type constants and enums
export const customerCategory = ['Guest', 'Authorized'];
export type customerCategoryType = 'Guest' | 'Authorized';

export const taskCategory = ['signUp', 'logIn'];
export const channelCategory = ['sms', 'whatsapp'];

// selection enum use in product DTO and entity variable
export enum selectionEnum {
  DAILY_DEAL = 'daily_deal',
  BEST_SELLER = 'best_seller',
  SOMEWHAT_LOCAL = 'somewhat_local',
  STARTERS = 'starters',
}

export enum personalizeType {
  ADDONS = 'addons',
  SIDE_ORDER = 'side_order',
}

// days enum use in branch timing variable
export enum DaysEnum {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}
