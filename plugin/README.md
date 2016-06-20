[![npm](https://img.shields.io/npm/v/nativescript-enumerable.svg)](https://www.npmjs.com/package/nativescript-enumerable)
[![npm](https://img.shields.io/npm/dt/nativescript-enumerable.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-enumerable)

# NativeScript Enumerable

A [NativeScript](https://nativescript.org/) module providing [LINQ](https://en.wikipedia.org/wiki/Language_Integrated_Query) style extensions for handling arrays and lists.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YA4RCT6FQX28J)

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

```typescript
import Enumerable = require("nativescript-enumerable");

// from a list of values / objects with variable length
var seq1 = Enumerable.create(1, 'MK', true, null, {});

// from an array / list
var seq2 = Enumerable.fromArray([11, 22, 33, 44]);

// from object
var seq3 = Enumerable.fromObject({
    MK: 23979,
    TM: 5979
});

// range of numbers: 2, 3, 4, 5, 6
var seq4 = Enumerable.range(2, 5);

// 50979 'TM' strings
var seq5 = Enumerable.repeat('TM', 50979);
```

### Work with them

```typescript
import seq = Enumerable.create(5979, 23979, null, '23979', 1781, 241279);

var newSeq = seq.where((x) => x !== null)  // remove all elements that are (null)
                .skip(1)  // skip one element (5979)
                .take(3)  // take next remaining 3 elements (23979, 23979, 1781)
                .distinct()  // remove duplicates
                .select((x) => "" + x)  // convert to strings
                .order();  // order by element ascending

newSeq.each((item) => {
    // [0] 1781
    // [1] 23979
    console.log(item);
});
```

Most methods are chainable as in [.NET](https://en.wikipedia.org/wiki/.NET_Framework) context.

## Functions and lambda expression

Many methods require one or more function.

Instead using a function like

```typescript
.where(function(x) {
           return x !== null;
       })
```

you can write

```typescript
.where('x => x !== null')
```

instead.

## Documentation

Take a look at the [plugin/index.js](https://github.com/mkloubert/nativescript-enumerable/blob/master/plugin/index.js) file to get detailed information about all methods (search for `enumerable method templates`).

## Demo app

The [demo app](https://github.com/mkloubert/nativescript-enumerable/tree/master/demo) contains examples to all functions and methods.

It also contains a code editor where **you can enter own code and run it!**

<img src="https://raw.githubusercontent.com/mkloubert/nativescript-enumerable/master/images/codeeditor1.png" width="192">
<img src="https://raw.githubusercontent.com/mkloubert/nativescript-enumerable/master/images/codeeditor2.png" width="192">
<img src="https://raw.githubusercontent.com/mkloubert/nativescript-enumerable/master/images/codeeditor3.png" width="192">

The [wiki](https://github.com/mkloubert/nativescript-enumerable/wiki/Demo-app) describes how it works.

## Examples

### Filters

```typescript
// distinct()
// 1, 2, 4, 3
Enumerable.create(1, 2, 4, 2, 3)
          .distinct();
 
// except()
// 2.0, 2.1, 2.3, 2.4, 2.5
Enumerable.create(2.0, 2.1, 2.2, 2.3, 2.4, 2.5)
          .except([2.2]); 
 
// intersect()
// 26, 30
Enumerable.create(44, 26, 92, 30, 71, 38)
          .intersect([30, 59, 83, 47, 26, 4, 3]);
       
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
          .where((x) => x < 4);
```

### Sort elements

```typescript
// orderBy(), thenBy()
//
// "apple", "grape", "mango", "banana",
// "orange", "blueberry", "raspberry", "passionfruit"
Enumerable.create("grape", "passionfruit", "banana", "mango", 
                  "orange", "raspberry", "apple", "blueberry")
          .orderBy((x) => x.length)  // complement: orderByDescending()
          .thenBy((x) => x);  // complement: thenByDescending()
                              // shorter: then()

// reverse()
// 4, 3, 2, 1
Enumerable.create(1, 2, 3, 4)
          .reverse();
```

### Take / skip elements

```typescript
// skip()
// 3, 4
Enumerable.create(0, 1, 2, 3, 4)
          .skip(3);

// skipWhile()
// 55, 666, 77
Enumerable.create(22, 33, 44, 55, 666, 77)
          .skipWhile((x) => x < 50);
          
// take()
// 0, 1, 2
Enumerable.create(0, 1, 2, 3, 4)
          .take(3);

// takeWhile()
// 22, 33, 44
Enumerable.create(22, 33, 44, 55)
          .takeWhile((x) => x < 50);
```

### Get one element

```typescript
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
Enumerable.create(11)
          .singleOrDefault('YS');
```

All methods with NO `OrDefault` suffix will throw exceptions if no element was found.

You also can use a function as first argument for all of these methods that works as filter / condition:

```typescript
// first()
// 22
Enumerable.create(11, 22, 33, 44)
          .first((x) => x >= 20);
```

### Accumulators

```typescript
// aggregate()
// "Marcel Joachim Kloubert"
Enumerable.create('Marcel', 'Joachim', 'Kloubert')
          .aggregate((result: string, x: string) => {
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

```typescript
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

```typescript
class Person {
    constructor(name: string) {
        this.name = name;
    }

    public name: string;
}

class Pet: {
    constructor(name: string, owner: Person) {
        this.name = name;
        this.owner = owner;
    }

    public name: string;
    public owner: Person;
}

var persons: Person[] = [
    new Person("Tanja"),
    new Person("Marcel"),
    new Person("Yvonne"),
    new Person("Josefine")
];

var pets: Pet[] = [
    new Pet("Gina", persons[1]),
    new Pet("Schnuffi", persons[1]),
    new Pet("Schnuffel", persons[2]),
    new Pet("WauWau", persons[0]),
    new Pet("Lulu", persons[3]),
    new Pet("Asta", persons[1]),
];

// groupJoin()
// 
// [0] 'Owner: Tanja; Pets: WauWau, Sparky'
// [1] 'Owner: Marcel; Pets: Gina, Schnuffi, Asta'
// [2] 'Owner: Yvonne; Pets: Schnuffel'
// [3] 'Owner: Josefine; Pets: Lulu'
Enumerable.fromArray(persons)
          .groupJoin(pets,
                     (person: Person) => person.name,
                     (pet: Pet) => pet.owner.name,
                     (person: Person, petsOfPerson: Enumerable.IEnumerable<Pet>) => {
                         var petList = petsOfPerson
                             .select((pet: Pet) => pet.name)
                             .aggregate((result: string, petName: string) => {
                                            return result += ", " + petName;
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
Enumerable.fromArray(persons)
          .join(pets,
                (person: Person) => person.name,
                (pet: Pet) => pet.owner.name,
                (person: Person, pet: Pet) => {
                    return 'Owner: ' + person.name + '; Pet: ' + pet.name;
                });
```

### Groupings

```typescript
// groupBy()
Enumerable.create("grape", "passionfruit", "banana",
                  "apple", "blueberry")
          .groupBy((x: string) => x[0])
          .each(function(grouping: Enumerable.IGrouping<string, string>) {
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

```typescript
// select()
// "MARCEL", "KLOUBERT"
Enumerable.create("Marcel", "Kloubert")
          .select((x: string) => x.toUpperCase());
          
// selectMany()
// 1, 10, 100, 2, 20, 200, 3, 30, 300
Enumerable.create(1, 2, 3)
          .selectMany((x: number) => [x, x * 10, x * 100]);

// zip()
// "Marcel Kloubert", "Bill Gates", "Albert Einstein"
Enumerable.create('Marcel', 'Bill', 'Albert')
          .zip(['Kloubert', 'Gates', 'Einstein', 'Adenauer'],
               (firstName: string, lastName: string) => {
                   return firstName + " " + lastName;
               });
```

### Checks / conditions

```typescript
// all()
// (false)
Enumerable.create(1, 2, '3', 4)
          .all((x) => typeof x !== "string");
          
// contains()
// (true)
Enumerable.create(1, 2, '3')
          .contains(3);

// any()
// (true)
Enumerable.create(1, 2, '3', 4)
          .any((x) => typeof x === "string");
 
// sequenceEqual()
// (false)         
Enumerable.create([1, 2, 3])
          .sequenceEqual([1, 3, 2]);
```

### Conversions

```typescript
// toArray()
var jsArray = Enumerable.create(1, 2, 3, 4)
                        .toArray();
  
// toObject()
var obj = Enumerable.create(1, 2, 3, 4)
                    .toObject((item, index) => "item" + index);  
  
// toObservable()
var o = Enumerable.create(1, 2, 3, 4)
                  .toObservable((item, index) => "item" + index);
  
// toObservableArray()
var oa = Enumerable.create(1, 2, 3, 4)
                   .toObservableArray();  
  
// toLookup()
// 
// lookup['A'][0] = 'Albert'
// lookup['B'][0] = 'Bill'
// lookup['B'][1] = 'Barney'
// lookup['K'][0] = 'Konrad'
// lookup['M'][0] = 'Marcel'
var lookup = Enumerable.create('Bill', 'Marcel', 'Barney', 'Albert', 'Konrad')
                       .toLookup((x: string) => x[0]);
```

### Count

```typescript
// 3
Enumerable.create(0, 1, 2)
          .count();
          
// 2
Enumerable.create(0, 1, 2)
          .count((x) => x > 0);
```

### More

#### concat

```typescript
// 0, 1, 2, 'PZ', 'TM', 'MK'
Enumerable.create(0, 1, 2)
          .concat(['PZ', 'TM', 'MK']);
```

#### defaultIfEmpty

```typescript
// 0, 1, 2
Enumerable.create(0, 1, 2)
          .defaultIfEmpty('PZ', 'TM', 'MK');
          
// 'PZ', 'TM', 'MK'
Enumerable.create()
          .defaultIfEmpty('PZ', 'TM', 'MK');
```

#### moveNext / current

```typescript
var seq = Enumerable.create(0, 1, 2);
while (seq.moveNext()) {
    console.log(seq.current);
}
```

#### reset

```typescript
var seq = Enumerable.create(0, 1, 2);

seq.each((x: number) => {
             console.log(x);
         });

seq.reset()
   .each((x: number) => {
             console.log(x * 2);
         });
```
