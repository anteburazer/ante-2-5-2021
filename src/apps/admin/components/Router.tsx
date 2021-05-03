import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import Config from 'apps/admin/Config';
import Dashboard from 'apps/admin/pages/dashboard/Dashboard';

const routes = [
  {
    path: Config.routes.home,
    Component: Dashboard,
    exact: true,
  },
];

const AdminRouter: React.FC = () => (
  <Switch>
    {routes.map(({ path, Component, exact }) => (
      <Route
        path={path}
        key={path}
        exact={exact}
        render={() => (
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        )}
      />
    ))}
  </Switch>
);

export default AdminRouter;