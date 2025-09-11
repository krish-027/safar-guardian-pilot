import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Copy, Shield, QrCode, Calendar, Phone, User, FileText } from 'lucide-react';
import { Tourist } from '@/types';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

interface DigitalIdCardProps {
  tourist: Tourist;
  showQRCode?: boolean;
}

const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ tourist, showQRCode = true }) => {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

  React.useEffect(() => {
    if (showQRCode) {
      const qrData = JSON.stringify({
        id: tourist.id,
        name: tourist.fullName,
        document: `${tourist.documentType.toUpperCase()}: ${tourist.documentNumber}`,
        hash: tourist.digitalId.blockchainHash
      });

      QRCodeLib.toDataURL(qrData, {
        width: 200,
        color: {
          dark: '#0B3D91',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl).catch(console.error);
    }
  }, [tourist, showQRCode]);

  const copyBlockchainProof = async () => {
    try {
      await navigator.clipboard.writeText(tourist.digitalId.blockchainHash);
      toast({
        title: 'Blockchain Proof Copied',
        description: 'SHA-256 hash copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy blockchain proof',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="digital-id-card max-w-md mx-auto overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-muted text-primary-foreground p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">SMART SAFAR</h2>
              <p className="text-sm opacity-90">Digital Tourist ID</p>
            </div>
            <Shield className="h-8 w-8 opacity-80" />
          </div>
          
          {/* Tourist Photo Placeholder */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{tourist.fullName}</h3>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                ID: {tourist.id.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-card space-y-4">
          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Document</p>
                <p className="font-medium">{tourist.documentType.toUpperCase()}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Number</p>
              <p className="font-medium">{tourist.documentNumber}</p>
            </div>
          </div>

          {/* Trip Dates */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <p className="text-muted-foreground">Trip Start</p>
                <p className="font-medium">{formatDate(tourist.tripStartDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trip End</p>
                <p className="font-medium">{formatDate(tourist.tripEndDate)}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Emergency Contact</p>
              <p className="font-medium">{tourist.emergencyContact}</p>
            </div>
          </div>

          {/* QR Code */}
          {showQRCode && qrCodeUrl && (
            <div className="flex justify-center py-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <QrCode className="h-4 w-4" />
                  <span className="text-sm font-medium">Digital ID QR Code</span>
                </div>
                <img src={qrCodeUrl} alt="Digital ID QR Code" className="mx-auto border border-border rounded" />
              </div>
            </div>
          )}

          {/* Blockchain Proof */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Blockchain Verification</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs">VERIFIED</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Proof shown for prototype demo</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyBlockchainProof}
                className="h-8 px-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="bg-muted p-3 rounded text-xs font-mono break-all">
              {tourist.digitalId.blockchainHash}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Issued: {new Date(tourist.digitalId.issuedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalIdCard;