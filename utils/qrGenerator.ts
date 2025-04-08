import QRCode from 'qrcode';

export interface QRCodeData {
  patientId: string;
  timestamp: number;
  emergency: boolean;
  accessLevel?: 'full' | 'limited';
  expiresAt?: number;
}

export async function createQRCode(data: QRCodeData): Promise<string> {
  try {
    // Add expiration time if not provided (default 24 hours for emergency access)
    if (!data.expiresAt) {
      data.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    }

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(JSON.stringify(data), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    return qrCode;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function validateQRCode(qrData: QRCodeData): boolean {
  // Check if QR code is expired
  if (qrData.expiresAt && qrData.expiresAt < Date.now()) {
    return false;
  }

  // Validate required fields
  if (!qrData.patientId || !qrData.timestamp) {
    return false;
  }

  // Additional validation for emergency access
  if (qrData.emergency) {
    // Emergency QR codes must have an expiration time
    if (!qrData.expiresAt) {
      return false;
    }
  }

  return true;
} 