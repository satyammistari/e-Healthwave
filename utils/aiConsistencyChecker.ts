import { PatientRecord, Medication } from "@/types/patientRecord";

interface ConsistencyCheckResult {
  type: 'warning' | 'error';
  message: string;
  confidence: number;
  recordId: string;
}

export class AIConsistencyChecker {
  private static readonly SIMILARITY_THRESHOLD = 0.8;
  private static readonly TIME_WINDOW_DAYS = 30;

  static checkRecords(records: PatientRecord[]): ConsistencyCheckResult[] {
    const results: ConsistencyCheckResult[] = [];
    
    // Group records by type
    const prescriptions = records.filter(r => r.type === 'Prescription');
    const consultations = records.filter(r => r.type === 'Initial Consultation' || r.type === 'Follow-up Visit');
    
    // Check for duplicate prescriptions
    this.checkDuplicatePrescriptions(prescriptions, results);
    
    // Check for medication interactions
    this.checkMedicationInteractions(prescriptions, results);
    
    // Check for inconsistent diagnoses
    this.checkDiagnosisConsistency(consultations, results);
    
    return results;
  }

  private static checkDuplicatePrescriptions(
    prescriptions: PatientRecord[],
    results: ConsistencyCheckResult[]
  ): void {
    const recentPrescriptions = prescriptions.filter(p => {
      const daysAgo = (Date.now() - p.timestamp) / (1000 * 60 * 60 * 24);
      return daysAgo <= this.TIME_WINDOW_DAYS;
    });

    for (let i = 0; i < recentPrescriptions.length; i++) {
      for (let j = i + 1; j < recentPrescriptions.length; j++) {
        const med1 = recentPrescriptions[i].data.medications[0];
        const med2 = recentPrescriptions[j].data.medications[0];
        
        if (this.isSimilarMedication(med1, med2)) {
          const confidence = this.calculateSimilarity(med1, med2);
          if (confidence >= this.SIMILARITY_THRESHOLD) {
            results.push({
              type: 'warning',
              message: `Possible duplicate prescription detected: ${med1.name} and ${med2.name}`,
              confidence,
              recordId: recentPrescriptions[i].id
            });
          }
        }
      }
    }
  }

  private static checkMedicationInteractions(
    prescriptions: PatientRecord[],
    results: ConsistencyCheckResult[]
  ): void {
    const knownInteractions = new Map<string, string[]>([
      ['Warfarin', ['Aspirin', 'Ibuprofen']],
      ['Simvastatin', ['Grapefruit']],
      ['Metformin', ['Alcohol']]
    ]);

    const activeMedications = prescriptions
      .filter(p => (Date.now() - p.timestamp) / (1000 * 60 * 60 * 24) <= this.TIME_WINDOW_DAYS)
      .flatMap(p => p.data.medications);

    for (const med of activeMedications) {
      const interactions = knownInteractions.get(med.name) || [];
      for (const otherMed of activeMedications) {
        if (med !== otherMed && interactions.includes(otherMed.name)) {
          results.push({
            type: 'error',
            message: `Potential medication interaction: ${med.name} and ${otherMed.name}`,
            confidence: 0.85,
            recordId: prescriptions.find(p => p.data.medications.includes(med))?.id || ''
          });
        }
      }
    }
  }

  private static checkDiagnosisConsistency(
    consultations: PatientRecord[],
    results: ConsistencyCheckResult[]
  ): void {
    const recentConsultations = consultations
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);

    if (recentConsultations.length < 2) return;

    const diagnoses = recentConsultations.map(c => c.data.diagnosis.toLowerCase());
    const uniqueDiagnoses = new Set(diagnoses);

    if (uniqueDiagnoses.size > 1) {
      results.push({
        type: 'warning',
        message: 'Inconsistent diagnoses detected across recent consultations',
        confidence: 0.8,
        recordId: recentConsultations[0].id
      });
    }
  }

  private static isSimilarMedication(med1: Medication, med2: Medication): boolean {
    return (
      med1.name.toLowerCase() === med2.name.toLowerCase() ||
      this.calculateSimilarity(med1, med2) >= this.SIMILARITY_THRESHOLD
    );
  }

  private static calculateSimilarity(med1: Medication, med2: Medication): number {
    // Simple similarity calculation based on medication properties
    let similarity = 0;
    const properties = ['name', 'dosage', 'frequency', 'duration'];
    
    for (const prop of properties) {
      if (med1[prop].toLowerCase() === med2[prop].toLowerCase()) {
        similarity += 0.25;
      }
    }
    
    return similarity;
  }
} 