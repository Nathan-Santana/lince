import { ColorValue } from "react-native";

interface ITheme {
    backgroundComposed: ColorValue | undefined;
    secondary: ColorValue | undefined;
    buttonText: ColorValue | undefined;
    textMuted: ColorValue | undefined;
    dark: any;
    background: string;
    text: string;
    inputBackground: string;
    border: string;
    primary: string;
    placeholder: string;
  }
  
export const lightTheme: ITheme = {
  background: '#FFFFFF',
  text: '#000000',
  inputBackground: '#F5F5F5',
  border: '#CCCCCC',
  primary: '#007BFF',
  placeholder: '#666666',
  dark: undefined,
  buttonText: undefined,
  textMuted: undefined,
  secondary: undefined,
  backgroundComposed: undefined
};
  
export const darkTheme: ITheme = {
  background: '#1A1A1A',
  text: '#FFFFFF',
  inputBackground: '#2A2A2A',
  border: '#444444',
  primary: '#0A84FF',
  placeholder: '#888888',
  dark: undefined,
  buttonText: undefined,
  textMuted: undefined,
  secondary: undefined,
  backgroundComposed: undefined
};
  
export type Theme = ITheme;
  