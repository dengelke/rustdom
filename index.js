const { 
    appendChild, 
    childNodes,
    children, 
    cloneNode,
    createTextNode, 
    firstChild, 
    getAttribute,
    getElementsByTagName,
    hasAttribute,
    hasChildNodes, 
    innerHTML, 
    isSameNode,
    lastChild, 
    nextSibling, 
    nodeName, 
    outerHTML, 
    parentElement,
    parentNode, 
    parse, 
    previousSibling, 
    publicId, 
    querySelector,
    querySelectorAll, 
    remove,
    removeAttribute,
    removeChild,
    setAttribute,
    systemId, 
    textContent, 
} = require('./index.node');

// TODO add ownerDocument and investigate need for localName in variable list
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

const DOMException = require('./lib/domexception');

// https://dom.spec.whatwg.org/#interface-node
class Node {
    _data;

    // TODO add ownerDocument and investigate need for localName in variable list
    constructor (data, nodeType) {
        this._data = data;
        this.nodeType = nodeType;
    }

    get ELEMENT_NODE() { return 1; }

    // Not implemented
    // static get ATTRIBUTE_NODE() { return 2; }

    get TEXT_NODE() { return 3; }

    // Not implemented
    // static get CDATA_SECTION_NODE() { return 4; }

    // Not implemented (legacy)
    // static get ENTITY_REFERENCE_NODE() { return 5; }

    // Not implemented (legacy)
    // static get ENTITY_NODE() { return 6; }

    get PROCESSING_INSTRUCTION_NODE() { return 7; }

    get COMMENT_NODE() { return 8; }

    get DOCUMENT_NODE() { return 9; }

    get DOCUMENT_TYPE_NODE() { return 10; }

    get DOCUMENT_FRAGMENT_NODE() { return 11; }

    // Not implemented (legacy)
    // static get NOTATION_NODE() { return 12; }

    get nodeName () {
        return nodeName(this._data);
    }

    // readonly attribute USVString baseURI;
    // readonly attribute boolean isConnected;

    // The read-only ownerDocument property of the Node interface returns the top-level document object of the node.
    // If this property is used on a node that is itself a document, the value is null.
    // readonly attribute Document? ownerDocument;
    // get ownerDocument () {

    // }
    // Node getRootNode(optional GetRootNodeOptions options = {});

    get parentNode () {
        const data = parentNode(this._data);
        return createNode(data);
    }

    // A node’s parent of type Element is known as its parent element. If the node has a parent of a different type, its parent element is null.
    // readonly attribute Element? parentElement;

    get parentElement () {
        const data = parentElement(this._data);
        return data ? new Element(data, 1) : null
    }

    hasChildNodes() {
        return hasChildNodes(this._data);
    }

    // TODO make live list
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

    // TODO fix
    // [CEReactions, NewObject] Node cloneNode(optional boolean deep = false);
    cloneNode (deep = false) {
        const data = cloneNode(this._data, deep);
        return createNode(data)
    }

    // TODO check properties

    // isEqualNode (otherNode) {
    //     // If otherNode is null, isEqualNode() always return false.
    //     if (otherNode === null) return false;
    //     // Check if otherNode is a Node
    //     if (!(otherNode instanceof Node)) throw TypeError("Failed to execute 'isSameNode' on 'Node': parameter 1 is not of type 'Node'");
    //     return isEqualNode(this._data, otherNode._data);
    // }

    // Alternative implementation
    // isEqualNode(node) {
    //     if (this === node)
    //       return true;
    //     if (this.nodeType === node.nodeType) {
    //       switch (this.nodeType) {
    //         case DOCUMENT_NODE:
    //         case DOCUMENT_FRAGMENT_NODE: {
    //           const aNodes = this.childNodes;
    //           const bNodes = node.childNodes;
    //           return aNodes.length === bNodes.length && aNodes.every((node, i) => node.isEqualNode(bNodes[i]));
    //         }
    //       }
    //       return this.toString() === node.toString();
    //     }
    //     return false;
    //   }

    // Legacy
    // boolean isSameNode(Node? otherNode); // legacy alias of ===
    isSameNode (otherNode) {
        // If otherNode is null, isSameNode() always return false.
        if (otherNode === null) return false;
        // Check if otherNode is a Node
        if (!(otherNode instanceof Node)) throw TypeError("Failed to execute 'isSameNode' on 'Node': parameter 1 is not of type 'Node'");
        return isSameNode(this._data, otherNode._data);
    }
  
    get DOCUMENT_POSITION_DISCONNECTED () { 
        return 0x01;
    }

    get DOCUMENT_POSITION_PRECEDING () { 
        return 0x02; 
    }

    get DOCUMENT_POSITION_FOLLOWING () { 
        return 0x04; 
    }

    get DOCUMENT_POSITION_CONTAINS () { 
        return 0x08; 
    }

    get DOCUMENT_POSITION_CONTAINED_BY () { 
        return 0x10; 
    }

    get DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC () { 
        return 0x20; 
    }

    // unsigned short compareDocumentPosition(Node other);
    // boolean contains(Node? other);
  
    // DOMString? lookupPrefix(DOMString? namespace);
    // DOMString? lookupNamespaceURI(DOMString? prefix);
    // boolean isDefaultNamespace(DOMString? namespace);
    // [CEReactions] Node insertBefore(Node node, Node? child);

    appendChild (child) {
        appendChild(this._data, child._data);
        return this;
    }

    // [CEReactions] Node replaceChild(Node node, Node child);

    removeChild (child) {
        // TODO Use Typescript for node type
        if (!(child instanceof Node)) throw TypeError("Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'");
        try {
            removeChild(this._data, child._data);
            return this;
        } catch (err) {
            // Throw DOMException if not child of node
            throw new DOMException(err.message);
        }
    }

    // TODO implement
    // get nodeData () {
    //     return nodeData(this._data);
    // }

    get outerHTML () {
        return outerHTML(this._data);
    }

    get innerHTML () {
        return innerHTML(this._data);
    }

    // TODO meet implementation requirements https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    // get innerText () {
    //     return textContent(this._data);
    // }
}

class Element extends Node {
    // readonly attribute DOMString? namespaceURI;
    // readonly attribute DOMString? prefix;
    // readonly attribute DOMString localName;
    // get localName () {

    // }
    // readonly attribute DOMString tagName;
    get tagName () {
        // Reuse nodeName as will return same result if element
        return nodeName(this._data);
    }
  
    // [CEReactions] attribute DOMString id;
    get id() { 
        return this.getAttribute('id'); 
    }

    set id(value) {
        return this.setAttribute('id', value); 
    }

    // [CEReactions] attribute DOMString className;
    get className() { 
        return this.getAttribute('class'); 
    }

    set className(value) {
        return this.setAttribute('class', value); 
    }
    // [SameObject, PutForwards=value] readonly attribute DOMTokenList classList;
    // [CEReactions, Unscopable] attribute DOMString slot;
  
    // boolean hasAttributes();
    // [SameObject] readonly attribute NamedNodeMap attributes;
    // sequence<DOMString> getAttributeNames();

    // TODO error and null input handling
    getAttribute(qualifiedName) {
        return getAttribute(this._data, qualifiedName);
    }

    // DOMString? getAttributeNS(DOMString? namespace, DOMString localName);
    // [CEReactions] undefined setAttribute(DOMString qualifiedName, DOMString value);
    setAttribute(qualifiedName, value) {
        return setAttribute(this._data, qualifiedName, value);
    }
    // [CEReactions] undefined setAttributeNS(DOMString? namespace, DOMString qualifiedName, DOMString value);
    removeAttribute(qualifiedName) {
        return removeAttribute(this._data, qualifiedName);
    }
    // [CEReactions] undefined removeAttributeNS(DOMString? namespace, DOMString localName);
    // [CEReactions] boolean toggleAttribute(DOMString qualifiedName, optional boolean force);
    // boolean hasAttribute(DOMString qualifiedName);
    hasAttribute(qualifiedName) {
        return hasAttribute(this._data, qualifiedName);
    }
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
    getElementsByTagName(qualifiedName) {
        return getElementsByTagName(this._data, qualifiedName).map(data => new Element(data, 1));
    }
    // HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
    // HTMLCollection getElementsByClassName(DOMString classNames);
    // getElementsByClassName(className) {
    //     return getElementsByClassName(this._data, className).map(data => new Element(data, 1));
    // }

    // Implementation to move to Rust
    // getElementsByClassName(className) {
    //     const elements = new NodeList;
    //     let {[NEXT]: next, [END]: end} = this;
    //     while (next !== end) {
    //       if (
    //         next.nodeType === ELEMENT_NODE &&
    //         next.hasAttribute('class') &&
    //         next.classList.has(className)
    //       )
    //         elements.push(next);
    //       next = next[NEXT];
    //     }
    //     return elements;
    //   }
    
    //   getElementsByTagName(tagName) {
    //     const elements = new NodeList;
    //     let {[NEXT]: next, [END]: end} = this;
    //     while (next !== end) {
    //       if (next.nodeType === ELEMENT_NODE && (
    //         next.localName === tagName ||
    //         localCase(next) === tagName
    //       ))
    //         elements.push(next);
    //       next = next[NEXT];
    //     }
    //     return elements;
    //   }
  
    // [CEReactions] Element? insertAdjacentElement(DOMString where, Element element); // legacy
    // undefined insertAdjacentText(DOMString where, DOMString data); // legacy

    // TODO make live list
    get children () {
        return children(this._data).map(data => new Element(data, 1));
    }

    querySelector (selector) {
        const data = querySelector(this._data, selector);
        return data ? new Element(data, 1) : null;
    }

    querySelectorAll (selector) {
        return querySelectorAll(this._data, selector).map(data => new Element(data, 1));
    }

    // TODO add to child node mixin https://dom.spec.whatwg.org/#childnode
    remove() {
        return remove(this._data);
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
    get documentElement() {
        return this.querySelector('html');
    }
    // HTMLCollection getElementsByTagName(DOMString qualifiedName);
    // HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName);
    // HTMLCollection getElementsByClassName(DOMString classNames);
  
    // [CEReactions, NewObject] Element createElement(DOMString localName, optional (DOMString or ElementCreationOptions) options = {});
    // [CEReactions, NewObject] Element createElementNS(DOMString? namespace, DOMString qualifiedName, optional (DOMString or ElementCreationOptions) options = {});
    // [NewObject] DocumentFragment createDocumentFragment();
    createTextNode(data) {
        return new Text(createTextNode(data), 3);
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

    get children () {
        return children(this._data).map(data => new Element(data, 1));
    }

    querySelector (selector) {
        const data = querySelector(this._data, selector);
        return data ? new Element(data, 1) : null;
    }

    querySelectorAll (selector) {
        return querySelectorAll(this._data, selector).map(data => new Element(data, 1));
    }
}

class DocumentType extends Node {
    get name () {
        return nodeName(this._data);
    }

    get publicId () {
        return publicId(this._data);
    }

    get systemId () {
        return systemId(this._data);
    }
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