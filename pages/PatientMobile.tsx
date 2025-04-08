
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import MobileHealthSharing from "@/components/MobileHealthSharing";
import ConsistencyCheckAlert from "@/components/ConsistencyCheckAlert";
import MedicalRecordsManager from "@/components/MedicalRecordsManager";
import { RecordConsistencyService } from "@/utils/recordConsistencyService";
import { EmergencyAccessService } from "@/utils/emergencyAccessService";
import { useDeviceSharing } from "@/hooks/use-device-sharing";
import { Home, User, FileText, Lock, AlertTriangle, ChevronDown, MoreVertical, Bell, Bookmark, Settings, LogOut, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';
import { verifyBlockchain } from '@/utils/blockchain';

const mockPatientData = {
  id: "patient_123",
  name: "Rajiv Kumar",
  dateOfBirth: "1982-07-15",
  bloodType: "O+",
  emergencyContact: "+91 98765 43210",
  allergies: ["Penicillin", "Peanuts"],
  conditions: ["Type 2 Diabetes", "Hypertension"]
};

const PatientMobile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("home");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showConsistencyAlert, setShowConsistencyAlert] = useState(false);
  const [consistencyIssues, setConsistencyIssues] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Simulate finding consistency issues (mock)
  useEffect(() => {
    const checkConsistencyIssues = async () => {
      // Mock a duplicate prescription
      const mockIssue = {
        medication: "Metformin",
        dosage: "500mg Twice Daily",
        date: new Date().toISOString(),
        status: "duplicate",
        message: "This appears to be a duplicate prescription"
      };
      
      // Show consistency alert after a delay to simulate AI checking
      setTimeout(() => {
        setConsistencyIssues([mockIssue]);
        setShowConsistencyAlert(true);
      }, 3000);
    };
    
    checkConsistencyIssues();
  }, []);
  
  // Verify blockchain integrity (mock)
  useEffect(() => {
    const verifyData = async () => {
      const isValid = await verifyBlockchain();
      if (isValid) {
        console.log("Blockchain data integrity verified");
      } else {
        toast({
          title: "Data Integrity Alert",
          description: "There may be issues with your health record data integrity.",
          variant: "destructive"
        });
      }
    };
    
    verifyData();
  }, [toast]);
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="text-lg font-bold">eHealthWave</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowDrawer(true)}>
            <MoreVertical className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/avatars/patient.jpg" />
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto px-4 py-6 space-y-6">
        {showConsistencyAlert && (
          <ConsistencyCheckAlert
            title="Possible Duplicate Prescription"
            description="We've detected a potential duplicate in your prescriptions."
            details={consistencyIssues}
            onDismiss={() => setShowConsistencyAlert(false)}
            onProceed={() => {
              toast({
                title: "Prescription Added",
                description: "The prescription has been added despite the duplication warning."
              });
              setShowConsistencyAlert(false);
            }}
            variant="warning"
          />
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="space-y-6 mt-0">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/avatars/patient.jpg" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{mockPatientData.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      ID: {mockPatientData.id} • 
                      DOB: {format(new Date(mockPatientData.dateOfBirth), 'PP')}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge>{mockPatientData.bloodType}</Badge>
                      <Badge variant="outline">Mobile App</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <Bell className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Medication</h3>
                    <p className="text-2xl font-bold mt-1">2</p>
                    <p className="text-xs text-muted-foreground">Active prescriptions</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Records</h3>
                    <p className="text-2xl font-bold mt-1">5</p>
                    <p className="text-xs text-muted-foreground">Medical records</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center" asChild>
                  <Link to="#share">
                    <Lock className="h-5 w-5 mb-1" />
                    <span>Share Records</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center" asChild>
                  <Link to="#emergency">
                    <AlertTriangle className="h-5 w-5 mb-1" />
                    <span>Emergency Access</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Critical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockPatientData.allergies.map((allergy, i) => (
                      <Badge key={i} variant="outline" className="bg-destructive/10">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockPatientData.conditions.map((condition, i) => (
                      <Badge key={i} variant="outline" className="bg-blue-500/10">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
                  <p className="text-sm">{mockPatientData.emergencyContact}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="records" className="mt-0">
            <MedicalRecordsManager />
          </TabsContent>
          
          <TabsContent value="share" className="mt-0">
            <MobileHealthSharing
              patientId={mockPatientData.id}
              patientName={mockPatientData.name}
            />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/avatars/patient.jpg" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{mockPatientData.name}</h2>
                  <p className="text-muted-foreground">
                    Patient ID: {mockPatientData.id}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Date of Birth</h4>
                    <p>{format(new Date(mockPatientData.dateOfBirth), 'PPP')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Blood Type</h4>
                    <p>{mockPatientData.bloodType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Emergency Contact</h4>
                    <p>{mockPatientData.emergencyContact}</p>
                  </div>
                </div>
                
                <Button className="w-full">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Bottom navigation */}
      <div className="border-t bg-background p-2">
        <nav className="flex justify-around">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center px-0 h-auto py-2 gap-1 ${activeTab === "home" ? "text-primary" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center px-0 h-auto py-2 gap-1 ${activeTab === "records" ? "text-primary" : ""}`}
            onClick={() => setActiveTab("records")}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Records</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center px-0 h-auto py-2 gap-1 ${activeTab === "share" ? "text-primary" : ""}`}
            onClick={() => setActiveTab("share")}
          >
            <Lock className="h-5 w-5" />
            <span className="text-xs">Share</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center px-0 h-auto py-2 gap-1 ${activeTab === "profile" ? "text-primary" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </nav>
      </div>
      
      {/* User menu drawer */}
      <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>
              Additional options and settings
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 space-y-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bookmark className="h-5 w-5 mr-2" />
                Saved Records
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
            </div>
            <div className="border-t pt-4">
              <Button variant="ghost" className="w-full justify-start text-destructive">
                <LogOut className="h-5 w-5 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={() => setShowDrawer(false)}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Scroll to top button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-20 right-4 rounded-full shadow-md"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PatientMobile;
