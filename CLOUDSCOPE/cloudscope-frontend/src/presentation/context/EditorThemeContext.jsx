import React, { createContext, useContext, useState } from 'react';

export const EditorThemeContext = createContext({
  theme: 'light',
  isDark: false,
  isLight: true,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function EditorThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('cs_editor_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('cs_editor_theme', newTheme);
    } catch {
      // Ignorar
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return (
    <EditorThemeContext.Provider value={{ theme, isDark, isLight, setTheme, toggleTheme }}>
      {children}
    </EditorThemeContext.Provider>
  );
}

export function useEditorTheme() {
  return useContext(EditorThemeContext);
}