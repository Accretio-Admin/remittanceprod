const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const landbankRoute = require('./landbank.route');
const bayadcenterRoute = require('./bayadcenter.route');
const regionsRoute = require('./regions.route');
const apiToken = require('./api-token.route');
const userLimitationsRoute = require('./userlimitations.route');
const configRoute = require('./config.route');
const LogsRoute = require('./logs.route');
const config = require('../../config/config');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/userlimitations',
    route: userLimitationsRoute,
  },
  {
    path: '/regions',
    route: regionsRoute,
  },
  {
    path: '/landbank',
    route: landbankRoute,
  },
  {
    path: '/bayadcenter',
    route: bayadcenterRoute,
  },
  {
    path: '/token',
    route: apiToken,
  },
  {
    path: '/config',
    route: configRoute,
  },
  {
    path: '/logs',
    route: LogsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
