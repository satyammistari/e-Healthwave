
interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: {
    connect(): Promise<BluetoothRemoteGATTServer>;
  };
}

interface BluetoothRemoteGATTServer {
  // Define necessary GATT server properties
  connect(): Promise<BluetoothRemoteGATTServer>;
  // Add other methods as needed
}

interface BluetoothRequestDeviceOptions {
  filters?: Array<{
    services?: string[];
    name?: string;
    namePrefix?: string;
    manufacturerId?: number;
    serviceData?: Map<string, DataView>;
  }>;
  optionalServices?: string[];
  acceptAllDevices?: boolean;
}

interface Bluetooth {
  requestDevice(options: BluetoothRequestDeviceOptions): Promise<BluetoothDevice>;
  getAvailability(): Promise<boolean>;
  // Add other Bluetooth methods as needed
}

// Extend the Navigator interface
interface Navigator {
  bluetooth: Bluetooth;
}
