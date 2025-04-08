import { addRecordToBlockchain, getUserMedicalRecords } from './blockchain';

interface HospitalRecord {
  id: string;
  type: string;
  timestamp: number;
  data: any;
  hospitalId: string;
  patientId: string;
}

interface HospitalShare {
  id: string;
  patientId: string;
  sourceHospitalId: string;
  targetHospitalId: string;
  records: HospitalRecord[];
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
}

// Mock in-memory storage for hospital shares
const hospitalShares: HospitalShare[] = [];

export class HospitalSharingService {
  // Share patient records with another hospital
  static async shareRecords(
    patientId: string,
    sourceHospitalId: string,
    targetHospitalId: string,
    recordTypes: string[] = []
  ): Promise<boolean> {
    try {
      // Get patient records
      const allRecords = await getUserMedicalRecords(patientId);
      
      // Filter records by type if specified
      const recordsToShare = recordTypes.length > 0
        ? allRecords.filter(record => recordTypes.includes(record.type))
        : allRecords;
      
      // Add hospital ID to each record
      const hospitalRecords: HospitalRecord[] = recordsToShare.map(record => ({
        ...record,
        hospitalId: sourceHospitalId
      }));
      
      // Create share record
      const share: HospitalShare = {
        id: Math.random().toString(36).substring(2, 15),
        patientId,
        sourceHospitalId,
        targetHospitalId,
        records: hospitalRecords,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      // Store share
      hospitalShares.push(share);
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: 'HOSPITAL_SHARE_CREATED',
        shareId: share.id,
        patientId,
        sourceHospitalId,
        targetHospitalId,
        timestamp: share.timestamp,
        recordCount: hospitalRecords.length
      });
      
      return true;
    } catch (error) {
      console.error('Error sharing records:', error);
      return false;
    }
  }
  
  // Accept shared records from another hospital
  static async acceptShare(
    shareId: string,
    targetHospitalId: string
  ): Promise<boolean> {
    try {
      const shareIndex = hospitalShares.findIndex(
        share => share.id === shareId && 
                 share.targetHospitalId === targetHospitalId &&
                 share.status === 'pending'
      );
      
      if (shareIndex === -1) {
        return false;
      }
      
      // Update share status
      hospitalShares[shareIndex].status = 'accepted';
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: 'HOSPITAL_SHARE_ACCEPTED',
        shareId,
        patientId: hospitalShares[shareIndex].patientId,
        sourceHospitalId: hospitalShares[shareIndex].sourceHospitalId,
        targetHospitalId,
        timestamp: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error accepting share:', error);
      return false;
    }
  }
  
  // Reject shared records from another hospital
  static async rejectShare(
    shareId: string,
    targetHospitalId: string
  ): Promise<boolean> {
    try {
      const shareIndex = hospitalShares.findIndex(
        share => share.id === shareId && 
                 share.targetHospitalId === targetHospitalId &&
                 share.status === 'pending'
      );
      
      if (shareIndex === -1) {
        return false;
      }
      
      // Update share status
      hospitalShares[shareIndex].status = 'rejected';
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: 'HOSPITAL_SHARE_REJECTED',
        shareId,
        patientId: hospitalShares[shareIndex].patientId,
        sourceHospitalId: hospitalShares[shareIndex].sourceHospitalId,
        targetHospitalId,
        timestamp: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error rejecting share:', error);
      return false;
    }
  }
  
  // Get pending shares for a hospital
  static getPendingShares(hospitalId: string): HospitalShare[] {
    return hospitalShares.filter(
      share => share.targetHospitalId === hospitalId && share.status === 'pending'
    );
  }
  
  // Get accepted shares for a hospital
  static getAcceptedShares(hospitalId: string): HospitalShare[] {
    return hospitalShares.filter(
      share => share.targetHospitalId === hospitalId && share.status === 'accepted'
    );
  }
  
  // Get all shares for a patient
  static getPatientShares(patientId: string): HospitalShare[] {
    return hospitalShares.filter(share => share.patientId === patientId);
  }
} 