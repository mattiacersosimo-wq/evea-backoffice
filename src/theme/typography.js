import { pxToRem, responsiveFontSizes } from "../utils/getFontValue";

// ----------------------------------------------------------------------

// const FONT_PRIMARY = "Outfit, sans-serif"; 
const FONT_PRIMARY = "Figtree, sans-serif"; 



// font-family: "noto_sanssemibold";

// const FONT_SECONDARY = 'CircularStd, sans-serif'; // Local Font
  
const typography = (isLight) => {
  return {
    fontFamily: FONT_PRIMARY,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      lineHeight: 80 / 64,
      fontSize: pxToRem(40),
      letterSpacing: 2,
      ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
    },
    h2: {
      fontWeight: 700,
      lineHeight: 64 / 48,
      fontSize: pxToRem(32),
      ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(24),
      ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(20),
      ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
    },
    h5: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(18),
      ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
    },
    h6: {
      fontWeight: 700,
      lineHeight: 28 / 18,
      fontSize: pxToRem(17),
      ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 1.5,
      fontSize: pxToRem(16),
    },
    subtitle2: {
      fontWeight: 400,
      lineHeight: 22 / 16,
      fontSize: pxToRem(16),
      color: isLight ? "#59657e" : "#e3e5f3",
    },
    subtitle3: {
      color: isLight ? "#8C95A7" : "#a0aabe",
    },
    countText: {
      color: isLight ? "#575f70" : "#e3e3e3",
      fontSize: pxToRem(21),
      fontWeight: 700,
    },
    body1: {
      lineHeight: 1.5,
      fontSize: pxToRem(16),
    },
    body2: {
      lineHeight: 22 / 14,
      fontSize: pxToRem(14),
    },
    caption: {
      lineHeight: 1.5,
      fontSize: pxToRem(12),
      fontWeight: 300,
    },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(12),
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 700,
      lineHeight: 24 / 14,
      fontSize: pxToRem(14),
      textTransform: "capitalize",
    },
  };
};

export default typography;
