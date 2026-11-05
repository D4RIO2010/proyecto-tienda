/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669', // Verde Nexa
          hover: '#047857',
          light: '#d1fae5',
        },
        neutral: {
          dark: '#0F172A', // Grafito oscuro
          surface: '#1E293B', // Grafito intermedio
        },
        text: {
          body: '#334155',
          title: '#0F172A',
        },
        surface: '#F8FAFC',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
