// customer type constants and enums
export const orderStatus = [
  'PLACED',
  'ACCEPTED',
  'WAITINGRIDER',
  'PREPARING',
  'READYFORPICKUP',
  'EXPIRED',
  'ASSIGNED',
  'CANCELED',
  'PICKEDUP',
  'DELIVERED',
  'REJECTED',
  'REJECTEDBYRIDER',
  'FAILED',
];

export type orderStatusType =
  | 'PLACED'
  | 'ACCEPTED'
  | 'WAITINGRIDER'
  | 'PREPARING'
  | 'READYFORPICKUP'
  | 'EXPIRED'
  | 'ASSIGNED'
  | 'CANCELED'
  | 'PICKEDUP'
  | 'DELIVERED'
  | 'REJECTED';

export const orderTopicArray = [
  //  for feedback topics
  { topic: 'topic-order-feedback-createFeedback' },
  { topic: 'topic-order-feedback-findOneFeedback' },
  { topic: 'topic-order-feedback-findAllFeedbacks' },
  { topic: 'topic-order-feedback-findAllFeedbacksByCustomerId' },
  { topic: 'topic-order-feedback-findAllFeedbacksByOrderId' },
  //  for order topics
  { topic: 'topic-order-createOrder' },
  { topic: 'topic-order-findAllOrders' },
  { topic: 'topic-order-findOneOrder' },
  { topic: 'topic-order-updateOrder' },
  { topic: 'topic-order-updateOrderByAdmin' },
  { topic: 'topic-order-deleteOrder' },
  { topic: 'topic-order-reOrder' },
  { topic: 'topic-order-cancelOrder' }, //  order cancle within 5 mints
  { topic: 'topic-order-pickUpOrder' },
  { topic: 'topic-order-completeOrder' },
  { topic: 'topic-order-rejectOrder' },
  { topic: 'topic-order-findAllOrdersByCustomerId' },
  { topic: 'topic-order-findAllOrdersByRiderId' },
  { topic: 'topic-order-findAllOrdersByBranchId' },
  { topic: 'topic-order-findAllOrdersActivitiesByOrderId' },
  { topic: 'topic-order-findAllOrdersActivities' },
  { topic: 'topic-order-assgnRiderToOrder' },
  { topic: 'topic-order-rejectOrderByRider' },
  { topic: 'topic-order-rejectOrderByAdmin' },
  { topic: 'topic-order-acceptOrderByRider' },
  { topic: 'topic-order-acceptOrderByAdmin' },
  { topic: 'topic-order-orderReadyForPickup' },
  //   for payments topics
  { topic: 'topic-order-payment-createPayment' },
  { topic: 'topic-order-payment-findOnePayment' },
  { topic: 'topic-order-payment-findAllPayments' },
  { topic: 'topic-order-payment-findAllPaymentsByCustomerId' },
  // notifications topics
  { topic: 'topic-notification-notifications-createNotification' },
  // manual Acceptance
  { topic: 'topic-order-configuration-createConfiguration' },
  { topic: 'topic-order-configuration-findConfiguration' },
  { topic: 'topic-order-configuration-updateConfiguration' },
];
