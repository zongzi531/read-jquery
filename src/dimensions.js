define( [
	"./core",
	"./core/access",
	"./var/isWindow",
	"./css"
], function( jQuery, access, isWindow ) {

"use strict";

	// require core.js 获得 jQuery
	// require core/access.js 获得 access 方法
	// require var/isWindow.js 获得 isWindow 方法
	// require css.js

// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
// 创建内层高度、内层宽度、高度、宽度、外层高度和外层宽度方法
// 使用 jQuery.each 方法 遍历 第一参数 对象
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {

	// 使用 jQuery.each 方法 遍历 第一参数 对象
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		// 余量仅为外层高度、外层宽度
		// jQuery.fn[ funcName ] 赋值 匿名函数
		jQuery.fn[ funcName ] = function( margin, value ) {

			// 声明 chainable 赋值 arguments.length && ( defaultExtra 或者 typeof margin !== "boolean" )
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),

				// 声明 extra 赋值 defaultExtra 或者 ( margin === true 或者 value === true ? "margin" : "border" )
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			// 返回 access( this, fn, type, chainable ? margin : undefined, chainable )
			return access( this, function( elem, type, value ) {

				// 初始化 doc
				var doc;

				// 判断 isWindow( elem )
				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					// 包括滚动条（GH-1729）的外层宽度/高度返回W/H
					// 返回 funcName.indexOf( "outer" ) === 0 ? elem[ "inner" + name ] : elem.document.documentElement[ "client" + name ]
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				// 获取文档宽度或高度
				// 判断 elem.nodeType === 9
				if ( elem.nodeType === 9 ) {

					// doc 赋值 elem.documentElement
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// 要么滚动[宽度/高度]或偏移[宽度/高度]或客户端[宽度/高度]，以最大者为准
					// 返回 Math.max( elem.body[ "scroll" + name ], doc[ "scroll" + name ], elem.body[ "offset" + name ], doc[ "offset" + name ], doc[ "client" + name ])
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				// 返回 value === undefined ? jQuery.css( elem, type, extra ) : jQuery.style( elem, type, value, extra )
				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					// 在元素上获得宽度或高度，请求但不强制 parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					// 在元素上设置宽度或高度
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );

// 返回 jQuery
return jQuery;
} );
