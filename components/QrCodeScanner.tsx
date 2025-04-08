
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Scan, MapPin, PhoneCall, BadgeAlert, User, Clock, Info } from 'lucide-react';
import { addRecordToBlockchain } from "@/utils/blockchain";

interface QrCodeScannerProps {
  providerId: string;
  providerName: string;
}

interface ScannedPersonData {
  type: string;
  patientId: string;
  patientName: string;
  gender?: string;
  age?: number;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  emergencyContact?: string;
  location?: {
    latitude: number | null;
    longitude: number | null;
    timestamp: number;
    accuracy?: number;
  };
  timestamp: number;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ providerId, providerName }) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedPersonData | null>(null);
  const [showScannedDialog, setShowScannedDialog] = useState(false);
  const [isSendingSMS, setIsSendingSMS] = useState(false);

  // Handle QR code scanning
  const handleScanQrCode = async () => {
    setIsScanning(true);
    
    try {
      // In a real app, we would use a camera API to scan QR codes
      // Here we'll simulate scanning a QR code by generating mock data
      
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock person data that would be extracted from the QR code
      const mockPersonData: ScannedPersonData = {
        type: 'EMERGENCY',
        patientId: 'patient_123',
        patientName: 'Rajiv Kumar',
        gender: 'Male',
        age: 42,
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        medications: ['Metformin 500mg', 'Lisinopril 10mg'],
        emergencyContact: '+917020547943',
        location: {
          latitude: 19.076,
          longitude: 72.8777,
          timestamp: Date.now(),
          accuracy: 10
        },
        timestamp: Date.now()
      };
      
      setScannedData(mockPersonData);
      setShowScannedDialog(true);
      
      // Log access to blockchain
      addRecordToBlockchain({
        type: 'QR_CODE_SCAN',
        providerId,
        patientId: mockPersonData.patientId,
        timestamp: Date.now(),
        location: mockPersonData.location
      });
      
      toast({
        title: "QR Code Scanned",
        description: "Patient information retrieved successfully",
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
  
  // Open Google Maps with the location
  const openMapsWithLocation = () => {
    if (scannedData?.location?.latitude && scannedData?.location?.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${scannedData.location.latitude},${scannedData.location.longitude}`;
      window.open(mapsUrl, '_blank');
    }
  };
  
  // Send SMS to emergency contact
  const sendEmergencySMS = async () => {
    if (!scannedData?.emergencyContact) return;
    
    setIsSendingSMS(true);
    
    try {
      // In a real app, we would use a backend service to send SMS
      // Here we'll simulate sending an SMS
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Build message content including provider info and location
      const messageContent = `EMERGENCY: ${providerName} (${providerId}) is attending to ${scannedData.patientName}`;
      
      // Add location info if available
      const locationInfo = scannedData.location 
        ? `\nLocation: https://www.google.com/maps?q=${scannedData.location.latitude},${scannedData.location.longitude}` 
        : '';
      
      console.log(`Sending SMS to ${scannedData.emergencyContact}: ${messageContent}${locationInfo}`);
      
      // Log to blockchain
      addRecordToBlockchain({
        type: 'EMERGENCY_SMS_SENT',
        providerId,
        patientId: scannedData.patientId,
        contactNumber: scannedData.emergencyContact,
        timestamp: Date.now()
      });
      
      toast({
        title: "SMS Sent",
        description: `Emergency message sent to ${scannedData.emergencyContact}`,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: "SMS Sending Failed",
        description: "Failed to send emergency SMS",
        variant: "destructive"
      });
    } finally {
      setIsSendingSMS(false);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="mr-2 h-5 w-5" />
          QR Code Scanner
        </CardTitle>
        <CardDescription>
          Scan patient QR codes to access their medical information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-8 text-center border">
          <Scan className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h3 className="font-medium mb-2">Scan Patient QR Code</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Point your camera at a patient's emergency QR code to quickly access their medical information.
          </p>
          <Button 
            onClick={handleScanQrCode} 
            disabled={isScanning}
            size="lg"
            className="w-full max-w-xs"
          >
            {isScanning ? "Scanning..." : "Start Scanning"}
          </Button>
        </div>
      </CardContent>
      
      {/* Scanned Person Information Dialog */}
      <Dialog open={showScannedDialog} onOpenChange={setShowScannedDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Patient Information
            </DialogTitle>
            <DialogDescription>
              Information retrieved from QR code scan.
            </DialogDescription>
          </DialogHeader>
          
          {scannedData && (
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Patient Name</h4>
                  <span className="font-semibold">{scannedData.patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Patient ID</h4>
                  <span>{scannedData.patientId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Age / Gender</h4>
                  <span>{scannedData.age} / {scannedData.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Blood Type</h4>
                  <span className="font-semibold">{scannedData.bloodType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Scan Time</h4>
                  <span className="text-xs">{formatTimestamp(scannedData.timestamp)}</span>
                </div>
              </div>
              
              <Alert className="bg-yellow-500/10 border-yellow-200">
                <Info className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Medical Information</AlertTitle>
                <AlertDescription className="space-y-2">
                  {scannedData.allergies && scannedData.allergies.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Allergies:</span> {scannedData.allergies.join(', ')}
                    </div>
                  )}
                  
                  {scannedData.conditions && scannedData.conditions.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Conditions:</span> {scannedData.conditions.join(', ')}
                    </div>
                  )}
                  
                  {scannedData.medications && scannedData.medications.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Medications:</span> {scannedData.medications.join(', ')}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
              
              {scannedData.location && (
                <Alert className="bg-blue-500/10 border-blue-200">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Patient Location</AlertTitle>
                  <AlertDescription className="flex flex-col space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Coordinates:</span> {scannedData.location.latitude?.toFixed(6)}, {scannedData.location.longitude?.toFixed(6)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Accuracy:</span> {scannedData.location.accuracy}m
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Time:</span> {formatTimestamp(scannedData.location.timestamp)}
                    </div>
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
              
              {scannedData.emergencyContact && (
                <Alert className="bg-green-500/10 border-green-200">
                  <PhoneCall className="h-4 w-4 text-green-500" />
                  <AlertTitle>Emergency Contact</AlertTitle>
                  <AlertDescription className="flex flex-col space-y-2">
                    <span>{scannedData.emergencyContact}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={sendEmergencySMS}
                      disabled={isSendingSMS}
                    >
                      <PhoneCall className="mr-2 h-4 w-4" />
                      {isSendingSMS ? "Sending..." : "Send Emergency SMS"}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row">
            <Button 
              variant="default" 
              className="sm:mr-2"
              onClick={() => window.location.href = `/patient/${scannedData?.patientId}`}
            >
              View Full Records
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowScannedDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QrCodeScanner;
