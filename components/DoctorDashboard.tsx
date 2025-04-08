import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { EmergencyAccessService } from "@/utils/emergencyAccessService";
import { BluetoothTokenService } from "@/utils/bluetoothTokenService";
import { getUserMedicalRecords } from "@/utils/blockchain";
import { Search, User, FileText, Clock, AlertTriangle, Shield, QrCode } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RecordDetailsModal } from './RecordDetailsModal';
import { PDFService } from "@/utils/pdfService";
import { generateMockRecords } from "@/utils/mockPatientRecords";
import { Medication } from "@/types/patientRecord";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AIConsistencyChecker } from "@/utils/aiConsistencyChecker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DoctorDashboardProps {
  doctorId: string;
  doctorName: string;
}

interface PatientRecord {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  hospitalId?: string;
}

interface ConsistencyAlert {
  type: 'warning' | 'error';
  message: string;
  confidence: number;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctorId, doctorName }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("token");
  const [token, setToken] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyAccess, setShowEmergencyAccess] = useState(false);
  const [emergencyPin, setEmergencyPin] = useState("");
  const [tokenStatus, setTokenStatus] = useState<{ status: string; expiresAt?: number } | null>(null);
  const [tokenCheckInterval, setTokenCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [consistencyAlerts, setConsistencyAlerts] = useState<ConsistencyAlert[]>([]);

  // Check token status periodically
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        const status = BluetoothTokenService.getTokenStatus(token);
        setTokenStatus(status);
        
        if (status.status !== 'active') {
          if (tokenCheckInterval) {
            clearInterval(tokenCheckInterval);
            setTokenCheckInterval(null);
          }
        }
      }, 5000) as unknown as NodeJS.Timeout;
      
      setTokenCheckInterval(interval);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [token]);

  const checkRecordConsistency = (records: PatientRecord[]) => {
    const results = AIConsistencyChecker.checkRecords(records);
    setConsistencyAlerts(results.map(r => ({
      type: r.type,
      message: r.message,
      confidence: r.confidence
    })));
  };

  const handleTokenAccess = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "Please enter a token ID",
        variant: "destructive"
      });
      return;
    }

    if (!patientId) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive"
      });
      return;
    }

    try {
      const isValid = await BluetoothTokenService.validateToken(token, patientId);
      if (isValid) {
        setAccessGranted(true);
        const mockRecords = generateMockRecords(patientId);
        setPatientRecords(mockRecords);
        checkRecordConsistency(mockRecords);
        toast({
          title: "Access Granted",
          description: "You can now view patient records",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid token or token has expired",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate token",
        variant: "destructive"
      });
    }
  };

  const handlePatientIdAccess = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive"
      });
      return;
    }

    // Validate patient ID format
    if (!/^PAT\d{3}$/.test(patientId)) {
      toast({
        title: "Error",
        description: "Patient ID must be in format PAT followed by 3 digits (e.g., PAT001)",
        variant: "destructive"
      });
      return;
    }

    try {
      setAccessGranted(true);
      const mockRecords = generateMockRecords(patientId);
      setPatientRecords(mockRecords);
      checkRecordConsistency(mockRecords);
      toast({
        title: "Access Granted",
        description: "You can now view patient records",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access patient records",
        variant: "destructive"
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderRecords = () => {
    if (patientRecords.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No records found for this patient</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.type}</TableCell>
                <TableCell>{formatDate(record.timestamp)}</TableCell>
                <TableCell>{record.hospitalId || 'N/A'}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedRecord(record)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedRecord && (
          <RecordDetailsModal
            isOpen={!!selectedRecord}
            onClose={() => setSelectedRecord(null)}
            record={selectedRecord}
          />
        )}
      </div>
    );
  };

  const handleAddMedication = async () => {
    if (!patientId) return;

    const newRecord: PatientRecord = {
      id: Date.now().toString(),
      type: 'Prescription',
      timestamp: Date.now(),
      data: {
        medications: [newMedication],
        doctor: doctorName,
        pharmacy: 'City Pharmacy'
      },
      hospitalId: 'HOSP001'
    };

    setPatientRecords([...patientRecords, newRecord]);
    setShowMedicationForm(false);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });

    toast({
      title: "Medication Added",
      description: "New medication has been added to the patient's records",
    });
  };

  const handleGeneratePdf = async () => {
    if (!patientId) return;

    try {
      const blob = await PDFService.generateMedicalReport(patientRecords, patientId);
      setPdfBlob(blob);
      setShowPdfPreview(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive"
      });
    }
  };

  const renderMedicationForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medName">Medication Name</Label>
          <Input
            id="medName"
            value={newMedication.name}
            onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medDosage">Dosage</Label>
          <Input
            id="medDosage"
            value={newMedication.dosage}
            onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medFrequency">Frequency</Label>
          <Input
            id="medFrequency"
            value={newMedication.frequency}
            onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medDuration">Duration</Label>
          <Input
            id="medDuration"
            value={newMedication.duration}
            onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="medInstructions">Instructions</Label>
        <Input
          id="medInstructions"
          value={newMedication.instructions}
          onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowMedicationForm(false)}>
          Cancel
        </Button>
        <Button onClick={handleAddMedication}>
          Add Medication
        </Button>
      </div>
    </div>
  );

  const renderConsistencyAlerts = () => {
    if (consistencyAlerts.length === 0) return null;

    return (
      <div className="space-y-4 mb-6">
        {consistencyAlerts.map((alert, index) => (
          <Alert 
            key={index} 
            variant={alert.type === 'error' ? 'destructive' : 'default'}
            className="flex items-start"
          >
            <div className="flex-shrink-0 mt-1">
              {alert.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </div>
            <div className="ml-3">
              <AlertTitle className="font-semibold">
                {alert.type === 'error' ? 'Critical Alert' : 'Warning'}
              </AlertTitle>
              <AlertDescription>
                {alert.message}
                <div className="text-xs mt-1 text-muted-foreground">
                  Confidence: {(alert.confidence * 100).toFixed(1)}%
                </div>
              </AlertDescription>
            </div>
          </Alert>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Doctor Dashboard</CardTitle>
          <CardDescription>Access patient records using token or patient ID</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="token">Token Access</TabsTrigger>
              <TabsTrigger value="patient">Patient ID Access</TabsTrigger>
            </TabsList>
            <TabsContent value="token">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token">Access Token</Label>
                  <Input
                    id="token"
                    placeholder="Enter access token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                <Button onClick={handleTokenAccess} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Access Records"}
                </Button>
                {tokenStatus && (
                  <div className="mt-4">
                    <p className="text-sm">
                      Token Status: <span className="font-medium">{tokenStatus.status}</span>
                    </p>
                    {tokenStatus.expiresAt && (
                      <p className="text-sm">
                        Expires: {new Date(tokenStatus.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="patient">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    placeholder="Enter patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                <Button onClick={handlePatientIdAccess} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Access Records"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {patientRecords.length > 0 && (
        <>
          {renderConsistencyAlerts()}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Patient Records</CardTitle>
                  <CardDescription>Medical history and treatment records</CardDescription>
                </div>
                <div className="space-x-2">
                  <Button onClick={() => setShowMedicationForm(true)}>
                    Add Medication
                  </Button>
                  <Button onClick={handleGeneratePdf}>
                    Generate PDF Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showMedicationForm ? (
                renderMedicationForm()
              ) : (
                renderRecords()
              )}
            </CardContent>
          </Card>
        </>
      )}

      {showPdfPreview && pdfBlob && (
        <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Medical Report Preview</DialogTitle>
              <DialogDescription>
                This document requires patient consent for downloading
              </DialogDescription>
            </DialogHeader>
            <div className="h-[80vh]">
              <iframe
                src={URL.createObjectURL(pdfBlob)}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DoctorDashboard; 