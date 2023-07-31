// order status enum use in order change apis and entity variable
export const OrderStatus = {
  PLACED: 'PLACED', // order created
  ACCEPTED: 'ACCEPTED', // accepted by admin
  WAITINGRIDER: 'WAITINGRIDER', // active // order in a state where rider is assigned to order by admin but waiting for rider accept/reject
  PREPARING: 'PREPARING', // In v2 // active // order is preparing and rider has accepted
  READYFORPICKUP: 'READYFORPICKUP', // order is ready to pick up
  EXPIRED: 'EXPIRED',
  ASSIGNED: 'ASSIGNED',
  CANCELED: 'CANCELED',
  PICKEDUP: 'PICKEDUP', // active
  DELIVERED: 'DELIVERED',
  REJECTEDBYRIDER: 'REJECTEDBYRIDER',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED',
};
// add new status "pending"

// order late status enum use in orders to detect late orders within process or after that

export const LateStatus = {
  ADMINACCEPTEDLATE: 'ADMINACCEPTEDLATE',
  RIDERASSIGNEDLATE: 'RIDERASSIGNEDLATE',
  RIDERACCEPTEDLATE: 'RIDERACCEPTEDLATE',
  RIDERPICKEDUPLATE: 'RIDERPICKEDUPLATE',
};

export const lateStatusCategory = [
  'ADMINACCEPTEDLATE',
  'RIDERASSIGNEDLATE',
  'RIDERACCEPTEDLATE',
  'RIDERPICKEDUPLATE',
];
export type lateStatusCategoryType =
  | 'ADMINACCEPTEDLATE'
  | 'RIDERASSIGNEDLATE'
  | 'RIDERACCEPTEDLATE'
  | 'RIDERPICKEDUPLATE';
