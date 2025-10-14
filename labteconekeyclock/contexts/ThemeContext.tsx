"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Inicializa com valor do localStorage se disponível
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
      }
    }
    return 'light'; // Valor padrão
  });

  useEffect(() => {
    // Aplica ou remove a classe 'dark' no documentElement
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Salva no localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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