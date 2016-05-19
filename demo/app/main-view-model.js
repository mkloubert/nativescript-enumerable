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
    
    // defaultIfEmpty()
    methods.push({
        title: 'defaultIfEmpty()',
        sourceCode: `        
var res1 = Enumerable.create(5979, 23979)
    .defaultIfEmpty('TM', 'MK');

var res2 = Enumerable.create()
    .defaultIfEmpty('TM', 'MK');

printLine("res.1: " + toStringList(res1));
printLine("res.2: " + toStringList(res2));
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
    
    // elementAt()
    methods.push({
        title: 'elementAt()',
        sourceCode: `        
var res1 = Enumerable.create(5979, 23979)
    .elementAt(1);

var res2;
try {
    res2 = Enumerable.create(1, 2)
        .elementAt(2);    
}
catch (e) {
    res2 = e;
}

var res3;
try {
    res3 = Enumerable.create()
        .elementAt(0);
}
catch (e) {
    res3 = e;
}

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
`
    });
    
    // elementAtOrDefault()
    methods.push({
        title: 'elementAtOrDefault()',
        sourceCode: `        
var res1 = Enumerable.create(5979, 23979)
    .elementAtOrDefault(1, 'PZ');

var res2 = Enumerable.create(1, 2)
    .elementAtOrDefault(2, 'PZ');

var res3 = Enumerable.create()
    .elementAtOrDefault(0, 'YS');

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
`
    });
    
    // first()
    methods.push({
        title: 'first()',
        sourceCode: `        
var res1 = Enumerable.create(5979, 23979)
    .first();

var res2 = Enumerable.create(5979, 23979)
    .first('x => x >= 6000');
    
var res3;
try {
    res3 = Enumerable.create()
        .first();    
}
catch (e) {
    res3 = e;
}

var res4;
try {
    res4 = Enumerable.create(1, 2, 3)
        .first('x => x > 3');
}
catch (e) {
    res4 = e;
}

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
printLine("res.4: " + res4);
`
    });
    
    // firstOrDefault()
    methods.push({
        title: 'firstOrDefault()',
        sourceCode: `        
var res1 = Enumerable.create(5979, 23979)
    .firstOrDefault('TM');

var res2 = Enumerable.create(5979, 23979)
    .firstOrDefault('x => x >= 6000',
                    'MK');

var res3 = Enumerable.create()
    .firstOrDefault('JS');

var res4 = Enumerable.create(1, 2, 3)
    .firstOrDefault('x => x > 3',
                    'YS');

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
printLine("res.4: " + res4);
`
    });
    
    // last()
    methods.push({
        title: 'last()',
        sourceCode: `        
var res1 = Enumerable.create(5979, 23979)
    .last();

var res2 = Enumerable.create(5979, 23979)
    .last('x => x < 23000');
    
var res3;
try {
    res3 = Enumerable.create()
        .last();    
}
catch (e) {
    res3 = e;
}

var res4;
try {
    res4 = Enumerable.create(1, 2, 3)
        .last('x => x > 3');
}
catch (e) {
    res4 = e;
}

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
printLine("res.4: " + res4);
`
    });
    
    // lastOrDefault()
    methods.push({
        title: 'lastOrDefault()',
        sourceCode: `        
var res1 = Enumerable.create(5979, 23979)
    .lastOrDefault('TM');

var res2 = Enumerable.create(5979, 23979)
    .lastOrDefault('x => x < 23000',
                   'MK');

var res3 = Enumerable.create()
    .lastOrDefault('JS');

var res4 = Enumerable.create(1, 2, 3)
    .lastOrDefault('x => x > 3',
                   'YS');

printLine("res.1: " + res1);
printLine("res.2: " + res2);
printLine("res.3: " + res3);
printLine("res.4: " + res4);
`
    });
    
    viewModel.methods = methods;

    return viewModel;
}
exports.createViewModel = createViewModel;