require('../setup');

var Element = require('../../lib/element')
  , Node = require('../../lib/node')
  , DOMException = require('../../lib/dom-exception');

describe(Element, () => {

  prop('tagName',     'p');
  prop('element',     function() { return new Element(this.tagName); }, MEMOIZE);
  prop('newChild',    function() { return new Element('b'); }, MEMOIZE);

  describe(".tagName", () => {

    it("returns the tag name", function() {
      expect(this.element.tagName).to.equal(this.tagName);
    });

  });

  describe(".nodeName", () => {

    it("returns tagName", function() {
      expect(this.element.nodeName).to.equal(this.element.tagName);
    });

  });

  describe('.nodeType', () => {

    it("returns ELEMENT_NODE", function() {
      expect(this.element.nodeType).to.equal(Node.ELEMENT_NODE);
    });

  });

  function itBehavesLikeAChildlessNode() {

    it("returns null for firstChild", function() {
      expect(this.element.firstChild).to.be.null;
    });

    it("returns null for lastChild", function() {
      expect(this.element.lastChild).to.be.null;
    });

    xit("returns an empty NodeList for childNodes", function() {
      expect(this.element.childNodes.length).to.equal(0);
    });

    it("returns false for hasChildNodes()", function() {
      expect(this.element.hasChildNodes()).to.be.false;
    });

  }

  context("with no children", () => {

    itBehavesLikeAChildlessNode();

  });

  describe(".insertBefore()", () => {

    context("for an empty element", () => {

      prop('result', function() { return this.element.insertBefore(this.newChild); }, MEMOIZE);

      it("returns the inserted node", function() {
        expect(this.result).to.equal(this.newChild);
      });

      context("after insertion", () => {

        before(function() { this.result; });

        it("sets itself as the child's parent", function() {
          expect(this.newChild.parentNode).to.equal(this.element);
        });

        it("returns child as the first child", function() {
          expect(this.element.firstChild).to.equal(this.newChild);
        });

        it("returns child as the last child", function() {
          expect(this.element.lastChild).to.equal(this.newChild);
        });

        it("returns true for hasChildNodes()", function() {
          expect(this.element.hasChildNodes()).to.be.true;
        });

        it("leaves the child's next sibling as null", function() {
          expect(this.newChild.nextSibling).to.be.null;
        });

        it("leaves the child's previous sibling as null", function() {
          expect(this.newChild.previousSibling).to.be.null;
        });

        it("includes child in the childNodes NodeList");
      });

    });

    context("for an element with one child", () => {

      prop('child', function() { return new Element('em'); }, MEMOIZE);

      before(function() { this.element.insertBefore(this.child); }, MEMOIZE);

      context("when called with the existing child", () => {

        before(function() { this.element.insertBefore(this.newChild, this.child); }, MEMOIZE);

        it("inserts the new child at the beginning of the list", function() {
          expect(this.element.firstChild).to.equal(this.newChild);
        });

        it("retains the existing child at the end of the list", function() {
          expect(this.element.lastChild).to.equal(this.child);
        });

        it("sets the existing child as the new child's next sibling", function() {
          expect(this.newChild.nextSibling).to.equal(this.child);
        });

        it("leaves the new child's previous sibling as null", function() {
          expect(this.newChild.previousSibling).to.be.null;
        });

        it("leaves the existing child's next sibling as null", function() {
          expect(this.child.nextSibling).to.be.null;
        });

        it("sets the existing child's previous sibling to the new child", function() {
          expect(this.child.previousSibling).to.equal(this.newChild);
        });

      });

      context("when called without an argument", () => {

        before(function() { this.element.insertBefore(this.newChild); }, MEMOIZE);

        it("inserts the new child at the end of the list", function() {
          expect(this.element.lastChild).to.equal(this.newChild);
        });

        it("retains the existing child at the beginning of the list", function() {
          expect(this.element.firstChild).to.equal(this.child);
        });

        it("sets the existing child as the new child's previous sibling", function() {
          expect(this.newChild.previousSibling).to.equal(this.child);
        });

        it("leaves the new child's next sibling as null", function() {
          expect(this.newChild.nextSibling).to.be.null;
        });

        it("leaves the existing child's previous sibling as null", function() {
          expect(this.child.previousSibling).to.be.null;
        });

        it("sets the existing child's next sibling to the new child", function() {
          expect(this.child.nextSibling).to.equal(this.newChild);
        });

      });

    });

    context("for an element with multiple children", () => {

      prop('leftChild',  function() { return new Element('em'); }, MEMOIZE);
      prop('rightChild', function() { return new Element('strong'); }, MEMOIZE);

      before(function() { this.element.insertBefore(this.rightChild); }, MEMOIZE);
      before(function() { this.element.insertBefore(this.leftChild, this.rightChild); }, MEMOIZE);

      context("when inserted between existing children", () => {

        before(function() { this.element.insertBefore(this.newChild, this.rightChild); }, MEMOIZE);

        it("retains the existing child at the beginning of the list", function() {
          expect(this.element.firstChild).to.equal(this.leftChild);
        });

        it("retains the existing child at the end of the list", function() {
          expect(this.element.lastChild).to.equal(this.rightChild);
        });

        it("sets the existing right child as the new child's next sibling", function() {
          expect(this.newChild.nextSibling).to.equal(this.rightChild);
        });

        it("sets the existing left child as new child's previous sibling", function() {
          expect(this.newChild.previousSibling).to.equal(this.leftChild);
        });

        it("leaves the existing right child's next sibling as it was", function() {
          expect(this.rightChild.nextSibling).to.be.null;
        });

        it("sets the existing right child's previous sibling to the new child", function() {
          expect(this.rightChild.previousSibling).to.equal(this.newChild);
        });

        it("sets the existing left child's next sibling to the new child", function() {
          expect(this.leftChild.nextSibling).to.equal(this.newChild);
        });

        it("leaves the existing left child's previous sibling as it was", function() {
          expect(this.leftChild.previousSibling).to.be.null;
        });

      });

    });

    context("when called to insert on a child that is not its own", () => {

      prop('wrongChild',  function() { return new Element('em'); }, MEMOIZE);

      it("throws an error", function() {
        expect(
          () => this.element.insertBefore(this.newChild, this.wrongChild)
        ).to.throw(DOMException)
      });

    });

    context("when called with a new child that exists elsewhere in the tree", () => {

      prop('otherParent', function() { return new Element('div'); }, MEMOIZE);
      prop('newChild',    function() { return this.otherParent.insertBefore(new Element('div')); }, MEMOIZE);

      it("first removes the child from its existing location", function() {
        this.element.insertBefore(this.newChild);
        expect(this.otherParent.hasChildNodes()).to.be.false;
      });

      context("when that child is an ancestor", () => {

        prop('parent', function() { return new Element('div'); }, MEMOIZE);

        before(function() { this.newChild.insertBefore(this.parent); });
        before(function() { this.parent.insertBefore(this.element); });

        it("throws an error", function() {
          expect(() => this.element.insertBefore(this.newChild)).to.throw(DOMException);
        });

      });

    });

  });


  describe(".removeChild()", () => {

    prop('child',      function() { return new Element('b'); }, MEMOIZE);
    prop('leftChild',  function() { return new Element('i'); }, MEMOIZE);
    prop('rightChild', function() { return new Element('u'); }, MEMOIZE);

    context("when removing a middle child", () => {

      before(function() {
        this.element.insertBefore(this.leftChild);
        this.element.insertBefore(this.child);
        this.element.insertBefore(this.rightChild);
      });

      it("returns the removed child", function() {
        expect(this.element.removeChild(this.child)).to.equal(this.child);
      });

      context("after removal", () => {

        before(function() { this.element.removeChild(this.child); });

        it("sets the child's parent to null", function() {
          expect(this.child.parentNode).to.be.null;
        });

        it("sets the child's previous sibling to null", function() {
          expect(this.child.previousSibling).to.be.null;
        });

        it("sets the child's next sibling to null", function() {
          expect(this.child.nextSibling).to.be.null;
        });

        it("updates the next sibling of the previous sibling", function() {
          expect(this.leftChild.nextSibling).to.equal(this.rightChild);
        });

        it("updates the previous sibling of the next sibling", function() {
          expect(this.rightChild.previousSibling).to.equal(this.leftChild);
        });

        it("leaves firstChild unchanged", function() {
          expect(this.element.firstChild).to.equal(this.leftChild);
        });

        it("leaves lastChild unchanged", function() {
          expect(this.element.lastChild).to.equal(this.rightChild);
        });

      });

    });

    context("when removing the first child", () => {

      before(function() {
        this.element.insertBefore(this.child);
        this.element.insertBefore(this.rightChild);
      });

      before(function() { this.element.removeChild(this.child); });

      it("updates the previous sibling of the next sibling", function() {
        expect(this.rightChild.previousSibling).to.be.null;
      });

      it("updates firstChild", function() {
        expect(this.element.firstChild).to.equal(this.rightChild);
      });

    });

    context("when removing the last child", () => {

      before(function() {
        this.element.insertBefore(this.leftChild);
        this.element.insertBefore(this.child);
      });

      before(function() { this.element.removeChild(this.child); });

      it("updates the next sibling of the previous sibling", function() {
        expect(this.leftChild.nextSibling).to.be.null;
      });

      it("updates lastChild", function() {
        expect(this.element.lastChild).to.equal(this.leftChild);
      });

    });

    context("when removing the only child", () => {

      before(function() { this.element.insertBefore(this.child); });
      before(function() { this.element.removeChild(this.child); });

      itBehavesLikeAChildlessNode();

    });

    context("when called with a child that is not its own", () => {

      prop('wrongChild', function() { return new Element('em'); }, MEMOIZE);

      it("throws an error", function() {
        expect(() => this.element.removeChild(this.wrongChild)).to.throw(DOMException)
      });

    });

  });


  describe('.replaceChild()', function() {

    prop('childA', function() { return new Element('div'); }, MEMOIZE);
    prop('childB', function() { return new Element('div'); }, MEMOIZE);
    prop('childC', function() { return new Element('div'); }, MEMOIZE);

    before(function() {
      this.element.insertBefore(this.childA);
      this.element.insertBefore(this.childB);
      this.element.insertBefore(this.childC);
    });

    it("returns the removed child", function() {
      expect(this.element.replaceChild(this.newChild, this.childB)).to.equal(this.childB);
    });

    context("after replacing the child", function() {

      before(function() { this.element.replaceChild(this.newChild, this.childB); });

      it("removes the existing child", function() {
        expect(this.childB.parentNode).to.be.null;
      });

      it("inserts the new child at its old location", function() {
        expect(this.newChild.previousSibling).to.equal(this.childA);
        expect(this.newChild.nextSibling).to.equal(this.childC);
      });

    });

  });


  describe('.appendChild()', () => {

    prop('existingChild', function() { return new Element('em'); }, MEMOIZE);

    before(function() { this.element.insertBefore(this.existingChild); });
    before(function() { this.element.appendChild(this.newChild); });

    it('adds the child to the end of list of children', function() {
      expect(this.element.lastChild).to.equal(this.newChild);
    });

  });


  describe('.cloneNode()', () => {

    prop('deep',   false);
    prop('result', function() { return this.element.cloneNode(this.deep); }, MEMOIZE);

    it('returns a new element', function() {
      expect(this.result).to.be.an.instanceOf(Element);
    });

    it('returns an element with the same tag name', function() {
      expect(this.result.tagName).to.equal(this.element.tagName);
    });

    context("when the element has children", function() {

      prop('childA', function() { return new Element('span'); }, MEMOIZE);
      prop('childB', function() { return new Element('strong'); }, MEMOIZE);
      prop('childC', function() { return new Element('em'); }, MEMOIZE);

      before(function() {
        this.element.appendChild(this.childA);
        this.childA.appendChild(this.childB);
        this.element.appendChild(this.childC);
      });

      it('does not clone the children when called with a falsey value', function() {
        expect(this.result.hasChildNodes()).to.be.false;
      });

      context("when called with true", function() {

        prop('deep', true);

        it("copies the element's children", function() {
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

});
