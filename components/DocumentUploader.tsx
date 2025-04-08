import React, { useState } from 'react';
import { DocumentProcessor } from '@/utils/documentProcessor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { 
  sendEmergencyNotification, 
  sendAccessGrantedNotification,
  sendDocumentProcessedNotification 
} from '@/utils/smsService';

export const DocumentUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [processedRecords, setProcessedRecords] = useState<any[]>([]);
  const [doctorPhone, setDoctorPhone] = useState('+19404617504'); // Default to your Twilio number
  const [emergencyContact, setEmergencyContact] = useState('');
  const { toast } = useToast();
  const processor = new DocumentProcessor();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processor.processDocument(file);
      
      setProcessedRecords(result.records);
      setQrCode(result.qrCode);

      // Send notifications
      if (result.emergencyAccess) {
        await sendEmergencyNotification(
          result.records[0]?.patientId || 'UNKNOWN',
          doctorPhone,
          emergencyContact
        );
      }

      await sendDocumentProcessedNotification(
        result.records[0]?.patientId || 'UNKNOWN',
        doctorPhone,
        file.type
      );

      toast({
        title: "Success",
        description: "Document processed successfully and notifications sent",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmergencyAccess = async () => {
    if (!processedRecords.length) return;

    try {
      await sendAccessGrantedNotification(
        processedRecords[0]?.patientId || 'UNKNOWN',
        doctorPhone,
        'emergency'
      );

      toast({
        title: "Success",
        description: "Emergency access granted and notification sent",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send emergency access notification",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Medical Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor's Phone Number</label>
            <Input
              type="tel"
              value={doctorPhone}
              onChange={(e) => setDoctorPhone(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Emergency Contact (Optional)</label>
            <Input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Medical Document</label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Upload and Process"}
          </Button>
        </div>

        {qrCode && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Emergency Access QR Code</h3>
              <div className="flex justify-center">
                <Image
                  src={qrCode}
                  alt="Emergency Access QR Code"
                  width={200}
                  height={200}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code for emergency access to patient records
              </p>
            </div>

            <Button
              onClick={handleEmergencyAccess}
              variant="destructive"
              className="w-full"
            >
              Grant Emergency Access
            </Button>
          </div>
        )}

        {processedRecords.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Processed Records</h3>
            <div className="space-y-4">
              {processedRecords.map((record, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <h4 className="font-medium">{record.type}</h4>
                    <pre className="mt-2 text-sm">
                      {JSON.stringify(record.data, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 