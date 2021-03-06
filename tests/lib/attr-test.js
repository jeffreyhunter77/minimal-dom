require('../setup');

var Attr = require('../../lib/attr')
  , Element = require('../../lib/element')
  , Node = require('../../lib/node')
;

describe(Attr, () => {

  prop('name',    'id');
  prop('value',   '1234');
  prop('attr',    function() { return new Attr(null, this.name, this.value); });
  prop('element', function() { return new Element('p'); });

  describe('.nodeName', () => {

    it('returns the attribute name', function() {
      expect(this.attr.nodeName).to.equal(this.name);
    });

  });

  describe('.nodeValue', () => {

    it('returns the attribute value', function() {
      expect(this.attr.nodeValue).to.equal(this.value);
    });

    context("when Attr is created with a parent", () => {

      prop('attr',    function() { return new Attr(this.element, this.name); });

      before(function() { this.element.setAttribute(this.name, this.value); });

      it("obtains the attribute value from the parent", function() {
        expect(this.attr.nodeValue).to.equal(this.value);
      });

    });

  });

  describe('.nodeType', () => {

    it("returns Node.ATTRIBUTE_NODE", function() {
      expect(this.attr.nodeType).to.equal(Node.ATTRIBUTE_NODE);
    });

  });

  describe('.parentNode', () => {

    prop('attr',    function() { return new Attr(this.element, this.name); });

    it("always returns null", function() {
      expect(this.attr.parentNode).to.be.null;
    });

  });

  describe('.name', () => {

    it('returns the attribute name', function() {
      expect(this.attr.name).to.equal(this.name);
    });

  });

  describe('.specified', () => {

    it('returns true', function() {
      expect(this.attr.specified).to.be.true;
    });

  });

  describe('.value', () => {

    it('returns the attribute value', function() {
      expect(this.attr.value).to.equal(this.value);
    });

    context("when assigned", () => {

      prop('newValue', 'abcd');

      before(function() { this.attr.value = this.newValue; });

      it('sets the attribute value', function() {
        expect(this.attr.value).to.equal(this.newValue);
      });

      context("when Attr has a parent", () => {

        prop('attr', function() { return new Attr(this.element, this.name); });

        it("sets the attribute value on the parent", function() {
          expect(this.element.getAttribute(this.name)).to.equal(this.newValue);
        });

      });

    });

  });

  describe('.cloneNode()', () => {

    it('returns a new node', function() {
      expect(this.attr.cloneNode()).to.be.an.instanceOf(Attr);
    });

    it('returns a different instance', function() {
      expect(this.attr.cloneNode()).to.not.equal(this.attr);
    });

    it('copies the attribute name', function() {
      expect(this.attr.cloneNode().name).to.equal(this.attr.name);
    });

    it('copies the attribute value', function() {
      expect(this.attr.cloneNode().value).to.equal(this.attr.value);
    });

    context("when the attribute belongs to an element", function() {

      prop('attr', function() { return new Attr(this.element, this.name); });

      it("does not copy the association", function() {
        expect(this.attr.cloneNode()._parent).to.be.null;
      });

    });

  });

});
