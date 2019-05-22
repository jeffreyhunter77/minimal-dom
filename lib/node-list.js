class NodeListIterator {

  constructor(list, valueFormat) {
    this._index = 0;
    this._child = list._firstChild();
    this._value = valueFormat;
  }

  next() {
    if (this._child) {

      let result = {value: this._value(), done: false};

      this._child = this._child.nextSibling;
      this._index += 1;

      return result;

    } else {

      return {value: undefined, done: true};

    }
  }

}

class NodeList {

  constructor(parent) {
    if (arguments.length > 0)
      this._node = parent;
  }

  get length() {
    var count = 0;

    for (var child = this._firstChild(); child; child = child.nextSibling) {
      count += 1;
    }

    return count;
  }

  item(index) {
    var i = 0;

    for (var child = this._firstChild(); child; child = child.nextSibling) {
      if (index == i)
        return child;

      i += 1;
    }

    return null;
  }

  forEach(callback, thisArg) {
    var index = 0;

    for (var child = this._firstChild(); child; child = child.nextSibling) {
      callback.call(thisArg, child, index, this);
      index += 1;
    }

  }

  entries() {
    return new NodeListIterator(this, function() { return [this._index, this._child]; });
  }

  keys() {
    return new NodeListIterator(this, function() { return this._index; });
  }

  values() {
    return new NodeListIterator(this, function() { return this._child; });
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
        } else {
          return target[prop];
        }
      },

      has: function(target, key) {
        if ( isIndex(key) )
          return Number.parseInt(key) < target.length;
        else
          return key in target;
      }

    });
  }

  _firstChild() {
    return this._node ? this._node.firstChild : null;
  }
}

module.exports = NodeList;
