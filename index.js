const { parse, outerHTML, hasChildNodes, appendChild, createTextNode, querySelector, querySelectorAll, innerHTML, firstChild, lastChild, nextSibling, previousSibling, parentNode, textContent, nodeName, nodeType, children, childNodes } = require('./index.node');

function createNode (input) {
    // If no input return null
    if (!input) return null;
    // Depending on nodeType create correct node
    switch(input.nodeType) {
        case 1:
            return new Element(input._nodeSend, input.nodeType);
        case 3:
            return new Text(input._nodeSend, input.nodeType);
        case 7:
            return new ProcessingInstruction(input._nodeSend, input.nodeType);
        case 8:
            return new Comment(input._nodeSend, input.nodeType);
        case 9:
            return new Document(input._nodeSend, input.nodeType);
        case 10:
            return new DocumentType(input._nodeSend, input.nodeType);
        case 11:
            return new DocumentFragment(input._nodeSend, input.nodeType);
        default:
            throw Error('Unsupported Type');
      }
}

// https://dom.spec.whatwg.org/#interface-node
class Node {
    _data;

    constructor (data, nodeType) {
        this._data = data;
        this.nodeType = nodeType;
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

    static get PROCESSING_INSTRUCTION_NODE() { return 7; }

    static get COMMENT_NODE() { return 8; }

    static get DOCUMENT_NODE() { return 9; }

    static get DOCUMENT_TYPE_NODE() { return 10; }

    static get DOCUMENT_FRAGMENT_NODE() { return 11; }

    // Not implemented (legacy)
    // static get NOTATION_NODE() { return 12; }

    // get nodeType () {
    //     return nodeType(this._data);
    // }

    get nodeName () {
        return nodeName(this._data);
    }

    // readonly attribute USVString baseURI;
    // readonly attribute boolean isConnected;
    // readonly attribute Document? ownerDocument;
    // Node getRootNode(optional GetRootNodeOptions options = {});

    get parentNode () {
        const data = parentNode(this._data);
        return createNode(data);
    }

    // readonly attribute Element? parentElement;
    hasChildNodes() {
        return hasChildNodes(this._data);
    }

    get childNodes () {
        return childNodes(this._data).map(data => createNode(data));
    }

    get firstChild () {
        const data = firstChild(this._data);
        return createNode(data);
    }

    get lastChild () {
        const data = lastChild(this._data);
        return createNode(data);
    }

    get previousSibling () {
        const data = previousSibling(this._data);
        return createNode(data);
    }

    get nextSibling () {
        const data = nextSibling(this._data);
        return createNode(data);
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
    appendChild (node) {
        appendChild(this._data, node._data)
        return this
    }
    // [CEReactions] Node replaceChild(Node node, Node child);
    // [CEReactions] Node removeChild(Node child);

    get nodeData () {
        return nodeData(this._data);
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
        return createNode(data);
    }

    querySelectorAll (selector) {
        return querySelectorAll(this._data, selector).map(data => createNode(data));
    }
}

class Element extends Node {
    // readonly attribute DOMString? namespaceURI;
    // readonly attribute DOMString? prefix;
    // readonly attribute DOMString localName;
    // readonly attribute DOMString tagName;
  
    // [CEReactions] attribute DOMString id;
    // [CEReactions] attribute DOMString className;
    // [SameObject, PutForwards=value] readonly attribute DOMTokenList classList;
    // [CEReactions, Unscopable] attribute DOMString slot;
  
    // boolean hasAttributes();
    // [SameObject] readonly attribute NamedNodeMap attributes;
    // sequence<DOMString> getAttributeNames();
    // DOMString? getAttribute(DOMString qualifiedName);
    // DOMString? getAttributeNS(DOMString? namespace, DOMString localName);
    // [CEReactions] undefined setAttribute(DOMString qualifiedName, DOMString value);
    // [CEReactions] undefined setAttributeNS(DOMString? namespace, DOMString qualifiedName, DOMString value);
    // [CEReactions] undefined removeAttribute(DOMString qualifiedName);
    // [CEReactions] undefined removeAttributeNS(DOMString? namespace, DOMString localName);
    // [CEReactions] boolean toggleAttribute(DOMString qualifiedName, optional boolean force);
    // boolean hasAttribute(DOMString qualifiedName);
    // boolean hasAttributeNS(DOMString? namespace, DOMString localName);
  
    // Attr? getAttributeNode(DOMString qualifiedName);
    // Attr? getAttributeNodeNS(DOMString? namespace, DOMString localName);
    // [CEReactions] Attr? setAttributeNode(Attr attr);
    // [CEReactions] Attr? setAttributeNodeNS(Attr attr);
    // [CEReactions] Attr removeAttributeNode(Attr attr);
  
    // ShadowRoot attachShadow(ShadowRootInit init);
    // readonly attribute ShadowRoot? shadowRoot;
  
    // Element? closest(DOMString selectors);
    // boolean matches(DOMString selectors);
    // boolean webkitMatchesSelector(DOMString selectors); // legacy alias of .matches
  
    // HTMLCollection getElementsByTagName(DOMString qualifiedName);
    // HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
    // HTMLCollection getElementsByClassName(DOMString classNames);
  
    // [CEReactions] Element? insertAdjacentElement(DOMString where, Element element); // legacy
    // undefined insertAdjacentText(DOMString where, DOMString data); // legacy

    // Should be moved to element/mixin
    get children () {
        return children(this._data).map(data => createNode(data));
    }
}

// https://dom.spec.whatwg.org/#interface-characterdata
class CharacterData extends Node {
    // attribute [LegacyNullToEmptyString] DOMString data;
    // readonly attribute unsigned long length;
    // DOMString substringData(unsigned long offset, unsigned long count);
    // undefined appendData(DOMString data);
    // undefined insertData(unsigned long offset, DOMString data);
    // undefined deleteData(unsigned long offset, unsigned long count);
    // undefined replaceData(unsigned long offset, unsigned long count, DOMString data);
}

// https://dom.spec.whatwg.org/#interface-text
class Text extends CharacterData {
    // constructor(optional DOMString data = "");
  
    // [NewObject] Text splitText(unsigned long offset);
    // readonly attribute DOMString wholeText;
};

class ProcessingInstruction extends CharacterData {
    // readonly attribute DOMString target;
}

class Comment extends Node {
    // constructor(optional DOMString data = "");
}

class Document extends Node {

    // [SameObject] readonly attribute DOMImplementation implementation;
    // readonly attribute USVString URL;
    // readonly attribute USVString documentURI;
    // readonly attribute DOMString compatMode;
    // readonly attribute DOMString characterSet;
    // readonly attribute DOMString charset; // legacy alias of .characterSet
    // readonly attribute DOMString inputEncoding; // legacy alias of .characterSet
    // readonly attribute DOMString contentType;
  
    // readonly attribute DocumentType? doctype;
    // readonly attribute Element? documentElement;
    // HTMLCollection getElementsByTagName(DOMString qualifiedName);
    // HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
    // HTMLCollection getElementsByClassName(DOMString classNames);
  
    // [CEReactions, NewObject] Element createElement(DOMString localName, optional (DOMString or ElementCreationOptions) options = {});
    // [CEReactions, NewObject] Element createElementNS(DOMString? namespace, DOMString qualifiedName, optional (DOMString or ElementCreationOptions) options = {});
    // [NewObject] DocumentFragment createDocumentFragment();
    createTextNode(data) {
        return createNode(createTextNode(data));
    }
    // [NewObject] CDATASection createCDATASection(DOMString data);
    // [NewObject] Comment createComment(DOMString data);

    // [NewObject] ProcessingInstruction createProcessingInstruction(DOMString target, DOMString data);
  
    // [CEReactions, NewObject] Node importNode(Node node, optional boolean deep = false);
    // [CEReactions] Node adoptNode(Node node);
  
    // [NewObject] Attr createAttribute(DOMString localName);
    // [NewObject] Attr createAttributeNS(DOMString? namespace, DOMString qualifiedName);
  
    // [NewObject] Event createEvent(DOMString interface); // legacy
  
    // [NewObject] Range createRange();
  
    // // NodeFilter.SHOW_ALL = 0xFFFFFFFF
    // [NewObject] NodeIterator createNodeIterator(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);
    // [NewObject] TreeWalker createTreeWalker(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null);

    get body() {
        return this.querySelector('body');
    }

    get head() {
        return this.querySelector('head');;
    }
}

class DocumentType extends Node {
    // readonly attribute DOMString name;
    // readonly attribute DOMString publicId;
    // readonly attribute DOMString systemId;
};

class DocumentFragment extends Node {
    // constructor();
};

module.exports = class RustDOM {
    _data;

    constructor (input) {
        this.document = createNode(parse(input));
    }

    serialize () {
        return this.document.outerHTML;
    }
}