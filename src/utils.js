import { openDB } from 'idb';

export class CacheManager {
  static #dbName;
  static #tablesNames = [];
  static #creatingTable;
  static #waitingCreatingTable = 0;
  static #dbInstance;

  constructor(){
    throw new Error("Use this as static class -> config cannot be instantiated");
  }

  static get dbName() {return this.#dbName}
  static set dbName(dbName) {if (!this.#dbName) this.#dbName = dbName} 

  static async addTable(tableName) {
    if (this.#tablesNames.includes(tableName)) return;

    const result = await this.#createTable(tableName);
    if (result) {
      this.#tablesNames.push(tableName);
    }
    return result;
  }
  static async saveOnCache(tableName,dataKey,data) {
    if (!this.#tablesNames.includes(tableName)) {
      console.error("saveOnCache: table not yet added to database");
      return false;
    }
    try {
      if (!await this.#getDB()) return false;
      await this.#dbInstance.put(tableName, data, dataKey);
    } catch (err) {
      console.error("Error saving to IndexedDB:", err);
      return false;
    }
    return true;
  }
  static async getCachedData(tableName,dataKey) {
    if (!this.#tablesNames.includes(tableName)) {
      console.error("saveOnCache: table not yet added to database");
      return false;
    }
    let data;
    try {
      const result = await this.#getDB();
      if (!result) return false;
      data = await this.#dbInstance.get(tableName, dataKey);
      if (!data) return false;
    } catch (err) {
      console.warn("Error reading cache:", err);
      await this.clearCache(dataKey);
      return false;
    }
    return data;
  }
  static async clearCache(tableName,dataKey) {
    if (!this.#tablesNames.includes(tableName)) {
      console.error("saveOnCache: table not yet added to database");
      return false;
    }
    try {
      if (!await this.#getDB()) return false;
      await this.#dbInstance.delete(tableName, dataKey);
    } catch (err) {
      console.error("Error clearing cache:", err);
      return false;
    }
    return true;
  }
  static async #getDB() {
    try {
      while(this.#waitingCreatingTable > 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      this.#dbInstance = await openDB(this.#dbName);
    } catch (err) {
      console.error("Error opening/creating DB:", err);
      return false;
    }
    return true;
  }
  // Private methods
  static async #createTable(tableName) {
    let result = false;

    this.#waitingCreatingTable++;

    while(this.#creatingTable) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  
    this.#creatingTable = true;

    try {
      this.#dbInstance?.close();
      this.#dbInstance = await openDB(this.#dbName);

      if (this.#dbInstance.objectStoreNames.contains(tableName)) result = true;
      else {
        // New table needs to be created
        const oldVersion = this.#dbInstance.version;
        this.#dbInstance.close();
        
        this.#dbInstance = await openDB(this.#dbName, oldVersion+1, {
            upgrade(db) {
              if (!db.objectStoreNames.contains(tableName)) db.createObjectStore(tableName);
            },
            blocked() {
              console.warn("⚠️ Upgrade blocked: ci sono altre connessioni aperte!");
            },
          });
          
        result = true;
      }
    } catch (err) {
      console.error("Error creating table:", err);
      result = false;
    } finally {
      this.#creatingTable = false;
      this.#waitingCreatingTable --;
    }

    return result;
  }
}
