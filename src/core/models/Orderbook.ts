export enum OrderbookFeedType {
  OrderbookSnapshot = 'book_ui_1_snapshot',
  OrderbookDelta = 'book_ui_1'
}

export enum OrderType {
  Ask = 'ask',
  Bid = 'bid'
}

export interface OrderbookInfoResponse {
  event: string;
  version: number;
}

export interface OrderbookSubscribedResponse {
  event: string;
  feed: OrderbookFeedType;
  product_ids: string[];
}

export interface Orders {
  asks: Array<[number, number]>;
  bids: Array<[number, number]>;
}

export interface OrderbookDeltasResponse extends Orders {
  feed: OrderbookFeedType;
  product_id: string;
}

export interface OrderbookSnapshotResponse extends OrderbookDeltasResponse {
  numLevels: number;
}

export interface OrderbookItem {
  id: string,
  price: number;
  size: number;
  type: OrderType;
}

export interface OrderbookList {
  asks: OrderbookItem[];
  bids: OrderbookItem[];
}