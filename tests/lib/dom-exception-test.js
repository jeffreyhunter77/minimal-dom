require('../setup');

var DOMException = require('../../lib/dom-exception');

describe(DOMException, () => {

  describe("error code constants", () => {

    it("defines INDEX_SIZE_ERR as 1", function() {
      expect(DOMException.INDEX_SIZE_ERR).to.equal(1);
    });

    it("defines DOMSTRING_SIZE_ERR as 2", function() {
      expect(DOMException.DOMSTRING_SIZE_ERR).to.equal(2);
    });

    it("defines HIERARCHY_REQUEST_ERR as 3", function() {
      expect(DOMException.HIERARCHY_REQUEST_ERR).to.equal(3);
    });

    it("defines WRONG_DOCUMENT_ERR as 4", function() {
      expect(DOMException.WRONG_DOCUMENT_ERR).to.equal(4);
    });

    it("defines INVALID_CHARACTER_ERR as 5", function() {
      expect(DOMException.INVALID_CHARACTER_ERR).to.equal(5);
    });

    it("defines NO_DATA_ALLOWED_ERR as 6", function() {
      expect(DOMException.NO_DATA_ALLOWED_ERR).to.equal(6);
    });

    it("defines NO_MODIFICATION_ALLOWED_ERR as 7", function() {
      expect(DOMException.NO_MODIFICATION_ALLOWED_ERR).to.equal(7);
    });

    it("defines NOT_FOUND_ERR as 8", function() {
      expect(DOMException.NOT_FOUND_ERR).to.equal(8);
    });

    it("defines NOT_SUPPORTED_ERR as 9", function() {
      expect(DOMException.NOT_SUPPORTED_ERR).to.equal(9);
    });

    it("defines INUSE_ATTRIBUTE_ERR as 10", function() {
      expect(DOMException.INUSE_ATTRIBUTE_ERR).to.equal(10);
    });

  });


  describe("constructor", () => {

    prop('errorCode', DOMException.WRONG_DOCUMENT_ERR);
    prop('error',     function() { return new DOMException(this.errorCode); });

    context("with a code", () => {

      it("sets the code property", function() {
        expect(this.error.code).to.equal(this.errorCode);
      });

      it("has a default message based on the code", function() {
        expect(this.error.message).to.match(/document/i);
      });

    });

    context("with a custom message", () => {

      prop('message', 'custom');
      prop('error',    function() {
        return new DOMException(this.errorCode, this.message); });

      it("uses the supplied message", function() {
        expect(this.error.message).to.equal(this.message);
      });

    });

  });

});
