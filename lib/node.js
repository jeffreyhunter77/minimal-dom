var DOMException = require('./dom-exception')
  , NodeList = require('./node-list')
;

class Node {

  static get ELEMENT_NODE()                 { return 1; }
  static get ATTRIBUTE_NODE()               { return 2; }
  static get TEXT_NODE()                    { return 3; }
  static get CDATA_SECTION_NODE()           { return 4; }
  static get ENTITY_REFERENCE_NODE()        { return 5; }
  static get ENTITY_NODE()                  { return 6; }
  static get PROCESSING_INSTRUCTION_NODE()  { return 7; }
  static get COMMENT_NODE()                 { return 8; }
  static get DOCUMENT_NODE()                { return 9; }
  static get DOCUMENT_TYPE_NODE()           { return 10; }
  static get DOCUMENT_FRAGMENT_NODE()       { return 11; }
  static get NOTATION_NODE()                { return 12; }


  constructor(parent) {
    if (arguments.length > 0)
      this._parent = parent;
  }

  get nodeName()        { return null; }

  get nodeValue()       { return null; }
  set nodeValue(value)  { throw new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR); }

  get nodeType()        { return null; }
  get parentNode()      { return this._parent || null; }
  get childNodes()      { return new NodeList(); }
  get firstChild()      { return null; }
  get lastChild()       { return null; }
  get previousSibling() { return this._prev || null; }
  get nextSibling()     { return this._next || null; }
  get attributes()      { return null; }
  get ownerDocument()   { return null; }

  insertBefore(newChild, beforeChild) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
  }

  replaceChild(withChild, child) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
  }

  removeChild(child) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
  }

  appendChild(child) {
    throw new DOMException(DOMException.HIERARCHY_REQUEST_ERR);
  }

  hasChildNodes() {
    return false;
  }

  cloneNode(deep) {
    throw new Error('Method not implemented');
  }

}

module.exports = Node;
