/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'class',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './utils/**/*.{html,js,jsx,ts,tsx,mdx}',
    './*.{html,js,jsx,ts,tsx,mdx}',
    './src/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  safelist: [
    {
      pattern:
        /(bg|border|text|stroke|fill)-(primary|secondary|tertiary|error|success|warning|info|typography|outline|background|indicator)-(0|50|100|200|300|400|500|600|700|800|900|950|white|gray|black|error|warning|muted|success|info|light|dark|primary)/,
    },
    // Semantic color patterns
    {
      pattern: /(bg|border|text|stroke|fill)-(primary|interactive|input|alert|neutral)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    // Legacy brand color patterns
    {
      pattern: /(bg|border|text|stroke|fill)-(earthBg|earthForm|earthDark|pinkInput|pinkBorder|pinkHover|blueSelection|blueBorder|blueInfo|redFocus|whiteFocus|stoneDisabled|stoneBorder|stoneText)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // SEMANTIC COLOR SYSTEM - Alicia P Ceramics (EXACT SPECIFICATION ONLY)
        
        // PRIMARY (Brown) - Actions & Text
        primary: {
          50: '#fbfaf9',    // page backgrounds
          100: '#f0e7da',   // form containers  
          800: '#2a1100',   // button pressed states
          900: '#3d1900',   // main text, buttons
        },

        // INTERACTIVE (Blue) - Selection & Information
        interactive: {
          300: 'rgba(189, 201, 203, 0.3)',   // info backgrounds
          400: 'rgba(189, 201, 203, 0.4)',   // selection backgrounds
          500: '#bdc9cb',                     // selection borders
        },

        // INPUT (Pink) - Form States
        input: {
          300: 'rgba(225, 175, 161, 0.25)',  // option backgrounds
          400: 'rgba(225, 175, 161, 0.4)',   // input backgrounds
          500: '#e1afa1',                     // input borders
        },

        // ALERT (Red) - Focus & Urgency
        alert: {
          600: '#d62411',   // required fields, errors
        },

        // NEUTRAL (Gray) - Support
        neutral: {
          50: '#ffffff',    // white
          200: '#e8ecee',   // borders
          600: '#a4b4b7',   // disabled text
        },
      },
      fontFamily: {
        // Alicia P Ceramics Typography System
        brand: ['Georgia', 'serif'],          // Brand typography
        heading: ['Inter', 'sans-serif'],     // Headings
        label: ['Inter', 'sans-serif'],       // Labels and UI text
        button: ['Inter', 'sans-serif'],      // Button text
        body: ['Poppins', 'sans-serif'],      // Body text
        
        // Web font variables (if available)
        jakarta: ['var(--font-plus-jakarta-sans)'],
        roboto: ['var(--font-roboto)'],
        code: ['var(--font-source-code-pro)'],
        inter: ['var(--font-inter)'],
        'space-mono': ['var(--font-space-mono)'],
        poppins: ['var(--font-poppins)'],     // If you have Poppins as web font
        georgia: ['var(--font-georgia)'],     // If you have Georgia as web font
      },
      fontWeight: {
        // Alicia P Ceramics Font Weights
        brandLight: '300',        // Brand typography light weight
        headingBold: '700',       // Heading bold weight
        labelSemibold: '600',     // Label and UI semibold
        buttonSemibold: '600',    // Button semibold
        bodyRegular: '400',       // Body text regular
        
        // Standard weights
        extrablack: '950',
      },
      fontSize: {
        '2xs': '10px',
      },
      boxShadow: {
        'hard-1': '-2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-2': '0px 3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-3': '2px 2px 8px 0px rgba(38, 38, 38, 0.20)',
        'hard-4': '0px -3px 10px 0px rgba(38, 38, 38, 0.20)',
        'hard-5': '0px 2px 10px 0px rgba(38, 38, 38, 0.10)',
        'soft-1': '0px 0px 10px rgba(38, 38, 38, 0.1)',
        'soft-2': '0px 0px 20px rgba(38, 38, 38, 0.2)',
        'soft-3': '0px 0px 30px rgba(38, 38, 38, 0.1)',
        'soft-4': '0px 0px 40px rgba(38, 38, 38, 0.1)',
      },
    },
  },
};
