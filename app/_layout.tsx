import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'; // light and ddark themes for navigation in the app
import { useFonts } from 'expo-font'; // loads custom fonts asynchronously
import { Stack } from 'expo-router'; // define stack based navigation system for the app
import * as SplashScreen from 'expo-splash-screen'; // controls the display or hide of the splash screen
import { useEffect } from 'react'; // allows you to run side effects
import 'react-native-reanimated'; // used to enable animations

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
