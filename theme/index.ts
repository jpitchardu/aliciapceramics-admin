import { createTheme } from "@shopify/restyle";

// Alicia P Ceramics Restyle Theme - Based on actual semantic color system and typography
export const theme = createTheme({
  colors: {
    // SEMANTIC COLOR SYSTEM - Exact match from Tailwind config

    // PRIMARY (Brown) - Actions & Text
    primary50: "#fbfaf9", // Existing - lightest background
    primary100: "#f0e7da", // Existing - form containers
    primary300: "#d8c0a4", // Borders
    primary500: "#a3784e", // Accents
    primary700: "#583d26", // Secondary text
    primary800: "#2a1100", // Existing - pressed states
    primary900: "#3d1900", // Existing - main text

    // INTERACTIVE (Blue) - Selection & Information
    interactive300: "rgba(189, 201, 203, 0.3)", // info backgrounds
    interactive400: "rgba(189, 201, 203, 0.4)", // selection backgrounds
    interactive500: "#bdc9cb", // selection borders

    // INPUT (Pink) - Form States
    input300: "rgba(225, 175, 161, 0.25)", // option backgrounds
    input400: "rgba(225, 175, 161, 0.4)", // input backgrounds
    input500: "#e1afa1", // input borders

    // ALERT (Red) - Focus & Urgency
    alert600: "#d62411", // required fields, errors

    // NEUTRAL (Gray) - Support
    neutral50: "#ffffff", // white
    neutral200: "#e8ecee", // borders
    neutral600: "#a4b4b7", // disabled text
  },

  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadii: {
    s: 8,
    m: 12,
    l: 14, // Standard component border radius
    xl: 16,
  },

  // Typography variants - Only the ones that actually exist in the systems
  textVariants: {
    // Default text variant
    defaults: {
      fontFamily: "Poppins",
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 400,
      color: "primary900",
    }, // ADD THIS - Large Title for iOS native headers
    title: {
      fontFamily: "Inter",
      fontSize: 34, // iOS standard large title size
      lineHeight: 41, // 1.2 ratio for headers
      fontWeight: "700", // Bold like your heading
      color: "primary900",
      letterSpacing: 0.5, // Match your heading letter spacing
      textTransform: "uppercase", // ✅ Match your design system
      // Note: textTransform should NOT be uppercase for large titles
    },

    // Brand typography (Georgia, light, lowercase, wide spacing)
    brand: {
      fontFamily: "Georgia",
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 300, // brandLight from Tailwind
      color: "primary900",
      letterSpacing: 2,
      textTransform: "lowercase",
    },

    // Heading typography (Inter, bold, uppercase)
    heading: {
      fontFamily: "Inter",
      fontSize: 20,
      lineHeight: 28,
      fontWeight: 700, // headingBold from Tailwind
      color: "primary900",
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },

    // Label typography (Inter, semibold, uppercase)
    label: {
      fontFamily: "Inter",
      fontSize: 11,
      lineHeight: 16,
      fontWeight: 600, // labelSemibold from Tailwind
      color: "primary900",
      letterSpacing: 0.3,
      textTransform: "uppercase",
    },

    // Button typography (Inter, semibold, uppercase)
    button: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: 20,
      fontWeight: 600, // buttonSemibold from Tailwind
      color: "neutral50", // White text on dark buttons
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },

    // Body typography (Poppins, regular)
    body: {
      fontFamily: "Poppins",
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 400, // bodyRegular from Tailwind
      color: "primary900", // Brown text
    },
  },

  // Button variants based on semantic spec
  buttonVariants: {
    defaults: {
      borderRadius: "l", // 14px border radius
      paddingVertical: "m", // 16px padding
      paddingHorizontal: "m", // 16px padding
      minHeight: 44, // iOS touch target minimum
      justifyContent: "center",
      alignItems: "center",
    },
    primary: {
      backgroundColor: "primary900", // Dark brown
    },
    primaryPressed: {
      backgroundColor: "primary800", // Darker brown when pressed
    },
    secondary: {
      backgroundColor: "input400", // Pink background
    },
    selected: {
      backgroundColor: "interactive400", // Blue selection
      borderWidth: 2,
      borderColor: "interactive500",
    },
    unselected: {
      backgroundColor: "input300", // Light pink
      borderWidth: 2,
      borderColor: "primary50", // Transparent border (using bg color)
    },
  },

  // Input variants
  inputVariants: {
    defaults: {
      borderRadius: "l", // 14px
      paddingVertical: "m", // 16px
      paddingHorizontal: "m", // 16px
      fontSize: 16, // Prevents iOS zoom
      minHeight: 44, // Touch target
      backgroundColor: "input400",
      color: "primary900", // Brown text
      borderWidth: 2,
      borderColor: "primary50", // Transparent (using bg color)
    },
    focused: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "input500", // Pink border
    },
    error: {
      borderColor: "alert600", // Red border
    },
  },

  // Card variants
  cardVariants: {
    defaults: {
      backgroundColor: "primary100", // Light beige
      borderRadius: "m", // 12px
      padding: "m", // 16px
    },
    surface: {
      backgroundColor: "primary50", // Off-white background
      borderRadius: "m",
      padding: "m",
    },
  },

  breakpoints: {
    phone: 0,
    tablet: 768,
  },
} as const);

export type Theme = typeof theme;
