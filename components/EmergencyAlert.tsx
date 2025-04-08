
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EmergencyAccessService } from "@/utils/emergencyAccessService";
import { PhoneCall, MapPin, AlertTriangle, QrCode, BadgeAlert, Scan } from 'lucide-react';

interface EmergencyAlertProps {
  providerId: string;
  providerName: string;
}

interface EmergencyData {
  type: string;
  patientId: string;
  patientName: string;
  location?: {
    latitude: number | null;
    longitude: number | null;
    timestamp: number;
    accuracy?: number;
  };
  timestamp: number;
  contact?: string;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ providerId, providerName }) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [scannedData, setScannedData] = useState<EmergencyData | null>(null);
  const [patientPin, setPatientPin] = useState('');
  const [patientId, setPatientId] = useState('');
  
  // Handle QR code scanning
  const handleScanQrCode = async () => {
    setIsScanning(true);
    
    try {
      // In a real app, we would use a camera API or the Web QR API to scan QR codes
      // Here we'll simulate scanning a QR code by generating mock data
      
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock emergency data that would be extracted from the QR code
      const mockEmergencyData: EmergencyData = {
        type: 'EMERGENCY',
        patientId: 'patient_123',
        patientName: 'Rajiv Kumar',
        location: {
          latitude: 19.076,
          longitude: 72.8777,
          timestamp: Date.now(),
          accuracy: 10
        },
        timestamp: Date.now(),
        contact: '+917020547943'
      };
      
      setScannedData(mockEmergencyData);
      setShowQrDialog(true);
      toast({
        title: "QR Code Scanned",
        description: "Emergency information retrieved successfully",
      });
    } catch (error) {
      console.error('Error scanning QR code:', error);
      toast({
        title: "Scanning Failed",
        description: "Failed to scan QR code",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  // Handle emergency PIN verification
  const handleVerifyPin = async () => {
    if (!patientPin || !patientId) {
      toast({
        title: "Missing Information",
        description: "Please enter both patient ID and PIN",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const result = await EmergencyAccessService.validateEmergencyPin(
        patientPin,
        patientId,
        providerId
      );
      
      if (result.valid) {
        toast({
          title: "Access Granted",
          description: "Emergency access has been granted",
        });
        
        // Mock emergency data that would be retrieved from the backend
        const mockEmergencyData: EmergencyData = {
          type: 'EMERGENCY',
          patientId: patientId,
          patientName: 'Rajiv Kumar',
          timestamp: Date.now()
        };
        
        setScannedData(mockEmergencyData);
        setShowQrDialog(true);
      } else {
        toast({
          title: "Access Denied",
          description: result.message || "Invalid or expired PIN",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify emergency PIN",
        variant: "destructive"
      });
    }
  };
  
  // Open Google Maps with the location
  const openMapsWithLocation = () => {
    if (scannedData?.location?.latitude && scannedData?.location?.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${scannedData.location.latitude},${scannedData.location.longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };
  
  // Call emergency contact
  const callEmergencyContact = () => {
    if (scannedData?.contact) {
      window.location.href = `tel:${scannedData.contact}`;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BadgeAlert className="mr-2 h-5 w-5 text-destructive" />
          Emergency Response
        </CardTitle>
        <CardDescription>
          Scan QR codes or verify PINs to access emergency information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center border">
            <Scan className="h-12 w-12 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-2">Scan QR Code</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Scan a patient's emergency QR code to access their medical information and location.
            </p>
            <Button 
              onClick={handleScanQrCode} 
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? "Scanning..." : "Scan QR Code"}
            </Button>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 text-center border">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-destructive" />
            <h3 className="font-medium mb-2">Enter Emergency PIN</h3>
            <div className="space-y-2 mb-4">
              <Input
                placeholder="Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
              <Input
                placeholder="Emergency PIN"
                value={patientPin}
                onChange={(e) => setPatientPin(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleVerifyPin} 
              variant="outline"
              className="w-full"
            >
              Verify PIN
            </Button>
          </div>
        </div>
        
        <Alert className="bg-red-500/10 border-red-200">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertTitle>Emergency Access Only</AlertTitle>
          <AlertDescription>
            This feature should only be used in emergency situations. All access attempts are logged and audited.
          </AlertDescription>
        </Alert>
      </CardContent>
      
      {/* Emergency Information Dialog */}
      <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <BadgeAlert className="mr-2 h-5 w-5" />
              Emergency Information
            </DialogTitle>
            <DialogDescription>
              Patient emergency information retrieved successfully.
            </DialogDescription>
          </DialogHeader>
          
          {scannedData && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Patient Name</h4>
                  <Badge>{scannedData.patientName}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Patient ID</h4>
                  <span className="text-sm">{scannedData.patientId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Emergency Timestamp</h4>
                  <span className="text-sm">{new Date(scannedData.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              {scannedData.location && (
                <Alert className="bg-blue-500/10 border-blue-200">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Patient Location</AlertTitle>
                  <AlertDescription className="flex flex-col space-y-2">
                    <span>
                      Lat: {scannedData.location.latitude}, Long: {scannedData.location.longitude}
                    </span>
                    <span>
                      Accuracy: {scannedData.location.accuracy}m
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={openMapsWithLocation}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Open in Maps
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
              {scannedData.contact && (
                <Alert className="bg-green-500/10 border-green-200">
                  <PhoneCall className="h-4 w-4 text-green-500" />
                  <AlertTitle>Emergency Contact</AlertTitle>
                  <AlertDescription className="flex flex-col space-y-2">
                    <span>{scannedData.contact}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={callEmergencyContact}
                    >
                      <PhoneCall className="mr-2 h-4 w-4" />
                      Call Contact
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="default" 
              onClick={() => window.location.href = `/patient/${scannedData?.patientId}`}
            >
              View Patient Records
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowQrDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmergencyAlert;
