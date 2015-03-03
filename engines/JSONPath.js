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

var JSONPath = require('JSONPath');
var util = require('../util.js');

module.exports = function(node) {
    "use strict";
    node.on("input", function(msg) {
        if (msg == null) { return; }
        var incoming = util.incoming(node, msg);
        try {
            var matches = JSONPath.eval(incoming, node.expr);
            msg.payload = matches;
            node.send(msg);
        } catch (err) {
            node.warn(err);
        }
    });
};
