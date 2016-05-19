var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

function createViewModel() {
    var viewModel = new Observable();
    
    var methods = new ObservableArray();
    
    // aggregate()
    methods.push({
        title: 'aggregate()',
        sourceCode: `
var accumulator = 'result, x => result += "; " + x';       
        
var res1 = Enumerable.create(1, 2, 3, 4)
    .aggregate(accumulator, 'TM');

var res2 = Enumerable.create(11)
    .aggregate(accumulator, 'TM');

var res3 = Enumerable.create()
    .aggregate(accumulator, 'TM');

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
`
    });
    
    // all()
    methods.push({
        title: 'all()',
        sourceCode: `
var res1 = Enumerable.create(1, 2, 3)
    .all('x => x < 4');

var res2 = Enumerable.create(11, 22, 33)
    .all('x => x < 33');

var res3 = Enumerable.create()
    .all('x => x < 333');

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
`
    });

    // any()
    methods.push({
        title: 'any()',
        sourceCode: `
var res1 = Enumerable.create(1, 2, 3)
    .any('x => x < 4');

var res2 = Enumerable.create(11, 22, 33)
    .any('x => x < 10');

var res3 = Enumerable.create()
    .any();

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
`
    });
    
    // average()
    methods.push({
        title: 'average()',
        sourceCode: `
var res1 = Enumerable.create(1, 2, 3, 4)
    .average('TM');

var res2 = Enumerable.create()
    .average('TM');

printLine("res.1: " + res1);
printLine("res.2: " + res2);
`
    });
    
    // concat()
    methods.push({
        title: 'concat()',
        sourceCode: `
var seq = Enumerable.create(1, 2, 3)
    .concat('Marcel');
    
items(seq);
`
    });
    
    // concat()
    methods.push({
        title: 'concat()',
        sourceCode: `
var res1 = Enumerable.create(1, 2, 3)
    .contains(1);

var res2 = Enumerable.create(11, 22, 33)
    .contains('33');

var res3 = Enumerable.create(111, 222, 333)
    .contains('333',
              '(x, y) => x === y');
    
printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
`
    });
    
    // count()
    methods.push({
        title: 'count()',
        sourceCode: `
var res1 = Enumerable.create(1, 2, 3)
    .count();

var res2 = Enumerable.create()
    .count();

var res3 = Enumerable.create(111, 222, 333)
    .count('(x) => x >= 200');
    
printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
`
    });
    
    // distinct()
    methods.push({
        title: 'distinct()',
        sourceCode: `        
var res1 = Enumerable.create(1, 2, 3, 2, 4)
    .distinct();

var res2 = Enumerable.create(11, 22, 33, '22', 44)
    .distinct();

var res3 = Enumerable.create(111, 222, 333, '222', 444, 333)
    .distinct('(x, y) => x === y');
    
printLine("res.1: " + toStringList(res1));
printLine("res.2: " + toStringList(res2));
printLine("res.3: " + toStringList(res3));
`
    });
    
    viewModel.methods = methods;

    return viewModel;
}
exports.createViewModel = createViewModel;