var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

function createViewModel() {
    var viewModel = new Observable();
    
    var methods = new ObservableArray();
    
    // TEST
    methods.push({
        name: 'TEST',
        sourceCode: `
value('Marcel Kloubert');
items([1, 2, 3]);

Enumerable.create(11, 22, 33)
          .each(function(x) { printLine(x); });
`
    });
    
    // all()
    methods.push({
        name: 'all',
        sourceCode: `
var res1 = Enumerable.create(1, 2, 3)
    .all('x => x < 4');

var res2 = Enumerable.create(11, 22, 33)
    .all('x => x < 33');

printLine("res.1: " + res1);
printLine("res.2: " + res2);
`
    });

    
    viewModel.methods = methods;

    return viewModel;
}
exports.createViewModel = createViewModel;