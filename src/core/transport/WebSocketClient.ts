export default class WebSocketClient {
  private _timeout = 250;
  ws: WebSocket;

  constructor(url: string) {
    this.ws = new WebSocket(url);
  }

  connect = (): Promise<void> => {
    let connectInterval: ReturnType<typeof setTimeout>;

    const promise: Promise<void> = new Promise((resolve, reject) => {
      // websocket onopen event listener
      this.ws.onopen = () => {
        console.log("connected websocket main component");

        this._timeout = 250; // reset timer to 250 on open of websocket connection 
        clearTimeout(connectInterval); // clear Interval on on open of websocket connection

        resolve();
      };

      // websocket onclose event listener
      this.ws.onclose = (e) => {
        console.log(
          `Socket is closed. Reconnect will be attempted in ${Math.min(
              10000 / 1000,
              (this._timeout + this._timeout) / 1000
          )} second.`,
          `Code: ${e.code}`,
          `Reason: ${e.reason}`
        );

        this._timeout = this._timeout + this._timeout; //increment retry interval
        connectInterval = setTimeout(this.check, Math.min(10000, this._timeout)); //call check function after timeout

        reject();
      };

      // websocket onerror event listener
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

  check = () => {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  }

  send = (data: any) => {
    try {
      console.log('sending message', data);
      this.ws.send(data);
    } catch (error) {
      console.log('send failed', error);
    }
  }

  close = () => {
    this.ws.close(4000, 'Permanent');
  }

  async init(): Promise<boolean> {
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