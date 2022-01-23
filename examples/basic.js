const RustDOM = require('../index.js')

try {
    const dom = new RustDOM("<!DOCTYPE html><html><head></head><body><p>Test</p><p class='foo'>Bar</p></body></html>");
    console.log(dom.document.querySelector('body').firstChild.textContent);
    console.log(dom.document.querySelector('body').lastChild.textContent);
    console.log(dom.document.serialize());
} catch (err) {
    console.log({err})
}
