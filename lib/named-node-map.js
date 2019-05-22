class NamedNodeMap {

  constructor(element) {
    this._elem = element;
  }

  getNamedItem(name) {
    return this._elem.getAttributeNode(name);
  }

  setNamedItem(node) {
    return this._elem.setAttributeNode(node);
  }

  removeNamedItem(name) {
    let node = this._elem.getAttributeNode(name);

    if (node)
      return this._elem.removeAttributeNode(node);

    return null;
  }

  item(index) {
    let keys = this._keys();

    if (index < 0 || index >= keys.length)
      return null;

    return this._elem.getAttributeNode(keys[index]);
  }

  get length() {
    return this._keys().length;
  }

  proxy() {
    function isIndex(prop) {
      return ( Number.isInteger(prop) || ('string' === typeof prop && /^\d+$/.test(prop)) );
    }

    return new Proxy(this, {

      get: function(target, prop, receiver) {
        if ( isIndex(prop) ) {
          let item = target.item(Number.parseInt(prop));
          return item === null ? undefined : item;
        } else if ( (! (prop in target)) && (target._keys().indexOf(prop) !== -1) ) {
          return target.getNamedItem(prop);
        } else {
          return target[prop];
        }
      },

      has: function(target, key) {
        if ( isIndex(key) )
          return Number.parseInt(key) < target.length;
        else
          return ((key in target) || (target._keys().indexOf(key) !== -1));
      }

    });
  }

  _keys() {
    return Object.keys(this._elem._attrs || {});
  }

}

module.exports = NamedNodeMap;
