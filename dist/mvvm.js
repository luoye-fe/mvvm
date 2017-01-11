(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MVVM = factory());
}(this, (function () { 'use strict';

var isHtmlElement = function isHtmlElement(obj) {
	var d = document.createElement("div");
	try {
		d.appendChild(obj.cloneNode(true));
		return obj.nodeType === 1;
	} catch (e) {
		return false;
	}
};

var checkType = function checkType(value) {
	return Object.prototype.toString.call(value).match(/\[object (.*)]/)[1];
};
var isObject = function isObject(value) {
	return checkType(value) === 'Object';
};
var isArray = function isArray(value) {
	return checkType(value) === 'Array';
};

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dep = function () {
	function Dep() {
		_classCallCheck$2(this, Dep);

		this.subs = [];
	}

	_createClass$2(Dep, [{
		key: "addSub",
		value: function addSub(sub) {
			this.subs.push(sub);
		}
	}, {
		key: "notify",
		value: function notify() {
			console.log(this.subs);
			this.subs.forEach(function (cb) {
				return cb();
			});
		}
	}]);

	return Dep;
}();



Dep.target = null;

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var observer = function observer(value) {
	if (!isObject(value) && !isArray(value)) return;
	return new Observer(value);
};

var Observer = function () {
	function Observer(value) {
		_classCallCheck$1(this, Observer);

		if (isArray(value)) {
			this.observeArray(value);
		} else {
			this.walk(value);
		}
	}

	_createClass$1(Observer, [{
		key: 'walk',
		value: function walk(obj) {
			var keys = Object.keys(obj);
			for (var i = 0; i < keys.length; i++) {
				defineReactive(obj, keys[i], obj[keys[i]]);
			}
		}
	}, {
		key: 'observeArray',
		value: function observeArray(items) {
			for (var i = 0, l = items.length; i < l; i++) {
				observer(items[i]);
			}
		}
	}]);

	return Observer;
}();

var watch = function watch(vm, exp, cb) {
	Dep.target = cb;
	return exp();
};

function defineReactive(obj, key, val) {
	var dep = new Dep();
	observer(val);
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter() {
			if (Dep.target) {
				dep.addSub(Dep.target);
			}
			return val;
		},
		set: function reactiveSetter(newVal) {
			if (newVal === val) return;
			val = newVal;
			dep.notify();
			observer(newVal);
		}
	});
}

// Vdom
function VNode(tag, data, children, text) {
	return {
		tag: tag,
		data: data,
		children: children,
		text: text
	};
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MVVM = function () {
	function MVVM(options) {
		var _this = this;

		_classCallCheck(this, MVVM);

		this.$options = options;
		this._data = options.data || {};
		// 获取 el 判断是否为元素
		this.$el = options.el ? isHtmlElement(options.el) ? options.el : document.querySelector(options.el) : document.body;
		Object.keys(this._data).forEach(function (item) {
			return _this._proxy(item);
		});
		this._initData();
		watch(this, this._render.bind(this), this._update.bind(this));
	}

	_createClass(MVVM, [{
		key: '_initData',
		value: function _initData() {
			// 初始化 state getter/setter
			observer(this._data);
			console.log('created');
		}
	}, {
		key: '_update',
		value: function _update() {
			console.log('update');
			return this._render();
		}
	}, {
		key: '_render',
		value: function _render() {
			console.log('render');
			var vnode = this.$options.render ? this.$options.render.call(this, this.__h__) : {};
			console.log(vnode);
			return vnode;
		}
	}, {
		key: '_mounted',
		value: function _mounted() {
			console.log('mounted');
		}
	}, {
		key: '__h__',
		value: function __h__() {
			// render 函数 获取 vdom
			return VNode.call.apply(VNode, [this].concat(Array.prototype.slice.call(arguments)));
		}
	}, {
		key: '_proxy',
		value: function _proxy(key) {
			// 做一层代理，能够直接用  this. 访问 data 中的属性
			var self = this;
			Object.defineProperty(self, key, {
				configurable: true,
				enumerable: true,
				get: function proxyGetter() {
					return self._data[key];
				},
				set: function proxySetter(val) {
					self._data.text = val;
				}
			});
		}
	}]);

	return MVVM;
}();

return MVVM;

})));
//# sourceMappingURL=mvvm.js.map
