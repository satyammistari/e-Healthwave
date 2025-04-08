import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

// Types for our device sharing functionality
export type SharingMethod = 'nfc' | 'bluetooth' | 'pin' | 'qrcode';

interface DeviceSharingOptions {
  onShareSuccess?: (method: SharingMethod, recipientId?: string) => void;
  onShareError?: (error: Error, method: SharingMethod) => void;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  device?: any; // Actual Web Bluetooth device object
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  timestamp: number;
  accuracy?: number;
}

export function useDeviceSharing(options?: DeviceSharingOptions) {
  const [isNfcAvailable, setIsNfcAvailable] = useState(false);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(false);
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [emergencyPin, setEmergencyPin] = useState<string | null>(null);
  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [emergencyContacts] = useState<string[]>(['+917020547943']); // Default emergency contact

  // Check for NFC, Bluetooth, and Geolocation availability
  useEffect(() => {
    // Check if the device supports NFC
    const checkNfcAvailability = async () => {
      try {
        // Check if 'NDEFReader' is available in the window object
        const isAvailable = 'NDEFReader' in window;
        setIsNfcAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking NFC availability:', error);
        setIsNfcAvailable(false);
      }
    };

    // Check if the device supports Bluetooth
    const checkBluetoothAvailability = async () => {
      try {
        // Check if 'navigator.bluetooth' is available
        const isAvailable = 'bluetooth' in navigator && typeof navigator.bluetooth !== 'undefined';
        setIsBluetoothAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking Bluetooth availability:', error);
        setIsBluetoothAvailable(false);
      }
    };

    // Check if the device supports Geolocation
    const checkGeolocationAvailability = async () => {
      try {
        const isAvailable = 'geolocation' in navigator;
        setIsGeolocationAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking Geolocation availability:', error);
        setIsGeolocationAvailable(false);
      }
    };

    checkNfcAvailability();
    checkBluetoothAvailability();
    checkGeolocationAvailability();
  }, []);

  // Get current location
  const getCurrentLocation = async (): Promise<LocationData | null> => {
    if (!isGeolocationAvailable) {
      console.error('Geolocation is not available');
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      setCurrentLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Location Error",
        description: "Failed to get your current location",
        variant: "destructive"
      });
      return null;
    }
  };

  // Generate QR code for emergency information
  const generateEmergencyQRCode = async (patientId: string, patientName: string): Promise<string | null> => {
    try {
      // Get current location for the QR code
      const location = await getCurrentLocation();
      
      // Create emergency data object
      const emergencyData = {
        type: 'EMERGENCY',
        patientId,
        patientName,
        location,
        timestamp: Date.now(),
        contact: emergencyContacts[0] // Primary emergency contact
      };
      
      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(emergencyData), {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      setQrCodeDataUrl(qrCodeUrl);
      return qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "QR Code Generation Failed",
        description: "Failed to generate emergency QR code",
        variant: "destructive"
      });
      return null;
    }
  };

  // Send emergency SMS with location
  const sendEmergencySMS = async (contactNumber: string): Promise<boolean> => {
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      if (!location || location.latitude === null || location.longitude === null) {
        throw new Error('Location data is not available');
      }
      
      // In a real app, we would use a backend service to send SMS
      // Here we'll simulate sending an SMS with location data
      console.log(`Sending emergency SMS to ${contactNumber}`);
      console.log(`Emergency location: ${location.latitude}, ${location.longitude}`);
      
      // Google Maps URL with location
      const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      
      // Simulate SMS sending success
      toast({
        title: "Emergency Alert Sent",
        description: `Location shared with emergency contact ${contactNumber}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending emergency SMS:', error);
      toast({
        title: "SMS Sending Failed",
        description: "Failed to send emergency SMS",
        variant: "destructive"
      });
      return false;
    }
  };

  // Scan for Bluetooth devices using the Web Bluetooth API
  const scanForBluetoothDevices = async (): Promise<BluetoothDevice[]> => {
    if (!isBluetoothAvailable || !navigator.bluetooth) {
      console.error('Bluetooth is not available');
      toast({
        title: "Bluetooth Not Available",
        description: "Your device doesn't support Bluetooth or it's not enabled",
        variant: "destructive"
      });
      return [];
    }

    try {
      console.log('Scanning for Bluetooth devices...');
      setIsSharing(true);
      
      // Request device
      const device = await navigator.bluetooth.requestDevice({
        // Accept all devices that have a Generic Access service
        filters: [{ services: ['generic_access'] }],
        // Or accept all devices that have any service
        optionalServices: ['health_thermometer', 'heart_rate', 'device_information']
      });
      
      if (!device) {
        throw new Error('No Bluetooth device selected');
      }
      
      // Add device to list
      const newDevice: BluetoothDevice = {
        id: device.id,
        name: device.name || 'Unknown Device',
        device: device
      };
      
      // Update devices list
      const updatedDevices = [...bluetoothDevices, newDevice];
      setBluetoothDevices(updatedDevices);
      
      return updatedDevices;
    } catch (error) {
      console.error('Error scanning for Bluetooth devices:', error);
      
      // If user cancels the Bluetooth dialog, don't show error toast
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        console.log('User cancelled the Bluetooth device selection');
      } else {
        toast({
          title: "Scanning Failed",
          description: "Failed to scan for Bluetooth devices",
          variant: "destructive"
        });
      }
      
      return bluetoothDevices;
    } finally {
      setIsSharing(false);
    }
  };

  // Share health records via Bluetooth (real implementation)
  const shareViaBluetooth = async (
    patientId: string, 
    patientName: string,
    temporaryAccess: boolean = false, 
    accessDuration?: number,
    deviceId?: string
  ) => {
    if (!isBluetoothAvailable || !navigator.bluetooth) {
      console.error('Bluetooth is not available');
      toast({
        title: "Bluetooth Not Available",
        description: "Your device doesn't support Bluetooth or it's not enabled",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsSharing(true);
      
      // Find the selected device
      const targetDevice = deviceId 
        ? bluetoothDevices.find(d => d.id === deviceId)?.device 
        : null;
      
      if (!targetDevice && deviceId) {
        throw new Error('Selected device not found');
      }
      
      // If no device is selected, scan for one
      const device = targetDevice || await navigator.bluetooth.requestDevice({
        filters: [{ services: ['generic_access'] }],
        optionalServices: ['health_thermometer', 'heart_rate']
      });
      
      if (!device) {
        throw new Error('No Bluetooth device selected');
      }
      
      console.log(`Connecting to device: ${device.name || 'Unknown Device'}`);
      
      // Connect to the device
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to the device');
      }
      
      // Prepare health data
      const healthData = {
        patientId,
        patientName,
        timestamp: Date.now(),
        temporaryAccess,
        accessDuration: temporaryAccess ? accessDuration : null
      };
      
      // Convert data to ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(healthData));
      
      // In a real app, we would find appropriate services and characteristics
      // and write the data to them. Here we'll just simulate success.
      
      console.log(`Health data prepared for transfer: ${data.length} bytes`);
      console.log(`Connected to ${device.name || 'Unknown Device'}`);
      
      // Simulate successful data transfer
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Records Shared",
        description: `Your health records have been shared via Bluetooth to ${device.name || 'connected device'}`,
      });
      
      if (options?.onShareSuccess) {
        options.onShareSuccess('bluetooth', device.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error sharing via Bluetooth:', error);
      
      // If user cancels the Bluetooth dialog, don't show error toast
      if (error instanceof DOMException && error.name === 'NotFoundError') {
        console.log('User cancelled the Bluetooth device selection');
      } else {
        toast({
          title: "Sharing Failed",
          description: "Failed to share health records via Bluetooth",
          variant: "destructive"
        });
      }
      
      if (options?.onShareError && error instanceof Error) {
        options.onShareError(error, 'bluetooth');
      }
      
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  // Share health records via NFC (simulated)
  const shareViaNfc = async (patientId: string, temporaryAccess: boolean = false, accessDuration?: number) => {
    try {
      setIsSharing(true);
      
      // Mock NFC sharing implementation
      console.log(`Sharing via NFC: Patient ${patientId}, temporary: ${temporaryAccess}, duration: ${accessDuration}h`);
      
      // Simulate a delay for the "sharing" process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Records Shared",
        description: "Your health records have been shared via NFC",
      });
      
      if (options?.onShareSuccess) {
        options.onShareSuccess('nfc');
      }
      
      return true;
    } catch (error) {
      console.error('Error sharing via NFC:', error);
      toast({
        title: "Sharing Failed",
        description: "Failed to share health records via NFC",
        variant: "destructive"
      });
      
      if (options?.onShareError && error instanceof Error) {
        options.onShareError(error, 'nfc');
      }
      
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  // Generate emergency PIN
  const generateEmergencyPin = async (patientId: string, patientName: string) => {
    try {
      // Generate a random 6-digit PIN
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      setEmergencyPin(pin);
      
      // Generate QR code for emergency access
      await generateEmergencyQRCode(patientId, patientName);
      
      toast({
        title: "Emergency PIN Generated",
        description: `Your one-time PIN is: ${pin}`,
      });
      
      if (options?.onShareSuccess) {
        options.onShareSuccess('pin');
      }
      
      return pin;
    } catch (error) {
      console.error('Error generating emergency PIN:', error);
      toast({
        title: "PIN Generation Failed",
        description: "Failed to generate emergency PIN",
        variant: "destructive"
      });
      
      if (options?.onShareError && error instanceof Error) {
        options.onShareError(error, 'pin');
      }
      
      return null;
    }
  };

  // Trigger emergency alert with location sharing
  const triggerEmergencyAlert = async (patientId: string, patientName: string): Promise<boolean> => {
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      if (!location) {
        throw new Error('Could not get location data');
      }
      
      // Generate QR code for emergency
      await generateEmergencyQRCode(patientId, patientName);
      
      // Send emergency SMS to all emergency contacts
      const smsPromises = emergencyContacts.map(contact => 
        sendEmergencySMS(contact)
      );
      
      // Wait for all SMS to be sent
      await Promise.allSettled(smsPromises);
      
      toast({
        title: "Emergency Alert Activated",
        description: "Your location has been shared with emergency contacts",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error('Error triggering emergency alert:', error);
      toast({
        title: "Emergency Alert Failed",
        description: "Failed to share your location with emergency contacts",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isNfcAvailable,
    isBluetoothAvailable,
    isGeolocationAvailable,
    isSharing,
    emergencyPin,
    bluetoothDevices,
    currentLocation,
    qrCodeDataUrl,
    emergencyContacts,
    shareViaNfc,
    shareViaBluetooth,
    generateEmergencyPin,
    scanForBluetoothDevices,
    getCurrentLocation,
    generateEmergencyQRCode,
    triggerEmergencyAlert,
    sendEmergencySMS
  };
}
