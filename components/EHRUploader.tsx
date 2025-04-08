
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { uploadEHRRecord } from "@/utils/ehrBlockchainService";
import { FileText, Upload, X, Check, Loader2 } from "lucide-react";

interface EHRUploaderProps {
  patientId: string;
  doctorId: string;
  hospitalId?: string;
  onSuccess?: (recordId: string) => void;
}

const EHRUploader: React.FC<EHRUploaderProps> = ({ 
  patientId, 
  doctorId, 
  hospitalId,
  onSuccess 
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recordType, setRecordType] = useState<
    'Prescription' | 'Lab Report' | 'Diagnosis' | 'Vaccination' | 'Surgery' | 'Other'
  >('Prescription');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the record",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Process files
      const attachments = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          size: file.size,
          uploadDate: new Date()
        }))
      );
      
      // Upload record
      const record = await uploadEHRRecord({
        patientId,
        doctorId,
        hospitalId,
        date: new Date(),
        type: recordType,
        title,
        description,
        attachments
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Success",
        description: "Medical record added to blockchain successfully",
        variant: "default"
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setRecordType('Prescription');
      setFiles([]);
      
      if (onSuccess) {
        onSuccess(record.id);
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload medical record",
        variant: "destructive"
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Medical Record</CardTitle>
        <CardDescription>Add a new medical record to the blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Record Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="E.g., Annual Checkup, Blood Test"
              disabled={isUploading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="record-type">Record Type</Label>
            <Select 
              value={recordType} 
              onValueChange={(value) => setRecordType(value as any)}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Lab Report">Lab Report</SelectItem>
                <SelectItem value="Diagnosis">Diagnosis</SelectItem>
                <SelectItem value="Vaccination">Vaccination</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add details about the medical record"
              disabled={isUploading}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="files">Attachments</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="files" 
                type="file" 
                onChange={handleFileChange} 
                multiple 
                className="hidden"
                disabled={isUploading}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('files')?.click()}
                disabled={isUploading}
              >
                <FileText className="w-4 h-4 mr-2" />
                Select Files
              </Button>
            </div>
            
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isUploading || !title.trim()}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading to Blockchain...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Record
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EHRUploader;
