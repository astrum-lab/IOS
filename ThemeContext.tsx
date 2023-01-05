import React, {useCallback, useContext, useMemo, useState} from 'react';
import {useColorScheme, useWindowDimensions} from 'react-native';
import {
  Provider as PaperProvider,
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  configureFonts,
} from 'react-native-paper';
import {
  NavigationContainer,
  Theme as NavigationTheme,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {Theme as PaperTheme} from 'react-native-paper/lib/typescript/types';

declare global {
  namespace ReactNativePaper {
    type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    interface ThemeBreakpoints {
      values: {[k in Breakpoint]: number};
    }

    interface Theme {
      breakpoints: ThemeBreakpoints;
    }
  }
}

const colors = {
  primary: '#5733d1',
  secondary: '#5733d14d',
  green: '#00ebb0',
  background: '#ffffff',
  input: '#f1f1f1',
  inputText: '#bebebe',
  textPrimary: '#4b4797',
  text: '#000000',
  textSecondary: '#fff',
  line: '#f5f5f5',
  passwordField: '#eaeaea',
  passwordDot: '#00ebb0',
  passwordstatus: '#707070',
  passwordBtnText: '#000000',
  button: '#ffffff',
  swiperBackground: '#dddddd',
  border: '#eaeaea',
  backgroundSecondary: '#EAEAEA',
};

const darkColors = {
  ...colors,
  background: '#211E2A',
  textPrimary: '#f1f1f1',
  input: '#363246',
  inputText: '#979797',
  passwordField: '#363246',
  passwordstatus: '#979797',
  passwordDot: '#ffffff',
  text: '#ffffff',
  passwordBtnText: '#ffffff',
  button: '#363246',
  swiperBackground: '#302c3e',
  border: '#363246',
  backgroundSecondary: '#211E2A',
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

export type Theme = NavigationTheme &
  PaperTheme & {
    colors: {};
    breakpoints: {};
  };

const lightTheme: Theme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,

  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    ...colors,
  },
  breakpoints: {
    ...breakpoints,
  },
};

const darkTheme: Theme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme,
    ...darkColors,
  },
  breakpoints: {
    ...breakpoints,
  },
};

export const useBreakpoint = (): {
  width: number;
  breakpoint: ReactNativePaper.Breakpoint;
} => {
  const theme = useTheme();
  const {width} = useWindowDimensions();

  const breakpoint = useMemo(() => {
    const nearestBrekpoint = Object.entries(theme.breakpoints.values)
      .reverse()
      .find(([_, value]) => value < width);
    if (nearestBrekpoint) {
      return nearestBrekpoint[0] as ReactNativePaper.Breakpoint;
    }
    return 'xs';
  }, [width, theme]);

  return {
    width,
    breakpoint,
  };
};

export type ThemeType = 'dark' | 'light';

export interface ThemeContextValue {
  theme: Theme;
  themeType: ThemeType;
  isDarkTheme: boolean;
  toggleThemeType: () => void;
  setThemeType: React.Dispatch<React.SetStateAction<ThemeType>>;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  theme: lightTheme,
  themeType: 'light',
  isDarkTheme: false,
  setThemeType: () => {},
  toggleThemeType: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider = ({children}: ThemeContextProviderProps) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(colorScheme || 'light');

  const toggleThemeType = useCallback(() => {
    setThemeType(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDarkTheme = useMemo(() => themeType === 'dark', [themeType]);
  const theme = useMemo(
    () => (isDarkTheme ? darkTheme : lightTheme),
    [isDarkTheme],
  );

  return (
    <NavigationContainer theme={theme}>
      <PaperProvider theme={theme}>
        <ThemeContext.Provider
          value={{
            theme,
            themeType,
            isDarkTheme,
            setThemeType,
            toggleThemeType,
          }}>
          {children}
        </ThemeContext.Provider>
      </PaperProvider>
    </NavigationContainer>
  );
};
