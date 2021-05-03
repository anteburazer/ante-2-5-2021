import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Orders, OrderbookItem, OrderType } from 'core/models';
import { orderbookAdapter } from 'core/utils';

const rowClasses = (order: OrderbookItem) => (
  order.type === OrderType.Ask ? 'order-ask' : 'order-bid'
);

const columns = [
  {
    dataField: 'price',
    text: 'Price',
  },
  {
    dataField: 'size',
    text: 'Size',
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
      />
    </div>
  );
};

export default OrderList;