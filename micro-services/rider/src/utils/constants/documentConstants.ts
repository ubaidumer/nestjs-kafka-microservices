// document type constants and enums
export const documentCategory = [
  'CNICFRONT',
  'CNICBACK',
  'DRIVINGLICENSEFRONT',
  'DRIVINGLICENSEBACK',
  'VEHICLEREGISTRATIONFRONT',
  'VEHICLEREGISTRATIONBACK',
];
export type documentCategoryType =
  | 'CNICFRONT'
  | 'CNICBACK'
  | 'DRIVINGLICENSEFRONT'
  | 'DRIVINGLICENSEBACK'
  | 'VEHICLEREGISTRATIONFRONT'
  | 'VEHICLEREGISTRATIONBACK';

// document type constants and enums
export const documentStatusCategory = ['PENDING', 'REJECTED', 'APPROVED'];
export type documentStatusCategoryType = 'PENDING' | 'APPROVED' | 'REJECTED';
