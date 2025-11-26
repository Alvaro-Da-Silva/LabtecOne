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
    // Prioriza variável de ambiente `NEXT_PUBLIC_DEFAULT_THEME`, depois localStorage
    const envTheme = (process.env.NEXT_PUBLIC_DEFAULT_THEME as Theme | undefined) || undefined;
    if (envTheme === 'BG_LIGHT' || envTheme === 'BG_DARK') {
      return envTheme;
    }

    // Inicializa com o tema salvo no localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      return savedTheme || 'BG_LIGHT';
    }
    return 'BG_LIGHT';
  });

  useEffect(() => {
    // Aplica ou remove a classe 'dark' no documentElement (padrão Tailwind)
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'BG_DARK') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
      // Persiste no localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

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
  
  // Aqui seria feita a chamada para a API:
  // const response = await fetch('/api/user/theme', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // });
  
  return payload;
};