import React, { useCallback, useEffect } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAudioEngine } from './src/hooks/useAudioEngine';
import { useSceneStore } from './src/store/useSceneStore';
import { colors } from './src/constants/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

const AppContent: React.FC = () => {
  useAudioEngine();
  return <RootNavigator />;
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Fraunces-Regular': require('./assets/fonts/Fraunces-Regular.ttf'),
          'Fraunces-SemiBold': require('./assets/fonts/Fraunces-SemiBold.ttf'),
          'SourceSans3-Regular': require('./assets/fonts/SourceSans3-Regular.ttf'),
          'SourceSans3-Medium': require('./assets/fonts/SourceSans3-Medium.ttf'),
        });
      } catch (e) {
        console.warn('Font loading failed:', e);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadFonts();
    useSceneStore.getState().loadCustomScenes();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.root} onLayout={onLayoutRootView}>
          <AppContent />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
