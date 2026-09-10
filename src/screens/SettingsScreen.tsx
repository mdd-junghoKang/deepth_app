import { View } from 'react-native';
import { Text } from '@/components/ui/text';

// 지금은 자리만 잡아둔 화면. 언어 변경, 공지사항, CS 등은 이후 단계에서 채운다.
export function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text variant="muted">설정 화면은 이후 단계에서 만들 예정입니다.</Text>
    </View>
  );
}
