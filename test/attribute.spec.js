const { expect } = require('chai');
const RustDOM = require('..');

const basicHtmlString = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/REC-html40/strict.dtd"><html><head></head><body><p class="A">Foo</p><p id="Baz">Bar</p><!--' and '--></body></html>`;

describe('attribute', () => {
    it('should have attribute', () => {
        const basicDocument = new RustDOM(basicHtmlString).document;
      expect(basicDocument.body.children[0].hasAttribute('class')).to.equal(true);
      expect(basicDocument.body.children[0].hasAttribute('id')).to.equal(false);
    });
    it('should get attribute', () => {
        const basicDocument = new RustDOM(basicHtmlString).document;
      expect(basicDocument.body.children[0].getAttribute('class')).to.equal('A');
      expect(basicDocument.body.children[0].getAttribute('id')).to.equal(null);
    });
    it('should set attribute', () => {
        const basicDocument = new RustDOM(basicHtmlString).document;
      expect(basicDocument.body.children[0].getAttribute('class')).to.equal('A');
      expect(basicDocument.body.children[0].getAttribute('id')).to.equal(null);
      expect(basicDocument.body.children[0].setAttribute('class', 'B'));
      expect(basicDocument.body.children[0].getAttribute('class')).to.equal('B');
      expect(basicDocument.body.children[0].getAttribute('id')).to.equal(null);
      expect(basicDocument.body.children[1].getAttribute('class')).to.equal(null);
      expect(basicDocument.body.children[1].getAttribute('id')).to.equal('Baz');
    });
    it('should remove set attribute', () => {
        const basicDocument = new RustDOM(basicHtmlString).document;
        expect(basicDocument.body.children[0].getAttribute('class')).to.equal('A');
        expect(basicDocument.body.children[0].getAttribute('id')).to.equal(null);
        expect(basicDocument.body.children[0].removeAttribute('class')).to.equal(undefined);
        expect(basicDocument.body.children[0].getAttribute('class')).to.equal(null);
        expect(basicDocument.body.children[0].getAttribute('id')).to.equal(null);
        expect(basicDocument.body.children[1].getAttribute('class')).to.equal(null);
        expect(basicDocument.body.children[1].getAttribute('id')).to.equal('Baz');
      });
      it('should remove null attribute', () => {
        const basicDocument = new RustDOM(basicHtmlString).document;
        expect(basicDocument.body.children[0].getAttribute('class')).to.equal('A');
        expect(basicDocument.body.children[0].getAttribute('id')).to.equal(null);
        expect(basicDocument.body.children[0].removeAttribute('id')).to.equal(undefined);
        expect(basicDocument.body.children[0].getAttribute('class')).to.equal('A');
        expect(basicDocument.body.children[0].getAttribute('id')).to.equal(null);
        expect(basicDocument.body.children[1].getAttribute('class')).to.equal(null);
        expect(basicDocument.body.children[1].getAttribute('id')).to.equal('Baz');
      });
  });

  describe('id', () => {
    const basicDocument = new RustDOM(basicHtmlString).document;
    it('should have id', () => {
      expect(basicDocument.body.children[0].id).to.equal(null);
      expect(basicDocument.body.children[1].id).to.equal('Baz');
    });
    it('should set id', () => {
        expect(basicDocument.body.children[0].id).to.equal(null);
        basicDocument.body.children[0].id = 'blahblah';
        expect(basicDocument.body.children[0].getAttribute('id')).to.equal('blahblah');
        expect(basicDocument.body.children[0].id).to.equal('blahblah');
    });
  });

  describe('className', () => {
    const basicDocument = new RustDOM(basicHtmlString).document;
    it('should have id', () => {
      expect(basicDocument.body.children[0].className).to.equal('A');
      expect(basicDocument.body.children[1].className).to.equal(null);
    });
    it('should set className', () => {
        expect(basicDocument.body.children[0].className).to.equal('A');
        basicDocument.body.children[0].className = 'Bad';
        expect(basicDocument.body.children[0].className).to.equal('Bad');
        expect(basicDocument.body.children[1].className).to.equal(null);
        basicDocument.body.children[1].className = 'asdasdas';
        expect(basicDocument.body.children[1].className).to.equal('asdasdas');
    });
  });