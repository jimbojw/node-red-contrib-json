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

"use strict";
module.exports = {

    // given a node and a message, extract the incoming object
    incoming: function(node, msg) {
        if (node.complete === "complete") {
            return msg;
        }
        try {
            return (node.prop||"payload").split(".").reduce(function (obj, i) {
                return obj[i];
            }, msg);
        } catch (err) {
            return; // undefined
        }
    }

};
