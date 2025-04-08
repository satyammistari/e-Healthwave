
import { toast } from '@/hooks/use-toast';
import { addMedicalRecord } from '@/utils/blockchain';

// Define types for medical records
export interface MedicalRecord {
  id: string;
  patientId: string;
  recordType: string;
  title: string;
  timestamp: number;
  data: any;
}

export interface PrescriptionRecord extends MedicalRecord {
  recordType: 'Prescription';
  data: {
    medication: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    prescribedBy: string;
  };
}

export interface LabRecord extends MedicalRecord {
  recordType: 'LabReport';
  data: {
    testName: string;
    results: Record<string, any>;
    normalRanges?: Record<string, any>;
    labName: string;
    collectedDate: string;
    reportedDate: string;
  };
}

// AI consistency check service
export const RecordConsistencyService = {
  // Check for duplicate prescriptions
  checkDuplicatePrescriptions: (
    prescriptions: PrescriptionRecord[]
  ): { hasDuplicates: boolean; duplicates: PrescriptionRecord[][]; details: string[] } => {
    const duplicates: PrescriptionRecord[][] = [];
    const details: string[] = [];
    const medicationMap = new Map<string, PrescriptionRecord[]>();

    // Group prescriptions by medication
    prescriptions.forEach(prescription => {
      const medication = prescription.data.medication.toLowerCase();
      if (!medicationMap.has(medication)) {
        medicationMap.set(medication, []);
      }
      medicationMap.get(medication)?.push(prescription);
    });

    // Check for duplicates (medications with overlapping periods)
    for (const [medication, meds] of medicationMap.entries()) {
      if (meds.length > 1) {
        // Check for date overlaps
        for (let i = 0; i < meds.length; i++) {
          for (let j = i + 1; j < meds.length; j++) {
            const med1 = meds[i];
            const med2 = meds[j];
            
            const start1 = new Date(med1.data.startDate);
            const end1 = new Date(med1.data.endDate);
            const start2 = new Date(med2.data.startDate);
            const end2 = new Date(med2.data.endDate);
            
            // Check if date ranges overlap
            if ((start1 <= end2 && start2 <= end1) || 
                (start2 <= end1 && start1 <= end2)) {
              // If dosage and frequency are the same, it's likely a duplicate
              if (med1.data.dosage === med2.data.dosage && 
                  med1.data.frequency === med2.data.frequency) {
                duplicates.push([med1, med2]);
                
                details.push(
                  `Duplicate prescription detected: ${med1.data.medication} ${med1.data.dosage} ${med1.data.frequency} prescribed on ${new Date(med1.timestamp).toLocaleDateString()} overlaps with prescription from ${new Date(med2.timestamp).toLocaleDateString()}`
                );
              }
            }
          }
        }
      }
    }

    return {
      hasDuplicates: duplicates.length > 0,
      duplicates,
      details
    };
  },

  // Add a new prescription with consistency check
  addPrescription: async (
    patientId: string, 
    prescriptionData: PrescriptionRecord['data'],
    existingPrescriptions: PrescriptionRecord[]
  ): Promise<{ success: boolean; record?: PrescriptionRecord; message?: string; issues?: string[] }> => {
    try {
      // Create new prescription record
      const newPrescription: PrescriptionRecord = {
        id: `prescription_${Date.now()}`,
        patientId,
        recordType: 'Prescription',
        title: `Prescription for ${prescriptionData.medication}`,
        timestamp: Date.now(),
        data: prescriptionData
      };
      
      // Check for duplicates against existing prescriptions
      const check = RecordConsistencyService.checkDuplicatePrescriptions([
        ...existingPrescriptions,
        newPrescription
      ]);
      
      if (check.hasDuplicates) {
        // Alert about duplicate, but still allow adding with confirmation
        toast({
          title: "Duplicate Prescription Detected",
          description: "This appears to be a duplicate of an existing prescription. Please review.",
          variant: "destructive"
        });
        
        return {
          success: false,
          message: "Duplicate prescription detected. Please review before adding.",
          issues: check.details
        };
      }
      
      // Check for medication interactions
      const medications = [...existingPrescriptions, newPrescription].map(p => p.data.medication);
      const interactions = RecordConsistencyService.checkMedicationInteractions(medications);
      
      if (interactions.length > 0) {
        toast({
          title: "Medication Interactions Detected",
          description: "Potential interactions found with existing medications.",
          variant: "destructive"
        });
        
        return {
          success: false,
          message: "Potential medication interactions detected. Please review before adding.",
          issues: interactions
        };
      }
      
      // Add to blockchain
      const blockchainRecord = await addMedicalRecord(patientId, {
        type: 'PRESCRIPTION',
        data: prescriptionData
      });
      
      toast({
        title: "Prescription Added",
        description: "The prescription has been added to your medical records."
      });
      
      return {
        success: true,
        record: {
          ...newPrescription,
          id: blockchainRecord.id
        }
      };
      
    } catch (error) {
      console.error("Error adding prescription:", error);
      return {
        success: false,
        message: "Failed to add prescription"
      };
    }
  },
  
  // Check for medication interactions (simplified mock implementation)
  checkMedicationInteractions: (medications: string[]): string[] => {
    // Mock database of medication interactions
    const knownInteractions: Record<string, string[]> = {
      'warfarin': ['aspirin', 'ibuprofen', 'naproxen'],
      'lisinopril': ['potassium supplements', 'spironolactone'],
      'simvastatin': ['clarithromycin', 'erythromycin', 'itraconazole'],
      'metformin': ['contrast dyes'],
      'levothyroxine': ['calcium supplements', 'iron supplements'],
      'amoxicillin': ['tetracycline'],
      'ciprofloxacin': ['antacids', 'calcium supplements', 'iron supplements'],
      'furosemide': ['gentamicin', 'lithium'],
      'digoxin': ['verapamil', 'amiodarone'],
      'phenytoin': ['valproic acid', 'alcohol'],
      'clopidogrel': ['omeprazole', 'esomeprazole'],
      'sildenafil': ['nitrates', 'nitroglycerin'],
      'fluoxetine': ['tramadol', 'sumatriptan', 'meperidine']
    };
    
    const interactions: string[] = [];
    
    // Check each medication against every other for interactions
    for (let i = 0; i < medications.length; i++) {
      const med1 = medications[i].toLowerCase();
      
      // Check if this medication has known interactions
      if (knownInteractions[med1]) {
        for (let j = 0; j < medications.length; j++) {
          if (i !== j) {
            const med2 = medications[j].toLowerCase();
            if (knownInteractions[med1].includes(med2)) {
              interactions.push(`${medications[i]} may interact with ${medications[j]}`);
            }
          }
        }
      }
    }
    
    return interactions;
  },
  
  // Analyze lab results for inconsistencies
  analyzeLabResults: (
    labRecord: LabRecord,
    previousLabRecords: LabRecord[]
  ): { hasIssues: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // If no previous records, nothing to compare
    if (previousLabRecords.length === 0) {
      return { hasIssues: false, issues: [] };
    }
    
    // Get previous lab records of the same test type
    const previousSameTests = previousLabRecords.filter(
      lab => lab.data.testName.toLowerCase() === labRecord.data.testName.toLowerCase()
    ).sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending
    
    if (previousSameTests.length === 0) {
      return { hasIssues: false, issues: [] };
    }
    
    // Get most recent previous test
    const mostRecentTest = previousSameTests[0];
    
    // Compare each result value with previous test
    Object.entries(labRecord.data.results).forEach(([key, value]) => {
      if (
        mostRecentTest.data.results[key] !== undefined &&
        typeof value === 'number' &&
        typeof mostRecentTest.data.results[key] === 'number'
      ) {
        const previousValue = mostRecentTest.data.results[key];
        const percentChange = Math.abs((value - previousValue) / previousValue * 100);
        
        // Flag significant changes (e.g., more than 50% change from last test)
        if (percentChange > 50) {
          issues.push(
            `${key} value has changed by ${percentChange.toFixed(1)}% since last test (${previousValue} → ${value})`
          );
        }
        
        // Check if value is outside normal range
        if (
          labRecord.data.normalRanges && 
          labRecord.data.normalRanges[key] &&
          typeof labRecord.data.normalRanges[key].min === 'number' &&
          typeof labRecord.data.normalRanges[key].max === 'number'
        ) {
          const { min, max } = labRecord.data.normalRanges[key];
          if (value < min || value > max) {
            issues.push(
              `${key} value (${value}) is outside the normal range (${min}-${max})`
            );
          }
        }
      }
    });
    
    return {
      hasIssues: issues.length > 0,
      issues
    };
  },
  
  // Verify medical record data integrity
  verifyRecordIntegrity: (record: MedicalRecord): { isValid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    // Basic validation for all records
    if (!record.id) issues.push('Record ID is missing');
    if (!record.patientId) issues.push('Patient ID is missing');
    if (!record.recordType) issues.push('Record type is missing');
    if (!record.timestamp) issues.push('Timestamp is missing');
    
    // Type-specific validation
    if (record.recordType === 'Prescription') {
      const prescription = record as PrescriptionRecord;
      
      if (!prescription.data.medication) issues.push('Medication name is missing');
      if (!prescription.data.dosage) issues.push('Dosage information is missing');
      if (!prescription.data.frequency) issues.push('Frequency information is missing');
      if (!prescription.data.startDate) issues.push('Start date is missing');
      if (!prescription.data.endDate) issues.push('End date is missing');
      if (!prescription.data.prescribedBy) issues.push('Prescriber information is missing');
      
      // Check that start date is before end date
      if (prescription.data.startDate && prescription.data.endDate) {
        const startDate = new Date(prescription.data.startDate);
        const endDate = new Date(prescription.data.endDate);
        
        if (startDate > endDate) {
          issues.push('Start date is after end date');
        }
      }
    } else if (record.recordType === 'LabReport') {
      const labReport = record as unknown as LabRecord;
      
      if (!labReport.data.testName) issues.push('Test name is missing');
      if (!labReport.data.results || Object.keys(labReport.data.results).length === 0) {
        issues.push('Test results are missing');
      }
      if (!labReport.data.labName) issues.push('Laboratory name is missing');
      if (!labReport.data.collectedDate) issues.push('Collection date is missing');
      if (!labReport.data.reportedDate) issues.push('Report date is missing');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
};
