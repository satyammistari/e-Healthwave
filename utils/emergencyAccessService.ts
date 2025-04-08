import { toast } from '@/hooks/use-toast';
import { addRecordToBlockchain, getUserMedicalRecords } from '@/utils/blockchain';
import { verifyBlockchain } from '@/utils/blockchain';

interface EmergencyAccess {
  patientId: string;
  pin: string;
  accessGrantedTo: string; // Provider or paramedic ID
  expiryTime: number; // Unix timestamp
  used: boolean;
  notificationSent?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
  smsSent?: boolean;
  emergencyContacts?: string[];
}

// Mock in-memory storage for emergency PINs
const emergencyAccessStore: EmergencyAccess[] = [];

export const EmergencyAccessService = {
  // Generate a one-time PIN for emergency access
  generateEmergencyPin: async (
    patientId: string, 
    validityMinutes: number = 60,
    location?: { latitude: number; longitude: number }
  ): Promise<string> => {
    try {
      // Generate a random 6-digit PIN
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiry time
      const expiryTime = Date.now() + (validityMinutes * 60 * 1000);
      
      // Store the emergency access
      const access: EmergencyAccess = {
        patientId,
        pin,
        accessGrantedTo: '', // Will be filled when used
        expiryTime,
        used: false,
        notificationSent: false,
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: Date.now()
        } : undefined,
        smsSent: false
      };
      
      emergencyAccessStore.push(access);
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: 'EMERGENCY_PIN_GENERATED',
        patientId,
        timestamp: Date.now(),
        expiryTime,
        location: access.location
      });
      
      return pin;
    } catch (error) {
      console.error('Error generating emergency PIN:', error);
      throw new Error('Failed to generate emergency PIN');
    }
  },
  
  // Validate emergency PIN and grant access
  validateEmergencyPin: async (
    pin: string, 
    patientId: string, 
    providerId: string
  ): Promise<{ valid: boolean; records?: any[]; message?: string }> => {
    try {
      // Find the emergency access
      const accessIndex = emergencyAccessStore.findIndex(
        access => access.pin === pin && 
                 access.patientId === patientId && 
                 !access.used &&
                 access.expiryTime > Date.now()
      );
      
      if (accessIndex === -1) {
        return {
          valid: false,
          message: 'Invalid or expired emergency PIN'
        };
      }
      
      // Mark as used
      emergencyAccessStore[accessIndex].used = true;
      emergencyAccessStore[accessIndex].accessGrantedTo = providerId;
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: 'EMERGENCY_ACCESS_GRANTED',
        patientId,
        providerId,
        timestamp: Date.now()
      });
      
      // Get patient records
      const records = await getUserMedicalRecords(patientId);
      
      return {
        valid: true,
        records,
        message: 'Emergency access granted successfully'
      };
    } catch (error) {
      console.error('Error validating emergency PIN:', error);
      return {
        valid: false,
        message: 'An error occurred while validating the emergency PIN'
      };
    }
  },
  
  // Check if PIN is valid without using it
  checkPinValidity: (pin: string, patientId: string): boolean => {
    const access = emergencyAccessStore.find(
      access => access.pin === pin && 
               access.patientId === patientId && 
               !access.used &&
               access.expiryTime > Date.now()
    );
    
    return !!access;
  },
  
  // Get all active emergency access PINs for a patient
  getActiveEmergencyAccess: (patientId: string): Omit<EmergencyAccess, 'pin'>[] => {
    return emergencyAccessStore
      .filter(access => 
        access.patientId === patientId && 
        !access.used && 
        access.expiryTime > Date.now()
      )
      .map(({ pin, ...rest }) => rest); // Exclude the PIN for security
  },
  
  // Get pending emergency access requests for a provider
  getPendingEmergencyRequests: (providerId: string): any[] => {
    // In a real implementation, this would query the backend
    // Here we'll just return mock data
    return [
      {
        id: 'req_001',
        patientId: 'patient_123',
        patientName: 'Rajiv Kumar',
        timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
        reason: 'Cardiac emergency',
        status: 'pending'
      },
      {
        id: 'req_002',
        patientId: 'patient_456',
        patientName: 'Meera Patel',
        timestamp: Date.now() - 25 * 60 * 1000, // 25 minutes ago
        reason: 'Accident victim',
        status: 'pending'
      }
    ];
  },
  
  // Get emergency access activity for a provider
  getEmergencyAccessActivity: (providerId: string): any[] => {
    // Get accesses granted to this provider
    const providerAccessLog = emergencyAccessStore
      .filter(access => access.accessGrantedTo === providerId && access.used)
      .map(access => ({
        patientId: access.patientId,
        accessTime: new Date(access.expiryTime - (60 * 60 * 1000)), // Approximate time when access was used
        expiryTime: new Date(access.expiryTime)
      }));
    
    // In a real implementation, this would include data from the blockchain
    return providerAccessLog;
  },
  
  // Revoke an emergency PIN
  revokeEmergencyPin: async (patientId: string): Promise<boolean> => {
    try {
      const initialCount = emergencyAccessStore.length;
      
      // Filter out all active pins for this patient
      const newStore = emergencyAccessStore.filter(
        access => !(access.patientId === patientId && 
                   !access.used && 
                   access.expiryTime > Date.now())
      );
      
      // Update store
      emergencyAccessStore.length = 0;
      emergencyAccessStore.push(...newStore);
      
      const removedCount = initialCount - emergencyAccessStore.length;
      
      if (removedCount > 0) {
        // Add to blockchain for auditing
        await addRecordToBlockchain({
          type: 'EMERGENCY_PIN_REVOKED',
          patientId,
          timestamp: Date.now(),
          count: removedCount
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error revoking emergency PIN:', error);
      return false;
    }
  },

  // Send notification to healthcare providers about emergency access
  notifyEmergencyProviders: async (patientId: string, emergencyDetails: any): Promise<boolean> => {
    try {
      // In a real implementation, this would send push notifications, SMS, or emails
      // to designated emergency providers
      
      console.log(`Sending emergency notifications for patient ${patientId}`, emergencyDetails);
      
      // Find any unused emergency access PINs for this patient
      const accessIndex = emergencyAccessStore.findIndex(
        access => access.patientId === patientId && 
                 !access.used &&
                 !access.notificationSent &&
                 access.expiryTime > Date.now()
      );
      
      if (accessIndex !== -1) {
        // Mark notification as sent
        emergencyAccessStore[accessIndex].notificationSent = true;
        
        // Add to blockchain for auditing
        await addRecordToBlockchain({
          type: 'EMERGENCY_NOTIFICATION_SENT',
          patientId,
          timestamp: Date.now(),
          details: emergencyDetails
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error sending emergency notifications:', error);
      return false;
    }
  },
  
  // Respond to emergency access request
  respondToEmergencyRequest: async (
    requestId: string, 
    providerId: string, 
    action: 'accept' | 'reject',
    reason?: string
  ): Promise<boolean> => {
    try {
      // In a real implementation, this would update the emergency request status in the backend
      console.log(`Provider ${providerId} ${action}ed emergency request ${requestId}`);
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: action === 'accept' ? 'EMERGENCY_REQUEST_ACCEPTED' : 'EMERGENCY_REQUEST_REJECTED',
        requestId,
        providerId,
        timestamp: Date.now(),
        reason
      });
      
      return true;
    } catch (error) {
      console.error(`Error ${action}ing emergency request:`, error);
      return false;
    }
  },

  // Send SMS notifications to emergency contacts
  sendEmergencySMS: async (
    patientId: string,
    pin: string,
    emergencyContacts: string[]
  ): Promise<boolean> => {
    try {
      const accessIndex = emergencyAccessStore.findIndex(
        access => access.pin === pin && access.patientId === patientId
      );
      
      if (accessIndex === -1) {
        return false;
      }
      
      // Update emergency contacts
      emergencyAccessStore[accessIndex].emergencyContacts = emergencyContacts;
      
      // In a real implementation, this would send actual SMS
      console.log(`Sending emergency SMS to contacts:`, emergencyContacts);
      console.log(`Emergency PIN: ${pin}`);
      
      // Mark SMS as sent
      emergencyAccessStore[accessIndex].smsSent = true;
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: 'EMERGENCY_SMS_SENT',
        patientId,
        timestamp: Date.now(),
        contacts: emergencyContacts
      });
      
      return true;
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      return false;
    }
  },

  // Update location for emergency access
  updateEmergencyLocation: async (
    patientId: string,
    pin: string,
    location: { latitude: number; longitude: number }
  ): Promise<boolean> => {
    try {
      const accessIndex = emergencyAccessStore.findIndex(
        access => access.pin === pin && access.patientId === patientId
      );
      
      if (accessIndex === -1) {
        return false;
      }
      
      // Update location
      emergencyAccessStore[accessIndex].location = {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now()
      };
      
      // Add to blockchain for auditing
      await addRecordToBlockchain({
        type: 'EMERGENCY_LOCATION_UPDATED',
        patientId,
        timestamp: Date.now(),
        location: emergencyAccessStore[accessIndex].location
      });
      
      return true;
    } catch (error) {
      console.error('Error updating emergency location:', error);
      return false;
    }
  }
};
