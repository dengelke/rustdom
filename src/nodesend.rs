use html5ever::serialize::TraversalScope::*;
use html5ever::serialize::{SerializeOpts};
use html5ever::tree_builder::TreeBuilderOpts;

use kuchiki::iter::{Descendants, Elements, Select, Siblings};
use kuchiki::traits::*;
use kuchiki::{NodeData, NodeRef, ParseOpts};

pub struct NodeSend {
    node: NodeRef,
}

// TODO refactor unsafe
unsafe impl Send for NodeSend {}

impl NodeSend {
    pub fn new(input: String) -> Self {
        // Create parser optinos
        let opts = ParseOpts {
            tree_builder: TreeBuilderOpts {
                drop_doctype: false,
                ..Default::default()
            },
            // Need to set this value to throw errors in js
            // on_parse_error: Some(Box::new(move |err| {
            //     eprintln!("HTML parse error: {:?}", err);
            //     panic!("{}", err.to_string());
            // })), 
            ..Default::default()
        };
        let node = kuchiki::parse_html_with_options(opts).one(input);
        NodeSend { node }
    }

    // TODO Fix since that deep has no effect on empty elements, such as the <img> and <input> elements.
    pub fn clone(&self, deep: bool) -> Self {
        let data = self.node.data().to_owned();
        let node = NodeRef::new(data);
        let mut node_send = NodeSend { node };
        if deep {
            for node in self.node.children() {
                let node_send_loop = NodeSend { node };
                let cloned_node = node_send_loop.clone(deep);
                node_send.append_child(&cloned_node);
            }
        }
        return node_send
    }

    pub fn normalize(&self) -> () {
        for node in self.child_nodes() {
            // If text node
            if let Some(text_node) = node.as_text() {
                // If 0 length delete node
                if text_node.borrow().len() == 0 {
                    node.detach();
                }
                // With sibling
                while let Some(next_sibling) = node.next_sibling() {
                    // That is a text node
                    if let Some(next_text) = next_sibling.as_text() {
                        // Append to text node
                        text_node.borrow_mut().push_str(&next_text.borrow());
                        // Remove next sibling
                        next_sibling.detach();
                    } else {
                        // TODO add test for break
                        // If not text node break loop
                        break;
                    }
                }
            } else {
                // If not text node iterate
                let node_send = NodeSend { node };
                node_send.normalize();
            }
        }
        return
    }

    pub fn eq(&self, node: &NodeSend) -> bool {
        self.node.eq(&node.node)
    }

    // Test if node passed is a child of this node
    pub fn is_child(&self, node: &NodeSend) -> bool {
        let child_parent_result = node.parent_node();
        match child_parent_result {
            Ok(child_parent) => self.eq(&child_parent),
            Err(_err) => false,
        }
    }

    pub fn new_node(node: NodeRef) -> Self {
        NodeSend { node }
    }

    pub fn create_text_node(content: String) -> Self {
        let node = NodeRef::new_text(content);
        NodeSend { node }
    }

    pub fn append_child(&mut self, new_child: &NodeSend) -> () {
        self.node.append(new_child.node.clone())
    }

    pub fn detach(&mut self) -> () {
        self.node.detach();
    }

    pub fn inner_html(&self) -> String {
        // Serialise result
        let mut bytes = vec![];
        html5ever::serialize::serialize(&mut bytes, &self.node, SerializeOpts::default()).unwrap();
        String::from_utf8(bytes).unwrap()
    }

    pub fn outer_html(&self) -> String {
        // Serialise result
        let mut bytes = vec![];
        html5ever::serialize::serialize(&mut bytes, &self.node, SerializeOpts {
            traversal_scope: IncludeNode,
            ..Default::default()
        }).unwrap();
        String::from_utf8(bytes).unwrap()
    }

    pub fn children(&self) -> Elements<Siblings> {
        self.node.children().elements()
    }

    pub fn child_nodes(&self) -> Siblings {
        self.node.children()
    }

    pub fn query_selector(&self, selector: String) -> Result<NodeSend, ()> {
        let selector_match = self.node.select_first(&selector)?;
        let node = selector_match.as_node().to_owned();
        Ok(NodeSend { node })
    }

    pub fn query_selector_all(&self, selector: String) -> Result<Select<Elements<Descendants>>, ()> {
        let result = self.node.select(&selector)?;
        Ok(result)
    }

    pub fn get_attribute(&self, attribute: String) -> Result<String, ()> {
        match self.node.as_element().to_owned().unwrap().attributes.borrow().get(attribute) {
            Some(result) => Ok(result.to_owned()),
            None => Err(()),
        }
    }

    // TODO use selector methods
    pub fn get_elements_by_tag_name(&self, tag: String) -> Result<Vec<NodeSend>, ()> {
        let result = self.node.descendants()
        .filter(|element| {
            element.as_element().map_or(false, |e| {
                // Since name.local is lowercase, make sure tag matches
                e.name.local.as_ref() == tag.to_lowercase()
            })
        })
        .map(|node| {
            NodeSend { node: node.to_owned() }
        })
        .collect();
        Ok(result)
    }

    pub fn first_child(&self) -> Result<NodeSend, ()> {
        match self.node.first_child() {
            Some(node) => Ok(NodeSend { node }),
            None => Err(())
        }
    }

    pub fn has_attribute(&self, attribute: String) -> bool {
        match self.node.as_element().to_owned().unwrap().attributes.borrow().get(attribute) {
            Some(..) => true,
            None => false,
        }
    }

    pub fn insert_attribute(&self, attribute: String, value: String) -> () {
        match self.node.as_element().to_owned().unwrap().attributes.borrow_mut().insert(attribute, value) {
            Some(..) => (),
            None => ()
        }
    }

    pub fn last_child(&self) -> Result<NodeSend, ()> {
        match self.node.last_child() {
            Some(node) => Ok(NodeSend { node }),
            None => Err(())
        }
    }

    pub fn previous_sibling(&self) -> Result<NodeSend, ()> {
        match self.node.previous_sibling() {
            Some(node) => Ok(NodeSend { node }),
            None => Err(())
        }
    }

    pub fn next_sibling(&self) -> Result<NodeSend, ()> {
        match self.node.next_sibling() {
            Some(node) => Ok(NodeSend { node }),
            None => Err(())
        }
    }

    pub fn parent_node(&self) -> Result<NodeSend, ()> {
        match self.node.parent() {
            Some(node) => Ok(NodeSend { node }),
            None => Err(())
        }
    }

    pub fn remove_attribute(&self, attribute: String) -> () {
        match self.node.as_element().to_owned().unwrap().attributes.borrow_mut().remove(attribute) {
            Some(..) => (),
            None => ()
        }
    }

    pub fn set_attribute(&self, attribute: String, value: String) -> () {
        match self.node.as_element().to_owned().unwrap().attributes.borrow_mut().get_mut(attribute) {
            Some(att) => {
                *att = value;
            },
            None => ()
        }
    }

    pub fn text_content(&self) -> String {
        let text = self.node.text_contents();
        text.to_string()
    }

    pub fn node_name(&self) -> String {
        let data = self.node.data();
        match data {
            NodeData::Element(data) => data.name.local.to_string().to_uppercase(),
            NodeData::Text(..) => "#text".to_string(),
            NodeData::ProcessingInstruction(data) => 
                // TODO test extraction of target
                data.borrow().0.to_string(),
            NodeData::Comment(..) => "#comment".to_string(),
            NodeData::Document(..) => "#document".to_string(),
            NodeData::Doctype(data) => data.name.to_string(),
            NodeData::DocumentFragment => "#document-fragment".to_string(),
        }
    }

    pub fn node_public_id(&self) -> String {
        let data = self.node.as_doctype();
        match data {
            Some(data) => data.public_id.to_string(),
            None => "".to_string()
        }
    }

    pub fn node_system_id(&self) -> String {
        let data = self.node.as_doctype();
        match data {
            Some(data) => data.system_id.to_string(),
            None => "".to_string()
        }
    }
    // See https://dom.spec.whatwg.org/#interface-node for documentation
    pub fn node_type(&self) -> i8 {
        let data = self.node.data();
        match data {
            NodeData::Element(..) => 1,
            NodeData::Text(..) => 3,
            NodeData::ProcessingInstruction(..) => 7,
            NodeData::Comment(..) => 8,
            NodeData::Document(..) => 9,
            NodeData::Doctype(..) => 10,
            NodeData::DocumentFragment => 11,
        }
    }
}