# TODO

## Required
- [x] Update to neon 0.9
- [x] Send boxed results back to Node.js thread
- [x] Create class structure
- [x] Add basic dom query functionality
- [x] Add watch functionality while developing
- [x] Add additional dom query functionality (parent, siblings)
- [x] Test for id, class, nested selector functionality
- [x] Return null in case of no element
- [x] Cleanup rust struct and make own file
- [x] Add Github Actions CI
- [x] Return additional dom properties
- [x] Git commit changes
- [x] Publish package
- [x] Update README
- [x] Return JsValue instead of JsBox or Error
- [x] Support children and querySelectorAll
- [x] Support NodeList
- [x] Handle document.body.parent.body correctly
- [x] Optimise return based on known nodeTypes
- [ ] Return nodeName correctly for all types (to be tested)
- [ ] Support window in node.js
- [ ] Update DOM properties
- [ ] Add additional nodes to dom tree (POC done)
- [ ] Return DOM parsing errors
- [ ] Support iteration over lists
- [ ] Update to Typescript
- [ ] Implement ts-mixin
- [ ] Provide detailed API docs
- [ ] Implement rwlock or other thread safety mechanism
- [ ] Performance benchmarking
- [ ] Write blog article
- [ ] Node.js Async API using JsPromise 

## Optional
- [ ] Graceful error handling throughout API
- [ ] Investigate removing html5ever dependency
- [ ] Load from url using node-fetch
- [ ] Load from file using fs