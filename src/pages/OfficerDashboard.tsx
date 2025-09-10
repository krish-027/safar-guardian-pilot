import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Clock, 
  FileText,
  Download,
  Eye
} from 'lucide-react';
import { getStoredData } from '@/lib/mockData';
import { Tourist, Alert as AlertType, DashboardStats } from '@/types';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

const OfficerDashboard = () => {
  const { toast } = useToast();
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalTourists: 0,
    activeAlerts: 0,
    averageSafetyScore: 0,
    resolvedAlerts: 0
  });
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);

  useEffect(() => {
    const touristsData = getStoredData<Tourist[]>('smart-safar-tourists', []);
    const alertsData = getStoredData<AlertType[]>('smart-safar-alerts', []);
    
    setTourists(touristsData);
    setAlerts(alertsData);

    // Calculate stats
    const activeAlerts = alertsData.filter(alert => !alert.resolved).length;
    const resolvedAlerts = alertsData.filter(alert => alert.resolved).length;
    const averageSafetyScore = touristsData.length > 0 
      ? Math.round(touristsData.reduce((sum, tourist) => sum + tourist.safetyScore, 0) / touristsData.length)
      : 0;

    setStats({
      totalTourists: touristsData.length,
      activeAlerts,
      averageSafetyScore,
      resolvedAlerts
    });
  }, []);

  const generateEFIR = (tourist: Tourist) => {
    const touristAlerts = alerts.filter(alert => alert.touristId === tourist.id);
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('ELECTRONIC FIRST INFORMATION REPORT (E-FIR)', 20, 30);
    doc.setFontSize(12);
    doc.text('Smart Safar - Tourist Safety Management System', 20, 40);
    doc.text('Government of Himachal Pradesh', 20, 50);
    
    // Tourist Details
    doc.setFontSize(14);
    doc.text('Tourist Information:', 20, 70);
    doc.setFontSize(10);
    doc.text(`Name: ${tourist.fullName}`, 20, 80);
    doc.text(`Document: ${tourist.documentType.toUpperCase()} - ${tourist.documentNumber}`, 20, 90);
    doc.text(`Tourist ID: ${tourist.id}`, 20, 100);
    doc.text(`Emergency Contact: ${tourist.emergencyContact}`, 20, 110);
    doc.text(`Current Safety Score: ${tourist.safetyScore}/100`, 20, 120);
    doc.text(`Location: ${tourist.location.lat.toFixed(6)}, ${tourist.location.lng.toFixed(6)}`, 20, 130);
    
    // Alerts Section
    doc.setFontSize(14);
    doc.text('Alert History:', 20, 150);
    
    let yPosition = 160;
    if (touristAlerts.length > 0) {
      touristAlerts.slice(0, 5).forEach((alert, index) => {
        doc.setFontSize(10);
        doc.text(`${index + 1}. ${alert.title} (${alert.severity.toUpperCase()})`, 25, yPosition);
        doc.text(`   ${alert.description}`, 25, yPosition + 8);
        doc.text(`   Time: ${new Date(alert.timestamp).toLocaleString()}`, 25, yPosition + 16);
        doc.text(`   Location: ${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}`, 25, yPosition + 24);
        doc.text(`   Status: ${alert.resolved ? 'Resolved' : 'Active'}`, 25, yPosition + 32);
        yPosition += 45;
      });
    } else {
      doc.setFontSize(10);
      doc.text('No alerts recorded for this tourist.', 25, yPosition);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);
    doc.text('This is a system-generated document from Smart Safar TSMS', 20, 285);
    
    // Save the PDF
    doc.save(`E-FIR_${tourist.fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
    
    toast({
      title: "E-FIR Generated",
      description: `Electronic FIR for ${tourist.fullName} has been downloaded.`
    });
  };

  const getTouristAlerts = (touristId: string) => {
    return alerts.filter(alert => alert.touristId === touristId);
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Officer Dashboard</h1>
        <p className="text-muted-foreground">Monitor tourist safety and manage emergency responses</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tourists</p>
                <p className="text-2xl font-bold">{stats.totalTourists}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-destructive/20 rounded-full">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{stats.activeAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/20 rounded-full">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Safety Score</p>
                <p className="text-2xl font-bold">{stats.averageSafetyScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-muted rounded-full">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved Alerts</p>
                <p className="text-2xl font-bold">{stats.resolvedAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Tourist Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg relative map-container flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">Live Tourist Tracking Map</p>
                <p className="text-sm text-muted-foreground">Himachal Pradesh with geofence zones</p>
              </div>
              
              {/* Simulated tourist pins */}
              <div className="absolute top-4 right-4 space-y-1">
                {tourists.slice(0, 3).map((tourist, index) => (
                  <div key={tourist.id} className="flex items-center space-x-2 bg-card p-1 rounded text-xs shadow">
                    <div className={`w-2 h-2 rounded-full ${
                      tourist.safetyScore >= 80 ? 'bg-success' :
                      tourist.safetyScore >= 60 ? 'bg-warning' : 'bg-destructive'
                    }`}></div>
                    <span>{tourist.fullName}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Alerts Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Live Alert Feed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.slice(0, 6).map((alert) => {
                const tourist = tourists.find(t => t.id === alert.touristId);
                return (
                  <div key={alert.id} className="flex items-start space-x-3 p-2 border rounded">
                    <div className={`p-1 rounded-full mt-1 ${
                      alert.severity === 'high' ? 'bg-destructive/20 text-destructive' :
                      alert.severity === 'medium' ? 'bg-warning/20 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <Badge variant={getAlertSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tourist?.fullName} • {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tourist Management */}
      <Card>
        <CardHeader>
          <CardTitle>Tourist Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tourists.map((tourist) => {
              const touristAlerts = getTouristAlerts(tourist.id);
              const activeAlerts = touristAlerts.filter(alert => !alert.resolved);
              
              return (
                <div key={tourist.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      tourist.safetyScore >= 80 ? 'bg-success' :
                      tourist.safetyScore >= 60 ? 'bg-warning' : 'bg-destructive'
                    }`}></div>
                    <div>
                      <h3 className="font-semibold">{tourist.fullName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tourist.documentType.toUpperCase()}: {tourist.documentNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Safety Score: {tourist.safetyScore}/100</p>
                      <p className="text-xs text-muted-foreground">
                        {activeAlerts.length} active alert{activeAlerts.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedTourist(tourist)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Tourist Details - {tourist.fullName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Tourist Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Document</Label>
                                <p className="text-sm">{tourist.documentType.toUpperCase()}: {tourist.documentNumber}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Emergency Contact</Label>
                                <p className="text-sm">{tourist.emergencyContact}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Trip Duration</Label>
                                <p className="text-sm">
                                  {new Date(tourist.tripStartDate).toLocaleDateString()} - {new Date(tourist.tripEndDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Safety Score</Label>
                                <p className="text-sm">{tourist.safetyScore}/100</p>
                              </div>
                            </div>
                            
                            {/* Alerts */}
                            <div>
                              <Label className="text-sm font-medium mb-2 block">Alert History</Label>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {touristAlerts.length > 0 ? (
                                  touristAlerts.map((alert) => (
                                    <div key={alert.id} className="flex items-center justify-between p-2 border rounded text-sm">
                                      <div>
                                        <p className="font-medium">{alert.title}</p>
                                        <p className="text-muted-foreground text-xs">{alert.description}</p>
                                      </div>
                                      <div className="text-right">
                                        <Badge variant={getAlertSeverityColor(alert.severity)} className="text-xs">
                                          {alert.severity}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {new Date(alert.timestamp).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-muted-foreground text-sm">No alerts recorded</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        onClick={() => generateEFIR(tourist)}
                        variant="authority"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        E-FIR
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default OfficerDashboard;