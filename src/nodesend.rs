use html5ever::serialize::{SerializeOpts};
use html5ever::tree_builder::TreeBuilderOpts;

use kuchiki::iter::{Descendants, Elements, Select, Siblings};
use kuchiki::traits::*;
use kuchiki::{NodeRef, ParseOpts};
use kuchiki::{NodeData};

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

    pub fn new_node(node: NodeRef) -> Self {
        NodeSend { node }
    }

    pub fn serialize(&self) -> String {
        // Serialise result
        let mut bytes = vec![];
        html5ever::serialize::serialize(&mut bytes, &self.node, SerializeOpts::default()).unwrap();
        String::from_utf8(bytes).unwrap()
    }

    pub fn children(&self) -> Siblings {
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

    pub fn first_child(&self) -> Result<NodeSend, ()> {
        match self.node.first_child() {
            Some(node) => Ok(NodeSend { node }),
            None => Err(())
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

    pub fn text_content(&self) -> String {
        let text = self.node.text_contents();
        text.to_string()
    }

    pub fn node_info(&self) -> (i32, String) {
        let data = self.node.data();
        match data {
            NodeData::Element(data) => {
                (1, data.name.local.to_string().to_uppercase())
            },
            NodeData::Text(_data) => {
                (3, "#text".to_string())
            },
            NodeData::ProcessingInstruction(_data) => {
                // TODO fix
                (7, "ProcessingInstruction".to_string())
            },
            NodeData::Comment(_data) => {
                (8, "#comment".to_string())
            },
            NodeData::Document(_data) => {
                (9, "#document".to_string())
            },
            NodeData::Doctype(data) => {
                (10, data.name.to_string())
            },
            NodeData::DocumentFragment => {
                // TODO fix
                (11, "DocumentFragment".to_string())
            },
        }
    }
}