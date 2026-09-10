# 깃플챗(Gitple Chat) 연동 가이드

## 한눈에 보기

**결론: 앱 안에 "1:1 상담 채팅" 기능을 넣기 위해 Gitple(깃플)이라는 CS 채팅 서비스를 쓰기로 했고, 전용 라이브러리 대신 웹 화면을 앱 안에 띄우는 방식(WebView)으로 연동하기로 했습니다.**

| 항목 | 내용 |
|---|---|
| 무엇을 위한 것인가 | 사용자가 앱 안에서 고객센터와 실시간으로 채팅 상담할 수 있는 기능 |
| 어떤 서비스를 쓰나 | [Gitple](https://gitple.io/ko) — "옴니채널 고객상담 솔루션" (채널톡과 비슷한 종류의 CS 채팅 서비스) |
| 연동 방식 | 전용 라이브러리(`react-native-gitple-sdk`) ❌ / `react-native-webview`로 웹 위젯 감싸기 ✅ |

## 용어 미니 사전

| 용어 | 쉬운 설명 |
|---|---|
| CS 채팅(고객 상담 채팅) | 앱 사용자가 궁금한 게 있을 때 상담사와 실시간으로 대화할 수 있는 채팅 기능 |
| 위젯(widget) | 웹사이트 구석에 떠 있는 "채팅하기" 버튼처럼, 다른 서비스가 만들어서 우리 화면에 끼워 넣을 수 있게 제공하는 작은 화면 조각 |
| SDK | 특정 서비스를 앱에 더 쉽게 연동할 수 있도록 미리 만들어둔 코드 모음 |
| WebView | 앱 화면 안에 "작은 인터넷 브라우저 창"을 띄우는 기능. 이 창 안에서는 웹사이트를 그대로 보여줄 수 있다 |

## 왜 필요한가

사업계획서 단계부터 "CS 1:1 문의" 기능이 계속 언급됐고, 최근 고객사·개발사 미팅에서 이 기능에 **Gitple**이라는 CS 채팅 서비스를 쓰기로 확정됐습니다 (자세한 배경은 `docs/PROGRESS.md`의 관련 회의 기록 참고).

## 연동 방식 결정 사항

**결론: `react-native-gitple-sdk`(Gitple이 공식으로 낸 React Native 전용 라이브러리)는 쓰지 않고, `react-native-webview`로 Gitple의 웹 채팅 위젯을 앱 안에 띄우는 방식으로 구현합니다.**

| 방식 | 상태 | 판단 |
|---|---|---|
| `react-native-gitple-sdk` (공식 RN 전용 라이브러리) | 마지막 버전(2.0.4)이 **2021년 12월**에 나온 뒤로 4년 가까이 업데이트 없음 | ❌ 채택 안 함 — 지금 쓰는 최신 React Native(New Architecture)와 호환이 안 될 위험이 큼 |
| `react-native-webview` + Gitple 웹 위젯 | `react-native-webview`는 지금도 활발히 관리되는 라이브러리 | ✅ 채택 — Gitple 쪽 위젯은 서버에서 그때그때 최신 상태로 내려주는 웹 화면이라, 우리가 쓰는 라이브러리가 오래됐을 위험이 없음 |

이 판단은 앞서 OTA 라이브러리를 고를 때(`docs/ble_ota_guide.md` 참고 — 오래돼서 방치된 `react-native-nordic-dfu` 대신 최신 라이브러리를 골랐던 것) 썼던 것과 같은 기준입니다: **오래 방치된 전용 라이브러리보다, 계속 관리되는 범용 도구로 웹 기능을 감싸는 쪽이 더 안전합니다.**

## 구현 시 반드시 지켜야 할 것

**결론: 아래 예시 코드의 설정값은 전부 가짜(예시)입니다. 실제로 구현할 때는 반드시 Gitple 관리자 콘솔에서 발급받은 값을 그대로 써야 합니다.**

- Gitple 관리자 콘솔(`workspace.gitple.io`) 로그인 → **"설치 가이드"** 메뉴로 이동
- 거기서 안내하는 `GitpleConfig` 설정값과 위젯을 불러오는 스크립트 코드를 **그대로 복사**해서 사용
- 이 값들은 회사 계정마다 고유한 값(워크스페이스 ID 등)이 들어있어서, 임의로 만들어 쓰면 채팅 연결 자체가 안 됩니다
- 관리자 콘솔에서 값을 받으면, 그 내용을 이 문서 아래에 실제 값으로 업데이트해두면 좋습니다 (단, 외부에 공개되면 안 되는 값이 있는지는 Gitple 문서에서 한 번 확인 필요)

## 기본 구현 예시 코드

아래는 "화면 하나를 통째로 채팅 상담 화면으로 쓰는" 가장 단순한 구조입니다. `react-native-webview`가 설치돼 있어야 합니다.

```bash
npx expo install react-native-webview
```

```tsx
// src/screens/SupportChatScreen.tsx
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

// ⚠️ 아래 GITPLE_WIDGET_HTML 안의 설정값은 전부 예시(가짜)입니다.
// 실제 값은 workspace.gitple.io 관리자 콘솔 > "설치 가이드"에서 받은 코드를
// 그대로 복사해서 아래 <script> 부분을 통째로 교체해야 합니다.
const GITPLE_WIDGET_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
    </style>
  </head>
  <body>
    <script>
      // 예시일 뿐입니다 — 관리자 콘솔에서 받은 GitpleConfig와
      // 위젯 로더 스크립트로 이 부분을 그대로 교체하세요.
      window.GitpleConfig = {
        workspaceId: 'YOUR_WORKSPACE_ID', // 실제 값으로 교체 필요
      };
    </script>
    <!-- 관리자 콘솔에서 안내하는 위젯 로더 <script src="..."> 태그를 여기에 그대로 붙여넣기 -->
  </body>
</html>
`;

export function SupportChatScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <WebView
        source={{ html: GITPLE_WIDGET_HTML }}
        // 채팅 중 카메라/파일첨부 등을 쓸 수도 있어서 미리 켜둔다.
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
      />
    </SafeAreaView>
  );
}
```

## 다음 액션

1. Gitple 관리자 콘솔(`workspace.gitple.io`)에서 "설치 가이드" 메뉴의 실제 `GitpleConfig`·위젯 스크립트 코드 확보
2. 위 예시 코드의 가짜 설정값을 실제 값으로 교체
3. `react-native-webview` 설치 후 실제 기기에서 채팅 위젯이 정상적으로 뜨는지 테스트
4. 이 채팅 화면을 앱의 어느 위치(전체메뉴 안 "1:1 문의" 등)에 연결할지 `docs/UI_UX_DESIGN.md` 기준으로 배치 결정
