import { Subject } from 'rxjs';
import Config from 'core/Config';
import WebSocketClient from 'core/transport/WebSocketClient';
import {
  OrderbookInfoResponse,
  OrderbookSubscribedResponse,
  OrderbookFeedType,
  OrderbookDeltasResponse,
  OrderbookSnapshotResponse,
  Orders
} from 'core/models';
import { updateOrdersWithDeltas, sliceAndSort, descending } from 'core/utils';

type WsMessage = OrderbookInfoResponse
  | OrderbookSubscribedResponse
  | OrderbookDeltasResponse
  | OrderbookSnapshotResponse;

class OrderbookWebocketClient extends WebSocketClient {
  ordersFeed = new Subject<Orders | undefined>();

  private _orders: Orders | undefined;

  constructor() {
    super(Config.websocketUrl);
  }

  getOrders = async () => {
    const isConnected = this.ws.readyState === WebSocket.OPEN ? true : await this.init();

    if (isConnected) {
      const data = {
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: ['PI_XBTUSD']
      };

      this.send(JSON.stringify(data));
      this.listenForMessages();
    }
  };

  listenForMessages = () => {
    this.ws.onmessage = (event) => {
      try {        
        let message: WsMessage = JSON.parse(event.data);

        if (this._isSnapshot(message)) {
          message = message as OrderbookSnapshotResponse;

          this._orders = {
            asks: sliceAndSort(message.asks, 5, descending),
            bids: sliceAndSort(message.bids, 5, descending)
          };
        } else if (this._orders && this._isDelta(message)) {
          message = message as OrderbookDeltasResponse;

          this._orders = updateOrdersWithDeltas(this._orders, message);          
        }

        this.ordersFeed.next(this._orders);
      } catch (err) {
        console.log('onmessage', err);
      }
    };
  };

  private _isSnapshot = (message: WsMessage) => {
    return (message as OrderbookSnapshotResponse).feed === OrderbookFeedType.OrderbookSnapshot;
  };

  private _isDelta = (message: WsMessage) => {
    return (message as OrderbookDeltasResponse).feed === OrderbookFeedType.OrderbookDelta
      && !(message as OrderbookSubscribedResponse).event
  };
}

export const orderbookWebocketClient = new OrderbookWebocketClient();