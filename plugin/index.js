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
"use strict";
var observable_1 = require("data/observable");
var observable_array_1 = require("data/observable-array");
var TypeUtils = require("utils/types");
var virtual_array_1 = require("data/virtual-array");
/**
 * Regular expression for trimming a string
 * at the beginning and the end.
 */
exports.REGEX_TRIM = /^\s+|\s+$/gm;
/**
 * A basic sequence.
 */
var Sequence = (function () {
    function Sequence() {
    }
    /** @inheritdoc */
    Sequence.prototype.aggregate = function (accumulator, defaultValue) {
        var acc = asFunc(accumulator);
        var index = -1;
        var aggResult = defaultValue;
        var isFirst = true;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (!isFirst) {
                aggResult = acc(aggResult, ctx.item, ctx.index, ctx);
            }
            else {
                aggResult = ctx.item;
                isFirst = false;
            }
        }
        return aggResult;
    };
    /** @inheritdoc */
    Sequence.prototype.all = function (predicate) {
        var p = asFunc(predicate);
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (!p(ctx.item, ctx.index, ctx)) {
                return false;
            }
        }
        return true;
    };
    /** @inheritdoc */
    Sequence.prototype.any = function (predicate) {
        var p = toPredicateSafe(predicate);
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (p(ctx.item, ctx.index, ctx)) {
                return true;
            }
        }
        return false;
    };
    /** @inheritdoc */
    Sequence.prototype.average = function (defaultValue) {
        var cnt = 0;
        var sum = 0;
        while (this.moveNext()) {
            sum += parseFloat("" + this.current);
            ++cnt;
        }
        return cnt > 0 ? (sum / cnt)
            : defaultValue;
    };
    /** @inheritdoc */
    Sequence.prototype.cast = function (type) {
        if (type !== null) {
            if (TypeUtils.isUndefined(type)) {
                type = "";
            }
            else {
                type = type.replace(exports.REGEX_TRIM, '');
            }
        }
        return this.select(function (x) {
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
                    return function () { return x; };
                default:
                    throw "Cannot not cast '" + x + "' to '" + type + "'!";
            }
        });
    };
    /** @inheritdoc */
    Sequence.prototype.concat = function (second) {
        var newItems = [];
        var appendItems = function (seq) {
            while (seq.moveNext()) {
                newItems.push(seq.current);
            }
        };
        appendItems(this);
        appendItems(asEnumerable(second));
        return fromArray(newItems);
    };
    /** @inheritdoc */
    Sequence.prototype.contains = function (item, equalityComparer) {
        var ec = toEqualityComparerSafe(equalityComparer);
        return this.any(function (x) { return ec(x, item); });
    };
    /** @inheritdoc */
    Sequence.prototype.count = function (predicate) {
        var p = toPredicateSafe(predicate);
        var index = -1;
        var cnt = 0;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (p(ctx.item, ctx.index, ctx)) {
                ++cnt;
            }
        }
        return cnt;
    };
    Object.defineProperty(Sequence.prototype, "current", {
        /** @inheritdoc */
        get: function () {
            return this.selectInner(this.getCurrent());
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    Sequence.prototype.defaultIfEmpty = function () {
        var defaultItems = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            defaultItems[_i - 0] = arguments[_i];
        }
        if (!this.isValid) {
            return fromArray(arguments);
        }
        return this;
    };
    /** @inheritdoc */
    Sequence.prototype.distinct = function (equalityComparer) {
        var ec = toEqualityComparerSafe(equalityComparer);
        var distinctedItems = [];
        while (this.moveNext()) {
            var curItem = this.current;
            var alreadyInList = false;
            for (var i = 0; i < distinctedItems.length; i++) {
                if (ec(curItem, distinctedItems[i])) {
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
    /** @inheritdoc */
    Sequence.prototype.each = function (action) {
        var a = asFunc(action);
        var index = -1;
        var result;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            result = a(ctx.item, ctx.index, ctx);
        }
        return result;
    };
    /** @inheritdoc */
    Sequence.prototype.elementAt = function (index) {
        return this.first(function (x, i) {
            return i == index;
        });
    };
    /** @inheritdoc */
    Sequence.prototype.elementAtOrDefault = function (index, defaultValue) {
        return this.firstOrDefault(function (x, i) {
            return i == index;
        }, defaultValue);
    };
    /** @inheritdoc */
    Sequence.prototype.except = function (second, equalityComparer) {
        var ec = toEqualityComparerSafe(equalityComparer);
        second = asEnumerable(second).distinct(ec)
            .toArray();
        var newItems = [];
        while (this.moveNext()) {
            var curItem = this.current;
            var found = false;
            for (var i = 0; i < second.length; i++) {
                var secondItem = second[i];
                if (ec(curItem, secondItem)) {
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
    /** @inheritdoc */
    Sequence.prototype.first = function (predicate) {
        var p = toPredicateSafe(predicate);
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (p(ctx.item, ctx.index, ctx)) {
                return ctx.item;
            }
        }
        throw "Sequence contains NO element!";
    };
    /** @inheritdoc */
    Sequence.prototype.firstOrDefault = function (predicateOrDefaultValue, defaultValue) {
        var odObj = createObjectForOrDefaultMethod(arguments);
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                return ctx.item;
            }
        }
        return odObj.defaultValue;
    };
    /** @inheritdoc */
    Sequence.prototype.groupBy = function (keySelector, keyEqualityComparer) {
        var ks = asFunc(keySelector);
        var kc = toEqualityComparerSafe(keyEqualityComparer);
        var index = -1;
        var groupList = [];
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            var key = ks(ctx.item, ctx.index, ctx);
            var grp = null;
            for (var i = 0; i < groupList.length; i++) {
                var g = groupList[i];
                if (kc(g.key, key)) {
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
        return fromArray(groupList.map(function (x) {
            return new Grouping(x.key, asEnumerable(x.values));
        }));
    };
    /** @inheritdoc */
    Sequence.prototype.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, keyEqualityComparer) {
        inner = asEnumerable(inner);
        var rc = asFunc(resultSelector);
        var kc = toEqualityComparerSafe(keyEqualityComparer);
        var createGroupsForSequence = function (seq, keySelector) {
            return seq.groupBy(keySelector)
                .select(function (grouping) {
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
                if (!kc(outerGrp.key, innerGrp.key)) {
                    continue;
                }
                for (var iii = 0; iii < outerGrp.values.length; iii++) {
                    joinedItems.push(rc(outerGrp.values[iii], fromArray(innerGrp.values)));
                }
            }
        }
        return fromArray(joinedItems);
    };
    /** @inheritdoc */
    Sequence.prototype.intersect = function (second, equalityComparer) {
        var ec = toEqualityComparerSafe(equalityComparer);
        second = asEnumerable(second).distinct(ec)
            .toArray();
        var newItems = [];
        while (this.moveNext()) {
            var curItem = this.current;
            for (var i = 0; i < second.length; i++) {
                var secondItem = second[i];
                if (ec(curItem, secondItem)) {
                    newItems.push(curItem);
                    break;
                }
            }
        }
        return fromArray(newItems);
    };
    /** @inheritdoc */
    Sequence.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, keyEqualityComparer) {
        inner = asEnumerable(inner);
        var rc = asFunc(resultSelector);
        var kc = toEqualityComparerSafe(keyEqualityComparer);
        var createGroupsForSequence = function (seq, keySelector) {
            return seq.groupBy(keySelector)
                .select(function (grouping) {
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
                if (!kc(outerGrp.key, innerGrp.key)) {
                    continue;
                }
                for (var iii = 0; iii < outerGrp.values.length; iii++) {
                    for (var iv = 0; iv < innerGrp.values.length; iv++) {
                        joinedItems.push(rc(outerGrp.values[iii], innerGrp.values[iv]));
                    }
                }
            }
        }
        return fromArray(joinedItems);
    };
    /** @inheritdoc */
    Sequence.prototype.last = function (predicate) {
        var p = toPredicateSafe(predicate);
        var index = -1;
        var lastItem;
        var found = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (p(ctx.item, ctx.index, ctx)) {
                lastItem = ctx.item;
                found = true;
            }
        }
        if (!found) {
            throw "Sequence contains NO element!";
        }
        return lastItem;
    };
    /** @inheritdoc */
    Sequence.prototype.lastOrDefault = function (predicateOrDefaultValue, defaultValue) {
        var odObj = createObjectForOrDefaultMethod(arguments);
        var index = -1;
        var lastItem = odObj.defaultValue;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                lastItem = ctx.item;
            }
        }
        return lastItem;
    };
    /** @inheritdoc */
    Sequence.prototype.max = function (defaultValue) {
        return this.aggregate(function (result, x) {
            if (x > result) {
                result = x;
            }
            return result;
        }, defaultValue);
    };
    /** @inheritdoc */
    Sequence.prototype.min = function (defaultValue) {
        return this.aggregate(function (result, x) {
            if (x < result) {
                result = x;
            }
            return result;
        }, defaultValue);
    };
    /** @inheritdoc */
    Sequence.prototype.ofType = function (type) {
        type = type.replace(exports.REGEX_TRIM, '');
        var checkType = function (x) {
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
                checkType = function (x) {
                    return isEnumerable(x);
                };
                break;
        }
        return this.where(checkType);
    };
    /** @inheritdoc */
    Sequence.prototype.order = function (comparer) {
        return this.orderBy('x => x', comparer);
    };
    /** @inheritdoc */
    Sequence.prototype.orderBy = function (selector, comparer) {
        return new OrderedSequence(this, selector, comparer);
    };
    /** @inheritdoc */
    Sequence.prototype.orderByDescending = function (selector, comparer) {
        var c = toComparerSafe(comparer);
        return this.orderBy(selector, function (x, y) {
            return c(y, x);
        });
    };
    /** @inheritdoc */
    Sequence.prototype.orderDescending = function (comparer) {
        return this.orderByDescending('x => x', comparer);
    };
    /** @inheritdoc */
    Sequence.prototype.reverse = function () {
        var reverseItems = [];
        while (this.moveNext()) {
            reverseItems.unshift(this.current);
        }
        return fromArray(reverseItems);
    };
    /** @inheritdoc */
    Sequence.prototype.select = function (selector) {
        this._selector = asFunc(selector);
        return this;
    };
    /**
     * Projects an item to another type based on the inner selector.
     *
     * @param {T} x The input value.
     *
     * @return any The output value.
     */
    Sequence.prototype.selectInner = function (item) {
        var s = this._selector;
        if (TypeUtils.isNullOrUndefined(s)) {
            s = function (x) { return x; };
        }
        return s(item);
    };
    /** @inheritdoc */
    Sequence.prototype.selectMany = function (selector) {
        var s = asFunc(selector);
        var flattenItems = [];
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            var items = asEnumerable(s(ctx.item, ctx.index, ctx));
            while (items.moveNext()) {
                flattenItems.push(items.current);
            }
        }
        return fromArray(flattenItems);
    };
    /** @inheritdoc */
    Sequence.prototype.sequenceEqual = function (other, equalityComparer) {
        var o = asEnumerable(other);
        var ec = toEqualityComparerSafe(equalityComparer);
        while (this.moveNext()) {
            var x = this.current;
            if (!o.moveNext()) {
                return false;
            }
            var y = o.current;
            if (!ec(x, y)) {
                return false;
            }
        }
        if (o.moveNext()) {
            return false;
        }
        return true;
    };
    /** @inheritdoc */
    Sequence.prototype.single = function (predicate) {
        var p = toPredicateSafe(predicate);
        var index = -1;
        var item;
        var found = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (p(ctx.item, ctx.index, ctx)) {
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
    /** @inheritdoc */
    Sequence.prototype.singleOrDefault = function (predicateOrDefaultValue, defaultValue) {
        var odObj = createObjectForOrDefaultMethod(arguments);
        var item = odObj.defaultValue;
        var index = -1;
        var found = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (odObj.predicate(ctx.item, ctx.index, ctx)) {
                if (found) {
                    throw "Sequence contains more that one matching element!";
                }
                item = this.current;
                found = true;
            }
        }
        return item;
    };
    /** @inheritdoc */
    Sequence.prototype.skip = function (cnt) {
        return this.skipWhile(function () {
            if (cnt > 0) {
                --cnt;
                return true;
            }
            return false;
        });
    };
    /** @inheritdoc */
    Sequence.prototype.skipWhile = function (predicate) {
        var p = asFunc(predicate);
        var newItems = [];
        var index = -1;
        var flag = false;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (!flag && !p(ctx.item, ctx.index, ctx)) {
                flag = true;
            }
            if (flag) {
                newItems.push(ctx.item);
            }
        }
        return fromArray(newItems);
    };
    /** @inheritdoc */
    Sequence.prototype.sum = function (defaultValue) {
        return this.aggregate(function (result, x) {
            return result + x;
        }, defaultValue);
    };
    /** @inheritdoc */
    Sequence.prototype.take = function (cnt) {
        return this.takeWhile(function () {
            if (cnt > 0) {
                --cnt;
                return true;
            }
            return false;
        });
    };
    /** @inheritdoc */
    Sequence.prototype.takeWhile = function (predicate) {
        var p = asFunc(predicate);
        var newItems = [];
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (!p(ctx.item, ctx.index, ctx)) {
                break;
            }
            newItems.push(ctx.item);
        }
        return fromArray(newItems);
    };
    /** @inheritdoc */
    Sequence.prototype.toArray = function () {
        var arr = [];
        while (this.moveNext()) {
            arr.push(this.current);
        }
        return arr;
    };
    /** @inheritdoc */
    Sequence.prototype.toLookup = function (keySelector, keyEqualityComparer) {
        var lu = {};
        this.groupBy(keySelector, keyEqualityComparer)
            .each(function (grouping) {
            lu[grouping.key] = grouping;
        });
        return lu;
    };
    /** @inheritdoc */
    Sequence.prototype.toObject = function (keySelector) {
        if (arguments.length < 1) {
            keySelector = function (x, index, key) {
                return key;
            };
        }
        var ks = asFunc(keySelector);
        var obj = {};
        this.each(function (x, index, ctx) {
            var key = ks(x, index, ctx.key);
            obj[key] = x;
        });
        return obj;
    };
    /** @inheritdoc */
    Sequence.prototype.toObservable = function (keySelector) {
        if (arguments.length < 1) {
            keySelector = function (x, index, key) {
                return key;
            };
        }
        var ks = asFunc(keySelector);
        var ob = new observable_1.Observable();
        this.each(function (x, index, ctx) {
            var key = ks(x, index, ctx.key);
            ob.set(key, x);
        });
        return ob;
    };
    /** @inheritdoc */
    Sequence.prototype.toObservableArray = function () {
        return new observable_array_1.ObservableArray(this.toArray());
    };
    /** @inheritdoc */
    Sequence.prototype.toVirtualArray = function () {
        var arr = this.toArray();
        var va = new virtual_array_1.VirtualArray(arr.length);
        for (var i = 0; i < va.length; i++) {
            va.setItem(i, arr[i]);
        }
        return va;
    };
    /** @inheritdoc */
    Sequence.prototype.union = function (second, equalityComparer) {
        return this.concat(second)
            .distinct(equalityComparer);
    };
    /** @inheritdoc */
    Sequence.prototype.where = function (predicate) {
        var p = asFunc(predicate);
        var filteredItems = [];
        var index = -1;
        while (this.moveNext()) {
            var ctx = new EnumerableItemContext(this, ++index);
            if (p(ctx.item, ctx.index, ctx)) {
                filteredItems.push(ctx.item);
            }
        }
        return fromArray(filteredItems);
    };
    /** @inheritdoc */
    Sequence.prototype.zip = function (second, selector) {
        var snd = asEnumerable(second);
        var s = asFunc(selector);
        var zippedItems = [];
        var index = -1;
        while (this.moveNext() && snd.moveNext()) {
            ++index;
            var ctx1 = new EnumerableItemContext(this, index);
            var ctx2 = new EnumerableItemContext(snd, index);
            var zipped = s(ctx1.item, ctx2.item, index, ctx1, ctx2);
            zippedItems.push(zipped);
        }
        return fromArray(zippedItems);
    };
    return Sequence;
}());
exports.Sequence = Sequence;
var ArrayEnumerable = (function (_super) {
    __extends(ArrayEnumerable, _super);
    function ArrayEnumerable(arr, getter) {
        _super.call(this);
        this._arr = arr;
        this._getter = getter;
        this.reset();
    }
    ArrayEnumerable.prototype.getCurrent = function () {
        return this._getter(this._index);
    };
    Object.defineProperty(ArrayEnumerable.prototype, "isValid", {
        get: function () {
            return (this._index + 1) < this._arr.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayEnumerable.prototype, "itemKey", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    ArrayEnumerable.prototype.moveNext = function () {
        if (this.isValid) {
            ++this._index;
            return true;
        }
        return false;
    };
    ArrayEnumerable.prototype.reset = function () {
        this._index = -1;
    };
    return ArrayEnumerable;
}(Sequence));
var EnumerableItemContext = (function () {
    function EnumerableItemContext(seq, index) {
        this._seq = seq;
        this._index = index;
    }
    Object.defineProperty(EnumerableItemContext.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumerableItemContext.prototype, "item", {
        get: function () {
            return this._seq.current;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumerableItemContext.prototype, "key", {
        get: function () {
            return this._seq.itemKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumerableItemContext.prototype, "sequence", {
        get: function () {
            return this._seq;
        },
        enumerable: true,
        configurable: true
    });
    return EnumerableItemContext;
}());
/**
 * A grouping.
 */
var Grouping = (function (_super) {
    __extends(Grouping, _super);
    /**
     * Initializes a new instance of that class.
     *
     * @param {K} key The key.
     * @param {IEnumerable} seq The items of the grouping.
     */
    function Grouping(key, seq) {
        _super.call(this);
        this._key = key;
        this._seq = seq;
    }
    /** @inheritdoc */
    Grouping.prototype.getCurrent = function () {
        return this._seq.current;
    };
    Object.defineProperty(Grouping.prototype, "isValid", {
        /** @inheritdoc */
        get: function () {
            return this._seq.isValid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grouping.prototype, "key", {
        /** @inheritdoc */
        get: function () {
            return this._key;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    Grouping.prototype.moveNext = function () {
        return this._seq.moveNext();
    };
    /** @inheritdoc */
    Grouping.prototype.reset = function () {
        return this._seq.reset();
    };
    return Grouping;
}(Sequence));
exports.Grouping = Grouping;
var ObjectEnumerable = (function (_super) {
    __extends(ObjectEnumerable, _super);
    function ObjectEnumerable(obj) {
        _super.call(this);
        this._properties = [];
        for (var p in obj) {
            this._properties.push(p);
        }
        this.reset();
    }
    ObjectEnumerable.prototype.getCurrent = function () {
        return this._obj[this.itemKey];
    };
    Object.defineProperty(ObjectEnumerable.prototype, "isValid", {
        get: function () {
            return (this._index + 1) < this._properties.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectEnumerable.prototype, "itemKey", {
        get: function () {
            return this._properties[this._index];
        },
        enumerable: true,
        configurable: true
    });
    ObjectEnumerable.prototype.moveNext = function () {
        if (this.isValid) {
            ++this._index;
            return true;
        }
        return false;
    };
    ObjectEnumerable.prototype.reset = function () {
        this._index = -1;
    };
    return ObjectEnumerable;
}(Sequence));
/**
 * An ordered sequence.
 */
var OrderedSequence = (function (_super) {
    __extends(OrderedSequence, _super);
    /**
     * Initializes a new instance of that class.
     *
     * @param {IEnumerable} seq The source sequence.
     * @param {Function} selector The selector for the sort values.
     * @param {Function} comparer The comparer to use.
     */
    function OrderedSequence(seq, selector, comparer) {
        _super.call(this);
        var me = this;
        this._orderComparer = toComparerSafe(comparer);
        if (true === selector) {
            selector = function (x) { return x; };
        }
        this._orderSelector = asFunc(selector);
        this._originalItems = seq.toArray();
        this._items = fromArray(this._originalItems.map(function (x) {
            return {
                sortBy: me.selector(x),
                value: x
            };
        }).sort(function (x, y) {
            return me.comparer(x.sortBy, y.sortBy);
        }).map(function (x) {
            return x.value;
        }));
    }
    Object.defineProperty(OrderedSequence.prototype, "comparer", {
        /**
         * Gets the comparer.
         */
        get: function () {
            return this._orderComparer;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    OrderedSequence.prototype.getCurrent = function () {
        return this._items.current;
    };
    /** @inheritdoc */
    OrderedSequence.prototype.moveNext = function () {
        return this._items
            .moveNext();
    };
    /** @inheritdoc */
    OrderedSequence.prototype.reset = function () {
        return this._items.reset();
    };
    Object.defineProperty(OrderedSequence.prototype, "selector", {
        /**
         * Gets the selector.
         */
        get: function () {
            return this._orderSelector;
        },
        enumerable: true,
        configurable: true
    });
    /** @inheritdoc */
    OrderedSequence.prototype.then = function (comparer) {
        return this.thenBy('x => x', comparer);
    };
    /** @inheritdoc */
    OrderedSequence.prototype.thenBy = function (selector, comparer) {
        var c = toComparerSafe(comparer);
        if (true === selector) {
            selector = function (x) { return x; };
        }
        selector = asFunc(selector);
        var thisSelector = this._orderSelector;
        var thisComparer = this._orderComparer;
        return fromArray(this._originalItems)
            .orderBy(function (x) {
            return {
                level_0: thisSelector(x),
                level_1: selector(x),
            };
        }, function (x, y) {
            var comp0 = thisComparer(x.level_0, y.level_0);
            if (0 != comp0) {
                return comp0;
            }
            var comp1 = c(x.level_1, y.level_1);
            if (0 != comp1) {
                return comp1;
            }
            return 0;
        });
    };
    /** @inheritdoc */
    OrderedSequence.prototype.thenByDescending = function (selector, comparer) {
        var c = toComparerSafe(comparer);
        return this.thenBy(selector, function (x, y) {
            return comparer(y, x);
        });
    };
    /** @inheritdoc */
    OrderedSequence.prototype.thenDescending = function (comparer) {
        return this.thenByDescending('x => x', comparer);
    };
    return OrderedSequence;
}(Sequence));
exports.OrderedSequence = OrderedSequence;
/**
 * Returns a value as sequence.
 *
 * @param any v The input value.
 * @param {Boolean} [throwException] Throws an exception if input value is no valid value.
 *
 * @throws Invalid value.
 *
 * @return any The value as sequence or (false) if input value is no valid object.
 */
function asEnumerable(v, throwException) {
    if (throwException === void 0) { throwException = true; }
    if (isEnumerable(v)) {
        return v;
    }
    if ((v instanceof Array) ||
        (v instanceof observable_array_1.ObservableArray) ||
        (v instanceof virtual_array_1.VirtualArray) ||
        (typeof v === 'string') ||
        !v) {
        return fromArray(v);
    }
    if (typeof v === 'object') {
        return fromObject(v);
    }
    // at this point we have no valid value to use as sequence
    if (throwException) {
        throw "'" + v + "' is no valid value to use as sequence!";
    }
    return false;
}
exports.asEnumerable = asEnumerable;
/**
 * Returns a value as function.
 *
 * @param any v The value to convert. Can be a function or a string that is handled as lambda expression.
 * @param {Boolean} [throwException] Throw an exception if value is no valid function or not.
 *
 * @throws Value is no valid function / lambda expression.
 *
 * @return {Function} Value as function or (false) if value is invalid.
 */
function asFunc(v, throwException) {
    if (throwException === void 0) { throwException = true; }
    if (typeof v === "function") {
        return v;
    }
    if (!v) {
        return v;
    }
    // now handle as lambda...
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
            .replace(/^[\s|{|}]+|[\s|{|}]+$/g, ''); // trim
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
exports.asFunc = asFunc;
/**
 * Creates a new sequence from a list of values.
 *
 * @param any ...items One or more item to add.
 *
 * @return {IEnumerable} The new sequence.
 */
function create() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i - 0] = arguments[_i];
    }
    return fromArray(items);
}
exports.create = create;
function createObjectForOrDefaultMethod(args) {
    var odObj = {
        predicate: function () { return true; },
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
 * Short hand version for 'each' method of a sequence.
 *
 * @param items any The sequence of items to iterate.
 * @param action any The action to invoke for each item.
 *
 * @throws At least one argument is invalid.
 *
 * @return any The result of the last invocation.
 */
function each(items, action) {
    return asEnumerable(items).each(action);
}
exports.each = each;
/**
 * Creates a new sequence from an array.
 *
 * @param {Array} arr The array.
 *
 * @return {IEnumerable} The new sequence.
 */
function fromArray(arr) {
    if (arguments.length < 1) {
        arr = [];
    }
    var getter;
    if ((arr instanceof observable_array_1.ObservableArray) ||
        (arr instanceof virtual_array_1.VirtualArray)) {
        getter = function (i) { return arr.getItem(i); };
    }
    else {
        getter = function (i) { return arr[i]; };
    }
    return new ArrayEnumerable(arr, getter);
}
exports.fromArray = fromArray;
/**
 * Creates a new sequence from an object.
 *
 * @param {Object} obj The object.
 *
 * @return {Sequence} The new sequence.
 */
function fromObject(obj) {
    if (arguments.length < 1) {
        obj = {};
    }
    return new ObjectEnumerable(obj);
}
exports.fromObject = fromObject;
/**
 * Checks if a value is a sequence.
 *
 * @param any v The value to check.
 *
 * @return {Boolean} Is sequence or not.
 */
function isEnumerable(v) {
    return v instanceof Sequence;
}
exports.isEnumerable = isEnumerable;
/**
 * Short hand version for 'order(By)' methods of a sequence.
 *
 * @param items any The sequence of items to iterate.
 * @param [comparer] any The custom comparer to use.
 * @param [selector] any The custom key selector to use.
 *
 * @throws At least one argument is invalid.
 *
 * @return {IOrderedEnumerable} The sequences with the sorted items.
 */
function sort(items, comparer, selector) {
    return asEnumerable(items).orderBy(selector, comparer);
}
exports.sort = sort;
/**
 * Short hand version for 'order(By)Descending' methods of a sequence.
 *
 * @param items any The sequence of items to iterate.
 * @param [comparer] any The custom comparer to use.
 * @param [selector] any The custom key selector to use.
 *
 * @throws At least one argument is invalid.
 *
 * @return {IOrderedEnumerable} The sequences with the sorted items.
 */
function sortDesc(items, comparer, selector) {
    return asEnumerable(items).orderByDescending(selector, comparer);
}
exports.sortDesc = sortDesc;
/**
 * Returns a value as comparer.
 *
 * @param any predicate The input value.
 *
 * @throws Input value is no valid function / lambda expression.
 *
 * @return {Function} Input value as comparer.
 */
function toComparerSafe(comparer) {
    comparer = asFunc(comparer);
    if (TypeUtils.isNullOrUndefined(comparer)) {
        return function (x, y) {
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        };
    }
    return comparer;
}
exports.toComparerSafe = toComparerSafe;
;
/**
 * Returns a value as equality comparer.
 *
 * @param any equalityComparer The input value.
 *
 * @throws Input value is no valid function / lambda expression.
 *
 * @return {Function} Input value as equality comparer.
 */
function toEqualityComparerSafe(equalityComparer) {
    if (true === equalityComparer) {
        return function (x, y) {
            return x === y;
        };
    }
    equalityComparer = asFunc(equalityComparer);
    if (TypeUtils.isNullOrUndefined(equalityComparer)) {
        return function (x, y) {
            return x == y;
        };
    }
    return equalityComparer;
}
exports.toEqualityComparerSafe = toEqualityComparerSafe;
/**
 * Returns a value as predicate.
 *
 * @param any predicate The input value.
 *
 * @throws Input value is no valid function / lambda expression.
 *
 * @return {Function} Input value as predicate.
 */
function toPredicateSafe(predicate) {
    if (TypeUtils.isNullOrUndefined(predicate)) {
        predicate = function () { return true; };
    }
    return asFunc(predicate);
}
exports.toPredicateSafe = toPredicateSafe;
//# sourceMappingURL=index.js.map