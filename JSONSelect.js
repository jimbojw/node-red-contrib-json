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

module.exports = function(RED) {
    "use strict";
    function JSONSelectNode(n) {
        RED.nodes.createNode(this,n);

        this.complete = n.complete||"payload";
        if (this.complete === "false") {
            this.complete = "payload";
        }
        if (this.complete === true) {
            this.complete = "true";
        }

        this.selector = n.selector;
        this.status({});
        try {
          this.compiled = JSONSelect.compile(this.selector);
          if (RED.settings.verbose) { this.log("selector: "+this.selector); }
        } catch (err) {
          this.status({fill:"red",shape:"ring",text:"selector error"});
          this.warn(err);
        }

        var node = this;

        this.on("input", function(msg) {
            if (msg == null || !node.compiled) { return; }
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
            try {
              var matches = node.compiled.match(incoming);
              msg.payload = matches;
              node.send(msg);
            } catch (err) {
              node.warn(err);
            }
        });
    }
    RED.nodes.registerType("JSONSelect",JSONSelectNode);
}
