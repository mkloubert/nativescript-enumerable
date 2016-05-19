var createViewModel = require("./main-view-model").createViewModel;
var frame = require("ui/frame");

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = createViewModel();
}
exports.onNavigatingTo = onNavigatingTo;

function openScriptEditor(args) {
    var label = args.object;
    var method = label.bindingContext;
    
    frame.topmost().navigate({
        moduleName: "script-editor",
        context: method
    });
};
exports.openScriptEditor = openScriptEditor;
