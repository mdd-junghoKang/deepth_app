import { Pressable, ScrollView, View } from 'react-native';
import { Battery, Bell, ChevronRight, Clock, Play, Thermometer, User, type LucideIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useDeviceStore } from '@/store/deviceStore';
import { DEVICE_PROFILES } from '@/services/ble/deviceProfiles';
import type { Device } from '@/types/device';

// 정보 우선순위(docs/UI_UX_DESIGN.md 3번): 기기 상태 > 빠른 조작 > 추천 모드 > 기기 관리 > 부가 콘텐츠
export function DashboardScreen() {
  const devices = useDeviceStore((s) => s.devices);
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const selectDevice = useDeviceStore((s) => s.selectDevice);
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) ?? null;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-4">
      <Header />

      {devices.length > 1 && (
        <DeviceSwitcher devices={devices} selectedId={selectedDeviceId} onSelect={selectDevice} />
      )}

      {selectedDevice ? <DeviceHeroCard device={selectedDevice} /> : <EmptyDeviceCard />}

      {selectedDevice && <RecommendedModes device={selectedDevice} />}

      <Pressable className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-3">
        <Text>내 기기 {devices.length}개 관리하기</Text>
        <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
      </Pressable>

      <NoticeBanner />
    </ScrollView>
  );
}

function Header() {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="h3">Deepth Smart</Text>
      <View className="flex-row items-center gap-4">
        <Icon as={Bell} size={22} />
        <Icon as={User} size={22} />
      </View>
    </View>
  );
}

function DeviceSwitcher({
  devices,
  selectedId,
  onSelect,
}: {
  devices: Device[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {devices.map((device) => {
        const isSelected = device.id === selectedId;
        return (
          <Pressable
            key={device.id}
            onPress={() => onSelect(device.id)}
            className={cn(
              'rounded-full border px-4 py-2',
              isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
            )}
          >
            <Text className={isSelected ? 'text-primary' : undefined}>{device.nickname}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function DeviceHeroCard({ device }: { device: Device }) {
  const profile = DEVICE_PROFILES[device.sku];
  const isConnected = device.connectionStatus === 'connected';
  const currentMode = profile?.modes.find((m) => m.id === device.currentModeId);

  return (
    <View className="gap-4 rounded-3xl bg-card p-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text variant="h4">{device.nickname}</Text>
          <Text variant="muted">{profile?.category ?? device.sku}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className={cn('h-2.5 w-2.5 rounded-full', isConnected ? 'bg-success' : 'bg-muted')} />
          <Text className={isConnected ? 'text-success' : 'text-muted-foreground'}>
            {isConnected ? '연결됨' : '연결 안 됨'}
          </Text>
        </View>
      </View>

      {isConnected ? (
        <>
          <View className="flex-row justify-between">
            <Stat icon={Thermometer} label="온열" value={device.temperature != null ? `${device.temperature}℃` : '-'} />
            <Stat
              icon={Clock}
              label="남은시간"
              value={device.remainingTimeMinutes != null ? `${device.remainingTimeMinutes}분` : '-'}
            />
            <Stat icon={Battery} label="배터리" value={`${device.batteryLevel}%`} />
          </View>
          <Text variant="muted">현재 모드: {currentMode?.name ?? '-'}</Text>
          <Button onPress={() => {}}>
            <Icon as={Play} size={16} />
            <Text>{device.powerOn ? '테라피 중지하기' : '테라피 시작하기'}</Text>
          </Button>
        </>
      ) : (
        <Button variant="secondary" onPress={() => {}}>
          <Text>다시 연결하기</Text>
        </Button>
      )}
    </View>
  );
}

function Stat({ icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <View className="items-center gap-1">
      <Icon as={icon} size={18} className="text-muted-foreground" />
      <Text className="font-semibold">{value}</Text>
      <Text variant="muted" className="text-xs">
        {label}
      </Text>
    </View>
  );
}

function RecommendedModes({ device }: { device: Device }) {
  const profile = DEVICE_PROFILES[device.sku];
  if (!profile) return null;
  const recommended = profile.modes.filter((m) => m.id !== 0).slice(0, 3);

  return (
    <View className="gap-2">
      <Text variant="large">추천 모드</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
        {recommended.map((mode) => (
          <View key={mode.id} className="w-40 gap-2 rounded-2xl bg-card p-4">
            <Text className="font-semibold">{mode.name}</Text>
            <Text variant="muted" className="text-xs">
              {mode.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function NoticeBanner() {
  return (
    <Pressable className="rounded-2xl bg-secondary p-4">
      <Text className="font-semibold">공지사항</Text>
      <Text variant="muted">등록된 공지·이벤트가 이곳에 표시됩니다.</Text>
    </Pressable>
  );
}

function EmptyDeviceCard() {
  return (
    <View className="items-center gap-3 rounded-3xl bg-card p-8">
      <Text variant="large">아직 등록된 기기가 없어요</Text>
      <Button onPress={() => {}}>
        <Text>기기 등록하기</Text>
      </Button>
    </View>
  );
}
