const { expect } = require('chai');
const RustDOM = require('../');

const basicHtmlString = `<!DOCTYPE html><html><head></head><body><p class="A">Foo</p><p id="Baz">Bar</p></body></html>`;

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

describe('basic tests', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('should parse valid dom and not remove DOCTYPE', () => {
    expect(basicDocument.serialize()).to.equal(basicHtmlString);
  });
  it('should return body', () => {
    const body = basicDocument.body;
    expect(body.textContent).to.equal('FooBar');
    expect(body.nodeName).to.equal('BODY');
    expect(body.nodeType).to.equal(1);
  });
  it('should return head', () => {
    const head = basicDocument.head;
    expect(head.textContent).to.equal('');
    expect(head.nodeName).to.equal('HEAD');
    expect(head.nodeType).to.equal(1);
  });
  it('should return doctype', () => {
    const docType = basicDocument.firstChild;
    expect(docType.nodeType).to.equal(10);
    expect(docType.nodeName).to.equal('html');
  });
  it('should return firstChild textContent', () => {
    expect(basicDocument.querySelector('body').firstChild.textContent).to.equal('Foo');
  });
  it('should return lastChild textContent', () => {
    expect(basicDocument.querySelector('body').lastChild.textContent).to.equal('Bar');
  });
  it('should return lastChild previousSibling textContent', () => {
    expect(basicDocument.querySelector('body').lastChild.previousSibling.textContent).to.equal('Foo');
  });
  it('should return lastChild previousSibling textContent', () => {
    expect(basicDocument.querySelector('body').firstChild.nextSibling.textContent).to.equal('Bar');
  });
  it('should return parents textContent', () => {
    expect(basicDocument.querySelector('p').parentNode.textContent).to.equal('FooBar');
  });
  it('should query id', () => {
    expect(basicDocument.querySelector('#Baz').textContent).to.equal('Bar');
  });
  it('should query class', () => {
    expect(basicDocument.querySelector('.A').textContent).to.equal('Foo');
  });
  it('should query nodeName', () => {
    expect(basicDocument.querySelector('p').nodeName).to.equal('P');
  });
  it('should query nodeType', () => {
    expect(basicDocument.nodeType).to.equal(9);
  });
});

describe('list tests', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('should return children', () => {
    expect(basicDocument.children[0].nodeName).to.equal('html');
    expect(basicDocument.children[1].nodeName).to.equal('HTML');
    expect(basicDocument.children[1].children[0].nodeName).to.equal('HEAD');
    expect(basicDocument.children[1].children[1].nodeName).to.equal('BODY');
  });
  it('should return empty on children', () => {
    expect(basicDocument.querySelector('p').lastChild.children).to.deep.equal([]);
  });
  it('should queryAll', () => {
    const nodeList = basicDocument.body.querySelectorAll('p');
    expect(nodeList.length).to.equal(2);
    expect(nodeList[0].nodeName).to.equal('P');
  });
  it('should return empty on querySelectorAll', () => {
    expect(basicDocument.querySelectorAll('.B')).to.deep.equal([]);
  });
});

describe('null tests', () => {
  const basicDocument = new RustDOM(basicHtmlString).document;
  it('should return null on querySelector', () => {
    expect(basicDocument.querySelector('.B')).to.equal(null);
  });
  it('should return null on firstChild', () => {
    expect(basicDocument.querySelector('p').firstChild.firstChild).to.equal(null);
  });
  it('should return null on lastChild', () => {
    expect(basicDocument.querySelector('p').lastChild.lastChild).to.equal(null);
  });
  it('should return null on nextSibling', () => {
    expect(basicDocument.querySelector('p').lastChild.nextSibling).to.equal(null);
  });
  it('should return null on previousSibling', () => {
    expect(basicDocument.querySelector('p').lastChild.previousSibling).to.equal(null);
  });
  it('should return null on document parentNode', () => {
    expect(basicDocument.parentNode).to.equal(null);
  });
});