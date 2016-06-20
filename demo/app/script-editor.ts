import Frame = require("ui/frame");
import {Observable} from "data/observable";
import {ObservableArray} from "data/observable-array";
import ScriptExecutor = require('./ScriptExecutor');
import {TextView} from "ui/text-view";

export function executeScript(args) {
    var btn = args.object;
    var vm = btn.bindingContext;
    
    var textEditor = <TextView>Frame.topmost().getViewById('mjk-script-textEditor');

    ScriptExecutor.executeScript(textEditor.text, vm);
};

export function goBack(args) {
    Frame.topmost().navigate({
        moduleName: "main-page"
    });
}

export function onPageLoaded(args) {
    var page = args.object;

    var method = page.navigationContext;
    
    var vm = createViewModel(method);
    page.bindingContext = vm;
}

function createViewModel(method) {
    var viewModel = new Observable();
    viewModel.set("method", method);
    
    return viewModel;
}
