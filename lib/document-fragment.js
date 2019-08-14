var Node = require('./node')
  , mixinParentNode = require('./util').mixinParentNode
;

class DocumentFragment extends Node {

  get nodeName()    { return '#document-fragment'; }
  get nodeType()    { return Node.DOCUMENT_FRAGMENT_NODE; }

  get outerHTML()   { return this.toString(); }

  cloneNode(deep) {
    let clone = new DocumentFragment(this._parent);

    if (deep) {
      var child = this.firstChild;

      while (child) {
        clone.appendChild(child.cloneNode(deep));
        child = child.nextSibling;
      }
    }

    return clone;
  }

  toString() {

    var str = '';

    if (this.hasChildNodes()) {

      for (var child = this.firstChild; child; child = child.nextSibling) {
        str += child.toString();
      }

    }

    return str;

  }

}

mixinParentNode(DocumentFragment);

module.exports = DocumentFragment;
