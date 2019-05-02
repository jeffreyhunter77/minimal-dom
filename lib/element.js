var DOMException = require('./dom-exception')
  , Node = require('./node')
  , NodeList = require('./node-list')
;

const ATTRIBUTE_SPECIAL_CHARACTERS = Object.freeze({
  '"': '&quot;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
});

class Element extends Node {

  constructor(tagName, parent) {
    super(parent);

    this._name = tagName;
  }

  get tagName()    { return this._name; }
  get nodeName()   { return this.tagName; }
  get nodeType()   { return Node.ELEMENT_NODE; }

  get childNodes() { return (new NodeList(this)).proxy(); }

  get firstChild() { return this._head || null; }
  get lastChild()  { return this._tail || null; }

  insertBefore(newChild, beforeChild) {
    if (this._isAncestorOrSelf(newChild))
      throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);

    if (newChild.parentNode)
      newChild.parentNode.removeChild(newChild);

    if (beforeChild && ! this._isChildNode(beforeChild))
      throw new DOMException(DOMException.NOT_FOUND_ERR);

    if (! beforeChild) {

      newChild._prev = this._tail;
      this._tail = newChild;

    } else {

      newChild._prev = beforeChild.previousSibling;
      newChild._next = beforeChild;
      beforeChild._prev = newChild;

    }

    if (newChild._prev)
      newChild._prev._next = newChild;
    else
      this._head = newChild;

    newChild._parent = this;

    return newChild;
  }


  replaceChild(withChild, child) {
    this.insertBefore(withChild, child);

    return this.removeChild(child);
  }

  removeChild(child) {
    if (! this._isChildNode(child))
      throw new DOMException(DOMException.NOT_FOUND_ERR);

    if (child._prev)
      child._prev._next = child.nextSibling;
    else
      this._head = child.nextSibling;

    if (child._next)
      child._next._prev = child.previousSibling;
    else
      this._tail = child.previousSibling;

    child._parent = null;
    child._next = null;
    child._prev = null;

    return child;
  }

  appendChild(child) {
    this.insertBefore(child);
  }

  hasChildNodes() {
    if (this._head)
      return true;

    return false;
  }

  getAttribute(name) {
    if (! this._attrs)
      return null;

    return this._attrs[name] || null;
  }

  setAttribute(name, value) {
    if (! this._attrs) this._attrs = {};

    this._attrs[name] = value;
  }

  removeAttribute(name) {
    if (! this._attrs) return;

    delete this._attrs[name];
  }

  cloneNode(deep) {
    let clone = new Element(this.tagName);

    if (this._attrs) {
      for (var name in this._attrs) {
        clone.setAttribute(name, this.getAttribute(name));
      }
    }

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

    var attrEsc = (value) => {
      return value.replace(/["&<>]/g, (char) => ATTRIBUTE_SPECIAL_CHARACTERS[char]);
    };

    var attrs = () => {
      return Object.keys(this._attrs || {})
        .map((name) => { return ` ${name}="${attrEsc(this._attrs[name])}"`; })
        .join('');
    };

    if (this.hasChildNodes()) {

      var str = `<${this.tagName}${attrs()}>`;

      for (var child = this.firstChild; child; child = child.nextSibling) {
        str += child.toString();
      }

      return str + `</${this.tagName}>`;

    } else {
      return `<${this.tagName}${attrs()} />`;
    }
  }

  _isChildNode(node) {
    var cur = this.firstChild;

    while (cur) {
      if (node === cur)
        return true;

      cur = cur.nextSibling;
    }

    return false;
  }

  _isAncestorOrSelf(node) {
    var cur = this;

    while (cur) {
      if (node === cur)
        return true;

      cur = cur.parentNode;
    }

    return false;
  }
}

module.exports = Element;
