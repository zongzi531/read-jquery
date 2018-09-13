define( [
	"../core",
	"../var/document",
	"./var/rsingleTag",
	"../manipulation/buildFragment",

	// This is the only module that needs core/support
	"./support"
], function( jQuery, document, rsingleTag, buildFragment, support ) {

"use strict";

	// require core.js 获得 jQuery
	// require var/document.js 获得 window.document
	// require ./var/rsingleTag.js 获得 正则表达式
	// require manipulation/buildFragment.js 获得 buildFragment 方法
	// require core/support.js 获得 support 对象

// Argument "data" should be string of html
// “数据”的问题，应该是：HTML字符串
// context (optional): If specified, the fragment will be created in this context,
// 上下文（可选）：如果指定，将在该上下文中创建片段，
// defaults to document
// 默认 to document
// keepScripts (optional): If true, will include scripts passed in the html string
// keepscripts（可选）：如果设置为true，将包括在HTML中的脚本。
// 描述: 将字符串解析到一个DOM节点的数组中。
jQuery.parseHTML = function( data, context, keepScripts ) {

	// 若 data 不是 String 类型 返回 空数组
	if ( typeof data !== "string" ) {
		return [];
	}

	// 若 conetxt 为 布尔类型
	// 设置 keepScripts = context
	// context 设置 为 false
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	// 初始化 base, parsed, scripts
	var base, parsed, scripts;

	// 若 context 为 false
	// 也就是说一开始传入的context 为 布尔类型进入此判断
	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// 立即停止执行脚本或联机事件处理程序
		// by using document.implementation
		// 使用 document.implementation
		// 如果 support.createHTMLDocument 返回 true
		if ( support.createHTMLDocument ) {

			// 调用 document.implementation.createHTMLDocument
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// 为创建的文档设置基础 href
			// so any parsed elements with URLs
			// 所以任何带有URL的解析元素
			// are based on the document's URL (gh-2965)
			// 基于文档的URL
			// 创建 base 元素
			// 设置 当前 href 至 base
			// 在 context head 中插入 base
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {

			// 设置 context = document
			context = document;
		}
	}

	// rsingleTag 正则表达式 匹配 data 返回至 parsed
	parsed = rsingleTag.exec( data );

	// 若 !keepScripts 为 false 则 返回 false，否则返回 []
	scripts = !keepScripts && [];

	// Single tag
	// 单标签
	// 若 parsed 存在
	if ( parsed ) {

		// 获取 parsed[ 1 ] 并创建元素
		// 返回 [ 该创建元素 ]
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	// 执行 buildFragment 方法传入 [ data ], context, scripts
	// 返回创建好的 fragment
	parsed = buildFragment( [ data ], context, scripts );

	// 若 scripts 存在并且长度大于 0
	if ( scripts && scripts.length ) {

		// 将 scripts 移除
		jQuery( scripts ).remove();
	}

	// 返回 [...parsed.childNodes]
	return jQuery.merge( [], parsed.childNodes );
};

// 返回 jQuery.parseHTML 方法
return jQuery.parseHTML;

} );
