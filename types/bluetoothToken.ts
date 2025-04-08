export interface BluetoothToken {
  tokenId: string;
  patientId: string;
  createdAt: Date;
  expiresAt: Date;
  accessLevel: 'read' | 'write';
  scope: 'limited' | 'full';
  isActive: boolean;
  usedBy?: string;
  usedAt?: Date;
  status?: 'active' | 'used' | 'expired';
} 