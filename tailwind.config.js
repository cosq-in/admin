/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "goth-bg": "#030206",
        "goth-surface": "#0c0614",
        "goth-panel": "#160a26",
        "goth-purple": "#8b5cf6",
        "goth-pink": "#ff49db",
        "goth-cyan": "#00f0ff",
        "goth-text": "#eae8f5",
        "goth-dim": "#9790b0",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mono: ['"VT323"', "monospace"],
      },
    },
  },
  plugins: [],
};
