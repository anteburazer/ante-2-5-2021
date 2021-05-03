import AdminConfig from 'apps/admin/Config';

const Config = {
  environment: process.env.REACT_APP_ENVIRONMENT,
  apiUrl: process.env.REACT_APP_API_URL || '',
  websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || '',

  routes: {
    // Admin
    ...AdminConfig.routes,

    //Auth
    login: '/login',

    //Common
    nonExistingPage: '/auth/404',
    home: '/'
  }
};

export default Config;