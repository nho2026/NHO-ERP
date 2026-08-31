/** Nadir Health Organization color tokens. CSS equivalents live in index.css. */
export const brandColors = {
  blue: "#0093ef",
  blueDark: "#008cff",
  blueLight: "#E8F3FB",
  teal: "#20B4B8",
  tealDark: "#168C90",
  tealLight: "#E5F8F8",
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
    primaryHover: "#064E87",
    primaryPressed: "#043D6B",
    primarySubtle: brandColors.blueLight,
    onPrimary: "#FFFFFF",
    secondary: brandColors.teal,
    secondaryHover: "#199DA1",
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
    primary: "#58A9E3",
    primaryHover: "#75B9E8",
    primaryPressed: "#91C8ED",
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
      link: "#75C7F2",
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
