/**
 * Wordo Design System — Apple Pages-Inspired Theme Tokens (Pass 1: Foundation)
 * Centralized theme tokens for light and dark modes, typography, borders, shadows, radii and spacing.
 */

export interface ThemeColors {
  appBg: string;
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  surfaceFloating: string;
  surfaceModal: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderColor: string;
  borderSubtle: string;
  hoverBg: string;
  activeBg: string;
  selectionBg: string;
  accent: string;
  accentHover: string;
  accentSubtle: string;
  destructive: string;
  destructiveHover: string;
  destructiveSubtle: string;
  success: string;
  successHover: string;
  successSubtle: string;
  warning: string;
}

export const lightThemeTokens: ThemeColors = {
  appBg: '#F5F5F7',
  surfacePrimary: '#FFFFFF',
  surfaceSecondary: '#F2F2F5',
  surfaceTertiary: '#E8E8ED',
  surfaceFloating: '#FFFFFF',
  surfaceModal: '#FFFFFF',
  textPrimary: '#1D1D1F',
  textSecondary: '#6E6E73',
  textMuted: '#86868B',
  borderColor: '#D2D2D7',
  borderSubtle: 'rgba(0, 0, 0, 0.06)',
  hoverBg: '#EBEBEF',
  activeBg: '#E1E1E6',
  selectionBg: '#DCE8FA',
  accent: '#007AFF',
  accentHover: '#0062CC',
  accentSubtle: 'rgba(0, 122, 255, 0.10)',
  destructive: '#FF3B30',
  destructiveHover: '#D70015',
  destructiveSubtle: 'rgba(255, 59, 48, 0.10)',
  success: '#30A46C',
  successHover: '#2B9360',
  successSubtle: 'rgba(48, 164, 108, 0.10)',
  warning: '#FF9500',
};

export const darkThemeTokens: ThemeColors = {
  appBg: '#1C1C1E',
  surfacePrimary: '#242426',
  surfaceSecondary: '#2C2C2E',
  surfaceTertiary: '#38383A',
  surfaceFloating: '#2A2A2D',
  surfaceModal: '#28282B',
  textPrimary: '#F5F5F7',
  textSecondary: '#A1A1A6',
  textMuted: '#86868B',
  borderColor: '#3A3A3C',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  hoverBg: '#353538',
  activeBg: '#3E3E42',
  selectionBg: '#263D5C',
  accent: '#0A84FF',
  accentHover: '#409CFF',
  accentSubtle: 'rgba(10, 132, 255, 0.15)',
  destructive: '#FF453A',
  destructiveHover: '#FF6961',
  destructiveSubtle: 'rgba(255, 69, 58, 0.15)',
  success: '#30D158',
  successHover: '#34C759',
  successSubtle: 'rgba(48, 209, 88, 0.15)',
  warning: '#FF9F0A',
};

export const typographyTokens = {
  fontFamilyUi: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  fontFamilyMono: 'ui-monospace, "SF Mono", "Cascadia Code", "Consolas", Menlo, monospace',
  sizes: {
    '2xs': '0.625rem',  /* 10px */
    xs: '0.6875rem',   /* 11px */
    sm: '0.75rem',     /* 12px */
    base: '0.8125rem', /* 13px */
    md: '0.875rem',    /* 14px */
    lg: '1rem',        /* 16px */
    xl: '1.125rem',    /* 18px */
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.35,
    normal: 1.5,
  },
} as const;

export const radiiTokens = {
  xs: '4px',
  sm: '6px',    /* Small controls */
  md: '8px',    /* Standard controls */
  lg: '10px',   /* Panels & popovers */
  xl: '14px',   /* Dialogs & modals */
  '2xl': '18px',
  full: '9999px',
} as const;

export const spacingTokens = {
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
} as const;

export const sizingTokens = {
  controlHeightSm: '24px',
  controlHeightMd: '28px',
  controlHeightLg: '32px',
  titlebarHeight: '38px',
  menubarHeight: '28px',
  statusbarHeight: '24px',
  iconSm: '14px',
  iconMd: '16px',
  iconLg: '18px',
} as const;
