
// This is a mock implementation of blockchain functionality for demonstration purposes

interface BlockchainRecord {
  id: string;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
}

interface UserCredential {
  aadharNumber: string;
  hashedPassword: string;
  userId: string;
}

// Mock function to hash data (in a real implementation, this would use a proper cryptographic hash function)
const hashData = (data: any): string => {
  const stringData = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < stringData.length; i++) {
    const char = stringData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16).padStart(8, '0');
};

// Mock in-memory storage for our "blockchain"
const blockchainLedger: BlockchainRecord[] = [];
const userCredentials: UserCredential[] = [];

// Add the genesis block
blockchainLedger.push({
  id: 'genesis',
  timestamp: Date.now(),
  data: { message: 'Genesis Block for eHealthWave' },
  previousHash: '0000000000000000',
  hash: hashData({ message: 'Genesis Block for eHealthWave', timestamp: Date.now(), previousHash: '0000000000000000' })
});

// Function to add a new record to our blockchain
export const addRecordToBlockchain = (data: any): BlockchainRecord => {
  const previousBlock = blockchainLedger[blockchainLedger.length - 1];
  const newBlock: BlockchainRecord = {
    id: `block_${blockchainLedger.length}`,
    timestamp: Date.now(),
    data,
    previousHash: previousBlock.hash,
    hash: '',
  };
  
  // Calculate hash including all previous data
  newBlock.hash = hashData({ 
    data, 
    timestamp: newBlock.timestamp, 
    previousHash: newBlock.previousHash 
  });
  
  blockchainLedger.push(newBlock);
  return newBlock;
};

// Function to register a user in the blockchain
export const registerUserOnBlockchain = (aadharNumber: string, password: string): string => {
  // Check if user already exists
  const existingUser = userCredentials.find(u => u.aadharNumber === aadharNumber);
  if (existingUser) {
    throw new Error('User with this Aadhar number already exists');
  }
  
  // Create a new user ID
  const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
  
  // Hash the password
  const hashedPassword = hashData(password);
  
  // Create user credential
  const newUserCredential: UserCredential = {
    aadharNumber,
    hashedPassword,
    userId,
  };
  
  // Add to our "database"
  userCredentials.push(newUserCredential);
  
  // Add to blockchain as a record
  addRecordToBlockchain({
    type: 'USER_REGISTRATION',
    userId,
    aadharNumber,
    timestamp: Date.now(),
  });
  
  return userId;
};

// Function to authenticate a user
export const authenticateUser = (aadharNumber: string, password: string): boolean => {
  const user = userCredentials.find(u => u.aadharNumber === aadharNumber);
  if (!user) return false;
  
  const hashedPassword = hashData(password);
  return user.hashedPassword === hashedPassword;
};

// Function to add a medical record to the blockchain
export const addMedicalRecord = (userId: string, recordData: any): BlockchainRecord => {
  const record = {
    type: 'MEDICAL_RECORD',
    userId,
    data: recordData,
    timestamp: Date.now(),
  };
  
  return addRecordToBlockchain(record);
};

// Function to get all medical records for a user
export const getUserMedicalRecords = (userId: string): any[] => {
  return blockchainLedger
    .filter(block => 
      block.data.type === 'MEDICAL_RECORD' && 
      block.data.userId === userId
    )
    .map(block => ({
      id: block.id,
      timestamp: block.data.timestamp,
      data: block.data.data,
      hash: block.hash,
    }));
};

// Function to verify the integrity of the blockchain
export const verifyBlockchain = (): boolean => {
  for (let i = 1; i < blockchainLedger.length; i++) {
    const currentBlock = blockchainLedger[i];
    const previousBlock = blockchainLedger[i - 1];
    
    // Verify previous hash
    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }
    
    // Verify current hash
    const calculatedHash = hashData({
      data: currentBlock.data,
      timestamp: currentBlock.timestamp,
      previousHash: currentBlock.previousHash,
    });
    
    if (calculatedHash !== currentBlock.hash) {
      return false;
    }
  }
  
  return true;
};

// New functionality for NFC and Bluetooth sharing
interface SharingPermission {
  userId: string;
  recipientId: string;
  permissionType: 'nfc' | 'bluetooth' | 'emergency';
  timestamp: number;
  expirationTime: number | null;
  data: {
    recordIds?: string[];
    allRecords?: boolean;
    readOnly?: boolean;
  };
}

// Mock storage for sharing permissions
const sharingPermissions: SharingPermission[] = [];

// Function to add sharing permission to the blockchain
export const addSharingPermission = (
  userId: string,
  recipientId: string,
  permissionType: 'nfc' | 'bluetooth' | 'emergency',
  expirationTime: number | null = null,
  data: SharingPermission['data'] = { allRecords: true, readOnly: true }
): BlockchainRecord => {
  const permission: SharingPermission = {
    userId,
    recipientId,
    permissionType,
    timestamp: Date.now(),
    expirationTime,
    data
  };
  
  // Add to local storage
  sharingPermissions.push(permission);
  
  // Add to blockchain for auditing
  return addRecordToBlockchain({
    type: 'SHARING_PERMISSION',
    permission
  });
};

// Function to check if a recipient has access to a user's records
export const checkAccessPermission = (
  userId: string,
  recipientId: string
): boolean => {
  const now = Date.now();
  
  // Check if there's a valid permission
  const validPermission = sharingPermissions.find(
    p => p.userId === userId && 
         p.recipientId === recipientId && 
         (p.expirationTime === null || p.expirationTime > now)
  );
  
  return !!validPermission;
};

// Emergency override tracking
interface EmergencyOverride {
  patientId: string;
  providerId: string;
  pin: string;
  timestamp: number;
  expirationTime: number;
  used: boolean;
  accessReason: string;
}

// Mock storage for emergency overrides
const emergencyOverrides: EmergencyOverride[] = [];

// Function to create an emergency override
export const createEmergencyOverride = (
  patientId: string,
  pin: string,
  expirationTimeMinutes: number = 60
): BlockchainRecord => {
  const override: EmergencyOverride = {
    patientId,
    providerId: '', // Will be filled when used
    pin,
    timestamp: Date.now(),
    expirationTime: Date.now() + (expirationTimeMinutes * 60 * 1000),
    used: false,
    accessReason: ''
  };
  
  // Add to local storage
  emergencyOverrides.push(override);
  
  // Add to blockchain for auditing
  return addRecordToBlockchain({
    type: 'EMERGENCY_OVERRIDE_CREATED',
    patientId,
    timestamp: Date.now(),
    expirationTime: override.expirationTime
  });
};

// Function to use an emergency override
export const useEmergencyOverride = (
  patientId: string,
  pin: string,
  providerId: string,
  accessReason: string
): boolean => {
  const now = Date.now();
  
  // Find the override
  const overrideIndex = emergencyOverrides.findIndex(
    o => o.patientId === patientId && 
         o.pin === pin && 
         !o.used &&
         o.expirationTime > now
  );
  
  if (overrideIndex === -1) {
    return false;
  }
  
  // Update the override
  emergencyOverrides[overrideIndex].used = true;
  emergencyOverrides[overrideIndex].providerId = providerId;
  emergencyOverrides[overrideIndex].accessReason = accessReason;
  
  // Add to blockchain for auditing
  addRecordToBlockchain({
    type: 'EMERGENCY_OVERRIDE_USED',
    patientId,
    providerId,
    timestamp: now,
    accessReason
  });
  
  return true;
};

// AI consistency check record
interface ConsistencyCheckResult {
  recordId: string;
  checkType: 'duplicate_prescription' | 'medication_interaction' | 'data_inconsistency';
  timestamp: number;
  details: any;
  severity: 'info' | 'warning' | 'critical';
}

// Mock storage for consistency checks
const consistencyChecks: ConsistencyCheckResult[] = [];

// Function to add a consistency check result
export const addConsistencyCheckResult = (
  recordId: string,
  checkType: ConsistencyCheckResult['checkType'],
  details: any,
  severity: ConsistencyCheckResult['severity'] = 'warning'
): BlockchainRecord => {
  const check: ConsistencyCheckResult = {
    recordId,
    checkType,
    timestamp: Date.now(),
    details,
    severity
  };
  
  // Add to local storage
  consistencyChecks.push(check);
  
  // Add to blockchain for auditing
  return addRecordToBlockchain({
    type: 'CONSISTENCY_CHECK',
    check
  });
};

// Function to get consistency check results for a record
export const getConsistencyCheckResults = (recordId: string): ConsistencyCheckResult[] => {
  return consistencyChecks.filter(check => check.recordId === recordId);
};
