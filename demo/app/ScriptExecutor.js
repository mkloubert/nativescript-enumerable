var Enumerable = require('nativescript-enumerable');
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;


function executeScript(__36D7F6225B5F4B40879B87355C0AB2F0,
                       __F5B18AC600944FA5AA22262C7B3F79DB) {
    
    var print = function(msg) {
        if (arguments.length < 1) {
            msg = "";
        }
        
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
    
    var toStringList = function(items, separator) {
        items = Enumerable.asEnumerable(items);

        if (arguments.length < 2) {
            separator = "; ";
        }
        
        return "" + items.aggregate(function(result, x) {
            return result += "" + separator + x;
        });
    };
    var Tostringlist = toStringList;
    var ToStringlist = toStringList;
    var ToStringList = toStringList;
    var tostringList = toStringList;
    var tostringlist = toStringList;
    
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
}
exports.executeScript = executeScript;
