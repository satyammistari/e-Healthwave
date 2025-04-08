import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import EmergencyAccessOverride from "@/components/EmergencyAccessOverride";
import { EmergencyAccessService } from "@/utils/emergencyAccessService";
import { AlertTriangle, UserCog, Shield, Bookmark, Clock, CheckCircle, XCircle, Phone } from 'lucide-react';

interface EmergencyDashboardProps {
  providerId: string;
  providerName: string;
}

const mockEmergencyRequests = [
  {
    id: 'req_001',
    patientId: 'patient_456',
    patientName: 'Meera Patel',
    reason: 'Severe chest pain, possible cardiac event',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'pending',
    contact: '+91 98765 43210'
  },
  {
    id: 'req_002',
    patientId: 'patient_789',
    patientName: 'Samir Joshi',
    reason: 'Traffic accident, head trauma',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'active',
    contact: '+91 87654 32109'
  }
];

const EmergencyDashboard: React.FC<EmergencyDashboardProps> = ({
  providerId,
  providerName
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [emergencyRequests, setEmergencyRequests] = useState(mockEmergencyRequests);
  const [accessedPatients, setAccessedPatients] = useState<any[]>([]);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  
  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const pendingRequests = await EmergencyAccessService.getPendingEmergencyRequests(providerId);
        setEmergencyRequests(prev => [
          ...prev.filter(req => req.status !== 'pending'),
          ...pendingRequests
        ]);
        
        const accessActivity = await EmergencyAccessService.getEmergencyAccessActivity(providerId);
        const patients = accessActivity.map(activity => ({
          patientId: activity.patientId,
          patientName: `Patient ${activity.patientId.slice(-3)}`,
          accessGranted: activity.accessTime,
          expiryTime: activity.expiryTime
        }));
        
        setAccessedPatients(patients);
      } catch (error) {
        console.error('Error fetching emergency data:', error);
      }
    };
    
    fetchEmergencyData();
  }, [providerId]);
  
  const handleEmergencyResponse = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      await EmergencyAccessService.respondToEmergencyRequest(
        requestId,
        providerId,
        action
      );
      
      setEmergencyRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: action === 'accept' ? 'active' : 'rejected' } 
            : req
        )
      );
      
      toast({
        title: action === 'accept' ? "Request Accepted" : "Request Rejected",
        description: action === 'accept' 
          ? "You now have emergency access to the patient's records" 
          : "Emergency access request has been rejected",
      });
      
      if (action === 'accept') {
        const request = emergencyRequests.find(req => req.id === requestId);
        if (request) {
          setAccessedPatients(prev => [...prev, {
            patientId: request.patientId,
            patientName: request.patientName,
            accessGranted: new Date(),
            expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }]);
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing emergency request:`, error);
      toast({
        title: "Action Failed",
        description: `Failed to ${action} emergency request`,
        variant: "destructive"
      });
    }
  };
  
  const handleNewEmergencyAccess = (patientId: string, records: any[]) => {
    const patientName = records[0]?.patientName || "Unknown Patient";
    
    setAccessedPatients(prev => [...prev, {
      patientId,
      patientName,
      accessGranted: new Date(),
      expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      records
    }]);
    
    setShowAccessDialog(false);
    
    toast({
      title: "Emergency Access Granted",
      description: `You now have emergency access to ${patientName}'s records`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Emergency Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAccessDialog(true)}>
            <Shield className="h-4 w-4 mr-2" />
            Emergency Access
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Emergency Requests
            </CardTitle>
            <CardDescription>
              Respond to emergency access requests from patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {emergencyRequests.filter(req => req.status === 'active').length > 0 ? (
                  emergencyRequests
                    .filter(req => req.status === 'active')
                    .map(request => (
                      <Card key={request.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{request.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{request.patientName}</h3>
                                  <Badge className="bg-green-500">Active</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  ID: {request.patientId}
                                </p>
                                <p className="text-sm mt-1">{request.reason}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={`tel:${request.contact}`}>
                                      <Phone className="h-3 w-3 mr-1" />
                                      Call
                                    </a>
                                  </Button>
                                  <Button size="sm">View Records</Button>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {request.timestamp.toLocaleTimeString()}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline">
                                  End Access
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No active emergency requests
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                {emergencyRequests.filter(req => req.status === 'pending').length > 0 ? (
                  emergencyRequests
                    .filter(req => req.status === 'pending')
                    .map(request => (
                      <Card key={request.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{request.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{request.patientName}</h3>
                                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                                    Pending
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  ID: {request.patientId}
                                </p>
                                <p className="text-sm mt-1">{request.reason}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={`tel:${request.contact}`}>
                                      <Phone className="h-3 w-3 mr-1" />
                                      Call
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {request.timestamp.toLocaleTimeString()}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEmergencyResponse(request.id, 'reject')}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleEmergencyResponse(request.id, 'accept')}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending emergency requests
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  No completed emergency requests
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCog className="h-5 w-5 mr-2 text-primary" />
              Accessed Patients
            </CardTitle>
            <CardDescription>
              Currently active emergency access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessedPatients.length > 0 ? (
              accessedPatients.map((patient, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <div className="font-medium">{patient.patientName}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {patient.patientId}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Expires in {Math.ceil((patient.expiryTime.getTime() - new Date().getTime()) / (1000 * 60 * 60))}h
                      </span>
                    </div>
                  </div>
                  <Button size="sm">View</Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No active patient access
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setShowAccessDialog(true)}>
              <Shield className="h-4 w-4 mr-2" />
              New Emergency Access
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Access Override</DialogTitle>
            <DialogDescription>
              Use patient-approved PIN to access emergency records
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <EmergencyAccessOverride
              providerId={providerId}
              providerName={providerName}
              onAccessGranted={handleNewEmergencyAccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyDashboard;
