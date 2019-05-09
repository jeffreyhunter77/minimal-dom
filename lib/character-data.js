var Node = require('./node')
  , DOMException = require('./dom-exception')
;

class CharacterData extends Node {

  constructor(text, parent) {
    super(parent);

    this.data = text ? text : '';
  }

  get length() {
    return String(this.data).length;
  }

  substringData(offset, count) {
    this._assertValidOffsetAndCount(offset, count);

    return String(this.data).substr(offset, count);
  }

  appendData(data) {
    this.data += data;
  }

  insertData(offset, data) {
    this._assertValidOffset(offset);

    this.data = this.data.substr(0, offset) + data + this.data.substr(offset);
  }

  deleteData(offset, count) {
    this._assertValidOffsetAndCount(offset, count);

    this.data = this.data.substr(0, offset) + this.data.substr(offset + count);
  }

  replaceData(offset, count, data) {
    this._assertValidOffsetAndCount(offset, count);

    this.data = this.data.substr(0, offset) + data + this.data.substr(offset + count);
  }

  _isInvalidOffset(offset) {
    return (offset < 0 || offset > this.length);
  }

  _isInvalidOffsetOrCount(offset, count) {
    return (count < 0 || this._isInvalidOffset(offset))
  }

  _assertValidOffset(offset) {
    if (this._isInvalidOffset(offset))
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
  }

  _assertValidOffsetAndCount(offset, count) {
    if (this._isInvalidOffsetOrCount(offset, count))
      throw new DOMException(DOMException.INDEX_SIZE_ERR);
  }
}

module.exports = CharacterData;
