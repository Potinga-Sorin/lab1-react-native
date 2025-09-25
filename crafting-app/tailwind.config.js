export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        farm: {
          bg: "#f6f7f4",
          panel: "#ffffff",
          line: "#e6e8eb",
          ink: "#24323f",
          muted: "#6b7a89",
          accent: "#22c55e",
          warn: "#ef4444"
        }
      },
      boxShadow: { soft: "0 1px 2px rgba(0,0,0,.04)" }
    }
  },
  plugins: []
};