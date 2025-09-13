import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Phone, 
  Navigation,
  Zap
} from 'lucide-react';
import { getStoredData, setStoredData } from '@/lib/mockData';
import { checkGeofenceViolation } from '@/lib/utils/geofence';
import { Tourist, Alert as AlertType, GeofenceZone } from '@/types';
import { useToast } from '@/hooks/use-toast';

const TouristMap = () => {
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [currentTourist, setCurrentTourist] = useState<Tourist | null>(null);
  const [touristLocation, setTouristLocation] = useState({ lat: 31.1048, lng: 77.1734 });
  const [geofenceZones, setGeofenceZones] = useState<GeofenceZone[]>([]);
  const [isInRestrictedZone, setIsInRestrictedZone] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    let tourist = getStoredData<Tourist | null>('current-tourist', null);
    const zones = getStoredData<GeofenceZone[]>('smart-safar-geofences', []);
    
    // If no tourist exists, create a mock one for demo
    if (!tourist) {
      tourist = {
        id: 'demo-tourist-1',
        fullName: 'Demo Tourist',
        documentType: 'aadhaar',
        documentNumber: 'XXXX-XXXX-1234',
        tripStartDate: new Date().toISOString().split('T')[0],
        tripEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        emergencyContact: '+91-98765-43210',
        safetyScore: 85,
        location: { lat: 31.1048, lng: 77.1734 },
        digitalId: {
          qrCode: 'demo-qr-code',
          blockchainHash: 'demo-hash-123456',
          issuedAt: new Date().toISOString()
        },
        alerts: []
      };
      setStoredData('current-tourist', tourist);
    }
    
    setCurrentTourist(tourist);
    setTouristLocation(tourist.location);
    setGeofenceZones(zones);
  }, []);

  useEffect(() => {
    if (geofenceZones.length > 0) {
      const violation = checkGeofenceViolation(touristLocation, geofenceZones);
      const wasInZone = isInRestrictedZone;
      const nowInZone = violation !== null;
      
      setIsInRestrictedZone(nowInZone);
      
      // Trigger alert if entering a restricted zone
      if (!wasInZone && nowInZone && currentTourist && violation) {
        triggerGeofenceAlert(violation);
      }
    }
  }, [touristLocation, geofenceZones, currentTourist]);

  const triggerGeofenceAlert = (zone: GeofenceZone) => {
    if (!currentTourist) return;

    const alert: AlertType = {
      id: `alert-${Date.now()}`,
      touristId: currentTourist.id,
      type: 'geofence',
      title: 'Geofence Violation',
      description: `Tourist entered ${zone.type} area: ${zone.name}`,
      location: touristLocation,
      timestamp: new Date().toISOString(),
      severity: zone.type === 'restricted' ? 'high' : 'medium',
      resolved: false
    };

    const alerts = getStoredData<AlertType[]>('smart-safar-alerts', []);
    alerts.unshift(alert);
    setStoredData('smart-safar-alerts', alerts);

    // Update tourist safety score
    const updatedTourist = {
      ...currentTourist,
      safetyScore: Math.max(currentTourist.safetyScore - 15, 0),
      alerts: [alert, ...currentTourist.alerts]
    };
    setCurrentTourist(updatedTourist);
    setStoredData('current-tourist', updatedTourist);

    toast({
      title: "Geofence Alert",
      description: `You've entered a ${zone.type} zone: ${zone.name}`,
      variant: "destructive"
    });
  };

  const triggerPanicAlert = () => {
    if (!currentTourist) return;

    const alert: AlertType = {
      id: `alert-${Date.now()}`,
      touristId: currentTourist.id,
      type: 'panic',
      title: 'Emergency SOS Triggered',
      description: 'Tourist activated panic button - immediate assistance required',
      location: touristLocation,
      timestamp: new Date().toISOString(),
      severity: 'high',
      resolved: false
    };

    const alerts = getStoredData<AlertType[]>('smart-safar-alerts', []);
    alerts.unshift(alert);
    setStoredData('smart-safar-alerts', alerts);

    // Update tourist
    const updatedTourist = {
      ...currentTourist,
      safetyScore: Math.max(currentTourist.safetyScore - 25, 0),
      alerts: [alert, ...currentTourist.alerts]
    };
    setCurrentTourist(updatedTourist);
    setStoredData('current-tourist', updatedTourist);

    toast({
      title: "Emergency Alert Sent",
      description: "Authorities have been notified. Help is on the way.",
      variant: "destructive"
    });
  };

  const moveTourist = (direction: 'north' | 'south' | 'east' | 'west') => {
    const delta = 0.01; // Approximately 1km
    let newLocation = { ...touristLocation };

    switch (direction) {
      case 'north':
        newLocation.lat += delta;
        break;
      case 'south':
        newLocation.lat -= delta;
        break;
      case 'east':
        newLocation.lng += delta;
        break;
      case 'west':
        newLocation.lng -= delta;
        break;
    }

    setTouristLocation(newLocation);
    
    if (currentTourist) {
      const updatedTourist = { ...currentTourist, location: newLocation };
      setCurrentTourist(updatedTourist);
      setStoredData('current-tourist', updatedTourist);
    }
  };

  const handleMapboxTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      // In a real app, you would initialize Mapbox here
      toast({
        title: "Map Initialized",
        description: "Interactive map is now ready with your Mapbox token."
      });
    }
  };

  // Show loading state if tourist data isn't ready yet
  if (!currentTourist) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading tourist data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Safety Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${currentTourist.safetyScore >= 80 ? 'bg-success/20' : currentTourist.safetyScore >= 60 ? 'bg-warning/20' : 'bg-destructive/20'}`}>
                <Shield className={`h-5 w-5 ${currentTourist.safetyScore >= 80 ? 'text-success' : currentTourist.safetyScore >= 60 ? 'text-warning' : 'text-destructive'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Safety Score</p>
                <p className="text-2xl font-bold">{currentTourist.safetyScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Location</p>
                <p className="text-sm font-medium">{touristLocation.lat.toFixed(4)}, {touristLocation.lng.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${isInRestrictedZone ? 'bg-destructive/20' : 'bg-success/20'}`}>
                <AlertTriangle className={`h-5 w-5 ${isInRestrictedZone ? 'text-destructive' : 'text-success'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zone Status</p>
                <Badge variant={isInRestrictedZone ? 'destructive' : 'secondary'}>
                  {isInRestrictedZone ? 'Restricted Zone' : 'Safe Zone'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geofence Alert */}
      {isInRestrictedZone && (
        <Alert className="alert-danger">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You are currently in a restricted or dangerous area. Please move to a safe zone immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Northeast Safety Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showTokenInput ? (
            <div className="space-y-4 p-8 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Mapbox Integration Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  To view the interactive map, please enter your Mapbox public token.
                  You can get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
                </p>
                <div className="flex space-x-2 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Enter Mapbox public token"
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input rounded-md"
                  />
                  <Button onClick={handleMapboxTokenSubmit}>
                    Initialize Map
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Placeholder Map */}
              <div className="h-96 bg-muted rounded-lg relative map-container flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">Interactive Mapbox map would appear here</p>
                  <p className="text-sm text-muted-foreground">Showing Northeast India with geofence zones</p>
                </div>
                
                {/* Simulated elements */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="flex items-center space-x-2 bg-card p-2 rounded shadow">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-xs">Restricted Areas</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-card p-2 rounded shadow">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span className="text-xs">Danger Zones</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-card p-2 rounded shadow">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-xs">Your Location</span>
                  </div>
                </div>
              </div>

              {/* Movement Controls */}
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-2 w-32">
                  <div></div>
                  <Button size="sm" variant="outline" onClick={() => moveTourist('north')}>
                    <Navigation className="h-4 w-4 rotate-0" />
                  </Button>
                  <div></div>
                  
                  <Button size="sm" variant="outline" onClick={() => moveTourist('west')}>
                    <Navigation className="h-4 w-4 -rotate-90" />
                  </Button>
                  <div className="flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <Button size="sm" variant="outline" onClick={() => moveTourist('east')}>
                    <Navigation className="h-4 w-4 rotate-90" />
                  </Button>
                  
                  <div></div>
                  <Button size="sm" variant="outline" onClick={() => moveTourist('south')}>
                    <Navigation className="h-4 w-4 rotate-180" />
                  </Button>
                  <div></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Panic Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          onClick={triggerPanicAlert}
          variant="emergency"
          className="rounded-full h-16 w-16 shadow-lg"
        >
          <div className="text-center">
            <Zap className="h-6 w-6 mx-auto" />
            <span className="text-xs font-bold">SOS</span>
          </div>
        </Button>
      </div>

      {/* Zone Information */}
      <Card>
        <CardHeader>
          <CardTitle>Geofence Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {geofenceZones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  ></div>
                  <div>
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm text-muted-foreground">{zone.description}</p>
                  </div>
                </div>
                <Badge variant={zone.type === 'restricted' ? 'destructive' : 'secondary'}>
                  {zone.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TouristMap;