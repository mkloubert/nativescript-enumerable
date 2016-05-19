var frame = require("ui/frame");
var Enumerable = require('nativescript-enumerable');
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

function executeSource(__36D7F6225B5F4B40879B87355C0AB2F0,
                       __F5B18AC600944FA5AA22262C7B3F79DB) {
    
    var print = function(msg) {
        var vm = __F5B18AC600944FA5AA22262C7B3F79DB;
        
        console.log("executeSource(): " + msg);
        
        var executionResult = vm.get("executionResult");
        executionResult += "" + msg;

        vm.set("executionResult", executionResult);
    };
    var Print = print;
    var PRINT = print;
    
    var printLine = function(msg) {
        print(msg + "\r\n");
    };
    
    var Printline = printLine;
    var PrintLine = printLine;
    var PRINTLINE = printLine;
    
    var value = function(v) {
        var vm = __F5B18AC600944FA5AA22262C7B3F79DB;
        
        if (arguments.length > 0) {
            vm.set("value", "" + arguments[0]);
        }
        
        return vm.get("value");
    };
    var Value = value;
    var VALUE = value;
    
    var items = function(i) {
        var vm = __F5B18AC600944FA5AA22262C7B3F79DB;
        
        if (arguments.length > 0) {
            var seq = Enumerable.asEnumerable(i);
            var array;
            if (seq) {
                array = seq.select(function(x) {
                    return {
                        value: x    
                    };
                }).toArray();
            }
            
            vm.set("items", array);
        }
        
        return vm.get("items");
    };
    var Items = items;
    var ITEMS = items;
    
    __F5B18AC600944FA5AA22262C7B3F79DB.set("isExecuting", true);
    
    __F5B18AC600944FA5AA22262C7B3F79DB.set("executionResult", "");
    value(undefined);
    
    try {
        eval(__36D7F6225B5F4B40879B87355C0AB2F0);
    }
    catch (e) {
        __F5B18AC600944FA5AA22262C7B3F79DB.set("executionResult",
                                               "[EXECUTION ERROR]: " + e);
    }
    
    __F5B18AC600944FA5AA22262C7B3F79DB.set("isExecuting", false);
};

function executeScript(args) {
    var btn = args.object;
    var vm = btn.bindingContext;
    
    var textEditor = frame.topmost().getViewById('mjk-script-textEditor');

    executeSource(textEditor.text, vm);  
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
    
    page.bindingContext = createViewModel(method);
}
exports.onPageLoaded = onPageLoaded;

function createViewModel(method) {
    var viewModel = new Observable();
    viewModel.set("method", method);
    
    return viewModel;
}
