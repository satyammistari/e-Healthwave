import { addRecordToBlockchain } from './blockchain';
import { BluetoothToken } from "@/types/bluetoothToken";

// Storage key for tokens
const STORAGE_KEY = 'bluetooth_tokens';

export class BluetoothTokenService {
  private static readonly TOKEN_LENGTH = 12;
  private static readonly TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // Get all tokens from storage
  private static getTokenStore(): Map<string, BluetoothToken> {
    const storedTokens = localStorage.getItem(STORAGE_KEY);
    if (storedTokens) {
      const parsedTokens = JSON.parse(storedTokens);
      const tokenMap = new Map<string, BluetoothToken>();
      Object.entries(parsedTokens).forEach(([key, value]) => {
        tokenMap.set(key, {
          ...value as BluetoothToken,
          createdAt: new Date((value as BluetoothToken).createdAt),
          expiresAt: new Date((value as BluetoothToken).expiresAt),
          usedAt: (value as BluetoothToken).usedAt ? new Date((value as BluetoothToken).usedAt!) : undefined
        });
      });
      return tokenMap;
    }
    return new Map();
  }

  // Save tokens to storage
  private static saveTokenStore(tokenStore: Map<string, BluetoothToken>) {
    const tokensObj = Object.fromEntries(tokenStore);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokensObj));
  }

  // Generate a new token for sharing
  static generateToken(
    patientId: string,
    validityMinutes: number,
    accessLevel: 'read' | 'write',
    scope: 'limited' | 'full'
  ): BluetoothToken {
    const tokenId = this.generateTokenId();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60000);

    const token: BluetoothToken = {
      tokenId,
      patientId,
      createdAt,
      expiresAt,
      accessLevel,
      scope,
      isActive: true
    };
    
    // Store the token
    const tokenStore = this.getTokenStore();
    tokenStore.set(tokenId, token);
    this.saveTokenStore(tokenStore);
    
    // Add to blockchain for auditing
    addRecordToBlockchain({
      type: 'BLUETOOTH_TOKEN_GENERATED',
      tokenId,
      patientId,
      timestamp: createdAt.getTime(),
      expiresAt,
      accessLevel,
      dataScope: scope
    });
    
    return token;
  }

  // Validate token and grant access
  static validateToken(tokenId: string, patientId: string): boolean {
    const tokenStore = this.getTokenStore();
    const token = tokenStore.get(tokenId);
    if (!token) return false;

    const now = new Date();
    return (
      token.patientId === patientId &&
      token.isActive &&
      token.expiresAt > now
    );
  }

  // Get active tokens for a patient
  static getActiveTokens(patientId: string): BluetoothToken[] {
    const tokenStore = this.getTokenStore();
    return Array.from(tokenStore.values()).filter(
      token => token.patientId === patientId && token.isActive
    );
  }

  // Get token status
  static getTokenStatus(tokenId: string): { status: string; expiresAt?: number } {
    const token = this.getToken(tokenId);
    if (!token) {
      return { status: 'not_found' };
    }
    
    const now = new Date();
    if (token.expiresAt <= now) {
      return { status: 'expired' };
    }
    
    if (!token.isActive) {
      return { status: 'inactive' };
    }
    
    return { 
      status: 'active',
      expiresAt: token.expiresAt.getTime()
    };
  }

  // Revoke a token
  static revokeToken(tokenId: string): boolean {
    const tokenStore = this.getTokenStore();
    const token = tokenStore.get(tokenId);
    if (token) {
      token.isActive = false;
      tokenStore.set(tokenId, token);
      this.saveTokenStore(tokenStore);
      return true;
    }
    return false;
  }

  // Revoke all active tokens for a patient
  static revokeAllTokens(patientId: string): number {
    const now = new Date();
    const tokenStore = this.getTokenStore();
    const activeTokens = Array.from(tokenStore.values()).filter(
      t => t.patientId === patientId && t.expiresAt > now
    );
    
    activeTokens.forEach(token => {
      token.isActive = false;
      tokenStore.set(token.tokenId, token);
    });
    
    this.saveTokenStore(tokenStore);
    return activeTokens.length;
  }
  
  // Format token for display
  static formatTokenForDisplay(token: BluetoothToken): string {
    // Format as 4 character groups for readability
    const formattedToken = token.tokenId.match(/.{1,4}/g)?.join('-') || token.tokenId;
    return formattedToken.toUpperCase();
  }

  static getToken(tokenId: string): BluetoothToken | null {
    const tokenStore = this.getTokenStore();
    return tokenStore.get(tokenId) || null;
  }

  private static generateTokenId(): string {
    let result = '';
    for (let i = 0; i < this.TOKEN_LENGTH; i++) {
      result += this.TOKEN_CHARS.charAt(
        Math.floor(Math.random() * this.TOKEN_CHARS.length)
      );
    }
    return result;
  }
}
