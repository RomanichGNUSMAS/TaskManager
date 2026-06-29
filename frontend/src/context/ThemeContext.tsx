import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetMeQuery } from "../features/auth/authApi";

type Theme = "dark" | "white" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useGetMeQuery();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (data?.settings.appearance) {
      setTheme(data.settings.appearance as Theme);
      applyTheme(data.settings.appearance as Theme);
    }
  }, [data?.settings.appearance]);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;
    
    if (selectedTheme === "dark") {
      root.setAttribute("data-theme", "dark");
      root.style.setProperty("--bg-primary", "rgb(15, 23, 42)");
      root.style.setProperty("--bg-secondary", "rgba(30, 41, 59, 0.8)");
      root.style.setProperty("--text-primary", "rgb(255, 255, 255)");
      root.style.setProperty("--text-secondary", "rgb(148, 163, 184)");
      root.style.setProperty("--border-color", "rgba(71, 85, 105, 0.7)");
      root.style.setProperty("--accent-color", "rgb(6, 182, 212)");
    } else if (selectedTheme === "white") {
      root.setAttribute("data-theme", "white");
      root.style.setProperty("--bg-primary", "rgb(255, 255, 255)");
      root.style.setProperty("--bg-secondary", "rgba(241, 245, 249, 0.9)");
      root.style.setProperty("--text-primary", "rgb(15, 23, 42)");
      root.style.setProperty("--text-secondary", "rgb(100, 116, 139)");
      root.style.setProperty("--border-color", "rgba(226, 232, 240, 0.7)");
      root.style.setProperty("--accent-color", "rgb(6, 182, 212)");
    } else if (selectedTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "white");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
