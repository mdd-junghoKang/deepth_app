# 프로젝트 세팅 — 직접 결정하고 진행한 내용

**결론: 이 문서에는 "왜 이렇게 정했는지"까지 포함해서, 사람이 직접 고민하고 결정한 내용만 정리했습니다.** 도구가 자동으로 만들어준 파일 목록은 `AUTO_GENERATED.md`에 따로 있고, BLE 펌웨어 업데이트를 어떻게 구현할지는 `ble_ota_guide.md`에 따로 정리했습니다.

## 1. 왜 "Expo Go" 대신 "Dev Client"를 쓰는가

**결론: 이 앱은 Expo Go라는 일반적인 테스트 앱으로는 실행할 수 없어서, 우리 프로젝트 전용으로 만든 "Dev Client"라는 테스트 앱을 따로 빌드해서 씁니다.**

| 용어 | 쉬운 설명 |
|---|---|
| Expo Go | Expo(React Native 개발 도구)가 미리 만들어서 스토어에 올려둔 범용 테스트 앱. 누구나 설치해서 자기 코드를 QR코드로 불러와 바로 테스트할 수 있습니다. |
| 네이티브 모듈 | 앱이 블루투스, 카메라처럼 휴대폰의 하드웨어 기능을 쓸 수 있게 해주는 특수한 코드 조각. Expo Go에는 정해진 몇 가지 네이티브 모듈만 미리 들어있습니다. |
| Dev Client | Expo Go와 똑같이 동작하지만, 우리 프로젝트에 필요한 네이티브 모듈(블루투스, 펌웨어 전송 기능 등)까지 전부 포함해서 우리가 직접 빌드한 "나만의 Expo Go" |

이 앱은 블루투스 통신(`react-native-ble-plx`)과 펌웨어 전송(`@getquip/expo-nordic-dfu`) 기능을 쓰는데, 이 둘은 Expo Go 안에 기본으로 들어있지 않은 네이티브 모듈입니다. 그래서 Expo Go로는 아예 실행이 안 되고, Dev Client를 한 번 빌드해두면 그 다음부터는 Expo Go를 쓸 때처럼 QR코드로 코드를 불러와 바로바로 확인할 수 있습니다. **코드를 수정할 때마다 다시 빌드할 필요는 없고, 블루투스 관련 네이티브 기능 자체를 바꿀 때만 Dev Client를 다시 빌드하면 됩니다.**

## 2. 빌드는 EAS Build(클라우드)로 진행

**결론: 이 컴퓨터에는 안드로이드 앱을 직접 빌드하는 데 필요한 프로그램(Android Studio, JDK)이 설치돼 있지 않아서, 인터넷으로 연결된 Expo의 빌드 서버(EAS Build)에서 대신 빌드하도록 세팅했습니다.**

| 용어 | 쉬운 설명 |
|---|---|
| Android Studio / JDK | 안드로이드 앱을 컴퓨터에서 직접 빌드(코드를 실제 앱 파일로 만드는 과정)할 때 필요한 프로그램들 |
| EAS Build | Expo가 제공하는 클라우드 빌드 서비스. 내 컴퓨터에 아무것도 안 깔려 있어도, 인터넷으로 코드를 보내면 Expo 서버가 대신 빌드해서 앱 파일(APK)을 만들어줍니다 |

세팅해 둔 것:

- `eas-cli`(EAS를 명령어로 다루는 도구)를 개발용 패키지로 추가
- `eas.json` 파일에 `development`(개발용 빌드 설정)를 만들어둠. 안드로이드는 바로 설치 가능한 `apk` 형태로 나오게 설정

**아직 사람이 직접 해야 하는 것 (Expo 계정 로그인이 필요해서 AI가 대신 못 함):**

| 순서 | 명령어 | 하는 일 |
|---|---|---|
| 1 | `npx eas login` | Expo 계정으로 로그인 (브라우저 인증 필요) |
| 2 | `npx eas init` | 이 프로젝트를 내 Expo 계정에 연결 |
| 3 | `npx eas build --profile development --platform android` | 클라우드에서 Dev Client용 안드로이드 앱 파일을 빌드 |

빌드가 끝나면 링크로 앱 파일(APK)을 내려받아 안드로이드 기기에 설치한 뒤, `npx expo start --dev-client`를 실행하고 QR코드를 스캔하면 개발을 시작할 수 있습니다.

## 3. BLE·펌웨어 전송 라이브러리 선택

**결론: 기기 조작은 `react-native-ble-plx`, 펌웨어 업데이트 전송은 `@getquip/expo-nordic-dfu`를 씁니다.**

기기의 반도체 칩이 Nordic(대표님 확인)이라, `ble_ota_guide.md`에서 "쉬운 경로"(Nordic이 이미 만들어 둔 표준 업데이트 절차 사용)를 탈 수 있었습니다. 다만 그 표준 절차를 감싸주는 라이브러리는 두 가지 선택지가 있었고, 아래처럼 비교해서 골랐습니다.

| 비교 항목 | `react-native-nordic-dfu` (처음에 후보였던 것) | `@getquip/expo-nordic-dfu` (실제로 선택) |
|---|---|---|
| 마지막 업데이트 | 2021년 (약 4년 전, 사실상 관리 중단) | 2026년 (최근까지 계속 관리 중) |
| 안드로이드 빌드 안정성 | 오래된 빌드 도구와, 이미 서비스가 종료된 저장소(jcenter)에 의존 → 최신 환경에서 빌드가 안 될 위험이 큼 | 최신 안드로이드 빌드 도구 기준으로 만들어짐 |
| 설치 난이도 | 추가 설정이 여러 개 필요 | Expo가 정한 표준 방식이라 별도 설정 없이 설치만 하면 됨 |

**알아둬야 할 리스크**: `@getquip/expo-nordic-dfu`가 공식적으로 지원한다고 밝힌 Expo 버전은 54인데, 우리 프로젝트는 57번 버전을 쓰고 있습니다. 그래서 설치할 때 "버전이 안 맞을 수도 있다"는 경고가 떴고, 이 라이브러리는 순수하게 기능만 감싼 것이라 버전 차이의 영향이 적을 거라 보고 경고를 무시하는 옵션(`--legacy-peer-deps`)으로 설치했습니다. 앞으로 이 옵션 없이도 설치가 되도록 `.npmrc` 파일에 관련 설정을 기본값으로 넣어뒀습니다. **다만 100% 검증된 조합은 아니므로, 실제 기기로 펌웨어 업데이트가 잘 되는지 꼭 테스트해야 합니다.**

또한 이 라이브러리는 아래 버전 이상의 운영체제에서만 동작합니다.

| 운영체제 | 최소 버전 |
|---|---|
| 안드로이드 | 14 이상 |
| iOS | 17 이상 |

테스트용 기기가 이 버전 이상인지 미리 확인이 필요합니다.

## 4. app.json에 추가한 설정

**결론: 블루투스와 펌웨어 업데이트 기능을 쓰려면 사용자에게 미리 "이 앱이 블루투스를 씁니다"라고 허락을 구해야 하는데, 그 안내 문구와 필요한 권한을 `app.json`에 추가했습니다.**

```json
"ios": {
  "infoPlist": {
    "NSBluetoothPeripheralUsageDescription": "이 앱은 BLE 기기(눈 마사지기)와 연결하고 펌웨어를 전송하기 위해 블루투스를 사용합니다."
  }
},
"android": {
  "permissions": [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.FOREGROUND_SERVICE",
    "android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE"
  ]
},
"plugins": [
  [
    "react-native-ble-plx",
    {
      "isBackgroundEnabled": false,
      "modes": ["central"],
      "bluetoothAlwaysPermission": "이 앱은 BLE 기기(눈 마사지기)와 연결하고 펌웨어를 전송하기 위해 블루투스를 사용합니다."
    }
  ]
]
```

| 설정 | 왜 필요한가 |
|---|---|
| `react-native-ble-plx` 플러그인 | 이 라이브러리를 설치하면 안드로이드에는 블루투스 스캔/연결 권한이, iOS에는 블루투스 사용 안내 문구가 자동으로 추가됩니다 |
| `FOREGROUND_SERVICE` 관련 권한 | `@getquip/expo-nordic-dfu`가 펌웨어 전송 중에도 앱이 백그라운드에서 멈추지 않도록 필요하다고 안내한 권한 |

## 5. 지금까지 설치한 패키지 요약

```bash
npx create-expo-app@latest . --template blank-typescript
npx expo install expo-dev-client react-native-ble-plx
npm install --save @getquip/expo-nordic-dfu --legacy-peer-deps
npm install --save-dev eas-cli
```

## 6. 앞으로 해야 할 것

| 순서 | 할 일 |
|---|---|
| 1 | `npx eas login` → `npx eas init` 진행 (Expo 계정 필요, 사람이 직접) |
| 2 | `npx eas build --profile development --platform android`로 Dev Client 앱 파일 빌드 |
| 3 | 안드로이드 14 이상 기기에 설치 → `npx expo start --dev-client`로 실행 확인 (블루투스 권한 팝업이 뜨는지 체크) |
| 4 | `react-native-ble-plx`로 기기 스캔·연결 기능 구현 |
| 5 | 연결된 기기 정보 + 펌웨어 파일로 `@getquip/expo-nordic-dfu` 전송 기능 구현 (자세한 코드는 `ble_ota_guide.md` 참고) |
| 6 | iOS 배포가 필요해지면 `eas build --platform ios`로 동일하게 클라우드 빌드 (macOS 없이도 가능, 단 Apple Developer 계정 필요) |
