/**
 * Core type definitions for the SafeRide app
 * Using JSDoc for type definitions in JavaScript environment
 */

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} phoneNumber
 * @property {string} [email]
 * @property {string} displayName
 * @property {string} [profileImage]
 * @property {boolean} isVerified
 * @property {EmergencyContact[]} emergencyContacts
 * @property {SavedAddress[]} savedAddresses
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Driver
 * @extends User
 * @property {string} driverId
 * @property {string} vehicleType
 * @property {string} vehicleNumber
 * @property {string} licenseNumber
 * @property {DriverDocument[]} documents
 * @property {boolean} isOnline
 * @property {Location} [currentLocation]
 * @property {number} rating
 * @property {number} totalRides
 * @property {boolean} isApproved
 * @property {DriverEarnings} earnings
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} id
 * @property {string} name
 * @property {string} phoneNumber
 * @property {string} relationship
 */

/**
 * @typedef {Object} SavedAddress
 * @property {string} id
 * @property {string} label
 * @property {string} address
 * @property {Location} coordinates
 */

/**
 * @typedef {Object} Location
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {Object} Ride
 * @property {string} id
 * @property {string} passengerId
 * @property {string} [driverId]
 * @property {string} status
 * @property {LocationDetails} pickupLocation
 * @property {LocationDetails} dropLocation
 * @property {string} vehicleType
 * @property {RideFare} fare
 * @property {string} paymentMethod
 * @property {string} paymentStatus
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {Date} [startTime]
 * @property {Date} [endTime]
 * @property {RoutePoint[]} [route]
 * @property {RideRating} [rating]
 * @property {SafetyAlert[]} [safetyAlerts]
 */

/**
 * @typedef {Object} LocationDetails
 * @property {string} address
 * @property {Location} coordinates
 * @property {string} [landmark]
 */

/**
 * @typedef {Object} RideFare
 * @property {number} baseAmount
 * @property {number} distanceAmount
 * @property {number} timeAmount
 * @property {number} totalAmount
 * @property {string} currency
 */

/**
 * @typedef {Object} Payment
 * @property {string} id
 * @property {string} rideId
 * @property {number} amount
 * @property {string} method
 * @property {string} status
 * @property {string} [transactionId]
 * @property {Date} createdAt
 * @property {PaymentReceipt} [receipt]
 */

// Enums as constants
export const RideStatus = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DRIVER_ARRIVING: 'driver_arriving',
  DRIVER_ARRIVED: 'driver_arrived',
  TRIP_STARTED: 'trip_started',
  TRIP_COMPLETED: 'trip_completed',
  TRIP_CANCELLED: 'trip_cancelled'
};

export const VehicleType = {
  BIKE: 'bike',
  AUTO: 'auto',
  CAR: 'car'
};

export const PaymentMethod = {
  CASH: 'cash',
  UPI: 'upi',
  CARD: 'card',
  WALLET: 'wallet'
};

export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const SafetyAlertType = {
  PANIC_BUTTON: 'panic_button',
  ROUTE_DEVIATION: 'route_deviation',
  EMERGENCY_CONTACT: 'emergency_contact',
  SOS: 'sos'
};

export const DocumentType = {
  DRIVING_LICENSE: 'driving_license',
  VEHICLE_REGISTRATION: 'vehicle_registration',
  INSURANCE: 'insurance',
  AADHAR: 'aadhar',
  PHOTO: 'photo'
};