define( [
	"../../core"
], function( jQuery ) {

"use strict";
	// require core.js 获得 jQuery

// 返回 匿名函数
return function( elem, dir, until ) {
	// 声明 matched 为 []
	var matched = [],
		// 声明 truncate 为 until !== undefined
		truncate = until !== undefined;

	// 遍历 ( elem = elem[ dir ] ) && elem.nodeType !== 9
	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		// 若 elem.nodeType === 1
		if ( elem.nodeType === 1 ) {
			// 若 truncate 为真 并且 jQuery( elem ).is( until ) 返回为真
			if ( truncate && jQuery( elem ).is( until ) ) {
				// 退出当前循环
				break;
			}
			// 否则 matched 加入 elem
			matched.push( elem );
		}
	}
	// 返回 matched
	return matched;
};

} );
