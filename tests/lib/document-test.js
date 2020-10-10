require('../setup');

var Document = require('../../lib/document')
  , Node = require('../../lib/node')
  , Element = require('../../lib/element')
  , Text = require('../../lib/text')
  , Attr = require('../../lib/attr')
  , DOMException = require('../../lib/dom-exception')
  , DocumentFragment = require('../../lib/document-fragment')
;

describe(Document, () => {

  prop('emptyDoc', function() { return new Document(); });
  prop('doc',      function() { return new Document(); });
  prop('root',     function() { return new Element('html'); });
  prop('newRoot',  function() { return new Element('html'); });
  prop('textNode', function() { return new Text('hello'); });

  before(function() { this.doc.appendChild(this.root); });

  describe('.nodeName', () => {

    it('returns #document', function() {
      expect(this.doc.nodeName).to.equal('#document');
    });

  });

  describe('.nodeType', () => {

    it('returns DOCUMENT_NODE', function() {
      expect(this.doc.nodeType).to.equal(Node.DOCUMENT_NODE);
    });

  });

  describe('.childNodes', () => {

    context('with an empty document', () => {

      it('returns an empty list', function() {
        expect(this.emptyDoc.childNodes.length).to.equal(0);
      });

    });

    context('with a document element', () => {

      it('returns a list with one item', function() {
        expect(this.doc.childNodes.length).to.equal(1);
      });

      it('returns a list containing the document element', function() {
        expect(this.doc.childNodes.item(0)).to.equal(this.root);
      });

    });

  });

  describe('.firstChild', () => {

    context('with an empty document', () => {

      it('returns null', function() {
        expect(this.emptyDoc.firstChild).to.be.null;
      });

    });

    context('with a document element', () => {

      it('returns the document element', function() {
        expect(this.doc.firstChild).to.equal(this.root);
      });

    });

  });

  describe('.lastChild', () => {

    context('with an empty document', () => {

      it('returns null', function() {
        expect(this.emptyDoc.lastChild).to.be.null;
      });

    });

    context('with a document element', () => {

      it('returns the document element', function() {
        expect(this.doc.lastChild).to.equal(this.root);
      });

    });

  });

  describe('.insertBefore()', () => {

    context('with an empty document and no before element', () => {

      prop('result', function() { return this.emptyDoc.insertBefore(this.newRoot); });

      before(function() { this.result });

      it('sets the new node as the document element', function() {
        expect(this.emptyDoc.documentElement).to.equal(this.newRoot);
      });

      it('sets itself as the parent node', function() {
        expect(this.newRoot.parentNode).to.equal(this.emptyDoc);
      });

      it('returns the inserted node', function() {
        expect(this.result).to.equal(this.newRoot);
      });

    });

    it('throws an exception if the document is not empty', function() {
      expect(() => this.doc.insertBefore(this.newRoot)).to.throw(DOMException);
    });

    it('throws an exception if a before node is supplied', function() {
      expect(() => this.emptyDoc.insertBefore(this.newRoot, this.root)).to.throw(DOMException);
    });

    it('throws an exception if given a non-element node', function() {
      expect(() => this.emptyDoc.insertBefore(this.textNode)).to.throw(DOMException);
    });

  });

  describe('.replaceChild()', () => {

    context('with the document element', () => {

      prop('result', function() { return this.doc.replaceChild(this.newRoot, this.root); });

      before(function() { this.result; });

      it('returns the replaced node', function() {
        expect(this.result).to.equal(this.root);
      });

      it('replaces the document element', function() {
        expect(this.doc.documentElement).to.equal(this.newRoot);
      });

    });

    context('given any other element', () => {

      it('throws an exception', function() {
        expect(() => this.emptyDoc.replaceChild(this.newRoot, this.root))
          .to.throw(DOMException);
      });

    });

  });

  describe('.removeChild()', () => {

    context('with the document element', () => {

      prop('result', function() { return this.doc.removeChild(this.root); });

      before(function() { this.result });

      it('returns the removed element', function() {
        expect(this.result).to.equal(this.root);
      });

      it('removes the element', function() {
        expect(this.doc.hasChildNodes()).to.be.false;
      });

      it('unsets the parent node of the element', function() {
        expect(this.root.parentNode).to.be.null;
      });

    });

    context('any other time', () => {

      it('throws an exception', function() {
        expect(() => this.doc.removeChild(this.newRoot)).to.throw(DOMException);
      });

    });

  });

  describe('.appendChild()', () => {

    context('with an empty document', () => {

      prop('result', function() { return this.emptyDoc.appendChild(this.newRoot); });

      before(function() { this.result });

      it('returns the added child', function() {
        expect(this.result).to.equal(this.newRoot);
      });

      it('sets the element as the document element', function() {
        expect(this.emptyDoc.documentElement).to.equal(this.newRoot);
      });

    });

    context('any other time', () => {

      it('throws an exception', function() {
        expect(() => this.doc.appendChild(this.newRoot)).to.throw(DOMException);
      });

    });

  });

  describe('.hasChildNodes()', () => {

    it('returns false for an empty document', function() {
      expect(this.emptyDoc.hasChildNodes()).to.be.false;
    });

    it('returns true for a non-empty document', function() {
      expect(this.doc.hasChildNodes()).to.be.true;
    });

  });

  describe('.cloneNode()', () => {

    prop('flag',   false);
    prop('result', function() { return this.doc.cloneNode(this.flag); });

    it('returns a Document', function() {
      expect(this.result).to.be.an.instanceOf(Document);
    });

    it('returns a new node', function() {
      expect(this.result).to.not.equal(this.doc);
    });

    context('called with false', () => {

      it("returns an empty document", function() {
        expect(this.result.hasChildNodes()).to.be.false;
      });

    });

    context('called with true', () => {

      prop('flag', true);

      it("copies the document's children", function() {
        expect(this.result.documentElement.tagName).to.equal(this.root.tagName);
      });

      it('succeeds for an empty document', function() {
        expect(this.emptyDoc.cloneNode(this.flag)).to.be.an.instanceOf(Document);
      });

    });

  });

  describe('.documentElement', () => {

    context('with an empty document', () => {

      it('returns null', function() {
        expect(this.emptyDoc.documentElement).to.be.null;
      });

    });

    context('with a non-empty document', () => {

      it('returns the root element', function() {
        expect(this.doc.documentElement).to.equal(this.root);
      });

    });

  });

  describe('.createElement()', () => {

    context('with a valid name', () => {

      prop('name',   'body');
      prop('result', function() { return this.doc.createElement(this.name); });

      it('returns a new Element', function() {
        expect(this.result).to.be.an.instanceOf(Element);
      });

      it('assigns the requested name to the Element', function() {
        expect(this.result.tagName).to.equal(this.name);
      });

    });

    it("throws an exception when name begins with an invalid start character", function() {
      expect(() => this.doc.createElement('.wrong')).to.throw(DOMException);
    });

    it("throws an exception when name contains an invalid character", function() {
      expect(() => this.doc.createElement('wro<=>ng')).to.throw(DOMException);
    });

  });

  describe('.createDocumentFragment()', () => {

    prop('result', function() { return this.doc.createDocumentFragment(); });

    it('returns a new DocumentFragment', function() {
      expect(this.result).to.be.an.instanceOf(DocumentFragment);
    });

    it('sets the owner document of the fragment', function() {
      expect(this.result.ownerDocument).to.equal(this.doc);
    });

  });

  describe('.createTextNode()', () => {

    prop('value',  'hello');
    prop('result', function() { return this.doc.createTextNode(this.value); });

    it('returns a new Text node', function() {
      expect(this.result).to.be.an.instanceOf(Text);
    });

    it('assigns the requested data to the node', function() {
      expect(this.result.data).to.equal(this.value);
    });

  });

  describe('.createAttribute()', () => {

    context('with a valid name', () => {

      prop('name',   'lang');
      prop('result', function() { return this.doc.createAttribute(this.name); });

      it('returns a new Attr', function() {
        expect(this.result).to.be.an.instanceOf(Attr);
      });

      it('assigns the requested name to the Attr', function() {
        expect(this.result.name).to.equal(this.name);
      });

    });

    it("throws an exception when name begins with an invalid start character", function() {
      expect(() => this.doc.createAttribute('.wrong')).to.throw(DOMException);
    });

    it("throws an exception when name contains an invalid character", function() {
      expect(() => this.doc.createAttribute('wro<=>ng')).to.throw(DOMException);
    });

  });

});
