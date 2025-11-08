/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F9F9F9",   // fond du mockup
        ink: "#0F172A",  // texte foncé
        mute: "#6B7280", // gris labels/sous-titres
        card: "#FFFFFF", // pills
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        pill: "0 1px 0 rgba(0,0,0,0.03), inset 0 0 0 1px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        pill: "9999px",
      }
    },
  },
  plugins: [],
};
