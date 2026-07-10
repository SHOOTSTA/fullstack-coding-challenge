export const theme = {
  colors: {
    background: '#F6F8FB',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    text: '#1B2430',
    textMuted: '#5B6472',
    primary: '#E63946',
    primaryDark: '#C1121F',
    secondary: '#1D3557',
    accent: '#457B9D',
    success: '#2A9D8F',
    warning: '#FFB703',
    danger: '#E63946',
    ambulanceBg: '#FFF1F0',
    doctorBg: '#EEF4FB',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  shadow: {
    card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.08)',
    modal: '0 10px 40px rgba(16, 24, 40, 0.25)',
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1080px',
  },
} as const

export type AppTheme = typeof theme
