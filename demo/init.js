const express = require('express');
const Payload = require('../');
const config = require('./payload.config');

const router = express.Router({}); // eslint-disable-line new-cap
const registerCollections = require('./collections');
const registerContentBlocks = require('./content-blocks');

const app = express();

const payload = new Payload({
  config,
  app,
  router,
});

registerCollections(payload);
registerContentBlocks(payload);

if (process.env.NODE_ENV !== 'production') {
  router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });
}

app.listen(config.port, () => {
  console.log(`listening on ${config.port}...`);
});
