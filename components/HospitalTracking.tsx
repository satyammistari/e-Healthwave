
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bed, Clock, Stethoscope, Calendar, Pill, Truck, Hospital, User, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Doctor {
  id: string;
  name: string;
  department: string;
  status: 'available' | 'busy' | 'off-duty';
  nextAvailable?: string;
}

interface Department {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  waitlist: number;
  averageWaitTime: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  available: number;
  total: number;
  status: 'sufficient' | 'low' | 'critical';
  nextDelivery?: string;
}

interface HospitalData {
  id: string;
  name: string;
  doctors: Doctor[];
  departments: Department[];
  inventory: InventoryItem[];
}

const hospitalData: HospitalData = {
  id: 'hospital1',
  name: 'AIIMS New Delhi',
  doctors: [
    { id: 'doc1', name: 'Dr. Priya Sharma', department: 'Cardiology', status: 'available' },
    { id: 'doc2', name: 'Dr. Rajesh Kumar', department: 'Neurology', status: 'busy', nextAvailable: '14:30' },
    { id: 'doc3', name: 'Dr. Ananya Singh', department: 'Pediatrics', status: 'available' },
    { id: 'doc4', name: 'Dr. Vikram Mehra', department: 'Orthopedics', status: 'off-duty', nextAvailable: 'Tomorrow' },
    { id: 'doc5', name: 'Dr. Neha Gupta', department: 'Gynecology', status: 'busy', nextAvailable: '15:15' },
    { id: 'doc6', name: 'Dr. Sanjay Verma', department: 'Oncology', status: 'available' },
    { id: 'doc7', name: 'Dr. Deepika Patel', department: 'Dermatology', status: 'off-duty', nextAvailable: 'Tomorrow' },
    { id: 'doc8', name: 'Dr. Arjun Reddy', department: 'Psychiatry', status: 'busy', nextAvailable: '16:00' }
  ],
  departments: [
    { id: 'dept1', name: 'Emergency', totalBeds: 30, occupiedBeds: 22, waitlist: 5, averageWaitTime: '30-45 min' },
    { id: 'dept2', name: 'ICU', totalBeds: 20, occupiedBeds: 18, waitlist: 3, averageWaitTime: '1-2 hours' },
    { id: 'dept3', name: 'Cardiology', totalBeds: 25, occupiedBeds: 15, waitlist: 0, averageWaitTime: '10-15 min' },
    { id: 'dept4', name: 'Neurology', totalBeds: 15, occupiedBeds: 8, waitlist: 0, averageWaitTime: '15-20 min' },
    { id: 'dept5', name: 'Pediatrics', totalBeds: 25, occupiedBeds: 12, waitlist: 2, averageWaitTime: '20-30 min' },
    { id: 'dept6', name: 'Orthopedics', totalBeds: 20, occupiedBeds: 10, waitlist: 0, averageWaitTime: '15-20 min' },
    { id: 'dept7', name: 'General Ward', totalBeds: 50, occupiedBeds: 35, waitlist: 0, averageWaitTime: '5-10 min' },
    { id: 'dept8', name: 'Maternity', totalBeds: 15, occupiedBeds: 10, waitlist: 1, averageWaitTime: '20-30 min' }
  ],
  inventory: [
    { id: 'inv1', name: 'Oxygen Cylinders', category: 'Equipment', available: 45, total: 50, status: 'sufficient' },
    { id: 'inv2', name: 'PPE Kits', category: 'Supplies', available: 120, total: 200, status: 'sufficient' },
    { id: 'inv3', name: 'Ventilators', category: 'Equipment', available: 8, total: 15, status: 'low', nextDelivery: 'Tomorrow' },
    { id: 'inv4', name: 'Antibiotics', category: 'Medication', available: 320, total: 500, status: 'sufficient' },
    { id: 'inv5', name: 'Blood - A+', category: 'Blood', available: 5, total: 20, status: 'critical', nextDelivery: 'Today, 16:00' },
    { id: 'inv6', name: 'Blood - O-', category: 'Blood', available: 8, total: 15, status: 'low', nextDelivery: 'Tomorrow' },
    { id: 'inv7', name: 'Surgical Masks', category: 'Supplies', available: 850, total: 1000, status: 'sufficient' },
    { id: 'inv8', name: 'IV Fluids', category: 'Medication', available: 120, total: 200, status: 'sufficient' },
    { id: 'inv9', name: 'Insulin', category: 'Medication', available: 30, total: 50, status: 'low', nextDelivery: 'Tomorrow' },
    { id: 'inv10', name: 'Surgical Gloves', category: 'Supplies', available: 400, total: 500, status: 'sufficient' }
  ]
};

const HospitalTracking: React.FC = () => {
  const { toast } = useToast();
  const [selectedHospital, setSelectedHospital] = useState<string>(hospitalData.id);
  const [activeTab, setActiveTab] = useState('beds');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState<string>('');
  const [inventoryFilter, setInventoryFilter] = useState<string>('all');
  
  const filteredDepartments = hospitalData.departments.filter(dept => 
    departmentFilter === 'all' || dept.id === departmentFilter
  );
  
  const filteredDoctors = hospitalData.doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
    doctor.department.toLowerCase().includes(doctorSearchQuery.toLowerCase())
  );
  
  const filteredInventory = hospitalData.inventory.filter(item => 
    inventoryFilter === 'all' || item.category === inventoryFilter
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'off-duty':
        return 'bg-gray-500';
      case 'sufficient':
        return 'bg-green-500';
      case 'low':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getBedUtilizationStatus = (occupied: number, total: number) => {
    const utilizationRate = (occupied / total) * 100;
    if (utilizationRate < 70) return 'bg-green-500';
    if (utilizationRate < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleScheduleDoctor = (doctorId: string) => {
    const doctor = hospitalData.doctors.find(d => d.id === doctorId);
    if (doctor) {
      toast({
        title: "Doctor Scheduled",
        description: `You've scheduled an appointment with ${doctor.name}`,
      });
    }
  };

  const handleRequestSupplies = () => {
    toast({
      title: "Supplies Requested",
      description: "Your supply request has been submitted successfully",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Hospital Tracking</h2>
          <p className="text-muted-foreground">Real-time status of resources and facilities</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Hospital className="h-5 w-5 text-primary" />
          <Select value={selectedHospital} onValueChange={setSelectedHospital}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Hospital" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hospital1">AIIMS New Delhi</SelectItem>
              <SelectItem value="hospital2">Fortis Hospital, Delhi</SelectItem>
              <SelectItem value="hospital3">Max Super Speciality Hospital</SelectItem>
              <SelectItem value="hospital4">Safdarjung Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="beds" className="flex items-center">
            <Bed className="h-4 w-4 mr-2" />
            Beds
          </TabsTrigger>
          <TabsTrigger value="doctors" className="flex items-center">
            <Stethoscope className="h-4 w-4 mr-2" />
            Doctors
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center">
            <Pill className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="beds" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Bed Availability</CardTitle>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {hospitalData.departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Real-time bed availability across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {filteredDepartments.map(dept => (
                    <div key={dept.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg">{dept.name}</h3>
                        {dept.waitlist > 0 ? (
                          <Badge variant="outline" className="text-amber-500 border-amber-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {dept.waitlist} in waitlist
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            No waitlist
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>
                            {dept.occupiedBeds} / {dept.totalBeds} beds occupied
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Avg. wait: {dept.averageWaitTime}
                          </span>
                        </div>
                        <Progress 
                          value={(dept.occupiedBeds / dept.totalBeds) * 100} 
                          className={`h-2 ${getBedUtilizationStatus(dept.occupiedBeds, dept.totalBeds)}`}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                        <div className="border rounded p-2">
                          <p className="text-xs text-muted-foreground">Total Beds</p>
                          <p className="font-medium">{dept.totalBeds}</p>
                        </div>
                        <div className="border rounded p-2">
                          <p className="text-xs text-muted-foreground">Available</p>
                          <p className="font-medium">{dept.totalBeds - dept.occupiedBeds}</p>
                        </div>
                        <div className="border rounded p-2">
                          <p className="text-xs text-muted-foreground">Occupied</p>
                          <p className="font-medium">{dept.occupiedBeds}</p>
                        </div>
                        <div className="border rounded p-2">
                          <p className="text-xs text-muted-foreground">Utilization</p>
                          <p className="font-medium">{Math.round((dept.occupiedBeds / dept.totalBeds) * 100)}%</p>
                        </div>
                      </div>
                      
                      {dept.waitlist > 0 && (
                        <div className="mt-3 p-2 bg-amber-50 rounded text-sm flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-amber-500" />
                          <span>Estimated admission time for new patients: {dept.averageWaitTime}</span>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            toast({
                              title: "Bed Request Sent",
                              description: `Requested a bed in ${dept.name}`,
                            });
                          }}
                        >
                          Request Bed
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
              Last updated: Today, 13:45 (auto-refreshes every 15 minutes)
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="doctors" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <CardTitle>Doctor Availability</CardTitle>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search doctors or departments..." 
                    className="pl-9 w-[300px]"
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>
                Current availability status of doctors and next available slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Available</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.map(doctor => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell>{doctor.department}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(doctor.status)}>
                            {doctor.status === 'available' ? 'Available' : 
                             doctor.status === 'busy' ? 'Busy' : 'Off Duty'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {doctor.status === 'available' ? 'Now' : doctor.nextAvailable}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={doctor.status !== 'available'}
                            onClick={() => handleScheduleDoctor(doctor.id)}
                          >
                            Schedule
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
              Last updated: Today, 13:45 (auto-refreshes every 5 minutes)
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Inventory Status</CardTitle>
                <Select value={inventoryFilter} onValueChange={setInventoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Medication">Medication</SelectItem>
                    <SelectItem value="Blood">Blood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                Current inventory levels of essential medical supplies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Delivery</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {item.available} / {item.total}
                            </div>
                            <Progress 
                              value={(item.available / item.total) * 100} 
                              className={`h-1.5 ${getStatusColor(item.status)}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.nextDelivery || 'Not scheduled'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Order Placed",
                                description: `Ordered more ${item.name}`,
                              });
                            }}
                          >
                            Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-4 text-sm flex justify-between items-center">
              <span className="text-muted-foreground">
                Last updated: Today, 13:45 (auto-refreshes every 30 minutes)
              </span>
              <Button size="sm" className="gap-2" onClick={handleRequestSupplies}>
                <Truck className="h-4 w-4" />
                Request Supplies
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalTracking;
