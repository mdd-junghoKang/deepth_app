import { FlatList, Pressable, View } from 'react-native';
import { ChevronRight, Plus } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { useDeviceStore } from '@/store/deviceStore';
import { DEVICE_PROFILES } from '@/services/ble/deviceProfiles';
import type { Device } from '@/types/device';

export function DeviceManagementScreen() {
  const devices = useDeviceStore((s) => s.devices);

  return (
    <View className="flex-1 gap-4 bg-background p-4">
      <Text variant="h3">내 디바이스 ({devices.length})</Text>

      {devices.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3"
          renderItem={({ item }) => <DeviceCard device={item} />}
        />
      )}

      <Button onPress={() => {}}>
        <Icon as={Plus} size={18} />
        <Text>새로운 기기 등록</Text>
      </Button>
    </View>
  );
}

function DeviceCard({ device }: { device: Device }) {
  const profile = DEVICE_PROFILES[device.sku];
  const isConnected = device.connectionStatus === 'connected';
  const needsUpdate = device.latestFirmwareVersion != null;
  const lastUsedLabel = device.lastUsedAt ? formatLastUsed(device.lastUsedAt) : '사용 기록 없음';

  return (
    <Pressable className="gap-2 rounded-2xl bg-card p-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="font-semibold">{device.nickname}</Text>
          <Text variant="muted" className="text-xs">
            {profile?.category ?? device.sku} · {device.sku}
          </Text>
        </View>
        <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
      </View>

      <View className="flex-row items-center gap-2">
        <View className={cn('h-2 w-2 rounded-full', isConnected ? 'bg-success' : 'bg-muted')} />
        <Text className={cn('text-xs', isConnected ? 'text-success' : 'text-muted-foreground')}>
          {isConnected ? '연결됨' : '연결 안 됨'}
        </Text>
      </View>

      <Text variant="muted" className="text-xs">
        최근 사용: {lastUsedLabel}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text variant="muted" className="text-xs">
          펌웨어 {device.firmwareVersion}
          {!needsUpdate && ' · 최신'}
        </Text>
        {needsUpdate && (
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-destructive px-2 py-0.5">
              <Text className="text-xs text-destructive-foreground">업데이트 필요</Text>
            </View>
            <Button size="sm" onPress={() => {}}>
              <Text>업데이트</Text>
            </Button>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <Text variant="large">아직 등록된 기기가 없어요</Text>
      <Text variant="muted">지금 바로 기기를 등록하고 더 편안한 일상을 시작해보세요.</Text>
    </View>
  );
}

function formatLastUsed(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}
