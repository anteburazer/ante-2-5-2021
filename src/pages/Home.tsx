import React, { useEffect, useState } from 'react';
import { orderbookWebocketClient } from 'core/webSocketClients';
import OrderList from 'components/OrderList';
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

    // setTimeout(() => orderbookWebocketClient.close(), 1000);

    return () => {
      feedSnapshotSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand mb-0 h1">Orderbook</span>
      </nav>

      <div className="container my-5 text-center">
        <h2 className="mb-4">XBT/USD Orderbook</h2>
        {orders && <OrderList data={orders} />}
      </div>
    </div>
  );
};

export default Home;