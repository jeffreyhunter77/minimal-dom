function errorMessage(code, message) {
  if (arguments.length > 1)
    return message;
  else
    return DEFAULT_MESSAGES[code] || String(code);
}

class DOMException extends Error {

  static get INDEX_SIZE_ERR()               { return 1; }
  static get DOMSTRING_SIZE_ERR()           { return 2; }
  static get HIERARCHY_REQUEST_ERR()        { return 3; }
  static get WRONG_DOCUMENT_ERR()           { return 4; }
  static get INVALID_CHARACTER_ERR()        { return 5; }
  static get NO_DATA_ALLOWED_ERR()          { return 6; }
  static get NO_MODIFICATION_ALLOWED_ERR()  { return 7; }
  static get NOT_FOUND_ERR()                { return 8; }
  static get NOT_SUPPORTED_ERR()            { return 9; }
  static get INUSE_ATTRIBUTE_ERR()          { return 10; }

  constructor(code, ...params) {
    super(errorMessage(code, ...params), ...params);

    this.code = code;
  }

}

var DEFAULT_MESSAGES = {
  [DOMException.INDEX_SIZE_ERR]:              'Invalid index size',
  [DOMException.DOMSTRING_SIZE_ERR]:          'String size too large',
  [DOMException.HIERARCHY_REQUEST_ERR]:       'Invalid location for node or node type',
  [DOMException.WRONG_DOCUMENT_ERR]:          'Node document does not match',
  [DOMException.INVALID_CHARACTER_ERR]:       'Invalid character',
  [DOMException.NO_DATA_ALLOWED_ERR]:         'Data not allowed for node',
  [DOMException.NO_MODIFICATION_ALLOWED_ERR]: 'Modification not allowed',
  [DOMException.NOT_FOUND_ERR]:               'Not found',
  [DOMException.NOT_SUPPORTED_ERR]:           'Object or operation not supported',
  [DOMException.INUSE_ATTRIBUTE_ERR]:         'Attribute already in use'
};

module.exports = DOMException;
