
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecordCard from '@/components/RecordCard';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Shield, 
  ChevronDown,
  FileText,
  Download,
  Calendar,
  User,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { addMedicalRecord, getUserMedicalRecords } from '@/utils/blockchain';

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
  {
    id: 'record_4',
    title: 'Diagnostic Imaging',
    description: 'X-ray of the chest to assess lung condition.',
    date: 'February 22, 2023',
    doctor: 'Vikram Malhotra',
    hospital: 'AIIMS Delhi',
    recordType: 'Lab Report' as 'Lab Report',
    verified: true,
  },
  {
    id: 'record_5',
    title: 'Diabetes Medication',
    description: 'Prescription for Metformin 500mg twice daily for blood sugar management.',
    date: 'December 10, 2022',
    doctor: 'Kavita Reddy',
    hospital: 'Manipal Hospitals',
    recordType: 'Prescription' as 'Prescription',
    verified: true,
  },
  {
    id: 'record_6',
    title: 'Influenza Vaccination',
    description: 'Annual influenza vaccination for seasonal flu prevention.',
    date: 'November 18, 2022',
    doctor: 'Suresh Kumar',
    hospital: 'Medanta',
    recordType: 'Vaccination' as 'Vaccination',
    verified: true,
  },
  {
    id: 'record_7',
    title: 'Allergy Test Results',
    description: 'Comprehensive allergy panel to identify potential triggers.',
    date: 'October 5, 2022',
    doctor: 'Meera Joshi',
    hospital: 'BLK Super Speciality Hospital',
    recordType: 'Lab Report' as 'Lab Report',
    verified: true,
  },
  {
    id: 'record_8',
    title: 'Appendectomy Surgery Report',
    description: 'Surgical report for appendectomy procedure performed under general anesthesia.',
    date: 'August 12, 2022',
    doctor: 'Arjun Malhotra',
    hospital: 'Indraprastha Apollo Hospital',
    recordType: 'Diagnosis' as 'Diagnosis',
    verified: true,
  },
  {
    id: 'record_9',
    title: 'Cholesterol Management',
    description: 'Prescription for Atorvastatin 10mg daily for cholesterol management.',
    date: 'July 25, 2022',
    doctor: 'Rajesh Patel',
    hospital: 'Fortis Healthcare',
    recordType: 'Prescription' as 'Prescription',
    verified: true,
  },
];

const Records = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<typeof demoRecords[0] | null>(null);
  
  // Get blockchain records if user is authenticated
  const blockchainRecords = user ? getUserMedicalRecords(user.id) : [];
  
  // Combine demo records with blockchain records for demonstration
  const allRecords = [...demoRecords];
  
  // Filter records based on active tab and search term
  const filteredRecords = allRecords.filter(record => {
    const matchesTab = activeTab === 'all' || record.recordType.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = 
      searchTerm === '' || 
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesTab && matchesSearch;
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleUploadRecord = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload health records",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate record upload and blockchain registration
    setTimeout(() => {
      try {
        // Add record to blockchain
        const newRecordData = {
          title: "Newly Uploaded Record",
          description: "This record was securely uploaded and verified with blockchain",
          timestamp: Date.now(),
          doctor: "Self Upload",
          verified: true,
        };
        
        addMedicalRecord(user.id, newRecordData);
        
        toast({
          title: "Record Uploaded Successfully",
          description: "Your health record has been securely stored on the blockchain",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your record",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }, 2000);
  };
  
  const handleViewRecord = (record: typeof demoRecords[0]) => {
    setSelectedRecord(record);
    setShowDetailView(true);
  };
  
  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedRecord(null);
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showDetailView && selectedRecord ? (
            // Detail view of a single record
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToList}
                  className="flex items-center gap-2"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  Back to Records
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verify
                  </Button>
                </div>
              </div>
              
              <Card className="border-border/50 mb-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          selectedRecord.recordType === 'Lab Report'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : selectedRecord.recordType === 'Prescription'
                            ? 'bg-purple-50 text-purple-600 border border-purple-200'
                            : selectedRecord.recordType === 'Vaccination'
                            ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                            : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                          {selectedRecord.recordType}
                        </div>
                        {selectedRecord.verified && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Shield className="h-3 w-3" />
                            Blockchain Verified
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{selectedRecord.title}</CardTitle>
                      <CardDescription className="mt-1">{selectedRecord.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {selectedRecord.date}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Doctor</p>
                      <p className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Dr. {selectedRecord.doctor}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Hospital/Clinic</p>
                      <p className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {selectedRecord.hospital}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="font-medium mb-4">Record Details</h3>
                    <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Record content would be displayed here (images, PDFs, or structured data)
                      </p>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Full Record
                      </Button>
                    </div>
                  </div>
                  
                  {selectedRecord.recordType === 'Prescription' && (
                    <div className="border-t border-border/50 pt-6">
                      <h3 className="font-medium mb-4">Prescription Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <h4 className="font-medium mb-1">Medication</h4>
                            <p className="text-muted-foreground">Amlodipine 5mg</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <h4 className="font-medium mb-1">Dosage</h4>
                            <p className="text-muted-foreground">Once daily, morning</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <h4 className="font-medium mb-1">Duration</h4>
                            <p className="text-muted-foreground">3 months</p>
                          </div>
                          <div className="p-4 rounded-lg bg-secondary/50">
                            <h4 className="font-medium mb-1">Refill Date</h4>
                            <p className="text-muted-foreground">June 15, 2023</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-600 mb-1">Special Instructions</h4>
                            <p className="text-sm text-yellow-700">Take with food. Avoid grapefruit juice. Monitor blood pressure regularly.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.recordType === 'Lab Report' && (
                    <div className="border-t border-border/50 pt-6">
                      <h3 className="font-medium mb-4">Lab Results</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-secondary/50">
                              <th className="text-left p-3 border border-border/50">Test Name</th>
                              <th className="text-left p-3 border border-border/50">Result</th>
                              <th className="text-left p-3 border border-border/50">Normal Range</th>
                              <th className="text-left p-3 border border-border/50">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-3 border border-border/50">Hemoglobin</td>
                              <td className="p-3 border border-border/50">14.2 g/dL</td>
                              <td className="p-3 border border-border/50">13.5-17.5 g/dL</td>
                              <td className="p-3 border border-border/50">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600">
                                  Normal
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3 border border-border/50">White Blood Cell Count</td>
                              <td className="p-3 border border-border/50">9.8 x10^9/L</td>
                              <td className="p-3 border border-border/50">4.5-11.0 x10^9/L</td>
                              <td className="p-3 border border-border/50">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600">
                                  Normal
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3 border border-border/50">Cholesterol (Total)</td>
                              <td className="p-3 border border-border/50">210 mg/dL</td>
                              <td className="p-3 border border-border/50">Less than 200 mg/dL</td>
                              <td className="p-3 border border-border/50">
                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-600">
                                  Borderline High
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="font-medium mb-4">Blockchain Verification</h3>
                    <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3 border border-green-200">
                      <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-600 mb-1">Record Authenticity Verified</h4>
                        <p className="text-sm text-green-700">
                          This record has been cryptographically verified on the blockchain.
                          Last verification: {new Date().toLocaleDateString()}
                        </p>
                        <div className="mt-2 text-xs text-green-600 font-mono bg-green-100 p-2 rounded">
                          Hash: {selectedRecord.id}_0x8f4e5d3c2b1a9876543210fedcba9876543210fe
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={handleBackToList}
                  className="flex items-center gap-2"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  Back to Records
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                    onClick={() => {
                      // In a real app, we would implement sharing functionality
                      toast({
                        title: "Share Functionality",
                        description: "Record sharing would be implemented here",
                      });
                    }}
                  >
                    <User className="h-4 w-4" />
                    Share with Doctor
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // List view of all records
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Health Records</h1>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={handleUploadRecord}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Record
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verified Only
                  </Button>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Records</TabsTrigger>
                  <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
                  <TabsTrigger value="lab report">Lab Reports</TabsTrigger>
                  <TabsTrigger value="vaccination">Vaccinations</TabsTrigger>
                  <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="space-y-6">
                  {filteredRecords.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No records found</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchTerm 
                          ? "No records match your search criteria" 
                          : "You don't have any health records yet"}
                      </p>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={handleUploadRecord}
                        disabled={isUploading}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Record
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRecords.map((record) => (
                        <div 
                          key={record.id} 
                          className="cursor-pointer transition-transform hover:scale-[1.01]"
                          onClick={() => handleViewRecord(record)}
                        >
                          <RecordCard
                            id={record.id}
                            title={record.title}
                            description={record.description}
                            date={record.date}
                            doctor={record.doctor}
                            hospital={record.hospital}
                            recordType={record.recordType}
                            verified={record.verified}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              {filteredRecords.length > 0 && (
                <div className="mt-12 rounded-lg p-6 bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <Shield className="h-8 w-8 text-blue-600 shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-800 mb-2">Blockchain-Secured Records</h3>
                      <p className="text-blue-700 mb-4">
                        All your health records are secured with advanced blockchain technology, 
                        ensuring tamper-proof storage and complete privacy. You control who can 
                        access your health information.
                      </p>
                      <Button variant="outline" className="bg-white border-blue-300 text-blue-700">
                        Learn More About Your Data Security
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Records;
