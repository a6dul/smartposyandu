import formsPlugin from '@tailwindcss/forms';
import containerQueriesPlugin from '@tailwindcss/container-queries';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-background": "#121c28", "on-surface": "#121c28", "secondary": "#0060ac",
        "tertiary": "#95414a", "surface-container": "#e5eeff", "primary-container": "#268456",
        "surface-tint": "#006d42", "surface-container-lowest": "#ffffff", "primary-fixed": "#9af6be",
        "outline-variant": "#bec9bf", "surface-container-high": "#dfe9fa", "tertiary-fixed": "#ffdadb",
        "on-tertiary-fixed-variant": "#7b2c36", "on-tertiary-fixed": "#40000e",
        "secondary-fixed-dim": "#a4c9ff", "background": "#f8f9ff", "on-surface-variant": "#3f4941",
        "on-primary-fixed": "#002110", "inverse-surface": "#27313e", "tertiary-container": "#b45861",
        "error": "#ba1a1a", "outline": "#6f7a71", "inverse-primary": "#7ed9a3",
        "on-primary-fixed-variant": "#005230", "surface-container-highest": "#d9e3f4",
        "error-container": "#ffdad6", "on-tertiary-container": "#fffbff", "on-error": "#ffffff",
        "on-secondary-fixed-variant": "#004883", "secondary-container": "#68abff",
        "on-secondary": "#ffffff", "surface": "#f8f9ff", "on-secondary-fixed": "#001c39",
        "surface-container-low": "#eef4ff", "on-primary": "#ffffff", "surface-dim": "#d1dbec",
        "surface-bright": "#f8f9ff", "surface-variant": "#d9e3f4", "primary": "#006a40",
        "inverse-on-surface": "#eaf1ff", "on-tertiary": "#ffffff", "tertiary-fixed-dim": "#ffb2b7",
        "secondary-fixed": "#d4e3ff", "on-secondary-container": "#003e73",
        "on-error-container": "#93000a", "on-primary-container": "#f6fff5",
        "primary-fixed-dim": "#7ed9a3"
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
      spacing: {
        "touch-target-min": "56px", "margin-page": "2rem", "gutter-md": "1.5rem", "stack-gap": "1rem"
      },
      fontFamily: {
        "button-text": ["Atkinson Hyperlegible Next"], "label-lg": ["Atkinson Hyperlegible Next"],
        "headline-md": ["Atkinson Hyperlegible Next"], "body-md": ["Atkinson Hyperlegible Next"],
        "body-lg": ["Atkinson Hyperlegible Next"], "headline-lg": ["Atkinson Hyperlegible Next"]
      },
      fontSize: {
        "button-text": ["14px", {"lineHeight": "20px", "fontWeight": "700"}],
        "label-lg": ["14px", {"lineHeight": "20px", "fontWeight": "600"}],
        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "700"}],
        "body-md": ["14px", {"lineHeight": "22px", "fontWeight": "400"}],
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-lg": ["28px", {"lineHeight": "36px", "fontWeight": "700"}]
      }
    },
  },
  plugins: [
    formsPlugin,
    containerQueriesPlugin,
  ],
}
