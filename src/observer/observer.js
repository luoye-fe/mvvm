import Dep from './dep.js';
import { isObject, isArray } from '../utils.js';

export const observer = function(value) {
	if (!isObject(value) && !isArray(value)) return;
	return new Observer(value);
};

export class Observer {
	constructor(value) {
		if (isArray(value)) {
			this.observeArray(value);
		} else {
			this.walk(value);
		}
	}
	walk(obj) {
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			defineReactive(obj, keys[i], obj[keys[i]]);
		}
	}
	observeArray(items) {
		for (let i = 0, l = items.length; i < l; i++) {
			observer(items[i]);
		}
	}
};

export const watch = function(vm, exp, cb) {
	Dep.target = cb;
	return exp();
};

function defineReactive(obj, key, val) {
	let dep = new Dep();
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
};
