import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { House, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/lib/theme';
import { DeviceIcon } from '@/components/icons/DeviceIcon';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { DeviceManagementScreen } from '@/screens/DeviceManagementScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

// React Navigation의 헤더/탭바 색을 우리 테마(global.css)와 맞추기 위한 설정
const navigationTheme: Theme = {
  dark: false,
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.foreground,
    border: COLORS.border,
    notification: COLORS.destructive,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
  },
};

const Tab = createBottomTabNavigator();

// 탭바 버튼의 기본 안드로이드 눌림 효과(회색 물결)가 테마와 안 어울려서,
// 우리 포인트 컬러를 옅게 쓴 물결로 바꾼다.
function TabBarButton(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      android_ripple={{ color: `${COLORS.primary}33`, borderless: true, radius: 28 }}
    />
  );
}

// 탭바 위/아래 여백이 답답해 보이지 않도록, 기기의 하단 안전 영역(제스처 바 등)을 감안해서
// 탭바 높이를 직접 계산한다. useSafeAreaInsets는 SafeAreaProvider 하위에서만 쓸 수 있다.
function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarButton: TabBarButton,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom + 10,
        },
      }}
    >
      <Tab.Screen
        name="홈"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }}
      />
      <Tab.Screen
        name="기기"
        component={DeviceManagementScreen}
        options={{ tabBarIcon: ({ color, size }) => <DeviceIcon color={color} size={size} /> }}
      />
      <Tab.Screen
        name="설정"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
}
