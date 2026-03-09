import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  House,
  Waveform,
  SlidersHorizontal,
  GearSix,
} from 'phosphor-react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ScenesScreen } from '../screens/ScenesScreen';
import { CustomizeScreen } from '../screens/CustomizeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAudioStore } from '../store/useAudioStore';
import { colors, getNoiseColors } from '../constants/colors';
import { fonts } from '../constants/fonts';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const activeNoiseType = useAudioStore((s) => s.activeNoiseType);
  const noiseColors = getNoiseColors(activeNoiseType);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(22,22,24,0.9)',
          borderTopWidth: 0,
          elevation: 0,
          borderTopColor: 'transparent',
          paddingTop: 8,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: noiseColors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontFamily: fonts.sourceSans.medium,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} weight="thin" />
          ),
        }}
      />
      <Tab.Screen
        name="Scenes"
        component={ScenesScreen}
        options={{
          tabBarLabel: 'Scenes',
          tabBarIcon: ({ color, size }) => (
            <Waveform size={size} color={color} weight="thin" />
          ),
        }}
      />
      <Tab.Screen
        name="Customize"
        component={CustomizeScreen}
        options={{
          tabBarLabel: 'Customize',
          tabBarIcon: ({ color, size }) => (
            <SlidersHorizontal size={size} color={color} weight="thin" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <GearSix size={size} color={color} weight="thin" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
