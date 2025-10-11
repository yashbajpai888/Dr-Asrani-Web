/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dental: {
          primary: '#1E88E5',    // Professional blue
          secondary: '#00ACC1',  // Teal accent
          accent: '#4FC3F7',     // Light blue
          light: '#E3F2FD',      // Very light blue
          dark: '#0D47A1',       // Dark blue
          white: '#FFFFFF',
          gray: '#F5F7FA',
          text: '#2D3748',
          success: '#4CAF50',    // Green for success messages
          warning: '#FF9800',    // Orange for warnings
          danger: '#F44336',     // Red for errors
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Roboto Slab', 'serif'],
      },
      boxShadow: {
        'dental': '0 4px 6px rgba(30, 136, 229, 0.1), 0 2px 4px rgba(30, 136, 229, 0.06)',
        'dental-lg': '0 10px 15px rgba(30, 136, 229, 0.1), 0 4px 6px rgba(30, 136, 229, 0.05)',
      },
      borderRadius: {
        'dental': '0.75rem',
      },
    },
  },
  plugins: [],
}
