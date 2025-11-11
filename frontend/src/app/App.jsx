import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useTheme } from '../hooks/useTheme';
import { ToastProvider } from '../contexts/ToastContext';

function App() {
  const { initializeTheme } = useTheme();
  
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
