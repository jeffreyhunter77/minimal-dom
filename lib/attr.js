var Node = require('./node')
;

class Attr extends Node {

  constructor(element, name, value) {
    super(element);

    this._name = name || null;

    if (arguments.length > 2)
      this._value = value;
  }

  get nodeName()        { return this._name; }

  get nodeValue() {
    if (this._parent)
      return this._parent.getAttribute(this._name);

    return this._value || null;
  }

  get nodeType()        { return Node.ATTRIBUTE_NODE; }
  get parentNode()      { return null; }
  get name()            { return this.nodeName; }
  get specified()       { return true; }
  get value()           { return this.nodeValue; }

  set value(value) {
    if (this._parent)
      this._parent.setAttribute(this._name, value);
    else
      this._value = value;
  }

  cloneNode() {
    return new Attr(null, this._name, this._value);
  }

}

module.exports = Attr;
