require('../setup');

var NamedNodeMap = require('../../lib/named-node-map')
  , Attr = require('../../lib/attr')
  , Element = require('../../lib/element')
;

describe(NamedNodeMap, () => {

  prop('elem',  function() { return new Element('div'); });
  prop('map',   function() { return new NamedNodeMap(this.elem); });
  prop('attrs', {'id': '1234'});

  before(function() { for (var a in this.attrs) { this.elem.setAttribute(a, this.attrs[a]); } });

  describe('.getNamedItem()', () => {

    context("when the item does not exist", () => {

      it("returns null", function() {
        expect(this.map.getNamedItem('nonesuch')).to.be.null;
      });

    });

    context("when the item is present", () => {

      it("returns an Attr", function() {
        expect(this.map.getNamedItem('id')).to.be.an.instanceOf(Attr);
      });

      it("returns the requested item", function() {
        expect(this.map.getNamedItem('id').name).to.equal('id');
      });

    });

  });

  describe('.setNamedItem()', () => {

    prop('attr', function() { return new Attr(null, 'data-postcode', 'WC1A 2TH'); });

    before(function() { this.map.setNamedItem(this.attr); });

    it('adds or replaces the item', function() {
      expect(this.elem.getAttribute(this.attr.name)).to.equal(this.attr.value);
    });

  });

  describe('.removeNamedItem()', () => {

    before(function() { this.map.removeNamedItem('id'); });

    it('removes the item when it exists', function() {
      expect(this.elem.getAttribute('id')).to.be.null;
    });

    it('returns null when it does not exist', function() {
      expect(this.map.removeNamedItem('id')).to.be.null;
    });

  });

  describe('.item()', () => {

    it('returns the item', function() {
      expect(this.map.item(0).name).to.equal('id');
    });

    it('returns null when the index exceeds length', function() {
      expect(this.map.item(this.attrs.length)).to.be.null;
    });

    context('when the element has no attributes', () => {

      prop('attrs', {});

      it('returns null', function() {
        expect(this.map.item(0)).to.be.null;
      });

    });

  });

  describe('.length', () => {

    context('when the element has no attributes', () => {

      prop('attrs', {});

      it('returns 0', function() {
        expect(this.map.length).to.equal(0);
      });

    });

    context('when the element has attributes', () => {

      it('returns the attribute count', function() {
        expect(this.map.length).to.equal(Object.keys(this.attrs).length);
      });

    });

  });

  describe('.proxy()', () => {

    prop('proxy',   function() { return this.map.proxy(); });

    it("returns an object that allows items to be accessed like entries", function() {
      expect(this.proxy[0].name).to.equal('id');
    });

    it("returns undefined for a non-existent item", function() {
      expect(this.proxy[5]).to.be.undefined;
    });

    it("allows items to also be accessed like properties", function() {
      expect(this.proxy.id.value).to.equal('1234');
    });

    context("with the in operator", () => {

      it("returns true when an item with that name exists", function() {
        expect('id' in this.proxy).to.be.true;
      });

      it("returns true when an property index with that value exists", function() {
        expect(0 in this.proxy).to.be.true;
      });

      it("returns false when an item with that name does not exist", function() {
        expect('nonesuch' in this.proxy).to.be.false;
      });

      it("returns false when an property index with that value does not exist", function() {
        expect(4 in this.proxy).to.be.false;
      });

    });

  });

});
