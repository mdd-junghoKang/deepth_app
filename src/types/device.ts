import type { ImageSourcePropType } from 'react-native';

// 기기가 지원하는 마사지 모드 하나를 나타내는 타입
export type TherapyMode = {
  id: number; // 프로토콜의 therapy_mode 값(0xDF61)과 동일한 번호
  name: string; // 화면에 보여줄 이름 (예: "순환 테라피")
  description: string;
};

// 기기 종류(SKU)마다 어떤 기능을 지원하는지 정의하는 정적 정보.
// 실제 등록된 기기가 아니라 "A2라는 제품은 이런 걸 할 수 있다"는 카탈로그 정보다.
export type DeviceProfile = {
  sku: string;
  category: string; // 화면에 표시할 제품 카테고리명 (예: "눈마사지기")
  image: ImageSourcePropType; // 배경이 투명한 제품 사진
  modes: TherapyMode[];
  supportsHeat: boolean;
  temperatureRange?: { min: number; max: number }; // supportsHeat가 true일 때만 사용
  supportsAirPressure: boolean;
  airPressureLevels?: string[]; // 단계 라벨, 예: ["OFF", "약", "중", "강"]
  supportsVibration: boolean;
  vibrationLevels?: string[];
  runTimeRange: { min: number; max: number }; // 분 단위
  supportsVoiceGuide: boolean;
};

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

// 사용자가 실제로 등록한 기기 한 대의 정보 (같은 sku라도 사용자마다 여러 대 가질 수 있음)
export type Device = {
  id: string; // 앱에서 등록할 때 만드는 내부 식별자
  bleAddress: string; // 실제 BLE 기기 주소
  nickname: string; // 사용자가 지정한 이름 (기본값은 제품명)
  sku: string; // DeviceProfile.sku와 매칭
  firmwareVersion: string;
  latestFirmwareVersion: string | null; // 있으면 업데이트가 필요하다는 뜻
  connectionStatus: ConnectionStatus;
  batteryLevel: number; // 0~100
  isCharging: boolean;
  lastUsedAt: string | null; // ISO 날짜 문자열
  lastUsedModeId: number | null; // 마지막으로 사용한 모드 (대시보드의 "최근 사용" 표시용)
  lastUsedDurationMinutes: number | null;

  // 아래는 기기가 켜져 있을 때만 의미 있는 현재 동작 상태
  powerOn: boolean;
  currentModeId: number | null;
  remainingTimeMinutes: number | null;
  temperature: number | null;
  airPressureLevel: number | null;
  vibrationLevel: number | null;
};
