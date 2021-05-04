import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Orders, OrderbookItem, OrderType } from 'core/models';
import { orderbookAdapter, formatNumber } from 'core/utils';

const rowClasses = (order: OrderbookItem) => (
  order.type === OrderType.Ask ? 'order-ask' : 'order-bid'
);

const columns = [
  {
    dataField: 'price',
    text: 'Price',
    formatter: formatNumber,
  },
  {
    dataField: 'size',
    text: 'Size',
    formatter: formatNumber,
  },
  {
    dataField: 'total',
    text: 'Total',
    formatter: formatNumber,
  }
];

interface IOrderListProps {
  data: Orders;
}

const OrderList: React.FC<IOrderListProps> = ({ data }) => (
  <BootstrapTable
    bootstrap4
    keyField="id"
    data={orderbookAdapter(data)}
    columns={columns}
    bordered={false}
    rowClasses={rowClasses}
  />
);

export default OrderList;