import type { DeviceProfile } from '@/types/device';

// 기기 종류(SKU)별로 어떤 기능을 지원하는지 정의한 카탈로그.
// docs/ble_ota_guide.md 4번의 프로토콜 표(20240125_Protocol.xlsx 기준)를 그대로 옮긴 것이라
// 값을 임의로 바꾸지 않는다. A3는 사업계획서에 상세 기능이 정의돼 있지 않아 아직 추가하지 않았다.
export const DEVICE_PROFILES: Record<string, DeviceProfile> = {
  A2: {
    sku: 'A2',
    category: '눈마사지기',
    image: require('../../../assets/deepth_device.png'),
    modes: [
      { id: 1, name: '순환 테라피', description: '지압 마사지와 온열 마사지가 진행됩니다.' },
      { id: 2, name: '집중력 테라피', description: '지압 마사지만 단독으로 진행됩니다.' },
      { id: 3, name: '수면 테라피', description: '온열 마사지만 단독으로 진행됩니다.' },
      { id: 4, name: '파워 테라피', description: '지압과 온열, 진동 마사지가 번갈아 진행됩니다.' },
      { id: 0, name: '나만의 테라피', description: '맞춤형 마사지 모드를 선택할 수 있습니다.' },
    ],
    supportsHeat: true,
    temperatureRange: { min: 38, max: 49 },
    supportsAirPressure: true,
    // 원본 프로토콜 문서의 범위(0-3)와 설명(0/1/2/3 4단계)이 서로 안 맞아서,
    // 설명에 나온 4단계를 그대로 옮겼다. 하드웨어팀 확인 필요 (docs/ble_ota_guide.md 참고).
    airPressureLevels: ['OFF', '약', '중', '강'],
    supportsVibration: true,
    // 마찬가지로 원본 범위(0-2)와 설명(0/1/2/3 4단계)이 안 맞는 부분. 하드웨어팀 확인 필요.
    vibrationLevels: ['OFF', '약', '중', '강'],
    runTimeRange: { min: 5, max: 45 },
    supportsVoiceGuide: true,
  },
};
