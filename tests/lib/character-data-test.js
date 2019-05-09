require('../setup');

var CharacterData = require('../../lib/character-data')
  , DOMException = require('../../lib/dom-exception')
;

describe(CharacterData, () => {

  prop('emptyCD', function() { return new CharacterData(); }, MEMOIZE);
  prop('cd',      function() { return new CharacterData(this.text); }, MEMOIZE);
  prop('text',    'The quick brown fox jumps over the lazy dog.');

  describe('.data', () => {

    it('is an empty string by default', function() {
      expect(this.emptyCD.data).to.equal('')
    })

    it('is the text of the node when the node contains text', function() {
      expect(this.cd.data).to.equal(this.text)
    });

    it('can be set', function() {
      this.cd.data = 'some other text';
      expect(this.cd.data).to.equal('some other text')
    });

  });

  describe('.length', () => {

    it('returns the length of the text data', function() {
      expect(this.cd.length).to.equal(this.text.length);
    });

    it('returns 0 for no data', function() {
      expect(this.emptyCD.length).to.equal(0);
    });

  });

  describe('.substringData()', () => {

    it('returns the string at the specified offset and length', function() {
      expect(this.cd.substringData(2, 10)).to.equal('e quick br');
    });

    it('throws if the offset is negative', function() {
      expect(() => this.cd.substringData(-1, 5)).to.throw(DOMException);
    });

    it('throws if the offset is greater the number of characters in data', function() {
      expect(() => this.cd.substringData(this.text.length + 1, 5)).to.throw(DOMException);
    });

    it('returns an empty string if offset is equal to the number of characters', function() {
      expect(this.cd.substringData(this.text.length, 1)).to.equal('');
    });

    it('throws if count is negative', function() {
      expect(() => this.cd.substringData(0, -5)).to.throw(DOMException);
    });

  });

  describe('.appendData()', () => {

    prop('more', ' And they lived happily ever after.');

    before(function() { this.cd.appendData(this.more); });

    it('adds new text to the end of the existing data', function() {
      expect(this.cd.data).to.equal(this.text + this.more);
    });

  });

  describe('.insertData()', () => {

    prop('offset', 0);
    prop('more',   'Once upon a time, ');

    before(function() { this.cd.insertData(this.offset, this.more); });

    context('with an offset of 0', () => {

      it('inserts the text at the beginning of the string', function() {
        expect(this.cd.data).to.equal(this.more + this.text);
      });

    });

    context('with an offset in the middle of the string', () => {

      prop('offset', 4);
      prop('more',   'cunning ');

      it('inserts the text at the requested location', function() {
        expect(this.cd.data).to.equal('The cunning quick brown fox jumps over the lazy dog.');
      });

    });

    context('with an offset equal to length, it appends the text', () => {

      prop('offset', function() { return this.cd.length });
      prop('more',   ' And they lived happily ever after.');

      it('inserts the text at the requested location', function() {
        expect(this.cd.data).to.equal(this.text + this.more);
      });

    });

    it("throws when the offset is negative", function() {
      expect(() => this.cd.insertData(-1, this.more)).to.throw(DOMException);
    });

    it("throws when the offset exceeds length", function() {
      expect(() => this.cd.insertData(this.cd.length + 1, this.more)).to.throw(DOMException);
    });

  });

  describe('.deleteData()', () => {

    it('removes the string at the specified offset and length', function() {
      this.cd.deleteData(2, 10);
      expect(this.cd.data).to.equal('Thown fox jumps over the lazy dog.');
    });

    it('throws if the offset is negative', function() {
      expect(() => this.cd.deleteData(-1, 5)).to.throw(DOMException);
    });

    it('throws if the offset is greater the number of characters in data', function() {
      expect(() => this.cd.deleteData(this.text.length + 1, 5)).to.throw(DOMException);
    });

    it('removes the number of available characters if length is too long', function() {
      this.cd.deleteData(3, this.text.length);
      expect(this.cd.data).to.equal('The');
    });

    it('throws if count is negative', function() {
      expect(() => this.cd.deleteData(0, -5)).to.throw(DOMException);
    });

  });

  describe('.replaceData()', () => {

    it('replaces the string at the specified offset and length', function() {
      this.cd.replaceData(2, 10, 'e t');
      expect(this.cd.data).to.equal('The town fox jumps over the lazy dog.');
    });

    it('throws if the offset is negative', function() {
      expect(() => this.cd.replaceData(-1, 5, '...')).to.throw(DOMException);
    });

    it('throws if the offset is greater the number of characters in data', function() {
      expect(() => this.cd.replaceData(this.text.length + 1, 5, '...')).to.throw(DOMException);
    });

    it('removes the number of available characters if length is too long', function() {
      this.cd.replaceData(3, this.text.length, ' ...');
      expect(this.cd.data).to.equal('The ...');
    });

    it('throws if count is negative', function() {
      expect(() => this.cd.replaceData(0, -5, '...')).to.throw(DOMException);
    });

  });

});
