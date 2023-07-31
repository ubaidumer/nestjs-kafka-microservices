// admin type constants and enums
export const adminCategory = [
  'SuperAdmin',
  'Admin',
  'DashboardManagement',
  'MenuManagement',
  'OrderManagement',
  'CustomerManagement',
  'RiderManagement',
  'DispatchManagement',
  'RadiusManagement',
  'KnowledgeManagement',
  'RiderComplianceManagement',
  'OperatorManagement',
  'BranchManagement',
  'BranchTimingManagement',
  'MarketManagement',
];
export type adminCategoryType =
  | 'SuperAdmin'
  | 'Admin'
  | 'DashboardManagement'
  | 'MenuManagement'
  | 'OrderManagement'
  | 'CustomerManagement'
  | 'RiderManagement'
  | 'DispatchManagement'
  | 'RadiusManagement'
  | 'KnowledgeManagement'
  | 'RiderComplianceManagement'
  | 'OperatorManagement'
  | 'BranchTimingManagement'
  | 'MarketManagement';

// admin topic array for topic Creation and wait Leader
export const adminTopicArray = [
  { topic: 'topic-admin-auth-createAdmin' },
  { topic: 'topic-admin-auth-updateAdmin' },
  { topic: 'topic-admin-auth-getAdminDetail' },
  { topic: 'topic-admin-auth-adminLogIn' },
  { topic: 'topic-admin-auth-adminGoogleRegisteration' },
  { topic: 'topic-admin-auth-findAllAdmin' },
  { topic: 'topic-admin-address-createAddress' },
  { topic: 'topic-admin-address-findAllAddress' },
  { topic: 'topic-admin-address-findOneAddress' },
  { topic: 'topic-admin-address-findOneAdminAllAddress' },
  { topic: 'topic-admin-address-updateAddress' },
  { topic: 'topic-admin-campaign-createCampaign' },
  { topic: 'topic-admin-campaign-findAllCampaign' },
  { topic: 'topic-admin-campaign-findOneCampaign' },
  { topic: 'topic-admin-campaign-findOneAdminAllCampaign' },
  { topic: 'topic-admin-campaign-updateCampaign' },
];
