define( [
	"../core",
	"../core/nodeName"
], function( jQuery, nodeName ) {

"use strict";
	// require core.js 获得 jQuery
	// require core/nodeName.js 获得 nodeName 方法


// 声明 getAll
function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// 仅支持 IE <=9 - 11
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	// 使用Type来避免宿主对象上的零参数方法调用
	// 初始化 ret
	var ret;

	// 判断 context 上下文中是否 含有这个方法 getElementsByTagName
	if ( typeof context.getElementsByTagName !== "undefined" ) {
		// 在当前上下文中查询 tag 标签
		ret = context.getElementsByTagName( tag || "*" );

		// 判断 context 上下文中是否 含有这个方法 querySelectorAll
	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		// 使用 querySelectorAll 方法去查找 tag 标签
		ret = context.querySelectorAll( tag || "*" );

	} else {
		// 否则返回空数组
		ret = [];
	}

	// 若 （tag === undefined 或者 tag 存在） 并且 nodeName 返回为真
	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		// 返回 [ context ] 和 ret 合并
		// [context, ...ret]
		return jQuery.merge( [ context ], ret );
	}

	// 返回 ret
	return ret;
}

// 返回 getAll
return getAll;
} );
