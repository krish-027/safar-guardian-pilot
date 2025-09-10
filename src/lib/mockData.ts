import { Tourist, Alert, GeofenceZone } from '@/types';

// Himachal Pradesh coordinates
const HIMACHAL_CENTER = { lat: 31.1048, lng: 77.1734 };

export const geofenceZones: GeofenceZone[] = [
  {
    id: 'zone-1',
    name: 'Great Himalayan National Park - Restricted Area',
    type: 'restricted',
    coordinates: [
      [77.3000, 31.5000],
      [77.3500, 31.5000],
      [77.3500, 31.5500],
      [77.3000, 31.5500],
      [77.3000, 31.5000]
    ],
    description: 'Protected wildlife sanctuary with limited access',
    color: '#E53935'
  },
  {
    id: 'zone-2',
    name: 'Cliff Trail - High Risk Zone',
    type: 'danger',
    coordinates: [
      [77.1000, 31.0500],
      [77.1500, 31.0500],
      [77.1500, 31.1000],
      [77.1000, 31.1000],
      [77.1000, 31.0500]
    ],
    description: 'Steep cliff area prone to landslides',
    color: '#FF9800'
  }
];

export const mockTourists: Tourist[] = [
  {
    id: 'tourist-1',
    fullName: 'Rajesh Kumar',
    documentType: 'aadhaar',
    documentNumber: '1234-5678-9012',
    tripStartDate: '2024-01-15',
    tripEndDate: '2024-01-22',
    emergencyContact: '+91-9876543210',
    safetyScore: 85,
    location: { lat: 31.1048, lng: 77.1734 },
    digitalId: {
      qrCode: 'QR_CODE_DATA_1',
      blockchainHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      issuedAt: '2024-01-15T10:30:00Z'
    },
    alerts: []
  },
  {
    id: 'tourist-2',
    fullName: 'Priya Sharma',
    documentType: 'passport',
    documentNumber: 'P1234567',
    tripStartDate: '2024-01-10',
    tripEndDate: '2024-01-20',
    emergencyContact: '+91-9876543211',
    safetyScore: 70,
    location: { lat: 31.2000, lng: 77.2000 },
    digitalId: {
      qrCode: 'QR_CODE_DATA_2',
      blockchainHash: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
      issuedAt: '2024-01-10T09:15:00Z'
    },
    alerts: []
  },
  {
    id: 'tourist-3',
    fullName: 'David Johnson',
    documentType: 'passport',
    documentNumber: 'US123456789',
    tripStartDate: '2024-01-12',
    tripEndDate: '2024-01-25',
    emergencyContact: '+1-555-123-4567',
    safetyScore: 95,
    location: { lat: 31.0500, lng: 77.1200 },
    digitalId: {
      qrCode: 'QR_CODE_DATA_3',
      blockchainHash: 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
      issuedAt: '2024-01-12T14:20:00Z'
    },
    alerts: []
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    touristId: 'tourist-1',
    type: 'geofence',
    title: 'Geofence Violation',
    description: 'Tourist entered restricted area: Great Himalayan National Park',
    location: { lat: 31.5200, lng: 77.3200 },
    timestamp: '2024-01-16T14:30:00Z',
    severity: 'high',
    resolved: false
  },
  {
    id: 'alert-2',
    touristId: 'tourist-2',
    type: 'panic',
    title: 'Emergency SOS Triggered',
    description: 'Tourist activated panic button',
    location: { lat: 31.2000, lng: 77.2000 },
    timestamp: '2024-01-16T12:15:00Z',
    severity: 'high',
    resolved: true
  },
  {
    id: 'alert-3',
    touristId: 'tourist-1',
    type: 'anomaly',
    title: 'Unusual Movement Pattern',
    description: 'Tourist has been stationary for over 3 hours',
    location: { lat: 31.1048, lng: 77.1734 },
    timestamp: '2024-01-16T16:45:00Z',
    severity: 'medium',
    resolved: false
  },
  {
    id: 'alert-4',
    touristId: 'tourist-3',
    type: 'geofence',
    title: 'High Risk Zone Entry',
    description: 'Tourist approaching cliff trail danger zone',
    location: { lat: 31.0750, lng: 77.1250 },
    timestamp: '2024-01-16T11:20:00Z',
    severity: 'medium',
    resolved: true
  },
  {
    id: 'alert-5',
    touristId: 'tourist-2',
    type: 'anomaly',
    title: 'Low Battery Alert',
    description: 'Tourist device battery critically low',
    location: { lat: 31.2000, lng: 77.2000 },
    timestamp: '2024-01-16T08:30:00Z',
    severity: 'low',
    resolved: true
  }
];

// localStorage utilities
export const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store data:', error);
  }
};

// Initialize data in localStorage
export const initializeData = (): void => {
  if (!localStorage.getItem('smart-safar-tourists')) {
    setStoredData('smart-safar-tourists', mockTourists);
  }
  if (!localStorage.getItem('smart-safar-alerts')) {
    setStoredData('smart-safar-alerts', mockAlerts);
  }
  if (!localStorage.getItem('smart-safar-geofences')) {
    setStoredData('smart-safar-geofences', geofenceZones);
  }
};