var et = require('expressive-test')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
;

et.chai.use(sinonChai);

global.MEMOIZE = {memoize: true};
global.sinon = sinon;
