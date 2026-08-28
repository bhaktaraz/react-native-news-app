/**
 * Design tokens for the app. Every colour used in a screen comes from here so
 * the light/dark switch is a single swap rather than a per-component override.
 */

export const palette = {
  brand: "#c8102e",
  brandDark: "#9b0c23",
  brandSoft: "#fdecef",
  brandSoftDark: "#3a1119",
  accent: "#1565c0",
};

export interface Theme {
  dark: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    borderStrong: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    brand: string;
    brandSoft: string;
    onBrand: string;
    accent: string;
    skeleton: string;
    overlay: string;
    shadow: string;
  };
}

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: "#f4f5f7",
    surface: "#ffffff",
    surfaceAlt: "#fafbfc",
    border: "#e8eaed",
    borderStrong: "#d3d6db",
    text: "#14181f",
    textSecondary: "#4a525e",
    textMuted: "#7b838f",
    brand: palette.brand,
    brandSoft: palette.brandSoft,
    onBrand: "#ffffff",
    accent: palette.accent,
    skeleton: "#e4e7eb",
    overlay: "rgba(0,0,0,0.55)",
    shadow: "#000000",
  },
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: "#0e1116",
    surface: "#171b22",
    surfaceAlt: "#1e232b",
    border: "#262c36",
    borderStrong: "#39414d",
    text: "#eef1f5",
    textSecondary: "#b3bac4",
    textMuted: "#828b97",
    brand: "#f0455f",
    brandSoft: palette.brandSoftDark,
    onBrand: "#ffffff",
    accent: "#5da2f5",
    skeleton: "#232932",
    overlay: "rgba(0,0,0,0.7)",
    shadow: "#000000",
  },
};

/**
 * Devanagari sits lower and taller than Latin, so line heights are set well
 * above the usual 1.4x to keep matras and the shirorekha from colliding.
 */
export const typography = {
  hero: { fontSize: 22, lineHeight: 34, fontWeight: "700" as const },
  title: { fontSize: 17, lineHeight: 27, fontWeight: "700" as const },
  titleSmall: { fontSize: 15, lineHeight: 24, fontWeight: "600" as const },
  body: { fontSize: 16, lineHeight: 28 },
  meta: { fontSize: 12, lineHeight: 18, fontWeight: "500" as const },
  label: { fontSize: 13, lineHeight: 20, fontWeight: "600" as const },
  sectionTitle: { fontSize: 18, lineHeight: 28, fontWeight: "700" as const },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};
