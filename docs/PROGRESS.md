# 작업 기록

**결론: 이 문서는 이 프로젝트에서 지금까지 무엇을 했고, 왜 그렇게 했고, 다음에 뭘 할 계획인지를 시간 순서대로 기록하는 "작업 일지"입니다.** 각 항목의 자세한 내용은 관련 문서를 같이 표시해뒀으니 참고하세요.

## 지금까지 완료한 작업

| 작업 | 내용 | 자세한 내용 |
|---|---|---|
| React Native(Expo) 프로젝트 생성 | 앱을 만들 수 있는 기본 뼈대를 만듦 | `AUTO_GENERATED.md` |
| Dev Client / EAS Build 세팅 | 블루투스 같은 특수 기능을 테스트할 수 있도록, 일반 Expo Go 대신 우리 전용 테스트 앱을 클라우드에서 빌드하도록 세팅 | `SETUP.md` 1~2번 |
| BLE 통신 라이브러리 설치 | 기기 조작(모드 변경, 온도 확인 등)을 위한 `react-native-ble-plx` 설치 | `SETUP.md` 3번 |
| 펌웨어 업데이트(OTA) 라이브러리 조사 및 결정 | 기기 칩셋(Nordic) 확인 후, 여러 후보를 비교해서 `@getquip/expo-nordic-dfu` 채택 | `SETUP.md` 3번, `ble_ota_guide.md` |
| 기기 제어 프로토콜 정리 | 하드웨어팀이 준 엑셀 파일(`deepth_info/20240125_Protocol.xlsx`)의 기기 조작 항목을 표로 정리 | `ble_ota_guide.md` 4번 |
| 사업계획서·아키텍처 문서 분석 | 사업계획서와 시스템 구성도를 확인해서, OTA가 백엔드의 정식 기능(Canary 배포·롤백)이라는 것과 Multi-SKU(여러 기기 종류) 대응이 필요하다는 것을 확인 | `ble_ota_guide.md` 2번, 6번 |
| 문서 작성 규칙 수립 | "초보자도 이해할 수 있게, 결론부터, 표로 정리"하는 규칙을 정해서 `AGENTS.md`에 등록 | `AGENTS.md` |
| 문서 3종 정리 | 위 규칙에 맞춰 `AUTO_GENERATED.md`(자동 생성 내용) / `SETUP.md`(직접 결정한 내용) / `ble_ota_guide.md`(OTA 구현 방법)로 문서를 분리 | 각 파일 |
| 코드 폴더 구조(`src`) 생성 | 화면·기능이 늘어날 것을 대비해 기본 폴더 틀을 만듦 (바로 아래 표 참고) | 이 문서 |
| 대시보드·디바이스 관리 UI/UX 설계 | ChatGPT로 검토받은 요구사항을 참고해서 하단 탭 구성(홈/기기/설정), 대시보드·디바이스 관리·기기 등록 흐름의 화면 구조를 확정 | `UI_UX_DESIGN.md` |
| 디자인 원칙 문서화 | "요구사항을 그대로 따르지 않고 UX 관점에서 판단해서 제안한다"는 원칙을 `AGENTS.md`(짧은 규칙)와 `UI_UX_DESIGN.md`(근거·예시)에 나눠서 기록 | `AGENTS.md`, `UI_UX_DESIGN.md` 0번 |
| 레퍼런스 이미지 반영 | AI로 생성한 대시보드·디바이스 관리 목업 이미지(`assets/references/image1.png`)를 보고 실제 색감·카드 스타일·카피 톤을 디자인 톤 섹션에 구체적인 값으로 반영 | `UI_UX_DESIGN.md` 8번 |
| 디자인 방향 최종 확정 | "따뜻한 크림 톤" vs "다크+민트 프리미엄 테크" 두 방향을 비교 검토한 뒤, 브랜드 성격(정밀 트래킹보다 셀프케어에 가까움)에 맞춰 크림 톤으로 확정. 버튼 색 불일치·이벤트 배너 톤 문제도 반영된 최신 레퍼런스(`image2.png`, `image3.png`)로 정리 | `UI_UX_DESIGN.md` 8번 |
| 코딩 컨벤션·기술 스택 확정 | 내비게이션(React Navigation), 상태관리(Zustand), UI 키트(NativeWind + react-native-reusables 선택적 사용), BLE 폴더 구조, OTA 안전장치 정책(재연결/백그라운드 처리)을 확정하고 `AGENTS.md`에 정리 | `AGENTS.md` |
| React Navigation·Zustand 설치 | `@react-navigation/native`, `native-stack`, `bottom-tabs`와 필수 의존성(`react-native-screens`, `react-native-safe-area-context`), `zustand` 설치 완료 | `package.json` |
| NativeWind/react-native-reusables 실제 세팅 및 검증 | 설정 파일을 수동 구성하고, 누락됐던 필수 의존성(`babel-preset-expo`, `react-native-reanimated`, `react-native-worklets`)을 찾아 설치, 실제 번들링까지 확인 | `PROGRESS.md`(이 문서) |
| 문서 폴더 정리 | `AGENTS.md`/`CLAUDE.md`만 루트에 남기고 나머지 문서 5개를 `docs/`로 이동 | `AGENTS.md` |
| 최종 색상 코드 반영 | 레퍼런스 이미지(`image2.png`, `image3.png`)의 실제 픽셀 값을 추출해서 `global.css`, `tailwind.config.js`에 정확한 색상 코드로 반영, 번들링까지 재검증 | `UI_UX_DESIGN.md` 8번 |
| 기기 프로필 데이터 구조 설계 | "기기 종류(SKU)가 지원하는 기능"(`DeviceProfile`)과 "실제 등록된 기기 한 대의 상태"(`Device`)를 분리한 타입을 정의하고, A2의 실제 프로토콜 값으로 카탈로그 작성 | `src/types/device.ts`, `src/services/ble/deviceProfiles.ts` |
| 대시보드·디바이스 관리 화면 구현 | 하단 탭 내비게이션(홈/기기/설정)과 두 화면을 실제 컴포넌트로 구현. 아직 BLE 연동 전이라 Zustand 스토어에 목업 기기 데이터 2개를 넣어서 화면을 확인할 수 있게 함. `npx expo export`로 번들링(3,181개 모듈) 확인 | `src/navigation/RootNavigator.tsx`, `src/screens/`, `src/store/deviceStore.ts` |

## src 폴더 구조

지금은 폴더만 만들어둔 빈 상태(뼈대)이고, 실제 화면/기능 코드는 앞으로 하나씩 채워나갈 예정입니다.

| 폴더 | 무엇을 넣을 예정인가 |
|---|---|
| `src/screens` | 대시보드, 디바이스 관리처럼 화면 단위 코드 |
| `src/components` | 여러 화면에서 재사용하는 버튼, 카드 같은 작은 UI 조각 |
| `src/hooks` | BLE 연결 상태 관리처럼 재사용 가능한 로직 |
| `src/services` | 백엔드 API 호출, BLE 통신 로직 |
| `src/navigation` | 화면 간 이동(탭, 스택) 설정 |
| `src/types` | 타입스크립트 타입 정의 |

## 확인이 필요해서 남겨둔 것 (하드웨어팀 등에 문의 예정)

| 항목 | 상태 |
|---|---|
| "B-3700" 모듈이 실제로 Nordic 칩을 내장했는지 | 미확인 |
| 기기 제어 프로토콜(`0xDEE0`)의 완전한 형태(128bit UUID) | 미확인 |
| 기기가 Nordic 표준 업데이트 절차(DFU)를 지원하는지, 재시작 방식 | 미확인 |
| 기압모드(0xDF62)·진동모드(0xDF63)의 실제 단계 수 — 원본 문서에 범위(0-3, 0-2)와 설명(4단계)이 서로 안 맞음 | 미확인 (일단 4단계로 가정하고 진행) |

## 다음 계획

| 순서 | 할 일 |
|---|---|
| 1 | 기기 등록(BLE 스캔) 흐름 화면 구현 — 지금은 "새로운 기기 등록" 버튼이 눌러도 아무 동작 안 함 |
| 2 | `SETUP.md`에 남은 EAS 로그인·빌드 진행 (사람이 직접, 다른 항목과 순서 무관하게 진행 가능 — `eas init`까지는 진행된 것으로 보임) |
| 3 | 실기기로 BLE 연결 및 펌웨어 업데이트 테스트 (목업 데이터를 실제 BLE 데이터로 교체) |
| 4 | 실제 출시 전, 안드로이드용 adaptive icon(전경/배경 이미지)을 새로 준비해서 `app.json`에 다시 등록 (기존 기본 아이콘 파일은 안 쓰기로 하고 삭제함) |

## NativeWind / react-native-reusables 세팅 경위 (참고용)

**결론: `npx @react-native-reusables/cli@latest init` 명령어는 기존 프로젝트에 설정을 추가해주는 게 아니라, 완전히 새로운 프로젝트를 처음부터 만드는 명령어였습니다.** "A project already exists" 경고에서 "Initialize a new project here anyway"를 선택했더니, 우리 프로젝트 폴더 안에 `deepth_app`이라는 별도의 새 프로젝트(Expo Router 구조, 자체 `node_modules` 포함)를 통째로 새로 만들어버렸습니다. 이건 저희가 원했던 방식(React Navigation 유지, 기존 BLE/OTA 세팅 유지)과 맞지 않아서, 그 폴더는 삭제했습니다.

대신 그 폴더 안에 생성됐던 설정 파일들(`tailwind.config.js`, `babel.config.js`, `metro.config.js`, `global.css`, `components.json` 등)을 참고해서, 우리 프로젝트 루트에 **직접 맞게 옮겨서 설정**했습니다. `npx tsc --noEmit`으로 타입 에러 없이 컴파일되는 것까지 확인했고, `npx @react-native-reusables/cli@latest add input` 명령어로 컴포넌트를 하나 추가해봤더니 `src/components/ui/input.tsx`에 정확히 잘 들어가는 것도 확인했습니다.

**앞으로 컴포넌트가 더 필요하면**: `init`은 다시 실행하지 말고, `add` 명령어만 사용하면 됩니다.

```bash
npx @react-native-reusables/cli@latest add [컴포넌트이름]
# 예: npx @react-native-reusables/cli@latest add dialog
```

### 타입체크만으로는 부족했던 이유

**결론: `tsc` 타입체크가 통과해도 실제로 앱이 번들링되는지는 별개로 확인해야 했습니다.** `npx expo export -p android`로 실제 번들링을 시도해보니 아래 두 가지가 빠져서 실패했습니다.

| 빠졌던 것 | 왜 필요한가 |
|---|---|
| `babel-preset-expo` | 원래 Expo가 내부적으로만 쓰던 걸, `babel.config.js`를 직접 만들면서 우리 프로젝트에도 직접 설치해야 하는 상태가 됨 |
| `react-native-reanimated`, `react-native-worklets` | 애니메이션을 안 써도, NativeWind의 스타일링 엔진(`react-native-css-interop`)이 무조건 요구하는 필수 의존성이었음 (선택 아님) |

이 두 개를 설치한 뒤 `npx expo export -p android`가 979개 모듈을 정상적으로 번들링하는 것까지 확인해서, 이제 진짜로 세팅이 끝났다고 볼 수 있습니다.

## 지금까지 세팅된 것

| 파일 | 역할 |
|---|---|
| `tailwind.config.js`, `global.css` | Tailwind/NativeWind 색상·스타일 테마 (지금은 기본 회색조, 실제 색상 코드는 다음 단계에서 반영 예정) |
| `babel.config.js`, `metro.config.js` | NativeWind가 동작하도록 빌드 설정 연결 |
| `components.json` | `react-native-reusables` 컴포넌트를 어디에 넣을지 정하는 설정 (`@/` → `src/`로 연결) |
| `src/lib/utils.ts` | 스타일 클래스를 합쳐주는 `cn()` 함수 |
| `src/components/ui/{button,text,icon,input}.tsx` | 가져온 표준 컴포넌트 4개 |
