import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, QrCode, Shield, Calendar, Phone, FileText } from 'lucide-react';
import { getStoredData, setStoredData } from '@/lib/mockData';
import { generateTouristHash } from '@/lib/utils/crypto';
import QRCode from 'qrcode';

const TouristOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [currentTourist, setCurrentTourist] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    documentType: '',
    documentNumber: '',
    tripStartDate: '',
    tripEndDate: '',
    emergencyContact: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const blockchainHash = generateTouristHash({
      fullName: formData.fullName,
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      timestamp
    });

    const tourist = {
      id: `tourist-${Date.now()}`,
      ...formData,
      safetyScore: 100,
      location: {
        lat: 31.1048,
        lng: 77.1734
      },
      // Default Himachal center
      digitalId: {
        qrCode: `${formData.fullName}-${formData.documentNumber}-${timestamp}`,
        blockchainHash,
        issuedAt: timestamp
      },
      alerts: []
    };

    // Generate QR Code
    try {
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
        name: tourist.fullName,
        id: tourist.id,
        document: tourist.documentNumber,
        hash: blockchainHash
      }));
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }

    // Store tourist data
    const tourists = getStoredData('smart-safar-tourists', []);
    tourists.push(tourist);
    setStoredData('smart-safar-tourists', tourists);
    setStoredData('current-tourist', tourist);
    setCurrentTourist(tourist);
    setStep('digital-id');
  };

  const proceedToMap = () => {
    navigate('/map');
  };

  if (step === 'digital-id' && currentTourist) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <CheckCircle className="h-12 w-12 text-success mx-auto" />
          <h1 className="text-2xl font-bold text-primary">Digital ID Generated Successfully</h1>
          <p className="text-muted-foreground">Your digital identity has been verified and registered on the blockchain</p>
        </div>

        <Card className="digital-id-card text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white">Smart Safar Digital ID</CardTitle>
            <CardDescription className="text-white/80">Government of Himachal Pradesh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">{currentTourist.fullName}</h3>
                <p className="text-white/80">{currentTourist.documentType.toUpperCase()}: {currentTourist.documentNumber}</p>
                <p className="text-white/80 text-sm">ID: {currentTourist.id}</p>
              </div>
            </div>

            <Separator className="bg-white/20" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-white/80">Trip Duration</Label>
                <div className="flex items-center space-x-1 text-white">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(currentTourist.tripStartDate).toLocaleDateString()} - {new Date(currentTourist.tripEndDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <Label className="text-white/80">Emergency Contact</Label>
                <div className="flex items-center space-x-1 text-white">
                  <Phone className="h-4 w-4" />
                  <span>{currentTourist.emergencyContact}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-white/20" />

            <div className="flex justify-between items-center">
              <div className="text-center">
                <Label className="text-white/80 block mb-2">QR Code</Label>
                {qrCodeDataUrl && (
                  <div className="bg-white p-2 rounded">
                    <img src={qrCodeDataUrl} alt="QR Code" className="w-16 h-16" />
                  </div>
                )}
              </div>
              <div className="flex-1 ml-4">
                <Label className="text-white/80 block mb-2">Blockchain Verification</Label>
                <div className="bg-white/20 p-2 rounded text-xs font-mono break-all text-white">
                  {currentTourist.digitalId.blockchainHash}
                </div>
                <Badge variant="secondary" className="mt-2 bg-success text-success-foreground">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={proceedToMap} size="lg" variant="authority">
            Proceed to Safety Map
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Your safety journey begins now. Monitor your location and stay within safe zones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-primary">
            <Shield className="h-6 w-6" />
            <span>Tourist Registration</span>
          </CardTitle>
          <CardDescription>Complete your Digital Identity Verification for Safe Travel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                type="text" 
                value={formData.fullName} 
                onChange={e => setFormData({
                  ...formData,
                  fullName: e.target.value
                })} 
                required 
                placeholder="Enter your full name" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select 
                value={formData.documentType} 
                onValueChange={(value) => setFormData({
                  ...formData,
                  documentType: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number</Label>
              <Input 
                id="documentNumber" 
                type="text" 
                value={formData.documentNumber} 
                onChange={e => setFormData({
                  ...formData,
                  documentNumber: e.target.value
                })} 
                required 
                placeholder="Enter document number" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tripStartDate">Trip Start Date</Label>
                <Input 
                  id="tripStartDate" 
                  type="date" 
                  value={formData.tripStartDate} 
                  onChange={e => setFormData({
                    ...formData,
                    tripStartDate: e.target.value
                  })} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tripEndDate">Trip End Date</Label>
                <Input 
                  id="tripEndDate" 
                  type="date" 
                  value={formData.tripEndDate} 
                  onChange={e => setFormData({
                    ...formData,
                    tripEndDate: e.target.value
                  })} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input 
                id="emergencyContact" 
                type="tel" 
                value={formData.emergencyContact} 
                onChange={e => setFormData({
                  ...formData,
                  emergencyContact: e.target.value
                })} 
                required 
                placeholder="+91-XXXXXXXXXX" 
              />
            </div>

            <Button type="submit" className="w-full" variant="authority">
              Generate Digital ID
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TouristOnboarding;