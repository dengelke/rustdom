const { parse, outerHTML, appendChild, createTextNode, querySelector, querySelectorAll, innerHTML, firstChild, lastChild, nextSibling, previousSibling, parentNode, textContent, nodeName, nodeType, children, childNodes } = require('./index.node');

class Node {
    _data;

    constructor (data) {
        this._data = data
    }

    static get ELEMENT_NODE() { return 1; }

    // Not implemented
    // static get ATTRIBUTE_NODE() { return 2; }

    static get TEXT_NODE() { return 3; }

    // Not implemented
    // static get CDATA_SECTION_NODE() { return 4; }

    // Not implemented (legacy)
    // static get ENTITY_REFERENCE_NODE() { return 5; }

    // Not implemented (legacy)
    // static get ENTITY_NODE() { return 6; }

    static get ENTITY_NODE() { return 7; }

    static get COMMENT_NODE() { return 8; }

    static get DOCUMENT_NODE() { return 9; }

    static get DOCUMENT_TYPE_NODE() { return 10; }

    static get DOCUMENT_FRAGMENT_NODE() { return 11; }

    // Not implemented (legacy)
    // static get NOTATION_NODE() { return 12; }

    get nodeType () {
        return nodeType(this._data);
    }

    get nodeName () {
        return nodeName(this._data);
    }

    // readonly attribute USVString baseURI;
    // readonly attribute boolean isConnected;
    // readonly attribute Document? ownerDocument;
    // Node getRootNode(optional GetRootNodeOptions options = {});

    get parentNode () {
        const data = parentNode(this._data);
        return data ? new Node(data) : null;
    }

    // readonly attribute Element? parentElement;
    // boolean hasChildNodes();
    // [SameObject] readonly attribute NodeList childNodes;
    get childNodes () {
        return childNodes(this._data).map(data => new Node(data));
    }

    get firstChild () {
        const data = firstChild(this._data);
        return data ? new Node(data) : null;
    }

    get lastChild () {
        const data = lastChild(this._data);
        return data ? new Node(data) : null;
    }

    get previousSibling () {
        const data = previousSibling(this._data);
        return data ? new Node(data) : null;
    }

    get nextSibling () {
        const data = nextSibling(this._data);
        return data ? new Node(data) : null;
    }

    // [CEReactions] attribute DOMString? nodeValue;

    get textContent () {
        return textContent(this._data);
    }

    // [CEReactions] undefined normalize();

    // [CEReactions, NewObject] Node cloneNode(optional boolean deep = false);
    // boolean isEqualNode(Node? otherNode);
    // boolean isSameNode(Node? otherNode); // legacy alias of ===
  
    // const unsigned short DOCUMENT_POSITION_DISCONNECTED = 0x01;
    // const unsigned short DOCUMENT_POSITION_PRECEDING = 0x02;
    // const unsigned short DOCUMENT_POSITION_FOLLOWING = 0x04;
    // const unsigned short DOCUMENT_POSITION_CONTAINS = 0x08;
    // const unsigned short DOCUMENT_POSITION_CONTAINED_BY = 0x10;
    // const unsigned short DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20;
    // unsigned short compareDocumentPosition(Node other);
    // boolean contains(Node? other);
  
    // DOMString? lookupPrefix(DOMString? namespace);
    // DOMString? lookupNamespaceURI(DOMString? prefix);
    // boolean isDefaultNamespace(DOMString? namespace);

    // [CEReactions] Node insertBefore(Node node, Node? child);
    // TODO check return value
    appendChild (node) {
        appendChild(this._data, node._data)
        return this
    }
    // [CEReactions] Node replaceChild(Node node, Node child);
    // [CEReactions] Node removeChild(Node child);

    get nodeData () {
        return nodeData(this._data);
    }

    // Should be moved to element/mixin
    get children () {
        return children(this._data).map(data => new Node(data));
    }

    get outerHTML () {
        return outerHTML(this._data);
    }

    get innerHTML () {
        return innerHTML(this._data);
    }

    // TODO meet implementation requirements https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    get innerText () {
        return textContent(this._data);
    }

    querySelector (selector) {
        const data = querySelector(this._data, selector);
        return data ? new Node(data) : null;
    }

    querySelectorAll (selector) {
        return querySelectorAll(this._data, selector).map(data => new Node(data));
    }
}

class Document extends Node {

    get body() {
        return this.querySelector('body');
    }

    get head() {
        return this.querySelector('head');;
    }

    createTextNode(data) {
        return new Node(createTextNode(data));
    }

}

module.exports = class RustDOM {
    _data;

    constructor (input) {
        this._data = parse(input);
        this.document = new Document(this._data);
    }

    serialize () {
        return outerHTML(this._data);
    }
}