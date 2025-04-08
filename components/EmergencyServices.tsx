import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Ambulance, Hospital, PhoneCall, AlertCircle, Timer, MapPin, Plus, User, X, Clock, BadgeAlert } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface HospitalData {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  emergency: {
    doctors: number;
    beds: number;
    waitTime: string;
  };
  ambulances: {
    available: number;
    total: number;
    estimatedTime: string;
  };
  specialties: string[];
}

interface EmergencyServicesProps {
  onNewEmergency?: (count: number) => void;
}

const emergencyHospitals: HospitalData[] = [
  {
    id: 'hospital1',
    name: 'AIIMS New Delhi',
    address: 'Ansari Nagar East, New Delhi, Delhi 110029',
    distance: '2.5 km',
    phone: '+91-11-26588500',
    emergency: {
      doctors: 8,
      beds: 15,
      waitTime: '10-15 min'
    },
    ambulances: {
      available: 3,
      total: 5,
      estimatedTime: '8 min'
    },
    specialties: ['Trauma', 'Cardiac', 'Neurology']
  },
  {
    id: 'hospital2',
    name: 'Fortis Hospital',
    address: 'Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj, New Delhi, 110070',
    distance: '5.2 km',
    phone: '+91-11-42776222',
    emergency: {
      doctors: 4,
      beds: 8,
      waitTime: '5-10 min'
    },
    ambulances: {
      available: 2,
      total: 4,
      estimatedTime: '12 min'
    },
    specialties: ['Cardiac', 'Multi-Specialty', 'Pediatric']
  },
  {
    id: 'hospital3',
    name: 'Max Super Speciality Hospital',
    address: 'Press Enclave Road, Saket, New Delhi, Delhi 110017',
    distance: '7.8 km',
    phone: '+91-11-26515050',
    emergency: {
      doctors: 6,
      beds: 12,
      waitTime: '15-20 min'
    },
    ambulances: {
      available: 1,
      total: 3,
      estimatedTime: '18 min'
    },
    specialties: ['Cardiac', 'Oncology', 'Neurology']
  },
  {
    id: 'hospital4',
    name: 'Safdarjung Hospital',
    address: 'Ansari Nagar West, New Delhi, Delhi 110029',
    distance: '3.1 km',
    phone: '+91-11-26707444',
    emergency: {
      doctors: 10,
      beds: 22,
      waitTime: '25-30 min'
    },
    ambulances: {
      available: 4,
      total: 6,
      estimatedTime: '10 min'
    },
    specialties: ['General', 'Trauma', 'Burns']
  }
];

// New emergency alerts that a doctor would receive
const emergencyAlerts = [
  {
    id: 'emg1',
    patient: 'Vijay Sharma',
    condition: 'Cardiac Arrest',
    location: 'AIIMS New Delhi',
    time: '10 minutes ago',
    priority: 'critical',
    status: 'new'
  },
  {
    id: 'emg2',
    patient: 'Anita Gupta',
    condition: 'Severe Trauma',
    location: 'Fortis Hospital',
    time: '25 minutes ago',
    priority: 'high',
    status: 'new'
  },
  {
    id: 'emg3',
    patient: 'Ravi Patel',
    condition: 'Respiratory Distress',
    location: 'Max Super Speciality Hospital',
    time: '45 minutes ago',
    priority: 'medium',
    status: 'inProgress'
  }
];

const EmergencyServices: React.FC<EmergencyServicesProps> = ({ onNewEmergency }) => {
  const { toast } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [activeSOS, setActiveSOS] = useState<'call' | 'ambulance' | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(null);
  const [ambulanceTracking, setAmbulanceTracking] = useState(false);
  const [ambulanceETA, setAmbulanceETA] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('nearby');
  const [alerts, setAlerts] = useState(emergencyAlerts);
  const [alertsTab, setAlertsTab] = useState('patient');
  
  // Count new emergency alerts
  useEffect(() => {
    const newAlertCount = alerts.filter(a => a.status === 'new').length;
    if (onNewEmergency) {
      onNewEmergency(newAlertCount);
    }
  }, [alerts, onNewEmergency]);
  
  const handleEmergencySOS = () => {
    setSosActive(true);
  };
  
  const handleSOSOption = (option: 'call' | 'ambulance') => {
    setActiveSOS(option);
    
    if (option === 'call') {
      toast({
        title: "Emergency Call Initiated",
        description: "Connecting to emergency services...",
      });
      
      // Simulate call connection
      setTimeout(() => {
        toast({
          title: "Connected to Emergency Services",
          description: "Stay on the line. Help is on the way.",
        });
      }, 2000);
    }
  };
  
  const handleSelectHospital = (hospital: HospitalData) => {
    setSelectedHospital(hospital);
  };
  
  const handleRequestAmbulance = () => {
    if (!selectedHospital) return;
    
    toast({
      title: "Ambulance Requested",
      description: `Ambulance requested from ${selectedHospital.name}. They will contact you shortly.`,
    });
    
    setAmbulanceTracking(true);
    setAmbulanceETA(parseInt(selectedHospital.ambulances.estimatedTime) || 10);
    
    // Close the hospital selection dialog
    setSelectedHospital(null);
  };
  
  useEffect(() => {
    if (ambulanceTracking && ambulanceETA > 0) {
      const timer = setTimeout(() => {
        setAmbulanceETA(prev => prev - 1);
      }, 60000); // Update every minute
      
      return () => clearTimeout(timer);
    } else if (ambulanceTracking && ambulanceETA === 0) {
      toast({
        title: "Ambulance Arrived",
        description: "The ambulance has arrived at your location.",
      });
      setAmbulanceTracking(false);
    }
  }, [ambulanceTracking, ambulanceETA, toast]);
  
  const cancelEmergency = () => {
    if (ambulanceTracking) {
      // Show confirmation dialog before canceling ambulance
      if (window.confirm("Are you sure you want to cancel the ambulance? This should only be done if the emergency is resolved or alternative transportation has been arranged.")) {
        setAmbulanceTracking(false);
        setActiveSOS(null);
        setSosActive(false);
        
        toast({
          title: "Emergency Canceled",
          description: "The ambulance request has been canceled.",
        });
      }
    } else {
      setActiveSOS(null);
      setSosActive(false);
    }
  };

  const handleAlertAction = (alertId: string, action: 'respond' | 'dismiss') => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          status: action === 'respond' ? 'inProgress' : 'dismissed'
        };
      }
      return alert;
    });
    
    setAlerts(updatedAlerts);
    
    toast({
      title: action === 'respond' ? "Responding to Emergency" : "Alert Dismissed",
      description: action === 'respond' 
        ? "You are now assigned to this emergency case." 
        : "The alert has been dismissed from your queue.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={alertsTab} onValueChange={setAlertsTab} className="w-full">
        <TabsList>
          <TabsTrigger value="patient">Patient View</TabsTrigger>
          <TabsTrigger value="doctor">Doctor View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="patient">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/90 to-red-600/90 z-0"></div>
              <CardContent className="p-6 relative z-10 text-white">
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                  <BadgeAlert className="h-16 w-16" />
                  <h2 className="text-2xl font-bold text-center">Medical Emergency?</h2>
                  <p className="text-center text-white/90 mb-2">
                    One-tap access to emergency services and nearby hospitals
                  </p>
                  
                  {!sosActive ? (
                    <Button 
                      size="lg" 
                      className="bg-white text-red-600 hover:bg-white/90 hover:text-red-600 w-full max-w-xs text-lg h-14"
                      onClick={handleEmergencySOS}
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Emergency SOS
                    </Button>
                  ) : (
                    <div className="w-full max-w-xs space-y-3">
                      {!activeSOS ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="bg-white text-red-600 hover:bg-white/90 border-white w-full"
                            onClick={() => handleSOSOption('call')}
                          >
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Call Emergency
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-white text-red-600 hover:bg-white/90 border-white w-full"
                            onClick={() => handleSOSOption('ambulance')}
                          >
                            <Ambulance className="h-4 w-4 mr-2" />
                            Request Ambulance
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="text-white hover:bg-red-700/50 w-full"
                            onClick={() => setSosActive(false)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <div className="text-center">
                          {activeSOS === 'call' ? (
                            <div className="animate-pulse p-3 bg-white/20 rounded-md">
                              <p className="font-bold">Emergency Call Active</p>
                              <p className="text-sm text-white/90">Stay on the line</p>
                            </div>
                          ) : ambulanceTracking ? (
                            <div className="p-3 bg-white/20 rounded-md">
                              <p className="font-bold">Ambulance On The Way</p>
                              <p className="text-sm text-white/90 flex items-center justify-center">
                                <Clock className="h-4 w-4 mr-1" />
                                ETA: {ambulanceETA} minute{ambulanceETA !== 1 ? 's' : ''}
                              </p>
                            </div>
                          ) : (
                            <p>Select a hospital to request ambulance</p>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            className="text-white hover:bg-red-700/50 mt-3"
                            onClick={cancelEmergency}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel Emergency
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Emergency Contacts</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <PhoneCall className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Emergency Helpline</p>
                        <p className="text-sm text-muted-foreground">National Emergency Number</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href="tel:112">
                        <PhoneCall className="h-4 w-4" />
                        112
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-full mr-3">
                        <Ambulance className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Ambulance</p>
                        <p className="text-sm text-muted-foreground">24/7 Service</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href="tel:102">
                        <PhoneCall className="h-4 w-4" />
                        102
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Hospital className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">COVID-19 Helpline</p>
                        <p className="text-sm text-muted-foreground">Information & Support</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href="tel:1075">
                        <PhoneCall className="h-4 w-4" />
                        1075
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Women Helpline</p>
                        <p className="text-sm text-muted-foreground">Emergency Assistance</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href="tel:1091">
                        <PhoneCall className="h-4 w-4" />
                        1091
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Emergency Hospitals Near You</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="nearby">Nearby Hospitals</TabsTrigger>
                <TabsTrigger value="availability">Bed Availability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="nearby" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyHospitals.map((hospital) => (
                    <div 
                      key={hospital.id} 
                      className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => activeSOS === 'ambulance' && !ambulanceTracking && handleSelectHospital(hospital)}
                    >
                      <div className="bg-blue-50 p-4 flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{hospital.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 inline" />
                            {hospital.distance} away
                          </p>
                        </div>
                        {hospital.emergency.beds > 0 ? (
                          <Badge className="bg-green-500">Beds Available</Badge>
                        ) : (
                          <Badge variant="secondary">Full</Badge>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="text-sm mb-3">
                          <p className="text-muted-foreground mb-1">{hospital.address}</p>
                          <p className="font-medium">{hospital.phone}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="border rounded p-2">
                            <p className="text-xs text-muted-foreground">Doctors</p>
                            <p className="font-medium">{hospital.emergency.doctors}</p>
                          </div>
                          <div className="border rounded p-2">
                            <p className="text-xs text-muted-foreground">Beds</p>
                            <p className="font-medium">{hospital.emergency.beds}</p>
                          </div>
                          <div className="border rounded p-2">
                            <p className="text-xs text-muted-foreground">Wait</p>
                            <p className="font-medium">{hospital.emergency.waitTime}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Ambulance className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm">
                              {hospital.ambulances.available} ambulances available
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ETA: {hospital.ambulances.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="availability" className="mt-0">
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 bg-muted p-3 font-medium text-sm">
                    <div className="col-span-4">Hospital</div>
                    <div className="col-span-2 text-center">Emergency Beds</div>
                    <div className="col-span-2 text-center">ICU Beds</div>
                    <div className="col-span-2 text-center">Ventilators</div>
                    <div className="col-span-2 text-center">Wait Time</div>
                  </div>
                  
                  {emergencyHospitals.map((hospital, index) => (
                    <div 
                      key={hospital.id} 
                      className={`grid grid-cols-12 p-3 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <div className="col-span-4">{hospital.name}</div>
                      <div className="col-span-2 text-center">
                        <Badge variant={hospital.emergency.beds > 5 ? "default" : hospital.emergency.beds > 0 ? "secondary" : "destructive"} className={hospital.emergency.beds > 5 ? "bg-green-500" : ""}>
                          {hospital.emergency.beds}/20
                        </Badge>
                      </div>
                      <div className="col-span-2 text-center">
                        <Badge variant={index % 3 === 0 ? "destructive" : index % 2 === 0 ? "secondary" : "default"} className={index % 2 !== 0 && index % 3 !== 0 ? "bg-green-500" : ""}>
                          {index === 0 ? '2/10' : index === 1 ? '5/8' : index === 2 ? '0/6' : '7/12'}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-center">
                        <Badge variant={index % 2 === 0 ? "default" : "secondary"} className={index % 2 === 0 ? "bg-green-500" : ""}>
                          {index === 0 ? '3/5' : index === 1 ? '1/4' : index === 2 ? '2/6' : '4/8'}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center">
                          <Timer className="h-3 w-3 mr-1" />
                          <span>{hospital.emergency.waitTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Hospital Selection Dialog */}
          {selectedHospital && (
            <Dialog open={!!selectedHospital} onOpenChange={(open) => !open && setSelectedHospital(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Ambulance</DialogTitle>
                  <DialogDescription>
                    You are requesting an ambulance from {selectedHospital.name}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{selectedHospital.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedHospital.address}</p>
                      </div>
                      <Badge className="bg-blue-500">
                        <Ambulance className="h-3 w-3 mr-1" />
                        {selectedHospital.ambulances.available} Available
                      </Badge>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedHospital.distance} away
                      </span>
                      <span className="text-sm flex items-center">
                        <Timer className="h-3 w-3 mr-1" />
                        ETA: {selectedHospital.ambulances.estimatedTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-amber-50">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Emergency Services Information</p>
                        <p className="text-sm text-amber-700 mt-1">
                          By requesting an ambulance, you confirm this is a genuine medical emergency. Your current location will be shared with emergency services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setSelectedHospital(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRequestAmbulance} className="gap-2">
                    <Ambulance className="h-4 w-4" />
                    Request Ambulance
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        <TabsContent value="doctor" className="mt-4">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Emergency Alerts</h3>
                <p className="text-muted-foreground mb-6">Incoming emergency cases that require your attention</p>
                
                <div className="space-y-4">
                  {alerts.filter(alert => alert.status !== 'dismissed').map(alert => (
                    <div 
                      key={alert.id} 
                      className={`border rounded-lg p-4 ${
                        alert.priority === 'critical' ? 'border-red-500 bg-red-50' : 
                        alert.priority === 'high' ? 'border-orange-500 bg-orange-50' : 
                        'border-yellow-500 bg-yellow-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg flex items-center">
                            {alert.priority === 'critical' && <AlertCircle className="h-5 w-5 text-red-500 mr-2" />}
                            {alert.patient}
                          </h4>
                          <p className="font-medium">{alert.condition}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Hospital className="h-3 w-3 mr-1" /> {alert.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> {alert.time}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          className={
                            alert.status === 'new' ? 'bg-red-500' : 
                            alert.status === 'inProgress' ? 'bg-blue-500' : 'bg-green-500'
                          }
                        >
                          {alert.status === 'new' ? 'New' : 
                           alert.status === 'inProgress' ? 'In Progress' : 'Resolved'}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-4 justify-end">
                        {alert.status === 'new' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAlertAction(alert.id, 'dismiss')}
                            >
                              Dismiss
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAlertAction(alert.id, 'respond')}
                            >
                              Respond
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, 'dismiss')}
                          >
                            Mark as Resolved
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {alerts.filter(alert => alert.status !== 'dismissed').length === 0 && (
                    <div className="text-center p-6 border rounded-lg bg-gray-50">
                      <p className="text-muted-foreground">No active emergency alerts at the moment</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">On-Call Schedule</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">Today</p>
                      <p className="text-sm text-muted-foreground">Dr. Sarah Chen (You)</p>
                      <Badge className="mt-2 bg-green-500">Active</Badge>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">Tomorrow</p>
                      <p className="text-sm text-muted-foreground">Dr. Rajesh Kumar</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium">Day After</p>
                      <p className="text-sm text-muted-foreground">Dr. Ananya Singh</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Schedule Request Sent",
                          description: "Your request to modify the on-call schedule has been submitted.",
                        });
                      }}
                    >
                      Request Schedule Change
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyServices;
