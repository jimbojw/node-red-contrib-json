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

var JSONSelect = require('JSONSelect');
var util = require('../util.js');

module.exports = function(node) {
    "use strict";

    try {
        node.selector = JSONSelect.compile(node.expr);
    } catch (err) {
        node.status({fill:"red",shape:"ring",text:"selector error"});
        node.warn(err);
    }

    node.on("input", function(msg) {
        if (msg == null || !node.selector) { return; }
        var incoming = util.incoming(node, msg);
        try {
            var matches = node.selector.match(incoming);
            msg.payload = matches;
            node.send(msg);
        } catch (err) {
            node.warn(err);
        }
    });
};
