/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kalameh: ["Kalameh", "Vazirmatn", "system-ui", "sans-serif"],
        sans: ["Kalameh", "Vazirmatn", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#ef394e",
          600: "#e11d48",
          700: "#be123c",
        },
      },
    },
  },
  plugins: [],
};
