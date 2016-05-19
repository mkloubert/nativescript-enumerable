[![npm](https://img.shields.io/npm/v/nativescript-enumerable.svg)](https://www.npmjs.com/package/nativescript-enumerable)
[![npm](https://img.shields.io/npm/dt/nativescript-enumerable.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-enumerable)

# NativeScript Enumerable

A [NativeScript](https://nativescript.org/) module providing [https://en.wikipedia.org/wiki/Language_Integrated_Query](LINQ) style extensions for handling arrays and lists.

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
```

### Work with them

```javascript
var seq = Enumerable.create(5979, 23979, null, 23979, 1781, 241279);

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
Enumerable.create(1, '2', 4, 'Tanja', 3)
          .ofType('string');
          
// union()
// 5, 3, 9, 7, 8, 6, 4, 1, 0
Enumerable.create(5, 3, 9, 7, 5, 9, 3, 7)
          .union([8, 3, 6, 4, 4, 9, 1, 0]);
          
// where()
// 1, 2, 3
Enumerable.create(1, 2, 3, 4)
          .where('x => x < 4');
```

## Implemented "extension" methods

* aggregate()
* all()
* any()
* average()
* concat()
* contains()
* count()
* defaultIfEmpty()
* distinct()
* elementAt()
* elementAtOrDefault()
* except()
* first()
* firstOrDefault()
* groupBy()
* groupJoin()
* intersect()
* join()
* last()
* lastOrDefault()
* max()
* min()
* ofType()
* orderBy()
* orderByDescending()
* reverse()
* select()
* selectMany()
* sequenceEqual()
* single()
* singleOrDefault()
* skip()
* skipWhile()
* sum()
* take()
* takeWhile()
* toArray()
* union()
* where()
* zip()

Take a look at the [plugin/index.js](https://github.com/mkloubert/nativescript-enumerable/blob/master/plugin/index.js) file to get detailed information about all methods (search for `enumerable method templates`).

