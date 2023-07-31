// customer type constants and enums
export const customerCategory = ['Guest', 'Authorized'];
export type customerCategoryType = 'Guest' | 'Authorized';

export const taskCategory = ['signUp', 'logIn'];
export const channelCategory = ['sms', 'whatsapp'];

// customer topic array for topic Creation and wait Leader
export const customerTopicArray = [
  { topic: 'topic-customer-auth-guestRegisteration' },
  { topic: 'topic-customer-auth-guestOnboarding' },
  { topic: 'topic-customer-auth-userOnboarding' },
  { topic: 'topic-customer-auth-userOnboardingByAdmin' },
  { topic: 'topic-customer-auth-findOneCustomerByPhone' },
  { topic: 'topic-customer-auth-sendOtp' },
  { topic: 'topic-customer-auth-verifyOtp' },
  { topic: 'topic-customer-auth-findAllCustomer' },
  { topic: 'topic-customer-auth-findOneCustomer' },
  { topic: 'topic-customer-auth-updateCustomer' },
  { topic: 'topic-customer-auth-updateCustomerStatus' },
  { topic: 'topic-customer-address-createAddress' },
  { topic: 'topic-customer-address-findAllAddress' },
  { topic: 'topic-customer-address-findOneAddress' },
  { topic: 'topic-customer-address-findOneCustomerAllAddress' },
  { topic: 'topic-customer-address-updateAddress' },
  { topic: 'topic-customer-affair-createAffair' },
  { topic: 'topic-customer-affair-findAllAffair' },
  { topic: 'topic-customer-affair-findOneAffair' },
  { topic: 'topic-customer-affair-findOneCustomerAllAffair' },
  { topic: 'topic-customer-affair-deleteAffair' },
  { topic: 'topic-customer-fav-createFav' },
  { topic: 'topic-customer-fav-findAllFav' },
  { topic: 'topic-customer-fav-findOneFav' },
  { topic: 'topic-customer-fav-findOneCustomerAllFav' },
  { topic: 'topic-customer-fav-deleteFav' },
];
