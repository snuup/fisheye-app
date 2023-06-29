"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nicenodetypename = exports.nicelinktypename = exports.rebind = exports.initevents = exports.cc = exports.identity = exports.mergePrototype = exports.mount = void 0;
function mount(x) {
    Object.assign(globalThis, x);
}
exports.mount = mount;
function mergePrototype(mixin) {
    var targets = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        targets[_i - 1] = arguments[_i];
    }
    var props = Object.getOwnPropertyDescriptors(mixin.prototype);
    delete props.constructor; // do not copy the constructor
    targets.forEach(function (t) {
        Object.defineProperties(t.prototype, props);
    });
}
exports.mergePrototype = mergePrototype;
mergePrototype(/** @class */ (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.cast = function () { return this; }; // this is just for typescripts type safety
    class_1.prototype.countBy = function (selector) {
        selector = selector !== null && selector !== void 0 ? selector : identity;
        var f = function (acc, x) {
            var _a;
            var k = selector(x);
            acc[k] = ((_a = acc[k]) !== null && _a !== void 0 ? _a : 0) + 1;
            return acc;
        };
        return this.reduce(f, {});
    };
    class_1.prototype.groupBy = function (selector) {
        selector = selector !== null && selector !== void 0 ? selector : identity;
        var f = function (acc, x) {
            var _a;
            var k = selector(x);
            acc[k] = (_a = acc[k]) !== null && _a !== void 0 ? _a : [];
            acc[k].push(x);
            return acc;
        };
        return this.reduce(f, {});
    };
    class_1.prototype.sortBy = function (selector) {
        selector = selector !== null && selector !== void 0 ? selector : identity;
        function comparefn(a, b) {
            a = selector(a);
            b = selector(b);
            var r = 0;
            if (a < b)
                r = -1;
            if (a > b)
                r = 1;
            //console.log(`compare: "${a}" "${b}" = ${r}`)
            return r;
        }
        return this.sort(comparefn);
    };
    Object.defineProperty(class_1.prototype, "combinations", {
        get: function () {
            return __spreadArray([], arraycombinations(this), true);
        },
        enumerable: false,
        configurable: true
    });
    class_1.prototype.distinctBy = function (selector) {
        selector = selector !== null && selector !== void 0 ? selector : identity;
        var m = new Map(this.map(function (x) { return [selector(x), x]; }));
        return __spreadArray([], m.values(), true);
    };
    class_1.prototype.sumBy = function (selector) {
        selector = selector !== null && selector !== void 0 ? selector : identity;
        return this.reduce(function (acc, b) { return acc + selector(b); }, 0);
    };
    Object.defineProperty(class_1.prototype, "average", {
        get: function () {
            return this.sumBy() / this.length;
        },
        enumerable: false,
        configurable: true
    });
    class_1.prototype.sortnumeric = function (selector) {
        selector = selector !== null && selector !== void 0 ? selector : identity;
        return this.sort(function (a, b) { return selector(a) - selector(b); });
    };
    Object.defineProperty(class_1.prototype, "first", {
        get: function () {
            return this[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "last", {
        get: function () {
            return this[this.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    return class_1;
}(Array)), Array);
function arraycombinations(arr) {
    var h, t, _i, t_1, tt, _a, _b, ht;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                h = arr[0], t = arr.slice(1);
                if (!h)
                    return [2 /*return*/]; // termination
                _i = 0, t_1 = t;
                _c.label = 1;
            case 1:
                if (!(_i < t_1.length)) return [3 /*break*/, 4];
                tt = t_1[_i];
                return [4 /*yield*/, [h, tt]];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                _a = 0, _b = arraycombinations(t);
                _c.label = 5;
            case 5:
                if (!(_a < _b.length)) return [3 /*break*/, 8];
                ht = _b[_a];
                return [4 /*yield*/, ht];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8: return [2 /*return*/];
        }
    });
}
mergePrototype(/** @class */ (function (_super) {
    __extends(class_2, _super);
    function class_2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(class_2.prototype, "entries", {
        get: function () {
            return Object.entries(this);
        },
        enumerable: false,
        configurable: true
    });
    class_2.prototype.mapKeys = function (fmap) {
        return Object.fromEntries(this.entries.map(function (_a) {
            var k = _a[0], v = _a[1];
            return [fmap(k), v];
        }));
    };
    class_2.prototype.mapValues = function (fmap) {
        return Object.fromEntries(this.entries.map(function (_a) {
            var k = _a[0], v = _a[1];
            return [k, fmap(v)];
        }));
    };
    return class_2;
}(Object)), Object);
mergePrototype(/** @class */ (function (_super) {
    __extends(class_3, _super);
    function class_3() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_3.prototype.truncate = function (n) {
        return ((this.length > n) ? this.slice(0, n - 1) + "..." : this);
    };
    return class_3;
}(String)), String);
mergePrototype(/** @class */ (function () {
    function class_4() {
    }
    class_4.prototype.clamp = function (min, max) {
        if (min !== undefined && this <= min)
            return min;
        if (max !== undefined && this >= max)
            return max;
        return this;
    };
    return class_4;
}()), Number);
function identity(x) { return x; }
exports.identity = identity;
function cc() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    return names.flat().filter(identity).flatMap(function (n) { return (n.trim ? n : Object.keys(n).filter(function (k) { return n[k]; })); }).join(' '); // n.trim detects strings
}
exports.cc = cc;
// declare global {
//   interface HTMLElement {
//       getParentByPredicate(predicate: (e: HTMLElement) => boolean): HTMLElement
//   }
// }
mergePrototype(/** @class */ (function (_super) {
    __extends(class_5, _super);
    function class_5() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(class_5.prototype, "width", {
        get: function () {
            return parseInt(this.style.width);
        },
        set: function (v) {
            this.style.width = "".concat(v, "px");
        },
        enumerable: false,
        configurable: true
    });
    class_5.prototype.getParentByPredicate = function (predicate) {
        var _a;
        if (predicate(this))
            return this;
        return (_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.getParentByPredicate(predicate);
    };
    class_5.prototype.has = function (name) {
        return name in this || this.hasAttribute(name);
    };
    class_5.prototype.get = function (name) {
        return name in this ? this[name] : this.getAttribute(name);
    };
    class_5.prototype.hasClass = function (className) { return this.classList.contains(className); };
    class_5.prototype.toggleClass = function (className) { return this.classList.toggle(className); };
    class_5.prototype.hide = function () { this.style.visibility = "hidden"; };
    class_5.prototype.show = function () { this.style.visibility = "visible"; };
    class_5.prototype.addClass = function (className, condition) {
        if (condition === void 0) { condition = true; }
        if (className && condition)
            this.classList.add(className);
        return this;
    };
    class_5.prototype.remClass = function (className) {
        if (className)
            this.classList.remove(className);
        return this;
    };
    class_5.prototype.setClass = function (className, active) {
        return active ? this.addClass(className) : this.remClass(className);
    };
    class_5.prototype.getNumAttr = function (name) {
        var _a;
        return parseInt((_a = this.getAttribute(name)) !== null && _a !== void 0 ? _a : "0");
    };
    return class_5;
}(HTMLElement)), HTMLElement);
mergePrototype(/** @class */ (function (_super) {
    __extends(class_6, _super);
    function class_6() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_6.prototype.ensure = function (key, valuefactory) {
        if (!this.has(key))
            this.set(key, valuefactory());
        return this.get(key);
    };
    return class_6;
}(Map)), Map);
// -> jmx
function initevents() {
    window.addEventListener("mousedown", function (ev) {
        // console.log("%cfmousedown", "background:lightBlue;color:white;padding:2px;font-weight:bold", ev.target)
        if (ev.target instanceof HTMLElement) {
            var e = ev.target.getParentByPredicate(function (ee) { return ee.has("fmousedown"); });
            if (!(e === null || e === void 0 ? void 0 : e.get("fmousedown")))
                return;
            var ea = ev.target.getParentByPredicate(function (ee) { return ee.has("fargs"); });
            var args = ea === null || ea === void 0 ? void 0 : ea.get("fargs");
            //    if (e?.fmousedown) console.log("real fmousedown", args)
            window.currentEvent = ev;
            e === null || e === void 0 ? void 0 : e.fmousedown(args !== null && args !== void 0 ? args : ev);
            //if (e?.tagName == "A") { pushHistory() }
        }
    });
}
exports.initevents = initevents;
function rebind(o) {
    var proto = Object.getPrototypeOf(o);
    var names = Object.entries(Object.getOwnPropertyDescriptors(proto))
        .filter(function (_a) {
        var p = _a[1];
        return p.value instanceof Function;
    })
        .filter(function (_a) {
        var name = _a[0];
        return name != "constructor";
    })
        .map(function (_a) {
        var name = _a[0];
        return name;
    });
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        o[name_1] = o[name_1].bind(o);
    }
}
exports.rebind = rebind;
function nicelinktypename(rawlinktype) {
    switch (rawlinktype) {
        case "membership": return "member";
        case "partnership": return "partner";
        case "family_relationship": return "family";
        case "ownership": return "owner";
        default: return rawlinktype;
    }
}
exports.nicelinktypename = nicelinktypename;
function nicenodetypename(rawnodetype) {
    //console.log("rawnodetype", `|${rawnodetype}|`)
    switch (rawnodetype) {
        case "": return "undefined";
        case "political_organization": return "political-org";
        default: return rawnodetype;
    }
}
exports.nicenodetypename = nicenodetypename;
