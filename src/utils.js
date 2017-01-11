export const isHtmlElement = obj => {
	var d = document.createElement("div");
	try {
		d.appendChild(obj.cloneNode(true));
		return obj.nodeType === 1;
	} catch (e) {
		return false;
	}
};

export const checkType = value => {
	return Object.prototype.toString.call(value).match(/\[object (.*)]/)[1];
};
export const isObject = value => {
	return checkType(value) === 'Object';
};
export const isArray = value => {
	return checkType(value) === 'Array';
};
