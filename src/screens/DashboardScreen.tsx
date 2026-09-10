import { Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  ChevronRight,
  Clock,
  Leaf,
  Moon,
  Pause,
  Play,
  Sun,
  Thermometer,
  User,
  Waves,
  type LucideIcon,
} from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/deviceStore";
import { DEVICE_PROFILES } from "@/services/ble/deviceProfiles";
import type { Device } from "@/types/device";

// 추천 모드 카드에 쓸 아이콘/색을 모드 id별로 정의 (docs/UI_UX_DESIGN.md의 image3.png 레퍼런스 참고).
// 프로토콜 데이터(deviceProfiles.ts)에는 시각적인 정보를 안 섞으려고 화면 쪽에 따로 둔다.
// iconColor는 카드 위쪽 아이콘 자체 색(배지 없이), badge는 아래쪽 재생 버튼 원 색이다.
// tagline은 deviceProfiles.ts의 정확하지만 긴 기술 설명(description) 대신,
// 이 카드에서만 쓰는 짧은 홍보 문구다 (docs/UI_UX_DESIGN.md의 image5.png 레퍼런스 참고).
const MODE_STYLES: Record<
  number,
  {
    icon: LucideIcon;
    tint: string;
    iconColor: string;
    badge: string;
    tagline: string;
  }
> = {
  1: {
    icon: Sun,
    tint: "bg-primary/10",
    iconColor: "text-primary",
    badge: "bg-primary",
    tagline: "따뜻한 온열로 편안하게",
  }, // 순환 테라피
  2: {
    icon: Leaf,
    tint: "bg-success/10",
    iconColor: "text-success",
    badge: "bg-success",
    tagline: "지친 눈에 활력을",
  }, // 집중력 테라피
  3: {
    icon: Moon,
    tint: "bg-violet-100",
    iconColor: "text-violet-500",
    badge: "bg-violet-500",
    tagline: "오늘도 좋은 밤 되세요",
  }, // 수면 테라피
  4: {
    icon: Sun,
    tint: "bg-primary/10",
    iconColor: "text-primary",
    badge: "bg-primary",
    tagline: "강력한 케어가 필요할 때",
  }, // 파워 테라피
};

// 정보 우선순위(docs/UI_UX_DESIGN.md 3번): 기기 상태 > 빠른 조작 > 추천 모드 > 기기 관리 > 부가 콘텐츠
// 지금은 기기 하나만 동시에 연동되는 구조라 기기 전환 UI 없이 대표 기기 하나만 보여준다.
// 나중에 여러 기기를 동시에 연동할 수 있게 되면 그때 전환 UI를 다시 추가한다.
export function DashboardScreen() {
  const devices = useDeviceStore((s) => s.devices);
  const selectedDeviceId = useDeviceStore((s) => s.selectedDeviceId);
  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) ?? null;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="gap-5 p-5">
        <Header />

        {selectedDevice ? (
          <DeviceHeroCard device={selectedDevice} />
        ) : (
          <EmptyDeviceCard />
        )}

        {/* 고객사 확정 사항: 추천 모드는 기기가 연결된 화면에서만 노출 (docs/PROGRESS.md 참고) */}
        {selectedDevice && <RecommendedModes device={selectedDevice} />}

        <Pressable className="flex-row items-center justify-between rounded-2xl bg-card px-4 py-4">
          <Text>내 기기 {devices.length}개 관리하기</Text>
          <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
        </Pressable>

        <NoticeBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

// 아직 로그인/회원 기능을 안 만들어서 이름을 임시로 고정해뒀다.
// 나중에 회원 정보 화면을 만들 때 실제 사용자 이름으로 교체한다.
const MOCK_USER_NAME = "정호";

function Header() {
  return (
    <View className="gap-4">
      <View className="flex-row items-start justify-between">
        <View className="gap-0.5">
          <Text variant="h3">Deepth.</Text>
          <Text variant="muted" className="text-xs tracking-widest">
            SMART EYE CARE
          </Text>
        </View>
        <View className="flex-row items-center gap-3 pt-1">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-card">
            <Icon as={Bell} size={20} />
            <View className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-card">
            <Icon as={User} size={20} />
          </View>
        </View>
      </View>
      <View className="gap-1">
        <Text variant="h4">안녕하세요, {MOCK_USER_NAME}님</Text>
        <Text variant="muted">오늘도 눈에 휴식을 선물하세요.</Text>
      </View>
    </View>
  );
}

function DeviceHeroCard({ device }: { device: Device }) {
  const profile = DEVICE_PROFILES[device.sku];
  const isConnected = device.connectionStatus === "connected";
  const currentMode = profile?.modes.find((m) => m.id === device.currentModeId);

  return (
    <View className="gap-5 rounded-3xl bg-card p-6">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-2">
          <View className="gap-1">
            <Text variant="h4">{device.nickname}</Text>
            <Text variant="muted">{profile?.category ?? device.sku}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                isConnected ? "bg-success" : "bg-muted",
              )}
            />
            <Text
              className={isConnected ? "text-success" : "text-muted-foreground"}
            >
              {isConnected ? "연결됨" : "연결 안 됨"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <BatteryIndicator level={device.batteryLevel} />
            <Text variant="muted" className="text-xs">
              {device.batteryLevel}%
            </Text>
          </View>
        </View>
        {profile && (
          <Image
            source={profile.image}
            className="h-24 w-36"
            resizeMode="contain"
          />
        )}
      </View>

      {isConnected ? (
        <>
          <View className="flex-row justify-between border-t border-border pt-5">
            <Stat
              icon={Thermometer}
              label="온열"
              value={
                device.temperature != null ? `${device.temperature}℃` : "-"
              }
            />
            <Stat
              icon={Waves}
              label="현재 모드"
              value={currentMode?.name ?? "-"}
            />
            <Stat
              icon={Clock}
              label="남은시간"
              value={
                device.remainingTimeMinutes != null
                  ? `${device.remainingTimeMinutes}분`
                  : "-"
              }
            />
          </View>
          <LastUsedRow device={device} />
          {/* 지금은 레이아웃 용으로 넣어 둔거라서 나중에 device앞에 ! 빼기 */}
          <Button onPress={() => {}}>
            <Icon as={!device.powerOn ? Pause : Play} size={16} fill="white" />
            <Text>
              {!device.powerOn ? "테라피 중지하기" : "테라피 시작하기"}
            </Text>
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

// 배터리 아이콘 안에 실제 충전량만큼 막대가 채워지는 형태 (docs/UI_UX_DESIGN.md의 image4.png 레퍼런스).
// Lucide에는 이렇게 수치에 따라 채워지는 배터리 아이콘이 없어서 직접 만들었다.
function BatteryIndicator({ level }: { level: number }) {
  const clamped = Math.min(Math.max(level, 0), 100);
  const fillColor = clamped <= 20 ? "bg-destructive" : "bg-success";
  return (
    <View className="flex-row items-center">
      <View className="h-3 w-5 justify-center rounded-[3px] border border-muted-foreground/50 p-[1.5px]">
        <View
          className={cn("h-full rounded-[1px]", fillColor)}
          style={{ width: `${Math.max(clamped, 12)}%` }}
        />
      </View>
      <View className="h-1.5 w-[2px] rounded-r-sm bg-muted-foreground/50" />
    </View>
  );
}

function LastUsedRow({ device }: { device: Device }) {
  if (!device.lastUsedAt) return null;
  const profile = DEVICE_PROFILES[device.sku];
  const lastMode = profile?.modes.find((m) => m.id === device.lastUsedModeId);

  return (
    <Pressable className="flex-row items-center justify-between rounded-xl bg-background px-3 py-2.5">
      <View className="flex-row items-center gap-2">
        <Icon as={Clock} size={14} className="text-muted-foreground" />
        <Text variant="muted" className="text-xs">
          최근 사용 {formatLastUsedTimestamp(device.lastUsedAt)}
          {lastMode && ` · ${lastMode.name}`}
          {device.lastUsedDurationMinutes != null &&
            ` (${device.lastUsedDurationMinutes}분)`}
        </Text>
      </View>
      <Icon as={ChevronRight} size={14} className="text-muted-foreground" />
    </Pressable>
  );
}

function formatLastUsedTimestamp(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const hours24 = date.getHours();
  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const time = `${period} ${hours12}:${minutes}`;

  if (date.toDateString() === now.toDateString()) return `오늘 ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `어제 ${time}`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${time}`;
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <View className="max-w-[30%] items-center gap-1.5">
      <Icon as={icon} size={18} className="text-primary" />
      <Text className="text-center font-semibold">{value}</Text>
      <Text variant="muted" className="text-center text-xs">
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
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text variant="large">추천 모드</Text>
        <Pressable className="flex-row items-center gap-1">
          <Text variant="muted" className="text-xs">
            전체보기
          </Text>
          <Icon as={ChevronRight} size={14} className="text-muted-foreground" />
        </Pressable>
      </View>
      <View className="flex-row gap-3">
        {recommended.map((mode) => {
          const style = MODE_STYLES[mode.id];
          return (
            <View
              key={mode.id}
              className={cn(
                "flex-1 items-center gap-2 rounded-2xl p-4",
                style?.tint ?? "bg-card",
              )}
            >
              {style && (
                <Icon as={style.icon} size={26} className={style.iconColor} />
              )}
              <View className="items-center gap-1">
                <Text className="text-center font-semibold">{mode.name}</Text>
                <Text variant="muted" className="text-center text-xs">
                  {style?.tagline ?? mode.description}
                </Text>
              </View>
              <Pressable
                className={cn(
                  "h-8 w-8 items-center justify-center rounded-full",
                  style?.badge ?? "bg-primary",
                )}
              >
                <Icon as={Play} size={14} className="text-white" fill="white" />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function NoticeBanner() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text variant="large">공지사항</Text>
        <Pressable className="flex-row items-center gap-1">
          <Text variant="muted" className="text-xs">
            더보기
          </Text>
          <Icon as={ChevronRight} size={14} className="text-muted-foreground" />
        </Pressable>
      </View>
      <Pressable className="flex-row items-center justify-between rounded-2xl bg-secondary p-4">
        <View className="flex-1 gap-1">
          <Text className="font-semibold">등록된 공지가 없어요</Text>
          <Text variant="muted" className="text-xs">
            새로운 소식이 있으면 이곳에 표시됩니다.
          </Text>
        </View>
        <Icon as={ChevronRight} size={18} className="text-muted-foreground" />
      </Pressable>
    </View>
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
