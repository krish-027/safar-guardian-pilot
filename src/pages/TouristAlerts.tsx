import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, MapPin, Zap, Shield } from 'lucide-react';
import { getStoredData, setStoredData } from '@/lib/mockData';
import { Alert as AlertType, Tourist } from '@/types';
import { useToast } from '@/hooks/use-toast';

const TouristAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [currentTourist, setCurrentTourist] = useState<Tourist | null>(null);

  useEffect(() => {
    const tourist = getStoredData<Tourist | null>('current-tourist', null);
    setCurrentTourist(tourist);
    
    const allAlerts = getStoredData<AlertType[]>('smart-safar-alerts', []);
    // Filter alerts for current tourist
    const touristAlerts = tourist ? allAlerts.filter(alert => alert.touristId === tourist.id) : [];
    setAlerts(touristAlerts);
  }, []);

  const simulateAlert = (type: 'geofence' | 'panic' | 'anomaly') => {
    if (!currentTourist) return;

    const alertTitles = {
      geofence: 'Geofence Violation',
      panic: 'Emergency SOS Triggered',
      anomaly: 'Unusual Activity Detected'
    };

    const alertDescriptions = {
      geofence: 'You have entered a restricted area',
      panic: 'Emergency alert has been sent to authorities',
      anomaly: 'Irregular movement pattern detected'
    };

    const newAlert: AlertType = {
      id: `alert-${Date.now()}`,
      touristId: currentTourist.id,
      type,
      title: alertTitles[type],
      description: alertDescriptions[type],
      location: currentTourist.location,
      timestamp: new Date().toISOString(),
      severity: type === 'panic' ? 'high' : type === 'geofence' ? 'medium' : 'low',
      resolved: false
    };

    const allAlerts = getStoredData<AlertType[]>('smart-safar-alerts', []);
    allAlerts.unshift(newAlert);
    setStoredData('smart-safar-alerts', allAlerts);

    // Update local state
    setAlerts([newAlert, ...alerts]);

    // Update tourist safety score
    const scoreDeduction = type === 'panic' ? 25 : type === 'geofence' ? 15 : 10;
    const updatedTourist = {
      ...currentTourist,
      safetyScore: Math.max(currentTourist.safetyScore - scoreDeduction, 0),
      alerts: [newAlert, ...currentTourist.alerts]
    };
    setCurrentTourist(updatedTourist);
    setStoredData('current-tourist', updatedTourist);

    toast({
      title: `${alertTitles[type]} Simulated`,
      description: alertDescriptions[type],
      variant: type === 'panic' ? 'destructive' : 'default'
    });
  };

  const getAlertIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'geofence':
        return <MapPin className="h-4 w-4" />;
      case 'panic':
        return <Zap className="h-4 w-4" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  if (!currentTourist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No Tourist Profile Found</h2>
        <p className="text-muted-foreground">Please complete registration first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Safety Alerts</h1>
          <p className="text-muted-foreground">Monitor your safety status and recent alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Safety Score: <span className="font-semibold">{currentTourist.safetyScore}/100</span>
          </span>
        </div>
      </div>

      {/* Alert Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Simulate Alerts (Demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => simulateAlert('geofence')}
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>Geofence Alert</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => simulateAlert('panic')}
              className="flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Panic Alert</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => simulateAlert('anomaly')}
              className="flex items-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Anomaly Alert</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Alerts</h2>
        
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Alerts</h3>
              <p className="text-muted-foreground">
                You're safe! No alerts have been triggered yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => {
            const { date, time } = formatTimestamp(alert.timestamp);
            return (
              <Card key={alert.id} className={`border-l-4 ${
                alert.severity === 'high' ? 'border-l-destructive' :
                alert.severity === 'medium' ? 'border-l-warning' :
                'border-l-muted'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full mt-1 ${
                        alert.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                        alert.severity === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.resolved && (
                            <Badge variant="secondary">Resolved</Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-2">{alert.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{date} at {time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Stay within designated safe zones when exploring remote areas</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Keep your emergency contact updated and accessible</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Use the SOS button only in genuine emergencies</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <p>Monitor weather conditions and follow local guidelines</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TouristAlerts;