import { create } from 'zustand';
import type { Device } from '@/types/device';

// 아직 BLE 연결을 실제로 구현하기 전이라, 화면을 확인할 수 있도록 넣어둔 목업 데이터.
// 실제 BLE 스캔/연결 기능을 붙일 때 이 초기값을 지우고 빈 배열로 바꾸면 된다.
const MOCK_DEVICES: Device[] = [
  {
    id: 'mock-1',
    bleAddress: 'D6:AE:5B:D6:EF:42',
    nickname: 'Deepth A2',
    sku: 'A2',
    firmwareVersion: 'v1.2.0',
    latestFirmwareVersion: null,
    connectionStatus: 'connected',
    batteryLevel: 82,
    isCharging: false,
    lastUsedAt: new Date().toISOString(),
    powerOn: true,
    currentModeId: 1,
    remainingTimeMinutes: 12,
    temperature: 43,
    airPressureLevel: 2,
    vibrationLevel: 0,
  },
  {
    id: 'mock-2',
    bleAddress: 'D6:AE:5B:D6:EF:99',
    nickname: 'Deepth A2 (거실)',
    sku: 'A2',
    firmwareVersion: 'v1.0.3',
    latestFirmwareVersion: 'v1.2.0',
    connectionStatus: 'disconnected',
    batteryLevel: 50,
    isCharging: false,
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    powerOn: false,
    currentModeId: null,
    remainingTimeMinutes: null,
    temperature: null,
    airPressureLevel: null,
    vibrationLevel: null,
  },
];

type DeviceStore = {
  devices: Device[];
  selectedDeviceId: string | null;
  selectDevice: (id: string) => void;
};

export const useDeviceStore = create<DeviceStore>((set) => ({
  devices: MOCK_DEVICES,
  selectedDeviceId: MOCK_DEVICES[0]?.id ?? null,
  selectDevice: (id) => set({ selectedDeviceId: id }),
}));
