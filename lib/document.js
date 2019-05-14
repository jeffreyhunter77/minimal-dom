var Node = require('./node')
  , NodeList = require('./node-list')
  , Element = require('./element')
  , Text = require('./text')
  , Attr = require('./attr')
  , DOMException = require('./dom-exception')
;

class Document extends Node {

  get nodeName()        { return '#document'; }
  get nodeType()        { return Node.DOCUMENT_NODE; }
  get childNodes()      { return new NodeList(this); }
  get firstChild()      { return this.documentElement; }
  get lastChild()       { return this.documentElement; }
  get documentElement() { return this._root || null; }

  insertBefore(newChild, beforeChild) {
    if (arguments.length > 1)
      throw new DOMException(DOMException.NOT_FOUND);
    if (this._root)
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
    if ( (!newChild) || (newChild.nodeType !== Node.ELEMENT_NODE) )
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);

    newChild._parent = this;

    this._root = newChild;

    return newChild;
  }

  replaceChild(withChild, child) {
    this.removeChild(child);

    this.insertBefore(withChild);

    return child;
  }

  removeChild(child) {
    if (child !== this._root)
      throw new DOMException(DOMException.NOT_FOUND);

    this._root = null;
    child._parent = null;

    return child;
  }

  appendChild(child) {
    this.insertBefore(child);

    return child;
  }

  hasChildNodes() {
    if (this._root)
      return true;
    else
      return false;
  }

  cloneNode(deep) {
    let clone = new Document();

    if (deep && this._root)
      clone.appendChild(this._root.cloneNode(deep));

    return clone;
  }

  createElement(tagName) {
    return new Element(tagName);
  }

  createTextNode(data) {
    return new Text(data);
  }

  createAttribute(name) {
    return new Attr(null, name);
  }
}

module.exports = Document;
