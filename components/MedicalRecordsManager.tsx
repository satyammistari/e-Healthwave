
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, Eye, Upload, Printer, FileText } from "lucide-react";
import RecordCard from "@/components/RecordCard";
import EHRUploader from "@/components/EHRUploader";
import { generateMedicalRecordPDF } from "@/utils/pdfService";

interface MedicalRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  doctor: string;
  hospital?: string;
  recordType: 'Prescription' | 'Lab Report' | 'Diagnosis' | 'Vaccination' | 'Surgery';
  verified: boolean;
}

const mockRecords: MedicalRecord[] = [
  {
    id: 'rec_001',
    title: 'Annual Physical Examination',
    description: 'Complete physical examination with blood work, vitals, and general health assessment.',
    date: '2023-11-15',
    doctor: 'Sarah Chen',
    recordType: 'Diagnosis',
    verified: true
  },
  {
    id: 'rec_002',
    title: 'Blood Pressure Medication',
    description: 'Prescription for Lisinopril 10mg, take once daily for hypertension management.',
    date: '2023-10-20',
    doctor: 'Sarah Chen',
    recordType: 'Prescription',
    verified: true
  },
  {
    id: 'rec_003',
    title: 'Complete Blood Count (CBC)',
    description: 'Laboratory analysis of blood showing WBC, RBC, hemoglobin, and platelet counts within normal ranges.',
    date: '2023-09-05',
    doctor: 'Anand Verma',
    hospital: 'City General Hospital',
    recordType: 'Lab Report',
    verified: true
  },
  {
    id: 'rec_004',
    title: 'Influenza Vaccination',
    description: 'Annual flu shot administered, seasonal quadrivalent influenza vaccine.',
    date: '2023-08-30',
    doctor: 'Priya Sharma',
    recordType: 'Vaccination',
    verified: false
  },
  {
    id: 'rec_005',
    title: 'Appendectomy Procedure',
    description: 'Surgical removal of inflamed appendix, laparoscopic procedure with three incision points.',
    date: '2023-05-12',
    doctor: 'Michael Johnson',
    hospital: 'Memorial Surgical Center',
    recordType: 'Surgery',
    verified: true
  }
];

const MedicalRecordsManager = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showUploader, setShowUploader] = useState(false);
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && record.recordType.toLowerCase() === activeTab.toLowerCase();
  });

  const handleDownloadRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    try {
      // In a real app, we would fetch complete record data
      const recordData = {
        id: record.id,
        title: record.title,
        description: record.description,
        date: record.date,
        patientName: "John Doe", // Mock data
        patientId: "PAT12345",
        recordType: record.recordType,
        doctorName: record.doctor,
        doctorSpecialty: "Cardiologist", // Mock data
        hospital: record.hospital || "eHealthWave Medical Center"
      };

      const pdfDataUrl = generateMedicalRecordPDF(recordData);

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfDataUrl;
      downloadLink.download = `medical-record-${record.id}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast({
        title: "Record Downloaded",
        description: "Medical record PDF has been downloaded successfully",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Download Failed",
        description: "Unable to download the medical record",
        variant: "destructive"
      });
    }
  };

  const handleViewRecord = (recordId: string) => {
    toast({
      title: "Record Viewed",
      description: "Viewing detailed medical record information",
    });
    // In a real app, this would open a modal with detailed record view
  };

  const handleAddRecord = (recordId: string) => {
    // Simulate adding the new record from EHR
    const newRecord: MedicalRecord = {
      id: recordId,
      title: "New Medical Record",
      description: "This medical record was added through the EHR system",
      date: new Date().toISOString().split('T')[0],
      doctor: "Sarah Chen",
      recordType: "Diagnosis",
      verified: true
    };

    setRecords([newRecord, ...records]);
    setShowUploader(false);

    toast({
      title: "Record Added",
      description: "New medical record has been added successfully",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Medical Records Manager
        </CardTitle>
        <CardDescription>
          Upload, view, and download patient medical records
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search records..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => setShowUploader(!showUploader)}>
              <Upload className="h-4 w-4 mr-2" />
              {showUploader ? "Hide Uploader" : "Upload Record"}
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {showUploader && (
          <div className="my-6">
            <EHRUploader
              patientId="patient_123"
              doctorId="doctor_1"
              hospitalId="hospital_1"
              onSuccess={handleAddRecord}
            />
          </div>
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
            <TabsTrigger value="lab report">Lab Reports</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnoses</TabsTrigger>
            <TabsTrigger value="vaccination">Vaccinations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
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
                ))
              ) : (
                <div className="col-span-3 text-center py-12 border rounded-md bg-muted/10">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No medical records found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="prescription" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
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
                ))
              ) : (
                <div className="col-span-3 text-center py-12 border rounded-md bg-muted/10">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No prescriptions found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="lab report" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
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
                ))
              ) : (
                <div className="col-span-3 text-center py-12 border rounded-md bg-muted/10">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No lab reports found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="diagnosis" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
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
                ))
              ) : (
                <div className="col-span-3 text-center py-12 border rounded-md bg-muted/10">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No diagnoses found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="vaccination" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
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
                ))
              ) : (
                <div className="col-span-3 text-center py-12 border rounded-md bg-muted/10">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No vaccinations found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordsManager;
