export class DocumentObject {
  bag: { key: String; status: String };
  picture: { key: String; status: String };
  bikeVideo: { key: String; status: String };
}

// Compliance type constants and enums
export const complianceStatusCategory = ['NOTRATED', 'RATED', 'SENT'];
export type complianceStatusCategoryType = 'NOTRATED' | 'RATED' | 'SENT';

// Compliance type constants and enums
export const complianceTypeCategory = ['MANDATORY', 'RANDOM'];
export type complianceTypeCategoryType = 'MANDATORY' | 'RANDOM';
