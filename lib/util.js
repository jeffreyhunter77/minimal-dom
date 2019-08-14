var DOMException = require('./dom-exception')
  , NodeList = require('./node-list')
;

function assertValidName(name) {
  let nameRE = /^[:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}][\-.0-9:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u{10000}-\u{EFFFF}]*$/u;

  if (!nameRE.test(name))
    throw new DOMException(DOMException.INVALID_CHARACTER_ERR);
}

module.exports.assertValidName = assertValidName;


function mixinParentNode(classDef) {

  Object.defineProperty(classDef.prototype, 'childNodes', {
    get: function() { return (new NodeList(this)).proxy(); }
  });

  Object.defineProperty(classDef.prototype, 'firstChild', {
    get: function() { return this._head || null; }
  });

  Object.defineProperty(classDef.prototype, 'lastChild', {
    get: function() { return this._tail || null; }
  });

  classDef.prototype._isChildNode = function(node) {
    var cur = this.firstChild;

    while (cur) {
      if (node === cur)
        return true;

      cur = cur.nextSibling;
    }

    return false;
  }

  classDef.prototype._isAncestorOrSelf = function(node) {
    var cur = this;

    while (cur) {
      if (node === cur)
        return true;

      cur = cur.parentNode;
    }

    return false;
  }

  classDef.prototype.insertBefore = function(newChild, beforeChild) {
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

  classDef.prototype.replaceChild = function(withChild, child) {
    this.insertBefore(withChild, child);

    return this.removeChild(child);
  }

  classDef.prototype.removeChild = function(child) {
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

  classDef.prototype.appendChild = function(child) {
    this.insertBefore(child);
  }

  classDef.prototype.hasChildNodes = function() {
    if (this._head)
      return true;

    return false;
  }

  return classDef;

}

module.exports.mixinParentNode = mixinParentNode;
