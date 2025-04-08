import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DoctorDashboard from "@/components/DoctorDashboard";
import { HospitalSharingService } from "@/utils/hospitalSharingService";
import { User, FileText, Building2, Share2, AlertTriangle } from 'lucide-react';

const DoctorPortal: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [doctorId, setDoctorId] = useState("doctor_123");
  const [doctorName, setDoctorName] = useState("Dr. Smith");
  const [hospitalId, setHospitalId] = useState("hospital_456");
  const [targetHospitalId, setTargetHospitalId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [recordTypes, setRecordTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle sharing records with another hospital
  const handleShareRecords = async () => {
    if (!targetHospitalId || !patientId) {
      toast({
        title: "Missing Information",
        description: "Please enter both target hospital ID and patient ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await HospitalSharingService.shareRecords(
        patientId,
        hospitalId,
        targetHospitalId,
        recordTypes
      );

      if (success) {
        toast({
          title: "Records Shared",
          description: "Patient records have been shared with the target hospital",
        });
        // Clear form
        setTargetHospitalId("");
        setPatientId("");
        setRecordTypes([]);
      } else {
        toast({
          title: "Sharing Failed",
          description: "Failed to share patient records",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sharing records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Doctor Portal
          </CardTitle>
          <CardDescription>
            Access patient records and share medical data with other hospitals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">
                <FileText className="mr-2 h-4 w-4" />
                Patient Records
              </TabsTrigger>
              <TabsTrigger value="sharing">
                <Share2 className="mr-2 h-4 w-4" />
                Hospital Sharing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-4">
              <DoctorDashboard 
                doctorId={doctorId}
                doctorName={doctorName}
              />
            </TabsContent>

            <TabsContent value="sharing" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Your Hospital ID</Label>
                <Input
                  value={hospitalId}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>Target Hospital ID</Label>
                <Input
                  placeholder="Enter target hospital ID"
                  value={targetHospitalId}
                  onChange={(e) => setTargetHospitalId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Patient ID</Label>
                <Input
                  placeholder="Enter patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Record Types (Optional)</Label>
                <Input
                  placeholder="Enter record types (comma separated)"
                  value={recordTypes.join(", ")}
                  onChange={(e) => setRecordTypes(e.target.value.split(",").map(type => type.trim()))}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to share all records
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleShareRecords}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white" />
                    Sharing Records...
                  </div>
                ) : (
                  "Share Records"
                )}
              </Button>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Pending Shares</h3>
                <div className="space-y-4">
                  {HospitalSharingService.getPendingShares(hospitalId).map((share) => (
                    <Card key={share.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Patient ID: {share.patientId}</p>
                            <p className="text-sm text-muted-foreground">
                              From: {share.sourceHospitalId}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => HospitalSharingService.acceptShare(share.id, hospitalId)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => HospitalSharingService.rejectShare(share.id, hospitalId)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorPortal; 