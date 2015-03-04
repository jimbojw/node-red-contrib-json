# node-red-contrib-json

A powerful [Node-RED](http://nodered.org) nodes for processing JSON objects.

## Install

From your `node-red` directory:

`npm install node-red-contrib-json`

Note: the `jq` engine needs to be able to find and run the `jq` command line program.
See the [jq site](http://stedolan.github.io/jq/) for installation instructions.

## Usage

Create a new `contrib-json` node, then configure it by chooing an engine and specifying an expression.

Whenever a message arrives, the node will apply the expression using the selected engine.
The output is then sent via the outgoing *msg.payload*.

## Engines

These engines are currently supported.
Examples of each are integrated into the node itself.

### JSONSelect

Site: [JSONSelect](http://jsonselect.org/)

This is the default engine.
JSONSelect uses a CSS-like selector syntax.
Outputs a (possibly empty) array of results.

Why use JSONSelect?
 * The syntax is simple to learn and use.

Be careful: Like CSS, recursive descent is the default behavior.

### JSONPath

Site: [JSONPath](https://www.npmjs.com/package/JSONPath)

Uses an XPath-like selector syntax.
Outputs a (possibly empty) array of results.

Why use JSONPath?
 * Relatively simple syntax.
 * Supports filter expressions so you can compare values for matching.

### jq

Site: [jq](http://stedolan.github.io/jq/)

Uses a rich custom compositing language, which includes functions and operators for manipulating data.
Outputs one or more messages (one for each result).

Why use jq?
 * Rich built-in functions for manipulating JSON objects.
 * Supports piping operations.

Be careful: this engine shells out to a command-line process, which incurs a JSON serialization and deserialization penalty.

### json-select

Site: [json-select](https://www.npmjs.com/package/json-select)

Uses a JSONStream based path (or equivalent JSON object) to match and manipulate objects.
Outputs a message containing the result (may be an array).

Why use json-select?
 * Possible to create composite objects by reaching in to the original.
 * For simple jobs, the syntax is very terse.
