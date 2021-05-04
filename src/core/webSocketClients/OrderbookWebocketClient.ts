import { Subject } from 'rxjs';
import Config from 'core/Config';
import WebSocketClient from 'core/transport/WebSocketClient';
import {
  OrderbookSubscribedResponse,
  OrderbookFeedType,
  OrderbookDeltasResponse,
  OrderbookSnapshotResponse,
  Orders,
  WsMessage
} from 'core/models';
import { updateOrdersWithDeltas, sliceAndSort, descending } from 'core/utils';

/**
 * Websocket client which receives and processes new OrderBook messages
 */
class OrderbookWebocketClient extends WebSocketClient {
  // Observable stream where we are going to push new order updates from Websocket
  ordersFeed = new Subject<Orders | undefined>();

  private _orders: Orders | undefined;

  constructor() {
    super(Config.websocketUrl);
  }

  /**
   * Initialize Websocket communication by sending the start message to the API.
   * We need to wait for the connection to be opened in order to start sending the messages.
   */
  start = async () => {
    const isConnected = this.isConnected()
      ? true
      : await this.init();

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

  /**
   * Listen for upcomming messages.
   * 
   * Messages can be of different types but we are interested for the initial set of orders
   * and deltas, so we can update currently displayed orders
   */
  listenForMessages = () => {
    this.ws.onmessage = (event) => {
      try {        
        let message: WsMessage = JSON.parse(event.data);

        // Initial list of orders
        if (this._isInitialList(message)) {
          message = message as OrderbookSnapshotResponse;

          // Create format which we need for further processing
          this._orders = {
            asks: sliceAndSort(message.asks, 5, descending),
            bids: sliceAndSort(message.bids, 5, descending)
          };

        // Deltas
        } else if (this._orders && this._isDelta(message)) {
          message = message as OrderbookDeltasResponse;

          // Process deltas and update the current list of orders
          this._orders = updateOrdersWithDeltas(this._orders, message);          
        }

        // Push new orders list to observable stream
        this.ordersFeed.next(this._orders);
      } catch (err) {
        console.log('onmessage', err);
      }
    };
  };

  /**
   * Return true if thee message contains the initial order list
   */
  private _isInitialList = (message: WsMessage) => (
    (message as OrderbookSnapshotResponse).feed === OrderbookFeedType.OrderbookSnapshot
  );

  /**
   * Return true if thee message contains the deltas
   */
  private _isDelta = (message: WsMessage) => (
    (message as OrderbookDeltasResponse).feed === OrderbookFeedType.OrderbookDelta
      && !(message as OrderbookSubscribedResponse).event
  );
}

export const orderbookWebocketClient = new OrderbookWebocketClient();
