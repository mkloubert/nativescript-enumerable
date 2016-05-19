var frame = require("ui/frame");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var ScriptExecutor = require('./ScriptExecutor');


function executeScript(args) {
    var btn = args.object;
    var vm = btn.bindingContext;
    
    var textEditor = frame.topmost().getViewById('mjk-script-textEditor');

    ScriptExecutor.executeScript(textEditor.text, vm);
};
exports.executeScript = executeScript;

function goBack(args) {
    frame.topmost().navigate({
        moduleName: "main-page"
    });
}
exports.goBack;

function onPageLoaded(args) {
    var page = args.object;

    var method = page.navigationContext;
    
    var vm = createViewModel(method);
    page.bindingContext = vm;
}
exports.onPageLoaded = onPageLoaded;

function createViewModel(method) {
    var viewModel = new Observable();
    viewModel.set("method", method);
    
    return viewModel;
}
