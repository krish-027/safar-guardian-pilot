// Type definitions converted to JSDoc comments for documentation

/**
 * @typedef {Object} Tourist
 * @property {string} id
 * @property {string} fullName
 * @property {'aadhaar'|'passport'} documentType
 * @property {string} documentNumber
 * @property {string} tripStartDate
 * @property {string} tripEndDate
 * @property {string} emergencyContact
 * @property {number} safetyScore
 * @property {Object} location
 * @property {number} location.lat
 * @property {number} location.lng
 * @property {Object} digitalId
 * @property {string} digitalId.qrCode
 * @property {string} digitalId.blockchainHash
 * @property {string} digitalId.issuedAt
 * @property {Alert[]} alerts
 */

/**
 * @typedef {Object} Alert
 * @property {string} id
 * @property {string} touristId
 * @property {'geofence'|'panic'|'anomaly'} type
 * @property {string} title
 * @property {string} description
 * @property {Object} location
 * @property {number} location.lat
 * @property {number} location.lng
 * @property {string} timestamp
 * @property {'low'|'medium'|'high'} severity
 * @property {boolean} resolved
 */

/**
 * @typedef {Object} GeofenceZone
 * @property {string} id
 * @property {string} name
 * @property {'restricted'|'danger'|'safe'} type
 * @property {Array<[number, number]>} coordinates
 * @property {string} description
 * @property {string} color
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalTourists
 * @property {number} activeAlerts
 * @property {number} averageSafetyScore
 * @property {number} resolvedAlerts
 */