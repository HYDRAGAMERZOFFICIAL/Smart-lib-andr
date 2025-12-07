export default {
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#FF6B6B',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
