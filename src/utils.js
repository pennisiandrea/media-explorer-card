import { openDB } from 'idb';

const DEBUG = true;
let INSTANCE = 0;

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
    devLog("CacheManager.addTable - start");
    let result;

    if (!this.#tablesNames.includes(tableName)){

      result = await this.#createTable(tableName);
      if (result) {
        this.#tablesNames.push(tableName);
      }
    }

    devLog("CacheManager.addTable - end");
    return result;
  }

  static async saveOnCache(tableName,dataKey,data) {
    devLog("CacheManager.saveOnCache - start");

    let result;

    if (!this.#tablesNames.includes(tableName)) {
      console.error("saveOnCache: table not yet added to database");
      result = false;
    }
    else {
      try {
        if (!await this.#getDB()) return false;
        await this.#dbInstance.put(tableName, data, dataKey);
        result = true;
      } catch (err) {
        console.error("Error saving to IndexedDB:", err);
        result = false;
      }
    }

    devLog("CacheManager.saveOnCache - end");
    return result;
  }

  static async getCachedData(tableName,dataKey) {
    devLog("CacheManager.getCachedData - start");

    let result;
    if (!this.#tablesNames.includes(tableName)) {
      console.error("saveOnCache: table not yet added to database");
      result = false;
    }
    else {
      try {
        if (await this.#getDB()) {
          let data;
          data = await this.#dbInstance.get(tableName, dataKey);
          if (!data) result = false;
          else result = data;
        }
        else result = false;
      } catch (err) {
        console.warn("Error reading cache:", err);
        await this.clearCache(dataKey);
        result = false;
      }
    }
    devLog("CacheManager.getCachedData - end");
    return result;
  }
  static async clearCache(tableName,dataKey) {
    devLog("CacheManager.clearCache - start");
    let result;

    if (!this.#tablesNames.includes(tableName)) {
      console.error("saveOnCache: table not yet added to database");
      result = false;
    }
    else {
      try {
        if (await this.#getDB()) {
          await this.#dbInstance.delete(tableName, dataKey);
          result = true;
        }
        else result = false;
      } catch (err) {
        console.error("Error clearing cache:", err);
        result = false;
      }
    }

    devLog("CacheManager.clearCache - end");
    return result;
  }
  static async #getDB() {
    devLog("CacheManager.#getDB - start");
    let result;
    try {
      while(this.#waitingCreatingTable > 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      this.#dbInstance = await openDB(this.#dbName);
      result = true;
    } catch (err) {
      console.error("Error opening/creating DB:", err);
      result = false;
    }
    
    devLog("CacheManager.#getDB - end");
    return result;
  }
  // Private methods
  static async #createTable(tableName) {
    devLog("CacheManager.createTable - start");
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
              console.warn("Upgrade blocked: other connections are pending!");
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

    devLog("CacheManager.createTable - end");
    return result;
  }
}

export function devLog(...args) {
  if (DEBUG) {
    console.info(`MEC${INSTANCE} - `,...args);
  }
}
