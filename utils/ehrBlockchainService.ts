
import { addRecordToBlockchain, getUserMedicalRecords, verifyBlockchain } from './blockchain';

interface EHRRecord {
  id: string;
  patientId: string;
  doctorId: string;
  hospitalId?: string;
  date: Date;
  type: 'Prescription' | 'Lab Report' | 'Diagnosis' | 'Vaccination' | 'Surgery' | 'Other';
  title: string;
  description: string;
  attachments?: {
    name: string;
    type: string;
    url: string;
    size: number;
    uploadDate: Date;
  }[];
  verified: boolean;
  blockchainHash?: string;
}

export const uploadEHRRecord = async (
  record: Omit<EHRRecord, 'id' | 'verified' | 'blockchainHash'>
): Promise<EHRRecord> => {
  try {
    // Add record to blockchain
    const blockchainRecord = addRecordToBlockchain({
      type: 'MEDICAL_RECORD',
      patientId: record.patientId,
      doctorId: record.doctorId,
      recordType: record.type,
      data: {
        title: record.title,
        description: record.description,
        date: record.date,
        hospitalId: record.hospitalId,
        attachments: record.attachments,
      }
    });

    // Format and return the record with blockchain verification
    const ehrRecord: EHRRecord = {
      id: `ehr_${Date.now().toString(36)}`,
      patientId: record.patientId,
      doctorId: record.doctorId,
      hospitalId: record.hospitalId,
      date: record.date,
      type: record.type,
      title: record.title,
      description: record.description,
      attachments: record.attachments,
      verified: true,
      blockchainHash: blockchainRecord.hash
    };

    return ehrRecord;
  } catch (error) {
    console.error('Error uploading EHR record to blockchain:', error);
    throw new Error('Failed to upload health record');
  }
};

export const fetchPatientRecords = async (patientId: string): Promise<EHRRecord[]> => {
  try {
    // Get records from blockchain
    const blockchainRecords = getUserMedicalRecords(patientId);
    
    // Map blockchain records to EHR format
    const ehrRecords: EHRRecord[] = blockchainRecords.map(record => ({
      id: `ehr_${record.id}`,
      patientId,
      doctorId: record.data.doctorId || 'unknown',
      hospitalId: record.data.hospitalId,
      date: new Date(record.timestamp),
      type: record.data.recordType || 'Other',
      title: record.data.title || 'Untitled Record',
      description: record.data.description || '',
      attachments: record.data.attachments || [],
      verified: true,
      blockchainHash: record.hash
    }));

    return ehrRecords;
  } catch (error) {
    console.error('Error fetching patient records from blockchain:', error);
    return [];
  }
};

export const verifyEHRIntegrity = async (): Promise<boolean> => {
  try {
    return verifyBlockchain();
  } catch (error) {
    console.error('Error verifying blockchain integrity:', error);
    return false;
  }
};

export const shareRecordWithDoctor = async (
  recordId: string, 
  doctorId: string
): Promise<boolean> => {
  try {
    // In a real implementation, this would add permissions to the blockchain
    // For now, we'll simulate this operation
    const shareOperation = addRecordToBlockchain({
      type: 'RECORD_SHARING',
      recordId,
      doctorId,
      timestamp: Date.now()
    });
    
    return !!shareOperation.hash;
  } catch (error) {
    console.error('Error sharing record with doctor:', error);
    return false;
  }
};

export const attachFileToRecord = async (
  recordId: string,
  file: {
    name: string;
    type: string;
    url: string;
    size: number;
  }
): Promise<boolean> => {
  try {
    // In a real implementation, this would store file metadata on the blockchain
    // and the actual file would be stored in IPFS or similar decentralized storage
    const attachOperation = addRecordToBlockchain({
      type: 'FILE_ATTACHMENT',
      recordId,
      fileMetadata: {
        ...file,
        uploadDate: Date.now()
      }
    });
    
    return !!attachOperation.hash;
  } catch (error) {
    console.error('Error attaching file to record:', error);
    return false;
  }
};
