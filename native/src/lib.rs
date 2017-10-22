#[macro_use]
extern crate neon;
extern crate html5ever;

use neon::vm::{Call, JsResult};
use neon::js::JsString;
use neon::js::error::{JsError, Kind};
use neon::mem::Handle;

use std::default::Default;
use std::string::String;

use html5ever::{parse_document};
use html5ever::driver::ParseOpts;
use html5ever::rcdom::RcDom;
use html5ever::serialize::{SerializeOpts, serialize};
use html5ever::tree_builder::TreeBuilderOpts;
use html5ever::tendril::TendrilSink;

fn parse(call: Call) -> JsResult<JsString> {
    let scope = call.scope;
    let input: Handle<JsString> = call.arguments.require(scope, 0)?.check::<JsString>()?;
    let opts = ParseOpts {
        tree_builder: TreeBuilderOpts {
            drop_doctype: true,
            ..Default::default()
        },
        ..Default::default()
    };

    let dom = parse_document(RcDom::default(), opts)
        .from_utf8()
        .read_from(&mut input.value().as_bytes())
        .unwrap();

    if !dom.errors.is_empty() {
        println!("\nParse errors:");
        JsError::throw::<()>(Kind::Error, "Error parsing dom").unwrap_err();
    }

    let mut bytes = vec![];
    serialize(&mut bytes, &dom.document, SerializeOpts::default()).unwrap();
    let result = String::from_utf8(bytes).unwrap();

    Ok(JsString::new(scope, &result).unwrap())
}

register_module!(m, {
    m.export("parse", parse)
});
