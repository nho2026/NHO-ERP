/** Nadir Health Organization color tokens. CSS equivalents live in index.css. */
export const brandColors = {
  blue: "#0f766e",
  blueDark: "#115e59",
  blueLight: "#e6f5f2",
  teal: "#0d9488",
  tealDark: "#0f766e",
  tealLight: "#e6f5f2",
} as const;

export const windowControlColors = {
  minimize: "#FBBF24",
  maximize: "#22C55E",
  close: "#DC2626",
} as const;

export const colors = {
  brand: brandColors,
  windowControls: windowControlColors,
  light: {
    primary: brandColors.blue,
    primaryHover: "#115e59",
    primaryPressed: "#134e4a",
    primarySubtle: brandColors.blueLight,
    onPrimary: "#FFFFFF",
    secondary: brandColors.teal,
    secondaryHover: "#0f766e",
    secondaryPressed: brandColors.tealDark,
    secondarySubtle: brandColors.tealLight,
    onSecondary: "#062F31",
    background: "#F6F9FC",
    surface: "#FFFFFF",
    surfaceRaised: "#FFFFFF",
    surfaceMuted: "#EEF4F7",
    text: {
      primary: "#102A43",
      secondary: "#52677A",
      muted: "#718396",
      inverse: "#FFFFFF",
      link: brandColors.blue,
    },
    border: "#D9E3EA",
    borderStrong: "#B8C7D1",
    focus: brandColors.teal,
    success: "#15803D",
    warning: "#B45309",
    error: "#DC2626",
    info: "#0284C7",
  },
  dark: {
    primary: "#5eead4",
    primaryHover: "#99f6e4",
    primaryPressed: "#ccfbf1",
    primarySubtle: "#000000",
    onPrimary: "#000000",
    secondary: "#4FD0D2",
    secondaryHover: "#70DADB",
    secondaryPressed: "#91E3E4",
    secondarySubtle: "#1B2525",
    onSecondary: "#FFFFFF",
    background: "#000000",
    surface: "#0F0F0F",
    surfaceRaised: "#151515",
    surfaceMuted: "#1A1A1A",
    text: {
      primary: "#FFFFFF",
      secondary: "#D4D4D4",
      muted: "#A3A3A3",
      inverse: "#070707",
      link: "#5eead4",
    },
    border: "#303030",
    borderStrong: "#484848",
    focus: "#4FD0D2",
    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#e00d2c",
    info: "#38BDF8",
  },
} as const;

export type ThemeMode = "light" | "dark";
export type ThemeColors = (typeof colors)[ThemeMode];
