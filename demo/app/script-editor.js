"use strict";
var Frame = require("ui/frame");
var observable_1 = require("data/observable");
var ScriptExecutor = require('./ScriptExecutor');
function executeScript(args) {
    var btn = args.object;
    var vm = btn.bindingContext;
    var textEditor = Frame.topmost().getViewById('mjk-script-textEditor');
    ScriptExecutor.executeScript(textEditor.text, vm);
}
exports.executeScript = executeScript;
;
function goBack(args) {
    Frame.topmost().navigate({
        moduleName: "main-page"
    });
}
exports.goBack = goBack;
function onPageLoaded(args) {
    var page = args.object;
    var method = page.navigationContext;
    var vm = createViewModel(method);
    page.bindingContext = vm;
}
exports.onPageLoaded = onPageLoaded;
function createViewModel(method) {
    var viewModel = new observable_1.Observable();
    viewModel.set("method", method);
    return viewModel;
}
//# sourceMappingURL=script-editor.js.map