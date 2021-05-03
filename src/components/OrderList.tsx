import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Orders, OrderbookItem, OrderType } from 'core/models';
import { orderbookAdapter, formatNumber } from 'core/utils';

const rowClasses = (order: OrderbookItem) => (
  order.type === OrderType.Ask ? 'order-ask' : 'order-bid'
);

const cellFormatter = (cell: number) => formatNumber(cell);

const columns = [
  {
    dataField: 'price',
    text: 'Price',
    formatter: cellFormatter,
  },
  {
    dataField: 'size',
    text: 'Size',
    formatter: cellFormatter,
  },
  {
    dataField: 'total',
    text: 'Total',
    formatter: cellFormatter,
  }
];

interface IOrderListProps {
  data: Orders;
}

const OrderList: React.FC<IOrderListProps> = ({ data }) => {
  return (
    <div>
      <BootstrapTable
        bootstrap4
        keyField="id"
        data={orderbookAdapter(data)}
        columns={columns}
        bordered={false}
        rowClasses={rowClasses}
        headerWrapperClasses="table-header"
      />
    </div>
  );
};

export default OrderList;