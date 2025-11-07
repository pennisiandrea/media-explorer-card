export function saveOnCache(cacheItem,data) {
    /* data must be something lik:
    const data = {
        version: this.version,
        rootItem: this.rootItem,
    } */
    localStorage.setItem(cacheItem, JSON.stringify(data));
}

export function getCachedData(cacheItem) {
    const json = localStorage.getItem(cacheItem);
    if (!json) return null; // No cache found
    
    try {
      const data = JSON.parse(json);

      return data;
    }
    catch (err) { // An error occured -> clear the cache!
      console.warn("Error reading cache:", err);
      clearCache(cacheItem);
      return null;
    }
}

export function clearCache(cacheItem) {
    localStorage.removeItem(cacheItem);
    console.warn("Version changed -> cache cleared");
}