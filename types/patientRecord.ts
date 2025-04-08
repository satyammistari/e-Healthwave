export interface PatientRecord {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  hospitalId?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  medications: Medication[];
  doctor: string;
  pharmacy: string;
  timestamp: number;
}

export interface LabResult {
  testType: string;
  results: Record<string, string>;
  status: string;
  lab: string;
}

export interface Consultation {
  symptoms: string[];
  diagnosis: string;
  notes: string;
  doctor: string;
  hospital: string;
} 