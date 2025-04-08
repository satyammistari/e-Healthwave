import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecordCard from '@/components/RecordCard';
import ChatInterface from '@/components/ChatInterface';
import VideoConsultation from '@/components/VideoConsultation';
import SocialFeed from '@/components/SocialFeed';
import GovernmentSchemes from '@/components/GovernmentSchemes';
import MentalHealthSupport from '@/components/MentalHealthSupport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserMedicalRecords } from '@/utils/blockchain';
import {
  Calendar,
  FileText,
  Activity,
  Heart,
  Plus,
  User,
  MessageSquare,
  Bell,
  ChevronRight,
  BarChart3,
  Clock,
  AlertCircle,
  Video,
  Share2,
  FileBarChart,
  HeartPulse,
} from 'lucide-react';

// Demo doctors for the patient dashboard
const doctors = [
  {
    id: 'doctor_1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    hospital: 'Apollo Hospitals',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=0A84FF&color=fff',
  },
  {
    id: 'doctor_2',
    name: 'Dr. Rajesh Patel',
    specialty: 'Neurologist',
    hospital: 'Fortis Healthcare',
    avatar: 'https://ui-avatars.com/api/?name=Rajesh+Patel&background=30D158&color=fff',
  },
  {
    id: 'doctor_3',
    name: 'Dr. Ananya Singh',
    specialty: 'Pediatrician',
    hospital: 'Max Super Speciality Hospital',
    avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=FF9F0A&color=fff',
  },
];

// Demo upcoming appointments
const upcomingAppointments = [
  {
    id: 'app_1',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    date: 'May 15, 2023',
    time: '10:30 AM',
    status: 'Confirmed',
  },
  {
    id: 'app_2',
    doctorName: 'Dr. Rajesh Patel',
    specialty: 'Neurologist',
    date: 'May 22, 2023',
    time: '2:00 PM',
    status: 'Pending',
  },
];

// Demo medications
const medications = [
  {
    id: 'med_1',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Once daily',
    time: 'Morning',
    refill: 'May 30, 2023',
  },
  {
    id: 'med_2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    time: 'Morning and Evening',
    refill: 'June 15, 2023',
  },
  {
    id: 'med_3',
    name: 'Atorvastatin',
    dosage: '10mg',
    frequency: 'Once daily',
    time: 'Night',
    refill: 'June 5, 2023',
  },
];

// Main component
const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get medical records from blockchain
  const medicalRecords = user ? getUserMedicalRecords(user.id) : [];
  
  // Demo records
  const demoRecords = [
    {
      id: 'record_1',
      title: 'Annual Check-up Results',
      description: 'Comprehensive health examination including blood work, ECG, and general assessment.',
      date: 'April 10, 2023',
      doctor: 'Priya Sharma',
      hospital: 'Apollo Hospitals',
      recordType: 'Lab Report' as 'Lab Report',
      verified: true,
    },
    {
      id: 'record_2',
      title: 'Hypertension Medication',
      description: 'Prescription for Amlodipine 5mg daily for blood pressure management.',
      date: 'March 15, 2023',
      doctor: 'Rajesh Patel',
      hospital: 'Fortis Healthcare',
      recordType: 'Prescription' as 'Prescription',
      verified: true,
    },
    {
      id: 'record_3',
      title: 'COVID-19 Vaccination',
      description: 'COVID-19 vaccination certificate for 2nd dose of Covishield.',
      date: 'January 5, 2023',
      doctor: 'Ananya Singh',
      hospital: 'Max Super Speciality Hospital',
      recordType: 'Vaccination' as 'Vaccination',
      verified: true,
    },
  ];
  
  // Dashboard home component
  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'User'}
              </h2>
              <p className="text-muted-foreground">
                Your health dashboard is updated and ready for you
              </p>
            </div>
            <Button 
              className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-white" 
              onClick={() => navigate('/records')}
            >
              View Health Records
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Activity className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Heart Rate</h3>
            <p className="text-2xl font-bold">78 BPM</p>
            <p className="text-xs text-muted-foreground">Normal Range</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Blood Pressure</h3>
            <p className="text-2xl font-bold">120/80</p>
            <p className="text-xs text-muted-foreground">Measured Today</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Next Appointment</h3>
            <p className="text-lg font-bold">May 15, 10:30 AM</p>
            <p className="text-xs text-muted-foreground">Dr. Priya Sharma</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-medium">Medication Reminder</h3>
            <p className="text-lg font-bold">3 Active Prescriptions</p>
            <p className="text-xs text-muted-foreground">Next: Amlodipine at 8 PM</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No upcoming appointments
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{appointment.doctorName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {appointment.specialty} • {appointment.date}, {appointment.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs ${
                      appointment.status === 'Confirmed' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {appointment.status}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Health Records */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Recent Health Records</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => navigate('/records')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoRecords.slice(0, 3).map((record) => (
              <RecordCard
                key={record.id}
                id={record.id}
                title={record.title}
                description={record.description}
                date={record.date}
                doctor={record.doctor}
                hospital={record.hospital}
                recordType={record.recordType}
                verified={record.verified}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Medication Schedule */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Active Medications</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              Medication History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {medications.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No active medications
            </p>
          ) : (
            <div className="space-y-4">
              {medications.map((medication) => (
                <div 
                  key={medication.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{medication.name} {medication.dosage}</h4>
                      <p className="text-sm text-muted-foreground">
                        {medication.frequency} • {medication.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-right">
                    <p>Refill by:</p>
                    <p className="font-medium">{medication.refill}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Find a Doctor */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Your Doctors</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              Find Doctors
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-all border-border/50">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                      <img 
                        src={doctor.avatar} 
                        alt={doctor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {doctor.specialty}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {doctor.hospital}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-primary border-primary/20"
                      onClick={() => navigate(`/chat/${doctor.id}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Records component
  const DashboardRecords = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Records</h2>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Record
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="all" className="flex-1">All Records</TabsTrigger>
          <TabsTrigger value="prescriptions" className="flex-1">Prescriptions</TabsTrigger>
          <TabsTrigger value="lab-reports" className="flex-1">Lab Reports</TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex-1">Vaccinations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoRecords.map((record) => (
              <RecordCard
                key={record.id}
                id={record.id}
                title={record.title}
                description={record.description}
                date={record.date}
                doctor={record.doctor}
                hospital={record.hospital}
                recordType={record.recordType}
                verified={record.verified}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoRecords
              .filter(record => record.recordType === 'Prescription')
              .map((record) => (
                <RecordCard
                  key={record.id}
                  id={record.id}
                  title={record.title}
                  description={record.description}
                  date={record.date}
                  doctor={record.doctor}
                  hospital={record.hospital}
                  recordType={record.recordType}
                  verified={record.verified}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="lab-reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoRecords
              .filter(record => record.recordType === 'Lab Report')
              .map((record) => (
                <RecordCard
                  key={record.id}
                  id={record.id}
                  title={record.title}
                  description={record.description}
                  date={record.date}
                  doctor={record.doctor}
                  hospital={record.hospital}
                  recordType={record.recordType}
                  verified={record.verified}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vaccinations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoRecords
              .filter(record => record.recordType === 'Vaccination')
              .map((record) => (
                <RecordCard
                  key={record.id}
                  id={record.id}
                  title={record.title}
                  description={record.description}
                  date={record.date}
                  doctor={record.doctor}
                  hospital={record.hospital}
                  recordType={record.recordType}
                  verified={record.verified}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Messages component
  const DashboardMessages = () => (
    <div className="space-y-6 h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
        <Card className="lg:col-span-1 overflow-hidden border-border/50">
          <CardContent className="p-0">
            <div className="p-3 bg-muted/30 border-b border-border/50">
              <h3 className="font-medium">Recent Conversations</h3>
            </div>
            
            <div className="divide-y divide-border/50">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id}
                  className="p-3 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/chat/${doctor.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={doctor.avatar} 
                        alt={doctor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium truncate">{doctor.name}</h4>
                        <span className="text-xs text-muted-foreground">10:30 AM</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Latest message preview goes here...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 flex flex-col h-full border-border/50">
          <ChatInterface 
            recipientId={doctors[0].id}
            recipientName={doctors[0].name}
            recipientAvatar={doctors[0].avatar}
            recipientRole="doctor"
          />
        </Card>
      </div>
    </div>
  );

  // Video Consultation component 
  const DashboardConsultation = () => (
    <VideoConsultation />
  );

  // Social Feed component
  const DashboardSocialFeed = () => (
    <SocialFeed />
  );

  // Government Schemes component
  const DashboardGovernmentSchemes = () => (
    <GovernmentSchemes />
  );

  // Mental Health Support component
  const DashboardMentalHealth = () => (
    <MentalHealthSupport />
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <Card className="sticky top-24 border-border/50">
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <Button
                      variant={activeTab === 'overview' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'overview' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Overview
                    </Button>
                    <Button
                      variant={activeTab === 'messages' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'messages' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                    <Button
                      variant={activeTab === 'consultation' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'consultation' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('consultation')}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Consultation
                    </Button>
                    <Button
                      variant={activeTab === 'records' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'records' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('records')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Records
                    </Button>
                    <Button
                      variant={activeTab === 'appointments' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'appointments' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('appointments')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Appointments
                    </Button>
                    <Button
                      variant={activeTab === 'medications' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'medications' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('medications')}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Medications
                    </Button>
                    <Button
                      variant={activeTab === 'social' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'social' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('social')}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Community
                    </Button>
                    <Button
                      variant={activeTab === 'schemes' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'schemes' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('schemes')}
                    >
                      <FileBarChart className="mr-2 h-4 w-4" />
                      Govt. Schemes
                    </Button>
                    <Button
                      variant={activeTab === 'mental' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'mental' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('mental')}
                    >
                      <HeartPulse className="mr-2 h-4 w-4" />
                      Mental Health
                    </Button>
                    <Button
                      variant={activeTab === 'profile' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'profile' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        activeTab === 'notifications' ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'overview' && <DashboardHome />}
              {activeTab === 'records' && <DashboardRecords />}
              {activeTab === 'messages' && <DashboardMessages />}
              {activeTab === 'consultation' && <DashboardConsultation />}
              {activeTab === 'social' && <DashboardSocialFeed />}
              {activeTab === 'schemes' && <DashboardGovernmentSchemes />}
              {activeTab === 'mental' && <DashboardMentalHealth />}
              {/* Other tabs would be added here */}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PatientDashboard;
