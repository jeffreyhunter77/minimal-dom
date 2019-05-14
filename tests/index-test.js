require('./setup');

var main = require('../')
  , Document = require('../lib/document')
;

describe(main, () => {

  it('exports Document', function() {
    expect(main).to.equal(Document);
  });

});
