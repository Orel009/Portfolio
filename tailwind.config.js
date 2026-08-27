/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        // `accent` is decorative/text-only (4.99:1 on bg-primary, fails AA
        // as a background under white button text at 4.00:1) — buttons use
        // the darker accent-hover/active/pressed ladder instead, each
        // verified >=4.5:1 with white text. See RENOVATION_REPORT.md.
        accent: "#915eff",
        "accent-hover": "#7c4bdb",
        "accent-active": "#6c3fc7",
        "accent-pressed": "#5c33ad",
        "accent-soft": "#dfd9ff",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
        glow: "0px 0px 30px 0px rgba(145, 94, 255, 0.35)",
      },
      screens: {
        xxs: "380px",
        xs: "450px",
      },
      spacing: {
        gutter: "clamp(1.25rem, 4vw, 4rem)",
        "section-y": "clamp(2.5rem, 6vw, 6rem)",
      },
      fontSize: {
        "fluid-h1": ["clamp(2rem, 1.1rem + 4.2vw, 5rem)", { lineHeight: "1.15" }],
        "fluid-h2": ["clamp(1.75rem, 1.2rem + 2.6vw, 3.75rem)", { lineHeight: "1.2" }],
        "fluid-lead": ["clamp(1rem, 0.85rem + 0.7vw, 1.375rem)", { lineHeight: "1.6" }],
        "fluid-body": ["clamp(0.9375rem, 0.875rem + 0.25vw, 1.0625rem)", { lineHeight: "1.7" }],
        "fluid-label": ["clamp(0.8125rem, 0.78rem + 0.15vw, 0.9375rem)", { lineHeight: "1.5" }],
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};
