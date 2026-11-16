import { Tabs } from 'expo-router/js-tabs';
import { CircleUser, Droplets, MapPin, Ticket } from 'lucide-react-native';

import { colors } from '@/theme/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors['on-surface-variant'],
        tabBarStyle: { backgroundColor: colors['surface-container-lowest'] },
        tabBarLabelStyle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Droplets color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="refugios"
        options={{
          title: 'Refúgios',
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, size }) => <Ticket color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <CircleUser color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
