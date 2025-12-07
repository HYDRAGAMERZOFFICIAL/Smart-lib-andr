import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import Layout from '@/layouts/Layout';

const appName = 'Smart Library';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    const pages = import.meta.glob<{ default: React.ComponentType }>('./pages/**/*.tsx', { eager: true });
    return pages[`./pages/${name}.tsx`]?.default;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4f46e5',
  },
});
