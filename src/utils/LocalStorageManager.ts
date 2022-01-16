export enum LocalStorageKey {
    SERVER_BOOK_VERSION = 'SERVER_BOOK_VERSION'
  }
  
  class LocalStorageManager {
    localStorage: Storage;
  
    constructor() {
      this.localStorage = window.localStorage;
    }
  
    // tslint:disable-next-line
    public setItem(key: string, value: any): void {
      this.localStorage[key] = JSON.stringify(value);
    }
  
    // tslint:disable-next-line
    public getItem(key: string): any {
      const data = this.localStorage[key];
      if (data) return JSON.parse(data);
    }
  
    public removeItem(key: string): void {
      this.localStorage.removeItem(key);
    }
  
    public clear(): void {
      this.localStorage.clear();
    }
  }
  
  const localStorageManager = new LocalStorageManager();
  export default localStorageManager;
  