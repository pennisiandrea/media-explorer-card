import { openDB } from 'idb';

export class CacheManager {
  #dbName;
  #tableName;

  constructor(dbName,tableName){
    this.#dbName = dbName;
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
      await this.clearCache(dataKey);
      return null;
    }
  }
  async clearCache(dataKey) {
    try {
      const db = await this.#getDB(this.#tableName);
      await db.delete(this.#tableName, dataKey);
    } catch (err) {
      console.error("Error clearing cache:", err);
    }
  }
  
  // Private methods
  async #getDB(tableName) {
    try {
      let db = await openDB(this.#dbName);

      if (db.objectStoreNames.contains(tableName)) return db;

      // New table needs to be created
      const newVersion = db.version + 1;
      db.close();

      db = await openDB(this.#dbName, newVersion, {
          upgrade(db) {
            if (!db.objectStoreNames.contains(tableName)) db.createObjectStore(tableName);
          }
        });

      return db;
    } catch (err) {
      console.error("Error opening cache:", err);
      return null;
    }
  }
}
