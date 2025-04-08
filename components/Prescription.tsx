
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, MinusCircle, FileDown, FilePlus, Pill, Clock } from "lucide-react";
import { PrescriptionData, generatePrescriptionPDF } from "@/utils/pdfService";

interface MedicationInput {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const Prescription = () => {
  const { toast } = useToast();
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState<MedicationInput[]>([
    { id: "1", name: "", dosage: "", frequency: "", duration: "" }
  ]);
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const addMedication = () => {
    setMedications([
      ...medications, 
      { 
        id: Date.now().toString(),
        name: "", 
        dosage: "", 
        frequency: "", 
        duration: "" 
      }
    ]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    } else {
      toast({
        title: "Cannot Remove",
        description: "Prescription must have at least one medication",
        variant: "destructive"
      });
    }
  };

  const updateMedication = (id: string, field: keyof MedicationInput, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const generatePDF = () => {
    // Validate form
    if (!patientName || !patientId || !diagnosis || medications.some(med => !med.name)) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const data: PrescriptionData = {
        patientName,
        patientId,
        date: new Date().toLocaleDateString(),
        diagnosis,
        medications: medications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration
        })),
        instructions,
        doctorName: "Sarah Chen",
        doctorSpecialty: "Cardiologist",
        hospitalName: "eHealthWave Medical Center"
      };

      const pdfDataUrl = generatePrescriptionPDF(data);

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfDataUrl;
      downloadLink.download = `prescription_${patientId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast({
        title: "Success",
        description: "Prescription generated and downloaded successfully",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate prescription PDF",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePrescription = () => {
    // Here we would save to database in a real app
    toast({
      title: "Prescription Saved",
      description: "Prescription has been saved to patient records",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilePlus className="h-5 w-5" />
          Create Prescription
        </CardTitle>
        <CardDescription>
          Fill out the form to create a new prescription for your patient
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Patient Name*</Label>
            <Input 
              id="patient-name" 
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter patient name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-id">Patient ID*</Label>
            <Input 
              id="patient-id" 
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis*</Label>
          <Textarea 
            id="diagnosis" 
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis details"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Medications*</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addMedication}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {medications.map((med, index) => (
            <div 
              key={med.id} 
              className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-muted/20"
            >
              <div className="space-y-2">
                <Label htmlFor={`med-name-${med.id}`}>Medication Name*</Label>
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id={`med-name-${med.id}`}
                    value={med.name}
                    onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                    placeholder="Medication name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-dosage-${med.id}`}>Dosage</Label>
                <Input 
                  id={`med-dosage-${med.id}`}
                  value={med.dosage}
                  onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                  placeholder="e.g., 10mg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-frequency-${med.id}`}>Frequency</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id={`med-frequency-${med.id}`}
                    value={med.frequency}
                    onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                    placeholder="e.g., Twice daily"
                  />
                </div>
              </div>
              
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`med-duration-${med.id}`}>Duration</Label>
                  <Input 
                    id={`med-duration-${med.id}`}
                    value={med.duration}
                    onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                    placeholder="e.g., 7 days"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeMedication(med.id)}
                  className="mb-0.5"
                >
                  <MinusCircle className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Special Instructions</Label>
          <Textarea 
            id="instructions" 
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Additional instructions for the patient"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={savePrescription}
        >
          Save Prescription
        </Button>
        <Button 
          onClick={generatePDF}
          disabled={isGenerating}
        >
          <FileDown className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating PDF..." : "Generate PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Prescription;
