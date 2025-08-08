/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add your custom fonts here
        // Example: 'custom': ['YourFontName', 'fallback-font', 'sans-serif'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
      }
    },
  },
  plugins: []
}
