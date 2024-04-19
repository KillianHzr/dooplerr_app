/** @type {import('tailwindcss').Config} */
export default {
  content: ["./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        bleu: {
          one: "#1D2549",
          two: "#252C5C",
          three: "#323D75",
        },
        violet: {
          one: "#6735B7",
          two: "#3E226B",
        },
        snow: "#FDFDFF",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
