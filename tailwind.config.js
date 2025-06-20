/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',   // Mobile: < 640px (default)
      'md': '768px',   // Tablet: 640px - 768px  
      'lg': '1024px',  // Desktop: 768px - 1024px
      'xl': '1280px',  // Large Desktop: > 1024px
      '2xl': '1536px',
    },
    extend: {
      textShadow: {
        'lg': '0 10px 15px rgba(0, 0, 0, 0.5)',
      },
      spacing: {
        'touch': '44px',  // 最小タッチターゲット
        'touch-lg': '48px', // 理想的なタッチターゲット
      },
      fontSize: {
        'mobile-body': ['16px', '24px'],  // モバイル本文
        'mobile-button': ['18px', '24px'], // モバイルボタン
      },
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      }
    },
  },
  plugins: [],
}