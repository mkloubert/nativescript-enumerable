// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var enumerableMethods = {};
var orderedEnumerableMethods = {};

/**
 * Returns a value as function.
 *
 * @function asFunc
 * 
 * @param any v The value to convert. Can be a function or a string that is handled as lambda expression.
 * @param {Boolean} [throwException] Throw an exception if value is no valid function or not. Is (true) by default.
 * 
 * @throws Value is no valid function / lambda expression.
 * 
 * @return {Function} Value as function or (false) if value is invalid.
 */
function asFunc(v, throwException) {
    if (typeof v === "function") {
        return v;
    }
    
    if (!v) {
        return v;
    }
    
    // now handle as lambda
    
    if (arguments.length < 2) {
        throwException = true;
    }

    var lambda = "" + v;
    
    var matches = lambda.match(/^(\s*)([\(]?)([^\)]*)([\)]?)(\s*)(=>)/m);
    if (matches) {
        if ((("" === matches[2]) && ("" !== matches[4])) ||
            (("" !== matches[2]) && ("" === matches[4]))) {
            
            if (throwException) {
                throw "Syntax error in '" + lambda + "' expression!";
            }
            
            return null;
        }
        
        var lambdaBody = lambda.substr(matches[0].length)
                               .replace(/^[\s|{|}]+|[\s|{|}]+$/g, '');  // trim
        
        if ("" !== lambdaBody) {
            if (';' !== lambdaBody.substr(-1)) {
                lambdaBody = 'return ' + lambdaBody + ';';
            }
        }
        
        eval('var func = function(' + matches[3] + ') { ' + lambdaBody + ' };');
        return func;
    }
    
    if (throwException) {
        throw "'" + v + "' is NO valid lambda expression!";
    }
    
    return false;
}
exports.asFunc = asFunc;

function createObjectForOrDefaultMethod(args) {
    var odObj = {
        predicate: function() { return true; }
    };
    
    if (args.length > 0) {
        if (args.length < 2) {
            var func = asFunc(args[0], false);
            
            if (typeof func !== "function") {
                odObj.defaultValue = args[0];
            }
            else {
                odObj.predicate = func;
            }
        }
        else {
            odObj.predicate = asFunc(args[0]);
            odObj.defaultValue = args[1];
        }
    }
    
    return odObj;
}

/**
 * Returns a value as comparer.
 *
 * @function toComparerSafe
 * 
 * @param any predicate The input value.
 * 
 * @throws Input value is no valid function / lambda expression.
 * 
 * @return {Function} Input value as comparer.
 */
function toComparerSafe(comparer) {
    comparer = asFunc(comparer);
    
    var defaultComprer = function(x, y) {
        if (x < y) {
            return -1;
        }
        
        if (x > y) {
            return 1;
        }
        
        return 0;
    };
    
    if (!comparer) {
        return defaultComprer;
    }
    
    return comparer;
};
exports.toComparerSafe = toComparerSafe;

/**
 * Returns a value as equality comparer.
 *
 * @function toEqualityComparerSafe
 * 
 * @param any equalityComparer The input value.
 * 
 * @throws Input value is no valid function / lambda expression.
 * 
 * @return {Function} Input value as equality comparer.
 */
function toEqualityComparerSafe(equalityComparer) {
    if (true === equalityComparer) {
        return function(x, y) {
            return x === y;    
        };
    }
    
    equalityComparer = asFunc(equalityComparer);
    
    var defaultEqualityComparer = function(x, y) {
        return x == y;
    };
    
    if (!equalityComparer) {
        return defaultEqualityComparer;
    }
    
    return equalityComparer;
}
exports.toPredicateSafe = toPredicateSafe;

/**
 * Returns a value as predicate.
 *
 * @function toPredicateSafe
 * 
 * @param any predicate The input value.
 * 
 * @throws Input value is no valid function / lambda expression.
 * 
 * @return {Function} Input value as predicate.
 */
function toPredicateSafe(predicate) {
    if (!predicate) {
        predicate = function() { return true; };
    }
    
    return asFunc(predicate);
}
exports.toPredicateSafe = toPredicateSafe;

function createEnumerableContext(enumerable, index) {
    return {
        index: index,
        item: enumerable.current,
        sequence: enumerable,    
    };
}

function setupEnumerable(enumerable, opts) {
    Object.defineProperty(enumerable, 'current', {
        get: function() {
            var c = opts.current();
            
            if (enumerable.__6C0F8FF9E35) {
                // use inner selector
                return enumerable.__6C0F8FF9E35(c);
            }
            
            return c;
        }    
    });
    
    Object.defineProperty(enumerable, 'isValid', {
        get: opts.isValid
    });
    
    enumerable.moveNext = opts.moveNext;
    enumerable.reset = opts.reset;
    
    for (var p in enumerableMethods) {
        enumerable[p] = enumerableMethods[p];
    }
    
    // DO NOT USE THIS
    enumerable.__AE81792B3F554A3DA7BCEE8D695EB429 = 'UvIQTaBP';
}

function setupOrderedEnumerable(orderedEnumerable, opts) {
    for (var p in orderedEnumerableMethods) {
        orderedEnumerable[p] = orderedEnumerableMethods[p];
    }
    
    orderedEnumerable.__0CDF3D959A20 = opts.selector;
    orderedEnumerable.__559048F1 = opts.comparer;
    orderedEnumerable.__A922635A1BF2 = opts.originalItems;
}

/**
 * Creates a new sequence from an array.
 *
 * @function fromArray
 * 
 * @param {Array} arr The array.
 * 
 * @return {Object} The new sequence.
 */
function fromArray(arr) {
    if (arguments.length < 1) {
        arr = [];
    }
    
    var enumerable = {};
    
    var index;
    setupEnumerable(enumerable, {
        current: function() { return arr[index]; },
        
        isValid: function() {
            if (arr.length < 1) {
                return false;
            }
            
            var i = index;
            if (i === undefined) {
                i = 0;
            }
            
            return arr.length - i > 0;
        },
        
        moveNext: function() {
            if (index === undefined) {
                index = -1;
            }
            
            return ++index < arr.length;
        },
        
        reset: function() { index = undefined; }
    });
    
    return enumerable;
}
exports.fromArray = fromArray;

/**
 * Creates a new sequence from a list of items.
 *
 * @function create
 * 
 * @param {Array} arr The array.
 * 
 * @return {Object} The new sequence.
 */
function create() {
    return fromArray(arguments);
}
exports.create = create;

/**
 * Returns a value as sequence.
 *
 * @function asEnumerable
 * 
 * @param any v The input value.
 * @param {Boolean} [throwException] Throws an exception if input value is no valid value. Is (true) by default.
 * 
 * @return any The value as sequence or (false) if input value is no valid object.
 */
function asEnumerable(v, throwException) {
    if ((v instanceof Array) || !v) {
        return fromArray(v);
    }
    
    if (v.__AE81792B3F554A3DA7BCEE8D695EB429 === 'UvIQTaBP') {
        return v;
    }
    
    if (typeof v === 'string') {
        var charArray = [];
        for (var i = 0; i < v.length; i++) {
            charArray.push(v[i]);
        }
        
        return fromArray(charArray);
    }
    
    // at this point we have no valid value to use as sequence
    
    if (arguments.length < 2) {
        throwException = true;
    }
    
    if (throwException) {
        throw "'" + v + "' is no valid value to use as sequence!";    
    }
    
    return false;
}
exports.asEnumerable = asEnumerable;


// ---------- enumerable method templates ----------

/**
 * Checks if all elements of the sequence match a condition.
 *
 * @method all
 * 
 * @param {Function} predicate The condition.
 * 
 * @return {Boolean} All items match condition or not. If sequence is empty (true) is returned.
 */
enumerableMethods.all = function(predicate) {
    predicate = asFunc(predicate);
    
    while (this.moveNext()) {
        if (!predicate(this.current)) {
            return false;
        }
    }
    
    return true;
};

/**
 * Checks if at least one element of the sequence matches a condition.
 *
 * @method any
 * 
 * @param {Function} [predicate] The condition.
 * 
 * @return {Boolean} At least one element was found that matches the condition.
 *                   If condition is not defined, the method checks if sequence contains at least one element.
 */
enumerableMethods.any = function(predicate) {
    predicate = toPredicateSafe(predicate);
    
    while (this.moveNext()) {
        if (predicate(this.current)) {
            return true;
        }
    }
    
    return false;
};

/**
 * Applies an accumulator function over the sequence.
 *
 * @method aggregate
 * 
 * @param {Function} accumulator The accumulator.
 * @param any [defaultValue] The value to return if sequence is empty.
 * 
 * @return any The final accumulator value or the default value.
 */
enumerableMethods.aggregate = function(accumulator, defaultValue) {
    accumulator = asFunc(accumulator);
    
    var aggResult = defaultValue;
    var isFirst = true;
    while (this.moveNext()) {
        if (!isFirst) {
            aggResult = accumulator(aggResult, this.current);
        }
        else {
            aggResult = this.current;
            isFirst = false;
        }
    }
    
    return aggResult;
};

/**
 * Computes the average of that sequence.
 *
 * @method average
 * 
 * @param any [defaultValue] The (default) value to return if sequence is empty.
 * 
 * @return any The average of the sequence or the default value.
 */
enumerableMethods.average = function(defaultValue) {
    var cnt = 0;
    var sum = 0;
    while (this.moveNext()) {
        sum += this.current;        
        ++cnt;
    }
    
    return cnt > 0 ? (parseFloat(sum) / parseFloat(cnt))
                   : defaultValue;
};

/**
 * Concats the items of that sequence with the items of another one.
 *
 * @method concat
 * 
 * @param any second The other sequence.
 * 
 * @throws Value for other sequence is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.concat = function(second) {
    second = asEnumerable(second);
    
    var newItems = [];
    
    var appendItems = function(seq) {
        while (seq.moveNext()) {
            newItems.push(seq.current);
        }
    };
    
    appendItems(this);
    appendItems(second);
    
    return fromArray(newItems);
};

/**
 * Checks if that sequence contains an item.
 *
 * @method contains
 * 
 * @param any item The item to search for.
 * @param {Function} [equalityComparer] The custom equality comparer to use.
 * 
 * @return {Boolean} Contains item or not.
 */
enumerableMethods.contains = function(item, equalityComparer) {
    equalityComparer = toEqualityComparerSafe(equalityComparer);
    
    return this.any(function(x) {
        return equalityComparer(x, item);
    });
};

/**
 * Returns the number of elements.
 *
 * @method count
 * 
 * @param {Function} [predicate] The custom condition to use.
 * 
 * @return {Number} The number of (matching) elements.
 */
enumerableMethods.count = function(predicate) {
    predicate = toPredicateSafe(predicate);

    var cnt = 0;
    while (this.moveNext()) {
        if (predicate(this.current)) {
            ++cnt;    
        }
    }
    
    return cnt;
};

/**
 * Returns a default sequence if that sequence is empty.
 *
 * @method defaultIfEmpty
 * 
 * @param ...any [defaultItem] One or more items for the default sequence.
 * 
 * @return {Object} A default sequence or that sequence if it is not empty.
 */
enumerableMethods.defaultIfEmpty = function() {
    if (!this.isValid) {
        return fromArray(arguments);
    }
    
    return this;
};

/**
 * Removes the duplicates from that sequence.
 *
 * @method distinct
 * 
 * @param {Function} [equalityComparer] The custom equality comparer to use.
 * 
 * @throws No valid equality comparer.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.distinct = function(equalityComparer) {
    equalityComparer = toEqualityComparerSafe(equalityComparer);
    
    var distinctedItems = [];
    
    while (this.moveNext()) {
        var curItem = this.current;
        
        var alreadyInList = false;
        for (var i = 0; i < distinctedItems.length; i++) {
            if (equalityComparer(curItem, distinctedItems[i])) {
                alreadyInList = true;
                break;
            }
        }
        
        if (!alreadyInList) {
            distinctedItems.push(curItem);
        }
    }
    
    return fromArray(distinctedItems);
};


/**
 * Iterates over the elements of that sequence.
 *
 * @method each
 * 
 * @param {Function} action The callback that is executed for an item.
 * 
 * @return any The result of the last execution.
 */
enumerableMethods.each = function(action) {
    action = asFunc(action);
    
    var index = -1;
    var result;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        result = action(ctx.item, ctx.index, ctx);
    }
    
    return result;
};

/**
 * Return an element of the sequence at a specific index.
 *
 * @method elementAt
 * 
 * @param {Number} index The zero based index.  
 * 
 * @throws Element was not found.
 * 
 * @return any The element.
 */
enumerableMethods.elementAt = function(index) {
    return this.first(function(x, i) {
        return i == index;
    });
};

/**
 * Tries to return an element of the sequence at a specific index.
 *
 * @method elementAtOrDefault
 * 
 * @param {Number} index The zero based index.  
 * @param any [defaultValue] The (default) value to return if no matching element was found.
 * 
 * @return any The element or the default value.
 */
enumerableMethods.elementAtOrDefault = function(index, defaultValue) {
    return this.firstOrDefault(function(x, i) {
        return i == index;
    }, defaultValue);
};

/**
 * Returns the items of that sequence except a list of specific ones.
 *
 * @method except
 * 
 * @param any second The sequence with the items to remove.
 * @param any [equalityComparer] The custom equality comparer to use.
 *
 * @throws The second sequence and/or the equality comparer is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.except = function(second, equalityComparer) {
    equalityComparer = toEqualityComparerSafe(equalityComparer);
    
    second = asEnumerable(second).distinct(equalityComparer)
                                 .toArray();
        
    var newItems = [];
        
    while (this.moveNext()) {
        var curItem = this.current;
        
        var found = false;
        for (var i = 0; i < second.length; i++) {
            var secondItem = second[i];
            if (equalityComparer(curItem, secondItem)) {
                found = true;
                break;
            }
        }
        
        if (!found) {
            newItems.push(curItem);
        }
    }
    
    return fromArray(newItems);
};

/**
 * Returns the first element of the sequence.
 *
 * @method first
 * 
 * @param {Function} [predicate] The custom condition to use.
 *
 * @throws Sequence contains no (matching) element.
 * 
 * @return any The first (matching) element.
 */
enumerableMethods.first = function(predicate) {
    predicate = toPredicateSafe(predicate);
    
    var index = -1;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        if (predicate(ctx.item, ctx.index, ctx)) {
            return ctx.item;
        }
    }
    
    throw "Sequence contains NO element!";
};

/**
 * Tries to return the first element of the sequence.
 *
 * @method firstOrDefault
 * 
 * @param {Function} [predicateOrDefaultValue] The custom condition to use.
 *                                             If only one argument is defined and that value is NO function it will be handled as default value.  
 * @param any [defaultValue] The (default) value to return if no matching element was found.
 * 
 * @return any The first (matching) element or the default value.
 */
enumerableMethods.firstOrDefault = function(predicateOrDefaultValue, defaultValue) {
    var odObj = createObjectForOrDefaultMethod(arguments);
    
    var index = -1;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        if (odObj.predicate(ctx.item, ctx.index, ctx)) {
            return ctx.item;
        }
    }
    
    return odObj.defaultValue;
};

/**
 * Groups the elements of the sequence.
 *
 * @method groupBy
 * 
 * @param any keySelector The group key selector.
 * @param any [keyEqualityComparer] The custom equality comparer for the keys to use. 
 * 
 * @throw At least one argument is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.groupBy = function(keySelector, keyEqualityComparer) {
    keySelector = asFunc(keySelector);
    keyEqualityComparer = toEqualityComparerSafe(keyEqualityComparer);
    
    var index = -1;
    var groupList = [];
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        var key = keySelector(ctx.item, ctx.index, ctx);
        
        var grp = null;
        for (var i = 0; i < groupList.length; i++) {
            var g = groupList[i];
            
            if (keyEqualityComparer(g.key, key)) {
                grp = g;
                break;
            }
        }
        
        if (null === grp) {
            grp = {
                key: key,
                values: []
            };
            
            groupList.push(grp);
        }
        
        grp.values.push(ctx.item);
    }
    
    return fromArray(groupList.map(function(x) {
        var grouping = fromArray(x.values);
        grouping.key = x.key;
        
        return grouping;
    }));
};

/**
 * Correlates the elements of that sequence and another based on matching keys and groups them.
 *
 * @method groupJoin
 * 
 * @param any inner The other sequence.
 * @param any outerKeySelector The key selector for the items of that sequence.
 * @param any innerKeySelector The key selector for the items of the other sequence.
 * @param any resultSelector The function that provides the result value for two matching elements.
 * @param any [keyEqualityComparer] The custom equality comparer for the keys to use. 
 * 
 * @throw At least one argument is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.groupJoin = function(inner,
                                       outerKeySelector, innerKeySelector,
                                       resultSelector,
                                       keyEqualityComparer) {
                                      
    inner = asEnumerable(inner);
    
    resultSelector = asFunc(resultSelector);
    keyEqualityComparer = toEqualityComparerSafe(keyEqualityComparer);

    var createGroupsForSequence = function(seq, keySelector) {
        return seq.groupBy(keySelector)
                  .select(function(grouping) {
                              return {
                                  key: grouping.key,
                                  values: grouping.toArray()                                   
                              };
                          })
                  .toArray();
    };

    var outerGroups = createGroupsForSequence(this, outerKeySelector);
    var innerGroups = createGroupsForSequence(inner, innerKeySelector);
    
    var joinedItems = [];
    
    for (var i = 0; i < outerGroups.length; i++) {
        var outerGrp = outerGroups[i];
        
        for (var ii = 0; ii < innerGroups.length; ii++) {
            var innerGrp = innerGroups[ii];
            
            if (!keyEqualityComparer(outerGrp.key, innerGrp.key)) {
                continue;
            }
            
            for (var iii = 0; iii < outerGrp.values.length; iii++) {
                joinedItems.push(resultSelector(outerGrp.values[iii],
                                                fromArray(innerGrp.values)));
            }
        }
    }
    
    return fromArray(joinedItems);
};

/**
 * Returns the intersection between this and a second sequence.
 *
 * @method intersect
 * 
 * @param any second The second sequence.
 * @param any [equalityComparer] The custom equality comparer to use.
 *
 * @throws The second sequence and/or the equality comparer is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.intersect = function(second, equalityComparer) {
    equalityComparer = toEqualityComparerSafe(equalityComparer);
    
    second = asEnumerable(second).distinct(equalityComparer)
                                 .toArray();
        
    var newItems = [];
        
    while (this.moveNext()) {
        var curItem = this.current;
        
        for (var i = 0; i < second.length; i++) {
            var secondItem = second[i];
            if (equalityComparer(curItem, secondItem)) {
                newItems.push(curItem);
                
                break;
            }
        }
    }
    
    return fromArray(newItems);
};

/**
 * Correlates the elements of that sequence and another based on matching keys.
 *
 * @method join
 * 
 * @param any inner The other sequence.
 * @param any outerKeySelector The key selector for the items of that sequence.
 * @param any innerKeySelector The key selector for the items of the other sequence.
 * @param any resultSelector The function that provides the result value for two matching elements.
 * @param any [keyEqualityComparer] The custom equality comparer for the keys to use. 
 * 
 * @throw At least one argument is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.join = function(inner,
                                  outerKeySelector, innerKeySelector,
                                  resultSelector,
                                  keyEqualityComparer) {
                                      
    inner = asEnumerable(inner);
    
    resultSelector = asFunc(resultSelector);
    keyEqualityComparer = toEqualityComparerSafe(keyEqualityComparer);

    var createGroupsForSequence = function(seq, keySelector) {
        return seq.groupBy(keySelector)
                  .select(function(grouping) {
                              return {
                                  key: grouping.key,
                                  values: grouping.toArray()                                   
                              };
                          })
                  .toArray();
    };

    var outerGroups = createGroupsForSequence(this, outerKeySelector);
    var innerGroups = createGroupsForSequence(inner, innerKeySelector);
    
    var joinedItems = [];
    
    for (var i = 0; i < outerGroups.length; i++) {
        var outerGrp = outerGroups[i];
        
        for (var ii = 0; ii < innerGroups.length; ii++) {
            var innerGrp = innerGroups[ii];
            
            if (!keyEqualityComparer(outerGrp.key, innerGrp.key)) {
                continue;
            }
            
            for (var iii = 0; iii < outerGrp.values.length; iii++) {
                for (var iv = 0; iv < innerGrp.values.length; iv++) {
                    joinedItems.push(resultSelector(outerGrp.values[iii],
                                                    innerGrp.values[iv]));
                }
            }
        }
    }
    
    return fromArray(joinedItems);
};

/**
 * Returns the last element of the sequence.
 *
 * @method last
 * 
 * @param {Function} [predicate] The custom condition to use.
 *
 * @throws Sequence contains no (matching) element.
 * 
 * @return any The last (matching) element.
 */
enumerableMethods.last = function(predicate) {
    predicate = toPredicateSafe(predicate);
    
    var index = -1;
    var lastItem;
    var found = false;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);

        if (predicate(ctx.item, ctx.index, ctx)) {
            lastItem = ctx.item;
            found = true;
        }
    }
    
    if (!found) {
        throw "Sequence contains NO element!";
    }

    return lastItem;
};

/**
 * Tries to return the last element of the sequence.
 *
 * @method lastOrDefault
 * 
 * @param {Function} [predicateOrDefaultValue] The custom condition to use.
 *                                             If only one argument is defined and that value is NO function it will be handled as default value.  
 * @param any [defaultValue] The (default) value to return if no matching element was found.
 * 
 * @return any The last (matching) element or the default value.
 */
enumerableMethods.lastOrDefault = function(predicateOrDefaultValue, defaultValue) {
    var odObj = createObjectForOrDefaultMethod(arguments);
    
    var index = -1;
    var lastItem = odObj.defaultValue;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        if (odObj.predicate(ctx.item, ctx.index, ctx)) {
            lastItem = ctx.item;
        }
    }

    return lastItem;
};

/**
 * Tries to return the maximum value of the sequence.
 *
 * @method max
 * 
 * @param any [defaultValue] The (default) value to return if sequence is empty.
 * 
 * @return any The maximum or the default value.
 */
enumerableMethods.max = function(defaultValue) {
    return this.aggregate(function(result, x) {
        if (x > result) {
            result = x;
        }
        
        return result;
    }, defaultValue);
};

/**
 * Tries to return the minimum value of the sequence.
 *
 * @method min
 * 
 * @param any [defaultValue] The (default) value to return if sequence is empty.
 * 
 * @return any The minimum or the default value.
 */
enumerableMethods.min = function(defaultValue) {
    return this.aggregate(function(result, x) {
        if (x < result) {
            result = x;
        }
        
        return result;
    }, defaultValue);
};

/**
 * Returns elements of a specific type.
 *
 * @method ofType
 * 
 * @param {String} type The type.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.ofType = function(type) {
    return this.where(function(x) {
        return typeof x == type;
    });
};

/**
 * Sorts the elements of that sequence in ascending order.
 * 
 * @param any selector The key selector.
 * @param any [comparer] The custom key comparer to use.
 * 
 * @throws At least one argument is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.orderBy = function(selector, comparer) {
    comparer = toComparerSafe(comparer);
    
    if (true === selector) {
        selector = function(x) {
            return x;
        };
    }
    
    selector = asFunc(selector);

    var originalArray = this.toArray();
    
    var sortedItems = originalArray.map(function(x) {
        return {
            sortBy: selector(x),
            value: x
        };
    }).sort(function(x, y) {
        return comparer(x.sortBy, y.sortBy);
    }).map(function(x) {
        return x.value;
    });

    var orderedEnumerable = fromArray(sortedItems);
    setupOrderedEnumerable(orderedEnumerable, {
        selector: selector,
        comparer: comparer,
        originalItems: originalArray
    });                                       
    
    return orderedEnumerable;
};

/**
 * Sorts the elements of that sequence in descending order.
 * 
 * @param any selector The key selector.
 * @param any [comparer] The custom key comparer to use.
 * 
 * @throws At least one argument is invalid.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.orderByDescending = function(selector, comparer) {
    comparer = toComparerSafe(comparer);
    
    return this.orderBy(selector,
                        function(x, y) {
                            return comparer(y, x);
                        });
};

/**
 * Reverses the order of the elements.
 *
 * @method reverse
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.reverse = function() {
    var reverseItems = [];
    while (this.moveNext()) {
        reverseItems.unshift(this.current);
    }
    
    return fromArray(reverseItems);
};

/**
 * Projects the elements of that sequence to new values.
 *
 * @method select
 * 
 * @param {Function} selector The selector.
 *
 * @throws Selector is no valid value for use as function.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.select = function(selector) {
    this.__6C0F8FF9E35 = asFunc(selector);
    return this;
};

/**
 * Projects the elements of that sequence to new sequences that converted to one flatten sequence.
 *
 * @method selectMany
 * 
 * @param {Function} selector The selector.
 * 
 * @throws Selector is no valid value for use as function.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.selectMany = function(selector) {
    selector = asFunc(selector);
    
    var flattenItems = [];
    
    while (this.moveNext()) {
        var items = asEnumerable(selector(this.current));
        
        while (items.moveNext()) {
            flattenItems.push(items.current);
        }
    }
    
    return fromArray(flattenItems);
};

/**
 * Checks if that sequence has the same elements as another one.
 *
 * @method take
 * 
 * @param any other The other sequence.
 * @param any [equalityComparer] The custom equality comparer to use.
 * 
 * @throws Other sequence and/or equality comparer are invalid values.
 * 
 * @return {Boolean} Both sequences are the same or not
 */
enumerableMethods.sequenceEqual = function(other, equalityComparer) {
    other = asEnumerable(other);
    equalityComparer = toEqualityComparerSafe(equalityComparer);
    
    while (this.moveNext()) {
        var x = this.current;
        
        if (!other.moveNext()) {
            return false;
        }
        
        var y = other.current;
        
        if (!equalityComparer(x, y)) {
            return false;
        }
    }
    
    if (other.moveNext()) {
        return false;
    }
    
    return true;
};

/**
 * Returns the one and only element of the sequence.
 *
 * @method single
 * 
 * @param {Function} [predicate] The custom condition to use.
 * 
 * @throws Sequence contains more than one matching element or no element.
 * 
 * @return any The only (matching) element or the default value.
 */
enumerableMethods.single = function(predicate) {
    predicate = toPredicateSafe(predicate);

    var item;
    var found = false;
    while (this.moveNext()) {
        if (predicate(this.current)) {
            if (found) {
                throw "Sequence contains more that one matching element!";
            }
            
            item = this.current;
            found = true;
        }
    }
    
    if (!found) {
        throw "Sequence contains NO element!";
    }

    return item;
};

/**
 * Tries to return the one and only element of the sequence.
 *
 * @method singleOrDefault
 * 
 * @param {Function} [predicateOrDefaultValue] The custom condition to use.
 *                                             If only one argument is defined and that value is NO function it will be handled as default value.  
 * @param any [defaultValue] The (default) value to return if no matching element was found.
 * 
 * @throws Sequence contains more than one matching element.
 * 
 * @return any The only (matching) element or the default value.
 */
enumerableMethods.singleOrDefault = function(predicateOrDefaultValue, defaultValue) {
    var odObj = createObjectForOrDefaultMethod(arguments);
    
    var item = odObj.defaultValue;
    
    var found = false;
    while (this.moveNext()) {
        if (odObj.predicate(this.current)) {
            if (found) {
                throw "Sequence contains more that one matching element!";
            }
            
            item = this.current;
            found = true;
        }
    }

    return item;
};

/**
 * Skips a number of elements.
 *
 * @method skip
 * 
 * @param {Number} cnt The number of elements to skip.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.skip = function(cnt) {
    return this.skipWhile(function() {
        if (cnt > 0) {
            --cnt;
            return true;
        }    
        
        return false;
    });
};

/**
 * Skips elements of that sequence while a condition matches.
 *
 * @method skipWhile
 * 
 * @param {Function} predicate The condition to use.
 * 
 * @throws Predicate is no valid value.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.skipWhile = function(predicate) {
    var predicate = asFunc(predicate);
    
    var newItems = [];
    
    var index = -1;
    var flag = false;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        if (!flag && !predicate(ctx.item, ctx.index, ctx)) {
            flag = true;
        }
        
        if (flag) {
            newItems.push(ctx.item);
        }
    }
    
    return fromArray(newItems);
};

/**
 * Calculates the sum of the elements.
 *
 * @method sum
 * 
 * @param any defaultValue The value to return if sequence is empty.
 * 
 * @return any The sum or the default value.
 */
enumerableMethods.sum = function(defaultValue) {
    return this.aggregate(function(result, x) {
        return result + x;
    }, defaultValue);
};

/**
 * Takes a number of elements.
 *
 * @method take
 * 
 * @param {Number} cnt The number of elements to take.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.take = function(cnt) {
    return this.takeWhile(function() {
        if (cnt > 0) {
            --cnt;
            return true;
        }    
        
        return false;
    });
};

/**
 * Takes elements while a condition matches.
 *
 * @method takeWhile
 * 
 * @param {Function} predicate The condition to use.
 * 
 * @throws Predicate is no valid value.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.takeWhile = function(predicate) {
    var predicate = asFunc(predicate);
    
    var newItems = [];
    
    var index = -1;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        if (!predicate(ctx.item, ctx.index, ctx)) {
            break;
        }
        
        newItems.push(ctx.item);
    }
    
    return fromArray(newItems);
};

/**
 * Returns the elements of that sequence as array.
 * 
 * @return {Array} The sequence as new array.
 */
enumerableMethods.toArray = function() {
    var arr = [];
    while (this.moveNext()) {
        arr.push(this.current);
    }
    
    return arr;
};

/**
 * Produces the set union of that sequence and another.
 * 
 * @param any second The second sequence.
 * @param {Function} [equalityComparer] The custom equality comparer to use.
 * 
 * @throws Sequence or equality comparer are no valid values.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.union = function(second, equalityComparer) {
    return this.concat(second)
               .distinct(equalityComparer);
};

/**
 * Filters the elements of that sequence.
 * 
 * @param {Function} predicate The predicate to use.
 * 
 * @throws Predicate is no valid function / lambda expression.
 * 
 * @return {Array} The sequence as new array.
 */
enumerableMethods.where = function(predicate) {
    predicate = asFunc(predicate);

    var filteredItems = [];
    
    var index = -1;
    while (this.moveNext()) {
        var ctx = createEnumerableContext(this, ++index);
        
        if (predicate(ctx.item, ctx.index, ctx)) {
            filteredItems.push(ctx.item);
        }
    }
    
    return fromArray(filteredItems);
};

/**
 * Applies a specified function to the corresponding elements of that sequence
 * and another, producing a sequence of the results.
 * 
 * @param any second The second sequence.
 * @param {Function} selector The selector for the combined result items of the elements of the two sequences.
 * 
 * @throws Sequence or selector are no valid values.
 * 
 * @return {Object} The new sequence.
 */
enumerableMethods.zip = function(second, selector) {
    second = asEnumerable(second);
    selector = asFunc(selector);
    
    var zippedItems = [];
    
    var index = -1;
    while (this.moveNext() && second.moveNext()) {
        ++index;
        
        var ctx1 = createEnumerableContext(this, index);
        var ctx2 = createEnumerableContext(second, index);
        
        var zipped = selector(ctx1.item, ctx2.item,
                              index,
                              ctx1, ctx2);
                              
        zippedItems.push(zipped);
    }
    
    return fromArray(zippedItems);
};


// ---------- ordered enumerable method templates ----------

/**
 * Performs a subsequent ordering of the elements in that sequence in ascending order, according to a key.
 * 
 * @param any selector The key selector.
 * @param any [comparer] The custom key comparer to use.
 * 
 * @throws At least one argument is invalid.
 * 
 * @return {Object} The new sequence.
 */
orderedEnumerableMethods.thenBy = function(selector, comparer) {
    comparer = toComparerSafe(comparer);
    
    if (true === selector) {
        selector = function(x) {
            return x;
        };
    }

    selector = asFunc(selector);
    var thisSelector = this.__0CDF3D959A20;
    
    var thisComparer = this.__559048F1;
    
    return fromArray(this.__A922635A1BF2)
        .orderBy(function(x) {
                     var orderData = {};
                     orderData.level_0 = thisSelector(x);
                     orderData.level_1 = selector(x);
                     
                     return orderData;
                 },
                 function(x, y) {
                     var comp0 = thisComparer(x.level_0, y.level_0);
                     if (0 != comp0) {
                         return comp0;
                     }
                     
                     var comp1 = comparer(x.level_1, y.level_1);
                     if (0 != comp1) {
                         return comp1;
                     }
                     
                     return 0;
                 });
};

/**
 * Performs a subsequent ordering of the elements in that sequence in descending order, according to a key.
 * 
 * @param any selector The key selector.
 * @param any [comparer] The custom key comparer to use.
 * 
 * @throws At least one argument is invalid.
 * 
 * @return {Object} The new sequence.
 */
orderedEnumerableMethods.thenByDescending = function(selector, comparer) {
    comparer = toComparerSafe(comparer);
    
    return this.thenByDescending(selector,
                                 function(x, y) {
                                     return comparer(y, x);
                                 });
};

/*

TODOs:

cast()

*/