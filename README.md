[![npm](https://img.shields.io/npm/v/nativescript-enumerable.svg)](https://www.npmjs.com/package/nativescript-enumerable)
[![npm](https://img.shields.io/npm/dt/nativescript-enumerable.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-enumerable)

# NativeScript Enumerable

A [NativeScript](https://nativescript.org/) module providing [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) style extensions for handling arrays and lists.

## License

[MIT license](https://raw.githubusercontent.com/mkloubert/nativescript-enumerable/master/LICENSE)

## Platforms

* Android
* iOS

## Installation

Run

```bash
tns plugin add nativescript-enumerable
```

inside your app project to install the module.

## Usage

### Create a sequence

```javascript
var Enumerable = require("nativescript-enumerable");

// from a list of values / objects with variable length
var seq1 = Enumerable.create(1, 'MK', true, null, {});

// from an array / list
var seq2 = Enumerable.fromArray([11, 22, 33, 44]);

// range of numbers: 2, 3, 4, 5, 6
var seq3 = Enumerable.range(2, 5);

// 50979 'TM' strings
var seq4 = Enumerable.repeat('TM', 50979);
```

### Work with them

```javascript
var seq = Enumerable.create(5979, 23979, null, '23979', 1781, 241279);

var newSeq = seq.where('x => x !== null')  // remove all elements that are (null)
                .skip(1)  // skip one element (5979)
                .take(3)  // take next remaining 3 elements (23979, 23979, 1781)
                .distinct()  // remove duplicates
                .select('x => "" + x')  // convert to strings
                .orderBy('x => x');  // order by element ascending

newSeq.each(function(item) {
    // [0] 1781
    // [1] 23979
    console.log(item);
});
```

Most methods are chainable as in [.NET](https://en.wikipedia.org/wiki/.NET_Framework) context.

## Functions and lambda expression

Many methods require one or more function.

Instead using a function like

```javascript
.where(function(x) {
           return x !== null;
       })
```

you can write

```javascript
where('x => x !== null')
```

instead.

## Documentation

Take a look at the [plugin/index.js](https://github.com/mkloubert/nativescript-enumerable/blob/master/plugin/index.js) file to get detailed information about all methods (search for `enumerable method templates`).

## Examples

### Filters

```javascript
// distinct()
// 1, 2, 4, 3
Enumerable.create(1, 2, 4, 2, 3)
          .distinct();
 
// except()
// 2.0, 2.1, 2.3, 2.4, 2.5
Enumerable.create(2.0, 2.1, 2.2, 2.3, 2.4, 2.5)
          .intersect([2.2]); 
 
// intersect()
// 26, 30
Enumerable.create(44, 26, 92, 30, 71, 38)
          .intersect([39, 59, 83, 47, 26, 4, 3]);
       
// ofType()
// '2', 'Tanja'
Enumerable.create(1, '2', 2, 'Tanja', 3)
          .ofType('string');  // typeof x == 'string'
          
// union()
// 5, 3, 9, 7, 8, 6, 4, 1, 0
Enumerable.create(5, 3, 9, 7, 5, 9, 3, 7)
          .union([8, 3, 6, 4, 4, 9, 1, 0]);
          
// where()
// 1, 2, 3
Enumerable.create(1, 2, 3, 4)
          .where('x => x < 4');
```

### Sort elements

```javascript
// orderBy(), thenBy()
//
// "apple", "grape", "mango", "banana",
// "orange", "blueberry", "raspberry", "passionfruit"
Enumerable.create("grape", "passionfruit", "banana", "mango", 
                  "orange", "raspberry", "apple", "blueberry")
          .orderBy('x => x.length')  // complement: orderByDescending()
          .thenBy('x => x');  // complement: thenByDescending()

// reverse()
// 4, 3, 2, 1
Enumerable.create(1, 2, 3, 4)
          .reverse();
```

### Take / skip elements

```javascript
// skip()
// 3, 4
Enumerable.create(0, 1, 2, 3, 4)
          .skip(3);

// skipWhile()
// 55, 666, 777
Enumerable.create(22, 33, 44, 55, 666, 77)
          .skipWhile('x => x < 50');
          
// take()
// 0, 1, 2
Enumerable.create(0, 1, 2, 3, 4)
          .take(3);

// takeWhile()
// 22, 33, 44
Enumerable.create(22, 33, 44, 55)
          .takeWhile('x => x < 50');
```

### Get one element

```javascript
// elementAt()
// 33
Enumerable.create(11, 22, 33, 44)
          .elementAt(2);
          
// elementAtOrDefault()
// 'TM'
Enumerable.create(11, 22, 33, 44)
          .elementAtOrDefault(4, 'TM');  // out of range
          
// first()
// 11
Enumerable.create(11, 22, 33, 44)
          .first();
          
// firstOrDefault()
// 'MK'
Enumerable.create()
          .firstOrDefault('MK');
          
// last()
// 44
Enumerable.create(11, 22, 33, 44)
          .last();
          
// lastOrDefault()
// 'PZ'
Enumerable.create()
          .lastOrDefault('PZ');

// single()
// EXCEPTION, because we have more than one element
Enumerable.create(11, 22, 33, 44)
          .single();
          
// singleOrDefault()
// 11
Enumerable.create([11])
          .singleOrDefault('YS');
```

All methods with NO `OrDefault` suffix will throw exceptions if no element was found.

You also can use a function as first argument for all of these methods that works as filter / condition:

```javascript
// first()
// 22
Enumerable.create(11, 22, 33, 44)
          .first('x => x >= 20');
```

### Accumulators

```javascript
// aggregate()
// "Marcel Joachim Kloubert"
Enumerable.create('Marcel', 'Joachim', 'Kloubert')
          .aggregate(function(result, x) {
                         return result += " " + x;
                     });

// average()
// 2.5
Enumerable.create(1, 2, 3, 4)
          .average();
          
// sum()
// 10
Enumerable.create(1, 2, 3, 4)
          .sum();  
```

### Minimum / maximum values

```javascript
// max()
// 3
Enumerable.create(1, 3, 2)
          .max(); 
          
// min()
// 1
Enumerable.create(2, 3, 1, 2)
          .min();
```

### Joins

```javascript
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

// groupJoin()
// 
// [0] 'Owner: Tanja; Pets: WauWau, Sparky'
// [1] 'Owner: Marcel; Pets: Gina, Schnuffi, Asta'
// [2] 'Owner: Yvonne; Pets: Schnuffel'
// [3] 'Owner: Josefine; Pets: Lulu'
Enumerable.create(persons)
          .groupJoin(pets,
                     'person => person.name',
                     'pet => pet.owner.name',
                     function(person, petsOfPerson) {
                         var petList = petsOfPerson.aggregate(function(result, pet) {
                             return result += ", " + pet.name;
                         });
                     
                         return 'Owner: ' + person.name + '; Pets: ' + petList;
                     });

// join()
// 
// [0] 'Owner: Tanja; Pet: WauWau'
// [1] 'Owner: Marcel; Pet: Gina'
// [2] 'Owner: Marcel; Pet: Schnuffi'
// [3] 'Owner: Marcel; Pet: Asta'
// [4] 'Owner: Yvonne; Pet: Schnuffel'
// [5] 'Owner: Josefine; Pet: Lulu'
Enumerable.create(persons)
          .join(pets,
                'person => person.name',
                'pet => pet.owner.name',
                function(person, pet) {
                    return 'Owner: ' + person.name + '; Pet: ' + pet.name;
                });
```

### Groupings

```javascript
// groupBy()
Enumerable.create("grape", "passionfruit", "banana",
                  "apple", "blueberry")
          .groupBy('x => x[0]')
          .each(function(grouping) {
                    // grouping[0].key = 'g'
                    // grouping[0][0] = 'grape'
                    
                    // grouping[1].key = 'p'
                    // grouping[1][0] = 'passionfruit'
                    
                    // grouping[2].key = 'b'
                    // grouping[2][0] = 'banana'
                    // grouping[2][1] = 'blueberry'
                    
                    // grouping[3].key = 'a'
                    // grouping[3][0] = 'apple'
                });
```

### Projection

```javascript
// select()
// "MARCEL", "KLOUBERT"
Enumerable.create("Marcel", "Kloubert")
          .select('x => x.toUpperCase()');
          
// selectMany()
// 1, 10, 100, 2, 20, 200, 3, 30, 300
Enumerable.create(1, 2, 3)
          .selectMany('x => [x, x * 10, x * 100]');

// zip()
// "Marcel Kloubert", "Bill Gates", "Albert Einstein"
Enumerable.create('Marcel', 'Bill', 'Albert')
          .zip(['Kloubert', 'Gates', 'Einstein', 'Adenauer'],
               function(firstName, lastName) {
                   return firstName + " " + lastName;
               });
```

### Checks / conditions

```javascript
// all()
// (false)
Enumerable.create(1, 2, '3', 4)
          .all('x => typeof x !== "string"');
          
// contains()
// (true)
Enumerable.create(1, 2, '3')
          .contains(3);

// any()
// (true)
Enumerable.create(1, 2, '3', 4)
          .any('x => typeof x === "string"');
 
// sequenceEqual()
// (false)         
Enumerable.create([1, 2, 3])
          .sequenceEqual([1, 3, 2]);
```

### Conversions

```javascript
// toArray()
var jsArray = Enumerable.create(1, 2, 3, 4)
                        .toArray();
```

### Count

```javascript
// 3
Enumerable.create(0, 1, 2)
          .count();
          
// 2
Enumerable.create(0, 1, 2)
          .count('x => x > 0');
```

### More

#### concat

```javascript
// 0, 1, 2, 'PZ', 'TM', 'MK'
Enumerable.create(0, 1, 2)
          .concat(['PZ', 'TM', 'MK']);
```

#### defaultIfEmpty

```javascript
// 0, 1, 2
Enumerable.create(0, 1, 2)
          .defaultIfEmpty('PZ', 'TM', 'MK');
          
// 'PZ', 'TM', 'MK'
Enumerable.create()
          .defaultIfEmpty('PZ', 'TM', 'MK');
```

## Roadmap

* cast()
* toLookup()
