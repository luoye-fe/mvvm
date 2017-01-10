// Vdom
function VNode(tag, data, children, text) {
	return {
		tag: tag,
		data: data,
		children: children,
		text: text
	};
};

export default VNode;
