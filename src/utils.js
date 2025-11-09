import { openDB } from 'idb';

export class CacheManager {
  #dbName;
  #dbVersion;
  #tableName;

  constructor(dbName,dbVersion,tableName){
    this.#dbName = dbName;
    this.#dbVersion = dbVersion;
    this.#tableName = tableName;
    
    this.#getDB(this.#tableName);
  }

  async saveOnCache(dataKey,data) {
    try {
      const db = await this.#getDB(this.#tableName);
      await db.put(this.#tableName, data, dataKey);
    } catch (err) {
      console.error("Error saving to IndexedDB:", err);
    }
  }
  async getCachedData(dataKey) {
    try {
      const db = await this.#getDB(this.#tableName);
      const data = await db.get(this.#tableName, dataKey);
      if (!data) return null;
      return data;
    } catch (err) {
      console.warn("Error reading cache:", err);
      await this.clearCache(this.#tableName,dataKey);
      return null;
    }
  }
  async clearCache(dataKey) {
    try {
      const db = await this.#getDB(this.#tableName);
      await db.delete(this.#tableName, dataKey);
      console.warn(`[Cache] Cleared ${dataKey}`);
    } catch (err) {
      console.error("Error clearing cache:", err);
    }
  }
  
  // Private methods
  async #getDB(tableName) {
    return await openDB(this.#dbName, this.#dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(tableName)) db.createObjectStore(tableName);
      }
    });
  }
}
