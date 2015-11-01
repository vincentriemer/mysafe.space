'use strict';

module.exports = function( rabbit, subscribeTo ) {
  return rabbit.configure( {
    connection: {
      user: 'guest',
      pass: 'guest',
      server: 'rabbitmq',
      port: 5672,
      timeout: 2000,
      vhost: '%2f'
    },
    exchanges: [
      { name: 'sentiment_request', type: 'direct' },
    ],
    queues: [
      { name: 'sentiment_requests', subscribe: subscribeTo.indexOf('sentiment_requests') !== -1 },
    ],
    bindings: [
      { exchange: 'sentiment_request', target: 'sentiment_requests', keys: [''] },
    ]
  });
};