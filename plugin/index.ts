// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

import {Observable} from "data/observable";
import {ObservableArray} from "data/observable-array";

var orderedEnumerableMethods : any = {};

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
export function asFunc(v: any, throwException?: boolean) {
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
        
        var func;
        eval('func = function(' + matches[3] + ') { ' + lambdaBody + ' };');
        
        return func;
    }
    
    if (throwException) {
        throw "'" + v + "' is NO valid lambda expression!";
    }
    
    return false;
}

interface IOrDefaultMethodContext {
    predicate: (item: any, index: number, ctx: IEnumerableContext) => boolean;
    defaultValue?: any;
}

function createObjectForOrDefaultMethod(args) : IOrDefaultMethodContext {
    var odObj = {
        predicate: function() { return true; },
        defaultValue: undefined
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
export function toComparerSafe(comparer) {
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
}

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
export function toEqualityComparerSafe(equalityComparer) {
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
export function toPredicateSafe(predicate) {
    if (!predicate) {
        predicate = function() { return true; };
    }
    
    return asFunc(predicate);
}

export interface IEnumerableContext {
    index: number;
    item: any;
    key: any;
    sequence: IEnumerable;
}

function createEnumerableContext(enumerable, index) {
    return {
        index: index,
        item: enumerable.current,
        key: enumerable.itemKey,
        sequence: enumerable
    };
}

function setupEnumerable(enumerable, opts) {
    enumerable.currentFunc = function() {
        var c = opts.current();
        
        if (enumerable.__6C0F8FF9E35) {
            // use inner selector
            return enumerable.__6C0F8FF9E35(c);
        }
        
        return c;
    };
    
    enumerable.isValidFunc = opts.isValid;

    Object.defineProperty(enumerable, 'itemKey', {
        get: opts.key
    });
    
    enumerable.moveNextFunc = opts.moveNext;
    enumerable.reset = function() {
        opts.reset();
        return enumerable;
    };
}

function setupOrderedEnumerable(orderedEnumerable, opts) {
    for (var p in orderedEnumerableMethods) {
        if (orderedEnumerableMethods.hasOwnProperty(p)) {
            orderedEnumerable[p] = orderedEnumerableMethods[p];    
        }
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
 * @return {Sequence} The new sequence.
 */
function fromArray(arr) : IEnumerable {
    if (arguments.length < 1) {
        arr = [];
    }
    
    var enumerable : any = new Sequence();
    
    var index;
    var opts = {
        current: undefined,
        key: function() { return index; },

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
    };
    
    if (arr instanceof ObservableArray) {
        opts.current = function() { return arr.getItem(index); };
    }
    else {
        opts.current = function() { return arr[index]; };
    }
    
    setupEnumerable(enumerable, opts);
    
    return enumerable;
}
exports.fromArray = fromArray;

/**
 * Creates a new sequence from an object.
 *
 * @function fromObject
 * 
 * @param {Object} obj The object.
 * 
 * @return {Sequence} The new sequence.
 */
function fromObject(obj) {
    if (arguments.length < 1) {
        obj = {};
    }
    
    var enumerable = new Sequence();
    
    var properties = [];
    for (var p in obj) {
        properties.push(p);
    }
    
    var index;
    setupEnumerable(enumerable, {
        current: function() {
            return obj[properties[index]];
        },
        
        isValid: function() {
            if (properties.length < 1) {
                return false;
            }
            
            var i = index;
            if (i === undefined) {
                i = 0;
            }
            
            return properties.length - i > 0;
        },
        
        key: function() { return properties[index]; },
        
        moveNext: function() {
            if (index === undefined) {
                index = -1;
            }
            
            return ++index < properties.length;
        },
        
        reset: function() { index = undefined; }
    });
    
    return enumerable;
}
exports.fromObject = fromObject;

/**
 * Creates a new sequence from a list of items.
 *
 * @function create
 * 
 * @param {Array} arr The array.
 * 
 * @return {Sequence} The new sequence.
 */
function create() {
    return fromArray(arguments);
}
exports.create = create;

/**
 * Creates a sequence with a range of items.
 *
 * @function repeat
 * 
 * @param any start The start value.
 * @param {Number} cnt The number of items to return.
 * @param any [incrementor] The custom function (or value) that increments the current value.
 * 
 * @return {Object} The new sequence.
 */
function range(start, cnt, incrementor) {
    incrementor = asFunc(incrementor, false);
    if (false === incrementor) {
        var incrementBy = incrementor;
        
        incrementor = function(x) {
            return x + incrementBy;
        };
    }
    else if (!incrementor) {
        incrementor = function(x) {
            return x + 1;
        };
    }
    
    var numbers = [];
    
    var remainingCnt = cnt;
    var val = start;
    while (remainingCnt > 0) {
        numbers.push(val);
        
        val = incrementor(val, {
            remainingCount: remainingCnt,
            startValue: start,
            totalCount: cnt
        });
        
        --remainingCnt;
    }
    
    return fromArray(numbers);
}
exports.range = range;

/**
 * Creates a sequence with a number of specific values.
 *
 * @function repeat
 * 
 * @param any v The value.
 * @param {Number} cnt The number of items to return.
 * 
 * @return {Object} The new sequence.
 */
function repeat(v, cnt) {
    var items = [];

    while (cnt > 0) {
        items.push(v);
        --cnt;
    }
    
    return fromArray(items);
}
exports.repeat = repeat;

/**
 * Checks if a value is a sequence.
 *
 * @function isEnumerable
 * 
 * @param any v The value to check.
 * 
 * @return {Boolean} Is sequence or not.
 */
export function isEnumerable(v) {
    return v instanceof Sequence;
}

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
export function asEnumerable(v: any, throwException?: boolean) {
    if ((v instanceof Array) || 
        (v instanceof ObservableArray) ||
        !v) {
        
        return fromArray(v);
    }
    
    if (isEnumerable(v)) {
        return v;
    }
    
    if (typeof v === 'string') {
        var charArray = [];
        for (var i = 0; i < v.length; i++) {
            charArray.push(v[i]);
        }
        
        return fromArray(charArray);
    }
    
    if (typeof v === 'object') {
        return fromObject(v);
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

/**
 * Short hand version for 'each' method of a sequence.
 *
 * @function each
 * 
 * @param any items The sequence of items to iterate.
 * @param any action The action to invoke for each item.
 * 
 * @throws At least one argument is invalid.
 * 
 * @return any The result of the last invocation.
 */
export function each(items, action) {
    return asEnumerable(items).each(action);
}
exports.each = each;


// ---------- enumerable method templates (Sequence) ----------

export interface IEnumerable {
    current: any;
    distinct(equalityComparer: any) : IEnumerable;
    each(action: any) : any;
    isValid: boolean;
    moveNext(): boolean;
    orderBy(selector: any, comparer?: any) : IOrderedEnumerable;
}

export interface IOrderedEnumerable extends IEnumerable {
}

class Sequence implements IEnumerable {
    protected __6C0F8FF9E35: (item: any) => any;

    public currentFunc: () => any;
    public get current() : any {
        return this.currentFunc();
    }
    
    public isValidFunc: () => boolean;
    public get isValid() : boolean {
        return this.isValidFunc();
    }
    
    public moveNextFunc: () => boolean;
    public moveNext() : boolean {
        return this.moveNextFunc();
    }
    

    /**
     * Checks if all elements of the sequence match a condition.
     *
     * @method all
     * 
     * @param {Function} predicate The condition.
     * 
     * @return {Boolean} All items match condition or not. If sequence is empty (true) is returned.
     */
    public all(predicate) {
        predicate = asFunc(predicate);
        
        while (this.moveNext()) {
            if (!predicate(this.current)) {
                return false;
            }
        }
        
        return true;
    }

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
    public any(predicate) {
        predicate = toPredicateSafe(predicate);
        
        while (this.moveNext()) {
            if (predicate(this.current)) {
                return true;
            }
        }
        
        return false;
    }

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
    public aggregate(accumulator, defaultValue) {
        accumulator = asFunc(accumulator);
        
        var index = -1;
        var aggResult = defaultValue;
        var isFirst = true;
        while (this.moveNext()) {
            var ctx = createEnumerableContext(this, ++index);
            
            if (!isFirst) {
                aggResult = accumulator(aggResult,
                                        ctx.item, ctx.index, ctx);
            }
            else {
                aggResult = ctx.item;
                isFirst = false;
            }
        }
        
        return aggResult;
    }

    /**
     * Computes the average of that sequence.
     *
     * @method average
     * 
     * @param any [defaultValue] The (default) value to return if sequence is empty.
     * 
     * @return any The average of the sequence or the default value.
     */
    public average(defaultValue) {
        var cnt = 0;
        var sum = 0;
        while (this.moveNext()) {
            sum += parseFloat(this.current);        
            ++cnt;
        }
        
        return cnt > 0 ? sum / cnt
                       : defaultValue;
    }

    /**
     * Casts all items to a specific type.
     *
     * @method cast
     * 
     * @param {String} type The target type.
     * 
     * @return any The new sequence with the casted items.
     */
    public cast(type) {
        if (type !== null) {
            if (type === undefined) {
                type = "";
            }
            else {
                type = ("" + type).replace(/^\s+|\s+$/gm, '');
            }
        }
        
        return this.select(function(x) {        
            if (typeof x === type) {
                return x;
            }
            
            if (type === null) {
                return null;
            }
            
            switch (type) {
                case '':
                    return x;
                    
                case 'null':
                    return null;
                
                case 'undefined':
                    return undefined;
                
                case 'number':
                    if (!x) {
                        return 0.0;    
                    }
                    if (!isNaN(x)) {
                        return x;
                    }
                    return parseFloat(x);
                    
                case 'float':
                    if (!x) {
                        return 0.0;    
                    }
                    return parseFloat(x);
                
                case 'int':
                case 'integer':
                    if (!x) {
                        return 0;    
                    }
                    return parseInt(x);
                    
                case 'str':
                case 'string':
                    if (!x) {
                        return "";
                    }
                    return "" + x;
                    
                case 'enumerable':
                case 'seq':
                case 'sequence':
                    return asEnumerable(x);
                    
                case 'array':
                case 'Array':
                    return asEnumerable(x).toArray();
                
                case 'Observable':
                case 'observable':
                    return asEnumerable(x).toObservable();
                    
                case 'observablearray':
                case 'observableArray':
                case 'ObservableArray':
                    return asEnumerable(x).toObservableArray();
                    
                case 'bool':
                case 'boolean':
                    return x ? true : false;
                    
                case 'func':
                case 'function':
                    return function() { return x; };
                
                default:
                    throw "Cannot not cast '" + x + "' to '" + type + "'!";
            }
        });
    }

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
    public concat(second) {
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
    }

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
    public contains(item, equalityComparer) {
        equalityComparer = toEqualityComparerSafe(equalityComparer);
        
        return this.any(function(x) {
            return equalityComparer(x, item);
        });
    }

    /**
     * Returns the number of elements.
     *
     * @method count
     * 
     * @param {Function} [predicate] The custom condition to use.
     * 
     * @return {Number} The number of (matching) elements.
     */
    public count(predicate) {
        predicate = toPredicateSafe(predicate);

        var cnt = 0;
        while (this.moveNext()) {
            if (predicate(this.current)) {
                ++cnt;    
            }
        }
        
        return cnt;
    }

    /**
     * Returns a default sequence if that sequence is empty.
     *
     * @method defaultIfEmpty
     * 
     * @param ...any [defaultItem] One or more items for the default sequence.
     * 
     * @return {Object} A default sequence or that sequence if it is not empty.
     */
    public defaultIfEmpty() {
        if (!this.isValid) {
            return fromArray(arguments);
        }
        
        return this;
    }

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
    public distinct(equalityComparer: any) : IEnumerable {
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
    }


    /**
     * Iterates over the elements of that sequence.
     *
     * @method each
     * 
     * @param {Function} action The callback that is executed for an item.
     * 
     * @return any The result of the last execution.
     */
    public each(action: any) : any {
        var index = -1;
        var result;
        while (this.moveNext()) {
            var ctx = createEnumerableContext(this, ++index);
            
            result = action(ctx.item, ctx.index, ctx);
        }
        
        return result;
    }

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
    public elementAt(index) {
        return this.first(function(x, i) {
            return i == index;
        });
    }

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
    public elementAtOrDefault(index, defaultValue) {
        return this.firstOrDefault(function(x, i) {
            return i == index;
        }, defaultValue);
    }

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
    public except(second, equalityComparer) {
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
    }

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
    public first(predicate) {
        predicate = toPredicateSafe(predicate);
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = createEnumerableContext(this, ++index);
            
            if (predicate(ctx.item, ctx.index, ctx)) {
                return ctx.item;
            }
        }
        
        throw "Sequence contains NO element!";
    }

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
    public firstOrDefault(predicateOrDefaultValue, defaultValue) {
        var odObj = createObjectForOrDefaultMethod(arguments);
        
        var index = -1;
        while (this.moveNext()) {
            var ctx = createEnumerableContext(this, ++index);
            
            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                return ctx.item;
            }
        }
        
        return odObj.defaultValue;
    }

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
    public groupBy(keySelector, keyEqualityComparer) {
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
            var grouping = <any>fromArray(x.values);
            grouping.key = x.key;
            
            return grouping;
        }));
    }

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
    public groupJoin(inner,
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
    }

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
    public intersect(second, equalityComparer) {
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
    }

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
    public join(inner,
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
    }

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
    public last(predicate) {
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
    }

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
    public lastOrDefault(predicateOrDefaultValue, defaultValue) {
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
    }

    /**
     * Tries to return the maximum value of the sequence.
     *
     * @method max
     * 
     * @param any [defaultValue] The (default) value to return if sequence is empty.
     * 
     * @return any The maximum or the default value.
     */
    public max(defaultValue) {
        return this.aggregate(function(result, x) {
            if (x > result) {
                result = x;
            }
            
            return result;
        }, defaultValue);
    }

    /**
     * Tries to return the minimum value of the sequence.
     *
     * @method min
     * 
     * @param any [defaultValue] The (default) value to return if sequence is empty.
     * 
     * @return any The minimum or the default value.
     */
    public min(defaultValue) {
        return this.aggregate(function(result, x) {
            if (x < result) {
                result = x;
            }
            
            return result;
        }, defaultValue);
    }

    /**
     * Returns elements of a specific type.
     *
     * @method ofType
     * 
     * @param {String} type The type.
     * 
     * @return {Object} The new sequence.
     */
    public ofType(type) {
        type = ("" + type).replace(/^\s+|\s+$/gm, '');
        
        var checkType = function(x) {
            return typeof x === type;    
        };
        
        switch (type) {
            case 'bool':
                type = 'boolean';
                break;
                
            case 'float':
            case 'int':
            case 'integer':
                type = 'number';
                break;
                
            case 'str':
                type = 'string';
                break;
                
            case 'enumerable':
            case 'seq':
            case 'sequence':
                checkType = function(x) {
                    return isEnumerable(x);
                };
                break;
        }
        
        return this.where(checkType);
    }

    /**
     * Sorts the elements of that sequence in ascending order by using the values itself as keys.
     * 
     * @method order
     * 
     * @param any [comparer] The custom key comparer to use.
     * 
     * @throws The comparer is invalid.
     * 
     * @return {Object} The new sequence.
     */
    public order(comparer) {
        return this.orderBy('x => x', comparer);
    }

    /**
     * Sorts the elements of that sequence in ascending order.
     *
     * @method orderBy
     * 
     * @param any selector The key selector.
     * @param any [comparer] The custom key comparer to use.
     * 
     * @throws At least one argument is invalid.
     * 
     * @return {Object} The new sequence.
     */
    public orderBy(selector: any, comparer?: any) : IOrderedEnumerable {
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

        var orderedEnumerable : any = fromArray(sortedItems);
        setupOrderedEnumerable(orderedEnumerable, {
            selector: selector,
            comparer: comparer,
            originalItems: originalArray
        });                                       
        
        return orderedEnumerable;
    }

    /**
     * Sorts the elements of that sequence in descending order by using the values as keys.
     *
     * @method orderDescending
     * 
     * @param any [comparer] The custom key comparer to use.
     * 
     * @throws The comparer is invalid.
     * 
     * @return {Object} The new sequence.
     */
    public orderDescending(comparer) {
        return this.orderByDescending('x => x', comparer);
    }

    /**
     * Sorts the elements of that sequence in descending order.
     *
     * @method orderByDescending
     * 
     * @param any selector The key selector.
     * @param any [comparer] The custom key comparer to use.
     * 
     * @throws At least one argument is invalid.
     * 
     * @return {Object} The new sequence.
     */
    public orderByDescending(selector, comparer) {
        comparer = toComparerSafe(comparer);
        
        return this.orderBy(selector,
                            function(x, y) {
                                return comparer(y, x);
                            });
    }

    /**
     * Reverses the order of the elements.
     *
     * @method reverse
     * 
     * @return {Object} The new sequence.
     */
    public reverse() {
        var reverseItems = [];
        while (this.moveNext()) {
            reverseItems.unshift(this.current);
        }
        
        return fromArray(reverseItems);
    }

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
    public select(selector) {
        this.__6C0F8FF9E35 = asFunc(selector);
        return this;
    }

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
    public selectMany(selector) {
        selector = asFunc(selector);
        
        var flattenItems = [];
        
        while (this.moveNext()) {
            var items = asEnumerable(selector(this.current));
            
            while (items.moveNext()) {
                flattenItems.push(items.current);
            }
        }
        
        return fromArray(flattenItems);
    }

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
    public sequenceEqual(other, equalityComparer) {
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
    }

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
    public single(predicate) {
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
    }

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
    public singleOrDefault(predicateOrDefaultValue, defaultValue) {
        var odObj = createObjectForOrDefaultMethod(arguments);
        
        var item = odObj.defaultValue;
        
        var index = -1;
        var found = false;
        while (this.moveNext()) {
            var ctx = createEnumerableContext(this, ++index);
            
            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                if (found) {
                    throw "Sequence contains more that one matching element!";
                }
                
                item = this.current;
                found = true;
            }
        }

        return item;
    }

    /**
     * Skips a number of elements.
     *
     * @method skip
     * 
     * @param {Number} cnt The number of elements to skip.
     * 
     * @return {Object} The new sequence.
     */
    public skip(cnt) {
        return this.skipWhile(function() {
            if (cnt > 0) {
                --cnt;
                return true;
            }    
            
            return false;
        });
    }

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
    public skipWhile(predicate) {
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
    }

    /**
     * Calculates the sum of the elements.
     *
     * @method sum
     * 
     * @param any defaultValue The value to return if sequence is empty.
     * 
     * @return any The sum or the default value.
     */
    public sum(defaultValue) {
        return this.aggregate(function(result, x) {
            return result + x;
        }, defaultValue);
    }

    /**
     * Takes a number of elements.
     *
     * @method take
     * 
     * @param {Number} cnt The number of elements to take.
     * 
     * @return {Object} The new sequence.
     */
    public take(cnt) {
        return this.takeWhile(function() {
            if (cnt > 0) {
                --cnt;
                return true;
            }    
            
            return false;
        });
    }

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
    public takeWhile(predicate) {
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
    }

    /**
     * Returns the elements of that sequence as array.
     * 
     * @method toArray
     * 
     * @return {Array} The sequence as new array.
     */
    public toArray() {
        var arr = [];
        while (this.moveNext()) {
            arr.push(this.current);
        }
        
        return arr;
    }

    /**
     * Creates a new object from the items of that sequence.
     *
     * @method toObject
     * 
     * @param any [keySelector] The custom key selector to use.
     * 
     * @throws Key selector is invalid.
     * 
     * @return {Object} The new object.
     */
    public toObject(keySelector) {
        if (arguments.length < 1) {
            keySelector = function(item, index, key) {
                return key;
            };
        }
        
        keySelector = asFunc(keySelector);

        var obj = {};
        
        this.each(function(x, index, ctx) {
            var key = keySelector(x, index, ctx.key);
            
            obj[key] = x;
        });
        
        return obj;
    }

    /**
     * Creates a new observable object from the items of that sequence.
     *
     * @method toObservable
     * 
     * @param any [keySelector] The custom key selector to use.
     * 
     * @throws Key selector is invalid.
     * 
     * @return {Observable} The new object.
     */
    public toObservable(keySelector) : Observable {
        if (arguments.length < 1) {
            keySelector = function(item, index, key) {
                return key;
            };
        }
        
        keySelector = asFunc(keySelector);

        var ob = new Observable();
        
        this.each(function(x, index, ctx) {
            var key = keySelector(x, index, ctx.key);
            
            ob.set(key, x);
        });
        
        return ob;
    }

    /**
     * Creates a new observable array from the items of that sequence.
     *
     * @method toObservableArray
     * 
     * @return {ObservableArray} The new array.
     */
    public toObservableArray() : ObservableArray<any> {
        return new ObservableArray<any>(this.toArray());
    }

    /**
     * Creates a lookup object from the sequence.
     *
     * @method toLookup
     * 
     * @param any keySelector The group key selector.
     * @param any [keyEqualityComparer] The custom equality comparer for the keys to use. 
     * 
     * @throw At least one argument is invalid.
     * 
     * @return {Object} The lookup array.
     */
    public toLookup(keySelector, keyEqualityComparer) {
        var lu = {};
        this.groupBy(keySelector, keyEqualityComparer)
            .each(function(grouping) {
                      lu[grouping.key] = grouping;
                  });
        
        return lu;
    }

    /**
     * Produces the set union of that sequence and another.
     * 
     * @method union
     * 
     * @param any second The second sequence.
     * @param {Function} [equalityComparer] The custom equality comparer to use.
     * 
     * @throws Sequence or equality comparer are no valid values.
     * 
     * @return {Object} The new sequence.
     */
    public union(second, equalityComparer) {
        return this.concat(second)
                   .distinct(equalityComparer);
    }

    /**
     * Filters the elements of that sequence.
     * 
     * @method where
     * 
     * @param {Function} predicate The predicate to use.
     * 
     * @throws Predicate is no valid function / lambda expression.
     * 
     * @return {Array} The sequence as new array.
     */
    public where(predicate) {
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
    }

    /**
     * Applies a specified function to the corresponding elements of that sequence
     * and another, producing a sequence of the results.
     * 
     * @method zip
     * 
     * @param any second The second sequence.
     * @param {Function} selector The selector for the combined result items of the elements of the two sequences.
     * 
     * @throws Sequence or selector are no valid values.
     * 
     * @return {Object} The new sequence.
     */
    public zip(second, selector) {
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
    }
}

// ---------- ordered enumerable method templates ----------

/**
 * Performs a subsequent ordering of the elements in that sequence in ascending order,
 * using the values itself as keys.
 * 
 * @method then
 * 
 * @param any [comparer] The custom key comparer to use.
 * 
 * @throws The comparer is invalid.
 * 
 * @return {Object} The new sequence.
 */
orderedEnumerableMethods.then = function(comparer) {
    return this.thenBy('x => x', comparer);
};

/**
 * Performs a subsequent ordering of the elements in that sequence in ascending order, according to a key.
 * 
 * @method thenBy
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
                     return {
                        level_0: thisSelector(x),
                        level_1: selector(x)
                     };
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
 * @method thenByDescending
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
    
    return this.thenBy(selector,
                       function(x, y) {
                           return comparer(y, x);
                       });
};

/**
 * Performs a subsequent ordering of the elements in that sequence in descending order,
 * using the values as keys.
 * 
 * @method thenDescending
 * 
 * @param any [comparer] The custom key comparer to use.
 * 
 * @throws The comparer is invalid.
 * 
 * @return {Object} The new sequence.
 */
orderedEnumerableMethods.thenDescending = function(selector, comparer) {
    return this.thenByDescending('x => x', comparer);
};
