var benchrest = require('bench-rest');

var flow = {
  main: [
    {
      post: 'https://dockerhost/',
      json: {
        tweet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec purus in ante pretium blandit. Aliquam erat volutpat. Nulla libero lectus. #{INDEX}'
      },
      strictSSL: false
    }
  ]
};


var runOptions = {
  limit: 10,
  iterations: 1000,
  prealloc: 100,
  progress: 10,
}

var errors = [];
console.log('starting benchmark');
benchrest(flow, runOptions)
  .on('error', function(err, ctxName) {
    console.error('Failed in %s with err: ', ctxName, err);
  })
  .on('progress', function(stats, percent, concurrent, ips) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Progress: ' + percent + ' complete');
  })
  .on('end', function(stats, errorCount) {
    console.log('error count: ', errorCount);
    console.log('stats', stats);
  });