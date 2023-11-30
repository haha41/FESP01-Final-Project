/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { suit: ["SUIT Variable"] },
    },
    screens: {
      // 데스크탑
      lgpc: { min: "1281px", max: "1920px" },
      pc: { min: "1025px", max: "1280px" },
      // 테블릿
      tb: { min: "768px", max: "1024px" },
      // 모바일
      mo: { max: "767px", min: "320px" },
    },
  },
  plugins: [],
}
