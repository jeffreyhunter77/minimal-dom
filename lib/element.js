var DOMException = require('./dom-exception')
  , Node = require('./node')
  , Attr = require('./attr')
  , NamedNodeMap = require('./named-node-map')
  , assertValidName = require('./util').assertValidName
  , mixinParentNode = require('./util').mixinParentNode
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

    assertValidName(tagName);

    this._name = tagName;
  }

  get tagName()    { return this._name; }
  get nodeName()   { return this.tagName; }
  get nodeType()   { return Node.ELEMENT_NODE; }

  get attributes() { return (new NamedNodeMap(this)).proxy(); }

  get outerHTML()  { return this.toString(); }


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

  setAttributeNode(attr) {
    if (attr._parent && attr._parent !== this)
      throw new DOMException(DOMException.INUSE_ATTRIBUTE_ERR);

    let valueWas = null;
    if (this._attrs && attr.name in this._attrs)
      valueWas = new Attr(undefined, attr.name, this._attrs[attr.name]);

    this.setAttribute(attr.name, attr.value);
    attr._parent = this;

    return valueWas;
  }

  getAttributeNode(name) {
    if (this._attrs && name in this._attrs)
      return new Attr(this, name);

    return null;
  }

  removeAttributeNode(attr) {
    if (attr._parent !== this)
      throw new DOMException(DOMException.NOT_FOUND_ERR);

    let valueWas = attr.value;

    this.removeAttribute(attr.name);

    attr._parent = null;
    attr._value = valueWas;

    return attr;
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

}

mixinParentNode(Element);

module.exports = Element;
