
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { EmergencyAccessService } from "@/utils/emergencyAccessService";
import { AlertTriangle, Shield, Lock, Unlock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EmergencyAccessOverrideProps {
  providerId: string;
  providerName: string;
  onAccessGranted?: (patientId: string, records: any[]) => void;
}

const EmergencyAccessOverride: React.FC<EmergencyAccessOverrideProps> = ({
  providerId,
  providerName,
  onAccessGranted
}) => {
  const { toast } = useToast();
  const [patientId, setPatientId] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [accessedRecords, setAccessedRecords] = useState<any[]>([]);
  
  const handleAccessRequest = async () => {
    if (!patientId || !pin) {
      toast({
        title: "Missing Information",
        description: "Please enter both patient ID and PIN",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { valid, records } = await EmergencyAccessService.validateEmergencyPin(
        pin,
        patientId,
        providerId
      );
      
      if (valid && records) {
        toast({
          title: "Access Granted",
          description: "Emergency access has been granted",
        });
        
        setIsAccessGranted(true);
        setAccessedRecords(records);
        
        if (onAccessGranted) {
          onAccessGranted(patientId, records);
        }
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid or expired emergency PIN",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate emergency PIN",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetAccess = () => {
    setPatientId("");
    setPin("");
    setIsAccessGranted(false);
    setAccessedRecords([]);
  };
  
  const getCriticalRecords = () => {
    // In a real app, we'd filter for allergies, medications, conditions, etc.
    return accessedRecords.slice(0, 2);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center text-xl">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          Emergency Access Override
        </CardTitle>
        <CardDescription>
          Enter patient ID and PIN to access emergency health records
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAccessGranted ? (
          <div className="space-y-4">
            <div className="bg-accent/50 rounded-lg p-4 flex items-center gap-3">
              <Unlock className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Emergency Access Granted</h3>
                <p className="text-sm text-muted-foreground">
                  You now have one-time access to critical patient information
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Patient ID</h3>
              <div className="flex items-center gap-2 text-sm border rounded-md p-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{patientId}</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium mb-2">Critical Information</h3>
              </div>
              <div className="space-y-2">
                {getCriticalRecords().map((record, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="font-medium">{record.title || 'Medical Record'}</div>
                    <div className="text-sm text-muted-foreground">
                      {record.description || record.data?.description || 'No description available'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium mb-2">All Records</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="space-y-2">
                {accessedRecords.length > 0 ? (
                  accessedRecords.map((record, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="font-medium">{record.title || 'Medical Record'}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm mt-1">
                        {record.description || record.data?.description || 'No description available'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No records available
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-orange-500/10 border-l-4 border-orange-500 rounded-sm p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-500">Emergency Use Only</h3>
                <p className="text-sm">
                  This feature is for emergency situations only. All access is logged and audited.
                </p>
              </div>
            </div>
          
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  placeholder="Enter patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pin">Emergency PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter emergency PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isAccessGranted ? (
          <Button variant="outline" onClick={resetAccess} className="w-full">
            Reset Access
          </Button>
        ) : (
          <Button 
            onClick={handleAccessRequest} 
            disabled={isLoading || !patientId || !pin}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Request Emergency Access"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmergencyAccessOverride;
