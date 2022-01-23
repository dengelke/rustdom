const RustDOM = require('../index.js');

try {
    const dom = new RustDOM(`<!DOCTYPE html><p>Hello world!</p>`);
    // console.log(dom.document)
    console.log(dom.document.querySelector("p").textContent);
} catch (err) {
    console.log(err);
}