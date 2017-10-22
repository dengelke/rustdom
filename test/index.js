const expect = require('chai').expect;
var assert = require('chai').assert;
const rustdom = require('../lib');

describe('basic tests', () => {
  it('should throw an error', () => {
    assert.throws(function() { rustdom.parse('test') }, Error, 'Error parsing dom');
  })
  it('should parse valid dom', () => {
    expect(rustdom.parse('<!DOCTYPE html><html><head></head><body><p>Test</p></body></html>')).to.equal('<html><head></head><body><p>Test</p></body></html>')
  })
  it('should insert head and body tags', () => {
    expect(rustdom.parse('<!DOCTYPE html>Test')).to.equal('<html><head></head><body>Test</body></html>')
  })
})
