import findCacheDir from 'find-cache-dir';

export const cacheDir = findCacheDir({ name: 'auto-rebuild-dll-plugin' });