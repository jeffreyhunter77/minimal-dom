require('../setup');

var DocumentFragment = require('../../lib/document-fragment')
  , Document = require('../../lib/document')
  , Node = require('../../lib/node')
  , Element = require('../../lib/element')
;

describe(DocumentFragment, () => {

  prop('doc',      function() { return new Document(); });
  prop('fragment', function() { return new DocumentFragment(this.doc); });
  prop('newChild', function() { return new Element('div'); });

  describe(".nodeName", () => {

    it("returns #document-fragment", function() {
      expect(this.fragment.nodeName).to.equal('#document-fragment');
    });

  });

  describe('.nodeType', () => {

    it("returns DOCUMENT_FRAGMENT_NODE", function() {
      expect(this.fragment.nodeType).to.equal(Node.DOCUMENT_FRAGMENT_NODE);
    });

  });

  context('with no children', () => {

    it("returns null for firstChild", function() {
      expect(this.fragment.firstChild).to.be.null;
    });

    it("returns null for lastChild", function() {
      expect(this.fragment.lastChild).to.be.null;
    });

    it("returns an empty NodeList for childNodes", function() {
      expect(this.fragment.childNodes.length).to.equal(0);
    });

    it("returns false for hasChildNodes()", function() {
      expect(this.fragment.hasChildNodes()).to.be.false;
    });

  });

  context('with children', () => {

    before(function() { this.fragment.insertBefore(this.newChild); });

    it("returns true for hasChildNodes()", function() {
      expect(this.fragment.hasChildNodes()).to.be.true;
    });

  });

  describe('.insertBefore()', () => {

    before(function() { this.fragment.insertBefore(this.newChild); });

    it("inserts a new child", function() {
      expect(this.fragment.firstChild).to.equal(this.newChild);
    });

  });

  describe('.removeChild()', () => {

    prop('child', function() { return new Element('div'); });

    before(function() { this.fragment.insertBefore(this.child); });

    before(function() { this.fragment.removeChild(this.child); });

    it("removes the child from this parent", function() {
      expect(this.fragment.firstChild).to.be.null;
    });

  });

  describe('.replaceChild()', () => {

    prop('child', function() { return new Element('span'); });

    before(function() { this.fragment.insertBefore(this.child); });

    before(function() { this.fragment.replaceChild(this.newChild, this.child); });

    it("removes the existing child", function() {
      expect(this.child.parentNode).to.be.null;
    });

    it("adds the new child", function() {
      expect(this.fragment.firstChild).to.equal(this.newChild);
    });

  });

  describe('.appendChild()', () => {

    before(function() { this.fragment.appendChild(this.newChild); });

    it("inserts a new child at the end", function() {
      expect(this.fragment.lastChild).to.equal(this.newChild);
    });

  });

  describe('.cloneNode()', () => {

    prop('deep',   false);
    prop('result', function() { return this.fragment.cloneNode(this.deep); });

    it('returns a new fragment', function() {
      expect(this.result).to.be.an.instanceOf(DocumentFragment);
    });

    it('preserves the owning document', function() {
      expect(this.result.ownerDocument).to.equal(this.doc);
    });

    context("when the fragment has children", function() {

      prop('childA', function() { return new Element('span'); });
      prop('childB', function() { return new Element('strong'); });
      prop('childC', function() { return new Element('em'); });

      before(function() {
        this.fragment.appendChild(this.childA);
        this.childA.appendChild(this.childB);
        this.fragment.appendChild(this.childC);
      });

      it('does not clone the children when called with a falsey value', function() {
        expect(this.result.hasChildNodes()).to.be.false;
      });

      context("when called with true", function() {

        prop('deep', true);

        it("copies the fragment's children", function() {
          expect(this.result.hasChildNodes()).to.be.true;
        });

        it("maintains the same structure for the new children", function() {
          expect(this.result.firstChild).to.not.equal(this.childA);
          expect(this.result.firstChild.tagName).to.equal(this.childA.tagName);
          expect(this.result.firstChild.nextSibling).to.equal(this.result.lastChild);
          expect(this.result.lastChild).to.not.equal(this.childC);
          expect(this.result.lastChild.tagName).to.equal(this.childC.tagName);
        });

        it("copies the children's children", function() {
          expect(this.result.firstChild.firstChild.tagName).to.equal(this.childB.tagName);
        });

      });

    });

  });

  describe('.toString()', () => {

    context("for an empty fragment", () => {

      it('returns an empty string', function() {
        expect(this.fragment.toString()).to.equal('');
      });

    });

    context("for a fragment with children", () => {

      before(function() {
        this.fragment.insertBefore(new Element('em'));
        this.fragment.insertBefore(new Element('strong'));
      });

      it("serializes the children", function() {
        expect(this.fragment.toString()).to.equal('<em /><strong />');
      });

    });

  });

  context(".outerHTML", () => {

    it("returns the result of calling toString()", function() {
      expect(this.fragment.outerHTML).to.equal(this.fragment.toString());
    });

  });

});
