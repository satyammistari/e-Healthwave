import { PatientRecord } from "@/types/patientRecord";
import * as Tesseract from 'tesseract.js';
import * as natural from 'natural';
import { createQRCode } from "./qrGenerator";
import { sendSMS } from "./smsService";

export class DocumentProcessor {
  private tokenizer: natural.WordTokenizer;
  private classifier: natural.BayesClassifier;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.classifier = new natural.BayesClassifier();
    this.trainClassifier();
  }

  private trainClassifier() {
    // Train the classifier with medical terms
    this.classifier.addDocument('prescription', 'medication');
    this.classifier.addDocument('prescribed', 'medication');
    this.classifier.addDocument('take', 'medication');
    this.classifier.addDocument('diagnosis', 'diagnosis');
    this.classifier.addDocument('condition', 'diagnosis');
    this.classifier.addDocument('lab results', 'lab');
    this.classifier.addDocument('test results', 'lab');
    this.classifier.train();
  }

  async processDocument(file: File): Promise<{
    records: PatientRecord[];
    qrCode: string;
    emergencyAccess: boolean;
  }> {
    try {
      // Perform OCR
      const { data: { text } } = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      );

      // Process text with NLP
      const records = this.extractRecords(text);
      
      // Generate QR code for emergency access
      const qrCode = await createQRCode(JSON.stringify({
        patientId: records[0]?.patientId,
        timestamp: Date.now(),
        emergency: true
      }));

      // Send SMS notification
      await sendSMS({
        to: '+1234567890', // Replace with actual number
        message: `Emergency access QR code generated for patient records`
      });

      return {
        records,
        qrCode,
        emergencyAccess: true
      };
    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error('Failed to process document');
    }
  }

  private extractRecords(text: string): PatientRecord[] {
    const lines = text.split('\n');
    const records: PatientRecord[] = [];
    let currentRecord: Partial<PatientRecord> = {};

    for (const line of lines) {
      const tokens = this.tokenizer.tokenize(line);
      const classification = this.classifier.classify(line);

      switch (classification) {
        case 'medication':
          currentRecord = {
            ...currentRecord,
            type: 'Prescription',
            data: {
              medications: [this.extractMedication(line)]
            }
          };
          break;

        case 'diagnosis':
          currentRecord = {
            ...currentRecord,
            type: 'Initial Consultation',
            data: {
              diagnosis: this.extractDiagnosis(line),
              symptoms: this.extractSymptoms(line)
            }
          };
          break;

        case 'lab':
          currentRecord = {
            ...currentRecord,
            type: 'Lab Results',
            data: this.extractLabResults(line)
          };
          break;
      }

      if (this.isRecordComplete(currentRecord)) {
        records.push(currentRecord as PatientRecord);
        currentRecord = {};
      }
    }

    return records;
  }

  private extractMedication(text: string): any {
    // Extract medication details using regex
    const medRegex = /(\d+mg|\d+\s*mg)\s+([A-Za-z]+)\s+(?:take|use)\s+(\w+\s+\w+)/i;
    const match = text.match(medRegex);
    
    if (match) {
      return {
        name: match[2],
        dosage: match[1],
        frequency: match[3],
        duration: '30 days', // Default duration
        instructions: 'Take as directed'
      };
    }
    return null;
  }

  private extractDiagnosis(text: string): string {
    // Extract diagnosis using NLP
    const diagnosisRegex = /diagnosis:?\s*([A-Za-z\s]+)/i;
    const match = text.match(diagnosisRegex);
    return match ? match[1].trim() : 'Unknown';
  }

  private extractSymptoms(text: string): string[] {
    // Extract symptoms using NLP
    const symptomsRegex = /symptoms:?\s*([A-Za-z\s,]+)/i;
    const match = text.match(symptomsRegex);
    return match ? match[1].split(',').map(s => s.trim()) : [];
  }

  private extractLabResults(text: string): any {
    // Extract lab results using regex
    const results: { [key: string]: string } = {};
    const labRegex = /([A-Za-z]+):?\s*([\d.]+)\s*([A-Za-z\/]+)/g;
    let match;

    while ((match = labRegex.exec(text)) !== null) {
      results[match[1]] = `${match[2]} ${match[3]}`;
    }

    return {
      testName: 'Complete Blood Count',
      results,
      lab: 'City Lab',
      doctor: 'Dr. Smith'
    };
  }

  private isRecordComplete(record: Partial<PatientRecord>): boolean {
    return !!(
      record.type &&
      record.data &&
      (record.type === 'Prescription' ? record.data.medications :
       record.type === 'Lab Results' ? record.data.results :
       record.type === 'Initial Consultation' ? record.data.diagnosis : false)
    );
  }
} 