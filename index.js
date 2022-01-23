const { parse, querySelector, serialize, firstChild, lastChild, nextSibling, previousSibling, parentNode, textContent, nodeName, nodeType } = require('./index.node');

class Node {
    #_data;

    constructor (data) {
        this.#_data = data
    }

    get nodeData () {
        return nodeData(this.#_data);
    }

    get textContent () {
        return textContent(this.#_data);
    }

    get firstChild () {
        const data = firstChild(this.#_data);
        return data ? new Node(data) : null;
    }

    get lastChild () {
        const data = lastChild(this.#_data);
        return data ? new Node(data) : null;
    }

    get parentNode () {
        const data = parentNode(this.#_data);
        return data ? new Node(data) : null;
    }

    get previousSibling () {
        const data = previousSibling(this.#_data);
        return data ? new Node(data) : null;
    }

    get nextSibling () {
        const data = nextSibling(this.#_data);
        return data ? new Node(data) : null;
    }

    get nodeName () {
        return nodeName(this.#_data);
    }

    get nodeType () {
        return nodeType(this.#_data);
    }

    querySelector (selector) {
        const data = querySelector(this.#_data, selector);
        return data ? new Node(data) : null;
    }

    serialize () {
        return serialize(this.#_data);
    }
}

class Document extends Node {

    get body() {
        return this.querySelector('body');
    }

    get head() {
        return this.querySelector('head');;
    }

}

module.exports = class RustDOM {
    #_data;

    constructor (input) {
        this.#_data = parse(input);
        this.document = new Document(this.#_data);
    }

    serialize () {
        return serialize(this.#_data);
    }
}