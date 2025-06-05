/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    icon: '#222',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
    error: '#ff3b30', // Added error color for light theme
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    icon: '#fff',
    tabIconDefault: '#888',
    tabIconSelected: '#fff',
    error: '#ff453a', // Added error color for dark theme (optional)
  },
};
