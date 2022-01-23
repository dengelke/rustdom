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
        try {
            return new Node(firstChild(this.#_data));
        } catch (err) {
            return null;
        }
    }

    get lastChild () {
        try {
            return new Node(lastChild(this.#_data));
        } catch (err) {
            return null;
        }
    }

    get parentNode () {
        try {
            return new Node(parentNode(this.#_data));
        } catch (err) {
            return null;
        }
    }

    get previousSibling () {
        try {
            return new Node(previousSibling(this.#_data));
        } catch (err) {
            return null;
        }
    }

    get nextSibling () {
        try {
            return new Node(nextSibling(this.#_data));
        } catch (err) {
            return null;
        }
    }

    get nodeName () {
        try {
            return nodeName(this.#_data);
        } catch (err) {
            return null;
        }
    }

    get nodeType () {
        try {
            return nodeType(this.#_data);
        } catch (err) {
            return null;
        }
    }

    querySelector (selector) {
        try {
            return new Node(querySelector(this.#_data, selector));
        } catch (err) {
            return null;
        }
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

    // createTextNode (text) {
    //     try {
    //         return new Node(createTextNode(this.#_data, text));
    //     } catch (err) {
    //         return null;
    //     }
    // }

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