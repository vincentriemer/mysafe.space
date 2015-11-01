import rabbit from 'wascally';
import koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import cors from 'koa-cors';
import bodyparser from 'koa-bodyparser';

let context = null;

let app = koa();
app.use(logger());
app.use(cors({origin: true, credentials: true}));
app.use(bodyparser({
  onerror: function(err, ctx) {
    ctx.throw(`Body parse error: ${err}`, 422);
  }
}));

let router = Router();

router.post('/', function*(next) {
  const tweet = this.request.body.tweet;
  this.body = yield rabbit.request('sentiment_request', {
      type: 'calculate_sentiment',
      routingKey: '',
      body: {
        tweet: tweet,
      },
    }).then(response => {
      response.ack();
      if (response.body.error || !response.body.result) {
        console.error(response.body.error);
        this.throw('403');
      }
      return response.body.result;
  });
  yield next;
});

app.use(router.routes());
app.use(router.allowedMethods());

import topology from './topology';
const port = process.env.PORT || 8080;

topology(rabbit, []).done(() => {
  console.log('Connected to RabbitMQ!');
  console.log(`Listening on port ${port}`);
  app.listen(port);
})
