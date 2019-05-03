require('../setup');

var NodeList = require('../../lib/node-list')
  , Element = require('../../lib/element')
  , DOMException = require('../../lib/dom-exception');

describe(NodeList, () => {

  prop('list', function() { return new NodeList(); }, MEMOIZE);

  prop('parent', function() {
    var p = new Element('p');

    this.children.forEach((c) => p.appendChild(c));

    return p;
  }, MEMOIZE);

  prop('children', function() {
    return [
      new Element('span'),
      new Element('span'),
      new Element('span'),
      new Element('span')
    ];
  }, MEMOIZE);

  describe('.length', () => {

    context("for an empty list", () => {

      it("returns 0", function() {
        expect(this.list.length).to.equal(0);
      });

    });

    context("for a non-empty list", () => {

      prop('list', function() { return new NodeList(this.parent); }, MEMOIZE);

      it("returns the count of children in the list", function() {
        expect(this.list.length).to.equal(this.children.length);
      });

    });

  });

  describe('.item()', () => {

    context("for an empty list", () => {

      it("returns null for any index", function() {
        expect(this.list.item(0)).to.be.null;
      });

    });

    context("for a non-empty list", () => {

      prop('list', function() { return new NodeList(this.parent); }, MEMOIZE);

      it("accepts an index starting at 0", function() {
        expect(this.list.item(0)).to.equal(this.children[0]);
      });

      it("returns the child at the specified index", function() {
        expect(this.list.item(2)).to.equal(this.children[2]);
      });

      it("returns null for an index without a child", function() {
        expect(this.list.item(4)).to.be.null;
      });

    });

  });

  describe('.entries()', () => {

    context("for an empty list", () => {

      it("returns an array iterator that is done", function() {
        expect(this.list.entries().next()).to.deep.equal({value: undefined, done: true});
      });

    });

    context("for a non-empty list", () => {

      prop('list',    function() { return new NodeList(this.parent); }, MEMOIZE);
      prop('entries', function() { return this.list.entries(); }, MEMOIZE);

      it("returns index and node for the value", function() {
        expect(this.entries.next().value).to.deep.equal([0, this.children[0]]);
      });

      it("sets done to false when there is a next item", function() {
        expect(this.entries.next().done).to.be.false;
      });

      it("sets done to true when there is not a next item", function() {
        expect(this.entries.next().done).to.be.false;
        expect(this.entries.next().done).to.be.false;
        expect(this.entries.next().done).to.be.false;
        expect(this.entries.next().done).to.be.false;
        expect(this.entries.next().done).to.be.true;
      });

    });

  });

  describe('.keys()', () => {

    prop('list',    function() { return new NodeList(this.parent); }, MEMOIZE);

    it("returns an iterator over the indexes", function() {
      expect(this.list.keys().next().value).to.equal(0);
    });

  });

  describe('.values()', () => {

    prop('list',    function() { return new NodeList(this.parent); }, MEMOIZE);

    it("returns an iterator over the children", function() {
      expect(this.list.values().next().value).to.equal(this.children[0]);
    });

  });

  describe('.proxy()', () => {

    prop('list',    function() { return new NodeList(this.parent); }, MEMOIZE);
    prop('proxy',   function() { return this.list.proxy(); }, MEMOIZE);

    it("returns an object that allows children to be accessed like entries", function() {
      expect(this.proxy[1]).to.equal(this.children[1]);
    });

    it("returns undefined for a non-existent child", function() {
      expect(this.proxy[5]).to.be.undefined;
    });

  });

  describe('.forEach()', () => {

    prop('list',     function() { return new NodeList(this.parent); }, MEMOIZE);
    prop('callback', () => sinon.stub(), MEMOIZE);

    before(function() { this.list.forEach(this.callback); });

    it("invokes the callback once for each item", function() {
      expect(this.callback).to.have.callCount(4);
    });

    context("on each call", () => {

      prop('children', function() { return [new Element('span')]; }, MEMOIZE);

      it("it calls back with the item, index, and list", function() {
        expect(this.callback).to.have.been.calledWith(this.children[0], 0, this.list);
      });

      context("when a 'this' argument is provided", () => {

        prop('thisArg', function() { return {}; }, MEMOIZE);

        before(function() { this.callback.reset(); });
        before(function() { this.list.forEach(this.callback, this.thisArg); });

        it("it calls the the provided this", function() {
          expect(this.callback).to.have.been.calledOn(this.thisArg);
        });

      });

    });

  });

});
