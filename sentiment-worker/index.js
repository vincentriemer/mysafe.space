import rabbit from 'wascally';
import {exec} from 'child-process-promise';
import NLP from 'stanford-corenlp';

let coreNLP = null;
let nlpConfig = {
  nlpPath: './corenlp',
  version: '3.5.2',
  'annotators': ['tokenize','ssplit','pos','parse','sentiment','depparse','quote'], //optional!
  'extra' : {
    'depparse.extradependencie': 'MAXIMAL'
  }
};

rabbit.handle('calculate_sentiment', message => {
  const tweet = message.body.tweet;

  coreNLP.process(tweet, (err, result) => {
    if (err) return console.error(err);

    let sentences = [].concat(result.document.sentences.sentence);
    let response = 'Positive';

    sentences.forEach(sentence => {
      const sentiment = sentence['$']['sentiment'];

      if (sentiment.indexOf('Negative') !== -1) {
        response = 'Negative';
      }
    });
    message.reply({result: response});
  });
});

import topology from './topology';

coreNLP = new NLP.StanfordNLP(nlpConfig, (err) => {
  if (err) return console.error(err);

  topology(rabbit, ['sentiment_requests']).done(() => {
    console.log('Connected to Rabbitmq!');
  });
});