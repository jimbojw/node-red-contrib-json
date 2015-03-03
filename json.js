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

var engines = require('require-dir')('./engines');

module.exports = function(RED) {
    "use strict";

    function ContribJsonNode(n) {
        RED.nodes.createNode(this,n);

        this.engine = n.engine;
        this.command = n.command;
        this.expr = n.expr;
        this.complete = n.complete;
        this.prop = n.prop;
        this.name = n.name;
        
        this.status({});

        if (RED.settings.verbose) { this.log(this.engine+" '"+this.expr+"'"); }

        if (this.engine in engines) {
            engines[this.engine](this);
        } else {
            this.status({fill:"red",shape:"ring",text:"unrecognized engine"});
            this.warn(Error('Unrecognized engine: ' + this.engine));
            this.on("input", function(msg) {
                this.status({fill:"red",shape:"ring",text:"unrecognized engine"});
                this.warn(Error('Unrecognized engine: ' + this.engine));
            });
        }

    }
    RED.nodes.registerType("contrib-json",ContribJsonNode);
}
