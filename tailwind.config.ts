import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    'formkit.theme.ts'
  ],
  theme: {
    fontFamily: {
      'dance': ['Dancing Script'],
      'oswald': ['Oswald'],
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Poppins fallback', ...defaultTheme.fontFamily.sans],
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}