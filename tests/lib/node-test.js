require('../setup');

var Node = require('../../lib/node')
  , DOMException = require('../../lib/dom-exception')
  , Element = require('../../lib/element')
  , NodeList = require('../../lib/node-list')
;

describe(Node, () => {

  prop('node',     function() { return new Node(); }, MEMOIZE);
  prop('child',    function() { return new Node(); }, MEMOIZE);
  prop('newChild', function() { return new Node(); }, MEMOIZE);
  prop('sibling',  function() { return new Node(); }, MEMOIZE);
  prop('parent',   function() { return new Element('p'); }, MEMOIZE);


  describe("node type constants", () => {

    it("defines ELEMENT_NODE as 1", function() {
      expect(Node.ELEMENT_NODE).to.equal(1);
    });

    it("defines ATTRIBUTE_NODE as 2", function() {
      expect(Node.ATTRIBUTE_NODE).to.equal(2);
    });

    it("defines TEXT_NODE as 3", function() {
      expect(Node.TEXT_NODE).to.equal(3);
    });

    it("defines CDATA_SECTION_NODE as 4", function() {
      expect(Node.CDATA_SECTION_NODE).to.equal(4);
    });

    it("defines ENTITY_REFERENCE_NODE as 5", function() {
      expect(Node.ENTITY_REFERENCE_NODE).to.equal(5);
    });

    it("defines ENTITY_NODE as 6", function() {
      expect(Node.ENTITY_NODE).to.equal(6);
    });

    it("defines PROCESSING_INSTRUCTION_NODE as 7", function() {
      expect(Node.PROCESSING_INSTRUCTION_NODE).to.equal(7);
    });

    it("defines COMMENT_NODE as 8", function() {
      expect(Node.COMMENT_NODE).to.equal(8);
    });

    it("defines DOCUMENT_NODE as 9", function() {
      expect(Node.DOCUMENT_NODE).to.equal(9);
    });

    it("defines DOCUMENT_TYPE_NODE as 10", function() {
      expect(Node.DOCUMENT_TYPE_NODE).to.equal(10);
    });

    it("defines DOCUMENT_FRAGMENT_NODE as 11", function() {
      expect(Node.DOCUMENT_FRAGMENT_NODE).to.equal(11);
    });

    it("defines NOTATION_NODE as 12", function() {
      expect(Node.NOTATION_NODE).to.equal(12);
    });

  });

  describe(".nodeName", () => {

    it("returns null", function() {
      expect(this.node.nodeName).to.be.null;
    });

  });

  describe(".nodeValue", () => {

    it("returns null", function() {
      expect(this.node.nodeValue).to.be.null;
    });

    it("raises an error when the property is set", function() {
      expect(() => this.node.nodeValue = '').to.throw(DOMException);
    });

  });

  describe(".nodeType", () => {

    it("returns null", function() {
      expect(this.node.nodeType).to.be.null;
    });

  });

  describe(".parentNode", () => {

    it("returns null without a parent", function() {
      expect(this.node.parentNode).to.be.null;
    });

    context("with a parent", () => {

      prop('parent', function() { return new Node(); }, MEMOIZE);
      prop('node',   function() { return new Node(this.parent); }, MEMOIZE);

      it("returns the parent node", function() {
        expect(this.node.parentNode).to.equal(this.parent);
      });

    });

  });

  describe(".childNodes", () => {

    it("returns a NodeList", function() {
      expect(this.node.childNodes).to.be.an.instanceOf(NodeList);
    });

    it("returns an empty list", function() {
      expect(this.node.childNodes.length).to.equal(0);
    });

  });

  describe(".firstChild", () => {

    it("returns null", function() {
      expect(this.node.firstChild).to.be.null;
    });

  });

  describe(".lastChild", () => {

    it("returns null", function() {
      expect(this.node.lastChild).to.be.null;
    });

  });

  describe(".previousSibling", () => {

    it("returns null without a sibling", function() {
      expect(this.node.previousSibling).to.be.null;
    });

    context("with a previous sibling", () => {

      before(function() { this.parent.insertBefore(this.sibling); });
      before(function() { this.parent.insertBefore(this.node); });

      it("returns the sibling", function() {
        expect(this.node.previousSibling).to.equal(this.sibling);
      });

    });

  });

  describe(".nextSibling", () => {

    it("returns null without a sibling", function() {
      expect(this.node.nextSibling).to.be.null;
    });

    context("with a next sibling", () => {

      before(function() { this.parent.insertBefore(this.node); });
      before(function() { this.parent.insertBefore(this.sibling); });

      it("returns the sibling", function() {
        expect(this.node.nextSibling).to.equal(this.sibling);
      });

    });

  });

  describe(".attributes", () => {

    it("returns null", function() {
      expect(this.node.attributes).to.be.null;
    });

  });

  describe(".ownerDocument", () => {

    it("returns null without a document", function() {
      expect(this.node.ownerDocument).to.be.null;
    });

    context("when contained within a document", () => {

      xit("returns the owning document", function() {
        expect(this.node.ownerDocument).to.equal(this.document);
      });

    });

  });

  describe('.insertBefore()', () => {

    it("raises an error", function() {
      expect(() => this.node.insertBefore(this.newChild, this.child)).to.throw(DOMException);
    });

  });

  describe('.replaceChild()', () => {

    it("raises an error", function() {
      expect(() => this.node.replaceChild(this.newChild, this.child)).to.throw(DOMException);
    });

  });

  describe('.removeChild()', () => {

    it("raises an error", function() {
      expect(() => this.node.removeChild(this.child)).to.throw(DOMException);
    });

  });

  describe('.appendChild()', () => {

    it("raises an error", function() {
      expect(() => this.node.appendChild(this.child)).to.throw(DOMException);
    });

  });

  describe('.hasChildNodes()', () => {

    it("returns false", function() {
      expect(this.node.hasChildNodes()).to.be.false;
    });

  });

  describe('.cloneNode()', () => {

    it("raises an error", function() {
      expect(() => this.node.cloneNode()).to.throw('not implemented');
    });

  });

});
