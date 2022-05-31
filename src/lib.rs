use neon::prelude::*;
use neon::result::{JsResult};
use neon::types::{JsString};
use std::cell::RefCell;

// Import nodesend struct
mod nodesend;
use nodesend::NodeSend;

// Implement Finalize for NodeSend struct here as this requires neon imports
impl Finalize for NodeSend {}

fn to_object<'a>(node: NodeSend, node_type: i8, mut cx: FunctionContext<'a>) -> JsResult<'a, JsValue> {
    let obj = cx.empty_object();

    let node_type = cx.number(node_type);
    obj.set(&mut cx, "nodeType", node_type)?;

    let node_send = cx.boxed(RefCell::new(node));
    obj.set(&mut cx, "_nodeSend", node_send)?;

    Ok(obj.upcast())
}

// Note this file encapsulates all logic required for neon but is independent of html parsing logic

type BoxedNode = JsBox<RefCell<NodeSend>>;

fn parse(mut cx: FunctionContext) -> JsResult<JsValue> {
    // Read input string of function
    let input = cx.argument::<JsString>(0)?;

    // Convert JsString to String
    let document = input.value(&mut cx);

    // Create new RefCell for Dom
    let node = NodeSend::new(document);
    let node_type = node.node_type();

    to_object(node, node_type, cx)
}

fn inner_html(mut cx: FunctionContext) -> JsResult<JsString> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let content = dom.borrow().inner_html();
    Ok(cx.string(content))
}

fn outer_html(mut cx: FunctionContext) -> JsResult<JsString> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let content = dom.borrow().outer_html();
    Ok(cx.string(content))
}

fn get_attribute(mut cx: FunctionContext) -> JsResult<JsValue> {
    let element = cx.argument::<BoxedNode>(0)?;
    let attribute_name = cx.argument::<JsString>(1)?;
    let result = element.borrow().get_attribute(attribute_name.value(&mut cx));
    match result {
        Ok(result) => Ok(cx.string(result).upcast()),
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn get_elements_by_tag_name(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let class_name = cx.argument::<JsString>(1)?;
    let result = dom.borrow().get_elements_by_tag_name(class_name.value(&mut cx));
    let result_array = JsArray::new(&mut cx, 0);
    match result {
        Ok(result_vec) => {
            for node in result_vec {
                let len = result_array.len(&mut cx);
                let boxed = cx.boxed(RefCell::new(node));
                result_array.set(&mut cx, len, boxed)?;
            }
            Ok(result_array.upcast())
        },
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn has_attribute(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let element = cx.argument::<BoxedNode>(0)?;
    let attribute_name = cx.argument::<JsString>(1)?;
    let result = element.borrow().has_attribute(attribute_name.value(&mut cx));
    Ok(cx.boolean(result))
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
            let boxed = cx.boxed(RefCell::new(NodeSend::new_node(node.as_node().to_owned())));
            result_array.set(&mut cx, len, boxed)?;
        }
    }
    Ok(result_array)
}

fn remove(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let element = cx.argument::<BoxedNode>(0)?;
    element.borrow_mut().detach();
    Ok(cx.undefined())
}

fn remove_attribute(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let element = cx.argument::<BoxedNode>(0)?;
    let attribute_name = cx.argument::<JsString>(1)?;
    element.borrow().remove_attribute(attribute_name.value(&mut cx));

    Ok(cx.undefined())
}

// TODO look at cleaning up using Entry API
fn set_attribute(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let element = cx.argument::<BoxedNode>(0)?;
    let attribute_name = cx.argument::<JsString>(1)?;
    let attribute_value = cx.argument::<JsString>(2)?;
    if element.borrow().has_attribute(attribute_name.value(&mut cx)) {
        element.borrow().set_attribute(attribute_name.value(&mut cx), attribute_value.value(&mut cx));
    } else {
        element.borrow().insert_attribute(attribute_name.value(&mut cx), attribute_value.value(&mut cx));
    }

    Ok(cx.undefined())
}

fn clone_node(mut cx: FunctionContext) -> JsResult<JsValue> {
    let node = cx.argument::<BoxedNode>(0)?;
    // TODO add deep clone functionality
    let deep = cx.argument::<JsBoolean>(1)?;
    let cloned_node = node.borrow_mut().clone(deep.value(&mut cx));
    let node_type = cloned_node.node_type();
    to_object(cloned_node, node_type, cx)

}

fn create_text_node(mut cx: FunctionContext) -> JsResult<BoxedNode> {
    let text = cx.argument::<JsString>(0)?;
    let node = NodeSend::create_text_node(text.value(&mut cx));
    Ok(cx.boxed(RefCell::new(node)))
}

fn append_child(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let parent = cx.argument::<BoxedNode>(0)?;
    let child = cx.argument::<BoxedNode>(1)?;
    parent.borrow_mut().append_child(&child.borrow());
    Ok(cx.undefined())
}

fn remove_child(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let parent = cx.argument::<BoxedNode>(0)?;
    let child = cx.argument::<BoxedNode>(1)?;
    let error_string = "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.";
    if parent.borrow().is_child(&child.borrow()) {
        child.borrow_mut().detach();
        Ok(cx.undefined())
    } else {
        cx.throw_error(error_string)
    }
}

fn first_child(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().first_child();
    match result {
        Ok(node) => {
            let node_type = node.node_type();
            to_object(node, node_type, cx)
        },
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn last_child(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().last_child();
    match result {
        Ok(node) => {
            let node_type = node.node_type();
            to_object(node, node_type, cx)
        },
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn previous_sibling(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().previous_sibling();
    match result {
        Ok(node) => {
            let node_type = node.node_type();
            to_object(node, node_type, cx)
        },
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn next_sibling(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().next_sibling();
    match result {
        Ok(node) => {
            let node_type = node.node_type();
            to_object(node, node_type, cx)
        },
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn parent_element(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().parent_node();
    match result {
        Ok(node) => {
            let node_type = node.node_type();
            if node_type == 1 { Ok(cx.boxed(RefCell::new(node)).upcast()) }
            else { Ok(cx.null().upcast()) }
        },
        Err(_err) => Ok(cx.null().upcast())
    }
}

fn parent_node(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().parent_node();
    match result {
        Ok(node) => {
            let node_type = node.node_type();
            to_object(node, node_type, cx)
        },
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
    let result = dom.borrow().node_name();
    Ok(cx.string(result))
}

fn node_public_id(mut cx: FunctionContext) -> JsResult<JsString> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().node_public_id();
    Ok(cx.string(result))
}

fn node_system_id(mut cx: FunctionContext) -> JsResult<JsString> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().node_system_id();
    Ok(cx.string(result))
}

fn node_type(mut cx: FunctionContext) -> JsResult<JsNumber> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().node_type();
    Ok(cx.number(result))
}

fn child_nodes(mut cx: FunctionContext) -> JsResult<JsValue> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().child_nodes();
    let result_array = JsArray::new(&mut cx, 0);
    for node in result {
        let len = result_array.len(&mut cx);
        let node = NodeSend::new_node(node);
        let node_type = cx.number(node.node_type());
        let node_send = cx.boxed(RefCell::new(node));
        let obj = cx.empty_object();
        obj.set(&mut cx, "nodeType", node_type)?;
        obj.set(&mut cx, "_nodeSend", node_send)?;
        result_array.set(&mut cx, len, obj)?;
    }
    Ok(result_array.upcast())
}

fn is_same_node(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let node = cx.argument::<BoxedNode>(0)?;
    let other_node = cx.argument::<BoxedNode>(1)?;
    let result = node.borrow().eq(&other_node.borrow());
    Ok(cx.boolean(result))
}

fn has_child_nodes(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().first_child();
    match result {
        Ok(..) => Ok(cx.boolean(true)),
        Err(..) => Ok(cx.boolean(false))
    }
}

fn children(mut cx: FunctionContext) -> JsResult<JsArray> {
    let dom = cx.argument::<BoxedNode>(0)?;
    let result = dom.borrow().children();
    let result_array = JsArray::new(&mut cx, 0);
    for node in result {
        let len = result_array.len(&mut cx);
        let boxed = cx.boxed(RefCell::new(NodeSend::new_node(node.as_node().to_owned())));
        result_array.set(&mut cx, len, boxed)?;
    }
    Ok(result_array)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("appendChild", append_child)?;
    cx.export_function("childNodes", child_nodes)?;
    cx.export_function("children", children)?;
    cx.export_function("cloneNode", clone_node)?;
    cx.export_function("createTextNode", create_text_node)?;
    cx.export_function("firstChild", first_child)?;
    cx.export_function("getAttribute", get_attribute)?;
    cx.export_function("getElementsByTagName", get_elements_by_tag_name)?;
    cx.export_function("hasAttribute", has_attribute)?;
    cx.export_function("hasChildNodes", has_child_nodes)?;
    cx.export_function("innerHTML", inner_html)?;
    cx.export_function("isSameNode", is_same_node)?;
    cx.export_function("lastChild", last_child)?;
    cx.export_function("nextSibling", next_sibling)?;
    cx.export_function("nodeName", node_name)?;
    cx.export_function("nodeType", node_type)?;
    cx.export_function("outerHTML", outer_html)?;
    cx.export_function("parentElement", parent_element)?;
    cx.export_function("parentNode", parent_node)?;
    cx.export_function("parse", parse)?;
    cx.export_function("previousSibling", previous_sibling)?;
    cx.export_function("publicId", node_public_id)?;
    cx.export_function("querySelector", query_selector)?;
    cx.export_function("querySelectorAll", query_selector_all)?;
    cx.export_function("remove", remove)?;
    cx.export_function("removeAttribute", remove_attribute)?;
    cx.export_function("removeChild", remove_child)?;
    cx.export_function("setAttribute", set_attribute)?;
    cx.export_function("systemId", node_system_id)?;
    cx.export_function("textContent", text_content)?;
    Ok(())
}
