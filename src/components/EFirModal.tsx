import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Clock, MapPin, User } from 'lucide-react';
import { Tourist, Alert } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface EFirModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourist: Tourist | null;
  alerts: Alert[];
}

const EFirModal: React.FC<EFirModalProps> = ({ open, onOpenChange, tourist, alerts }) => {
  const { toast } = useToast();

  const handleDownloadSample = () => {
    // Check if sample PDF exists, otherwise show placeholder
    const link = document.createElement('a');
    link.href = '/assets/efir_sample.pdf';
    link.download = 'smart_safar_efir_sample.pdf';
    
    // Test if file exists
    fetch('/assets/efir_sample.pdf')
      .then(response => {
        if (response.ok) {
          link.click();
          toast({
            title: 'Sample E-FIR Downloaded',
            description: 'Demo E-FIR PDF has been downloaded',
          });
        } else {
          throw new Error('File not found');
        }
      })
      .catch(() => {
        toast({
          title: 'Sample E-FIR (Simulated)',
          description: 'In production, this would download the actual E-FIR PDF',
        });
      });
  };

  if (!tourist) return null;

  const recentAlerts = alerts.filter(a => a.touristId === tourist.id).slice(0, 3);
  const highSeverityAlert = recentAlerts.find(a => a.severity === 'high');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            E-FIR (Demo)
          </DialogTitle>
          <DialogDescription>
            Electronic First Information Report generation is mocked in this prototype
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo Notice */}
          <Card className="border-warning bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-warning-foreground">Prototype Demo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    E-FIR generation is mocked in this prototype. In production, this would generate 
                    an official PDF report and submit to backend systems. For demo purposes, this 
                    action shows a placeholder summary.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tourist Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Tourist Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{tourist.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Document</p>
                  <p className="font-medium">{tourist.documentType.toUpperCase()}: {tourist.documentNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{tourist.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Safety Score</p>
                  <Badge variant={tourist.safetyScore > 70 ? 'default' : tourist.safetyScore > 40 ? 'secondary' : 'destructive'}>
                    {tourist.safetyScore}/100
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Summary */}
          {recentAlerts.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Recent Incidents</h3>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' : 
                        alert.severity === 'medium' ? 'secondary' : 'outline'
                      }>
                        {alert.type.toUpperCase()}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">E-FIR Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Report Type:</span>
                  <span className="font-medium">
                    {highSeverityAlert ? 'Emergency Incident' : 'Safety Monitoring'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Generated:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Incident Count:</span>
                  <span className="font-medium">{recentAlerts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={tourist.safetyScore > 40 ? 'default' : 'destructive'}>
                    {tourist.safetyScore > 40 ? 'Active Monitoring' : 'Critical Alert'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleDownloadSample} className="gap-2">
            <Download className="h-4 w-4" />
            Download Sample PDF (Demo)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EFirModal;