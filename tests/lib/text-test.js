require('../setup');

var Text = require('../../lib/text')
  , Node = require('../../lib/node')
  , Element = require('../../lib/element')
  , DOMException = require('../../lib/dom-exception')
;

describe(Text, () => {

  prop('content', 'Hello world!');
  prop('text',    function() { return new Text(this.content); });

  describe('.nodeName', () => {

    it('returns #text', function() {
      expect(this.text.nodeName).to.equal('#text');
    });

  });

  describe('.nodeValue', () => {

    it('returns the value of .data', function() {
      expect(this.text.nodeValue).to.equal(this.text.data);
    });

  });

  describe('.nodeType', () => {

    it('returns Node.TEXT_NODE', function() {
      expect(this.text.nodeType).to.equal(Node.TEXT_NODE);
    });

  });

  describe('.outerHTML', () => {

    it('returns the text content', function() {
      expect(this.text.outerHTML).to.equal(this.content)
    });

    context('when the text contains special characters', () => {

      prop('content', 'For example, the <span> & <div> tags:');

      it('escapes those characters', function() {
        expect(this.text.outerHTML).to
          .equal('For example, the &lt;span&gt; &amp; &lt;div&gt; tags:');
      });

    });

  });

  describe('.cloneNode()', () => {

    prop('result', function() { return this.text.cloneNode(false); });

    it('returns a Text node', function() {
      expect(this.result).to.be.an.instanceOf(Text);
    });

    it('returns a new node', function() {
      expect(this.result).to.not.equal(this.text);
    });

    it('copies the node data', function() {
      expect(this.result.data).to.equal(this.text.data);
    });

  });

  describe('.splitText()', () => {

    prop('parent',  function() { return new Element('p'); });
    prop('sibling', function() { return new Text('!'); });

    before(function() {
      if (this.parent) {
        this.parent.appendChild(this.text);
        this.parent.appendChild(this.sibling);
      }
    });

    context('when called with a valid offset', () => {

      prop('newNode', function() { return this.text.splitText(6); });

      before(function() { this.newNode; });

      it("truncates this node's data before the specified offset", function() {
        expect(this.text.data).to.equal('Hello ');
      });

      it("returns a new text node", function() {
        expect(this.newNode).to.be.an.instanceOf(Text);
        expect(this.newNode).to.not.equal(this.text);
      });

      it("sets the new node's data as the content from the offset onward", function() {
        expect(this.newNode.data).to.equal('world!');
      });

      it("sets the new node's parent to this node's parent", function() {
        expect(this.newNode.parentNode).to.equal(this.text.parentNode);
      });

      it("inserts the new text node after this node", function() {
        expect(this.text.nextSibling).to.equal(this.newNode);
      });

    });

    context("when this node does not have a parent", () => {

      prop('parent',  false);
      prop('sibling', function() { return this.text.splitText(11); });
      prop('newNode', function() { return this.text.splitText(6); });

      before(function() { this.sibling; });
      before(function() { this.newNode; });

      it("sets the new text node as this node's next sibling", function() {
        expect(this.text.nextSibling).to.equal(this.newNode);
      });

      it("sets the new node's previous sibling to this node", function() {
        expect(this.newNode.previousSibling).to.equal(this.text);
      });

      it("sets this new node's next sibling to this node's old next sibling", function() {
        expect(this.newNode.nextSibling).to.equal(this.sibling);
      });

      it("sets the old next sibling's previous sibling to the new node", function() {
        expect(this.sibling.previousSibling).to.equal(this.newNode);
      });

    });

    it('throws if offset is negative', function() {
      expect(() => this.text.splitText(-1)).to.throw(DOMException);
    });

    it('throws if offset is greater than the number of characters in data', function() {
      expect(() => this.text.splitText(this.text.length + 1)).to.throw(DOMException);
    });

  });

});
