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
    
    // each()
    methods.push({
        title: 'each()',
        sourceCode: `
var i = 0;                
var res = Enumerable.create(1, 2, 3, 2, 4)
    .each(function(x, index) {
        printLine(index + ": " + x);
        
        return ++i;    
    });
    
printLine("");    
printLine("res: " + res);
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
    
    // except()
    methods.push({
        title: 'except()',
        sourceCode: `        
var seq = Enumerable.create(2.0, 2.1, 2.2, 2.3, 2.4, 2.5)
    .except([2.2]);

seq.each(function(x) {
    printLine(x);
});
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
    
    // groupBy()
    methods.push({
        title: 'groupBy()',
        sourceCode: `        
var groupings = Enumerable
    .create("grape", "passionfruit", "banana",
            "apple", "blueberry")
    .groupBy('x => x[0]');

groupings.each(function(grp) {
    printLine(grp.key);
    
    grp.each(function(x) {
        printLine("\t" + x);
    });
});
`
    });
    
    // groupJoin()
    methods.push({
        title: 'groupJoin()',
        sourceCode: `        
var createPerson = function(name) {
    return {
        name: name
    };
};

var createPet = function(name, owner) {
    return {
        name: name,
        owner: owner
    };
};

var persons = [
    createPerson("Tanja"),
    createPerson("Marcel"),
    createPerson("Yvonne"),
    createPerson("Josefine")
];

var pets = [
    createPet("Gina", persons[1]),
    createPet("Schnuffi", persons[1]),
    createPet("Schnuffel", persons[2]),
    createPet("WauWau", persons[0]),
    createPet("Lulu", persons[3]),
    createPet("Asta", persons[1])
];

var seq = Enumerable.fromArray(persons)
    .groupJoin(pets,
               'person => person.name',
               'pet => pet.owner.name',
               function(person, petsOfPerson) {
                   var petList = petsOfPerson
                       .select('pet => pet.name')
                       .aggregate(function(result, petName) {
                                      return result += ", " + petName;
                                  });

                   return 'Owner: ' + person.name + '; Pets: ' + petList;
               });
 
seq.each(function(x) {
    printLine("- " + x);    
});               
`
    });
    
    // intersect()
    methods.push({
        title: 'intersect()',
        sourceCode: `        
var seq = Enumerable.create(44, 26, 92, 30, 71, 38)
    .intersect([30, 59, 83, 47, 26, 4, 3]);

seq.each(function(x) {
    printLine(x);
});
`
    });
    
    // join()
    methods.push({
        title: 'join()',
        sourceCode: `        
var createPerson = function(name) {
    return {
        name: name
    };
};

var createPet = function(name, owner) {
    return {
        name: name,
        owner: owner
    };
};

var persons = [
    createPerson("Tanja"),
    createPerson("Marcel"),
    createPerson("Yvonne"),
    createPerson("Josefine")
];

var pets = [
    createPet("Gina", persons[1]),
    createPet("Schnuffi", persons[1]),
    createPet("Schnuffel", persons[2]),
    createPet("WauWau", persons[0]),
    createPet("Lulu", persons[3]),
    createPet("Asta", persons[1])
];

var seq = Enumerable.fromArray(persons)
    .join(pets,
          'person => person.name',
          'pet => pet.owner.name',
          function(person, pet) {
              return 'Owner: ' + person.name + '; Pet: ' + pet.name;
          });
               
seq.each(function(x) {
    printLine("- " + x);    
});               
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
    
    // max()
    methods.push({
        title: 'max()',
        sourceCode: `        
var res1 = Enumerable.create(1, 3, 2)
    .max();

var res2 = Enumerable.create()
    .max();          

printLine('res.1: ' + res1);
printLine('res.2: ' + res2);
`
    });
    
    // min()
    methods.push({
        title: 'min()',
        sourceCode: `        
var res1 = Enumerable.create(2, 1, 3)
    .min();

var res2 = Enumerable.create()
    .min();          

printLine('res.1: ' + res1);
printLine('res.2: ' + res2);
`
    });
    
    // ofType()
    methods.push({
        title: 'ofType()',
        sourceCode: `        
var seq = Enumerable.create(1, '2', 3)
    .ofType('number');

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // orderBy()
    methods.push({
        title: 'orderBy()',
        sourceCode: `        
var seq = Enumerable
    .create("grape", "passionfruit", "banana", "mango", 
            "orange", "raspberry", "apple", "blueberry")
    .orderBy('x => x.length')
    .thenBy('x => x');

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // reverse()
    methods.push({
        title: 'reverse()',
        sourceCode: `        
var seq = Enumerable.create(1, 2, 3)
    .reverse();

seq.each(function(x) {
    printLine(x);    
});
`
    });

    // select()
    methods.push({
        title: 'select()',
        sourceCode: `        
var seq = Enumerable.create("Marcel", "Kloubert")
    .select('x => x.toUpperCase()');

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // selectMany()
    methods.push({
        title: 'selectMany()',
        sourceCode: `        
var seq = Enumerable.create(1, 2, 3)
    .selectMany('x => [x, x * 10, x * 100]');

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // sequenceEqual()
    methods.push({
        title: 'sequenceEqual()',
        sourceCode: `        
var res1 = Enumerable.create(1, 2, 3)
    .sequenceEqual([1, 2, 3]);

var res2 = Enumerable.create(1, 3, 2)
    .sequenceEqual([1, 2, 3]);

var res3 = Enumerable.create(1, 2)
    .sequenceEqual([1, 2, 3]);

var res4 = Enumerable.create(1, 2, 3)
    .sequenceEqual([1, '2', 3]);
  
var res5 = Enumerable.create(1, 2, 3)
    .sequenceEqual([1, '2', 3],
                   '(x, y) => x === y');  
    
printLine('res.1: ' + res1);
printLine('res.2: ' + res2);
printLine('res.3: ' + res3);
printLine('res.4: ' + res4);
printLine('res.5: ' + res5);
`
    });
    
    // single()
    methods.push({
        title: 'single()',
        sourceCode: `
var res1 = Enumerable.create(1)
    .single();
    
var res2;
try {
    res2 = Enumerable.create()
    .single();
}
catch (e) {
    res2 = e;
}

var res3 = Enumerable.create(11, 22)
    .single('x => x > 11');
    
var res4;
try {
    res4 = Enumerable.create(111, 222, 333)
    .single('x => x > 333');
}
catch (e) {
    res4 = e;
}

var res5;
try {
    res5 = Enumerable.create()
    .single('x => x > 333');
}
catch (e) {
    res5 = e;
}

printLine('res.1 => ' + res1);
printLine('res.2 => ' + res2);
printLine('res.3 => ' + res3);
printLine('res.4 => ' + res4);
printLine('res.5 => ' + res5);
`
    });
    
    // singleOrDefault()
    methods.push({
        title: 'singleOrDefault()',
        sourceCode: `
var res1 = Enumerable.create(1)
    .singleOrDefault();
    
var res2 = Enumerable.create()
    .singleOrDefault();

var res3 = Enumerable.create(11, 22)
    .single('x => x > 11');
    
var res4 = Enumerable.create(111, 222, 333)
    .singleOrDefault('x => x > 333');

var res5 = Enumerable.create()
    .singleOrDefault('x => x > 333');

printLine('res.1 => ' + res1);
printLine('res.2 => ' + res2);
printLine('res.3 => ' + res3);
printLine('res.4 => ' + res4);
printLine('res.5 => ' + res5);
`
    });
    
    // skip()
    methods.push({
        title: 'skip()',
        sourceCode: `        
var seq = Enumerable.create(0, 1, 2, 3, 4)
    .skip(3);

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // skipWhile()
    methods.push({
        title: 'skipWhile()',
        sourceCode: `        
var seq = Enumerable.create(22, 33, 44, 55, 666, 77)
    .skipWhile('x => x < 50');

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // sum()
    methods.push({
        title: 'sum()',
        sourceCode: `        
var res1 = Enumerable.create(1, 2, 3)
    .sum('MK');

var res2 = Enumerable.create()
    .sum();

printLine("res.1: " + res1);
printLine("res.2: " + res2);
`
    });
    
    // take()
    methods.push({
        title: 'take()',
        sourceCode: `        
var seq = Enumerable.create(0, 1, 2, 3, 4)
    .take(3);

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // takeWhile()
    methods.push({
        title: 'takeWhile()',
        sourceCode: `        
var seq = Enumerable.create(22, 33, 44, 55)
    .takeWhile('x => x < 50');

seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // toArray()
    methods.push({
        title: 'toArray()',
        sourceCode: `        
var arr = Enumerable.create(1, 2, 3)
    .toArray();

printLine('typeof: ' + (typeof arr));
for (var i = 0; i < arr.length; i++) {
    printLine('arr[' + i +'] = ' + arr[i]);
}
`
    });
    
    // toLookup()
    methods.push({
        title: 'toLookup()',
        sourceCode: `
var lookup = Enumerable.create('Bill', 'Marcel', 'Barney', 'Albert', 'Konrad')
    .toLookup('x => x[0]');
    
for (var k in lookup) {
    printLine('key: ' + k);
    
    var items = lookup[k];
    items.each(function(x) {
        printLine("\t" + x);    
    });
}
`
    });
    
    // toObservable()
    methods.push({
        title: 'toObservable()',
        sourceCode: `        
var o = Enumerable.create('Edward Snowden')
    .toObservable('() => "value"');

printLine(o.get("value"));
`
    });
    
    // toObservableArray()
    methods.push({
        title: 'toObservableArray()',
        sourceCode: `        
var oa = Enumerable.create(1, 2, 3)
    .toObservableArray();

for (var i = 0; i < oa.length; i++) {
    printLine(oa.getItem(i));
}
`
    });
        
    // union()
    methods.push({
        title: 'union()',
        sourceCode: `        
var seq = Enumerable.create(5, 3, 9, 7, 5, 9, 3, 7)
    .union([8, 3, 6, 4, 4, 9, 1, 0]);
                         
seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    // where()
    methods.push({
        title: 'where()',
        sourceCode: `        
var res1 = Enumerable.create(1, 2, 3)
    .where('x => x < 3');

printLine("res.1: " + toStringList(res1));
`
    });
    
    // zip()
    methods.push({
        title: 'zip()',
        sourceCode: `        
var seq = Enumerable.create('Marcel', 'Bill', 'Albert')
    .zip(['Kloubert', 'Gates', 'Einstein', 'Adenauer'],
          function(firstName, lastName) {
              return firstName + " " + lastName;
           });
                         
seq.each(function(x) {
    printLine(x);    
});
`
    });
    
    viewModel.methods = methods;

    var examples = [];
    
    examples.push({
        title: 'Simple example',
        sourceCode: `        
var seq = Enumerable.create(5979, 23979, null, '23979', 1781, 241279)
    .where('x => x !== null')
    .skip(1)
    .take(3)
    .distinct()
    .select('x => "" + x')
    .orderBy('x => x');

seq.each(function(item) {
    printLine(item);
});
`
    });
    
    viewModel.examples = examples;

    return viewModel;
}
exports.createViewModel = createViewModel;