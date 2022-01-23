const RustDOM = require('../index.js')

const dom = new RustDOM("<!DOCTYPE html><html><head></head><body><p>Foo</p><p class='Bar'>Baz</p></body></html>");

console.log(dom.document.body.firstChild.textContent);
console.log(dom.document.querySelector('.Bar').nodeType);
console.log(dom.serialize());
