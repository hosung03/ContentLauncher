class SessionStorageManager {
  sessionStorage: Storage;

  constructor() {
    this.sessionStorage = window.sessionStorage;
  }

  // tslint:disable-next-line
  public setItem(key: string, value: any): void {
    this.sessionStorage[key] = JSON.stringify(value);
  }

  // tslint:disable-next-line
  public getItem(key: string): any {
    const data = this.sessionStorage[key];
    if (data) return JSON.parse(data);
  }

  public removeItem(key: string): void {
    this.sessionStorage.removeItem(key);
  }

  public clear(): void {
    this.sessionStorage.clear();
  }
}

const sessionStorageManager = new SessionStorageManager();
export default sessionStorageManager;
