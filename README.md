# minimal-dom

This is an implementation of [DOM (Core) Level 1](https://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html) API. I needed something simple to use in tests. I couldn't seem to find anything standalone, so I wrote this.

## Installation

Using npm:

```
npm install minimal-dom
```

## Usage

This module exports a Document class. Empty documents can be created with new:

```javascript
const Document = require('minimal-dom');

let doc = new Document();

doc.appendChild(doc.createElement('example'));
```

### Deviations From The Standard Interface

In addition to providing an explicit constructor for `Document`, this implementation deviates from specification in a few ways for pratical reasons. The `DocumentFragment`, `Element`, and `Text` classes provide a `toString()` method that returns the XML representation of that node and its children.  That is also available as an `outerHTML` property on `DocumentFragment` and `Element`, since the presence of that property can help some test utilities render the node correctly in output.

Most classes in the spec should not be directly constructed, so they are treated as internals of this module. An exception is made for both `Node` and `DOMException`, as they define important constants. They are made available as properties on the `Document` class. For example, they could be used as follows:

```javascript
const Document = require('minimal-dom');
const Node = Document.Node;
const DOMException = Document.DOMException;

function isElement(node) {
  return Node.ELEMENT_NODE === node.nodeType;
}

function isWrongDocumentError(err) {
  return DOMException.WRONG_DOCUMENT_ERR === err.code;
}
```
