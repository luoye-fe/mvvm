import { isHtmlElement } from './utils.js';
import { observer, watch } from './observer.js';
import VNode from './vnode.js';

class MVVM {
	constructor(options) {
		this.$options = options;
		this._data = options.data || {};
		// 获取 el 判断是否为元素
		this.$el = options.el ? (isHtmlElement(options.el) ? options.el : document.querySelector(options.el)) : document.body;
		Object.keys(this._data).forEach(item => this._proxy(item));
		this._initData();
		watch(this, this._render.bind(this), this._update.bind(this));
	}
	_initData() {
		// 初始化 state getter/setter
		observer(this._data);
		console.log('created');
	}
	_update() {
		console.log('update');
		return this._render();
	}
	_render() {
		console.log('render');
		let vnode = this.$options.render ? this.$options.render.call(this, this.__h__) : {};
		console.log(vnode);
		return vnode;
	}
	_mounted() {
		console.log('mounted');
	}
	__h__() {
		// render 函数 获取 vdom
		return VNode.call(this, ...arguments);
	}
	_proxy(key) {
		// 做一层代理，能够直接用  this. 访问 data 中的属性
		let self = this;
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
}

export default MVVM;
