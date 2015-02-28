node-red-contrib-json
====================

A collection of [Node-RED](http://nodered.org) nodes for processing JSON objects, particularly selecting data from them.

Install
-------

From your `node-red` directory:

`npm install node-red-contrib-json`

Note that the jq node needs to be able to run the `jq` command line program.
See the [jq site](http://stedolan.github.io/jq/) for installation instructions.

Usage
-----

The nodes in this collection (JSONPath, JSONSelect, and jq) operate in essentially the same way.
When a message arrives, the node applies an expression to select out properties from the incoming object.
The selected property values are then sent out via the outgoing *msg.payload*.

Details for how to correctly create an expression differ by tool:
 
 * [JSONPath](https://www.npmjs.com/package/JSONPath)
 * [JSONSelect](http://jsonselect.org/)
 * [jq](http://stedolan.github.io/jq/)
