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
var spawn = require('child_process').spawn;
var util = require('../util.js');

module.exports = function(node) {
    "use strict";

    if (node.command.indexOf(" ") !== -1) {
        node.status({fill:"red",shape:"ring",text:"command error"});    
        node.error("jq command must be just the command - no spaces or extra parameters");
        return;
    }

    var running = 0;
    var update = function(delta) {
        running += delta;
        if (running < 0) { running = 0; }
        if (running) {
            node.status({fill:"green",shape:"dot",text:"running ("+running+")"});
        } else {
            node.status({});
        }
    };

    node.on("input", function(msg) {
        if (msg == null) { return; }
        var incoming = util.incoming(node, msg);
        if (typeof incoming === "undefined") { return; }
        if (!Buffer.isBuffer(incoming)) {
            if (typeof incoming === "object") { 
                try {
                    incoming = JSON.stringify(incoming);
                } catch (err) {
                    node.status({});
                    node.error(err);
                    return;
                }
            }
            if (typeof incoming !== "string") { incoming = incoming.toString(); }
        }
        var jq;
        try {
            jq = spawn(node.command,[node.expr]);
        } catch (err) {
            node.error(err);
            return;
        }
        update(+1);
        jq.stdout.pipe(JSONStream.parse().on('root', function (obj) {
            msg.payload = obj;
            node.send(msg);
        }));
        jq.stderr.on('data', function (data) { node.warn(data); });
        jq.on('close', function (code) { update(-1); });
        jq.on('error', function (code) { node.warn(code); });
        jq.stdin.write(incoming);
        jq.stdin.end();
    });
};
