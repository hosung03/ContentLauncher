class ServerHelper {
  serverHost: string = '127.0.0.1';
  serverPort: string = '8080';
  androidHost: string = '';

  getServerHost(): string {
    return `http://${this.serverHost}:${this.serverPort}`;
  }

  setServerHost(host: string): void {
    this.serverHost = host;
  }

  setAndroidHost(host: string): void {
    this.androidHost = host;
  }

  getAndroidHost() {
    return this.androidHost;
  }

  makeAndroidServerUrl(uri: string): string {
    return `${this.getAndroidHost()}${uri || ''}`;
  }

  makeUrl(uri: string): string {
    return `${this.getServerHost()}${uri || ''}`;
  }

  URLtoURI = (url?: string) => {
    if (url) {
      const splittedURL = url.split(this.serverPort);
      if (splittedURL.length > 1) return splittedURL[1];
      return splittedURL[0];
    }
    return url;
  };
}

const serverHelper = new ServerHelper();
export default serverHelper;
