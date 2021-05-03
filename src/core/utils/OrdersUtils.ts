import {
  OrderType,
  OrderbookItem,
  Orders
} from 'core/models';
import { isInArray } from 'core/utils';

export const orderbookAdapter = (data: Orders): OrderbookItem[] => ([
  ...transformListItems(data.asks, OrderType.Ask, 0),
  ...transformListItems(data.bids, OrderType.Bid, data.asks.length)
]);

export const updateOrdersWithDeltas = (orders: Orders, deltas: Orders): Orders => {
  if (!orders.asks.length) {
    return orders;
  }

  const asks = orders.asks.length
    ? sliceAndSort(mergeDeltas(orders.asks, deltas.asks), 5, descending)
    : orders.asks;

  const bids = orders.bids.length
    ? sliceAndSort(mergeDeltas(orders.bids, deltas.bids), 5, descending)
    : orders.bids;

  return { bids, asks };
};

export const sliceAndSort = (
  orders: Array<[number, number]>,
  count: number,
  sortCallback: (a: number[], b: number[]) => number
) => (
  orders
    .slice(0, count)
    .sort(sortCallback)
);

export const descending = (a: number[], b: number[]) => b[0] - a[0];

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

export const calculateTotal = (array: Array<[number, number]>) => (
  array.reduce((accumulator, currentValue) => accumulator + currentValue[1], 0)
);

const transformListItems = (items: Array<[number, number]>, type: OrderType, startingKey: number): OrderbookItem[] => (
  items.map((item, index) => ({
    id: (index + startingKey).toString(),
    price: item[0],
    size: item[1],
    total: calculateTotal(items.slice(index, items.length)) || item[1],
    type
  }))
);