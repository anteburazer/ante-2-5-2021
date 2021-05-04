import {
  OrderType,
  OrderbookItem,
  Orders
} from 'core/models';
import { isInArray } from 'core/utils';

/**
 * Transforms orderbook items, received from Websocket, into the list
 * suitable for displaying for the user
 */
export const orderbookAdapter = (data: Orders): OrderbookItem[] => ([
  ...transformOrderItems(data.asks, OrderType.Ask, 0).slice(0, 5),
  ...transformOrderItems(data.bids, OrderType.Bid, data.asks.length).slice(0, 5)
]);

/**
 * Updates the current list of orders with received deltas
 */
export const updateOrdersWithDeltas = (orders: Orders, deltas: Orders): Orders => {
  const asks = orders.asks.length
    ? sliceAndSort(mergeDeltas(orders.asks, deltas.asks), 7, descending)
    : orders.asks;

  const bids = orders.bids.length
    ? sliceAndSort(mergeDeltas(orders.bids, deltas.bids), 7, descending)
    : orders.bids;

  return { bids, asks };
};

/**
 * Slices the array of tuples by a given count and sorts it by a given criteria
 */
export const sliceAndSort = (
  orders: Array<[number, number]>,
  count: number,
  sortCallback: (a: number[], b: number[]) => number
) => (
  orders
    .slice(0, count)
    .sort(sortCallback)
);

/**
 * Descending criteria for sorting the array of tuples
 */
export const descending = (a: number[], b: number[]) => b[0] - a[0];

/**
 * Merges deltas with the given array of orders
 * If the size returned by a delta is 0 then that price level should be removed from the orderbook,
 */
const mergeDeltas = (orders: Array<[number, number]>, deltas: Array<[number, number]>) => {
  const ordersUpdated = [...orders];

  deltas.forEach(delta => {
    const orderIndex = isInArray(ordersUpdated, delta[0]);

    if (orderIndex > -1) {
      if (delta[1] === 0) {
        ordersUpdated.splice(orderIndex, 1);
      } else {
        ordersUpdated[orderIndex] = delta;
      }
    } else if (delta[1] > 0) {
      ordersUpdated.push(delta);
    }
  });

  return ordersUpdated;
};

/**
 * Calculate the sum of the given array
 */
export const calculateTotal = (array: Array<[number, number]>) => (
  array.reduce((accumulator, currentValue) => accumulator + currentValue[1], 0)
);

/**
 * Transform the orders suitable for displaying it for the user
 */
const transformOrderItems = (
  items: Array<[number, number]>,
  type: OrderType,
  startingKey: number
): OrderbookItem[] => (
  items.map((item, index) => ({
    id: (index + startingKey).toString(),
    price: item[0],
    size: item[1],
    total: calculateTotal(items.slice(index, items.length)) || item[1],
    type
  }))
);