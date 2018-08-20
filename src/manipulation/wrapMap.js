define( function() {

"use strict";

// We have to close these tags to support XHTML (#13200)
// 我们必须关闭这些标签来支持 XHTML
// 声明 wrapMap 对象
var wrapMap = {

	// Support: IE <=9 only
	// 仅支持 IE <=9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	// XHTML解析器不会像标签解析器所做的那样神奇地插入元素。因此，我们不能通过省略 <tbody> 或其他需要的元素来缩短这一点。
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
// 仅支持 IE <=9
// 属性之间的映射
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// 返回 wrapMap 对象
return wrapMap;
} );
