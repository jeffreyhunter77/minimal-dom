var CharacterData = require('./character-data')
  , Node = require('./node')
;

const TEXT_SPECIAL_CHARACTERS = Object.freeze({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
});


class Text extends CharacterData {

  get nodeName()  { return '#text'; }
  get nodeValue() { return this.data; }
  get nodeType()  { return Node.TEXT_NODE; }
  get outerHTML() { return this.toString(); }

  toString() {
    return String(this.data).replace(/[&<>]/g, (char) => TEXT_SPECIAL_CHARACTERS[char]);
  }

  cloneNode(deep) {
    return new Text(this.data);
  }

  splitText(offset) {
    this._assertValidOffset(offset);

    let newData = this.data.substr(offset);

    this.data = this.data.substr(0, offset);

    let sibling = new Text(newData);

    if (this._parent) {

      this._parent.insertBefore(sibling, this._next);

    } else {

      sibling._next = this._next;
      sibling._prev = this;

      if (this._next) this._next._prev = sibling;
      this._next = sibling;

    }

    return sibling;
  }

}

module.exports = Text;
