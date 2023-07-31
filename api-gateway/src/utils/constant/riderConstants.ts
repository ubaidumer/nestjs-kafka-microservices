// rider topic array for topic Creation and wait Leader
export const riderTopicArray = [
  // Auth Topics
  { topic: 'topic-rider-auth-createRider' },
  { topic: 'topic-rider-auth-verifyOtp' },
  { topic: 'topic-rider-auth-updateRiderByRider' },
  { topic: 'topic-rider-auth-riderLogin' },
  { topic: 'topic-rider-auth-findAllRider' },
  { topic: 'topic-rider-auth-findAllRiderGroupByBranch' },
  { topic: 'topic-rider-auth-findOneRider' },
  { topic: 'topic-rider-auth-findOneRiderByRider' },
  { topic: 'topic-rider-auth-updateRider' },
  { topic: 'topic-rider-auth-uploadTraining' },
  { topic: 'topic-rider-auth-deleteTraining' },
  { topic: 'topic-rider-auth-PublishTraing' },
  { topic: 'topic-rider-auth-unPublishTraing' },
  { topic: 'topic-rider-auth-findAllTraining' },
  { topic: 'topic-rider-auth-findTrainingQuestions' },
  { topic: 'topic-rider-auth-updateTraining' },
  { topic: 'topic-rider-auth-validateTrainingQuestions' },
  // Leave Topics
  { topic: 'topic-rider-leave-createLeaves' },
  { topic: 'topic-rider-leave-findAllLeaves' },
  { topic: 'topic-rider-leave-findOneLeave' },
  { topic: 'topic-rider-leave-findOneRiderAllLeaves' },
  { topic: 'topic-rider-leave-updateLeave' },
  { topic: 'topic-rider-leave-deleteLeaves' },
  // FAQ'S Topics
  { topic: 'topic-rider-faqs-createFAQS' },
  { topic: 'topic-rider-faqs-findAllFAQS' },
  { topic: 'topic-rider-faqs-findFAQSById' },
  { topic: 'topic-rider-faqs-updateFAQS' },
  { topic: 'topic-rider-faqs-deleteFAQS' },
  // Address Topics
  { topic: 'topic-rider-address-findAllAddress' },
  { topic: 'topic-rider-address-findOneAddress' },
  { topic: 'topic-rider-address-updateAddress' },
  //  Shift Management
  { topic: 'topic-rider-shift-createShifts' },
  { topic: 'topic-rider-shift-findAllShifts' },
  { topic: 'topic-rider-shift-assigShiftToRider' },
  { topic: 'topic-rider-shift-findOneShift' },
  { topic: 'topic-rider-shift-updateShift' },
  // Feedback Topics
  { topic: 'topic-rider-feedback-createFeedback' },
  { topic: 'topic-rider-feedback-findAllFeedbacks' },
  { topic: 'topic-rider-feedback-findOneFeedbackByOrderId' },
  { topic: 'topic-rider-feedback-findOneRiderAllFeedbacks' },
  { topic: 'topic-rider-feedback-findOneCustomerAllFeedbacks' },
  // notifications topics
  { topic: 'topic-notification-notifications-createNotification' },
  // Compliance Topics
  { topic: 'topic-rider-compliance-createCompliance' },
  { topic: 'topic-rider-compliance-updateCompliance' },
  { topic: 'topic-rider-compliance-findOneCompliance' },
  { topic: 'topic-rider-compliance-findAllCompliance' },
  { topic: 'topic-rider-compliance-requestComplianceByAdmin' },
  { topic: 'topic-rider-compliance-randomCompliance' },
  // Financial Assistance Topics
  { topic: 'topic-rider-financialAssistance-createFinancialAssistance' },
  { topic: 'topic-rider-financialAssistance-findAllFinancialAssistances' },
  // Document Topics
  { topic: 'topic-rider-document-verifyDocument' },
  { topic: 'topic-rider-document-updateDocument' },
  { topic: 'topic-rider-document-uploadDocument' },
  { topic: 'topic-rider-document-findOneDocument' },
  { topic: 'topic-rider-document-findAllDocument' },
  { topic: 'topic-rider-document-findByRiderDocument' },
];

export const riderDocumentCategory = [
  'CNIC_FRONT',
  'CNIC_BACK',
  'DRIVING_LICENSE_FRONT',
  'DRIVING_LICENSE_BACK',
  'VEHICLE_REGISTRATION_FRONT',
  'VEHICLE_REGISTRATION_BACK',
];

export const riderComplianceDocumentCategory = ['bag', 'bikeVideo', 'picture'];

export const riderFinancialTypeCategory = [
  'SISTERWEDDING',
  'OWNWEDDING',
  'PARENTMEDICAL',
  'OTHERS',
];

export const riderStatusCategory = [
  'REGISTERED',
  'PENDING',
  'REJECTED',
  'TRAINING',
  'ACTIVE',
  'ONLEAVE',
  'BLOCKED',
  'INACTIVE',
  'INCOMPLETE',
];

export type riderStatusCategoryType =
  | 'REGISTERED'
  | 'PENDING'
  | 'REJECTED'
  | 'TRAINING'
  | 'ACTIVE'
  | 'ONLEAVE'
  | 'BLOCKED'
  | 'INACTIVE'
  | 'INCOMPLETE';

export const traningStatus = ['PUBLISH', 'UNPUBLISH'];
export const traningTypeValue = ['TRAINING', 'TUTORIALS'];
export type traningStatusType = 'PUBLISH' | 'UNPUBLISH';
export type traningType = 'TRAINING' | 'TUTORIALS';

export const traningStatusValue = {
  PUBLISH: 'PUBLISH',
  UNPUBLISH: 'UNPUBLISH',
};
