import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSettings, updateSettings } from '../services/storage';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadSettings = useCallback(() => {
        try {
            const savedSettings = getSettings();
            setSettings(savedSettings);

            // Apply theme colors to CSS variables
            if (savedSettings.primaryColor) {
                document.documentElement.style.setProperty('--color-primary', savedSettings.primaryColor);
            }
            if (savedSettings.secondaryColor) {
                document.documentElement.style.setProperty('--color-secondary', savedSettings.secondaryColor);
            }

            // Update favicon if set
            if (savedSettings.favicon) {
                const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = savedSettings.favicon;
                document.getElementsByTagName('head')[0].appendChild(link);
            }

            // Update page title
            if (savedSettings.siteName) {
                document.title = `${savedSettings.siteName} - ${savedSettings.tagline || 'Luxury Skincare'}`;
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading settings:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const updateSiteSettings = (updates) => {
        try {
            const newSettings = updateSettings(updates);
            setSettings(newSettings);

            // Apply theme colors
            if (updates.primaryColor) {
                document.documentElement.style.setProperty('--color-primary', updates.primaryColor);
            }
            if (updates.secondaryColor) {
                document.documentElement.style.setProperty('--color-secondary', updates.secondaryColor);
            }

            // Update favicon
            if (updates.favicon) {
                const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = updates.favicon;
                document.getElementsByTagName('head')[0].appendChild(link);
            }

            // Update page title
            if (updates.siteName || updates.tagline) {
                document.title = `${newSettings.siteName} - ${newSettings.tagline || 'Luxury Skincare'}`;
            }

            return newSettings;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    };

    const value = {
        settings,
        loading,
        updateSettings: updateSiteSettings,
        reloadSettings: loadSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
