import React, { useEffect, useState } from 'react';
import { orderbookWebocketClient } from 'core/webSocketClients';
import OrderList from 'components/OrderList';
import Navbar from 'components/Navbar';
import Spinner from 'components/Spinner';
import { Orders } from 'core/models';

const Home: React.FC = () => {
  const [orders, setOrders] = useState<Orders | undefined>(undefined);

  /**
   * Subscribe to orders observable
   */
  const subscribeToOrders = () => {
    // Start websocket communication
    orderbookWebocketClient.start();

    // Subscribe to Orders observable
    return orderbookWebocketClient.ordersFeed
      .subscribe({
        next: (newOrders) => setOrders(newOrders)
      });
  };

  useEffect(() => {
    // Subscribe to Orders observable
    const ordersSubscription = subscribeToOrders();

    // Unsubscribe from observable on componenent unmount
    return () => ordersSubscription.unsubscribe();
  }, []);

  return (
    <div className="container-fluid p-0">
      <Navbar />

      <div className="container my-5 text-center">
        <h2 className="mb-4">XBT/USD Orderbook</h2>

        { orders
            ? <OrderList data={orders} />
            : <Spinner className="center-fixed" />
        }
      </div>
    </div>
  );
};

export default Home;