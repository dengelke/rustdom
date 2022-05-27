const { expect } = require('chai');
const RustDOM = require('../');

const basicHtmlString = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/REC-html40/strict.dtd"><html><head></head><body><p class="A">Foo</p><p id="Baz">Bar</p><!--' and '--></body></html>`;

const DOMException = require('../lib/domexception');

describe('serialize tests', () => {
  it('should insert head and body tags', () => {
    const document = new RustDOM("<!DOCTYPE html>Test");
    expect(document.serialize()).to.equal('<!DOCTYPE html><html><head></head><body>Test</body></html>');
  });
  it('should not add DOCTYPE tag', () => {
    const document = new RustDOM("Test");
    expect(document.serialize()).to.equal('<html><head></head><body>Test</body></html>');
  });
});

describe('basic', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('parse valid dom and not remove DOCTYPE', () => {
    expect(basicDocument.outerHTML).to.equal(`<!DOCTYPE html><html><head></head><body><p class="A">Foo</p><p id="Baz">Bar</p><!--' and '--></body></html>`);
  });
  it('return document', () => {
    expect(basicDocument.nodeName).to.equal('#document');
    expect(basicDocument.nodeType).to.equal(9);
  });
  it('return body', () => {
    const body = basicDocument.body;
    expect(body.textContent).to.equal('FooBar');
    expect(body.nodeName).to.equal('BODY');
    expect(body.nodeType).to.equal(1);
    expect(body.innerHTML).to.equal(`<p class="A">Foo</p><p id="Baz">Bar</p><!--' and '-->`);
    expect(body.outerHTML).to.equal(`<body><p class="A">Foo</p><p id="Baz">Bar</p><!--' and '--></body>`);
  });
  it('return head', () => {
    const head = basicDocument.head;
    expect(head.textContent).to.equal('');
    expect(head.nodeName).to.equal('HEAD');
    expect(head.innerHTML).to.equal('');
    expect(head.outerHTML).to.equal('<head></head>');
  });
  it('return doctype', () => {
    const docType = basicDocument.firstChild;
    expect(docType.nodeType).to.equal(10);
    expect(docType.nodeName).to.equal('html');
    expect(docType.innerHTML).to.equal('');
    expect(docType.outerHTML).to.equal('<!DOCTYPE html>');
    expect(docType.name).to.equal('html');
    expect(docType.publicId).to.equal('-//W3C//DTD HTML 4.0//EN');
    expect(docType.systemId).to.equal('http://www.w3.org/TR/REC-html40/strict.dtd');
  });
  it('return firstChild textContent', () => {
    expect(basicDocument.querySelector('body').firstChild.textContent).to.equal('Foo');
  });
  it('return lastChild textContent', () => {
    expect(basicDocument.querySelector('body').lastChild.textContent).to.equal('');
  });
  it('return lastChild previousSibling textContent', () => {
    expect(basicDocument.querySelector('body').lastChild.previousSibling.textContent).to.equal('Bar');
  });
  it('return lastChild previousSibling textContent', () => {
    expect(basicDocument.querySelector('body').firstChild.nextSibling.textContent).to.equal('Bar');
  });
  it('return parents textContent', () => {
    expect(basicDocument.querySelector('p').parentNode.textContent).to.equal('FooBar');
  });
  it('hasChildNodes', () => {
    expect(basicDocument.hasChildNodes()).to.equal(true);
    expect(basicDocument.querySelector('p').firstChild.hasChildNodes()).to.equal(false);
  });
  it('query id', () => {
    expect(basicDocument.querySelector('#Baz').textContent).to.equal('Bar');
    expect(basicDocument.querySelector('#Baz').innerHTML).to.equal('Bar');
  });
  it('query class', () => {
    expect(basicDocument.querySelector('.A').textContent).to.equal('Foo');
  });
  it('query nodeName', () => {
    expect(basicDocument.querySelector('p').nodeName).to.equal('P');
  });
  it('query nodeType', () => {
    expect(basicDocument.nodeType).to.equal(9);
  });
});

describe('list', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('return children', () => {
    expect(basicDocument.body.children[0].nodeName).to.equal('P');
  });
  it('return childNodes', () => {
    expect(basicDocument.childNodes[0].nodeName).to.equal('html');
    expect(basicDocument.body.childNodes[2].nodeName).to.equal('#comment');
  });
  it('return empty on children', () => {
    expect(basicDocument.querySelector('p').children).to.deep.equal([]);
  });
  it('queryAll', () => {
    const nodeList = basicDocument.body.querySelectorAll('p');
    expect(nodeList.length).to.equal(2);
    expect(nodeList[0].nodeName).to.equal('P');
  });
  it('return empty on querySelectorAll', () => {
    expect(basicDocument.querySelectorAll('.B')).to.deep.equal([]);
  });
});

describe('null', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('return null on querySelector', () => {
    expect(basicDocument.querySelector('.B')).to.equal(null);
  });
  it('return null on firstChild', () => {
    expect(basicDocument.querySelector('p').firstChild.firstChild).to.equal(null);
  });
  it('return null on lastChild', () => {
    expect(basicDocument.querySelector('p').lastChild.lastChild).to.equal(null);
  });
  it('return null on nextSibling', () => {
    expect(basicDocument.querySelector('p').lastChild.nextSibling).to.equal(null);
  });
  it('return null on previousSibling', () => {
    expect(basicDocument.querySelector('p').lastChild.previousSibling).to.equal(null);
  });
  it('return null on document parentNode', () => {
    expect(basicDocument.parentNode).to.equal(null);
  });
  it('return correct type on parent document', () => {
    expect(basicDocument.firstChild.parentNode.nodeType).to.equal(9);
    expect(basicDocument.firstChild.parentNode.firstChild.nodeType).to.equal(10);
    expect(basicDocument.firstChild.parentNode.lastChild.nodeType).to.equal(1);
    expect(basicDocument.firstChild.parentNode.firstChild.parentNode.nodeType).to.equal(9);
  });
});

describe('create node', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('should return null on querySelector', () => {
    expect(basicDocument.createTextNode('new text').textContent).to.equal('new text');
  });
  it('should append text', () => {
    const textNode = basicDocument.createTextNode('new text node')
    expect(basicDocument.appendChild(textNode).lastChild.textContent).to.equal('new text node');
  });
});

describe('remove child', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('should throw type error if null', () => {
    expect(() => basicDocument.body.removeChild(null)).to.throw(TypeError).with.property('message', "Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'");
  });
  it('should throw error if incorrect parent', () => {
    expect(() => basicDocument.body.children[1].removeChild(basicDocument.body.children[0])).to.throw(DOMException).with.property('message', "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.");
  });
  it('should work', () => {
    expect(basicDocument.body.removeChild(basicDocument.body.firstChild).firstChild.textContent).to.equal("Bar");
  });
});

describe('is equal node', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('should throw type error if null', () => {
    expect(() => basicDocument.body.isEqualNode(null)).to.throw(TypeError).with.property('message', "Failed to execute 'isEqualNode' on 'Node': parameter 1 is not of type 'Node'");
  });
  it('should be false if not equal', () => {
    expect(basicDocument.body.isEqualNode(basicDocument.body.children[0])).to.equal(false);
  });
  it('should be true if equal', () => {
    expect(basicDocument.body.isEqualNode(basicDocument.body)).to.equal(true);
  });
});