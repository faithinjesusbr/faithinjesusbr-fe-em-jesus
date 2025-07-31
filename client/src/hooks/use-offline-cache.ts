import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface CachedVerse {
  date: string;
  verseText: string;
  verseReference: string;
  cachedAt: string;
}

export function useOfflineCache() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedVerses, setCachedVerses] = useState<CachedVerse[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached verses from localStorage
    loadCachedVerses();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedVerses = () => {
    try {
      const cached = localStorage.getItem('cachedVerses');
      if (cached) {
        setCachedVerses(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading cached verses:', error);
    }
  };

  const saveCachedVerse = (verse: CachedVerse) => {
    try {
      const updated = [...cachedVerses.filter(v => v.date !== verse.date), verse];
      setCachedVerses(updated);
      localStorage.setItem('cachedVerses', JSON.stringify(updated));
      
      // Also save to server if online
      if (isOnline) {
        apiRequest('POST', '/api/verse-cache', verse).catch(console.error);
      }
    } catch (error) {
      console.error('Error saving cached verse:', error);
    }
  };

  const getCachedVerse = (date: string): CachedVerse | null => {
    return cachedVerses.find(v => v.date === date) || null;
  };

  const getTodaysVerse = async (date: string) => {
    // First try to get from cache
    const cached = getCachedVerse(date);
    if (cached) {
      return cached;
    }

    // If online, fetch from API and cache
    if (isOnline) {
      try {
        const response = await apiRequest('GET', '/api/verses/daily');
        const verse = await response.json();
        
        const cacheData: CachedVerse = {
          date,
          verseText: verse.text,
          verseReference: verse.reference,
          cachedAt: new Date().toISOString()
        };
        
        saveCachedVerse(cacheData);
        return cacheData;
      } catch (error) {
        console.error('Error fetching daily verse:', error);
        // Fall back to any cached verse if API fails
        return cachedVerses.length > 0 ? cachedVerses[0] : null;
      }
    }

    // If offline, return the most recent cached verse
    return cachedVerses.length > 0 ? cachedVerses[0] : null;
  };

  const clearOldCache = (daysToKeep: number = 7) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const filtered = cachedVerses.filter(verse => 
        new Date(verse.cachedAt) > cutoffDate
      );
      
      setCachedVerses(filtered);
      localStorage.setItem('cachedVerses', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  };

  return {
    isOnline,
    cachedVerses,
    saveCachedVerse,
    getCachedVerse,
    getTodaysVerse,
    clearOldCache
  };
}