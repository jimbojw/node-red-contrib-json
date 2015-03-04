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

var parse = require('json-select/parse');
var select = require('json-select/select');
var safeEval = require('notevil');
var util = require('../util.js');

module.exports = function(node, RED) {
    "use strict";

    node.path = null;
    var parseError = null;
    var pathType = null;
    try {
        node.path = JSON.parse(node.expr);
        pathType = 'JSON';
    } catch (err) { /* Not JSON. */ }
    if (!node.path) {
        try {
            node.path = safeEval('('+node.expr+')');
            pathType = 'JS';
        } catch (err) { /* Not literal JS. */ }
    }
    if (!node.path) {
        try {
            node.path = parse(node.expr);
            pathType = 'string';
        } catch (err) {
            node.status({fill:"red",shape:"ring",text:"invalid path"});
            node.error(err);
        }
    }
    if (node.path && !Array.isArray(node.path)) {
        node.path = [node.path];
    }
    if (RED.settings.verbose) {
        node.log(node.engine+' <'+pathType+'>: '+require('util').inspect(node.path));
    }

    node.on("input", function(msg) {
        if (msg == null || !node.path) { return; }
        var incoming = util.incoming(node, msg);
        try {
            var matches = select(incoming, node.path);
            msg.payload = matches;
            node.send(msg);
        } catch (err) {
            node.warn(err);
        }
    });
};
