var et = require('expressive-test')
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
;

et.chai.use(sinonChai);

global.sinon = sinon;
