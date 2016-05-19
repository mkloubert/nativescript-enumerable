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

