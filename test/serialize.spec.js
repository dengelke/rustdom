const { expect } = require('chai');
const RustDOM = require('..');

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
