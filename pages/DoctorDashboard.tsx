import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { 
  Clock, 
  Home, 
  MessageSquare, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  Ambulance,
  Hospital,
  BookOpen,
  Pill,
  FilePlus,
  Phone,
  Video,
  Download,
  PlusCircle,
  CheckCircle,
  ArrowUpDown,
  ChevronDown,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import ChatInterface, { Message } from '@/components/ChatInterface';
import DoctorDirectory from '@/components/DoctorDirectory';
import ResearchPaperSharing from '@/components/ResearchPaperSharing';
import EmergencyServices from '@/components/EmergencyServices';
import GovernmentSchemes from '@/components/GovernmentSchemes';
import HospitalTracking from '@/components/HospitalTracking';
import { useToast } from "@/components/ui/use-toast";
import MedicalRecordsManager from '@/components/MedicalRecordsManager';
import Prescription from '@/components/Prescription';
import MedicationManager from '@/components/MedicationManager';

const appointmentsData = [
  {
    id: 'app_1',
    patientName: 'Rajiv Kumar',
    patientAvatar: null,
    patientId: 'PAT-1001',
    appointmentType: 'General Checkup',
    date: new Date(Date.now() + 60 * 60 * 1000),
    status: 'Confirmed',
    notes: 'Follow-up on hypertension treatment'
  },
  {
    id: 'app_2',
    patientName: 'Meera Patel',
    patientAvatar: null,
    patientId: 'PAT-1002',
    appointmentType: 'Consultation',
    date: new Date(Date.now() + 3 * 60 * 60 * 1000),
    status: 'Confirmed',
    notes: 'New patient with joint pain'
  },
  {
    id: 'app_3',
    patientName: 'Samir Joshi',
    patientAvatar: null,
    patientId: 'PAT-1003',
    appointmentType: 'Follow-up',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'Pending',
    notes: 'Blood test results review'
  },
  {
    id: 'app_4',
    patientName: 'Priti Singh',
    patientAvatar: null,
    patientId: 'PAT-1004',
    appointmentType: 'Emergency',
    date: new Date(Date.now() + 30 * 60 * 1000),
    status: 'Confirmed',
    notes: 'Severe chest pain, urgent'
  },
  {
    id: 'app_5',
    patientName: 'Ankit Verma',
    patientAvatar: null,
    patientId: 'PAT-1005',
    appointmentType: 'Routine Check',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'Confirmed',
    notes: 'Annual health examination'
  }
];

const patientsData = [
  {
    id: 'PAT-1001',
    name: 'Rajiv Kumar',
    age: 42,
    gender: 'Male',
    contact: '8734567890',
    medicalHistory: 'Hypertension, Type 2 Diabetes',
    lastVisit: '2023-05-01'
  },
  {
    id: 'PAT-1002',
    name: 'Meera Patel',
    age: 35,
    gender: 'Female',
    contact: '9876543210',
    medicalHistory: 'None',
    lastVisit: '2023-05-10'
  },
  {
    id: 'PAT-1003',
    name: 'Samir Joshi',
    age: 28,
    gender: 'Male',
    contact: '7890123456',
    medicalHistory: 'Asthma',
    lastVisit: '2023-04-15'
  },
  {
    id: 'PAT-1004',
    name: 'Priti Singh',
    age: 50,
    gender: 'Female',
    contact: '9012345678',
    medicalHistory: 'Heart disease, Arthritis',
    lastVisit: '2023-05-08'
  },
  {
    id: 'PAT-1005',
    name: 'Ankit Verma',
    age: 32,
    gender: 'Male',
    contact: '8901234567',
    medicalHistory: 'None',
    lastVisit: '2023-03-22'
  }
];

const DoctorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [emergencyNotifications, setEmergencyNotifications] = useState<number>(0);

  React.useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean)[1] || 'dashboard';
    setActiveTab(path);
  }, [location]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/doctor/${value === 'dashboard' ? '' : value}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} emergencyCount={emergencyNotifications} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header emergencyCount={emergencyNotifications} />
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="flex-1 overflow-hidden"
        >
          <div className="border-b px-4">
            <TabsList className="h-14">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-background">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-background">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="patients" className="data-[state=active]:bg-background">
                <Users className="h-4 w-4 mr-2" />
                Patients
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-background">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="records" className="data-[state=active]:bg-background">
                <FileText className="h-4 w-4 mr-2" />
                Records
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="data-[state=active]:bg-background">
                <FilePlus className="h-4 w-4 mr-2" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="medications" className="data-[state=active]:bg-background">
                <Pill className="h-4 w-4 mr-2" />
                Medications
              </TabsTrigger>
              <TabsTrigger value="emergency" className="data-[state=active]:bg-background">
                <Ambulance className="h-4 w-4 mr-2" />
                Emergency
              </TabsTrigger>
              <TabsTrigger value="research" className="data-[state=active]:bg-background">
                <BookOpen className="h-4 w-4 mr-2" />
                Research
              </TabsTrigger>
              <TabsTrigger value="schemes" className="data-[state=active]:bg-background">
                <FileText className="h-4 w-4 mr-2" />
                Gov Schemes
              </TabsTrigger>
              <TabsTrigger value="hospital" className="data-[state=active]:bg-background">
                <Hospital className="h-4 w-4 mr-2" />
                Hospital Status
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <TabsContent value="dashboard" className="h-full mt-0">
              <Dashboard />
            </TabsContent>
            <TabsContent value="appointments" className="h-full mt-0">
              <Appointments />
            </TabsContent>
            <TabsContent value="patients" className="h-full mt-0">
              <Patients />
            </TabsContent>
            <TabsContent value="messages" className="h-full mt-0">
              <Messages />
            </TabsContent>
            <TabsContent value="records" className="h-full mt-0">
              <MedicalRecordsManager />
            </TabsContent>
            <TabsContent value="prescriptions" className="h-full mt-0">
              <Prescription />
            </TabsContent>
            <TabsContent value="medications" className="h-full mt-0">
              <MedicationManager />
            </TabsContent>
            <TabsContent value="emergency" className="h-full mt-0">
              <EmergencyServices onNewEmergency={(count) => setEmergencyNotifications(count)} />
            </TabsContent>
            <TabsContent value="research" className="h-full mt-0">
              <ResearchPaperSharing 
                currentUser={{
                  id: 'doctor_1',
                  name: 'Dr. Sarah Chen',
                  specialty: 'Cardiologist',
                  avatar: '/avatars/doctor.jpg',
                }}
              />
            </TabsContent>
            <TabsContent value="schemes" className="h-full mt-0">
              <GovernmentSchemes />
            </TabsContent>
            <TabsContent value="hospital" className="h-full mt-0">
              <HospitalTracking />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, emergencyCount = 0 }: { activeTab: string, emergencyCount?: number }) => {
  return (
    <div className="w-64 border-r bg-sidebar p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          E
        </div>
        <h1 className="text-xl font-bold">eHealthWave</h1>
      </div>
      
      <div className="flex-1">
        <nav className="space-y-1">
          <Link 
            to="/doctor" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'dashboard' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/doctor/appointments" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'appointments' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Appointments</span>
          </Link>
          <Link 
            to="/doctor/patients" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'patients' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Patients</span>
          </Link>
          <Link 
            to="/doctor/messages" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'messages' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Link>
          <Link 
            to="/doctor/records" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'records' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Records</span>
          </Link>
          <Link 
            to="/doctor/prescriptions" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'prescriptions' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <FilePlus className="h-5 w-5" />
            <span>Prescriptions</span>
          </Link>
          <Link 
            to="/doctor/medications" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'medications' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <Pill className="h-5 w-5" />
            <span>Medications</span>
          </Link>
          <Link 
            to="/doctor/emergency" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'emergency' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <div className="relative">
              <Ambulance className="h-5 w-5" />
              {emergencyCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {emergencyCount}
                </span>
              )}
            </div>
            <span>Emergency</span>
          </Link>
          <Link 
            to="/doctor/research" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'research' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Research</span>
          </Link>
          <Link 
            to="/doctor/schemes" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'schemes' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span>Gov Schemes</span>
          </Link>
          <Link 
            to="/doctor/hospital" 
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${
              activeTab === 'hospital' 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
            }`}
          >
            <Hospital className="h-5 w-5" />
            <span>Hospital Status</span>
          </Link>
        </nav>
      </div>
      
      <div className="border-t pt-4">
        <Link 
          to="/doctor/settings" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md ${
            activeTab === 'settings' 
              ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
              : 'text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 mt-4">
          <Avatar>
            <AvatarImage src="/avatars/doctor.jpg" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Dr. Sarah Chen</p>
            <p className="text-xs text-sidebar-foreground">Cardiologist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ emergencyCount = 0 }: { emergencyCount?: number }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleVideoCall = () => {
    window.open(`tel:8010599511`, '_blank');
    toast({
      title: "Video Call",
      description: "Initiating video call with 8010599511",
    });
  };
  
  const handleWhatsApp = () => {
    window.open(`https://wa.me/8010599511`, '_blank');
    toast({
      title: "WhatsApp",
      description: "Opening WhatsApp chat with 8010599511",
    });
  };
  
  return (
    <header className="border-b h-14 flex items-center justify-between px-4">
      <div>
        <h2 className="text-lg font-semibold">Doctor Dashboard</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleVideoCall}>
          <Video className="h-4 w-4 mr-2" />
          Video Call
        </Button>
        <Button variant="outline" size="sm" onClick={handleWhatsApp}>
          <MessageSquare className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full relative"
          onClick={() => navigate('/doctor/emergency')}
        >
          <Bell className="h-4 w-4" />
          {emergencyCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {emergencyCount}
            </span>
          )}
        </Button>
        <Avatar>
          <AvatarImage src="/avatars/doctor.jpg" />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleDownloadSample = () => {
    toast({
      title: "Sample Downloaded",
      description: "Sample medical record document has been downloaded",
    });
    
    const samplePDF = "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDM4Cj4+CnN0cmVhbQp4nCvkMlAwUDC1NNUzMVGwMDHUszRSKOQCABxHBD8KZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9NZWRpYUJveCBbMCAwIDU5NTM1IGYgCjAwMDAwMDAyMjEgMDAwMDAgbiAKMDAwMDAwMDE3MiAwMDAwMCBuIAowMDAwMDAwMDAwIDAwMDAwIGYgCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDAwMCAwMDAwMCBuIAowMDAwMDAwMjcwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNwovUm9vdCAxIDAgUgovSW5mbyA2IDAgUgo+PgpzdGFydHhyZWYKMzgxCiUlRU9GCg==";
    
    const downloadLink = document.createElement("a");
    downloadLink.href = samplePDF;
    downloadLink.download = "sample-medical-record.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Today's Appointments</h3>
          <div className="text-3xl font-bold">8</div>
          <p className="text-muted-foreground text-sm mt-2">2 more than yesterday</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/doctor/appointments')}
          >
            View All
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Patient Records</h3>
          <div className="text-3xl font-bold">248</div>
          <p className="text-muted-foreground text-sm mt-2">12 new this week</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/doctor/records')}
          >
            Manage Records
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Unread Messages</h3>
          <div className="text-3xl font-bold">5</div>
          <p className="text-muted-foreground text-sm mt-2">3 urgent</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/doctor/messages')}
          >
            Open Inbox
          </Button>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Upcoming Appointments</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/doctor/appointments')}
            >
              View Calendar
            </Button>
          </div>
          <div className="space-y-4">
            {appointmentsData.slice(0, 3).map((appointment, i) => (
              <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.appointmentType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{format(appointment.date, 'h:mm a')}</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      toast({
                        title: "Appointment Started",
                        description: `Started appointment with ${appointment.patientName}`,
                      });
                    }}
                  >
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-2">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/doctor/prescriptions')}
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Create Prescription
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                navigate('/doctor/patients');
                toast({
                  title: "Add New Patient",
                  description: "Navigate to the patients tab to add a new patient",
                });
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline" 
              onClick={handleDownloadSample}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample Record
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => {
                window.open(`tel:8010599511`, '_blank');
                toast({
                  title: "Calling",
                  description: "Calling 8010599511",
                });
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call 8010599511
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

type AppointmentFormValues = {
  patientId: string;
  appointmentType: string;
  date: Date;
  time: string;
  notes: string;
};

const Appointments = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState(appointmentsData);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [addAppointmentOpen, setAddAppointmentOpen] = useState(false);

  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      patientId: '',
      appointmentType: 'General Checkup',
      date: new Date(),
      time: '10:00',
      notes: '',
    },
  });

  const rescheduleForm = useForm<{ date: Date; time: string; notes: string }>({
    defaultValues: {
      date: new Date(),
      time: '10:00',
      notes: '',
    },
  });

  const handleStartAppointment = (appointment: any) => {
    toast({
      title: "Appointment Started",
      description: `Started appointment with ${appointment.patientName}`,
    });
  };

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    rescheduleForm.setValue('date', appointment.date);
    rescheduleForm.setValue('time', format(appointment.date, 'HH:mm'));
    rescheduleForm.setValue('notes', appointment.notes);
    setRescheduleOpen(true);
  };

  const submitReschedule = rescheduleForm.handleSubmit((data) => {
    if (!selectedAppointment) return;

    const newDate = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    newDate.setHours(hours, minutes);

    const updatedAppointments = appointments.map(app => 
      app.id === selectedAppointment.id 
        ? { ...app, date: newDate, notes: data.notes } 
        : app
    );

    setAppointments(updatedAppointments);
    setRescheduleOpen(false);
    
    toast({
      title: "Appointment Rescheduled",
      description: `Appointment with ${selectedAppointment.patientName} has been rescheduled`,
    });
  });

  const createAppointment = form.handleSubmit((data) => {
    const newDate = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    newDate.setHours(hours, minutes);
    
    const patient = patientsData.find(p => p.id === data.patientId);
    
    if (!patient) {
      toast({
        title: "Error",
        description: "Patient not found",
        variant: "destructive",
      });
      return;
    }
    
    const newAppointment = {
      id: `app_${Date.now()}`,
      patientName: patient.name,
      patientAvatar: null,
      patientId: patient.id,
      appointmentType: data.appointmentType,
      date: newDate,
      status: 'Confirmed',
      notes: data.notes
    };
    
    setAppointments([...appointments, newAppointment]);
    setAddAppointmentOpen(false);
    form.reset();
    
    toast({
      title: "Appointment Created",
      description: `New appointment with ${patient.name} has been scheduled`,
    });
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <Button onClick={() => setAddAppointmentOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {appointments.map((appointment, i) => (
              <div key={appointment.id} className="flex items-center justify-between border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.appointmentType}</p>
                    <p className="text-xs text-muted-foreground mt-1">{appointment.notes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{format(appointment.date, 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">{format(appointment.date, 'h:mm a')}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReschedule(appointment)}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleStartAppointment(appointment)}
                  >
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={addAppointmentOpen} onOpenChange={setAddAppointmentOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment for a patient.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={createAppointment} className="space-y-4">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patientsData.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} ({patient.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General Checkup">General Checkup</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="Routine Check">Routine Check</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create Appointment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              {selectedAppointment ? `Reschedule appointment for ${selectedAppointment.patientName}` : 'Update appointment time'}
            </DialogDescription>
          </DialogHeader>
          <Form {...rescheduleForm}>
            <form onSubmit={submitReschedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={rescheduleForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={rescheduleForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={rescheduleForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Appointment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Patients = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Patients</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {patientsData.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.age} years, {patient.gender}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last visit: {patient.lastVisit}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                  <p className="text-sm">{patient.contact}</p>
                  <p className="text-xs text-muted-foreground mt-1">{patient.medicalHistory}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {id: 'msg1', sender: 'doctor', content: 'Hello, how are you feeling today?', timestamp: new Date(Date.now() - 3600000)},
    {id: 'msg2', sender: 'user', content: 'Much better, doctor. The medication is helping.', timestamp: new Date(Date.now() - 3500000)},
    {id: 'msg3', sender: 'doctor', content: 'Great! Any side effects?', timestamp: new Date(Date.now() - 3400000)},
    {id: 'msg4', sender: 'user', content: "Just a bit drowsy in the morning, but it's manageable.", timestamp: new Date(Date.now() - 3300000)},
  ]);

  return (
    <ChatInterface 
      messages={messages}
      onSendMessage={(text) => {
        const newMessage: Message = {
          id: `msg${Date.now()}`,
          sender: 'doctor',
          content: text,
          timestamp: new Date()
        };
        setMessages([...messages, newMessage]);
      }}
      recipientName="Rajiv Kumar"
      recipientRole="Patient"
    />
  );
};

export default DoctorDashboard;
