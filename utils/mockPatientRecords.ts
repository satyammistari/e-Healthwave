import { PatientRecord, Medication } from "@/types/patientRecord";

export function generateMockRecords(patientId: string): PatientRecord[] {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  // Common medications that will trigger interactions
  const medications: Medication[] = [
    {
      name: "Warfarin",
      dosage: "5mg",
      frequency: "Once daily",
      duration: "30 days",
      instructions: "Take with food"
    },
    {
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      duration: "30 days",
      instructions: "Take with water"
    },
    {
      name: "Simvastatin",
      dosage: "20mg",
      frequency: "Once daily at bedtime",
      duration: "30 days",
      instructions: "Avoid grapefruit"
    }
  ];

  return [
    // Initial Consultation (7 days ago)
    {
      id: "REC001",
      type: "Initial Consultation",
      timestamp: now - (7 * oneDay),
      data: {
        symptoms: ["Chest pain", "Shortness of breath"],
        diagnosis: "Hypertension",
        treatmentPlan: "Start medication and lifestyle changes",
        doctor: "Dr. Smith",
        notes: "Patient shows signs of high blood pressure"
      },
      hospitalId: "HOSP001"
    },
    // First Prescription (6 days ago) - Will trigger interaction alert
    {
      id: "REC002",
      type: "Prescription",
      timestamp: now - (6 * oneDay),
      data: {
        medications: [medications[0]], // Warfarin
        doctor: "Dr. Smith",
        pharmacy: "City Pharmacy"
      },
      hospitalId: "HOSP001"
    },
    // Second Prescription (5 days ago) - Will trigger interaction alert
    {
      id: "REC003",
      type: "Prescription",
      timestamp: now - (5 * oneDay),
      data: {
        medications: [medications[1]], // Aspirin
        doctor: "Dr. Smith",
        pharmacy: "City Pharmacy"
      },
      hospitalId: "HOSP001"
    },
    // Lab Results (4 days ago)
    {
      id: "REC004",
      type: "Lab Results",
      timestamp: now - (4 * oneDay),
      data: {
        testName: "Complete Blood Count",
        results: {
          "WBC": "7.5 x 10^9/L",
          "RBC": "4.5 x 10^12/L",
          "Hemoglobin": "14.0 g/dL"
        },
        lab: "City Lab",
        doctor: "Dr. Smith"
      },
      hospitalId: "HOSP001"
    },
    // Follow-up Visit (3 days ago) - Will trigger diagnosis inconsistency
    {
      id: "REC005",
      type: "Follow-up Visit",
      timestamp: now - (3 * oneDay),
      data: {
        symptoms: ["Improved breathing", "Mild headache"],
        diagnosis: "Cardiovascular Disease", // Different diagnosis
        treatmentPlan: "Continue medication, add lifestyle changes",
        doctor: "Dr. Johnson",
        notes: "Patient responding well to treatment"
      },
      hospitalId: "HOSP001"
    },
    // Third Prescription (2 days ago) - Will trigger duplicate alert
    {
      id: "REC006",
      type: "Prescription",
      timestamp: now - (2 * oneDay),
      data: {
        medications: [medications[1]], // Another Aspirin prescription
        doctor: "Dr. Johnson",
        pharmacy: "City Pharmacy"
      },
      hospitalId: "HOSP001"
    },
    // X-Ray Report (1 day ago)
    {
      id: "REC007",
      type: "X-Ray Report",
      timestamp: now - oneDay,
      data: {
        type: "Chest X-Ray",
        findings: "Normal heart size, clear lungs",
        radiologist: "Dr. Williams",
        doctor: "Dr. Johnson"
      },
      hospitalId: "HOSP001"
    }
  ];
} 