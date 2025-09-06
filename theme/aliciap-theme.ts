import { createConfig } from "@gluestack-ui/themed";

export const aliciapCeramicsTheme = createConfig({
  tokens: {
    colors: {
      // Primary earth colors from your design system
      earthBg: "#fbfaf9",
      earthForm: "#f0e7da",
      earthDark: "#3d1900",

      // Pink input system - exact from your design system
      pinkInput: "rgba(225, 175, 161, 0.4)",
      pinkBorder: "#e1afa1",
      pinkHover: "rgba(225, 175, 161, 0.25)",

      // Blue selection system - exact from your design system
      blueSelection: "rgba(189, 201, 203, 0.4)",
      blueBorder: "#bdc9cb",
      blueInfo: "rgba(189, 201, 203, 0.3)",

      // Red focus/active - exact from your design system
      redFocus: "#d62411",

      // Utility colors - exact from your design system
      whiteFocus: "rgba(255, 255, 255, 0.95)",
      stoneDisabled: "#f1f3f4",
      stoneBorder: "#e8ecee",
      stoneText: "#a4b4b7", // Disabled text
    },
    fonts: {
      // Typography system from your design system
      brand: "Georgia",
      heading: "Inter",
      label: "Inter",
      button: "Inter",
      body: "Poppins", // Body text (Poppins Regular)
    },
    fontWeights: {
      // Font weights from your design system
      brandLight: "300",
      headingBold: "700",
      labelSemibold: "600",
      buttonSemibold: "600",
      bodyRegular: "400", // Body text (Poppins Regular)
    },
    letterSpacings: {
      // Letter spacing from your design system
      brand: "2px",
      heading: "0.5px",
      label: "0.3px",
      button: "0.5px", // Buttons
    },
    radii: {
      // Border radius values from your design system
      sm: "8px",
      md: "12px",
      lg: "14px",
      xl: "16px",
      xxl: "20px",
      full: "24px",
    },
    space: {
      // Spacing values for consistent layout
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "20px",
      xxl: "24px",
      xxxl: "32px",
    },
  },
  aliases: undefined,
});
