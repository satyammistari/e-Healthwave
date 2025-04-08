
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PrescriptionDetectionService, DetectionResult } from "@/utils/prescriptionDetectionService";
import { FileUp, CheckCircle, AlertTriangle, FileText, FileX, Trash } from 'lucide-react';
import { addRecordToBlockchain } from "@/utils/blockchain";
import { uploadMedicalDocument } from "@/utils/medicalDocumentService";

interface MedicalDocumentValidatorProps {
  patientId: string;
  doctorId?: string;
}

const MedicalDocumentValidator: React.FC<MedicalDocumentValidatorProps> = ({ patientId, doctorId = "doctor_system" }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<DetectionResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setValidationResult(null);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setValidationResult(null);
      setUploadProgress(0);
    }
  };

  const validateDocument = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setUploadProgress(30);

    try {
      // Initialize ML model if not already loaded
      await PrescriptionDetectionService.initModel();
      setUploadProgress(50);

      // Validate document using ML
      const result = await PrescriptionDetectionService.processDocument(selectedFile);
      setValidationResult(result);
      setUploadProgress(80);

      // If valid, upload to blockchain
      if (result.isValid) {
        // Generate tags based on the document type
        const tags = [result.documentType, ...result.detectedFields];
        
        // Upload document (this writes to blockchain too)
        await uploadMedicalDocument(selectedFile, patientId, doctorId, tags);
        
        // Additional blockchain record for ML validation
        addRecordToBlockchain({
          type: 'ML_DOCUMENT_VALIDATION',
          patientId,
          documentType: result.documentType,
          confidenceScore: result.confidence,
          timestamp: Date.now(),
          validatedFields: result.detectedFields
        });
        
        setUploadProgress(100);
      } else {
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Error validating document:", error);
      setValidationResult({
        isValid: false,
        confidence: 0,
        documentType: 'unknown',
        detectedFields: [],
        message: 'Error validating document'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setValidationResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Medical Document Validator
        </CardTitle>
        <CardDescription>
          Upload prescriptions or lab reports for AI validation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            selectedFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <FileUp className="h-12 w-12 text-muted-foreground/70" />
              <h3 className="font-medium">Drag and drop your document</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, JPG, PNG
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Select Document
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <FileText className="h-10 w-10 text-primary" />
              <h3 className="font-medium">{selectedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
              </p>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={resetForm}
                  disabled={isProcessing}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Remove
                </Button>
                <Button 
                  size="sm"
                  onClick={validateDocument}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Validate Document"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing document...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {validationResult && (
          <Alert className={validationResult.isValid 
            ? "bg-green-500/10 border-green-500" 
            : "bg-red-500/10 border-red-500"
          }>
            {validationResult.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
            <AlertTitle>
              {validationResult.isValid 
                ? `Valid ${validationResult.documentType === 'prescription' ? 'prescription' : 'lab report'} detected` 
                : "Invalid document"
              }
            </AlertTitle>
            <AlertDescription>
              {validationResult.message}
              {validationResult.isValid && (
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">
                    Confidence score: {Math.round(validationResult.confidence * 100)}%
                  </div>
                  {validationResult.detectedFields.length > 0 && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Detected information:</span>{" "}
                      {validationResult.detectedFields.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalDocumentValidator;
