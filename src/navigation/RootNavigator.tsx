import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bluetooth, House, Settings } from 'lucide-react-native';
import { COLORS } from '@/lib/theme';
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

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.muted,
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
          options={{ tabBarIcon: ({ color, size }) => <Bluetooth color={color} size={size} /> }}
        />
        <Tab.Screen
          name="설정"
          component={SettingsScreen}
          options={{ tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
