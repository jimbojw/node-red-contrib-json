/**
 * Copyright 2015 Jim R. Wilson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var JSONStream = require('JSONStream');
var isUtf8 = require('is-utf8');

module.exports = function(RED) {
    "use strict";
    var spawn = require('child_process').spawn;

    function JqNode(n) {
        RED.nodes.createNode(this,n);
        this.cmd = n.command;
        this.expr = n.expr;

        this.complete = n.complete||"payload";
        if (this.complete === "false") {
            this.complete = "payload";
        }
        if (this.complete === true) {
            this.complete = "true";
        }

        var node = this;

        this.on("input", function(msg) {
            if (msg == null) { return; }
            node.status({fill:"blue",shape:"dot"});
            if (RED.settings.verbose) { node.log(node.cmd+" '" + node.expr + "'"); }
            var incoming;
            if (node.complete === "true") {
                incoming = msg;
            } else {
                var property = "payload";
                incoming = msg[property];
                if (node.complete !== "false" && typeof node.complete !== "undefined") {
                    property = node.complete;
                    var propertyParts = property.split(".");
                    try {
                        incoming = propertyParts.reduce(function (obj, i) {
                            return obj[i];
                        }, msg);
                    } catch (err) {
                        incoming = undefined;
                    }
                }
            }
            if (typeof incoming === "undefined") {
                incoming = null;
            }
            if (!Buffer.isBuffer(incoming)) {
                if (typeof incoming === "object") { 
                    try {
                        incoming = JSON.stringify(incoming);
                    } catch (err) {
                        msg.payload = err;
                        node.status({});
                        node.send([null,msg,null]);
                        return;
                    }
                }
                if (typeof incoming !== "string") { incoming = incoming.toString(); }
            }
            if (RED.settings.verbose) { node.log("inp: "+incoming); }
            if (node.cmd.indexOf(" ") == -1) {
                node.status({fill:"green",shape:"dot",text:"running"});
                var jq = spawn(node.cmd,[node.expr]);
                var outparser = JSONStream.parse().on('root', function (obj) {
                  msg.payload = obj;
                  node.send([msg,null,null]);
                });
                jq.stdout.pipe(outparser);
                jq.stderr.on('data', function (data) {
                    if (isUtf8(data)) { msg.payload = data.toString(); }
                    else { msg.payload = new Buffer(data); }
                    node.send([null,msg,null]);
                });
                jq.on('close', function (code) {
                    msg.payload = code;
                    node.status({});
                    node.send([null,null,msg]);
                });
                jq.on('error', function (code) {
                    node.warn(code);
                });
                jq.stdin.write(incoming);
                jq.stdin.write('\n');
                jq.stdin.end();
            }
            else { node.error("Spawn command must be just the command - no spaces or extra parameters"); }
        });
    }
    RED.nodes.registerType("jq",JqNode);
}
