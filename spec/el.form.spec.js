var Log = require("log");
var log = new Log(process.env.loglevel || "error");

var _ = require("lodash");
var Handlebars = require("handlebars");


require("../handlebars.el.form").registerHelpers(Handlebars);

require("handlebars.choice").registerHelpers(Handlebars);
var Phrase = require("handlebars.phrase");

Phrase.locale("en");
Phrase.addLanguages({
    "en": {
        "field.message.heading.error": "There {{#choose count}}{{#choice \"other\"}}are {{count}} problems{{/choice}}{{#choice \"one\"}}is a problem{{/choice}}{{/choose}} with the \"{{field}}\" field",
        "foo.bar.description": "Bar description",
        "foo.bar.introduction": "Bar introduction",
        "foo.bar.label": "Bar label",
        "foo.bar.help": "Bar help",
        "foo.bar.extra": "Bar extra line 1\nBar extra line 2",
        "foo.baz.label": "Baz label",
        "foo.flim.value.bim.label": "Bim label",
        "foo.flim.value.bam.label": "Bam label",
        "foo.flim.value.boom.label": "Boom label",
        "foo.wozz.value.waz.label": "Waz label",
        "foo.wozz.value.wez.label": "Wez label",
        "foo.wozz.value.wiz.label": "Wiz label",
        "foo.gozz.value.gaz.label": "Gaz label",
        "foo.gozz.value.gez.label": "Gez label",
        "foo.gozz.value.giz.label": "Giz label",
        "really./^x.$/": "Regex lookup"
    }
});

var schema = {
    "type":"object",
    "$schema": "http://json-schema.org/draft-03/schema",
    "id": "test",
    "properties":{
        "bar": {
            "type":"string",
            "required":true
        },
        "baz": {
            "type":"number"
        },
        "jim": {
            "id": "jim",
            "enum": [
                "bim",
                "bam",
                "boom"
            ]
        },
        "flim": {
            "type": "string",
            "enum": [
                "bim",
                "bam",
                "boom"
            ]
        },
        "wozz": {
            "type": "string",
            "enum": [
                "waz",
                "wez",
                "wiz"
            ]
        },
        "gozz": {
            "type": "array",
            "items": {
                "type": "string",
                "enum": [
                    "gaz",
                    "gez",
                    "giz"
                ]
            }
        }
    }
};
var fooModel = {
    attributes: {
        baz: "Model baz value",
        jim: "bam",
        flim: "boom",
        wozz: "wiz",
        gozz: ["gaz", "gez"]
    },
    get: function (name) {
        return this.attributes[name];
    },
    phraseKey: "foo",
    schema: schema
};

function template (tmpl, data) {
    var urtemplate = Handlebars.compile(tmpl);
    var output = urtemplate(data || {});
    log.info("\n================================", "\n"+tmpl, "\n---------------------------------\n", output, "\n");
    return output;
}

describe("Form helpers", function () {

    it("el helper loaded correctly", function () {
        expect(template('{{#el}}foo{{/el}}')).toBe("<div>foo</div>");
    });

    it("output correct input types", function () {
        expect(template('{{{el-text}}}')).toBe('<input type="text">');
        expect(template('{{{el-checkbox}}}')).toBe('<input type="checkbox" value="true">');
        expect(template('{{{el-checkbox value="kluge"}}}')).toBe('<input type="checkbox" value="kluge">');
        expect(template('{{{el-checkbox attributes=attributes}}}', {attributes:{value:"kluge"}})).toBe('<input type="checkbox" value="kluge">');
        expect(template('{{{el-checkbox checked=true}}}')).toBe('<input checked type="checkbox" value="true">');
        expect(template('{{{el-radio}}}')).toBe('<input type="radio">');
        expect(template('{{{el-password}}}')).toBe('<input type="password">');
        expect(template('{{{el-file}}}')).toBe('<input type="file">');
        expect(template('{{{el-hidden}}}')).toBe('<input type="hidden">');
        expect(template('{{{el-submit}}}')).toBe('<input type="submit">');
        expect(template('{{{el-textarea}}}')).toBe('<textarea></textarea>');
    });

    it("outputs selects correctly", function () {
        expect(template('{{{el-select options=opts}}}', {opts: [{content:"Foo", value:1}, {content:"Bar", value:2}] })).toBe('<select><option value="1">Foo</option><option value="2">Bar</option></select>');
        expect(template('{{{el-select options=opts}}}', {opts: [{content:"Foo", value:1}, {content:"Bar", value:2, selected:true}] })).toBe('<select><option value="1">Foo</option><option selected value="2">Bar</option></select>');

        expect(template('{{{el-select options=opts values=vals}}}', {opts: ["Foo", "Bar"], vals: [1, 2]})).toBe('<select><option value="1">Foo</option><option value="2">Bar</option></select>');
        expect(template('{{{el-select options=opts values=vals selected=selected}}}', {opts: ["Foo", "Bar"], vals: [1, 2], selected:2})).toBe('<select><option value="1">Foo</option><option selected value="2">Bar</option></select>');
        expect(template('{{{el-select options=opts values=vals selected=selected}}}', {opts: ["Foo", "Bar"], vals: [1, 0], selected:0})).toBe('<select><option value="1">Foo</option><option selected value="0">Bar</option></select>');
        expect(template('{{{el-select options=opts values=vals selected=selected}}}', {opts: ["Foo", "Bar"], vals: ["", "a"], selected:""})).toBe('<select><option selected value="">Foo</option><option value="a">Bar</option></select>');
        expect(template('{{{el-select options=opts values=vals options-disabled=optionsDisabled}}}', {opts: ["Foo", "Bar"], vals: [1, 2], optionsDisabled:2})).toBe('<select><option value="1">Foo</option><option disabled value="2">Bar</option></select>');

        expect(template('{{{el-select options=opts values=vals selected=selected options-disabled=optionsDisabled}}}', {opts: [{content:"Foo", value:1, disabled:true}, {content:"Bar", value:2, selected:true}], vals:["x", "y"], selected:"x", optionsDisabled:"y" })).toBe('<select><option selected value="x">Foo</option><option disabled value="y">Bar</option></select>');

        expect(template('{{{el-select options=opts cue=cue}}}', {opts: [{content:"Foo", value:1}, {content:"Bar", value:2}], cue: "Please select" })).toBe('<select><option class="select-cue" disabled selected>Please select</option><option value="1">Foo</option><option value="2">Bar</option></select>');

        expect(template('{{{el-select options=opts values=vals value=selected}}}', {opts: ["Foo", "Bar"], vals: [1, 2], selected:2})).toBe('<select><option value="1">Foo</option><option selected value="2">Bar</option></select>');
    });

    it("outputs label", function () {
        expect(template('{{{el-label}}}')).toBe('');
        expect(template('{{{el-label content="foo"}}}')).toBe('<label>foo</label>');
        expect(template('{{#el-label}}foo{{/el-label}}')).toBe('<label>foo</label>');
        expect(template('{{#el-label for="bar"}}foo{{/el-label}}')).toBe('<label for="bar">foo</label>');
        expect(template('{{#el-label}}<i>foo</i>{{/el-label}}')).toBe('<label>&lt;i&gt;foo&lt;/i&gt;</label>');
        expect(template('{{#el-label el-escape=false}}<i>foo</i>{{/el-label}}')).toBe('<label><i>foo</i></label>');
    });

    it("outputs fieldset", function () {
        expect(template('{{#el-fieldset legend="bar"}}<i>foo</i>{{/el-fieldset}}')).toBe('<fieldset><legend><span>bar</span></legend><i>foo</i></fieldset>');
    });

    it("outputs field", function () {
        expect(template('{{#el-field name="bar"}}{{{el-text name=bazinga}}}{{/el-field}}', {bazinga:"wham"})).toBe('<div class="control control-bar"><input name="wham" type="text"></div>');
        expect(template('{{{el-field name="bar" class="fieldo" value="myvalue"}}}')).toBe('<div class="control control-bar fieldo"><label for="input-bar">Bar</label><div class="edit"><input id="input-bar" name="bar" type="text" value="myvalue"></div></div>');
        expect(template('{{{el-field name="bar" type="select" options=opts}}}', {opts: ["foo", "bar"]})).toBe('<div class="control control-bar"><label for="input-bar">Bar</label><div class="edit"><select id="input-bar" name="bar"><option value="foo">foo</option><option value="bar">bar</option></select></div></div>');
        expect(template('{{{el-field name="bar" label="Labello"}}}')).toBe('<div class="control control-bar"><label for="input-bar">Labello</label><div class="edit"><input id="input-bar" name="bar" type="text"></div></div>');
        expect(template('{{{el-field name="bar" label="Labello" id="zam"}}}')).toBe('<div class="control control-bar"><label for="zam">Labello</label><div class="edit"><input id="zam" name="bar" type="text"></div></div>');

        expect(template('{{{el-field name="bar" legend="Legendo" inputs=inputs checked="b"}}}', {inputs:["a", "b", "c"]})).toBe('<div aria-labelledby="control-group-bar-label" class="control control-bar" role="group"><p id="control-group-bar-label">Legendo</p><div class="edit"><input id="bar-0" name="bar" type="radio" value="a"><label for="bar-0">a</label></div><div class="edit"><input checked id="bar-1" name="bar" type="radio" value="b"><label for="bar-1">b</label></div><div class="edit"><input id="bar-2" name="bar" type="radio" value="c"><label for="bar-2">c</label></div></div>');

        expect(template('{{{el-field name="bar" legend="Legendo" type="checkbox" inputs=inputs checked="b"}}}', {inputs:["a", "b", "c"]})).toBe('<div aria-labelledby="control-group-bar-label" class="control control-bar" role="group"><p id="control-group-bar-label">Legendo</p><div class="edit"><input id="bar-0" name="bar" type="checkbox" value="a"><label for="bar-0">a</label></div><div class="edit"><input checked id="bar-1" name="bar" type="checkbox" value="b"><label for="bar-1">b</label></div><div class="edit"><input id="bar-2" name="bar" type="checkbox" value="c"><label for="bar-2">c</label></div></div>');

        expect(template('{{{el-field name="bar" phrase-key="foo.bar"}}}')).toBe('<div class="control control-bar"><div class="control-introduction"><p>Bar introduction</p></div><label for="input-bar">Bar label</label><div class="control-description"><p>Bar description</p></div><div class="control-help"><p>Bar help</p></div><div class="edit"><input id="input-bar" name="bar" type="text"></div><div class="control-extra"><p>Bar extra line 1</p><p>Bar extra line 2</p></div></div>');

        expect(template('{{{el-field name="bar" error=error}}}', {error:["Error A", "Error B"]})).toBe('<div class="control control-bar"><label for="input-bar">Bar</label><div class="edit"><input id="input-bar" name="bar" type="text"></div><div class="control-error"><h2>There are 2 problems with the "bar" field</h2><ul><li>Error A</li><li>Error B</li></ul></div></div>');
    });

    it("field handles model correctly", function () {

        expect(template('{{{el-field model=model name="baz"}}}', {model:fooModel})).toBe('<div class="control control-baz"><label for="input-baz">Baz label</label><div class="edit"><input id="input-baz" name="baz" type="text" value="Model baz value"></div></div>');

        expect(template('{{{el-field model=model name="jim" type="select" options=opts}}}', {model:fooModel, opts:["zim", "bam", "zoom"]})).toBe('<div class="control control-jim"><label for="input-jim">Jim</label><div class="edit"><select id="input-jim" name="jim"><option value="zim">zim</option><option selected value="bam">bam</option><option value="zoom">zoom</option></select></div></div>');

        expect(template('{{{el-field model=model name="flim" type="radio" inputs=opts}}}', {model:fooModel, opts:["zim", "zam", "boom"]})).toBe('<div class="control control-flim"><div class="edit"><input id="flim-0" name="flim" type="radio" value="zim"><label for="flim-0">zim</label></div><div class="edit"><input id="flim-1" name="flim" type="radio" value="zam"><label for="flim-1">zam</label></div><div class="edit"><input checked id="flim-2" name="flim" type="radio" value="boom"><label for="flim-2">boom</label></div></div>');

        expect(template('{{{el-field model=model name="flim"}}}', {model:fooModel})).toBe('<div class="control control-flim"><div class="edit"><input id="flim-0" name="flim" type="radio" value="bim"><label for="flim-0">Bim label</label></div><div class="edit"><input id="flim-1" name="flim" type="radio" value="bam"><label for="flim-1">Bam label</label></div><div class="edit"><input checked id="flim-2" name="flim" type="radio" value="boom"><label for="flim-2">Boom label</label></div></div>');

        expect(template('{{{el-field model=model name="jim" type="select"}}}', {model:fooModel})).toBe('<div class="control control-jim"><label for="input-jim">Jim</label><div class="edit"><select id="input-jim" name="jim"><option value="bim">bim</option><option selected value="bam">bam</option><option value="boom">boom</option></select></div></div>');

        expect(template('{{{el-field model=model name="wozz" type="select"}}}', {model:fooModel})).toBe('<div class="control control-wozz"><label for="input-wozz">Wozz</label><div class="edit"><select id="input-wozz" name="wozz"><option value="waz">Waz label</option><option value="wez">Wez label</option><option selected value="wiz">Wiz label</option></select></div></div>');

        expect(template('{{{el-field model=model name="gozz"}}}', {model:fooModel})).toBe('<div class="control control-gozz"><div class="edit"><input checked id="gozz-0" name="gozz" type="radio" value="gaz"><label for="gozz-0">Gaz label</label></div><div class="edit"><input checked id="gozz-1" name="gozz" type="radio" value="gez"><label for="gozz-1">Gez label</label></div><div class="edit"><input id="gozz-2" name="gozz" type="radio" value="giz"><label for="gozz-2">Giz label</label></div></div>');
    });

    it("form handled correctly", function () {
        expect(template('{{#el-form}}foo{{/el-form}}')).toBe('<form method="post">foo</form>');

        expect(template('{{#el-form model=model}}{{{el-field name="flim"}}}{{{el-field name="wozz" type="select"}}}{{{el-field name="gozz"}}}{{/el-form}}', {model:fooModel})).toBe('<form method="post"><div class="control control-flim"><div class="edit"><input id="flim-0" name="flim" type="radio" value="bim"><label for="flim-0">Bim label</label></div><div class="edit"><input id="flim-1" name="flim" type="radio" value="bam"><label for="flim-1">Bam label</label></div><div class="edit"><input checked id="flim-2" name="flim" type="radio" value="boom"><label for="flim-2">Boom label</label></div></div><div class="control control-wozz"><label for="input-wozz">Wozz</label><div class="edit"><select id="input-wozz" name="wozz"><option value="waz">Waz label</option><option value="wez">Wez label</option><option selected value="wiz">Wiz label</option></select></div></div><div class="control control-gozz"><div class="edit"><input checked id="gozz-0" name="gozz" type="radio" value="gaz"><label for="gozz-0">Gaz label</label></div><div class="edit"><input checked id="gozz-1" name="gozz" type="radio" value="gez"><label for="gozz-1">Gez label</label></div><div class="edit"><input id="gozz-2" name="gozz" type="radio" value="giz"><label for="gozz-2">Giz label</label></div></div></form>');
    });


    it("renders in edit and display modes", function () {
        expect(template('{{{el-field name="foo" value="bar"}}}')).toBe('<div class="control control-foo"><label for="input-foo">Foo</label><div class="edit"><input id="input-foo" name="foo" type="text" value="bar"></div></div>');
        expect(template('{{{el-field name="foo" value="bar" display=true}}}')).toBe('<div class="control control-foo"><h3>Foo</h3><div class="display"><p>bar</p></div></div>');
        expect(template('{{{el-field name="foo" value="bar" edit=false}}}')).toBe('<div class="control control-foo"><h3>Foo</h3><div class="display"><p>bar</p></div></div>');
        expect(template('{{{el-field name="foo" value="bar\nbaz" display=true}}}')).toBe('<div class="control control-foo"><h3>Foo</h3><div class="display"><p>bar</p><p>baz</p></div></div>');
    });

});

log.info("Tests described");
