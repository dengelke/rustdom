use neon::prelude::*;
use neon::result::{JsResult};
use neon::types::{JsString};
use std::cell::RefCell;

// Import nodesend struct
mod nodesend;
use nodesend::NodeSend;

// Implement Finalize for NodeSend struct here as this requires neon imports
impl Finalize for NodeSend {}

// Note this file encapsulates all logic required for neon but is independent of html parsing logic

type BoxedNode = JsBox<RefCell<NodeSend>>;

fn parse(mut cx: FunctionContext) -> JsResult<BoxedNode> {
    // Read input string of function
    let input = cx.argument::<JsString>(0)?;

    // Convert JsString to String
    let document = input.value(&mut cx);

    // Create new RefCell for Dom
    let dom = RefCell::new(NodeSend::new(document));

    Ok(cx.boxed(dom))
}

fn serialize(mut cx: FunctionContext) -> JsResult<JsString> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let content = dom.borrow().serialize();
    Ok(cx.string(content))
}

fn query_selector(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let selector = cx.argument::<JsString>(1)?;
    let result = dom.borrow().query_selector(selector.value(&mut cx));
    match result {
        Ok(node) => Ok(cx.boxed(RefCell::new(node)).upcast()),
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn query_selector_all(mut cx: FunctionContext) -> JsResult<JsArray> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let selector = cx.argument::<JsString>(1)?;
    let result = dom.borrow().query_selector_all(selector.value(&mut cx));
    let result_array = JsArray::new(&mut cx, 0);
    for selector in result {
        for node in selector {
            let len = result_array.len(&mut cx);
            // TODO remove as_node and to_owned component
            let boxed = cx.boxed(RefCell::new(NodeSend::new_node(node.as_node().to_owned())));
            result_array.set(&mut cx, len, boxed)?;
        }
    }
    Ok(result_array)
}


fn first_child(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().first_child();
    match result {
        Ok(node) => Ok(cx.boxed(RefCell::new(node)).upcast()),
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn last_child(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().last_child();
    match result {
        Ok(node) => Ok(cx.boxed(RefCell::new(node)).upcast()),
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn previous_sibling(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().previous_sibling();
    match result {
        Ok(node) => Ok(cx.boxed(RefCell::new(node)).upcast()),
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn next_sibling(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().next_sibling();
    match result {
        Ok(node) => Ok(cx.boxed(RefCell::new(node)).upcast()),
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn parent_node(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().parent_node();
    match result {
        Ok(node) => Ok(cx.boxed(RefCell::new(node)).upcast()),
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn text_content(mut cx: FunctionContext) -> JsResult<JsString> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let text = dom.borrow().text_content();
    Ok(cx.string(text))
}

fn node_name(mut cx: FunctionContext) -> JsResult<JsString> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().node_info();
    Ok(cx.string(result.1))
}

fn node_type(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().node_info();
    Ok(cx.number(result.0))
}

fn children(mut cx: FunctionContext) -> JsResult<JsArray> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().children();
    let result_array = JsArray::new(&mut cx, 0);
    for node in result {
        let len = result_array.len(&mut cx);
        let boxed = cx.boxed(RefCell::new(NodeSend::new_node(node)));
        result_array.set(&mut cx, len, boxed)?;
    }
    Ok(result_array)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("parse", parse)?;
    cx.export_function("serialize", serialize)?;
    cx.export_function("querySelector", query_selector)?;
    cx.export_function("querySelectorAll", query_selector_all)?;
    cx.export_function("firstChild", first_child)?;
    cx.export_function("lastChild", last_child)?;
    cx.export_function("previousSibling", previous_sibling)?;
    cx.export_function("nextSibling", next_sibling)?;
    cx.export_function("parentNode", parent_node)?;
    cx.export_function("textContent", text_content)?;
    cx.export_function("nodeName", node_name)?;
    cx.export_function("nodeType", node_type)?;
    cx.export_function("children", children)?;
    Ok(())
}
