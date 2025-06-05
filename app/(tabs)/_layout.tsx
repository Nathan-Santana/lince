// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab'; // Seu componente
import { IconSymbol } from '@/components/ui/IconSymbol'; // Seu componente
import TabBarBackground from '@/components/ui/TabBarBackground'; // Seu componente
import { Colors } from '@/constants/Colors'; // Seu arquivo
import { useColorScheme } from '@/hooks/useColorScheme'; // Seu hook

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, 
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ParentDashboard" 
        options={{
          title: 'Responsável',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.fill" color={color} />, 
           href: null, // Descomente se esta não for uma aba visível
        }}
      />
      <Tabs.Screen
        name="TokenDashboard" // ADICIONADO
        options={{
          title: 'Criança',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="key.fill" color={color} />, 
          href: null, // Descomente se esta não for uma aba visível
        }}
      />
      {/* Adicione outras telas de abas aqui, se houver, como "reports" se for uma aba */}
      {<Tabs.Screen
        name="reports" 
        options={{
          title: 'Relatórios',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet.clipboard.fill" color={color} />,
        }}
      />}
    </Tabs>
  );
}