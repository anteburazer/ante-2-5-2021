import React, { useEffect, useState } from 'react';
import { orderbookWebocketClient } from 'core/webSocketClients';
import OrderList from 'pages/OrderList';
import { Orders } from 'core/models';

const Home: React.FC = () => {
  const [orders, setOrders] = useState<Orders | undefined>(undefined);

  useEffect(() => {
    orderbookWebocketClient.getOrders();

    const feedSnapshotSubscription = orderbookWebocketClient.ordersFeed
      .subscribe({
        next: (v) => {
          setOrders(v);
        }
      });

    setTimeout(() => orderbookWebocketClient.close(), 10000);

    return () => {
      feedSnapshotSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      {orders && <OrderList data={orders} />}
    </div>
  );
};

export default Home;