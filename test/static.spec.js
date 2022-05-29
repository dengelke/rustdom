const { expect } = require('chai');
const RustDOM = require('..');

describe('static tests', () => {
    it('should return correct node const values', () => {
        const testDoc = new RustDOM("<!DOCTYPE html>Test").document;
        expect(testDoc.ELEMENT_NODE).to.equal(1);
        expect(testDoc.TEXT_NODE).to.equal(3);
        expect(testDoc.PROCESSING_INSTRUCTION_NODE).to.equal(7);
        expect(testDoc.COMMENT_NODE).to.equal(8);
        expect(testDoc.DOCUMENT_NODE).to.equal(9);
        expect(testDoc.DOCUMENT_TYPE_NODE).to.equal(10);
        expect(testDoc.DOCUMENT_FRAGMENT_NODE).to.equal(11);
    });
    it('should return correct document position const values', () => {
        const testDoc = new RustDOM("<!DOCTYPE html>Test").document;
        expect(testDoc.DOCUMENT_POSITION_DISCONNECTED).to.equal(0x01);
        expect(testDoc.DOCUMENT_POSITION_PRECEDING).to.equal(0x02);
        expect(testDoc.DOCUMENT_POSITION_FOLLOWING).to.equal(0x04);
        expect(testDoc.DOCUMENT_POSITION_CONTAINS).to.equal(0x08);
        expect(testDoc.DOCUMENT_POSITION_CONTAINED_BY).to.equal(0x10);
        expect(testDoc.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC).to.equal(0x20);
    });
});