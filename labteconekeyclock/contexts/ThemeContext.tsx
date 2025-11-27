"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'BG_LIGHT' | 'BG_DARK';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Ler o tema que já foi aplicado pelo script inline (sessionStorage ou env var)
    if (typeof window !== 'undefined') {
      const cachedTheme = sessionStorage.getItem('userTheme') as Theme | null;
      if (cachedTheme === 'BG_LIGHT' || cachedTheme === 'BG_DARK') {
        return cachedTheme;
      }
    }

    // Fallback para env var
    const envTheme = (process.env.NEXT_PUBLIC_DEFAULT_THEME as Theme | undefined) || undefined;
    if (envTheme === 'BG_LIGHT' || envTheme === 'BG_DARK') {
      return envTheme;
    }

    // Padrão
    return 'BG_LIGHT';
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Evita aplicar tema antes da montagem
    
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'BG_DARK') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
      // Salvar no sessionStorage para evitar flash na próxima navegação/reload
      sessionStorage.setItem('userTheme', theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'BG_LIGHT' ? 'BG_DARK' : 'BG_LIGHT');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Variável preparada para envio ao backend (futura implementação)
export const sendThemeToBackend = async (theme: Theme, userId?: string) => {
  // TODO: Implementar quando API estiver disponível
  console.log('Tema a ser enviado para o backend:', { theme, userId });
  
  // Estrutura do payload que será enviado:
  const payload = {
    theme,
    userId,
    timestamp: new Date().toISOString()
  };
  
  
  return payload;
};