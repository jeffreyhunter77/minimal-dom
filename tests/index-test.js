require('./setup');

var main = require('../')
  , Document = require('../lib/document')
  , Node = require('../lib/node')
  , DOMException = require('../lib/dom-exception')
;

describe(main, () => {

  it('exports Document', function() {
    expect(main).to.equal(Document);
  });

  it('provides access to the Node class', function() {
    expect(main.Node).to.equal(Node);
  });

  it('provides access to the DOMException class', function() {
    expect(main.DOMException).to.equal(DOMException);
  });

});
