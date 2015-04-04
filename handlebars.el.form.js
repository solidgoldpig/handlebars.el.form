(function (moduleFactory) {
    if(typeof exports === "object") {
        module.exports = moduleFactory(require("lodash"), require("handlebars.phrase"), require("handlebars.el"));
    } else if (typeof define === "function" && define.amd) {
        define(["lodash", "handlebars.phrase", "handlebars.el"], moduleFactory);
    }
}(function (_, Phrase, ElHelper) {
/**
 * @module handlebars%el%form
 * @description  Provides helper to generate form elements
 * 
 *      var Handlebars = require("handlebars");
 *      var FormHelper = require("handlebars.el.form");
 *      FormHelper.registerHelper(Handlebars);
 *      
 * @returns {object} FormHelper instance
 */

    var FormHelpers = function (Handlebars, prefix) {
        var CONTROLCLASS = {
            edit: "edit",
            display: "display"
        };

        var helpers = {};

        var formDefaults = {
            "el-tag": "form",
            "method": "post",
            "el-escape": false
        };
        /**
         * @template el-form
         * @block helper
         * @param {string} [method=post] Form method
         * @param {boolean} [el-escape=false] Whether to escape form content
         * @param {object} [model] Model object to provide values for form controls
         * @description Outputs a form element
         *
         *     {{#el-form}}…{{/el-form}}
         *
         * If a model it passed, it is used to provide values for any nested controls (unless any of those controls have been passed an explicit value).
         *
         * Accepts any parameter that the *el* helper takes since it is built upon it
         * @returns {string} Form output
         */ 
        // TODO wizard
        helpers["el-form"] = function () {
            var args = Array.prototype.slice.call(arguments);
            var options = args.pop();
            var hash = options.hash;
            var model = hash.model;
            delete hash.model;
            var wizard = hash.wizard;
            delete hash.wizard;

            hash = _.extend({}, hash.attributes, hash);
            delete hash.attributes;
            hash = _.extend({}, formDefaults, hash);
            options.hash = hash;

            var that = this || {};
            that.model = model;
            that.wizardSchema = wizard;
            return Handlebars.helpers.el.apply(that, [options]);
        };

        //TODO - submit, fieldset, field, group, field, form
        // redo el to include el- on attributes

        /**
         * @method inputHelper
         * @param {string} 0 Input type
         * @param {string} [id] Control id
         * @param {string} [name] Control name
         * @param {string} [value] Control value
         * @param {boolean} [el-control] Wjether or not to treat output as a control or to be displayed
         * @description  Generic method to handle output of all input elements
         *
         * Accepts any parameter that the *el* helper takes since it is built upon it
         * @return {string} Input field
         */ 
        function inputHelper () {
            var args = Array.prototype.slice.call(arguments);
            var hash = args[args.length-1].hash;
            hash["el-tag"] = "input";
            hash.type = args.shift();
            // display rather than edit mode
            if (hash["el-control"] === false) {
                for (var prop in hash.attributes) {
                    if (hash[prop] === undefined) {
                        hash[prop] = hash.attributes[prop];
                    }
                }
                delete hash.attributes;
                // default tag - but why hard-coded and not overridable?
                hash["el-tag"] = "p";
                if (hash.content === undefined) {
                    if (hash.type === "checkbox") {
                        var checked = !!hash.checked;
                        hash.content = checked.toString();
                    } else {
                        hash.contents = hash.value;
                    }
                    delete hash.value;
                    delete hash.id;
                    delete hash.name;
                    delete hash.type;
                }
            }
            delete hash["el-control"];
            var output = Handlebars.helpers.el.apply(this, args);
            return output;
        }

        /**
         * @template el-text
         * @block helper
         * @description  Outputs text input element
         * 
         *     {{{el-text name=name}}}
         *     
         * Calls {@link module:handlebars%el%form~inputHelper} passing *text* as the type
         *
         * Since inputHelper in turn calls the *el* helper, accepts any parameter that the *el* helper takes
         * @return {string} Text input
         */
        helpers["el-text"] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("text");
            return inputHelper.apply(this, args);
        };

        /**
         * @template el-checkbox
         * @block helper
         * @description  Outputs checkbox input element
         * 
         *     {{{el-checkbox name=name}}}
         *     
         * Calls {@link module:handlebars%el%form~inputHelper} passing *checkbox* as the type
         *
         * Since inputHelper in turn calls the *el* helper, accepts any parameter that the *el* helper takes
         *
         * ### Examples
         * 
         *     {{{el-checkbox name="foo"}}}
         *     →  <input name="foo" type="checkbox" value="true">
         *     
         *     {{{el-checkbox name="foo" value="bar"}}}
         *     →  <input name="foo" type="checkbox" value="bar">
         *     
         *     {{{el-checkbox name="foo" attributes=attributes}}}
         *     Context {attributes:{value:"bar"}}
         *     →  <input name="foo" type="checkbox" value="bar">
         *     
         *     {{{el-checkbox name="foo" checked=true}}}
         *     →  <input checked name="foo" type="checkbox" value="true">
         * @return {string} Checkbox input
         */
        helpers["el-checkbox"] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("checkbox");
            args[args.length-1].hash["el-fallback-value"] = true;
            return inputHelper.apply(this, args);
        };

        /**
         * @template el-radio
         * @block helper
         * @description  Outputs radio input element
         * 
         *     {{{el-radio name=name}}}
         *     
         * Calls {@link module:handlebars%el%form~inputHelper} passing *radio* as the type
         *
         * Since inputHelper in turn calls the *el* helper, accepts any parameter that the *el* helper takes
         * @return {string} Radio input
         */
        helpers["el-radio"] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("radio");
            return inputHelper.apply(this, args);
        };

        /**
         * @template el-password
         * @block helper
         * @description  Outputs password input element
         * 
         *     {{{el-password name=name}}}
         * 
         * Calls {@link module:handlebars%el%form~inputHelper} passing *password* as the type
         *
         * Since inputHelper in turn calls the *el* helper, accepts any parameter that the *el* helper takes
         * @return {string} Password input
         */
        helpers["el-password"] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("password");
            return inputHelper.apply(this, args);
        };

        /**
         * @template el-file
         * @block helper
         * @description  Outputs file input element
         * 
         *     {{{el-file name=name}}}
         *     
         * Calls {@link module:handlebars%el%form~inputHelper} passing *file* as the type
         *
         * Since inputHelper in turn calls the *el* helper, accepts any parameter that the *el* helper takes
         * @return {string} File input
         */
        helpers["el-file"] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("file");
            return inputHelper.apply(this, args);
        };

        /**
         * @template el-hidden
         * @block helper
         * @description  Outputs hidden input element
         * 
         *     {{{el-hidden name=name}}}
         *     
         * Calls {@link module:handlebars%el%form~inputHelper} passing *hidden* as the type
         *
         * Since inputHelper in turn calls the *el* helper, accepts any parameter that the *el* helper takes
         * @return {string} Hidden input
         */
        helpers["el-hidden"] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("hidden");
            return inputHelper.apply(this, args);
        };

        /**
         * @template el-submit
         * @block helper
         * @description  Outputs submit input element
         * 
         *     {{{el-submit name=name}}}
         *     
         * Calls {@link module:handlebars%el%form~inputHelper} passing *submit* as the type
         *
         * Since inputHelper in turn calls the *el* helper, accepts any parameter that the *el* helper takes
         * @return {string} Submit input
         */
        helpers["el-submit"] = function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("submit");
            return inputHelper.apply(this, args);
        };

        /**
         * @method  normaliseParamArray
         * @private
         * @param  {array|string} param Parameters to be normalised
         * @description Ensures that all items of the passed param are stringified
         *
         * If param is not an array, it is first wrapped in an array.
         * @return {array} param
         */
        function normaliseParamArray (param) {
             if (param !== undefined && param !== null) {
                if (!_.isArray(param)) {
                    param = [param];
                }
                for (var i = 0; i < param.length; i++) {
                    param[i] = param[i].toString();
                }
            }
            return param;
        }

        /**
         * @template el-select
         * @block helper
         * @param {array} [options] Array of option objects or strings
         * @params {boolean} [options.content] Option content
         *
         * If option passed as a string, it is coerced to an object setting the content property to the string’s value
         * @params {boolean} [options.value] Option value
         *
         * If no value is passed, the option’s content is used
         * @params {boolean} [options.selected] Whether option is selected
         * @params {boolean} [options.disabled] Whether option is disabled
         * @param {array} [values] Array of values
         * 
         * If passed, trumps any value passed as part of the corresponding option object
         *
         * If no options are passed, values is used instead
         * @param {string|array} [selected] Values which are selected
         *
         * If passed, trumps any selected value passed as part of the corresponding option object
         * @param {string|array} [value] Alternative param to pass selected value
         * @param {string|array} [options-disabled] Values which are disabled
         *
         * If passed, trumps any disabled value passed as part of the corresponding option object
         *
         * NB. The parameter is options-disabled, so that disabled can still be used to disable the entire control
         * @param {string|object} [cue] String to display as first element of select when no values has been selected
         * @description  Outputs a select control
         *
         *     {{{el-select name=name options=options}}}
         *
         * ### Examples
         *
         *     {{{el-select name="foo" options=opts}}}
         *     Context {opts:["a", "b"]}
         *     →  <select name="foo">
         *          <option value="a">a</option>
         *          <option value="b">b</option>
         *        </select>
         *
         *     {{{el-select options=opts}}}
         *     Context {opts: [{content:"Foo", value:1}, {content:"Bar", value:2}] }
         *     →  <select>
         *          <option value="1">Foo</option>
         *          <option value="2">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts}}}
         *     Context {opts: [{content:"Foo", value:1}, {content:"Bar", value:2, selected:true}] }
         *     →  <select>
         *          <option value="1">Foo</option>
         *          <option selected value="2">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts values=vals}}}
         *     Context {opts: ["Foo", "Bar"], vals: [1, 2]}
         *     →  <select>
         *          <option value="1">Foo</option>
         *          <option value="2">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts values=vals selected=selected}}}
         *     Context {opts: ["Foo", "Bar"], vals: [1, 2], selected:2}
         *     →  <select>
         *          <option value="1">Foo</option>
         *          <option selected value="2">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts values=vals selected=selected}}}
         *     Context {opts: ["Foo", "Bar"], vals: [1, 0], selected:0}
         *     →  <select>
         *          <option value="1">Foo</option>
         *          <option selected value="0">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts values=vals selected=selected}}}
         *     Context {opts: ["Foo", "Bar"], vals: ["", "a"], selected:""}
         *     →  <select>
         *          <option selected value="">Foo</option>
         *          <option value="a">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts values=vals options-disabled=optionsDisabled}}}
         *     Context {opts: ["Foo", "Bar"], vals: [1, 2], optionsDisabled:2}
         *     →  <select>
         *          <option value="1">Foo</option>
         *          <option disabled value="2">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts values=vals selected=selected options-disabled=optionsDisabled}}}
         *     Context {opts: [{content:"Foo", value:1, disabled:true}, {content:"Bar", value:2, selected:true}], vals:["x", "y"], selected:"x", optionsDisabled:"y" }
         *     →  <select>
         *          <option selected value="x">Foo</option>
         *          <option disabled value="y">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts cue=cue}}}
         *     Context {opts: [{content:"Foo", value:1}, {content:"Bar", value:2}], cue: "Please select" }
         *     →  <select>
         *          <option class="select-cue" disabled selected>Please select</option>
         *          <option value="1">Foo</option>
         *          <option value="2">Bar</option>
         *        </select>
         *
         *     {{{el-select options=opts values=vals value=selected}}}
         *     Context {opts: ["Foo", "Bar"], vals: [1, 2], selected:2}
         *     →  <select>
         *          <option value="1">Foo</option>
         *          <option selected value="2">Bar</option>
         *        </select>
         * 
         * @return {string} Select control
         */
        helpers["el-select"] = function () {
            //TODO
            // map, mapcontent, mapvalue, optgroups
            var args = Array.prototype.slice.call(arguments);
            var options = args[args.length-1];
            var optionsHash = options.hash;
            optionsHash = _.extend({}, optionsHash.attributes, optionsHash);
            delete optionsHash.attributes;
            options.hash = optionsHash;

            var output = "";
            var selected = optionsHash.selected;
            var value = optionsHash.value;
            var optionsDisabled = optionsHash["options-disabled"];
            var cue = optionsHash.cue;
            var opts = optionsHash.options;
            var vals = optionsHash.values;
            if (!opts) {
                opts = vals;
            }
            delete optionsHash.selected;
            delete optionsHash.value;
            delete optionsHash["options-disabled"];
            delete optionsHash.cue;
            delete optionsHash.options;
            delete optionsHash.values;

            if (selected === undefined) {
                selected = value;
            }

            selected = normaliseParamArray(selected);
            optionsDisabled = normaliseParamArray(optionsDisabled);

            var hasSelected;
            for (var i in opts) {
                var optionArgs = opts[i];
                if (typeof optionArgs !== "object") {
                    optionArgs = {
                        content: optionArgs
                    };
                }
                if (vals && vals[i] !== undefined) {
                    optionArgs.value = vals[i];
                } else if (optionArgs.value === undefined) {
                    optionArgs.value = optionArgs.content;
                }
                optionArgs.value = optionArgs.value.toString();
                if (selected !== undefined) {
                    optionArgs.selected = _.intersection(selected, [optionArgs.value]).length > 0;
                    if (!hasSelected) {
                        hasSelected = optionArgs.selected;
                    }
                }

                if (optionsDisabled) {
                    optionArgs.disabled = _.intersection(optionsDisabled, [optionArgs.value]).length > 0;
                }

                opts[i] = optionArgs;
            }

            // No need for a cue if we have a genuine selection
            if (!hasSelected && cue) {
                if (typeof cue !== "object") {
                    cue = {
                        content: cue,
                        "class": "select-cue",
                        "selected": true,
                        "disabled": true
                    };
                }
                opts.unshift(cue);
            }

            for (var opt in opts) {
                opts[opt]["el-tag"] = "option";
                output += Handlebars.helpers.el.apply(this, [{hash:opts[opt]}]);
            }
            optionsHash["el-tag"] = "select";
            optionsHash.content = output;
            optionsHash["el-escape"] = false;
            output = Handlebars.helpers.el.apply(this, args);
            return output;
        };

        /**
         * @template el-textarea
         * @block helper
         * @param {string|array} [value] Text to be output in textarea
         *
         * NB. this is in addition to the usual content and el-content params that the el helper accepts to provide consistency with the other input helpers
         * @param {string} [placeholder] Placeholder text
         * @param {string} [el-phrase-key] Key to use to lookup placeholder text
         * @param {boolean} [el-control] Whether it is in edit or display mode
         * @description  Outputs a textarea element
         *
         *     {{{el-textarea name=name}}}
         *     {{#el-textarea name=name}}...{{/el-textarea}}
         * 
         * Calls the *el* helper so accepts any parameter that the *el* helper takes
         * @return {string} Textarea control
         */
        helpers["el-textarea"] = function () {
            var args = Array.prototype.slice.call(arguments);
            var hash = args[args.length-1].hash;
            //if (hash["el-control"] !== undefined && hash["el-control"] === false) {
            if (hash["el-control"] === false) {
                hash = _.extend({}, hash.attributes, hash);
                delete hash.attributes;
                hash["el-tag"] = "p";
                hash.content = hash.value;
                delete hash.value;
                delete hash.name;
                delete hash.placeholder;
                args[args.length-1].hash = hash;
            } else {
                hash = _.extend({}, hash.attributes, hash);
                delete hash.attributes;
                if (!hash["el-content"]) {
                    hash["el-content"] = hash.value;
                    delete hash.value;
                }
                hash["el-tag"] = "textarea";
                if (!hash.placeholder && hash["el-phrase-key"]) {
                    hash.placeholder = Phrase.get(hash["el-phrase-key"]+"."+"placeholder");
                }
                args[args.length-1].hash = hash;
            }
            var output = Handlebars.helpers.el.apply(this, args);
            return output;
        };

        /**
         * @template el-label
         * @block helper
         * @param {string} [for] Id of input label is connected to
         * @description  Outputs a label for a control
         *
         *     {{{el-label for=for content=content}}}
         *     {{#el-label}}...{{/el-label}}
         * 
         * Calls the *el* helper so accepts any parameter that the *el* helper takes
         * @return {string} Label for control
         */
        helpers["el-label"] = function () {
            var args = Array.prototype.slice.call(arguments);
            var hash = args[args.length-1].hash;
            hash["el-tag"] = "label";
            if (hash.edit !== undefined && hash.edit === false) {
                hash["el-tag"] = "h3";
                delete hash.for;
            }
            delete hash.edit;
            var output = Handlebars.helpers.el.apply(this, args);
            return output;
        };

        function legendOutput (leg) {
            return "<legend><span>" + leg + "</span></legend>";
        }

        /**
         * @template el-fieldset
         * @block helper
         * @param {string} [legend] Text for fieldset legend
         * @description  Outputs a fieldset
         *
         *     {{#el-fieldset legend=legend}}...{{/el-fieldset}}
         *
         * Calls the *el* helper so accepts any parameter that the *el* helper takes
         * @return {string} Fieldset
         */
        helpers["el-fieldset"] = function () {
            var args = Array.prototype.slice.call(arguments);
            var hash = args[args.length-1].hash;
            hash["el-tag"] = "fieldset";
            hash["el-escape"] = false;
            if (hash.legend) {
                hash["el-content-before"] = legendOutput(hash.legend);
                delete hash.legend;
            }
            var output = Handlebars.helpers.el.apply(this, args);
            return output;
        };

        /**
         * @template el-message
         * @block helper
         * @param {string} 0  Field messages relate to
         * @param {string} 1  Message type
         * @param {array|string} 2  Message(s) to display
         * @description  Outputs a message block for a control
         *
         *     {{{el-message name type messages}}}
         *
         * Can be
         *
         * - error
         * - warning
         * - info
         *
         * Gets message block heading by using field.message.heading.{{type}} as a lookup key
         * @return {string} Message block for control
         */
        helpers["el-message"] = function () {
            var args = Array.prototype.slice.call(arguments);
            var field = args.shift();
            var type = args.shift();
            var messages = args.shift();

            if (! _.isArray(messages)) {
                messages = [messages];
            }
            var listArgs = {
                content: messages,
                "el-wrap": "li",
                "el-tag": "ul"
            };
            var messagesOutput = Handlebars.helpers.el({
                hash: listArgs
            });
            var messageHeading = Phrase.get("field.message.heading." + type, {
                field: field,
                count: messages.length
            });
            if (messageHeading) {
                messagesOutput = "<h2>" + messageHeading + "</h2>" + messagesOutput;
            }
            var messageBundle = {
                "el-tag": "div",
                "class": "control-" + type,
                "content": messagesOutput,
                "el-escape": false
            };

            var messageOutput = Handlebars.helpers.el({
                hash: messageBundle
            });

            return messageOutput;

        };

        /**
         * @method  marshallNamespacedAttributes
         * @private
         * @param  {string}  namespace  Property name to marshall
         * @param  {object|string}  attributes  Attributes to retrieve property from
         * @description  Used by el-field to allow for passing of multi-variate attributes
         * @return {object}  attributes
         */
        function marshallNamespacedAttributes(namespace, attributes) {
            if (attributes[namespace] === undefined) {
                attributes[namespace] = {};
            } else if (typeof attributes[namespace] === "string") {
                attributes[namespace] = {
                    content: attributes[namespace]
                };
            }
            var nameSpAlias = attributes[namespace];
            for (var prop in attributes) {
                if (prop.indexOf(namespace+"-") === 0) {
                    var mappedProp = prop.split(namespace+"-")[1];
                    nameSpAlias[mappedProp] = attributes[prop];
                    delete attributes[prop];
                }
            }
            return attributes;
        }

        /**
         * @template el-field
         * @block helper
         * @param {string} name Input name
         *
         * Can also be passed as a property of input
         * @param {string} [id=input-{{name}}] Input id
         * @param {string} [type]  Field type
         * @param {string|array} [class] Field class(es)
         * @param {object} [field] Parameters for field wrapper
         * @param {object|string} [input] Parameters for single input
         * @param {string|object} [introduction]  Parameters for introduction block
         * @param {string|object} [label]  Parameters for label block
         * @param {string|object} [description]  Parameters for description block
         * @param {string|object} [help]  Parameters for help block
         * @param {array} [inputs] Parameters for multiple inputs within control
         *
         * If no id is passed as part of the individual inputs items it will be generated as {{id}}-{{n}}
         * @param {array} [labels]
         * 
         * If passed, trumps any label passed as part of the corresponding inputs array
         *
         * If no inputs are passed, labels is used instead
         * @param {string|object} [legend]  Optional legend block when multiple inputs are passed
         *
         * Ignored otherwise
         * @param {array|string} [checked]  Values which are checked
         * @param {array|string} [inputs-disabled]  Values which are disabled
         * @param {boolean} [edit=true]  Whether to render in edit or display mode
         * @param {boolean} [display=false]  Whether to render in edit or display mode (trumped by edit if defined)
         * @param {object} [model=this.model]  Model from which to retrieve schema, value and phraseKey
         *
         * If no model is passed, will attempt to use the current context’s model property
         * @param {string} [phrase-key={{model.phraseKey}}.{{name}}]  String to use as base lookup key
         *
         * - blocks
         *   {{phraseKey}}.{{blockKey}}
         * - multi-input labels when schema type is enum
         *   {{phraseKey}}.value.{{fieldOptValue}}.label 
         * @param {string|array} [error]  Parameters for error block
         * @param {string|array} [warning]  Parameters for warning block
         * @param {string|array} [info]  Parameters for info block
         * @description  Outputs a field control
         *
         *     {{{el-field name=name}}}
         *     {{{el-field name=name type=type}}}
         *     {{{el-field name=name input=input}}}
         *     {{{el-field name=name inputs=inputs}}}
         *     {{{el-field name=name model=model}}}
         *     {{{el-field name=name
         *                 introduction=introduction
         *                 description=description
         *                 help=help
         *                 error=error
         *                 extra=extra}}}
         *     {{#el-field name=name}}...{{/el-field}}
         * 
         * Generates a field element wrapped around any specified blocks
         *
         * ### Examples
         * 
         *     {{{el-field name="bar"}}}
         *     →  <div class="control control-bar">
         *          <label for="input-bar">Bar</label>
         *          <div class="edit">
         *            <input id="input-bar" name="bar" type="text">
         *          </div>
         *        </div>
         *
         * el-field can capture content
         *
         *     {{#el-field name="bar"}}{{{el-text name="foo"}}}{{/el-field}}
         *     →  <div class="control control-bar">
         *          <input name="foo" type="text">
         *        </div>
         *
         * Edit and display modes
         *
         *     {{{el-field name="foo" value="bar"}}}
         *     →  <div class="control control-foo">
         *          <label for="input-foo">Foo</label>
         *          <div class="edit">
         *            <input id="input-foo" name="foo" type="text" value="bar">
         *          </div>
         *        </div>
         *
         *     {{{el-field name="foo" value="bar" display=true}}}
         *     →  <div class="control control-foo">
         *          <h3>Foo</h3>
         *          <div class="display">
         *            <p>bar</p>
         *          </div>
         *        </div>
         *
         *     {{{el-field name="foo" value="bar" edit=false}}}
         *     →  <div class="control control-foo">
         *          <h3>Foo</h3>
         *          <div class="display">
         *            <p>bar</p>
         *          </div>
         *        </div>
         *
         * Pass additional class on the field wrapper
         *
         *     {{{el-field name="bar" class="foo" value="myvalue"}}}
         *     →  <div class="control control-bar foo">
         *          <label for="input-bar">Bar</label>
         *          <div class="edit">
         *            <input id="input-bar" name="bar" type="text" value="myvalue">
         *          </div>
         *        </div>
         *
         * Pass options to a select field
         *
         *     {{{el-field name="bar" type="select" options=opts}}}
         *     Context {opts: ["foo", "bar"]}
         *     →  <div class="control control-bar">
         *          <label for="input-bar">Bar</label>
         *          <div class="edit">
         *            <select id="input-bar" name="bar">
         *              <option value="foo">foo</option>
         *              <option value="bar">bar</option>
         *            </select>
         *          </div>
         *        </div>
         *
         * Pass a label
         *
         *     {{{el-field name="bar" label="Foo"}}}
         *     →  <div class="control control-bar">
         *          <label for="input-bar">Foo</label>
         *          <div class="edit">
         *            <input id="input-bar" name="bar" type="text">
         *          </div>
         *        </div>
         *
         *     {{{el-field name="bar" label="Foo" id="zam"}}}
         *     →  <div class="control control-bar">
         *          <label for="zam">Foo</label>
         *          <div class="edit">
         *            <input id="zam" name="bar" type="text">
         *          </div>
         *        </div>
         *
         * Passing mutltiple inputs - checkboxes
         *
         *     {{{el-field name="bar" legend="Foo" inputs=inputs checked="b"}}}
         *     Context {inputs:["a", "b", "c"]}
         *     →  <div aria-labelledby="control-group-bar-label" class="control control-bar" role="group">
         *          <p id="control-group-bar-label">Foo</p>
         *          <div class="edit">
         *            <input id="bar-0" name="bar" type="radio" value="a">
         *            <label for="bar-0">a</label>
         *          </div>
         *          <div class="edit">
         *            <input checked id="bar-1" name="bar" type="radio" value="b">
         *            <label for="bar-1">b</label>
         *          </div>
         *          <div class="edit">
         *            <input id="bar-2" name="bar" type="radio" value="c">
         *            <label for="bar-2">c</label>
         *          </div>
         *        </div>
         *
         *     {{{el-field name="bar" legend="Foo" type="checkbox" inputs=inputs checked="b"}}}
         *     Context {inputs:["a", "b", "c"]
         *     →  <div aria-labelledby="control-group-bar-label" class="control control-bar" role="group">
         *          <p id="control-group-bar-label">Foo</p>
         *          <div class="edit">
         *            <input id="bar-0" name="bar" type="checkbox" value="a">
         *            <label for="bar-0">a</label>
         *          </div>
         *          <div class="edit">
         *            <input checked id="bar-1" name="bar" type="checkbox" value="b">
         *            <label for="bar-1">b</label>
         *          </div>
         *          <div class="edit">
         *            <input id="bar-2" name="bar" type="checkbox" value="c">
         *            <label for="bar-2">c</label>
         *          </div>
         *        </div>
         *
         * Passing a lookup key
         *
         *     {{{el-field name="bar" phrase-key="foo.bar"}}}
         *     →  <div class="control control-bar">
         *          <div class="control-introduction">
         *            <p>Bar introduction</p>
         *          </div>
         *          <label for="input-bar">Bar label</label>
         *          <div class="control-description">
         *            <p>Bar description</p>
         *           </div>
         *           <div class="control-help">
         *             <p>Bar help</p>
         *           </div>
         *           <div class="edit">
         *             <input id="input-bar" name="bar" type="text">
         *           </div>
         *           <div class="control-extra">
         *             <p>Bar extra line 1</p>
         *             <p>Bar extra line 2</p>
         *           </div>
         *         </div>
         *
         * Passing errors
         *
         *     {{{el-field name="bar" error=error}}}
         *     Context {error:["Error A", "Error B"]}
         *     →  <div class="control control-bar">
         *          <label for="input-bar">Bar</label>
         *          <div class="edit">
         *            <input id="input-bar" name="bar" type="text">
         *          </div>
         *        <div class="control-error">
         *          <h2>There are 2 problems with the "bar" field</h2>
         *          <ul>
         *            <li>Error A</li>
         *            <li>Error B</li>
         *          </ul>
         *        </div>
         *      </div>
         *
         * #### Using models with el-field
         *
         *     {{{el-field model=model name="baz"}}}
         *     Context {model:fooModel}
         *     →  <div class="control control-baz">
         *          <label for="input-baz">Baz label</label>
         *          <div class="edit">
         *            <input id="input-baz" name="baz" type="text" value="Model baz value">
         *          </div>
         *        </div>
         *     
         *     {{{el-field model=model name="jim" type="select" options=opts}}}
         *     Context {model:fooModel, opts:["zim", "bam", "zoom"]}
         *     →  <div class="control control-jim">
         *          <label for="input-jim">Jim</label>
         *          <div class="edit">
         *            <select id="input-jim" name="jim">
         *              <option value="zim">zim</option>
         *              <option selected value="bam">bam</option>
         *              <option value="zoom">zoom</option>
         *            </select>
         *          </div>
         *        </div>
         *
         *     {{{el-field model=model name="flim" type="radio" inputs=opts}}}
         *     Context {model:fooModel, opts:["zim", "zam", "boom"]}
         *     →  <div class="control control-flim">
         *          <div class="edit">
         *            <input id="flim-0" name="flim" type="radio" value="zim">
         *            <label for="flim-0">zim</label>
         *          </div>
         *          <div class="edit">
         *            <input id="flim-1" name="flim" type="radio" value="zam">
         *            <label for="flim-1">zam</label>
         *          </div>
         *          <div class="edit">
         *            <input checked id="flim-2" name="flim" type="radio" value="boom">
         *            <label for="flim-2">boom</label>
         *          </div>
         *        </div>
         *
         *     {{{el-field model=model name="flim"}}}
         *     Context {model:fooModel}
         *     →  <div class="control control-flim">
         *          <div class="edit">
         *            <input id="flim-0" name="flim" type="radio" value="bim">
         *            <label for="flim-0">Bim label</label>
         *          </div>
         *          <div class="edit">
         *            <input id="flim-1" name="flim" type="radio" value="bam">
         *            <label for="flim-1">Bam label</label>
         *          </div>
         *          <div class="edit">
         *            <input checked id="flim-2" name="flim" type="radio" value="boom">
         *            <label for="flim-2">Boom label</label>
         *          </div>
         *        </div>
         *
         *     {{{el-field model=model name="jim" type="select"}}}
         *     Context {model:fooModel}
         *     →  <div class="control control-jim">
         *          <label for="input-jim">Jim</label>
         *          <div class="edit">
         *            <select id="input-jim" name="jim">
         *              <option value="bim">bim</option>
         *              <option selected value="bam">bam</option>
         *              <option value="boom">boom</option>
         *            </select>
         *          </div>
         *        </div>
         *
         *     {{{el-field model=model name="wozz" type="select"}}}
         *     Context {model:fooModel}
         *     →  <div class="control control-wozz">
         *          <label for="input-wozz">Wozz</label>
         *          <div class="edit">
         *            <select id="input-wozz" name="wozz">
         *              <option value="waz">Waz label</option>
         *              <option value="wez">Wez label</option>
         *              <option selected value="wiz">Wiz label</option>
         *            </select>
         *          </div>
         *        </div>
         *
         *     {{{el-field model=model name="gozz"}}}
         *     Context {model:fooModel}
         *     →  <div class="control control-gozz">
         *          <div class="edit">
         *            <input checked id="gozz-0" name="gozz" type="radio" value="gaz">
         *            <label for="gozz-0">Gaz label</label>
         *          </div>
         *          <div class="edit">
         *            <input checked id="gozz-1" name="gozz" type="radio" value="gez">
         *            <label for="gozz-1">Gez label</label>
         *          </div>
         *          <div class="edit">
         *            <input id="gozz-2" name="gozz" type="radio" value="giz">
         *            <label for="gozz-2">Giz label</label>
         *          </div>
         *        </div>
         *
         * Inheriting a model from the enclosing context
         * 
         *     {{#el-form model=model}}{{{el-field name="flim"}}}{{{el-field name="wozz" type="select"}}}{{{el-field name="gozz"}}}{{/el-form}}
         *     Context {model:fooModel}
         *     →  <form method="post">
         *          <div class="control control-flim">
         *            <div class="edit">
         *              <input id="flim-0" name="flim" type="radio" value="bim">
         *              <label for="flim-0">Bim label</label>
         *            </div>
         *            <div class="edit">
         *              <input id="flim-1" name="flim" type="radio" value="bam">
         *              <label for="flim-1">Bam label</label>
         *            </div>
         *            <div class="edit">
         *              <input checked id="flim-2" name="flim" type="radio" value="boom">
         *              <label for="flim-2">Boom label</label>
         *            </div>
         *          </div>
         *          <div class="control control-wozz">
         *            <label for="input-wozz">Wozz</label>
         *            <div class="edit">
         *              <select id="input-wozz" name="wozz">
         *                <option value="waz">Waz label</option>
         *                <option value="wez">Wez label</option>
         *                <option selected value="wiz">Wiz label</option>
         *              </select>
         *            </div>
         *          </div>
         *          <div class="control control-gozz">
         *            <div class="edit">
         *              <input checked id="gozz-0" name="gozz" type="radio" value="gaz">
         *              <label for="gozz-0">Gaz label</label>
         *            </div>
         *          <div class="edit">
         *            <input checked id="gozz-1" name="gozz" type="radio" value="gez">
         *            <label for="gozz-1">Gez label</label>
         *          </div>
         *          <div class="edit">
         *            <input id="gozz-2" name="gozz" type="radio" value="giz">
         *            <label for="gozz-2">Giz label</label>
         *          </div>
         *        </div>
         *      </form>
         * 
         *
         * #### Data used in examples
         *
         * Phrase lookup keys
         *
         *     {
         *         "field.message.heading.error": 'There {{#choose count}}{{#choice "other"}}are {{count}} problems{{/choice}}{{#choice "one"}}is a problem{{/choice}}{{/choose}} with the "{{field}}" field',
         *         "foo.bar.description": "Bar description",
         *         "foo.bar.introduction": "Bar introduction",
         *         "foo.bar.label": "Bar label",
         *         "foo.bar.help": "Bar help",
         *         "foo.bar.extra": "Bar extra line 1\nBar extra line 2",
         *         "foo.baz.label": "Baz label",
         *         "foo.flim.value.bim.label": "Bim label",
         *         "foo.flim.value.bam.label": "Bam label",
         *         "foo.flim.value.boom.label": "Boom label",
         *         "foo.wozz.value.waz.label": "Waz label",
         *         "foo.wozz.value.wez.label": "Wez label",
         *         "foo.wozz.value.wiz.label": "Wiz label",
         *         "foo.gozz.value.gaz.label": "Gaz label",
         *         "foo.gozz.value.gez.label": "Gez label",
         *         "foo.gozz.value.giz.label": "Giz label",
         *         "really./^x.$/": "Regex lookup"
         *     }
         *
         * fooModel
         *
         *     {
         *         attributes: {
         *             baz: "Model baz value",
         *             jim: "bam",
         *             flim: "boom",
         *             wozz: "wiz",
         *             gozz: ["gaz", "gez"]
         *         },
         *         get: function (name) {
         *             return this.attributes[name];
         *         },
         *         phraseKey: "foo",
         *         schema: schema
         *     }
         *
         * schema
         *
         *     {
         *     ...
         *         "properties":{
         *             "bar": {
         *                 "type":"string",
         *                 "required":true
         *             },
         *             "baz": {
         *                 "type":"number"
         *             },
         *             "jim": {
         *                 "enum": [
         *                     "bim",
         *                     "bam",
         *                     "boom"
         *                 ]
         *             },
         *             "flim": {
         *                 "type": "string",
         *                 "enum": [
         *                     "bim",
         *                     "bam",
         *                     "boom"
         *                 ]
         *             },
         *             "wozz": {
         *                 "type": "string",
         *                 "enum": [
         *                     "waz",
         *                     "wez",
         *                     "wiz"
         *                 ]
         *             },
         *             "gozz": {
         *                 "type": "array",
         *                 "items": {
         *                     "type": "string",
         *                     "enum": [
         *                         "gaz",
         *                         "gez",
         *                         "giz"
         *                     ]
         *                 }
         *             }
         *         }
         *     }
         * 
         * @return {string} Field control
         */
        helpers["el-field"] = function () {
            var blocks = {};
            /**
             * @member blockList
             * @memberof template:el-field
             * @private
             * @description Blocks to be processed
             *
             * - legend
             * - introduction
             * - label
             * - description
             * - help
             * - error
             * - warning
             * - info
             * - extra
             */
            var blockList = [
                "legend",
                "introduction",
                "label",
                "description",
                "help",
                "error",
                "warning",
                "info",
                "extra"
            ];
            /**
             * @member editBlockOrder
             * @memberof template:el-field
             * @private
             * @description Order of blocks output in edit mode
             *
             * 1. introduction
             * 2. label
             * 3. description
             * 4. help
             * 5. main
             * 6. error
             * 7. warning
             * 8. info
             * 9. extra
             */
            var editBlockOrder = [
                "introduction",
                "label",
                "description",
                "help",
                "main",
                "error",
                "warning",
                "info",
                "extra"
            ];
            /**
             * @member displayBlockOrder
             * @memberof template:el-field
             * @private
             * @description Order of blocks output in display mode
             * 
             * 1. label
             * 2. main
             */
            var displayBlockOrder = [
                "label",
                "main"
            ];
            var blockMessage = {
                error: true,
                warning: true,
                info: true
            };

            var args = Array.prototype.slice.call(arguments);
            var options = args[args.length-1];
            var hash = options.hash;
            hash = _.extend({}, hash.attributes, hash);
            delete hash.attributes;

            var inputType;

            hash = marshallNamespacedAttributes("input", hash);
            hash = marshallNamespacedAttributes("help", hash);
            hash = marshallNamespacedAttributes("error", hash);
            hash = marshallNamespacedAttributes("label", hash);
            hash = marshallNamespacedAttributes("field", hash);

            function getAttr (name) {
                var attr = hash[name];
                delete hash[name];
                return attr;
            }
            function getFieldAttr (name) {
                var attr = hash[name];
                delete hash[name];
                if (attr === undefined) {
                    attr = field[name];
                }
                delete field[name];
                return attr;
            }
            var field = getAttr("field");
            var input = getFieldAttr("input");
            var inputs = getFieldAttr("inputs");
            var labels = getFieldAttr("labels");
            var checked = getFieldAttr("checked");
            var inputsDisabled = getFieldAttr("inputs-disabled");
            var phraseKey = getFieldAttr("phrase-key");
            /*var error = getFieldAttr("error");
            var warning = getFieldAttr("warning");
            var info = getFieldAttr("info");*/

            var model = getFieldAttr("model") || this.model;
            var edit = getFieldAttr("edit");
            var display = getFieldAttr("display");
            // by default, editable
            // edit beats display beats edit on view
            var thisEditable = this.edit === undefined || this.edit;
            if (display === undefined) {
                display = !thisEditable;
            }
            if (edit === undefined) {
                edit = !display;
            }
            var controlType = edit ? "edit" : "display";

            if (field.type) {
                hash.type = hash.type || field.type;
                delete field.type;
            }
            if (hash.type) {
                inputType = hash.type;
                delete hash.type;
            }
            if (hash.name) {
                input.name = hash.name;
                delete hash.name;
            }

            var fieldset = (inputs || labels) ? true : false;

            if (model && input.name) {
                var fieldName = input.name;
                if (!phraseKey && model.phraseKey) {
                    var modelKey = typeof model.phraseKey === "function" ? model.phraseKey() : model.phraseKey;
                    phraseKey = modelKey + "." + fieldName;
                }
                if (model.schema) {
                    var schema = model.schema;
                    var fieldSchema = schema.properties[fieldName];
                    var fieldArray;
                    if (fieldSchema.type === "array") {
                        fieldArray = true;
                        fieldSchema = fieldSchema.items;
                    }
                    var fieldOptions;
                    if (fieldSchema["enum"]) {
                        fieldOptions = _.extend([], fieldSchema["enum"]);
                        var fieldLabels = [];
                        for (var fieldOpt in fieldOptions) {
                            var fieldOptValue = fieldOptions[fieldOpt];
                            var fieldOptLabel = Phrase.get(phraseKey + ".value." + fieldOptValue + ".label");
                            fieldOptLabel = fieldOptLabel ? fieldOptLabel.toString() : fieldOptValue;
                            fieldLabels.push(fieldOptLabel);
                        }
                        if (inputType === "text") {
                            inputType = fieldArray ? "checkbox" : "radio";
                        }
                        if (inputType === "select") {
                            if (_.isEmpty(input.options) && _.isEmpty(hash.options)) {
                                input.options = fieldLabels;
                                input.values = fieldOptions;
                            }
                        } else {
                            fieldset = true;
                            if (_.isEmpty(inputs)) {
                                inputs = fieldOptions;
                                labels = fieldLabels;
                            }
                        }
                    }
                }
                var modelValue = model.get(fieldName);
                if (modelValue !== undefined) {
                    if (fieldset) {
                        if (checked === undefined) {
                            checked = modelValue;
                        }
                    } else {
                        if (input.value === undefined && inputType !== "checkbox") {
                            input.value = modelValue;
                        }
                    }
                }
                if (inputType === "checkbox") {
                    if (input.value === undefined) {
                        input.value = true;
                    }
                     if (input.checked === undefined) {
                        if (modelValue === input.value) {
                            input.checked = true;
                        }
                    }
                }
                if (inputType === "password" && input.value) {
                    input.placeholder = input.value.replace(/./g, "*");
                    if (edit) {
                        delete input.value;
                    } else {
                        input.value = input.placeholder;
                    }
                }
            }


            for (var block in blockList) {
                var blockKey = blockList[block];
                var blockVal = getFieldAttr(blockKey);
                if (phraseKey) {
                    if (blockVal === undefined || (_.isObject(blockVal) && !_.isArray(blockVal) && !("content" in blockVal))) {
                        blockVal = Phrase.get(phraseKey+"." + blockKey, {display:display, edit:edit});
                        if (blockVal) {
                            blockVal = {
                                content: blockVal.toString()
                            };
                        }
                    }
                }

                if (!(_.isEmpty(blockVal))) {
                    blocks[blockKey] = blockVal;
                }
            }

            var label = blocks.label || {};
            delete blocks.label;
            var legend = blocks.legend;
            delete blocks.legend;

            for (var blockType in blocks) {
                var blockIn = blocks[blockType];
                if (blockMessage[blockType]) {
                    blocks[blockType] = Handlebars.helpers["el-message"](input.name, blockType, blockIn);
                } else {
                    blockIn["class"] = "control-" + blockType;
                    if (!blockIn.content.match(/^<(p|div|ul|ol)[ >]/)) {
                        blockIn["el-wrap"] = "p";
                    }
                    var attr= {
                        hash: {
                            attributes: blockIn
                        }
                    };
                    blocks[blockType] = Handlebars.helpers.el(attr);
                }
            }

            if (hash["class"]) {
                field["class"] = hash["class"];
                delete hash["class"];
            }
            if (!field["class"]) {
                field["class"] = [];
            }
            if (! _.isArray(field["class"])) {
                field["class"] = [field["class"]];
            }
            field["class"].push("control");
            if (input.name) {
                field["class"].push("control-" + input.name);
            }
            // could do this with defaults in marshallNamespaceAttributes
            if (field["el-escape"] === undefined) {
                field["el-escape"] = false;
            }

            field.content = "";
            if (options.fn) {
                field.content = options.fn(this);
                delete options.fn;
            } else {
                if (hash.id) {
                    input.id = hash.id;
                }
                if (!input.id) {
                    input.id = "input-" + input.name;
                }

                if (fieldset) {
                    inputType = inputType || "radio";

                    var fieldsetContent = "";

                    if (!inputs) {
                        inputs = labels;
                    }
                    checked = normaliseParamArray(checked);
                    inputsDisabled = normaliseParamArray(inputsDisabled);

                    var name = input.name;
                    for (var i in inputs) {
                        var inputArgs = inputs[i];
                        var labelArgs = {};
                        if (typeof inputArgs !== "object") {
                            inputArgs = {
                                value: inputArgs
                            };
                        }
                        inputArgs.name = inputArgs.name || name;
                        inputArgs.id = inputArgs.id || inputArgs.name + "-" + i;

                        if (labels && labels[i] !== undefined) {
                            labelArgs.content = labels[i];
                        } else {
                            labelArgs.content = inputArgs.value;
                        }
                        labelArgs["for"] = inputArgs.id;

                        inputArgs.value = inputArgs.value.toString();
                        if (checked !== undefined) {
                            inputArgs.checked = _.intersection(checked, [inputArgs.value]).length > 0;
                        }

                        if (inputsDisabled) {
                            inputArgs.disabled = _.intersection(inputsDisabled, [inputArgs.value]).length > 0;
                        }

                        inputs[i] = [inputArgs, labelArgs];

                    }
                    for (var item in inputs) {
                        var fieldsetItemOutput = "";
                        var itemInput = inputs[item][0];
                        itemInput["el-tag"] = "input";
                        fieldsetItemOutput += Handlebars.helpers["el-"+inputType]({hash:itemInput});
                        var itemLabel = inputs[item][1];
                        itemLabel["el-tag"] = "label";
                        fieldsetItemOutput += Handlebars.helpers.el({hash:itemLabel});
                        var fieldsetItemArgs = {
                            hash: {
                                "el-tag": "div",
                                "class": CONTROLCLASS[controlType],
                                "content": fieldsetItemOutput,
                                "el-escape": false
                            }
                        };
                        fieldsetContent += Handlebars.helpers.el(fieldsetItemArgs);
                    }
                    blocks.main = fieldsetContent;


                    if (legend) {
                        var fieldsetId = field.id || "control-group-" + input.name + "-label";
                        if (!field.role) {
                            field.role = "group";
                            field["aria-labelledby"] = fieldsetId;
                        }
                        var legendParams = {
                            hash: {
                                "el-tag": "p",
                                content: legend,
                                id: fieldsetId
                            }
                        };
                        legend = Handlebars.helpers.el(legendParams);
                        blocks.label = legend;
                    }
                } else {
                    inputType = inputType || "text";
                    if (!label["for"]) {
                        label["for"] = input.id;
                    }
                    if (!label.content) {
                        labelContent = input.name;
                        if (labelContent) {
                            labelContent = labelContent.substr(0,1).toUpperCase() + labelContent.substr(1);
                        }
                        label.content = labelContent;
                        // using name field.$name.label
                        // using model view.$model.$name.label
                    }
                    label.edit = edit;
                    var labelOutput = Handlebars.helpers["el-label"]({hash:label});
                    blocks.label = labelOutput;

                    hash.attributes = input;
                    hash["el-wrap-outer"] = {
                        "el-tag": "div",
                        "class": CONTROLCLASS[controlType]
                    };
                    hash["el-phrase-key"] = phraseKey;
                    hash["el-control"] = edit;
                    args[args.length-1].hash = hash;
                    //var inputOutput = Handlebars.helpers["el-"+inputType]({hash:input});
                    var inputOutput = Handlebars.helpers["el-"+inputType].apply(this, args);

                    blocks.main = inputOutput;
                    //field.content = labelOutput + inputOutput;
                }

            }

            var blockOrder = edit ? editBlockOrder : displayBlockOrder;
            for (var bk in blockOrder)
            if (blocks[blockOrder[bk]]) {
                field.content += blocks[blockOrder[bk]];
            }

            if (field["el-tag"] === undefined) {
                field["el-tag"] = "div";
            }
            var output = Handlebars.helpers.el({hash:{attributes:field}});
            return output;
        };

        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }

    };

    return {
        /**
         * @method registerHelpers
         * @static
         * @param {object} hbars Handlebars instance
         * @description Register FormHelper helpers with Handlebars
         */
        //@param {string} [prefix=el] String to prefix helpers with
        registerHelpers: function (hbars, prefix) {
            if (!hbars.helpers.phrase) {
                Phrase.registerHelper(hbars);
            }
            if (!hbars.helpers.el) {
                ElHelper.registerHelper(hbars);
            }
            FormHelpers(hbars, prefix);
        }
    };
}));