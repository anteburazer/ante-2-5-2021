/**
 * WebSocket base class which contains all common logic for WebSocket communication.
 * WebSocketClient can be derived in order to handle the messages for specific use-cases.
 */
export default class WebSocketClient {
  private _timeout = 300;
  ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
  }

  /**
   * Open websocket communication
   */
  connect = (): Promise<void> => {
    let connectInterval: ReturnType<typeof setTimeout>;

    const promise: Promise<void> = new Promise((resolve, reject) => {
      /**
       * Websocket onopen event listener
       */
      this.ws.onopen = () => {
        // Reset timer to 300 on open of websocket connection 
        this._timeout = 300;

        // Clear Interval on on open of websocket connection
        clearTimeout(connectInterval);

        resolve();
      };

      /**
       * Websocket onclose event listener
       */
      this.ws.onclose = (e) => {
        console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
              10000 / 1000,
              (this._timeout + this._timeout) / 1000
          )} second.`,
          `Code: ${e.code}`,
          `Reason: ${e.reason}`
        );

        // Increment retry interval
        this._timeout = this._timeout + this._timeout;

        // Call check function after timeout
        connectInterval = setTimeout(this.check, Math.min(10000, this._timeout));

        reject();
      };

      /**
       * Websocket onerror event listener
       */
      this.ws.onerror = (event: Event) => {
        console.error(
          "Socket encountered error: ",
          // err.message,
          "Closing socket"
        );

        this.close();
      };
    });

    return promise;
  }

  /**
   * Check if the connection is closed and try to reconnect
   */
  check = () => {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  }

  /**
   * Send message to Websocket 
   */
  send = (data: any) => {
    try {
      this.ws.send(data);
    } catch (error) {
      console.log('Send failed', error);
    }
  }

  /**
   * Send message to Websocket 
   */
  close = (code?: number, reason?: string) => {
    this.ws.close(code, reason);
  }

  /**
   * Returns true if the Websocket connection is open
   */
  isConnected = () => this.ws.readyState === WebSocket.OPEN;

  /**
   * Start listen to websocket messages if Socket is not already initialized
   */
  async init(): Promise<boolean> {
    // Socket is already opened. Resolve the promise
    if (this.ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve) => resolve(true));
    }

    try {
      await this.connect();
      return true;
    } catch (err) {
      return false;
    }
  }
}