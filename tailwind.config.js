const theme = require("./theme.json");
const tailpress = require("@jeffreyvr/tailwindcss-tailpress");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.php",
    "./**/*.php",
    "./blocks/**/*.php",
    "./resources/css/*.css",
    "./resources/js/*.js",
    "./safelist.txt",
  ],
  theme: {
    container: false,
    extend: {
      colors: tailpress.colorMapper(
        tailpress.theme("settings.color.palette", theme)
      ),
      boxShadow: {
        header: "0px 12px 20px 0px rgba(78, 88, 108, 0.05)",
        cusCard: "0px 0px 25px 0px rgba(66, 109, 169, 0.15)",
        img: "0px 0px 25px 0px rgba(66, 109, 169, 0.15);"
      },
      content: {
        'maskIcon': 'url("../../public/images/home-category/hkchc-mask-green.png")',
        'maskIconGreen': 'url("../../public/images/home-category/hkchc-mask-green.png")',
      },
      backgroundSize: {
        '100%': '100%'
      }
    },
    screens: {
      xs: tailpress.theme("settings.layout.xs", theme),
      sm: tailpress.theme("settings.layout.sm", theme),
      md: tailpress.theme("settings.layout.md", theme),
      lg: tailpress.theme("settings.layout.lg", theme),
      xl: tailpress.theme("settings.layout.xl", theme),
      "2xl": tailpress.theme("settings.layout.2xl", theme),
      "3xl": tailpress.theme("settings.layout.3xl", theme),
      "4xl": tailpress.theme("settings.layout.4xl", theme),
      "5xl": tailpress.theme("settings.layout.5xl", theme),
      "6xl": tailpress.theme("settings.layout.6xl", theme),
      "4k": tailpress.theme("settings.layout.4k", theme),
    },
  },
  plugins: [tailpress.tailwind],
};
