tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          },
          colors: {
            brand: {
              blue: '#2563eb',
              indigo: '#4f46e5',
              yellow: '#facc15',
              amber: '#f59e0b',
              red: '#ef4444',
              navy: '#0f172a',
            },
          },
          boxShadow: {
            card: '0 12px 32px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -4px rgba(37, 99, 235, 0.06)',
            glowBlue: '0 14px 30px -6px rgba(37, 99, 235, 0.42)',
            glowAmber: '0 14px 30px -6px rgba(245, 158, 11, 0.35)',
          },
        },
      },
    };