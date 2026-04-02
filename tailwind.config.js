/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d8e9ff",
          200: "#b9d7ff",
          300: "#86bbff",
          400: "#4a93ff",
          500: "#1d6fff",
          600: "#0b56db",
          700: "#0d46ae",
          800: "#123d8c",
          900: "#15356f"
        },
        ink: "#070b14",
        surface: "#0f1726",
        card: "#131d31",
        line: "#22304a"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(74,147,255,0.18), 0 24px 80px rgba(7,11,20,0.45)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(29,111,255,0.18), transparent 30%), radial-gradient(circle at 80% 20%, rgba(56,189,248,0.10), transparent 22%), linear-gradient(135deg, rgba(255,255,255,0.02) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,0.02) 25%, transparent 25%)"
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
      }
    }
  },
  plugins: []
};
