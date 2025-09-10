export interface Tourist {
  id: string;
  fullName: string;
  documentType: 'aadhaar' | 'passport';
  documentNumber: string;
  tripStartDate: string;
  tripEndDate: string;
  emergencyContact: string;
  safetyScore: number;
  location: {
    lat: number;
    lng: number;
  };
  digitalId: {
    qrCode: string;
    blockchainHash: string;
    issuedAt: string;
  };
  alerts: Alert[];
}

export interface Alert {
  id: string;
  touristId: string;
  type: 'geofence' | 'panic' | 'anomaly';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'restricted' | 'danger' | 'safe';
  coordinates: [number, number][];
  description: string;
  color: string;
}

export interface DashboardStats {
  totalTourists: number;
  activeAlerts: number;
  averageSafetyScore: number;
  resolvedAlerts: number;
}