import './global.css';

import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// NativeWind + react-native-reusables 세팅이 잘 됐는지 확인하는 임시 화면
export default function App() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <Text variant="h3">NativeWind 세팅 확인용</Text>
      <Button onPress={() => {}}>
        <Text>버튼</Text>
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}
