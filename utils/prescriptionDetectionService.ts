
import { toast } from "@/hooks/use-toast";

// Types for prescription detection
export interface DetectionResult {
  isValid: boolean;
  confidence: number;
  documentType: 'prescription' | 'lab_report' | 'unknown';
  detectedFields: string[];
  message: string;
}

// Mock ML model for prescription detection
// In a real app, this would use TensorFlow.js or a similar library
export class PrescriptionDetectionService {
  // Simulate loading an ML model
  private static modelLoaded = false;
  private static modelLoading = false;

  // Initialize the ML model
  static async initModel(): Promise<boolean> {
    if (this.modelLoaded) return true;
    if (this.modelLoading) return false;
    
    this.modelLoading = true;
    
    try {
      // Simulate model loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Prescription detection model loaded");
      this.modelLoaded = true;
      this.modelLoading = false;
      return true;
    } catch (error) {
      console.error("Failed to load prescription detection model:", error);
      this.modelLoading = false;
      return false;
    }
  }

  // Validate if the uploaded document is a valid prescription or lab report
  static async validateDocument(file: File): Promise<DetectionResult> {
    // Ensure model is loaded
    if (!this.modelLoaded) {
      await this.initModel();
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        // Simulate ML processing delay
        await new Promise(r => setTimeout(r, 800));
        
        // Get filename and extension
        const fileName = file.name.toLowerCase();
        const fileExt = fileName.split('.').pop();
        
        // Check if file type is acceptable (PDF, image files)
        const validFileTypes = ['pdf', 'jpg', 'jpeg', 'png'];
        if (!validFileTypes.includes(fileExt || '')) {
          resolve({
            isValid: false,
            confidence: 0.1,
            documentType: 'unknown',
            detectedFields: [],
            message: 'Invalid file type. Only PDF and image files are accepted.'
          });
          return;
        }
        
        // Simple keyword detection to simulate ML model
        // In a real app, we would analyze the content with computer vision or NLP
        const isPrescription = /prescription|medicine|dosage|patient|doctor/i.test(fileName);
        const isLabReport = /lab|report|test|result|blood|analysis/i.test(fileName);
        
        // Simulate some randomness in detection for demonstration purposes
        const rand = Math.random();
        
        // Generate result based on file characteristics
        if (isPrescription || (rand > 0.3 && !isLabReport)) {
          resolve({
            isValid: true,
            confidence: 0.7 + (rand * 0.25),
            documentType: 'prescription',
            detectedFields: ['patient_name', 'medication', 'dosage', 'doctor_signature'],
            message: 'Valid prescription detected'
          });
        } else if (isLabReport || (rand > 0.7)) {
          resolve({
            isValid: true,
            confidence: 0.6 + (rand * 0.3),
            documentType: 'lab_report',
            detectedFields: ['patient_name', 'test_results', 'reference_range'],
            message: 'Valid lab report detected'
          });
        } else {
          resolve({
            isValid: false,
            confidence: 0.2 + (rand * 0.3),
            documentType: 'unknown',
            detectedFields: [],
            message: 'This document does not appear to be a valid medical document'
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          isValid: false,
          confidence: 0,
          documentType: 'unknown',
          detectedFields: [],
          message: 'Error reading file'
        });
      };
      
      // Start reading the file
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }
  
  // Process document and return result with UI notification
  static async processDocument(file: File): Promise<DetectionResult> {
    try {
      const result = await this.validateDocument(file);
      
      if (result.isValid) {
        toast({
          title: "Document Validated",
          description: `${result.documentType === 'prescription' ? 'Prescription' : 'Lab report'} detected (${Math.round(result.confidence * 100)}% confidence)`,
        });
      } else {
        toast({
          title: "Invalid Document",
          description: result.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process the document",
        variant: "destructive"
      });
      
      return {
        isValid: false,
        confidence: 0,
        documentType: 'unknown',
        detectedFields: [],
        message: 'Error processing document'
      };
    }
  }
}
