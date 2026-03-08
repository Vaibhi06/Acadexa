import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem('appTheme');
        return stored || 'light';
    });

    // Apply theme to document when it changes
    useEffect(() => {
        localStorage.setItem('appTheme', theme);

        // Remove all theme classes
        document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-pink');

        // Add current theme class
        document.documentElement.classList.add(`theme-${theme}`);

        // Apply CSS variables based on theme
        const root = document.documentElement;

        if (theme === 'dark') {
            root.style.setProperty('--bg-primary', '#0f172a');
            root.style.setProperty('--bg-secondary', '#1e293b');
            root.style.setProperty('--bg-card', '#1e293b');
            root.style.setProperty('--text-primary', '#f1f5f9');
            root.style.setProperty('--text-secondary', '#94a3b8');
            root.style.setProperty('--border-color', '#334155');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
        } else if (theme === 'pink') {
            root.style.setProperty('--bg-primary', '#fff5f7');
            root.style.setProperty('--bg-secondary', '#fef1f4');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--border-color', '#fecdd3');
            root.style.setProperty('--shadow-color', 'rgba(254, 163, 190, 0.15)');
        } else {
            // Light theme (default)
            root.style.setProperty('--bg-primary', '#f8fafc');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--text-primary', '#1e293b');
            root.style.setProperty('--text-secondary', '#64748b');
            root.style.setProperty('--border-color', '#e2e8f0');
            root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.08)');
        }
    }, [theme]);

    const value = {
        theme,
        setTheme,
        isDark: theme === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
