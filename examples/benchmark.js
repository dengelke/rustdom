const fs = require('fs');
const path = require("path");

const RustDOM = require('../index.js');
const html = fs.readFileSync(path.resolve(__dirname, './html/html.html'), 'utf8');

const heapUsage = () => `heapUsed: ${Math.round(process.memoryUsage()['heapUsed'] / 1024 / 1024 * 100) / 100} MB`


try {
    console.log(`post loading: ${heapUsage()}`);
    console.time('parsing');
    const dom = new RustDOM(html);
    console.timeEnd('parsing');
    console.log(`post parsing: ${heapUsage()}`);

    const p = dom.document.querySelector('#element-interfaces:htmlheadingelement-2');
    console.log(p.textContent);

    console.time('serialize');
    const output = document.serialize();
    console.timeEnd('serialize');
    console.log(`post serialize: ${heapUsage()}`);
} catch (err) {
    console.log({err})
}
