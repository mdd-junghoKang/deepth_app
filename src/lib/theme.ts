// global.css의 색상 값(HSL)과 동일한 값을 hex로 옮겨둔 것.
// React Navigation의 헤더/탭바나 아이콘처럼 className이 아니라 JS 값으로
// 색상이 필요한 곳에서 이 상수를 쓴다. 색을 바꿀 때는 global.css와 여기 둘 다 맞춰야 한다.
export const COLORS = {
  background: '#fcf5ee',
  card: '#f6f0ea',
  primary: '#f6a713',
  foreground: '#0c243c',
  border: '#e2d9cf',
  destructive: '#fc664f',
  success: '#77bf5f',
  muted: '#b4b4b4',
} as const;
