import { Tourist, Alert, GeofenceZone, DashboardStats } from '@/types';

export interface SmartSafarData {
  tourists: Tourist[];
  alerts: Alert[];
  geofenceZones: GeofenceZone[];
  settings: {
    language: 'en' | 'hi';
    notifications: boolean;
    shareLocation: boolean;
    developerMode: boolean;
  };
}

const STORAGE_KEY = 'smartSafarData';

// Mock data for seeding
const mockData: SmartSafarData = {
  tourists: [
    {
      id: 'tourist-1',
      fullName: 'Rajesh Kumar',
      documentType: 'aadhaar',
      documentNumber: '1234-5678-9012',
      tripStartDate: '2024-01-15',
      tripEndDate: '2024-01-22',
      emergencyContact: 'Priya Kumar +91-9876543210',
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
      emergencyContact: 'Amit Sharma +91-9876543211',
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
      emergencyContact: 'Sarah Johnson +1-555-123-4567',
      safetyScore: 95,
      location: { lat: 31.0500, lng: 77.1200 },
      digitalId: {
        qrCode: 'QR_CODE_DATA_3',
        blockchainHash: 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
        issuedAt: '2024-01-12T14:20:00Z'
      },
      alerts: []
    }
  ],
  alerts: [
    {
      id: 'alert-1',
      touristId: 'tourist-1',
      type: 'geofence',
      title: 'Geofence Violation',
      description: 'Tourist entered restricted area: Forest Reserve',
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
  ],
  geofenceZones: [
    {
      id: 'zone-1',
      name: 'Forest Reserve',
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
      name: 'Cliff Trail',
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
  ],
  settings: {
    language: 'en',
    notifications: true,
    shareLocation: true,
    developerMode: false
  }
};

// Custom event for same-tab storage updates
export const dispatchStorageUpdate = () => {
  window.dispatchEvent(new CustomEvent('storage-update'));
};

// Listen for storage events (cross-tab and same-tab)
export const addStorageListener = (callback: () => void) => {
  const handleStorageChange = () => callback();
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('storage-update', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('storage-update', handleStorageChange);
  };
};

// Initialize data if not exists
export const initializeData = (): SmartSafarData => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      console.log('✅ Seeded smartSafarData');
      return mockData;
    }
    return JSON.parse(existing);
  } catch (error) {
    console.error('Failed to initialize data:', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    return mockData;
  }
};

// Read all data
export const readData = (): SmartSafarData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : initializeData();
  } catch (error) {
    console.error('Failed to read data:', error);
    return initializeData();
  }
};

// Write all data
export const writeData = (data: SmartSafarData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    dispatchStorageUpdate();
  } catch (error) {
    console.error('Failed to write data:', error);
  }
};

// Create a new alert
export const createAlert = (alert: Omit<Alert, 'id'>): Alert => {
  const newAlert: Alert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  const data = readData();
  data.alerts.unshift(newAlert); // Add to beginning for chronological order
  writeData(data);
  
  return newAlert;
};

// Update tourist
export const updateTourist = (touristId: string, updates: Partial<Tourist>): void => {
  const data = readData();
  const touristIndex = data.tourists.findIndex(t => t.id === touristId);
  
  if (touristIndex !== -1) {
    data.tourists[touristIndex] = { ...data.tourists[touristIndex], ...updates };
    writeData(data);
  }
};

// Add new tourist
export const addTourist = (tourist: Tourist): void => {
  const data = readData();
  data.tourists.push(tourist);
  writeData(data);
};

// Get tourist by ID
export const getTourist = (touristId: string): Tourist | null => {
  const data = readData();
  return data.tourists.find(t => t.id === touristId) || null;
};

// Get active tourist (first one for demo)
export const getActiveTourist = (): Tourist | null => {
  const data = readData();
  return data.tourists[0] || null;
};

// Update settings
export const updateSettings = (updates: Partial<SmartSafarData['settings']>): void => {
  const data = readData();
  data.settings = { ...data.settings, ...updates };
  writeData(data);
};

// Developer mode helpers
export const toggleDeveloperMode = (): boolean => {
  const data = readData();
  data.settings.developerMode = !data.settings.developerMode;
  writeData(data);
  return data.settings.developerMode;
};

export const isDeveloperMode = (): boolean => {
  const data = readData();
  return data.settings.developerMode;
};

// Demo script function
export const runDemoScript = async (): Promise<void> => {
  console.log('🎬 Running Smart Safar Demo Script...');
  
  // Step 1: Simulate geofence violation
  const tourist = getActiveTourist();
  if (tourist) {
    createAlert({
      touristId: tourist.id,
      type: 'geofence',
      title: 'Demo: Geofence Violation',
      description: 'Automated demo: Tourist entered Forest Reserve',
      location: { lat: 31.5200, lng: 77.3200 },
      timestamp: new Date().toISOString(),
      severity: 'high',
      resolved: false
    });
    
    updateTourist(tourist.id, { safetyScore: Math.max(tourist.safetyScore - 30, 0) });
    console.log('📍 Step 1: Geofence violation created');
  }
  
  // Step 2: Wait 2 seconds, then panic
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (tourist) {
    createAlert({
      touristId: tourist.id,
      type: 'panic',
      title: 'Demo: Emergency SOS',
      description: 'Automated demo: Panic button activated',
      location: tourist.location,
      timestamp: new Date().toISOString(),
      severity: 'high',
      resolved: false
    });
    
    updateTourist(tourist.id, { safetyScore: Math.max(tourist.safetyScore - 40, 0) });
    console.log('🚨 Step 2: Panic alert created');
  }
  
  // Step 3: Wait 2 seconds, then anomaly
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (tourist) {
    createAlert({
      touristId: tourist.id,
      type: 'anomaly',
      title: 'Demo: Anomaly Detection',
      description: 'Automated demo: Unusual movement pattern detected',
      location: tourist.location,
      timestamp: new Date().toISOString(),
      severity: 'medium',
      resolved: false
    });
    
    updateTourist(tourist.id, { safetyScore: Math.max(tourist.safetyScore - 20, 0) });
    console.log('🔍 Step 3: Anomaly alert created');
  }
  
  console.log('✅ Demo script completed');
};