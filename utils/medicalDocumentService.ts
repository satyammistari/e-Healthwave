
import { addRecordToBlockchain, verifyBlockchain } from './blockchain';

interface DocumentMetadata {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedOn: Date;
  status: 'pending' | 'verified' | 'rejected';
  blockchainHash?: string;
  sharedWith: string[];
  tags: string[];
}

// Mock storage for documents (in a real app, this would be a database)
const documents: DocumentMetadata[] = [];

/**
 * Upload a medical document and register it in the blockchain
 */
export const uploadMedicalDocument = async (
  file: File,
  patientId: string,
  doctorId: string,
  tags: string[] = []
): Promise<DocumentMetadata> => {
  try {
    // Generate a unique ID
    const documentId = `doc_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Add document to blockchain
    const blockchainRecord = addRecordToBlockchain({
      type: 'MEDICAL_DOCUMENT',
      documentId,
      patientId,
      doctorId,
      timestamp: Date.now(),
      metadata: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        tags
      }
    });
    
    // Create document metadata
    const documentMetadata: DocumentMetadata = {
      id: documentId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: doctorId,
      uploadedOn: new Date(),
      status: 'verified',
      blockchainHash: blockchainRecord.hash,
      sharedWith: [patientId, doctorId],
      tags
    };
    
    // In a real app, we would store the file in a secure storage
    // and save the metadata in a database
    
    // For this demo, we'll just store the metadata in our mock storage
    documents.push(documentMetadata);
    
    return documentMetadata;
  } catch (error) {
    console.error('Error uploading medical document:', error);
    throw new Error('Failed to upload medical document');
  }
};

/**
 * Share a medical document with another doctor
 */
export const shareMedicalDocument = async (
  documentId: string,
  sharedWithId: string
): Promise<boolean> => {
  try {
    // Find the document
    const documentIndex = documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
      throw new Error('Document not found');
    }
    
    // Check if already shared
    if (documents[documentIndex].sharedWith.includes(sharedWithId)) {
      return true;
    }
    
    // Add to blockchain
    const blockchainRecord = addRecordToBlockchain({
      type: 'DOCUMENT_SHARING',
      documentId,
      sharedWithId,
      timestamp: Date.now()
    });
    
    // Update shared list
    documents[documentIndex].sharedWith.push(sharedWithId);
    
    return !!blockchainRecord.hash;
  } catch (error) {
    console.error('Error sharing medical document:', error);
    return false;
  }
};

/**
 * Get all documents for a patient or doctor
 */
export const getMedicalDocuments = (userId: string): DocumentMetadata[] => {
  return documents.filter(doc => doc.sharedWith.includes(userId))
    .sort((a, b) => b.uploadedOn.getTime() - a.uploadedOn.getTime());
};

/**
 * Verify document integrity using blockchain
 */
export const verifyDocumentIntegrity = (documentId: string): boolean => {
  try {
    // In a real app, we would check the specific document's hash
    // For this demo, we'll verify the entire blockchain
    return verifyBlockchain();
  } catch (error) {
    console.error('Error verifying document integrity:', error);
    return false;
  }
};
